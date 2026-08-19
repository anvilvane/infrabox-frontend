import { NextResponse } from 'next/server';

// Force Node.js runtime for DNS operations

const dnsUtils = require('../../tools/lib/dns-utils');

// Common DKIM selectors to check
const COMMON_DKIM_SELECTORS = [
  // Google selectors
  'google', // Check main Google selector first
  '20230601', '20221208', '20210112', '20161025',
  '20240101', '20240601', '20231201',
  
  // Generic selectors  
  'default', 'selector1', 'selector2',
  'dkim', 'mail', 'email',
  
  // Email service providers
  'k1', 'k2', 'k3', // Mailchimp
  's1', 's2', 'sendgrid', 's1024', 's2048', // SendGrid
  'mailgun', 'mg', 'mg1', 'mg2', // Mailgun
  'mandrill', 'postmark', 'sparkpost',
  'amazonses', 'aws', 'ses',
  'zoho', 'microsoft', 'outlook'
];

// Major blacklists to check
const BLACKLISTS = [
  'zen.spamhaus.org',
  'bl.spamcop.net',
  'b.barracudacentral.org',
  'dnsbl.sorbs.net',
  'spam.dnsbl.sorbs.net',
  'dul.dnsbl.sorbs.net',
  'psbl.surriel.com',
  'ubl.unsubscore.com',
  'rbl.interserver.net',
  'black.uribl.com',
  'grey.uribl.com',
  'multi.uribl.com',
  'cbl.abuseat.org',
  'dnsbl-1.uceprotect.net',
  'dnsbl-2.uceprotect.net',
  'dnsbl-3.uceprotect.net',
  'db.wpbl.info'
];

// DNS queries now use dnsUtils which has built-in timeout handling

// Check SPF record
async function checkSPF(domain) {
  try {
    const records = await dnsUtils.resolveTxt(domain, 5000);
    const spfRecords = records
      .map(record => record.join(''))
      .filter(record => record.startsWith('v=spf1'));
    
    if (spfRecords.length === 0) {
      return { exists: false, record: null, valid: false, issues: ['No SPF record found'] };
    }
    
    if (spfRecords.length > 1) {
      return { 
        exists: true, 
        record: spfRecords[0], 
        valid: false, 
        issues: ['Multiple SPF records found - only one is allowed'] 
      };
    }
    
    const spfRecord = spfRecords[0];
    const issues = [];
    
    // Basic SPF validation
    if (!spfRecord.endsWith('~all') && !spfRecord.endsWith('-all') && !spfRecord.endsWith('?all')) {
      issues.push('SPF record should end with ~all or -all');
    }
    
    // Count DNS lookups (simplified check)
    const lookupMechanisms = (spfRecord.match(/\b(include:|a:|mx:|ptr:|exists:|redirect=)/g) || []).length;
    if (lookupMechanisms > 10) {
      issues.push(`Too many DNS lookups (${lookupMechanisms}/10 max)`);
    }
    
    return {
      exists: true,
      record: spfRecord,
      valid: issues.length === 0,
      issues
    };
  } catch (error) {
    return { exists: false, record: null, valid: false, issues: [error.message] };
  }
}

// Check DKIM records for common selectors with batching
async function checkDKIM(domain) {
  const results = {};
  const batchSize = 5;
  
  // Process selectors in batches to avoid overwhelming DNS
  for (let i = 0; i < COMMON_DKIM_SELECTORS.length; i += batchSize) {
    const batch = COMMON_DKIM_SELECTORS.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (selector) => {
      const dkimDomain = `${selector}._domainkey.${domain}`;
      try {
        const records = await dnsUtils.resolveTxt(dkimDomain, 5000);
        const dkimRecord = records.map(r => r.join('')).find(r => r.includes('k=') || r.includes('p='));
        
        if (dkimRecord) {
          // Check if the public key is present and not empty
          const hasValidKey = dkimRecord.includes('p=') && 
                             !dkimRecord.match(/p=\s*;/) && 
                             !dkimRecord.match(/p=\s*$/);
          
          results[selector] = {
            exists: true,
            record: dkimRecord.length > 100 ? dkimRecord.substring(0, 100) + '...' : dkimRecord,
            valid: hasValidKey
          };
        }
      } catch (error) {
        // Ignore errors for non-existent selectors
      }
    });
    
    await Promise.all(batchPromises);
    
    // Stop early if we found valid DKIM records
    if (Object.keys(results).length >= 2) {
      break;
    }
  }
  
  const foundSelectors = Object.keys(results);
  return {
    exists: foundSelectors.length > 0,
    selectors: results,
    foundCount: foundSelectors.length,
    foundSelectors
  };
}

