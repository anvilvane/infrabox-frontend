/**
 * Redis-backed rate limiter for admin login attempts
 * Tracks failed login attempts by IP and blocks after threshold
 * Falls back to in-memory storage if Redis is unavailable
 */

import { getRedisClient } from './redis';

// In-memory fallback store for failed attempts and blocked IPs
const failedAttempts = new Map();
const blockedIPs = new Map();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const BLOCK_DURATION_SECONDS = 24 * 60 * 60; // 24 hours in seconds (for Redis TTL)

// Redis key prefixes
const REDIS_PREFIX_ATTEMPTS = 'admin:login:attempts:';
const REDIS_PREFIX_BLOCKED = 'admin:login:blocked:';

/**
 * Get client IP from request
 * @param {Request} req - Next.js request object
 * @returns {string} IP address
 */
export function getClientIP(req) {
  // Check various headers for real IP (handles proxies, CDNs)
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip'); // Cloudflare

  if (forwarded) {
    // x-forwarded-for may contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  if (realIP) {
    return realIP;
  }

  // Fallback to a placeholder (in production, this should always have a value)
  return 'unknown';
}

/**
 * Check if IP is currently blocked
 * @param {string} ip - IP address to check
 * @returns {Promise<boolean>} True if blocked
 */
export async function isIPBlocked(ip) {
  const redis = getRedisClient();

  if (redis) {
    try {
      // Check Redis for block
      const blocked = await redis.get(REDIS_PREFIX_BLOCKED + ip);
      return blocked !== null;
    } catch (error) {
      console.error('Redis error in isIPBlocked:', error);
      // Fall through to in-memory check
    }
  }

  // In-memory fallback
  const blockData = blockedIPs.get(ip);

  if (!blockData) {
    return false;
  }

  // Check if block has expired
  if (Date.now() > blockData.expiresAt) {
    // Block expired, remove it
    blockedIPs.delete(ip);
    failedAttempts.delete(ip);
    return false;
  }

  return true;
}

/**
 * Get time remaining for IP block in human-readable format
 * @param {string} ip - IP address
 * @returns {Promise<string|null>} Time remaining or null if not blocked
 */
export async function getBlockTimeRemaining(ip) {
  const redis = getRedisClient();

  if (redis) {
    try {
      // Get TTL from Redis (in seconds)
      const ttl = await redis.ttl(REDIS_PREFIX_BLOCKED + ip);

      if (ttl <= 0) {
        return null;
      }

      const remainingMs = ttl * 1000;
      const hours = Math.floor(remainingMs / (60 * 60 * 1000));
      const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }

      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } catch (error) {
      console.error('Redis error in getBlockTimeRemaining:', error);
      // Fall through to in-memory check
    }
  }

  // In-memory fallback
  const blockData = blockedIPs.get(ip);

  if (!blockData) {
    return null;
  }

  const remainingMs = blockData.expiresAt - Date.now();

  if (remainingMs <= 0) {
    return null;
  }

  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

/**
 * Record a failed login attempt
 * @param {string} ip - IP address
 * @returns {Promise<Object>} Status with blocked flag and attempts remaining
 */
export async function recordFailedAttempt(ip) {
  const redis = getRedisClient();

  if (redis) {
    try {
      const attemptsKey = REDIS_PREFIX_ATTEMPTS + ip;
      const blockedKey = REDIS_PREFIX_BLOCKED + ip;

      // Increment attempt count (with 1 hour expiry if first attempt)
      const attempts = await redis.incr(attemptsKey);

      // Set expiry on first attempt (prevents stale data)
      if (attempts === 1) {
        await redis.expire(attemptsKey, 60 * 60); // 1 hour
      }

      // Check if threshold exceeded
      if (attempts >= MAX_ATTEMPTS) {
        // Block the IP for 24 hours
        await redis.setex(blockedKey, BLOCK_DURATION_SECONDS, Date.now().toString());

        // Clear attempt counter
        await redis.del(attemptsKey);

        console.warn(`IP ${ip} blocked after ${attempts} failed attempts. Block expires in 24 hours.`);

        return {
          blocked: true,
          attemptsRemaining: 0,
          blockDuration: BLOCK_DURATION,
        };
      }

      const attemptsRemaining = MAX_ATTEMPTS - attempts;

      console.warn(`Failed login attempt from IP ${ip}. Attempts remaining: ${attemptsRemaining}`);

      return {
        blocked: false,
        attemptsRemaining,
        attempts,
      };
    } catch (error) {
      console.error('Redis error in recordFailedAttempt:', error);
      // Fall through to in-memory fallback
    }
  }

  // In-memory fallback
  const attemptData = failedAttempts.get(ip) || { count: 0, firstAttempt: Date.now() };

  // Increment attempt count
  attemptData.count += 1;
  attemptData.lastAttempt = Date.now();

  failedAttempts.set(ip, attemptData);

  // Check if threshold exceeded
  if (attemptData.count >= MAX_ATTEMPTS) {
    const expiresAt = Date.now() + BLOCK_DURATION;
    blockedIPs.set(ip, { expiresAt, blockedAt: Date.now() });

    console.warn(`IP ${ip} blocked after ${attemptData.count} failed attempts. Block expires at ${new Date(expiresAt).toISOString()}`);

    return {
      blocked: true,
      attemptsRemaining: 0,
      blockDuration: BLOCK_DURATION,
    };
  }

  const attemptsRemaining = MAX_ATTEMPTS - attemptData.count;

  console.warn(`Failed login attempt from IP ${ip}. Attempts remaining: ${attemptsRemaining}`);

  return {
    blocked: false,
    attemptsRemaining,
    attempts: attemptData.count,
  };
}

/**
 * Clear failed attempts for an IP (called on successful login)
 * @param {string} ip - IP address
 */
export async function clearFailedAttempts(ip) {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.del(REDIS_PREFIX_ATTEMPTS + ip);
      return;
    } catch (error) {
      console.error('Redis error in clearFailedAttempts:', error);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  failedAttempts.delete(ip);
}

/**
 * Get failed attempt count for an IP
 * @param {string} ip - IP address
 * @returns {Promise<number>} Number of failed attempts
 */
export async function getFailedAttemptCount(ip) {
  const redis = getRedisClient();

  if (redis) {
    try {
      const attempts = await redis.get(REDIS_PREFIX_ATTEMPTS + ip);
      return attempts ? parseInt(attempts, 10) : 0;
    } catch (error) {
      console.error('Redis error in getFailedAttemptCount:', error);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const attemptData = failedAttempts.get(ip);
  return attemptData ? attemptData.count : 0;
}

/**
 * Manually unblock an IP (for admin use if needed)
 * @param {string} ip - IP address
 */
export async function unblockIP(ip) {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.del(REDIS_PREFIX_BLOCKED + ip);
      await redis.del(REDIS_PREFIX_ATTEMPTS + ip);
      console.info(`IP ${ip} manually unblocked`);
      return;
    } catch (error) {
      console.error('Redis error in unblockIP:', error);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  blockedIPs.delete(ip);
  failedAttempts.delete(ip);
  console.info(`IP ${ip} manually unblocked`);
}

// Cleanup expired blocks every hour (only for in-memory fallback)
setInterval(() => {
  const now = Date.now();

  // Clean up expired blocks (in-memory only, Redis handles its own expiry)
  for (const [ip, blockData] of blockedIPs.entries()) {
    if (now > blockData.expiresAt) {
      blockedIPs.delete(ip);
      failedAttempts.delete(ip);
      console.info(`Expired block removed for IP ${ip}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour
