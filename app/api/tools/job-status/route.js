import { NextResponse } from 'next/server';

const { checkJobStatus } = require('../lib/job-queue');

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const jobId = url.searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json(
        { error: true, message: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const status = await checkJobStatus(jobId);
    
    if (status.error) {
      return NextResponse.json(status, { status: 404 });
    }
    
    // Add appropriate cache headers based on status
    const headers = {};
    if (status.status === 'completed' || status.status === 'failed') {
      // Cache completed/failed results for 5 minutes
      headers['Cache-Control'] = 'public, max-age=300';
    } else {
      // Don't cache in-progress jobs
      headers['Cache-Control'] = 'no-cache';
    }
    
    return NextResponse.json(status, { headers });
    
  } catch (error) {
    console.error('Job status check error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to check job status' },
      { status: 500 }
    );
  }
}