import { NextResponse } from 'next/server';


const dnsUtils = require('../lib/dns-utils');

async function checkMTASTS(domain) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    const results = {
      domain: cleanDomain,
      dns: { exists: false },
      policy: { exists: false },
      valid: false,
      warnings: [],
      errors: []
    };
    
    // Step 1: Check DNS record
    try {
      const stsDomain = `_mta-sts.${cleanDomain}`;
      const txtRecords = await dnsUtils.resolveTxt(stsDomain, 5000);
      
      let stsRecord = null;
      for (const record of txtRecords) {
        const txtContent = record.join('');
        if (txtContent.includes('v=STSv1')) {
          stsRecord = txtContent;
          break;
        }
      }
      
      if (stsRecord) {
        results.dns.exists = true;
        results.dns.record = stsRecord;
        
        // Parse DNS record
        const idMatch = stsRecord.match(/id=([^;]+)/);
        if (idMatch) {
          results.dns.id = idMatch[1];
        } else {
          results.errors.push('MTA-STS DNS record missing required id field');
        }
      } else {
        results.errors.push('No MTA-STS DNS record found at _mta-sts.' + cleanDomain);
      }
    } catch (error) {
      if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
        results.errors.push('No MTA-STS DNS record found');
      }
    }
    
    // Step 2: Check policy file (would need to be fetched via HTTPS)
    // Note: In a real implementation, you'd fetch https://mta-sts.domain/.well-known/mta-sts.txt
    // For this demo, we'll simulate the check
    results.policy.url = `https://mta-sts.${cleanDomain}/.well-known/mta-sts.txt`;
    results.policy.message = 'Policy file should be accessible at this URL';
    
    // Step 3: Validate configuration
    if (results.dns.exists) {
      // Check for common issues
      if (!results.dns.id) {
        results.warnings.push('DNS record missing ID field');
      } else if (results.dns.id.length < 1 || results.dns.id.length > 32) {
        results.warnings.push('ID should be 1-32 alphanumeric characters');
      }
      
      // Check for DNSSEC (optional but recommended)
      try {
        // This would require additional DNSSEC checking logic
        results.dnssec = { checked: false, message: 'DNSSEC validation not performed' };
      } catch (e) {
        // Error handled silently - DNSSEC check failed
      }
      
      results.valid = results.dns.exists && results.errors.length === 0;
    }
    
    // Generate recommendations
    results.recommendations = generateRecommendations(results);
    
    // Expected policy format
    results.policyFormat = {
      version: 'STSv1',
      mode: 'testing, enforce, or none',
      mx: ['List of authorized mail servers'],
      max_age: 'Cache duration in seconds (86400 = 1 day)'
    };
    
    return results;
    
  } catch (error) {
    console.error('MTA-STS check error:', error);
    return {
      domain,
      error: true,
      message: 'Failed to check MTA-STS configuration'
    };
  }
}

function generateRecommendations(results) {
  const recommendations = [];
  
  if (!results.dns.exists) {
    recommendations.push({
      level: 'critical',
      message: 'Add MTA-STS DNS record to enable TLS encryption enforcement',
      action: 'Create TXT record at _mta-sts.yourdomain.com with v=STSv1; id=<unique-id>'
    });
  }
  
  if (results.dns.exists && !results.policy.exists) {
    recommendations.push({
      level: 'critical', 
      message: 'Deploy MTA-STS policy file',
      action: 'Host policy file at https://mta-sts.yourdomain.com/.well-known/mta-sts.txt'
    });
  }
  
  if (!results.dnssec?.enabled) {
    recommendations.push({
      level: 'warning',
      message: 'Enable DNSSEC for additional security',
      action: 'DNSSEC prevents DNS spoofing attacks'
    });
  }
  
  recommendations.push({
    level: 'info',
    message: 'Consider implementing TLS-RPT for failure reporting',
    action: 'TLS-RPT provides visibility into TLS connection failures'
  });
  
  return recommendations;
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
    
    const result = await checkMTASTS(domain);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}