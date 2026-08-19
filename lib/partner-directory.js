// Server-only helpers for reading the partner catalog from the
// infrabox-api-server. Falls back to the static app/partners/data.js module
// during the migration window so the marketing site keeps working if the
// API is unreachable.
//
// Do not import from client components.

import { callPublicApiGet, ApiError } from './infrabox-api';

const REVALIDATE_SECONDS = 3600;

// Normalize API field names to the shape the UI already consumes (data.js).
// API uses website_url / booking_url / brand_color; UI uses href / book / color.
// New fields (logo_url, screenshot_url) pass through verbatim.
function normalize(p) {
  if (!p) return p;
  return {
    ...p,
    color: p.color || p.brand_color || '',
    book: p.book || p.booking_url || '',
    href: p.href || p.website_url || '',
    logo_url: p.logo_url || '',
    screenshot_url: p.screenshot_url || '',
  };
}

function normalizeGrouped(grouped) {
  const out = { platinum: [], gold: [], growth: [], certified: [] };
  for (const tier of Object.keys(out)) {
    out[tier] = (grouped[tier] || []).map(normalize);
  }
  return out;
}

let staticFallback = null;
async function loadStaticFallback() {
  if (staticFallback) return staticFallback;
  const mod = await import('@/app/partners/data');
  staticFallback = {
    PARTNERS: mod.PARTNERS,
    PARTNER_BY_SLUG: mod.PARTNER_BY_SLUG,
    ALL_SLUGS: mod.ALL_SLUGS,
  };
  return staticFallback;
}

function shouldFallback(err) {
  if (err instanceof ApiError) {
    // Config missing or upstream unreachable - fall back to static data.
    if (err.status === 0 || err.status >= 500) return true;
  }
  return false;
}

export async function getPartners() {
  try {
    const data = await callPublicApiGet(
      '/v1/public/partner-directory/partners',
      { revalidate: REVALIDATE_SECONDS }
    );
    if (data && data.partners) return normalizeGrouped(data.partners);
    throw new ApiError(502, { error: 'unexpected-shape' });
  } catch (err) {
    if (!shouldFallback(err)) throw err;
    const { PARTNERS } = await loadStaticFallback();
    return PARTNERS;
  }
}

export async function getPartnerBySlug(slug) {
  if (!slug || !/^[a-z0-9-]+$/.test(String(slug))) return null;
  try {
    const data = await callPublicApiGet(
      `/v1/public/partner-directory/partners/${encodeURIComponent(slug)}`,
      { revalidate: REVALIDATE_SECONDS }
    );
    return data && data.partner ? normalize(data.partner) : null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    if (!shouldFallback(err)) throw err;
    const { PARTNER_BY_SLUG } = await loadStaticFallback();
    return PARTNER_BY_SLUG[slug] || null;
  }
}

export async function getAllSlugs() {
  try {
    const partners = await getPartners();
    const out = [];
    for (const tier of Object.keys(partners)) {
      for (const p of partners[tier] || []) {
        if (p.slug) out.push(p.slug);
      }
    }
    return out;
  } catch {
    const { ALL_SLUGS } = await loadStaticFallback();
    return ALL_SLUGS;
  }
}
