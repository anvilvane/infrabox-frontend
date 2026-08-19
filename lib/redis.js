/**
 * Redis client singleton for rate limiting and caching
 */

import Redis from 'ioredis';

let redis = null;

/**
 * Get or create Redis client instance
 * @returns {Redis|null} Redis client or null if not configured
 */
export function getRedisClient() {
  // Return existing client if available
  if (redis) {
    return redis;
  }

  // Check if Redis URL is configured
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn('REDIS_URL not configured. Rate limiting will fall back to in-memory storage.');
    return null;
  }

  try {
    // Create new Redis client
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    // Handle connection events
    redis.on('connect', () => {
      console.info('Redis client connected');
    });

    redis.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    redis.on('close', () => {
      console.warn('Redis connection closed');
    });

    return redis;
  } catch (error) {
    console.error('Failed to create Redis client:', error);
    return null;
  }
}

/**
 * Close Redis connection (for cleanup)
 */
export async function closeRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
