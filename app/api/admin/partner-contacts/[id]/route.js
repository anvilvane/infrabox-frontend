import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { callInternalApi, ApiError } from '@/lib/infrabox-api';

export const dynamic = 'force-dynamic';

const ALLOWED_PATCH_FIELDS = ['status', 'notes'];

function forwardError(e) {
  if (e instanceof ApiError) {
    return NextResponse.json(
      { error: 'Upstream error', status: e.status, details: e.body },
      { status: e.status >= 400 && e.status < 600 ? e.status : 502 }
    );
  }
  console.error('admin partner-contacts item error', e);
  return NextResponse.json({ error: 'internal' }, { status: 500 });
}

export async function GET(_req, { params }) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const data = await callInternalApi(
      'GET',
      `/v1/internal/partner-directory/contacts/${encodeURIComponent(id)}`
    );
    return NextResponse.json(data);
  } catch (e) {
    return forwardError(e);
  }
}

export async function PATCH(req, { params }) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'validation-failed' }, { status: 400 });
  }
  const patch = {};
  for (const f of ALLOWED_PATCH_FIELDS) {
    if (body[f] !== undefined) patch[f] = body[f];
  }
  try {
    const data = await callInternalApi(
      'PATCH',
      `/v1/internal/partner-directory/contacts/${encodeURIComponent(id)}`,
      { body: patch }
    );
    return NextResponse.json(data);
  } catch (e) {
    return forwardError(e);
  }
}
