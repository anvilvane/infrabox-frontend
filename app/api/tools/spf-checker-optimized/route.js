import { NextResponse } from 'next/server';

// Import optimized modules
const dnsResolver = require('../lib/dns-resolver');
const { withRateLimit } = require('../lib/rate-limiter');
const { createAsyncJob } = require('../lib/job-queue');

async function checkSPF(domain) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    // Use optimized DNS resolver with caching
    const txtRecords = await dnsResolver.resolveTxt(cleanDomain, 5000, true);
    
    let spfRecord = null;
    let spfRecords = [];
    
    // Find SPF record(s)
    for (const record of txtRecords) {
      const txtContent = Array.isArray(record) ? record.join('') : String(record);
      if (txtContent.startsWith('v=spf1')) {
        spfRecords.push(txtContent);
        if (!spfRecord) {
          spfRecord = txtContent;
        }
      }
    }
    
    if (spfRecords.length === 0) {
      return {
        domain: cleanDomain,
        exists: false,
        valid: false,
        record: null,
        cached: true,
        analysis: {
          message: 'No SPF record found'
        }
      };
    }
    
    if (spfRecords.length > 1) {
      return {
        domain: cleanDomain,
        exists: true,
        valid: false,
        record: spfRecords[0],
        cached: true,
        analysis: {
          warnings: ['Multiple SPF records found - only one SPF record is allowed per domain'],
          allRecords: spfRecords
        }
      };
    }
    
    // Analyze the SPF record
    const analysis = await analyzeSPFRecord(spfRecord, cleanDomain);
    
    return {
      domain: cleanDomain,
      exists: true,
      valid: analysis.valid,
      record: spfRecord,
      cached: true,
      analysis
    };
    
  } catch (error) {
    console.error('SPF check error:', error);
    
    if (error.message?.includes('timeout')) {
      return {
        domain,
        exists: false,
        valid: false,
        error: true,
        message: 'DNS query timeout - please try again'
      };
    }
    
    if (error.code === 'ENOTFOUND') {
      return {
        domain,
        exists: false,
        valid: false,
        error: true,
        message: 'Domain not found or DNS lookup failed'
      };
    }
    
    return {
      domain,
      exists: false,
      valid: false,
      error: true,
      message: 'Failed to check SPF record'
    };
  }
}

async function analyzeSPFRecord(record, domain) {
  const analysis = {
    valid: true,
    mechanisms: [],
    lookupCount: 0,
    warnings: [],
    policy: null
  };
  
  // Parse SPF record
  const parts = record.split(/\s+/);
  
  // Check version
  if (parts[0] !== 'v=spf1') {
    analysis.valid = false;
    analysis.warnings.push('Invalid SPF version - must start with v=spf1');
    return analysis;
  }
  
  // Prepare batch DNS lookups for includes
  const includePromises = [];
  
  // Count DNS lookups and extract mechanisms
  for (const part of parts.slice(1)) {
    if (part.startsWith('include:')) {
      analysis.mechanisms.push(part);
      analysis.lookupCount++;
      
      // Queue nested include check
      const includeDomain = part.replace('include:', '');
      includePromises.push(
        dnsResolver.resolveTxt(includeDomain, 3000, true)
          .then(records => {
            const nestedSPF = records.find(r => {
              const content = Array.isArray(r) ? r.join('') : String(r);
              return content.startsWith('v=spf1');
            });
            if (nestedSPF) {
              const content = Array.isArray(nestedSPF) ? nestedSPF.join('') : String(nestedSPF);
              return (content.match(/include:/g) || []).length;
            }
            return 0;
          })
          .catch(() => 0)
      );
    } else if (part.startsWith('a') || part.startsWith('mx')) {
      analysis.mechanisms.push(part);
      analysis.lookupCount++;
    } else if (part.startsWith('exists:') || part.startsWith('ptr')) {
      analysis.mechanisms.push(part);
      analysis.lookupCount++;
    } else if (part.startsWith('ip4:') || part.startsWith('ip6:')) {
      analysis.mechanisms.push(part);
    } else if (part === 'all' || part === '-all' || part === '~all' || part === '?all' || part === '+all') {
      analysis.policy = part;
    } else if (part.startsWith('redirect=')) {
      analysis.mechanisms.push(part);
      analysis.lookupCount++;
    }
  }
  
  // Wait for all include checks to complete (parallel execution)
  if (includePromises.length > 0) {
    const nestedCounts = await Promise.all(includePromises);
    analysis.lookupCount += nestedCounts.reduce((sum, count) => sum + count, 0);
  }
  
  // Validate and add warnings
  if (analysis.lookupCount > 10) {
    analysis.warnings.push(`SPF record exceeds 10 DNS lookups (found ${analysis.lookupCount}). This may cause SPF validation failures.`);
    analysis.valid = false;
  }
  
  if (!analysis.policy) {
    analysis.warnings.push('No all mechanism found. Consider adding ~all or -all at the end.');
  }
  
  if (analysis.policy === '+all') {
    analysis.warnings.push('Using +all allows any server to send email. This provides no protection.');
    analysis.valid = false;
  }
  
  if (record.length > 255) {
    analysis.warnings.push('SPF record exceeds 255 characters per string. Consider using multiple strings or simplifying.');
  }
  
  // Check for deprecated mechanisms
  if (record.includes('ptr')) {
    analysis.warnings.push('PTR mechanism is deprecated and should be avoided.');
  }
  
  return analysis;
}

// Bulk SPF check for multiple domains (uses job queue)
async function bulkSPFCheck(domains) {
  if (domains.length > 10) {
    // Use job queue for large batches
    const jobResult = await createAsyncJob('bulk-dns-check', {
      domains,
      checkType: 'spf'
    }, {
      priority: 1
    });
    
    return jobResult;
  }
  
  // For small batches, process immediately in parallel
  const results = await Promise.allSettled(
    domains.map(domain => checkSPF(domain))
  );
  
  return {
    results: results.map((r, i) => ({
      domain: domains[i],
      ...(r.status === 'fulfilled' ? r.value : { error: true, message: r.reason?.message })
    })),
    processedAt: Date.now()
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { domain, domains, bulk } = body;
    
    // Handle bulk requests
    if (bulk && domains && Array.isArray(domains)) {
      // Apply stricter rate limiting for bulk requests
      const rateLimitResponse = await withRateLimit(request, async () => {
        const result = await bulkSPFCheck(domains);
        return NextResponse.json(result);
      }, { type: 'bulk' });
      
      return rateLimitResponse;
    }
    
    // Single domain check with rate limiting
    if (!domain) {
      return NextResponse.json(
        { error: true, message: 'Domain is required' },
        { status: 400 }
      );
    }
    
    // Apply rate limiting
    const rateLimitResponse = await withRateLimit(request, async () => {
      const result = await checkSPF(domain);
      
      // Add resolver stats for debugging
      if (process.env.NODE_ENV === 'development') {
        result.debug = {
          resolverMethod: dnsResolver.getMethod(),
          stats: dnsResolver.getStats()
        };
      }
      
      return NextResponse.json(result);
    }, { type: 'api', domain });
    
    return rateLimitResponse;
    
  } catch (error) {
    console.error('API error:', error);
    
    // Check if it's a rate limit error
    if (error.message?.includes('Queue is full')) {
      return NextResponse.json(
        { error: true, message: 'Server is busy. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}