// Server-side fetch wrapper for the Express API server (infrabox-api-server).
// Used by Next.js route handlers under app/api/** to proxy submissions and admin reads.
// Never import this from client components.

import dns from 'node:dns';

// Serverless egress (Vercel/AWS Lambda) is IPv4-only, but the API host
// (api.infrabox.software, behind Cloudflare) is dual-stack. Prefer IPv4 so fetch
// doesn't stall ~10s trying the unroutable IPv6 address before failing.
// See the matching note in app/api/partner-asset-upload/route.js.
dns.setDefaultResultOrder('ipv4first');

const API_BASE = process.env.INFRABOX_API_BASE_URL || '';
const INTERNAL_KEY = process.env.INFRABOX_INTERNAL_API_KEY || '';

function buildUrl(path, query) {
  const base = API_BASE.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);
  if (query && typeof query === 'object') {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function readBody(res) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    return await res.text();
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(status, body) {
    super(`Upstream API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

// Public GET — no auth, used for catalog reads (e.g. partner directory).
// `revalidate` lets Next.js ISR cache the upstream response.
export async function callPublicApiGet(path, { query, revalidate } = {}) {
  if (!API_BASE) {
    throw new ApiError(0, { error: 'INFRABOX_API_BASE_URL is not configured' });
  }
  let res;
  try {
    res = await fetch(buildUrl(path, query), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: typeof revalidate === 'number' ? { revalidate } : undefined,
    });
  } catch (e) {
    throw new ApiError(0, { error: 'network', detail: e.message });
  }
  const respBody = await readBody(res);
  if (!res.ok) throw new ApiError(res.status, respBody);
  return respBody;
}

export async function callPublicApi(path, body, { forwardedFor } = {}) {
  if (!API_BASE) {
    throw new ApiError(0, { error: 'INFRABOX_API_BASE_URL is not configured' });
  }
  const headers = { 'Content-Type': 'application/json' };
  if (forwardedFor) headers['X-Forwarded-For'] = forwardedFor;
  let res;
  try {
    res = await fetch(buildUrl(path), {
      method: 'POST',
      headers,
      body: JSON.stringify(body || {}),
      cache: 'no-store',
    });
  } catch (e) {
    throw new ApiError(0, { error: 'network', detail: e.message });
  }
  const respBody = await readBody(res);
  if (!res.ok) throw new ApiError(res.status, respBody);
  return respBody;
}

export async function callInternalApi(method, path, { body, query } = {}) {
  if (!API_BASE) {
    throw new ApiError(0, { error: 'INFRABOX_API_BASE_URL is not configured' });
  }
  if (!INTERNAL_KEY) {
    throw new ApiError(0, { error: 'INFRABOX_INTERNAL_API_KEY is not configured' });
  }
  // The API server's verifyInternalKey middleware reads `x-internal-key` —
  // not Authorization: Bearer. Match that contract.
  const headers = {
    'Content-Type': 'application/json',
    'x-internal-key': INTERNAL_KEY,
  };
  const init = { method, headers, cache: 'no-store' };
  if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
    init.body = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(buildUrl(path, query), init);
  } catch (e) {
    throw new ApiError(0, { error: 'network', detail: e.message });
  }
  const respBody = await readBody(res);
  if (!res.ok) throw new ApiError(res.status, respBody);
  return respBody;
}
