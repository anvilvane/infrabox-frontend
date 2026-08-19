/**
 * Central booking (Calendly) configuration.
 *
 * The site used to hardcode InboxKit's Calendly handle. During the Infrabox rebrand the
 * handle was renamed to `infrabox`, which does not exist on Calendly yet — an embedded
 * iframe pointing at a non-existent handle renders Calendly's own 404 page inside the
 * page, which looks broken.
 *
 * So the handle now comes from an env var and every booking surface falls back to a
 * first-party Infrabox panel (see components/BookingFallback.js) while it is unset.
 * The moment the Calendly account exists, set NEXT_PUBLIC_CALENDLY_HANDLE and every
 * embed switches over — no code change.
 */

export const CALENDLY_HANDLE = process.env.NEXT_PUBLIC_CALENDLY_HANDLE || "";

/** Event slugs under the handle. Overridable so renaming an event type is env-only. */
export const CALENDLY_EVENTS = {
  sales: process.env.NEXT_PUBLIC_CALENDLY_EVENT_SALES || "30min",
  partner:
    process.env.NEXT_PUBLIC_CALENDLY_EVENT_PARTNER || "partner-program-connect",
  audit:
    process.env.NEXT_PUBLIC_CALENDLY_EVENT_AUDIT ||
    "infrabox-fix-your-email-infrastructure",
};

/** True once a Calendly handle is configured. */
export const isBookingConfigured = Boolean(CALENDLY_HANDLE);

// Embed chrome shared by every inline widget — matches the Infrabox brand colour.
const EMBED_PARAMS = {
  hide_gdpr_banner: "1",
  hide_event_type_details: "1",
  background_color: "ffffff",
  text_color: "000000",
  primary_color: "1240cc",
  embed_domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "infrabox.software",
  embed_type: "Inline",
};

/**
 * Full Calendly URL for an event, or `null` when no handle is configured.
 *
 * @param {keyof typeof CALENDLY_EVENTS} event
 * @param {{ embed?: boolean }} [opts] embed:false returns a plain link (no widget params)
 * @returns {string|null}
 */
export function getCalendlyUrl(event = "sales", opts = {}) {
  if (!CALENDLY_HANDLE) return null;
  const slug = CALENDLY_EVENTS[event] || CALENDLY_EVENTS.sales;
  const base = `https://calendly.com/${CALENDLY_HANDLE}/${slug}`;
  if (opts.embed === false) return base;
  return `${base}?${new URLSearchParams(EMBED_PARAMS).toString()}`;
}
