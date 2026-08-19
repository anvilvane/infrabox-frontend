import { NextResponse } from 'next/server';


const dnsUtils = require('../lib/dns-utils');

async function checkDNSRecords(domain) {
  try {
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
    
    const results = {
      domain: cleanDomain,
      records: {
        A: [],
        AAAA: [],
        MX: [],
        TXT: [],
        NS: [],
        CNAME: [],
        SOA: null,
        CAA: []
      },
      emailRecords: {
        spf: null,
        dkim: [],
        dmarc: null,
        bimi: null,
        mta_sts: null,
        tls_rpt: null
      },
      analysis: {
        hasWebsite: false,
        hasEmail: false,
        hasIPv6: false,
        hasDNSSEC: false,
        hasCAA: false
      },
      warnings: [],
      recommendations: []
    };
    
    // Check A records
    try {
      const aRecords = await dnsUtils.resolve4(cleanDomain, 5000);
      results.records.A = aRecords;
      results.analysis.hasWebsite = aRecords.length > 0;
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check AAAA records (IPv6)
    try {
      const aaaaRecords = await dnsUtils.resolve6(cleanDomain, 5000);
      results.records.AAAA = aaaaRecords;
      results.analysis.hasIPv6 = aaaaRecords.length > 0;
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check MX records
    try {
      const mxRecords = await dnsUtils.resolveMx(cleanDomain, 5000);
      results.records.MX = mxRecords.map(mx => ({
        priority: mx.priority,
        exchange: mx.exchange
      }));
      results.analysis.hasEmail = mxRecords.length > 0;
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check TXT records
    try {
      const txtRecords = await dnsUtils.resolveTxt(cleanDomain, 5000);
      results.records.TXT = txtRecords.map(record => record.join(''));
      
      // Parse email authentication records
      for (const record of results.records.TXT) {
        if (record.startsWith('v=spf1')) {
          results.emailRecords.spf = record;
        }
        if (record.includes('v=DKIM1')) {
          results.emailRecords.dkim.push({ selector: 'found', record });
        }
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check NS records
    try {
      const nsRecords = await dnsUtils.resolveNs(cleanDomain, 5000);
      results.records.NS = nsRecords;
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check CNAME records
    try {
      const cnameRecords = await dnsUtils.resolveCname(cleanDomain, 5000);
      results.records.CNAME = [cnameRecords];
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check SOA record
    try {
      const soaRecord = await dnsUtils.resolveSoa(cleanDomain, 5000);
      results.records.SOA = soaRecord;
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check CAA records
    try {
      const caaRecords = await dnsUtils.resolveCaa(cleanDomain, 5000);
      results.records.CAA = caaRecords;
      results.analysis.hasCAA = caaRecords.length > 0;
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check email-specific subdomains
    
    // DMARC
    try {
      const dmarcRecords = await dnsUtils.resolveTxt(`_dmarc.${cleanDomain}`, 5000);
      for (const record of dmarcRecords) {
        const txt = record.join('');
        if (txt.startsWith('v=DMARC1')) {
          results.emailRecords.dmarc = txt;
        }
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // BIMI
    try {
      const bimiRecords = await dnsUtils.resolveTxt(`default._bimi.${cleanDomain}`, 5000);
      for (const record of bimiRecords) {
        const txt = record.join('');
        if (txt.includes('v=BIMI1')) {
          results.emailRecords.bimi = txt;
        }
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // MTA-STS
    try {
      const stsRecords = await dnsUtils.resolveTxt(`_mta-sts.${cleanDomain}`, 5000);
      for (const record of stsRecords) {
        const txt = record.join('');
        if (txt.includes('v=STSv1')) {
          results.emailRecords.mta_sts = txt;
        }
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // TLS-RPT
    try {
      const tlsRptRecords = await dnsUtils.resolveTxt(`_smtp._tls.${cleanDomain}`, 5000);
      for (const record of tlsRptRecords) {
        const txt = record.join('');
        if (txt.includes('v=TLSRPTv1')) {
          results.emailRecords.tls_rpt = txt;
        }
      }
    } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    
    // Check common DKIM selectors
    const dkimSelectors = ['google', 'default', 'selector1', 'selector2', 'dkim', 'mail'];
    for (const selector of dkimSelectors) {
      try {
        const dkimRecords = await dnsUtils.resolveTxt(`${selector}._domainkey.${cleanDomain}`, 5000);
        for (const record of dkimRecords) {
          const txt = record.join('');
          if (txt.includes('p=')) {
            results.emailRecords.dkim.push({
              selector,
              record: txt.substring(0, 100) + (txt.length > 100 ? '...' : '')
            });
          }
        }
      } catch (e) {
      // Error handled silently - DNS lookup failed
    }
    }
    
    // Generate warnings and recommendations
    if (!results.analysis.hasEmail && results.records.MX.length === 0) {
      results.warnings.push('No MX records found - email delivery will not work');
    }
    
    if (results.analysis.hasEmail && !results.emailRecords.spf) {
      results.recommendations.push('Add SPF record to prevent email spoofing');
    }
    
    if (results.analysis.hasEmail && results.emailRecords.dkim.length === 0) {
      results.recommendations.push('Configure DKIM signing for email authentication');
    }
    
    if (results.analysis.hasEmail && !results.emailRecords.dmarc) {
      results.recommendations.push('Implement DMARC policy for complete email protection');
    }
    
    if (!results.analysis.hasCAA) {
      results.recommendations.push('Consider adding CAA records to control certificate issuance');
    }
    
    if (!results.analysis.hasIPv6) {
      results.recommendations.push('Consider adding AAAA records for IPv6 support');
    }
    
    return results;
    
  } catch (error) {
    console.error('DNS check error:', error);
    return {
      domain,
      error: true,
      message: 'Failed to check DNS records'
    };
  }
}

export async function POST(request) {
  try {
    // Support both query params and body
    const url = new URL(request.url);
    let domain = url.searchParams.get('domain');

    // If not in query params, try body
    if (!domain) {
      try {
        const body = await request.json();
        domain = body.domain;
      } catch (e) {
        // No body provided
      }
    }

    if (!domain) {
      return NextResponse.json(
        { error: true, message: 'Domain is required' },
        { status: 400 }
      );
    }

    const result = await checkDNSRecords(domain);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET requests with query params
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: true, message: 'Domain is required. Use ?domain=example.com' },
        { status: 400 }
      );
    }

    const result = await checkDNSRecords(domain);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}