import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const config = await request.json();
    
    // Build BIMI record
    let bimiRecord = 'v=BIMI1';
    
    // Add logo URL (required)
    if (config.logoUrl) {
      // Validate logo URL
      if (!config.logoUrl.startsWith('https://')) {
        return NextResponse.json(
          { error: true, message: 'Logo URL must use HTTPS' },
          { status: 400 }
        );
      }
      bimiRecord += `; l=${config.logoUrl}`;
    } else {
      return NextResponse.json(
        { error: true, message: 'Logo URL is required' },
        { status: 400 }
      );
    }
    
    // Add certificate URL (optional)
    if (config.certificateUrl) {
      if (!config.certificateUrl.startsWith('https://')) {
        return NextResponse.json(
          { error: true, message: 'Certificate URL must use HTTPS' },
          { status: 400 }
        );
      }
      bimiRecord += `; a=${config.certificateUrl}`;
    }
    
    // DNS configuration
    const dnsInstructions = {
      type: 'TXT',
      host: `${config.selector || 'default'}._bimi`,
      value: bimiRecord,
      ttl: 3600
    };
    
    // Check requirements
    const requirements = checkBIMIRequirements(config);
    
    // Implementation steps
    const implementationSteps = generateImplementationSteps(config);
    
    // Provider-specific guidance
    const providerGuidance = getProviderGuidance(config.emailProvider);
    
    return NextResponse.json({
      record: bimiRecord,
      dnsInstructions,
      requirements,
      implementationSteps,
      providerGuidance,
      warnings: generateWarnings(config, requirements)
    });
    
  } catch (error) {
    console.error('BIMI generation error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to generate BIMI record' },
      { status: 500 }
    );
  }
}

function checkBIMIRequirements(config) {
  return {
    logo: {
      hasUrl: !!config.logoUrl,
      isHttps: config.logoUrl?.startsWith('https://'),
      isSvg: config.logoUrl?.includes('.svg'),
      requirements: {
        format: 'SVG Tiny Portable/Secure',
        aspectRatio: '1:1 (square)',
        maxSize: '32KB',
        background: 'Solid color recommended',
        centered: 'Logo should be centered'
      }
    },
    vmc: {
      hasUrl: !!config.certificateUrl,
      isHttps: config.certificateUrl?.startsWith('https://'),
      isPem: config.certificateUrl?.includes('.pem'),
      required: config.emailProvider === 'gmail',
      providers: {
        gmail: 'Required',
        yahoo: 'Optional',
        apple: 'Optional',
        outlook: 'Optional'
      }
    },
    dmarc: {
      required: true,
      minPolicy: 'quarantine',
      description: 'DMARC policy of quarantine or reject required'
    }
  };
}

function generateImplementationSteps(config) {
  const steps = [
    'Ensure DMARC policy is set to quarantine or reject',
    'Prepare logo in SVG Tiny P/S format (square, centered, < 32KB)',
    'Host logo file on HTTPS server with proper CORS headers',
    'Add BIMI TXT record to DNS'
  ];
  
  if (config.certificateUrl || config.emailProvider === 'gmail') {
    steps.push('Obtain Verified Mark Certificate (VMC) from approved CA');
    steps.push('Host VMC file on HTTPS server');
  }
  
  steps.push('Wait 48-72 hours for DNS propagation');
  steps.push('Test with BIMI validators');
  steps.push('Monitor email clients for logo display');
  
  return steps;
}

function getProviderGuidance(provider) {
  const guidance = {
    gmail: {
      name: 'Gmail',
      requirements: [
        'VMC (Verified Mark Certificate) is mandatory',
        'Registered trademark required for VMC',
        'Logo must be in SVG Tiny P/S format',
        'DMARC policy must be quarantine or reject',
        'May take 1-2 weeks after setup to display'
      ],
      vmcProviders: [
        'DigiCert ($1,499/year)',
        'Entrust ($1,000/year)'
      ]
    },
    yahoo: {
      name: 'Yahoo Mail',
      requirements: [
        'VMC is optional but recommended',
        'Logo in SVG format',
        'DMARC policy of quarantine or reject',
        'Usually displays within 48 hours'
      ],
      vmcProviders: []
    },
    apple: {
      name: 'Apple Mail',
      requirements: [
        'Supported in iOS 24+ and macOS Ventura+',
        'VMC optional',
        'Logo in SVG format',
        'DMARC policy required'
      ],
      vmcProviders: []
    },
    outlook: {
      name: 'Outlook',
      requirements: [
        'Currently in pilot/beta phase',
        'Limited availability',
        'Requirements may change'
      ],
      vmcProviders: []
    },
    generic: {
      name: 'General',
      requirements: [
        'DMARC policy of quarantine or reject',
        'Logo in SVG Tiny P/S format',
        'Logo hosted on HTTPS',
        'DNS TXT record at default._bimi.yourdomain.com'
      ],
      vmcProviders: []
    }
  };
  
  return guidance[provider] || guidance.generic;
}

function generateWarnings(config, requirements) {
  const warnings = [];
  
  if (!config.logoUrl?.includes('.svg')) {
    warnings.push('Logo should be in SVG format for BIMI compatibility');
  }
  
  if (config.emailProvider === 'gmail' && !config.certificateUrl) {
    warnings.push('Gmail requires a Verified Mark Certificate (VMC) for logo display');
  }
  
  if (!config.dmarcPolicy || config.dmarcPolicy === 'none') {
    warnings.push('BIMI requires DMARC policy of quarantine or reject to function');
  }
  
  if (config.logoUrl && !config.logoValidated) {
    warnings.push('Ensure logo meets SVG Tiny P/S specifications (square, centered, < 32KB)');
  }
  
  if (!config.trademarkVerified && config.certificateUrl) {
    warnings.push('VMC requires verified trademark ownership');
  }
  
  return warnings;
}