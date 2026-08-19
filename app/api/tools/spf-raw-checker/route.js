import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { spfRecord } = await request.json();
    
    if (!spfRecord) {
      return NextResponse.json(
        { error: true, message: 'SPF record is required' },
        { status: 400 }
      );
    }
    
    const analysis = analyzeSPFRecord(spfRecord);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('SPF analysis error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to analyze SPF record' },
      { status: 500 }
    );
  }
}

function analyzeSPFRecord(record) {
  const analysis = {
    record,
    valid: false,
    version: null,
    mechanisms: [],
    modifiers: [],
    includes: [],
    ipAddresses: [],
    warnings: [],
    errors: [],
    dnsLookupCount: 0,
    characterCount: record.length,
    all: null,
    recommendations: []
  };
  
  // Check basic format
  if (!record.startsWith('v=spf1')) {
    analysis.errors.push('SPF record must start with "v=spf1"');
    return analysis;
  }
  
  analysis.version = 'spf1';
  analysis.valid = true;
  
  // Parse record
  const parts = record.trim().split(/\s+/);
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    if (!part) continue;
    
    // Parse qualifier
    let qualifier = '+';
    let mechanism = part;
    
    if (part.match(/^[+\-~?]/)) {
      qualifier = part[0];
      mechanism = part.substring(1);
    }
    
    // Analyze mechanism
    if (mechanism.startsWith('include:')) {
      const domain = mechanism.substring(8);
      analysis.includes.push(domain);
      analysis.mechanisms.push({
        type: 'include',
        qualifier,
        value: domain
      });
      analysis.dnsLookupCount++;
    } else if (mechanism.startsWith('a:')) {
      const domain = mechanism.substring(2);
      analysis.mechanisms.push({
        type: 'a',
        qualifier,
        value: domain
      });
      analysis.dnsLookupCount++;
    } else if (mechanism === 'a') {
      analysis.mechanisms.push({
        type: 'a',
        qualifier,
        value: 'current domain'
      });
      analysis.dnsLookupCount++;
    } else if (mechanism.startsWith('mx:')) {
      const domain = mechanism.substring(3);
      analysis.mechanisms.push({
        type: 'mx',
        qualifier,
        value: domain
      });
      analysis.dnsLookupCount++;
    } else if (mechanism === 'mx') {
      analysis.mechanisms.push({
        type: 'mx',
        qualifier,
        value: 'current domain'
      });
      analysis.dnsLookupCount++;
    } else if (mechanism.startsWith('ip4:')) {
      const ip = mechanism.substring(4);
      analysis.ipAddresses.push({ version: 4, address: ip });
      analysis.mechanisms.push({
        type: 'ip4',
        qualifier,
        value: ip
      });
    } else if (mechanism.startsWith('ip6:')) {
      const ip = mechanism.substring(4);
      analysis.ipAddresses.push({ version: 6, address: ip });
      analysis.mechanisms.push({
        type: 'ip6',
        qualifier,
        value: ip
      });
    } else if (mechanism.startsWith('ptr:')) {
      const domain = mechanism.substring(4);
      analysis.mechanisms.push({
        type: 'ptr',
        qualifier,
        value: domain
      });
      analysis.dnsLookupCount++;
      analysis.warnings.push('PTR mechanism is deprecated and should be avoided');
    } else if (mechanism === 'ptr') {
      analysis.mechanisms.push({
        type: 'ptr',
        qualifier,
        value: 'current domain'
      });
      analysis.dnsLookupCount++;
      analysis.warnings.push('PTR mechanism is deprecated and should be avoided');
    } else if (mechanism.startsWith('exists:')) {
      const domain = mechanism.substring(7);
      analysis.mechanisms.push({
        type: 'exists',
        qualifier,
        value: domain
      });
      analysis.dnsLookupCount++;
    } else if (mechanism === 'all') {
      analysis.all = qualifier;
      analysis.mechanisms.push({
        type: 'all',
        qualifier,
        value: null
      });
    } else if (mechanism.startsWith('redirect=')) {
      analysis.modifiers.push({
        type: 'redirect',
        value: mechanism.substring(9)
      });
      analysis.dnsLookupCount++;
    } else if (mechanism.startsWith('exp=')) {
      analysis.modifiers.push({
        type: 'exp',
        value: mechanism.substring(4)
      });
    } else {
      analysis.warnings.push(`Unknown mechanism: ${mechanism}`);
    }
  }
  
  // Validate and generate warnings
  if (analysis.dnsLookupCount > 10) {
    analysis.errors.push(`SPF record exceeds 10 DNS lookup limit (found ${analysis.dnsLookupCount})`);
    analysis.valid = false;
  }
  
  if (analysis.characterCount > 255) {
    analysis.warnings.push(`Record is ${analysis.characterCount} characters. May need to be split for DNS`);
  }
  
  if (!analysis.all) {
    analysis.warnings.push('No "all" mechanism found. Consider adding one for explicit policy');
  } else if (analysis.all === '+') {
    analysis.errors.push('"all" mechanism allows all servers. This makes SPF useless');
    analysis.valid = false;
  } else if (analysis.all === '?') {
    analysis.warnings.push('"?all" provides no protection. Consider using "~all" or "-all"');
  }
  
  if (analysis.includes.length > 5) {
    analysis.warnings.push('Many include statements can slow DNS lookups and complicate management');
  }
  
  // Generate recommendations
  if (analysis.dnsLookupCount > 7) {
    analysis.recommendations.push({
      level: 'warning',
      message: `High DNS lookup count (${analysis.dnsLookupCount}/10)`,
      action: 'Consider consolidating includes or using IP addresses'
    });
  }
  
  if (analysis.mechanisms.filter(m => m.type === 'ptr').length > 0) {
    analysis.recommendations.push({
      level: 'warning',
      message: 'PTR mechanism detected',
      action: 'Replace PTR with A or IP mechanisms for better performance'
    });
  }
  
  if (analysis.all === '?') {
    analysis.recommendations.push({
      level: 'critical',
      message: 'Neutral policy provides no protection',
      action: 'Change to "~all" (softfail) or "-all" (fail)'
    });
  }
  
  if (!analysis.includes.length && !analysis.ipAddresses.length && analysis.mechanisms.length < 2) {
    analysis.recommendations.push({
      level: 'info',
      message: 'Very simple SPF record',
      action: 'Ensure all sending sources are authorized'
    });
  }
  
  return analysis;
}