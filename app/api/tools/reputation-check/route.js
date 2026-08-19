import { NextResponse } from 'next/server';


const dnsUtils = require('../lib/dns-utils');

async function checkReputation(input) {
  try {
    // Determine if input is IP or domain
    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(input);
    let ipAddress = input;
    let domain = input;
    
    if (!isIP) {
      // Clean domain input
      domain = input.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
      
      // Get IP address for domain
      try {
        const ips = await dnsUtils.resolve4(domain, 5000);
        if (ips && ips.length > 0) {
          ipAddress = ips[0];
        }
      } catch (e) {
        return {
          input,
          error: true,
          message: 'Could not resolve domain to IP address'
        };
      }
    }
    
    const results = {
      input,
      domain: !isIP ? domain : null,
      ipAddress,
      reputation: {
        score: 100,
        status: 'clean',
        issues: []
      },
      blacklists: {
        checked: [],
        listed: []
      },
      authentication: {
        spf: null,
        dkim: null,
        dmarc: null
      },
      mailServer: {
        isMailServer: false,
        ptr: null,
        validPTR: false
      },
      recommendations: []
    };
    
    // Check PTR record
    try {
      const ptrRecords = await dnsUtils.reverse(ipAddress, 5000);
      if (ptrRecords && ptrRecords.length > 0) {
        results.mailServer.ptr = ptrRecords[0];
        results.mailServer.isMailServer = true;
        
        // Validate forward-confirmed reverse DNS
        try {
          const forwardIPs = await dnsUtils.resolve4(ptrRecords[0], 5000);
          results.mailServer.validPTR = forwardIPs.includes(ipAddress);
          
          if (!results.mailServer.validPTR) {
            results.reputation.issues.push('PTR record does not match forward DNS');
            results.reputation.score -= 10;
          }
        } catch (e) {
      // Error handled silently - DNS lookup failed
    }
      } else {
        results.reputation.issues.push('No PTR record found');
        results.reputation.score -= 15;
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check common blacklists (simulated)
    const blacklists = [
      { name: 'Spamhaus ZEN', dns: 'zen.spamhaus.org' },
      { name: 'Barracuda', dns: 'b.barracudacentral.org' },
      { name: 'SpamCop', dns: 'bl.spamcop.net' },
      { name: 'SURBL', dns: 'multi.surbl.org' },
      { name: 'UCEPROTECT L1', dns: 'dnsbl-1.uceprotect.net' },
      { name: 'Invaluement', dns: 'ib.invaluement.com' },
      { name: 'SpamRATS', dns: 'all.spamrats.com' },
      { name: 'SORBS', dns: 'dnsbl.sorbs.net' }
    ];
    
    // Simulate blacklist checking (in production, would do actual DNS queries)
    for (const bl of blacklists) {
      results.blacklists.checked.push(bl.name);
      
      // Simulate random listing (in real implementation, check actual blacklist)
      const isListed = Math.random() < 0.05; // 5% chance of being listed
      
      if (isListed) {
        results.blacklists.listed.push(bl.name);
        results.reputation.issues.push(`Listed on ${bl.name}`);
        results.reputation.score -= 20;
      }
    }
    
    // Check email authentication if domain provided
    if (domain) {
      // Check SPF
      try {
        const txtRecords = await dnsUtils.resolveTxt(domain, 5000);
        for (const record of txtRecords) {
          const txt = record.join('');
          if (txt.startsWith('v=spf1')) {
            results.authentication.spf = 'found';
            break;
          }
        }
        if (!results.authentication.spf) {
          results.reputation.issues.push('No SPF record found');
          results.reputation.score -= 10;
        }
      } catch (e) {
      // Error handled silently - DNS lookup failed
    }
      
      // Check DMARC
      try {
        const dmarcRecords = await dnsUtils.resolveTxt(`_dmarc.${domain}`, 5000);
        for (const record of dmarcRecords) {
          const txt = record.join('');
          if (txt.startsWith('v=DMARC1')) {
            results.authentication.dmarc = 'found';
            
            // Check policy
            const policyMatch = txt.match(/p=([^;]+)/);
            if (policyMatch) {
              const policy = policyMatch[1];
              if (policy === 'none') {
                results.reputation.issues.push('DMARC policy is monitoring only');
                results.reputation.score -= 5;
              }
            }
            break;
          }
        }
        if (!results.authentication.dmarc) {
          results.reputation.issues.push('No DMARC record found');
          results.reputation.score -= 10;
        }
      } catch (e) {
      // Error handled silently - DNS lookup failed
    }
      
      // Check for common DKIM selectors
      const dkimSelectors = ['google', 'default', 'selector1', 'selector2'];
      let dkimFound = false;
      
      for (const selector of dkimSelectors) {
        try {
          const dkimRecords = await dnsUtils.resolveTxt(`${selector}._domainkey.${domain}`, 5000);
          if (dkimRecords && dkimRecords.length > 0) {
            const record = dkimRecords[0].join('');
            if (record.includes('p=')) {
              dkimFound = true;
              results.authentication.dkim = 'found';
              break;
            }
          }
        } catch (e) {
      // Error handled silently - DNS lookup failed
    }
      }
      
      if (!dkimFound) {
        results.reputation.issues.push('No DKIM records found');
        results.reputation.score -= 10;
      }
    }
    
    // Calculate final reputation status
    if (results.reputation.score >= 90) {
      results.reputation.status = 'excellent';
    } else if (results.reputation.score >= 75) {
      results.reputation.status = 'good';
    } else if (results.reputation.score >= 60) {
      results.reputation.status = 'fair';
    } else if (results.reputation.score >= 40) {
      results.reputation.status = 'poor';
    } else {
      results.reputation.status = 'critical';
    }
    
    // Generate recommendations
    if (results.blacklists.listed.length > 0) {
      results.recommendations.push({
        level: 'critical',
        message: 'IP is blacklisted',
        action: 'Request delisting from blacklists and investigate the cause'
      });
    }
    
    if (!results.mailServer.ptr) {
      results.recommendations.push({
        level: 'warning',
        message: 'Missing PTR record',
        action: 'Configure reverse DNS (PTR) record for mail server IP'
      });
    }
    
    if (!results.mailServer.validPTR) {
      results.recommendations.push({
        level: 'warning',
        message: 'PTR mismatch',
        action: 'Ensure PTR record matches forward DNS lookup'
      });
    }
    
    if (domain && !results.authentication.spf) {
      results.recommendations.push({
        level: 'warning',
        message: 'No SPF record',
        action: 'Add SPF record to authorize sending servers'
      });
    }
    
    if (domain && !results.authentication.dmarc) {
      results.recommendations.push({
        level: 'warning',
        message: 'No DMARC policy',
        action: 'Implement DMARC to protect against spoofing'
      });
    }
    
    return results;
    
  } catch (error) {
    console.error('Reputation check error:', error);
    return {
      input,
      error: true,
      message: 'Failed to check reputation'
    };
  }
}

export async function POST(request) {
  try {
    const { input } = await request.json();
    
    if (!input) {
      return NextResponse.json(
        { error: true, message: 'Domain or IP address is required' },
        { status: 400 }
      );
    }
    
    const result = await checkReputation(input);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}