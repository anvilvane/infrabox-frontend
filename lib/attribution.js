/**
 * Ad Attribution Capture & Forwarding (marketing site)
 * ----------------------------------------------------
 * PROBLEM THIS SOLVES:
 *   Google Ads appends ?gclid=...&utm_source=google&utm_medium=cpc to the
 *   landing URL. Previously every CTA on infrabox.software was a HARDCODED link to
 *   app.infrabox.software/signup?utm_source=hero_cta&utm_medium=button&... so the
 *   real gclid + ad UTMs were dropped at the first click and the utm_* fields
 *   were overwritten by internal button labels. Result: users.gclid was always
 *   null and utm_source was always an internal CTA label.
 *
 * WHAT THIS DOES:
 *   1. captureAttribution(): on landing, if the URL carries ad params, store
 *      them in a first-party cookie on `.infrabox.software` (readable by both
 *      infrabox.software and app.infrabox.software). Last paid click wins.
 *   2. decorateUrl(href): for any app.infrabox.software link, merge the stored ad
 *      attribution into the URL. The pre-existing internal utm_source label
 *      (hero_cta, header_cta, ...) is preserved under a separate `cta` param so
 *      internal analytics keeps working WITHOUT polluting real ad attribution.
 *
 * Pairs with AttributionForwarder.js which wires this to real DOM clicks.
 */

export const AD_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

// Params that signal a genuine paid/ad click (presence triggers capture).
const CLICK_ID_PARAMS = ["gclid", "gbraid", "wbraid"];

const COOKIE_NAME = "ik_attr";
const COOKIE_MAX_AGE_DAYS = 90;
const APP_HOST = "app.infrabox.software";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** Cookie domain: share across *.infrabox.software in prod; omit on localhost/dev. */
function cookieDomainAttr() {
  if (!isBrowser()) return "";
  const host = window.location.hostname || "";
  // Exact apex or a real subdomain only — endsWith("infrabox.software") would also
  // match imposter hosts like "evilinfrabox.software" (browser would then reject the
  // cross-domain cookie and attribution would silently fail).
  const isInfrabox = host === "infrabox.software" || host.endsWith(".infrabox.software");
  return isInfrabox ? "; domain=.infrabox.software" : "";
}

function readCookie(name) {
  if (!isBrowser()) return null;
  const prefix = name + "=";
  const parts = document.cookie ? document.cookie.split(";") : [];
  for (const part of parts) {
    const c = part.trim();
    if (c.startsWith(prefix)) {
      try {
        return decodeURIComponent(c.slice(prefix.length));
      } catch {
        return c.slice(prefix.length);
      }
    }
  }
  return null;
}

