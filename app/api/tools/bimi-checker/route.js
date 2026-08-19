import { NextResponse } from 'next/server';

const dns = require('dns').promises;
const dnsUtils = require('../lib/dns-utils');

async function checkBIMI(domain) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    // Check for BIMI record at default._bimi subdomain
    const bimiDomain = `default._bimi.${cleanDomain}`;
    
    try {
      const txtRecords = await dnsUtils.resolveTxt(bimiDomain, 5000);
      
      // Find BIMI record
      let bimiRecord = null;
      for (const record of txtRecords) {
        const txtContent = record.join('');
        if (txtContent.includes('v=BIMI1')) {
          bimiRecord = txtContent;
          break;
        }
      }
      
      if (!bimiRecord) {
        return {
          domain: cleanDomain,
          exists: false,
          record: null,
          message: 'No BIMI record found',
          info: 'BIMI is optional but helps display your brand logo in supported email clients'
        };
      }
      
      // Parse BIMI record
      const parsed = parseBIMIRecord(bimiRecord);
      const validation = validateBIMIRecord(parsed);
      
      // Check DMARC requirement
      const dmarcStatus = await checkDMARCForBIMI(cleanDomain);
      
      return {
        domain: cleanDomain,
        exists: true,
        valid: validation.valid,
        record: bimiRecord,
        parsed,
        validation,
        dmarcStatus,
        warnings: validation.warnings
      };
      
    } catch (error) {
      if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
        return {
          domain: cleanDomain,
          exists: false,
          record: null,
          message: 'No BIMI record found',
          info: 'BIMI allows you to display your brand logo in email clients that support it'
        };
      }
      throw error;
    }
    
  } catch (error) {
    console.error('BIMI check error:', error);
    
    return {
      domain,
      exists: false,
      valid: false,
      error: true,
      message: 'Failed to check BIMI record'
    };
  }
}

function parseBIMIRecord(record) {
  const parsed = {
    version: null,
    logoUrl: null,
    certificateUrl: null
  };
  
  // Split record into tags
  const tags = record.split(/;\s*/);
  
  for (const tag of tags) {
    if (!tag) continue;
    
    const [key, value] = tag.split('=');
    
    switch (key) {
      case 'v':
        parsed.version = value;
        break;
      case 'l':
        parsed.logoUrl = value;
        break;
      case 'a':
        parsed.certificateUrl = value;
        break;
    }
  }
  
  return parsed;
}

function validateBIMIRecord(parsed) {
  const warnings = [];
  let valid = true;
  
  // Check version
  if (parsed.version !== 'BIMI1') {
    warnings.push('Invalid BIMI version. Must be v=BIMI1');
    valid = false;
  }
  
  // Check logo URL
  if (!parsed.logoUrl) {
    warnings.push('Missing logo URL (l= tag)');
    valid = false;
  } else {
    // Validate logo URL format
    if (!parsed.logoUrl.startsWith('https://')) {
      warnings.push('Logo URL must use HTTPS');
      valid = false;
    }
    
    // Check for SVG format
    if (!parsed.logoUrl.endsWith('.svg') && !parsed.logoUrl.includes('.svg?')) {
      warnings.push('Logo must be in SVG format');
    }
  }
  
  // Check certificate (optional but recommended for VMC)
  if (parsed.certificateUrl) {
    if (!parsed.certificateUrl.startsWith('https://')) {
      warnings.push('Certificate URL must use HTTPS');
    }
    
    if (!parsed.certificateUrl.endsWith('.pem') && !parsed.certificateUrl.includes('.pem?')) {
      warnings.push('Certificate should be in PEM format');
    }
  } else {
    warnings.push('No Verified Mark Certificate (VMC) specified. Logo may not display in all clients');
  }
  
  return {
    valid,
    warnings,
    requirements: {
      hasLogo: !!parsed.logoUrl,
      hasValidLogo: parsed.logoUrl?.startsWith('https://'),
      hasCertificate: !!parsed.certificateUrl,
      hasValidCertificate: parsed.certificateUrl?.startsWith('https://')
    }
  };
}

async function checkDMARCForBIMI(domain) {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const txtRecords = await dns.resolveTxt(dmarcDomain);
    
    for (const record of txtRecords) {
      const txtContent = record.join('');
      if (txtContent.startsWith('v=DMARC1')) {
        // Parse DMARC policy
        const policyMatch = txtContent.match(/p=([^;]+)/);
        const policy = policyMatch ? policyMatch[1] : 'none';
        
        // BIMI requires at least quarantine policy
        const sufficient = policy === 'quarantine' || policy === 'reject';
        
        return {
          exists: true,
          policy,
          sufficient,
          message: sufficient 
            ? 'DMARC policy meets BIMI requirements' 
            : 'BIMI requires DMARC policy of quarantine or reject'
        };
      }
    }
  } catch (e) {
    // Error handled silently - DMARC check failed
  }
  
  return {
    exists: false,
    sufficient: false,
    message: 'BIMI requires a DMARC policy of quarantine or reject'
  };
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
    
    const result = await checkBIMI(domain);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}