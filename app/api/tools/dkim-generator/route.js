import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const config = await request.json();
    
    // Generate key pair if requested
    let publicKey = config.publicKey;
    let privateKey = config.privateKey;
    
    if (config.generateKeys) {
      const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: parseInt(config.keySize) || 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });
      
      // Convert public key to DKIM format (remove headers and newlines)
      publicKey = pubKey
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\n/g, '');
      
      privateKey = privKey;
    }
    
    // Build DKIM record
    let dkimRecord = 'v=DKIM1';
    
    // Add key type
    if (config.keyType && config.keyType !== 'rsa') {
      dkimRecord += `; k=${config.keyType}`;
    }
    
    // Add hash algorithms
    if (config.hashAlgorithms && config.hashAlgorithms.length > 0) {
      dkimRecord += `; h=${config.hashAlgorithms.join(':')}`;
    }
    
    // Add service types
    if (config.serviceTypes && config.serviceTypes.length > 0) {
      dkimRecord += `; s=${config.serviceTypes.join(':')}`;
    }
    
    // Add notes
    if (config.notes) {
      dkimRecord += `; n=${config.notes}`;
    }
    
    // Add flags
    if (config.flags && config.flags.length > 0) {
      dkimRecord += `; t=${config.flags.join(':')}`;
    }
    
    // Add public key
    if (publicKey) {
      dkimRecord += `; p=${publicKey}`;
    } else {
      return NextResponse.json(
        { error: true, message: 'Public key is required' },
        { status: 400 }
      );
    }
    
    // DNS configuration
    const dnsInstructions = {
      type: 'TXT',
      host: `${config.selector || 'default'}._domainkey`,
      value: dkimRecord,
      ttl: 3600
    };
    
    // Provider-specific instructions
    const providerInstructions = getProviderInstructions(config.provider);
    
    // Implementation steps
    const implementationSteps = [
      'Add the DKIM record to your DNS',
      'Configure your email service to sign with DKIM',
      'Test DKIM signing with a test email',
      'Verify DKIM passes in email headers',
      'Monitor DMARC reports for DKIM alignment'
    ];
    
    // Warnings
    const warnings = validateDKIMConfig(config, dkimRecord);
    
    return NextResponse.json({
      record: dkimRecord,
      privateKey: config.generateKeys ? privateKey : null,
      dnsInstructions,
      providerInstructions,
      implementationSteps,
      warnings,
      recordLength: dkimRecord.length
    });
    
  } catch (error) {
    console.error('DKIM generation error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to generate DKIM record' },
      { status: 500 }
    );
  }
}

function validateDKIMConfig(config, record) {
  const warnings = [];
  
  if (config.keySize && parseInt(config.keySize) < 2048) {
    warnings.push('Key size less than 2048 bits is considered weak. Use 2048 or higher.');
  }
  
  if (record.length > 255) {
    warnings.push(`Record is ${record.length} characters. DNS TXT records longer than 255 characters need to be split into multiple strings.`);
  }
  
  if (!config.selector || config.selector === 'default') {
    warnings.push('Using "default" selector. Consider using a unique selector for key rotation.');
  }
  
  if (config.flags && config.flags.includes('y')) {
    warnings.push('Testing mode (t=y) is enabled. This key should not be used in production.');
  }
  
  return warnings;
}

function getProviderInstructions(provider) {
  const instructions = {
    google: {
      name: 'Google Workspace',
      steps: [
        'Go to Google Admin Console',
        'Navigate to Apps > Google Workspace > Gmail',
        'Click "Authenticate email"',
        'Generate DKIM key or use the one provided',
        'Add the record to your DNS',
        'Return to Google Admin and click "Start Authentication"'
      ],
      selector: 'google',
      keySize: '2048'
    },
    microsoft: {
      name: 'Microsoft 365',
      steps: [
        'Go to Microsoft 365 Admin Center',
        'Navigate to Settings > Domains',
        'Select your domain',
        'Click "Manage DNS"',
        'Enable DKIM signing',
        'Copy the CNAME records provided',
        'Add to your DNS provider'
      ],
      selector: 'selector1 and selector2',
      keySize: '2048'
    },
    sendgrid: {
      name: 'SendGrid',
      steps: [
        'Log in to SendGrid',
        'Go to Settings > Sender Authentication',
        'Click "Authenticate Your Domain"',
        'Choose your DNS provider',
        'Copy the DKIM records',
        'Add to your DNS',
        'Verify in SendGrid'
      ],
      selector: 's1 and s2',
      keySize: '2048'
    },
    mailchimp: {
      name: 'Mailchimp',
      steps: [
        'Go to Account Settings',
        'Click "Verified Domains"',
        'Add your domain',
        'Copy the DKIM record',
        'Add to your DNS',
        'Click "Verify Domain"'
      ],
      selector: 'k1',
      keySize: '2048'
    },
    generic: {
      name: 'Generic Email Service',
      steps: [
        'Check your email service documentation',
        'Generate or obtain DKIM keys',
        'Add the public key to DNS',
        'Configure your mail server to sign emails',
        'Test with a DKIM validator'
      ],
      selector: 'default',
      keySize: '2048'
    }
  };
  
  return instructions[provider] || instructions.generic;
}