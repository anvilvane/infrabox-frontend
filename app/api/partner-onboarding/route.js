import { NextResponse } from 'next/server';
import { callPublicApi, ApiError } from '@/lib/infrabox-api';
import { validateOnboarding } from '@/lib/partner-directory-validation';

export const dynamic = 'force-dynamic';

function clientIp(req) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || req.ip || '';
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'validation-failed' }, { status: 400 });
  }

  if (body && typeof body.hp_field === 'string' && body.hp_field.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const { valid, errors } = validateOnboarding(body);
  if (!valid) {
    return NextResponse.json({ error: 'validation-failed', details: errors }, { status: 400 });
  }

  try {
    await callPublicApi('/v1/public/partner-directory/onboarding', body, {
      forwardedFor: clientIp(req),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 429) {
        return NextResponse.json({ error: 'rate-limited' }, { status: 429 });
      }
      if (e.status === 400) {
        return NextResponse.json(
          { error: 'validation-failed', details: e.body?.details || e.body },
          { status: 400 }
        );
      }
    }
    console.error('partner-onboarding proxy error', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
