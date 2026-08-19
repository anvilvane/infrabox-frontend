import { NextResponse } from 'next/server';
import { callPublicApi, ApiError } from '@/lib/infrabox-api';
import { validateContact } from '@/lib/partner-directory-validation';
import { PARTNER_BY_SLUG } from '@/app/partners/data';

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

  // Honeypot: silently accept without forwarding.
  if (body && typeof body.hp_field === 'string' && body.hp_field.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const { valid, errors } = validateContact(body);
  if (!valid) {
    return NextResponse.json({ error: 'validation-failed', details: errors }, { status: 400 });
  }

  const slug = String(body.partnerSlug).toLowerCase();
  const partner = PARTNER_BY_SLUG[slug];
  if (!partner) {
    return NextResponse.json(
      { error: 'validation-failed', details: { partnerSlug: 'Unknown partner' } },
      { status: 400 }
    );
  }

  const payload = {
    name: body.name,
    email: body.email,
    company: body.company || '',
    website: body.website || '',
    volume: body.volume,
    message: body.message,
    partner_name: partner.name,
    partner_tier: partner.tier,
  };

  try {
    await callPublicApi(
      `/v1/public/partner-directory/${encodeURIComponent(slug)}/contact`,
      payload,
      { forwardedFor: clientIp(req) }
    );
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
    console.error('partner-contact proxy error', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
