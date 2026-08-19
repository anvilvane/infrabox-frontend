// Simple in-memory cache for DNS results
// This helps reduce DNS queries and improve performance

class DNSCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes default TTL
    this.maxSize = 1000; // Maximum cache entries
  }

  // Generate cache key
  getCacheKey(type, domain, selector = '') {
    return `${type}:${domain.toLowerCase()}${selector ? ':' + selector : ''}`;
  }

  // Get from cache
  get(type, domain, selector = '') {
    const key = this.getCacheKey(type, domain, selector);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  // Set in cache
  set(type, domain, data, selector = '', customTTL = null) {
    // Limit cache size
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entries
      const entriesToDelete = Math.floor(this.maxSize * 0.2); // Remove 20%
      const keys = Array.from(this.cache.keys()).slice(0, entriesToDelete);
      keys.forEach(key => this.cache.delete(key));
    }
    
    const key = this.getCacheKey(type, domain, selector);
    const ttl = customTTL || this.ttl;
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
      timestamp: Date.now()
    });
    
    return data;
  }

  // Clear cache
  clear() {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        expired++;
      } else {
        valid++;
      }
    }
    
    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize
    };
  }

  // Clean expired entries
  cleanExpired() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
const dnsCache = new DNSCache();

// Clean expired entries every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    dnsCache.cleanExpired();
  }, 60 * 1000);
}

module.exports = dnsCache;