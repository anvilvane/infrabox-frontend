import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { callInternalApi, ApiError } from '@/lib/infrabox-api';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const session = await checkAuth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = {
    status: searchParams.get('status') || undefined,
    q: searchParams.get('q') || undefined,
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
  };

  try {
    const data = await callInternalApi('GET', '/v1/internal/partner-directory/onboarding', { query });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: 'Upstream error', status: e.status },
        { status: e.status >= 400 && e.status < 600 ? e.status : 502 }
      );
    }
    console.error('admin partner-onboarding list error', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
