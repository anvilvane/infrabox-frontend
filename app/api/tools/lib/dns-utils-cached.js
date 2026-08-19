// Enhanced DNS utility functions with caching and parallel execution
const dns = require('dns').promises;
const cache = require('./cache');

// Helper function to add timeout to DNS queries
async function withTimeout(promise, timeoutMs = 5000) {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('DNS query timeout')), timeoutMs)
  );
  
  try {
    return await Promise.race([promise, timeout]);
  } catch (error) {
    if (error.message === 'DNS query timeout') {
      throw new Error(`DNS query timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// DNS query functions with caching
async function resolveTxt(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('txt', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolveTxt(domain), timeoutMs);
    if (useCache) {
      cache.set('txt', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      const emptyResult = [];
      if (useCache) {
        cache.set('txt', domain, emptyResult, '', 60000); // Cache negative results for 1 minute
      }
      return emptyResult;
    }
    throw error;
  }
}

async function resolveMx(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('mx', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolveMx(domain), timeoutMs);
    if (useCache) {
      cache.set('mx', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      const emptyResult = [];
      if (useCache) {
        cache.set('mx', domain, emptyResult, '', 60000);
      }
      return emptyResult;
    }
    throw error;
  }
}

async function resolve4(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('a', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolve4(domain), timeoutMs);
    if (useCache) {
      cache.set('a', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      const emptyResult = [];
      if (useCache) {
        cache.set('a', domain, emptyResult, '', 60000);
      }
      return emptyResult;
    }
    throw error;
  }
}

async function resolve6(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('aaaa', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolve6(domain), timeoutMs);
    if (useCache) {
      cache.set('aaaa', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      const emptyResult = [];
      if (useCache) {
        cache.set('aaaa', domain, emptyResult, '', 60000);
      }
      return emptyResult;
    }
    throw error;
  }
}

async function resolveNs(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('ns', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolveNs(domain), timeoutMs);
    if (useCache) {
      cache.set('ns', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      const emptyResult = [];
      if (useCache) {
        cache.set('ns', domain, emptyResult, '', 60000);
      }
      return emptyResult;
    }
    throw error;
  }
}

async function resolveCname(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('cname', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolveCname(domain), timeoutMs);
    if (useCache) {
      cache.set('cname', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      if (useCache) {
        cache.set('cname', domain, null, '', 60000);
      }
      return null;
    }
    throw error;
  }
}

async function resolveSoa(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('soa', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolveSoa(domain), timeoutMs);
    if (useCache) {
      cache.set('soa', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      if (useCache) {
        cache.set('soa', domain, null, '', 60000);
      }
      return null;
    }
    throw error;
  }
}

async function resolveCaa(domain, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('caa', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.resolveCaa(domain), timeoutMs);
    if (useCache) {
      cache.set('caa', domain, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      const emptyResult = [];
      if (useCache) {
        cache.set('caa', domain, emptyResult, '', 60000);
      }
      return emptyResult;
    }
    throw error;
  }
}

async function reverse(ip, timeoutMs = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('ptr', ip);
    if (cached !== null) return cached;
  }
  
  try {
    const result = await withTimeout(dns.reverse(ip), timeoutMs);
    if (useCache) {
      cache.set('ptr', ip, result);
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      const emptyResult = [];
      if (useCache) {
        cache.set('ptr', ip, emptyResult, '', 60000);
      }
      return emptyResult;
    }
    throw error;
  }
}

// Parallel query helpers
async function resolveMultiple(queries) {
  // Execute multiple DNS queries in parallel
  return Promise.allSettled(queries.map(async (query) => {
    const { type, domain, timeout = 5000 } = query;
    
    switch (type) {
      case 'txt':
        return { type, domain, result: await resolveTxt(domain, timeout) };
      case 'mx':
        return { type, domain, result: await resolveMx(domain, timeout) };
      case 'a':
        return { type, domain, result: await resolve4(domain, timeout) };
      case 'aaaa':
        return { type, domain, result: await resolve6(domain, timeout) };
      case 'ns':
        return { type, domain, result: await resolveNs(domain, timeout) };
      case 'cname':
        return { type, domain, result: await resolveCname(domain, timeout) };
      case 'soa':
        return { type, domain, result: await resolveSoa(domain, timeout) };
      case 'caa':
        return { type, domain, result: await resolveCaa(domain, timeout) };
      default:
        throw new Error(`Unknown query type: ${type}`);
    }
  }));
}

// Check all email authentication records in parallel
async function checkEmailRecords(domain) {
  const queries = [
    { type: 'txt', domain }, // SPF
    { type: 'txt', domain: `_dmarc.${domain}` }, // DMARC
    { type: 'mx', domain }, // MX
    // Common DKIM selectors
    { type: 'txt', domain: `google._domainkey.${domain}` },
    { type: 'txt', domain: `default._domainkey.${domain}` },
    { type: 'txt', domain: `selector1._domainkey.${domain}` },
  ];
  
  const results = await resolveMultiple(queries);
  
  return {
    spf: results[0].status === 'fulfilled' ? results[0].value.result : null,
    dmarc: results[1].status === 'fulfilled' ? results[1].value.result : null,
    mx: results[2].status === 'fulfilled' ? results[2].value.result : null,
    dkim: {
      google: results[3].status === 'fulfilled' ? results[3].value.result : null,
      default: results[4].status === 'fulfilled' ? results[4].value.result : null,
      selector1: results[5].status === 'fulfilled' ? results[5].value.result : null,
    }
  };
}

module.exports = {
  resolveTxt,
  resolveMx,
  resolve4,
  resolve6,
  resolveNs,
  resolveCname,
  resolveSoa,
  resolveCaa,
  reverse,
  withTimeout,
  resolveMultiple,
  checkEmailRecords,
  cache // Export cache for stats/management
};