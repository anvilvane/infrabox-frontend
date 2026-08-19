import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { ipAddresses, includeDomains, mechanisms, policy } = await request.json();
    
    let record = 'v=spf1';
    
    // Add mechanisms
    if (mechanisms?.a) record += ' a';
    if (mechanisms?.mx) record += ' mx';
    
    // Add IP addresses
    if (ipAddresses && Array.isArray(ipAddresses)) {
      ipAddresses.forEach(ip => {
        if (ip && ip.trim()) {
          if (ip.includes(':')) {
            record += ` ip6:${ip.trim()}`;
          } else {
            record += ` ip4:${ip.trim()}`;
          }
        }
      });
    }
    
    // Add include domains
    if (includeDomains && Array.isArray(includeDomains)) {
      includeDomains.forEach(domain => {
        if (domain && domain.trim()) {
          record += ` include:${domain.trim()}`;
        }
      });
    }
    
    // Add policy
    record += ` ${policy || '~all'}`;
    
    return NextResponse.json({
      success: true,
      record,
      warnings: validateSPF(record)
    });
  } catch (error) {
    console.error('SPF generation error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to generate SPF record' },
      { status: 500 }
    );
  }
}

function validateSPF(record) {
  const warnings = [];
  
  // Check record length
  if (record.length > 255) {
    warnings.push('SPF record exceeds 255 characters. Consider splitting into multiple strings.');
  }
  
  // Count DNS lookups (simplified)
  const lookupMechanisms = ['include:', 'a', 'mx', 'exists:', 'ptr', 'redirect='];
  let lookupCount = 0;
  
  lookupMechanisms.forEach(mechanism => {
    const matches = record.match(new RegExp(mechanism, 'g'));
    if (matches) {
      lookupCount += matches.length;
    }
  });
  
  if (lookupCount > 10) {
    warnings.push(`SPF record may exceed 10 DNS lookups (estimated ${lookupCount}). This could cause validation failures.`);
  }
  
  // Check for deprecated PTR
  if (record.includes('ptr')) {
    warnings.push('PTR mechanism is deprecated and should be avoided.');
  }
  
  return warnings;
}