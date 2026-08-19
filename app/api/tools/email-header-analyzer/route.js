import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { headers } = await request.json();
    
    if (!headers) {
      return NextResponse.json(
        { error: true, message: 'Email headers are required' },
        { status: 400 }
      );
    }
    
    const analysis = analyzeEmailHeaders(headers);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Header analysis error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to analyze email headers' },
      { status: 500 }
    );
  }
}

function analyzeEmailHeaders(headers) {
  const lines = headers.split('\n').map(line => line.trim()).filter(Boolean);
  const parsedHeaders = {};
  const analysis = {
    authentication: {
      spf: null,
      dkim: null,
      dmarc: null,
      arc: null
    },
    routing: {
      hops: [],
      totalTime: null,
      path: []
    },
    security: {
      tls: [],
      encryption: false,
      warnings: []
    },
    metadata: {
      from: null,
      to: null,
      subject: null,
      date: null,
      messageId: null,
      returnPath: null
    },
    spam: {
      score: null,
      status: null,
      tests: []
    },
    recommendations: []
  };
  
  // Parse headers
  let currentHeader = '';
  let currentValue = '';
  
  for (const line of lines) {
    if (line.match(/^[A-Za-z-]+:/)) {
      if (currentHeader) {
        parsedHeaders[currentHeader] = currentValue.trim();
      }
      const colonIndex = line.indexOf(':');
      currentHeader = line.substring(0, colonIndex).toLowerCase();
      currentValue = line.substring(colonIndex + 1).trim();
    } else {
      currentValue += ' ' + line;
    }
  }
  if (currentHeader) {
    parsedHeaders[currentHeader] = currentValue.trim();
  }
  
  // Analyze authentication
  if (parsedHeaders['authentication-results']) {
    const authResults = parsedHeaders['authentication-results'];
    
    // SPF
    const spfMatch = authResults.match(/spf=(\w+)/);
    if (spfMatch) {
      analysis.authentication.spf = {
        result: spfMatch[1],
        pass: spfMatch[1] === 'pass',
        details: extractAuthDetails(authResults, 'spf')
      };
    }
    
    // DKIM
    const dkimMatch = authResults.match(/dkim=(\w+)/);
    if (dkimMatch) {
      analysis.authentication.dkim = {
        result: dkimMatch[1],
        pass: dkimMatch[1] === 'pass',
        details: extractAuthDetails(authResults, 'dkim')
      };
    }
    
    // DMARC
    const dmarcMatch = authResults.match(/dmarc=(\w+)/);
    if (dmarcMatch) {
      analysis.authentication.dmarc = {
        result: dmarcMatch[1],
        pass: dmarcMatch[1] === 'pass',
        details: extractAuthDetails(authResults, 'dmarc')
      };
    }
  }
  
  // Analyze routing (Received headers)
  const receivedHeaders = [];
  for (const [key, value] of Object.entries(parsedHeaders)) {
    if (key === 'received') {
      receivedHeaders.push(value);
    }
  }
  
  receivedHeaders.forEach((received, index) => {
    const hop = {
      number: index + 1,
      server: extractServer(received),
      timestamp: extractTimestamp(received),
      protocol: extractProtocol(received),
      tls: received.includes('TLS') || received.includes('ESMTPS')
    };
    analysis.routing.hops.push(hop);
    
    if (hop.tls) {
      analysis.security.encryption = true;
    }
  });
  
  // Calculate total delivery time
  if (analysis.routing.hops.length > 0) {
    const firstHop = analysis.routing.hops[0];
    const lastHop = analysis.routing.hops[analysis.routing.hops.length - 1];
    if (firstHop.timestamp && lastHop.timestamp) {
      const timeDiff = new Date(lastHop.timestamp) - new Date(firstHop.timestamp);
      analysis.routing.totalTime = Math.round(timeDiff / 1000) + ' seconds';
    }
  }
  
  // Extract metadata
  analysis.metadata.from = parsedHeaders['from'] || null;
  analysis.metadata.to = parsedHeaders['to'] || null;
  analysis.metadata.subject = parsedHeaders['subject'] || null;
  analysis.metadata.date = parsedHeaders['date'] || null;
  analysis.metadata.messageId = parsedHeaders['message-id'] || null;
  analysis.metadata.returnPath = parsedHeaders['return-path'] || null;
  
  // Check for spam headers
  if (parsedHeaders['x-spam-score']) {
    analysis.spam.score = parsedHeaders['x-spam-score'];
  }
  if (parsedHeaders['x-spam-status']) {
    analysis.spam.status = parsedHeaders['x-spam-status'];
  }
  if (parsedHeaders['x-spam-report']) {
    analysis.spam.tests = parseSpamTests(parsedHeaders['x-spam-report']);
  }
  
  // Generate security warnings
  if (!analysis.authentication.spf || !analysis.authentication.spf.pass) {
    analysis.security.warnings.push('SPF check failed or missing');
  }
  if (!analysis.authentication.dkim || !analysis.authentication.dkim.pass) {
    analysis.security.warnings.push('DKIM signature invalid or missing');
  }
  if (!analysis.authentication.dmarc || !analysis.authentication.dmarc.pass) {
    analysis.security.warnings.push('DMARC check failed or missing');
  }
  if (!analysis.security.encryption) {
    analysis.security.warnings.push('Email was not encrypted during transit');
  }
  
  // Generate recommendations
  if (analysis.security.warnings.length > 0) {
    analysis.recommendations.push({
      level: 'warning',
      message: 'Authentication issues detected',
      action: 'Review SPF, DKIM, and DMARC configuration'
    });
  }
  
  if (analysis.routing.hops.length > 10) {
    analysis.recommendations.push({
      level: 'info',
      message: 'Unusually high number of routing hops',
      action: 'May indicate forwarding or relay issues'
    });
  }
  
  if (analysis.spam.score && parseFloat(analysis.spam.score) > 5) {
    analysis.recommendations.push({
      level: 'warning',
      message: 'High spam score detected',
      action: 'Review email content and authentication'
    });
  }
  
  return analysis;
}

function extractAuthDetails(authResults, type) {
  const regex = new RegExp(`${type}=([^;]+)(?:.*?\\(([^)]+)\\))?`);
  const match = authResults.match(regex);
  if (match) {
    return {
      result: match[1],
      details: match[2] || ''
    };
  }
  return null;
}

function extractServer(received) {
  const match = received.match(/from\s+([^\s]+)/);
  return match ? match[1] : 'Unknown';
}

function extractTimestamp(received) {
  const match = received.match(/;\s*(.+)$/);
  return match ? match[1] : null;
}

function extractProtocol(received) {
  if (received.includes('ESMTPS')) return 'ESMTPS';
  if (received.includes('ESMTP')) return 'ESMTP';
  if (received.includes('SMTP')) return 'SMTP';
  if (received.includes('HTTP')) return 'HTTP';
  return 'Unknown';
}

function parseSpamTests(spamReport) {
  const tests = [];
  const testMatches = spamReport.match(/\*\s*([0-9.-]+)\s+([A-Z_]+)/g);
  if (testMatches) {
    testMatches.forEach(test => {
      const parts = test.match(/\*\s*([0-9.-]+)\s+([A-Z_]+)/);
      if (parts) {
        tests.push({
          score: parseFloat(parts[1]),
          name: parts[2]
        });
      }
    });
  }
  return tests;
}