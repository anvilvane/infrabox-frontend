// DNS utility functions with timeout handling
const dns = require('dns').promises;

// Use system default DNS servers for better compatibility
// Don't force custom DNS servers as they may not have all records
// Especially for private/local domains

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

// DNS query functions with timeout
async function resolveTxt(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolveTxt(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return [];
    }
    throw error;
  }
}

async function resolveMx(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolveMx(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return [];
    }
    throw error;
  }
}

async function resolve4(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolve4(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return [];
    }
    throw error;
  }
}

async function resolve6(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolve6(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return [];
    }
    throw error;
  }
}

async function resolveNs(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolveNs(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return [];
    }
    throw error;
  }
}

async function resolveCname(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolveCname(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return null;
    }
    throw error;
  }
}

async function resolveSoa(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolveSoa(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return null;
    }
    throw error;
  }
}

async function resolveCaa(domain, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.resolveCaa(domain), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return [];
    }
    throw error;
  }
}

async function reverse(ip, timeoutMs = 5000) {
  try {
    return await withTimeout(dns.reverse(ip), timeoutMs);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return [];
    }
    throw error;
  }
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
  withTimeout
};