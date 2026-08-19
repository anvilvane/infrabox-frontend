import { NextResponse } from 'next/server';


const dnsUtils = require('../../tools/lib/dns-utils');

// Comprehensive list of blacklists to check
const BLACKLISTS = [
  // Major blacklists
  { name: 'zen.spamhaus.org', delistUrl: 'https://www.spamhaus.org/lookup/' },
  { name: 'bl.spamcop.net', delistUrl: 'https://www.spamcop.net/bl.shtml' },
  { name: 'b.barracudacentral.org', delistUrl: 'https://www.barracudacentral.org/rbl/removal-request' },
  { name: 'dnsbl.sorbs.net', delistUrl: 'http://www.sorbs.net/lookup.shtml' },
  { name: 'spam.dnsbl.sorbs.net', delistUrl: 'http://www.sorbs.net/lookup.shtml' },
  { name: 'dul.dnsbl.sorbs.net', delistUrl: 'http://www.sorbs.net/lookup.shtml' },
  { name: 'psbl.surriel.com', delistUrl: 'https://psbl.org/listing' },
  { name: 'ubl.unsubscore.com', delistUrl: 'https://www.unsubscore.com/' },
  { name: 'rbl.interserver.net', delistUrl: null },
  { name: 'black.uribl.com', delistUrl: 'https://admin.uribl.com/' },
  { name: 'grey.uribl.com', delistUrl: 'https://admin.uribl.com/' },
  { name: 'multi.uribl.com', delistUrl: 'https://admin.uribl.com/' },
  { name: 'cbl.abuseat.org', delistUrl: 'https://www.abuseat.org/lookup.cgi' },
  { name: 'dnsbl-1.uceprotect.net', delistUrl: 'http://www.uceprotect.net/en/rblcheck.php' },
  { name: 'dnsbl-2.uceprotect.net', delistUrl: 'http://www.uceprotect.net/en/rblcheck.php' },
  { name: 'dnsbl-3.uceprotect.net', delistUrl: 'http://www.uceprotect.net/en/rblcheck.php' },
  { name: 'db.wpbl.info', delistUrl: 'http://www.wpbl.info/remove.php' },
  
  // Additional blacklists
  { name: 'dnsbl.spfbl.net', delistUrl: 'https://spfbl.net/delist/' },
  { name: 'all.s5h.net', delistUrl: null },
  { name: 'rbl.efnetrbl.org', delistUrl: 'https://efnetrbl.org/' },
  { name: 'dnsbl.justspam.org', delistUrl: null },
  { name: 'blacklist.woody.ch', delistUrl: 'http://woody.ch/block/spam/remove.html' },
  { name: 'combined.abuse.ch', delistUrl: 'https://abuse.ch/' },
  { name: 'rbl.megarbl.net', delistUrl: 'https://www.megarbl.net/remove' },
  { name: 'multi.surbl.org', delistUrl: 'http://www.surbl.org/surbl-analysis' },
  { name: 'ix.dnsbl.manitu.net', delistUrl: 'http://www.dnsbl.manitu.net/lookup.php' },
  { name: 'tor.dan.me.uk', delistUrl: null },
  { name: 'rbl.orbitrbl.com', delistUrl: null },
  { name: 'truncate.gbudb.net', delistUrl: null },
  { name: 'dnsbl.cyberlogic.net', delistUrl: null },
];

async function checkBlacklistDetailed(domain) {
  try {
    // First resolve domain to IP
    let ip;
    try {
      const addresses = await dnsUtils.resolve4(domain, 5000);
      if (!addresses || addresses.length === 0) {
        return {
          error: true,
          message: 'Could not resolve domain to IP address'
        };
      }
      ip = addresses[0];
    } catch (error) {
      return {
        error: true,
        message: 'Could not resolve domain to IP address'
      };
    }
    
    // Reverse IP for DNSBL queries
    const reversedIp = ip.split('.').reverse().join('.');
    
    // Check all blacklists in parallel batches to avoid overwhelming
    const batchSize = 10;
    const results = [];
    
    for (let i = 0; i < BLACKLISTS.length; i += batchSize) {
      const batch = BLACKLISTS.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (blacklist) => {
          const query = `${reversedIp}.${blacklist.name}`;
          try {
            const result = await dnsUtils.resolve4(query, 3000);
            // If the query resolves, the IP IS listed on this blacklist
            // DNSBL returns an IP (usually 127.0.0.x) when listed
            if (result && result.length > 0) {
              const returnedIp = result[0];
              if (returnedIp.startsWith('127.0.0.')) {
                return { 
                  blacklist: blacklist.name, 
                  listed: true,
                  delistUrl: blacklist.delistUrl
                };
              }
            }
            return { 
              blacklist: blacklist.name, 
              listed: false,
              delistUrl: blacklist.delistUrl
            };
          } catch (error) {
            // NXDOMAIN or timeout means NOT listed - this is the normal case
            return { 
              blacklist: blacklist.name, 
              listed: false,
              delistUrl: blacklist.delistUrl
            };
          }
        })
      );
      
      results.push(...batchResults);
    }
    
    const listedOn = results.filter(r => r.listed);
    const cleanOn = results.filter(r => !r.listed);
    
    return {
      domain,
      ip,
      totalChecked: results.length,
      listed: listedOn.length,
      clean: cleanOn.length,
      results: results.sort((a, b) => {
        // Sort listed ones first
        if (a.listed && !b.listed) return -1;
        if (!a.listed && b.listed) return 1;
        return a.blacklist.localeCompare(b.blacklist);
      }),
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Blacklist check error:', error);
    return {
      error: true,
      message: 'Failed to check blacklists',
      details: error.message
    };
  }
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
    
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').trim();
    
    const result = await checkBlacklistDetailed(cleanDomain);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}