// Rate limiter for API endpoints
// Prevents abuse and ensures fair usage

class RateLimiter {
  constructor(options = {}) {
    this.requests = new Map(); // Store request counts
    this.blocked = new Map(); // Store blocked IPs
    
    // Configuration
    this.config = {
      windowMs: options.windowMs || 60 * 1000, // 1 minute window
      maxRequests: options.maxRequests || 100, // Max requests per window
      maxRequestsPerDomain: options.maxRequestsPerDomain || 20, // Max requests per domain per window
      blockDurationMs: options.blockDurationMs || 5 * 60 * 1000, // 5 minutes block
      cleanupIntervalMs: options.cleanupIntervalMs || 60 * 1000, // Cleanup every minute
      ...options
    };
    
    // Start cleanup interval
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), this.config.cleanupIntervalMs);
    }
  }
  
  // Get client identifier (IP address from request)
  getClientId(request) {
    // Try to get real IP from headers (for proxied requests)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    
    return cfIp || realIp || forwarded?.split(',')[0] || 'unknown';
  }
  
  // Generate key for tracking
  getKey(clientId, domain = null) {
    return domain ? `${clientId}:${domain.toLowerCase()}` : clientId;
  }
  
  // Check if request is allowed
  async checkLimit(request, domain = null) {
    const clientId = this.getClientId(request);
    const now = Date.now();
    
    // Check if client is blocked
    if (this.isBlocked(clientId)) {
      return {
        allowed: false,
        reason: 'Client is temporarily blocked due to rate limit violations',
        retryAfter: this.getBlockedUntil(clientId) - now
      };
    }
    
    // Check global rate limit
    const globalKey = this.getKey(clientId);
    const globalLimit = this.checkAndUpdateLimit(globalKey, now);
    
    if (!globalLimit.allowed) {
      this.block(clientId);
      return {
        allowed: false,
        reason: 'Too many requests. Please try again later.',
        limit: this.config.maxRequests,
        remaining: 0,
        resetAt: globalLimit.resetAt
      };
    }
    
    // Check per-domain rate limit if domain provided
    if (domain) {
      const domainKey = this.getKey(clientId, domain);
      const domainLimit = this.checkAndUpdateLimit(domainKey, now, true);
      
      if (!domainLimit.allowed) {
        return {
          allowed: false,
          reason: `Too many requests for domain ${domain}. Please try again later.`,
          limit: this.config.maxRequestsPerDomain,
          remaining: 0,
          resetAt: domainLimit.resetAt
        };
      }
      
      return {
        allowed: true,
        limit: this.config.maxRequestsPerDomain,
        remaining: domainLimit.remaining,
        resetAt: domainLimit.resetAt
      };
    }
    
    return {
      allowed: true,
      limit: this.config.maxRequests,
      remaining: globalLimit.remaining,
      resetAt: globalLimit.resetAt
    };
  }
  
  // Check and update request count
  checkAndUpdateLimit(key, now, isDomain = false) {
    const limit = isDomain ? this.config.maxRequestsPerDomain : this.config.maxRequests;
    
    let record = this.requests.get(key);
    
    // Initialize or reset if window expired
    if (!record || now - record.windowStart > this.config.windowMs) {
      record = {
        count: 0,
        windowStart: now,
        resetAt: now + this.config.windowMs
      };
      this.requests.set(key, record);
    }
    
    // Check if limit exceeded
    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.resetAt
      };
    }
    
    // Increment count
    record.count++;
    
    return {
      allowed: true,
      remaining: limit - record.count,
      resetAt: record.resetAt
    };
  }
  
  // Block a client
  block(clientId) {
    const until = Date.now() + this.config.blockDurationMs;
    this.blocked.set(clientId, until);
  }
  
  // Check if client is blocked
  isBlocked(clientId) {
    const blockedUntil = this.blocked.get(clientId);
    if (!blockedUntil) return false;
    
    const now = Date.now();
    if (now > blockedUntil) {
      this.blocked.delete(clientId);
      return false;
    }
    
    return true;
  }
  
  // Get blocked until timestamp
  getBlockedUntil(clientId) {
    return this.blocked.get(clientId) || 0;
  }
  
  // Clean up old records
  cleanup() {
    const now = Date.now();
    
    // Clean up expired request windows
    for (const [key, record] of this.requests.entries()) {
      if (now - record.windowStart > this.config.windowMs * 2) {
        this.requests.delete(key);
      }
    }
    
    // Clean up expired blocks
    for (const [clientId, blockedUntil] of this.blocked.entries()) {
      if (now > blockedUntil) {
        this.blocked.delete(clientId);
      }
    }
  }
  
  // Get statistics
  getStats() {
    return {
      activeClients: this.requests.size,
      blockedClients: this.blocked.size,
      totalRequests: Array.from(this.requests.values()).reduce((sum, r) => sum + r.count, 0)
    };
  }
  
  // Reset all limits
  reset() {
    this.requests.clear();
    this.blocked.clear();
  }
  
  // Destroy (cleanup interval)
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Create singleton instances for different use cases
const rateLimiters = {
  // Standard API rate limiter
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    maxRequestsPerDomain: 20 // 20 requests per domain per minute
  }),
  
  // Heavy operations rate limiter (blacklist checks, etc.)
  heavy: new RateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10, // 10 heavy requests per 5 minutes
    maxRequestsPerDomain: 3 // 3 requests per domain per 5 minutes
  }),
  
  // Bulk operations rate limiter
  bulk: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100, // 100 bulk requests per hour
    maxRequestsPerDomain: 10 // 10 requests per domain per hour
  })
};

// Middleware helper for Next.js API routes
async function withRateLimit(request, handler, options = {}) {
  const limiter = rateLimiters[options.type || 'api'];
  const domain = options.domain || (await request.json()).domain;
  
  const limitResult = await limiter.checkLimit(request, domain);
  
  if (!limitResult.allowed) {
    return new Response(JSON.stringify({
      error: true,
      message: limitResult.reason,
      retryAfter: limitResult.retryAfter
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(limitResult.limit || 0),
        'X-RateLimit-Remaining': String(limitResult.remaining || 0),
        'X-RateLimit-Reset': String(limitResult.resetAt || Date.now()),
        'Retry-After': String(Math.ceil((limitResult.retryAfter || 0) / 1000))
      }
    });
  }
  
  // Add rate limit headers to response
  const response = await handler(request);
  
  // Clone response to add headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('X-RateLimit-Limit', String(limitResult.limit));
  newResponse.headers.set('X-RateLimit-Remaining', String(limitResult.remaining));
  newResponse.headers.set('X-RateLimit-Reset', String(limitResult.resetAt));
  
  return newResponse;
}

module.exports = {
  RateLimiter,
  rateLimiters,
  withRateLimit
};