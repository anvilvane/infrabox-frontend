import { NextResponse } from 'next/server';


const dnsUtils = require('../lib/dns-utils');

async function checkDMARC(domain) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    // Look for DMARC record at _dmarc subdomain
    const dmarcDomain = `_dmarc.${cleanDomain}`;
    
    try {
      const txtRecords = await dnsUtils.resolveTxt(dmarcDomain, 5000);
      
      // Find DMARC record
      let dmarcRecord = null;
      for (const record of txtRecords) {
        const txtContent = record.join('');
        if (txtContent.startsWith('v=DMARC1')) {
          dmarcRecord = txtContent;
          break;
        }
      }
      
      if (!dmarcRecord) {
        return {
          domain: cleanDomain,
          exists: false,
          record: null,
          message: 'No DMARC record found',
          warnings: ['Consider implementing DMARC to protect your domain from spoofing']
        };
      }
      
      // Parse DMARC record
      const parsed = parseDMARCRecord(dmarcRecord);
      const { errors, warnings } = validateDMARCRecord(parsed);

      return {
        domain: cleanDomain,
        exists: true,
        valid: errors.length === 0,
        record: dmarcRecord,
        parsed,
        errors,
        // Surfaced together so the UI can list everything actionable in one place.
        warnings: [...errors, ...warnings]
      };
      
    } catch (error) {
      if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
        return {
          domain: cleanDomain,
          exists: false,
          record: null,
          message: 'No DMARC record found',
          warnings: ['DMARC record not configured. Your domain is vulnerable to spoofing.']
        };
      }
      throw error;
    }
    
  } catch (error) {
    console.error('DMARC check error:', error);
    
    return {
      domain,
      exists: false,
      valid: false,
      error: true,
      message: 'Failed to check DMARC record'
    };
  }
}

function parseDMARCRecord(record) {
  const parsed = {
    version: null,
    policy: null,
    subdomain_policy: null,
    percentage: null,
    rua: null,
    ruf: null,
    alignment: {
      spf: null,
      dkim: null
    },
    fo: null,
    rf: null,
    ri: null
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
      case 'p':
        parsed.policy = value;
        break;
      case 'sp':
        parsed.subdomain_policy = value;
        break;
      case 'pct':
        parsed.percentage = parseInt(value);
        break;
      case 'rua':
        parsed.rua = value;
        break;
      case 'ruf':
        parsed.ruf = value;
        break;
      case 'aspf':
        parsed.alignment.spf = value === 's' ? 'strict' : 'relaxed';
        break;
      case 'adkim':
        parsed.alignment.dkim = value === 's' ? 'strict' : 'relaxed';
        break;
      case 'fo':
        parsed.fo = value;
        break;
      case 'rf':
        parsed.rf = value;
        break;
      case 'ri':
        parsed.ri = value;
        break;
    }
  }
  
  // Set defaults
  if (!parsed.percentage) {
    parsed.percentage = 100;
  }
  if (!parsed.alignment.spf) {
    parsed.alignment.spf = 'relaxed';
  }
  if (!parsed.alignment.dkim) {
    parsed.alignment.dkim = 'relaxed';
  }
  
  return parsed;
}

// Returns { errors, warnings }. `errors` are syntax violations that make the record
// invalid per RFC 7489; `warnings` are advisory (a record can be perfectly valid and
// still earn several). Only `errors` may drive the `valid` flag — most real-world
// records omit sp= or rua=, and those are not defects.
function validateDMARCRecord(parsed) {
  const errors = [];
  const warnings = [];

  // Check version
  if (parsed.version !== 'DMARC1') {
    errors.push('Invalid DMARC version. Must be v=DMARC1');
  }

  // Check policy
  if (!parsed.policy) {
    errors.push('Missing policy (p=) tag. This is required.');
  } else if (!['none', 'quarantine', 'reject'].includes(parsed.policy)) {
    errors.push(`Invalid policy "${parsed.policy}". Must be none, quarantine, or reject.`);
  } else if (parsed.policy === 'none') {
    warnings.push('Policy is set to "none" (monitoring only). Consider upgrading to quarantine or reject for protection.');
  }
  
  // Check percentage
  if (parsed.percentage && parsed.percentage < 100) {
    warnings.push(`Policy only applies to ${parsed.percentage}% of emails. Consider increasing to 100%.`);
  }
  
  // Check reporting
  if (!parsed.rua) {
    warnings.push('No aggregate report email (rua) configured. You won\'t receive DMARC reports.');
  }
  
  // Check subdomain policy
  if (!parsed.subdomain_policy) {
    warnings.push('No subdomain policy (sp) set. Subdomains will inherit main domain policy.');
  }
  
  // Validate email addresses in rua/ruf
  if (parsed.rua) {
    const emails = parsed.rua.split(',');
    for (const email of emails) {
      if (!email.includes('mailto:')) {
        errors.push('RUA email must be in format: mailto:email@domain.com');
      }
    }
  }

  if (parsed.ruf) {
    const emails = parsed.ruf.split(',');
    for (const email of emails) {
      if (!email.includes('mailto:')) {
        errors.push('RUF email must be in format: mailto:email@domain.com');
      }
    }
  }
  
  // Check alignment
  if (parsed.alignment.spf === 'strict' && parsed.alignment.dkim === 'strict') {
    warnings.push('Both SPF and DKIM are set to strict alignment. This may cause legitimate emails to fail.');
  }

  return { errors, warnings };
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
    
    const result = await checkDMARC(domain);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}