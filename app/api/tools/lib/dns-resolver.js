// Unified DNS resolver that automatically chooses the best method
// Falls back gracefully between native DNS, cached DNS, and DNS-over-HTTPS

let dnsMethod = null;
let dnsModule = null;

// Detect runtime and choose appropriate DNS method
function detectDNSMethod() {
  if (dnsMethod) return dnsMethod;
  
  try {
    // Try to load native DNS module
    require('dns');
    dnsMethod = 'native';
    dnsModule = require('./dns-utils-cached');
    console.log('Using native DNS with caching');
  } catch (error) {
    // Native DNS not available (Edge Runtime)
    dnsMethod = 'doh';
    dnsModule = require('./dns-over-https');
    console.log('Using DNS-over-HTTPS (Edge Runtime)');
  }
  
  return dnsMethod;
}

// Initialize on first use
detectDNSMethod();

// Unified resolver with automatic fallback
class UnifiedDNSResolver {
  constructor() {
    this.method = dnsMethod;
    this.stats = {
      queries: 0,
      cacheHits: 0,
      failures: 0,
      fallbacks: 0
    };
  }
  
  // Resolve TXT records
  async resolveTxt(domain, timeout = 5000, useCache = true) {
    this.stats.queries++;
    
    try {
      return await dnsModule.resolveTxt(domain, timeout, useCache);
    } catch (error) {
      this.stats.failures++;
      
      // Try fallback if native DNS fails
      if (this.method === 'native') {
        this.stats.fallbacks++;
        try {
          const dohModule = require('./dns-over-https');
          return await dohModule.resolveTxt(domain, timeout, useCache);
        } catch (fallbackError) {
          throw error; // Throw original error
        }
      }
      
      throw error;
    }
  }
  
  // Resolve MX records
  async resolveMx(domain, timeout = 5000, useCache = true) {
    this.stats.queries++;
    
    try {
      return await dnsModule.resolveMx(domain, timeout, useCache);
    } catch (error) {
      this.stats.failures++;
      
      if (this.method === 'native') {
        this.stats.fallbacks++;
        try {
          const dohModule = require('./dns-over-https');
          return await dohModule.resolveMx(domain, timeout, useCache);
        } catch (fallbackError) {
          throw error;
        }
      }
      
      throw error;
    }
  }
  
  // Resolve A records
  async resolve4(domain, timeout = 5000, useCache = true) {
    this.stats.queries++;
    
    try {
      return await dnsModule.resolve4(domain, timeout, useCache);
    } catch (error) {
      this.stats.failures++;
      
      if (this.method === 'native') {
        this.stats.fallbacks++;
        try {
          const dohModule = require('./dns-over-https');
          return await dohModule.resolve4(domain, timeout, useCache);
        } catch (fallbackError) {
          throw error;
        }
      }
      
      throw error;
    }
  }
  
  // Check all email records in parallel
  async checkEmailRecords(domain) {
    this.stats.queries++;
    
    try {
      if (dnsModule.checkEmailRecords) {
        return await dnsModule.checkEmailRecords(domain);
      }
      
      // Manual parallel check if not available
      const [spf, dmarc, mx] = await Promise.allSettled([
        this.resolveTxt(domain),
        this.resolveTxt(`_dmarc.${domain}`),
        this.resolveMx(domain)
      ]);
      
      return {
        spf: spf.status === 'fulfilled' ? spf.value : null,
        dmarc: dmarc.status === 'fulfilled' ? dmarc.value : null,
        mx: mx.status === 'fulfilled' ? mx.value : null
      };
    } catch (error) {
      this.stats.failures++;
      throw error;
    }
  }
  
  // Check multiple DKIM selectors efficiently
  async checkDKIMSelectors(domain, selectors) {
    const batchSize = 5;
    const results = {};
    
    for (let i = 0; i < selectors.length; i += batchSize) {
      const batch = selectors.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(selector => 
          this.resolveTxt(`${selector}._domainkey.${domain}`, 3000)
        )
      );
      
      batch.forEach((selector, index) => {
        if (batchResults[index].status === 'fulfilled') {
          const records = batchResults[index].value;
          if (records && records.length > 0) {
            const record = records.map(r => r.join ? r.join('') : r).join('');
            if (record.includes('p=')) {
              results[selector] = record;
            }
          }
        }
      });
      
      // Early exit if we found enough records
      if (Object.keys(results).length >= 2) {
        break;
      }
    }
    
    return results;
  }
  
  // Get resolver statistics
  getStats() {
    return {
      method: this.method,
      ...this.stats,
      cacheStats: dnsModule.cache ? dnsModule.cache.getStats() : null
    };
  }
  
  // Clear cache
  clearCache() {
    if (dnsModule.cache) {
      dnsModule.cache.clear();
    }
  }
}

// Create singleton instance
const resolver = new UnifiedDNSResolver();

// Export both the resolver and individual functions for compatibility
module.exports = {
  // Main resolver instance
  resolver,
  
  // Individual functions that use the resolver
  resolveTxt: (domain, timeout, useCache) => resolver.resolveTxt(domain, timeout, useCache),
  resolveMx: (domain, timeout, useCache) => resolver.resolveMx(domain, timeout, useCache),
  resolve4: (domain, timeout, useCache) => resolver.resolve4(domain, timeout, useCache),
  checkEmailRecords: (domain) => resolver.checkEmailRecords(domain),
  checkDKIMSelectors: (domain, selectors) => resolver.checkDKIMSelectors(domain, selectors),
  
  // Additional exports
  resolveNs: dnsModule.resolveNs,
  resolveCname: dnsModule.resolveCname,
  resolveSoa: dnsModule.resolveSoa,
  resolveCaa: dnsModule.resolveCaa,
  resolve6: dnsModule.resolve6,
  reverse: dnsModule.reverse,
  withTimeout: dnsModule.withTimeout,
  
  // Utility functions
  getStats: () => resolver.getStats(),
  clearCache: () => resolver.clearCache(),
  getMethod: () => dnsMethod
};