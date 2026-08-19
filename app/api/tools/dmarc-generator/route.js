import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const config = await request.json();
    
    // Start with version
    let dmarcRecord = 'v=DMARC1';
    
    // Add policy (required)
    if (config.policy) {
      dmarcRecord += `; p=${config.policy}`;
    } else {
      return NextResponse.json(
        { error: true, message: 'Policy is required' },
        { status: 400 }
      );
    }
    
    // Add subdomain policy if different
    if (config.subdomainPolicy && config.subdomainPolicy !== 'inherit') {
      dmarcRecord += `; sp=${config.subdomainPolicy}`;
    }
    
    // Add percentage if not 100
    if (config.percentage && config.percentage !== '100') {
      dmarcRecord += `; pct=${config.percentage}`;
    }
    
    // Add aggregate reports email
    if (config.aggregateEmail) {
      // Handle multiple emails
      const emails = config.aggregateEmail.split(',').map(e => e.trim());
      const ruaEmails = emails.map(email => `mailto:${email}`).join(',');
      dmarcRecord += `; rua=${ruaEmails}`;
    }
    
    // Add forensic reports email
    if (config.forensicEmail) {
      const emails = config.forensicEmail.split(',').map(e => e.trim());
      const rufEmails = emails.map(email => `mailto:${email}`).join(',');
      dmarcRecord += `; ruf=${rufEmails}`;
    }
    
    // Add failure reporting options
    if (config.failureOptions && config.failureOptions.length > 0) {
      dmarcRecord += `; fo=${config.failureOptions.join(':')}`;
    }
    
    // Add report format
    if (config.reportFormat && config.reportFormat !== 'afrf') {
      dmarcRecord += `; rf=${config.reportFormat}`;
    }
    
    // Add report interval
    if (config.reportInterval && config.reportInterval !== '86400') {
      dmarcRecord += `; ri=${config.reportInterval}`;
    }
    
    // Add SPF alignment
    if (config.spfAlignment && config.spfAlignment !== 'relaxed') {
      dmarcRecord += `; aspf=${config.spfAlignment === 'strict' ? 's' : 'r'}`;
    }
    
    // Add DKIM alignment
    if (config.dkimAlignment && config.dkimAlignment !== 'relaxed') {
      dmarcRecord += `; adkim=${config.dkimAlignment === 'strict' ? 's' : 'r'}`;
    }
    
    // Generate DNS instructions
    const dnsInstructions = {
      type: 'TXT',
      host: '_dmarc',
      value: dmarcRecord,
      ttl: 3600
    };
    
    // Generate implementation plan based on current policy
    const implementationPlan = generateImplementationPlan(config.policy);
    
    return NextResponse.json({
      record: dmarcRecord,
      dnsInstructions,
      implementationPlan,
      warnings: validateDMARCConfig(config)
    });
    
  } catch (error) {
    console.error('DMARC generation error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to generate DMARC record' },
      { status: 500 }
    );
  }
}

function validateDMARCConfig(config) {
  const warnings = [];
  
  if (config.policy === 'reject' && !config.aggregateEmail) {
    warnings.push('Starting with reject policy without monitoring is risky. Add aggregate report email.');
  }
  
  if (config.policy === 'reject' && (!config.percentage || config.percentage === '100')) {
    warnings.push('Consider starting with a lower percentage when using reject policy.');
  }
  
  if (!config.aggregateEmail) {
    warnings.push('No aggregate reports configured. You won\'t receive DMARC reports.');
  }
  
  if (config.spfAlignment === 'strict' && config.dkimAlignment === 'strict') {
    warnings.push('Both alignments set to strict may cause legitimate emails to fail.');
  }
  
  return warnings;
}

function generateImplementationPlan(currentPolicy) {
  const plans = {
    none: [
      'Monitor reports for 2-4 weeks',
      'Identify all legitimate email sources',
      'Add missing sources to SPF/DKIM',
      'Move to quarantine at 25% when ready'
    ],
    quarantine: [
      'Monitor impact on email delivery',
      'Gradually increase percentage',
      'Fix any legitimate email issues',
      'Move to reject when stable'
    ],
    reject: [
      'Monitor for false positives',
      'Maintain SPF and DKIM records',
      'Review reports regularly',
      'Update as email infrastructure changes'
    ]
  };
  
  return plans[currentPolicy] || plans.none;
}