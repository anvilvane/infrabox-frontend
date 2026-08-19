import { NextResponse } from 'next/server';


const dnsUtils = require('../lib/dns-utils');

async function scanDomain(domain) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    const results = {
      domain: cleanDomain,
      score: 0,
      spf: { exists: false, status: 'fail' },
      dkim: { found: 0, status: 'fail' },
      dmarc: { exists: false, status: 'fail' },
      bimi: { exists: false, status: 'info' },
      mta_sts: { exists: false, status: 'info' },
      tls_rpt: { exists: false, status: 'info' },
      mx: { exists: false, status: 'fail' },
      recommendations: []
    };
    
    let scorePoints = 0;
    const maxPoints = 10;
    
    // Check SPF
    try {
      const spfResult = await checkSPF(cleanDomain);
      results.spf = spfResult;
      if (spfResult.exists) {
        scorePoints += 2;
        if (spfResult.valid && !spfResult.warnings?.length) {
          scorePoints += 0.5;
        }
      } else {
        results.recommendations.push('Add SPF record to authorize sending servers');
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check DKIM
    try {
      const dkimResult = await checkDKIM(cleanDomain);
      results.dkim = dkimResult;
      if (dkimResult.found > 0) {
        scorePoints += 2;
        if (dkimResult.selectors?.some(s => s.valid)) {
          scorePoints += 0.5;
        }
      } else {
        results.recommendations.push('Configure DKIM signing for email authentication');
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check DMARC
    try {
      const dmarcResult = await checkDMARC(cleanDomain);
      results.dmarc = dmarcResult;
      if (dmarcResult.exists) {
        scorePoints += 2;
        if (dmarcResult.policy === 'quarantine') scorePoints += 0.5;
        if (dmarcResult.policy === 'reject') scorePoints += 1;
      } else {
        results.recommendations.push('Implement DMARC policy to prevent spoofing');
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check BIMI
    try {
      const bimiResult = await checkBIMI(cleanDomain);
      results.bimi = bimiResult;
      if (bimiResult.exists) {
        scorePoints += 0.5;
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check MTA-STS
    try {
      const mtaStsResult = await checkMTASTS(cleanDomain);
      results.mta_sts = mtaStsResult;
      if (mtaStsResult.exists) {
        scorePoints += 1;
      } else {
        results.recommendations.push('Consider implementing MTA-STS for TLS encryption enforcement');
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check TLS-RPT
    try {
      const tlsRptResult = await checkTLSRPT(cleanDomain);
      results.tls_rpt = tlsRptResult;
      if (tlsRptResult.exists) {
        scorePoints += 0.5;
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check MX records
    try {
      const mxResult = await checkMX(cleanDomain);
      results.mx = mxResult;
      if (mxResult.exists) {
        scorePoints += 1;
      } else {
        results.recommendations.push('Configure MX records for email delivery');
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Calculate final score
    results.score = Math.min(10, Math.round((scorePoints / maxPoints) * 10 * 10) / 10);
    
    // Add general recommendations based on score
    if (results.score < 6) {
      results.recommendations.unshift('Critical: Your domain lacks basic email authentication');
    } else if (results.score < 8) {
      results.recommendations.unshift('Good start, but additional security measures recommended');
    }
    
    return results;
    
  } catch (error) {
    console.error('Domain scan error:', error);
    return {
      domain,
      error: true,
      message: 'Failed to scan domain'
    };
  }
}

async function checkSPF(domain) {
  try {
    const txtRecords = await dnsUtils.resolveTxt(domain, 5000);
    
    for (const record of txtRecords) {
      const txtContent = record.join('');
      if (txtContent.startsWith('v=spf1')) {
        const warnings = [];
        
        // Count mechanisms for DNS lookup limit
        const lookupCount = (txtContent.match(/include:|a |mx |exists:|ptr/g) || []).length;
        if (lookupCount > 10) {
          warnings.push('SPF exceeds 10 DNS lookup limit');
        }
        
        if (txtContent.includes('+all')) {
          warnings.push('SPF allows all servers (+all is insecure)');
        }
        
        return {
          exists: true,
          status: warnings.length === 0 ? 'pass' : 'warning',
          record: txtContent,
          valid: true,
          warnings
        };
      }
    }
  } catch (e) {
    // Error handled silently - DNS lookup failed
  }
  
  return { exists: false, status: 'fail' };
}

async function checkDKIM(domain) {
  const commonSelectors = ['google', 'default', 'selector1', 'selector2', 'dkim', 'mail'];
  const foundSelectors = [];
  
  for (const selector of commonSelectors) {
    try {
      const dkimDomain = `${selector}._domainkey.${domain}`;
      const txtRecords = await dnsUtils.resolveTxt(dkimDomain, 5000);
      
      if (txtRecords && txtRecords.length > 0) {
        const record = txtRecords[0].join('');
        if (record.includes('p=')) {
          foundSelectors.push({
            selector,
            valid: true,
            record: record.substring(0, 50) + '...'
          });
        }
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
  }
  
  return {
    found: foundSelectors.length,
    status: foundSelectors.length > 0 ? 'pass' : 'fail',
    selectors: foundSelectors
  };
}

async function checkDMARC(domain) {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const txtRecords = await dnsUtils.resolveTxt(dmarcDomain, 5000);
    
    for (const record of txtRecords) {
      const txtContent = record.join('');
      if (txtContent.startsWith('v=DMARC1')) {
        // Parse policy
        const policyMatch = txtContent.match(/p=([^;]+)/);
        const policy = policyMatch ? policyMatch[1] : 'none';
        
        // Parse percentage
        const pctMatch = txtContent.match(/pct=([^;]+)/);
        const percentage = pctMatch ? parseInt(pctMatch[1]) : 100;
        
        const status = policy === 'reject' ? 'pass' : 
                      policy === 'quarantine' ? 'warning' : 'warning';
        
        return {
          exists: true,
          status,
          record: txtContent,
          policy,
          percentage
        };
      }
    }
  } catch (e) {
    // Error handled silently - DNS lookup failed
  }
  
  return { exists: false, status: 'fail' };
}

async function checkBIMI(domain) {
  try {
    const bimiDomain = `default._bimi.${domain}`;
    const txtRecords = await dnsUtils.resolveTxt(bimiDomain, 5000);
    
    for (const record of txtRecords) {
      const txtContent = record.join('');
      if (txtContent.includes('v=BIMI1')) {
        return {
          exists: true,
          status: 'pass',
          record: txtContent
        };
      }
    }
  } catch (e) {
    // Error handled silently - DNS lookup failed
  }
  
  return { exists: false, status: 'info' };
}

async function checkMTASTS(domain) {
  try {
    const stsDomain = `_mta-sts.${domain}`;
    const txtRecords = await dnsUtils.resolveTxt(stsDomain, 5000);
    
    for (const record of txtRecords) {
      const txtContent = record.join('');
      if (txtContent.includes('v=STSv1')) {
        return {
          exists: true,
          status: 'pass',
          dns: txtContent,
          policy: 'Check https://mta-sts.' + domain + '/.well-known/mta-sts.txt'
        };
      }
    }
  } catch (e) {
    // Error handled silently - DNS lookup failed
  }
  
  return { exists: false, status: 'info' };
}

async function checkTLSRPT(domain) {
  try {
    const tlsRptDomain = `_smtp._tls.${domain}`;
    const txtRecords = await dnsUtils.resolveTxt(tlsRptDomain, 5000);
    
    for (const record of txtRecords) {
      const txtContent = record.join('');
      if (txtContent.includes('v=TLSRPTv1')) {
        return {
          exists: true,
          status: 'pass',
          record: txtContent
        };
      }
    }
  } catch (e) {
    // Error handled silently - DNS lookup failed
  }
  
  return { exists: false, status: 'info' };
}

async function checkMX(domain) {
  try {
    const mxRecords = await dnsUtils.resolveMx(domain, 5000);
    
    if (mxRecords && mxRecords.length > 0) {
      return {
        exists: true,
        status: 'pass',
        records: mxRecords.map(mx => ({
          priority: mx.priority,
          exchange: mx.exchange
        }))
      };
    }
  } catch (e) {
    // Error handled silently - DNS lookup failed
  }
  
  return { exists: false, status: 'fail' };
}

export async function POST(request) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json(
        { error: true, message: 'Domain is required' },
        { status: 400 }
      );
    }
    
    const result = await scanDomain(domain);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}