// Check DMARC record
async function checkDMARC(domain) {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const records = await dnsUtils.resolveTxt(dmarcDomain, 5000);
    const dmarcRecords = records
      .map(record => record.join(''))
      .filter(record => record.startsWith('v=DMARC1'));
    
    if (dmarcRecords.length === 0) {
      return { exists: false, record: null, policy: null, issues: ['No DMARC record found'] };
    }
    
    const dmarcRecord = dmarcRecords[0];
    const issues = [];
    
    // Parse DMARC policy
    const policyMatch = dmarcRecord.match(/p=([^;]+)/);
    const policy = policyMatch ? policyMatch[1] : null;
    
    const spPolicyMatch = dmarcRecord.match(/sp=([^;]+)/);
    const subdomainPolicy = spPolicyMatch ? spPolicyMatch[1] : policy;
    
    // Validate DMARC
    if (!policy) {
      issues.push('No policy (p=) specified');
    } else if (policy === 'none') {
      issues.push('Policy is set to "none" - consider "quarantine" or "reject"');
    }
    
    if (!dmarcRecord.includes('rua=')) {
      issues.push('No aggregate report address (rua=) specified');
    }
    
    return {
      exists: true,
      record: dmarcRecord,
      policy,
      subdomainPolicy,
      valid: issues.length === 0,
      issues
    };
  } catch (error) {
    return { exists: false, record: null, policy: null, issues: [error.message] };
  }
}

// Check MX records with retry logic
async function checkMX(domain) {
  // Try up to 3 times with increasing timeouts
  const attempts = [5000, 8000, 10000];
  let lastError = null;
  
  for (const timeout of attempts) {
    try {
      const mxRecords = await dnsUtils.resolveMx(domain, timeout);
      
      if (!mxRecords || mxRecords.length === 0) {
        // No MX records found (but query succeeded)
        return { 
          exists: false, 
          records: [], 
          provider: null,
          message: 'No MX records configured'
        };
      }
      
      // Sort by priority
      mxRecords.sort((a, b) => a.priority - b.priority);
      
      // Detect provider
      const mxString = JSON.stringify(mxRecords).toLowerCase();
      let provider = 'generic';
      
      if (mxString.includes('google') || mxString.includes('aspmx') || mxString.includes('smtp.google')) {
        provider = 'google';
      } else if (mxString.includes('outlook') || mxString.includes('microsoft')) {
        provider = 'microsoft';
      } else if (mxString.includes('zoho')) {
        provider = 'zoho';
      } else if (mxString.includes('protonmail')) {
        provider = 'protonmail';
      }
      
      return {
        exists: true,
        records: mxRecords.map(mx => ({
          exchange: mx.exchange || '',
          priority: mx.priority || 0
        })),
        count: mxRecords.length,
        provider
      };
    } catch (error) {
      lastError = error;
      // If it's a timeout, try again with longer timeout
      if (error.message.includes('timeout')) {
        continue;
      }
      // For other errors, break immediately
      break;
    }
  }
  
  // All attempts failed
  return { 
    exists: false, 
    records: [], 
    provider: null, 
    error: lastError?.message || 'Failed to resolve MX records',
    retriesExhausted: true
  };
}

// Check blacklists (simplified version)
async function checkBlacklists(domain) {
  try {
    // First resolve domain to IP
    let ip;
    try {
      const addresses = await dnsUtils.resolve4(domain, 5000);
      ip = addresses[0];
    } catch (error) {
      return {
        checked: 0,
        listed: 0,
        lists: [],
        error: 'Could not resolve domain to IP'
      };
    }
    
    // Reverse IP for DNSBL queries
    const reversedIp = ip.split('.').reverse().join('.');
    
    const results = await Promise.all(
      BLACKLISTS.slice(0, 10).map(async (blacklist) => { // Check first 10 for speed
        const query = `${reversedIp}.${blacklist}`;
        try {
          const result = await dnsUtils.resolve4(query, 2000);
          // If the query resolves, the IP IS listed on this blacklist
          // DNSBL returns an IP (usually 127.0.0.x) when listed
          if (result && result.length > 0) {
            // Only consider it listed if it returns specific IPs indicating listing
            const returnedIp = result[0];
            if (returnedIp.startsWith('127.0.0.')) {
              return { blacklist, listed: true };
            }
          }
          return { blacklist, listed: false };
        } catch (error) {
          // NXDOMAIN or timeout means NOT listed - this is the normal case
          return { blacklist, listed: false };
        }
      })
    );
    
    const listedOn = results.filter(r => r.listed).map(r => r.blacklist);
    
    return {
      checked: results.length,
      listed: listedOn.length,
      lists: listedOn,
      ip
    };
  } catch (error) {
    return {
      checked: 0,
      listed: 0,
      lists: [],
      error: error.message
    };
  }
}

