import { NextResponse } from 'next/server';


const dnsUtils = require('../lib/dns-utils');

async function checkSPF(domain) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    // Look for SPF record in TXT records with timeout
    const txtRecords = await dnsUtils.resolveTxt(cleanDomain, 5000);
    
    let spfRecord = null;
    let spfRecords = [];
    
    // Find SPF record(s)
    for (const record of txtRecords) {
      const txtContent = record.join('');
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
      analysis
    };
    
  } catch (error) {
    console.error('SPF check error:', error);
    
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
  
  // Count DNS lookups and extract mechanisms
  for (const part of parts.slice(1)) {
    if (part.startsWith('include:')) {
      analysis.mechanisms.push(part);
      analysis.lookupCount++;
      
      // Try to count nested includes (simplified)
      const includeDomain = part.replace('include:', '');
      try {
        const nestedRecords = await dnsUtils.resolveTxt(includeDomain, 3000);
        const nestedSPF = nestedRecords.find(r => r.join('').startsWith('v=spf1'));
        if (nestedSPF) {
          // Count additional includes in nested record
          const nestedIncludes = (nestedSPF.join('').match(/include:/g) || []).length;
          analysis.lookupCount += nestedIncludes;
        }
      } catch (e) {
        // Ignore errors in nested lookups
      }
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

export async function POST(request) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json(
        { error: true, message: 'Domain is required' },
        { status: 400 }
      );
    }
    
    const result = await checkSPF(domain);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}