// DNS-over-HTTPS implementation for Edge Runtime compatibility
// Uses Cloudflare and Google DNS-over-HTTPS endpoints

const cache = require('./cache');

// DNS-over-HTTPS providers
const DOH_PROVIDERS = {
  cloudflare: 'https://cloudflare-dns.com/dns-query',
  google: 'https://dns.google/resolve',
  quad9: 'https://dns.quad9.net/dns-query'
};

// Helper to make DoH request
async function queryDoH(domain, type, provider = 'cloudflare', timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const url = provider === 'google' 
      ? `${DOH_PROVIDERS.google}?name=${encodeURIComponent(domain)}&type=${type}`
      : `${DOH_PROVIDERS.cloudflare}?name=${encodeURIComponent(domain)}&type=${type}&ct=application/dns-json`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/dns-json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`DoH query failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`DoH query timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// Parse DoH response based on record type
function parseDoHResponse(data, type) {
  if (!data || data.Status !== 0 || !data.Answer) {
    return null;
  }
  
  switch (type) {
    case 'TXT':
      return data.Answer
        .filter(a => a.type === 16) // TXT record type
        .map(a => {
          // Remove quotes and split on space for multi-part TXT records
          const txt = a.data.replace(/^"|"$/g, '');
          return [txt]; // Return as array to match dns.resolveTxt format
        });
    
    case 'MX':
      return data.Answer
        .filter(a => a.type === 15) // MX record type
        .map(a => {
          const parts = a.data.split(' ');
          return {
            priority: parseInt(parts[0]),
            exchange: parts[1]?.replace(/\.$/, '') || ''
          };
        })
        .sort((a, b) => a.priority - b.priority);
    
    case 'A':
      return data.Answer
        .filter(a => a.type === 1) // A record type
        .map(a => a.data);
    
    case 'AAAA':
      return data.Answer
        .filter(a => a.type === 28) // AAAA record type
        .map(a => a.data);
    
    case 'NS':
      return data.Answer
        .filter(a => a.type === 2) // NS record type
        .map(a => a.data.replace(/\.$/, ''));
    
    case 'CNAME': {
      const cname = data.Answer.find(a => a.type === 5); // CNAME record type
      return cname ? cname.data.replace(/\.$/, '') : null;
    }
    
    case 'SOA': {
      const soa = data.Answer.find(a => a.type === 6); // SOA record type
      if (!soa) return null;
      const parts = soa.data.split(' ');
      return {
        nsname: parts[0]?.replace(/\.$/, ''),
        hostmaster: parts[1]?.replace(/\.$/, ''),
        serial: parseInt(parts[2]),
        refresh: parseInt(parts[3]),
        retry: parseInt(parts[4]),
        expire: parseInt(parts[5]),
        minttl: parseInt(parts[6])
      };
    }
    
    case 'CAA':
      return data.Answer
        .filter(a => a.type === 257) // CAA record type
        .map(a => {
          const match = a.data.match(/(\d+)\s+(\w+)\s+"(.+)"/);
          if (!match) return null;
          return {
            flags: parseInt(match[1]),
            tag: match[2],
            value: match[3]
          };
        })
        .filter(Boolean);
    
    default:
      return data.Answer.map(a => a.data);
  }
}

// DNS resolution functions using DoH
async function resolveTxtDoH(domain, timeout = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('txt', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const data = await queryDoH(domain, 'TXT', 'cloudflare', timeout);
    const result = parseDoHResponse(data, 'TXT') || [];
    
    if (useCache) {
      cache.set('txt', domain, result);
    }
    return result;
  } catch (error) {
    // Try fallback provider
    try {
      const data = await queryDoH(domain, 'TXT', 'google', timeout);
      const result = parseDoHResponse(data, 'TXT') || [];
      
      if (useCache) {
        cache.set('txt', domain, result);
      }
      return result;
    } catch (fallbackError) {
      if (useCache) {
        cache.set('txt', domain, [], '', 60000); // Cache negative result
      }
      return [];
    }
  }
}

async function resolveMxDoH(domain, timeout = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('mx', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const data = await queryDoH(domain, 'MX', 'cloudflare', timeout);
    const result = parseDoHResponse(data, 'MX') || [];
    
    if (useCache) {
      cache.set('mx', domain, result);
    }
    return result;
  } catch (error) {
    try {
      const data = await queryDoH(domain, 'MX', 'google', timeout);
      const result = parseDoHResponse(data, 'MX') || [];
      
      if (useCache) {
        cache.set('mx', domain, result);
      }
      return result;
    } catch (fallbackError) {
      if (useCache) {
        cache.set('mx', domain, [], '', 60000);
      }
      return [];
    }
  }
}

async function resolve4DoH(domain, timeout = 5000, useCache = true) {
  if (useCache) {
    const cached = cache.get('a', domain);
    if (cached !== null) return cached;
  }
  
  try {
    const data = await queryDoH(domain, 'A', 'cloudflare', timeout);
    const result = parseDoHResponse(data, 'A') || [];
    
    if (useCache) {
      cache.set('a', domain, result);
    }
    return result;
  } catch (error) {
    try {
      const data = await queryDoH(domain, 'A', 'google', timeout);
      const result = parseDoHResponse(data, 'A') || [];
      
      if (useCache) {
        cache.set('a', domain, result);
      }
      return result;
    } catch (fallbackError) {
      if (useCache) {
        cache.set('a', domain, [], '', 60000);
      }
      return [];
    }
  }
}

// Check multiple records in parallel using DoH
async function checkEmailRecordsDoH(domain) {
  const [spf, dmarc, mx, dkimGoogle, dkimDefault] = await Promise.allSettled([
    resolveTxtDoH(domain),
    resolveTxtDoH(`_dmarc.${domain}`),
    resolveMxDoH(domain),
    resolveTxtDoH(`google._domainkey.${domain}`),
    resolveTxtDoH(`default._domainkey.${domain}`)
  ]);
  
  return {
    spf: spf.status === 'fulfilled' ? spf.value : null,
    dmarc: dmarc.status === 'fulfilled' ? dmarc.value : null,
    mx: mx.status === 'fulfilled' ? mx.value : null,
    dkim: {
      google: dkimGoogle.status === 'fulfilled' ? dkimGoogle.value : null,
      default: dkimDefault.status === 'fulfilled' ? dkimDefault.value : null
    }
  };
}

// Export all functions
module.exports = {
  queryDoH,
  resolveTxtDoH,
  resolveMxDoH,
  resolve4DoH,
  checkEmailRecordsDoH,
  
  // Aliases for compatibility
  resolveTxt: resolveTxtDoH,
  resolveMx: resolveMxDoH,
  resolve4: resolve4DoH,
  checkEmailRecords: checkEmailRecordsDoH
};