// Multipart proxy for the partner-onboarding form's image uploads.
// Forwards the incoming form-data to the Infrabox API server's
// /v1/public/partner-directory/upload-asset endpoint and returns the
// Spaces CDN URL the form should persist as logo_url / screenshot_url.

import dns from 'node:dns';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The serverless runtime (Vercel/AWS Lambda) has IPv4-only outbound networking,
// but the API host (api.infrabox.software, behind Cloudflare) is dual-stack and
// advertises an IPv6 (AAAA) address. Without this, Node's fetch can pick the
// IPv6 address and hang on an unroutable connect until undici's 10s timeout
// (UND_ERR_CONNECT_TIMEOUT), surfaced to the form as "upstream-network".
// Forcing IPv4-first resolution makes the upstream call connect immediately.
dns.setDefaultResultOrder('ipv4first');

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

function clientIp(req) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '';
}

export async function POST(req) {
  const apiBase = process.env.INFRABOX_API_BASE_URL;
  if (!apiBase) {
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }

  // Parse incoming multipart in the Edge/Node runtime via formData().
  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'invalid-multipart' }, { status: 400 });
  }

  const file = form.get('file');
  const kind = String(form.get('kind') || 'logo').toLowerCase();
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'no-file' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file-too-large', max: MAX_BYTES }, { status: 400 });
  }
  if (!ALLOWED.has((file.type || '').toLowerCase())) {
    return NextResponse.json({ error: 'unsupported-type' }, { status: 400 });
  }
  if (!['logo', 'screenshot'].includes(kind)) {
    return NextResponse.json({ error: 'bad-kind' }, { status: 400 });
  }

  // Rebuild a clean FormData to forward upstream. This avoids leaking
  // unexpected fields and lets us normalize the `kind` value.
  const upstreamForm = new FormData();
  upstreamForm.append('file', file, file.name || 'upload');
  upstreamForm.append('kind', kind);

  const url = `${apiBase.replace(/\/+$/, '')}/v1/public/partner-directory/upload-asset`;
  let upstream;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      body: upstreamForm,
      headers: {
        // Don't set Content-Type; fetch sets the multipart boundary automatically.
        'X-Forwarded-For': clientIp(req),
      },
    });
  } catch (e) {
    console.error('partner-asset-upload proxy error', e);
    return NextResponse.json({ error: 'upstream-network' }, { status: 502 });
  }

  const json = await upstream.json().catch(() => null);
  if (!upstream.ok) {
    if (upstream.status === 429) {
      return NextResponse.json({ error: 'rate-limited' }, { status: 429 });
    }
    return NextResponse.json(
      { error: json?.error || 'upstream-error', message: json?.message },
      { status: upstream.status }
    );
  }
  return NextResponse.json({ ok: true, url: json?.url, kind });
}