function writeCookie(name, value) {
  if (!isBrowser()) return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}` +
    `; SameSite=Lax${cookieDomainAttr()}`;
}

/**
 * Read ad params from the current URL and persist them if this looks like an
 * ad-originated visit. A visit counts as ad-originated if it carries a click id
 * (gclid/gbraid/wbraid) OR a utm_source that is NOT one of our internal labels.
 * Safe to call on every page load; only writes when new ad data is present.
 */
export function captureAttribution() {
  if (!isBrowser()) return getStoredAttribution();

  let params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return getStoredAttribution();
  }

  const hasClickId = CLICK_ID_PARAMS.some((p) => params.get(p));
  const urlUtmSource = params.get("utm_source");
  const hasExternalUtm = !!urlUtmSource && !isInternalLabel(urlUtmSource);

  if (!hasClickId && !hasExternalUtm) {
    // Not an ad visit — keep whatever was captured earlier (first paid touch).
    return getStoredAttribution();
  }

  const captured = {};
  for (const key of AD_PARAMS) {
    const val = params.get(key);
    if (val) captured[key] = val;
  }
  captured._ts = Date.now();

  try {
    writeCookie(COOKIE_NAME, JSON.stringify(captured));
  } catch {
    /* ignore quota / disabled cookies */
  }
  return captured;
}

/** Parse the stored attribution cookie into an object ({} if none). */
export function getStoredAttribution() {
  const raw = readCookie(COOKIE_NAME);
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

/** Internal CTA labels that must never occupy utm_source for ad attribution. */
function isInternalLabel(value) {
  return /_cta$|_login$|^navbar$|^calculator$|^cta_bottom$|^whats_new$|^calendar_demo|^inbox_demo/i.test(
    String(value || "")
  );
}

/**
 * Merge stored ad attribution into an app.infrabox.software URL.
 * - Only modifies links pointing at the app host.
 * - When stored ad attribution exists, the link's existing internal utm_source
 *   (e.g. hero_cta) is moved to a `cta` param, then the real gclid/UTMs are set.
 * - When no ad attribution exists, the URL is returned unchanged (organic users
 *   keep their internal utm labels for backward-compatible analytics).
 *
 * Idempotent: re-running with the same stored data yields the same URL.
 */
export function decorateUrl(href) {
  if (!href || typeof href !== "string") return href;

  let url;
  try {
    url = new URL(href, isBrowser() ? window.location.href : undefined);
  } catch {
    return href;
  }
  if (url.hostname !== APP_HOST) return href;

  const stored = getStoredAttribution();
  const hasAd =
    CLICK_ID_PARAMS.some((p) => stored[p]) ||
    (stored.utm_source && !isInternalLabel(stored.utm_source));
  if (!hasAd) return href;

  // Preserve the internal label (if the link carried one) under `cta`.
  const existingUtmSource = url.searchParams.get("utm_source");
  if (existingUtmSource && isInternalLabel(existingUtmSource) && !url.searchParams.get("cta")) {
    url.searchParams.set("cta", existingUtmSource);
  }

  // Strip ALL internal utm_* off the link before applying real ad attribution.
  // Google auto-tagging only appends `gclid` (no utm_*), so `stored` usually has
  // gclid alone. Without this delete, the hardcoded link's internal labels
  // (utm_source=hero_cta, utm_medium=button, utm_campaign=landing) survive and
  // get saved to users.utm_* — making every ad signup look like it came from a
  // CTA button instead of the ad. Deleting first guarantees only the real
  // captured ad params (whatever Google/tracking-template provided) remain.
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    url.searchParams.delete(key);
  }

  // Apply the real ad attribution captured from the paid click.
  for (const key of AD_PARAMS) {
    if (stored[key]) url.searchParams.set(key, stored[key]);
  }

  return url.toString();
}

/** Read the GA4 client_id from the `_ga` cookie ("GA1.1.X.Y" -> "X.Y"). */
export function getGaClientId() {
  const ga = readCookie("_ga");
  if (!ga) return "";
  const parts = ga.split(".");
  return parts.length >= 4
    ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
    : "";
}

/**
 * Build a Calendly embed URL carrying ad attribution so a booked call can be
 * tied back to the ad + the invitee email (returned on the invitee.created
 * webhook). Calendly returns these in its `tracking` object.
 * Mapping (must match the backend webhook controller):
 *   utm_source/medium/campaign/term/content → original UTMs (left free)
 *   salesforce_uuid → gclid (Calendly has no gclid field, so we thread it here)
 * The captured {email, gclid} drives a gclid-based Google Ads offline conversion.
 */
export function buildCalendlyUrl(baseUrl) {
  if (!isBrowser() || !baseUrl) return baseUrl;
  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    return baseUrl;
  }
  const stored = getStoredAttribution();
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    if (stored[key]) url.searchParams.set(key, stored[key]);
  }
  // Thread gclid through salesforce_uuid (the only spare field Calendly returns).
  if (stored.gclid) url.searchParams.set("salesforce_uuid", stored.gclid);
  return url.toString();
}

const attribution = {
  captureAttribution,
  getStoredAttribution,
  decorateUrl,
  getGaClientId,
  buildCalendlyUrl,
  AD_PARAMS,
};
export default attribution;
