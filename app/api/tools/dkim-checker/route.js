import { NextResponse } from 'next/server';


const dnsUtils = require('../lib/dns-utils');

// Common DKIM selectors to check
const commonSelectors = [
  // Google (uses date-based selectors)
  '20230601', '20221208', '20210112', '20161025',
  '20240101', '20240601', '20231201',
  'google', // Legacy Google selector
  
  // Generic selectors
  'default', 'selector1', 'selector2',
  'dkim', 'mail', 'email',
  
  // Email service providers
  'k1', 'k2', 'k3', // Mailchimp
  's1', 's2', 'sendgrid', 's1024', 's2048', // SendGrid
  'pic', 'krs', 'mailgun', 'mg', 'mg1', 'mg2', // Mailgun
  'mandrill', 'postmark', 'sparkpost',
  'amazonses', 'aws', 'ses',
  'zoho', 'microsoft', 'outlook',
  
  // Additional common selectors
  'smtp', 'mx', 'mailo', 'cm', 'scph1220', 'scph0819'
];

async function checkDKIMSelector(domain, selector) {
  try {
    const dkimDomain = `${selector}._domainkey.${domain}`;
    const txtRecords = await dnsUtils.resolveTxt(dkimDomain, 5000);
    
    if (txtRecords && txtRecords.length > 0) {
      // Concatenate multiple strings if present
      const record = txtRecords[0].join('');
      
      // Parse and analyze the DKIM record
      const analysis = analyzeDKIMRecord(record);
      
      return {
        selector,
        found: true,
        valid: analysis.valid,
        record,
        analysis
      };
    }
  } catch (error) {
    // Record not found for this selector
    // Log only for debugging in development
    if (process.env.NODE_ENV === 'development' && !error.message.includes('ENODATA') && !error.message.includes('ENOTFOUND')) {
      console.log(`DKIM lookup error for ${selector}._domainkey.${domain}:`, error.message);
    }
  }
  
  return null;
}

function analyzeDKIMRecord(record) {
  const analysis = {
    valid: false,
    keySize: null,
    algorithm: null,
    warnings: []
  };
  
  // Check if it's a valid DKIM record
  if (!record.includes('p=')) {
    analysis.warnings.push('Missing public key (p= tag)');
    return analysis;
  }
  
  // Extract public key
  const keyMatch = record.match(/p=([^;]+)/);
  if (keyMatch && keyMatch[1]) {
    const publicKey = keyMatch[1].replace(/\s/g, '');
    
    // Estimate key size (rough approximation based on base64 length)
    // RSA 1024-bit ≈ 216 chars, 2048-bit ≈ 392 chars
    const keyLength = publicKey.length;
    if (keyLength > 0) {
      analysis.valid = true;
      
      if (keyLength < 200) {
        analysis.keySize = 512;
        analysis.warnings.push('Key size too small (< 1024 bits). Insecure.');
      } else if (keyLength < 350) {
        analysis.keySize = 1024;
        analysis.warnings.push('Consider upgrading to 2048-bit keys for better security.');
      } else {
        analysis.keySize = 2048;
      }
    }
  }
  
  // Check version
  if (record.includes('v=DKIM1')) {
    analysis.version = 'DKIM1';
  }
  
  // Check key type
  const keyTypeMatch = record.match(/k=([^;]+)/);
  if (keyTypeMatch) {
    analysis.algorithm = keyTypeMatch[1];
  } else {
    analysis.algorithm = 'rsa'; // Default
  }
  
  // Check for testing mode
  if (record.includes('t=y')) {
    analysis.warnings.push('DKIM is in testing mode (t=y). Remove for production.');
  }
  
  // Check for service type restrictions
  if (record.includes('s=email')) {
    analysis.service = 'email';
  }
  
  return analysis;
}

async function checkDKIM(domain, selector = null, autoDetect = true) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    const results = {
      domain: cleanDomain,
      records: [],
      selectorsChecked: []
    };
    
    if (selector && !autoDetect) {
      // Check specific selector only
      const result = await checkDKIMSelector(cleanDomain, selector);
      if (result) {
        results.records.push(result);
        results.selectorRequested = selector;
        results.selectorFound = true;
      } else {
        results.selectorRequested = selector;
        results.selectorFound = false;
        results.message = `No DKIM record found for selector '${selector}'`;
      }
      results.selectorsChecked.push(selector);
    } else if (selector && autoDetect) {
      // Check specific selector first, then auto-detect others
      const specificResult = await checkDKIMSelector(cleanDomain, selector);
      if (specificResult) {
        results.records.push(specificResult);
        results.selectorRequested = selector;
        results.selectorFound = true;
      }
      
      // Also check common selectors
      const checkPromises = commonSelectors
        .filter(sel => sel !== selector) // Don't check the same selector twice
        .map(sel => checkDKIMSelector(cleanDomain, sel));
      
      const selectorResults = await Promise.all(checkPromises);
      selectorResults.forEach((result) => {
        if (result) {
          results.records.push(result);
        }
      });
      
      results.selectorsChecked = [selector, ...commonSelectors.filter(sel => sel !== selector)];
      if (!specificResult) {
        results.selectorRequested = selector;
        results.selectorFound = false;
        results.message = `Selector '${selector}' not found, but found ${results.records.length} other DKIM record(s)`;
      }
    } else {
      // Auto-detect by checking common selectors in batches
      // Process in smaller batches to avoid overwhelming DNS servers
      let batchSize = 5;
      const selectorResults = [];
      
      for (let i = 0; i < commonSelectors.length; i += batchSize) {
        const batch = commonSelectors.slice(i, i + batchSize);
        const batchPromises = batch.map(sel => 
          checkDKIMSelector(cleanDomain, sel)
        );
        
        const batchResults = await Promise.all(batchPromises);
        selectorResults.push(...batchResults);
        
        // Stop early if we found enough records
        const foundRecords = selectorResults.filter(r => r !== null);
        if (foundRecords.length >= 2) {
          // We found enough DKIM records, stop checking
          break;
        }
      }
      
      // Filter out null results and add found records
      selectorResults.forEach((result) => {
        if (result) {
          results.records.push(result);
        }
      });
      
      results.selectorsChecked = commonSelectors;
      if (results.records.length === 0) {
        results.message = 'No DKIM records found for any common selectors';
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('DKIM check error:', error);
    
    return {
      domain,
      error: true,
      message: 'Failed to check DKIM records. Please verify the domain name.'
    };
  }
}

export async function POST(request) {
  try {
    const { domain, selector, autoDetect } = await request.json();
    
    if (!domain) {
      return NextResponse.json(
        { error: true, message: 'Domain is required' },
        { status: 400 }
      );
    }
    
    const result = await checkDKIM(domain, selector, autoDetect);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}