// Calculate score based on results
function calculateScore(spf, dkim, dmarc, mx, blacklists) {
  let score = 0;
  let maxScore = 0;
  
  // SPF scoring (3 points)
  maxScore += 3;
  if (spf.exists) {
    score += 1.5;
    if (spf.valid) score += 1.5;
  }
  
  // DKIM scoring (2 points)
  maxScore += 2;
  if (dkim.exists) {
    score += 2;
  }
  
  // DMARC scoring (3 points)
  maxScore += 3;
  if (dmarc.exists) {
    score += 1.5;
    if (dmarc.valid) score += 0.5;
    if (dmarc.policy && dmarc.policy !== 'none') score += 1;
  }
  
  // MX scoring (1 point)
  maxScore += 1;
  if (mx.exists) score += 1;
  
  // Blacklist scoring (1 point)
  maxScore += 1;
  if (blacklists.checked > 0 && blacklists.listed === 0) {
    score += 1;
  } else if (blacklists.listed > 0) {
    score -= 0.5; // Penalty for being blacklisted
  }
  
  return Math.max(0, Math.round((score / maxScore) * 10));
}

// Generate recommendations
function generateRecommendations(domain, spf, dkim, dmarc, mx, blacklists, provider) {
  const recommendations = [];
  
  if (!spf.exists) {
    recommendations.push({
      type: 'critical',
      title: 'Missing SPF Record',
      description: 'Add an SPF record to specify which servers can send email for your domain',
      impact: 'High',
      recordType: 'TXT',
      recordName: domain,
      suggestedRecord: provider === 'google' ? 'v=spf1 include:_spf.google.com ~all' :
                       provider === 'microsoft' ? 'v=spf1 include:spf.protection.outlook.com -all' :
                       'v=spf1 mx a ~all',
      instructions: 'Add this TXT record to your domain\'s DNS settings'
    });
  } else if (!spf.valid && spf.issues) {
    recommendations.push({
      type: 'warning',
      title: 'SPF Record Issues',
      description: 'Your SPF record has issues that should be fixed',
      impact: 'Medium',
      issues: spf.issues
    });
  }
  
  if (!dkim.exists) {
    recommendations.push({
      type: 'critical',
      title: 'No DKIM Records Found',
      description: 'Configure DKIM to digitally sign your emails',
      impact: 'High',
      recordType: 'TXT',
      recordName: provider === 'google' ? `google._domainkey.${domain}` : 
                   provider === 'microsoft' ? `selector1._domainkey.${domain}` :
                   `default._domainkey.${domain}`,
      instructions: 'Get the DKIM key from your email provider and add it as a TXT record'
    });
  }
  
  if (!dmarc.exists) {
    recommendations.push({
      type: 'warning',
      title: 'No DMARC Policy',
      description: 'Implement DMARC to protect against email spoofing',
      impact: 'Medium',
      recordType: 'TXT',
      recordName: `_dmarc.${domain}`,
      suggestedRecord: `v=DMARC1; p=none; rua=mailto:dmarc@${domain}`,
      instructions: 'Start with p=none to monitor, then move to p=quarantine or p=reject'
    });
  } else if (dmarc.issues && dmarc.issues.length > 0) {
    recommendations.push({
      type: 'info',
      title: 'DMARC Configuration',
      description: 'Your DMARC record could be improved',
      impact: 'Low',
      issues: dmarc.issues
    });
  }
  
  if (!mx.exists) {
    recommendations.push({
      type: 'critical',
      title: 'No MX Records',
      description: 'Configure MX records to receive emails',
      impact: 'Critical',
      recordType: 'MX',
      recordName: domain,
      instructions: 'Add MX records pointing to your email provider\'s servers'
    });
  }
  
  if (blacklists.listed > 0) {
    recommendations.push({
      type: 'critical',
      title: 'Domain Blacklisted',
      description: `Your domain/IP is listed on ${blacklists.listed} blacklist(s)`,
      impact: 'Critical',
      blacklists: blacklists.lists,
      instructions: 'Contact the blacklist operators to request removal'
    });
  }
  
  return recommendations;
}

export async function POST(request) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }
    
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').trim();
    
    // Run all checks in parallel for speed
    const [spf, dkim, dmarc, mx, blacklists] = await Promise.all([
      checkSPF(cleanDomain),
      checkDKIM(cleanDomain),
      checkDMARC(cleanDomain),
      checkMX(cleanDomain),
      checkBlacklists(cleanDomain)
    ]);
    
    const provider = mx.provider || 'generic';
    const score = calculateScore(spf, dkim, dmarc, mx, blacklists);
    const recommendations = generateRecommendations(cleanDomain, spf, dkim, dmarc, mx, blacklists, provider);
    
    const results = {
      domain: cleanDomain,
      timestamp: new Date().toISOString(),
      dns: {
        spf,
        dkim,
        dmarc,
        mx
      },
      blacklists,
      provider,
      score,
      percentage: score * 10,
      riskLevel: score >= 8 ? 'Low' : score >= 6 ? 'Medium' : score >= 4 ? 'Medium' : 'High',
      grade: score >= 9 ? 'A' : score >= 8 ? 'B' : score >= 6 ? 'C' : score >= 4 ? 'D' : 'F',
      recommendations,
      realCheck: true // Flag to indicate this is real DNS data
    };
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Real DNS check error:', error);
    return NextResponse.json(
      { error: 'Failed to check domain', details: error.message },
      { status: 500 }
    );
  }
}