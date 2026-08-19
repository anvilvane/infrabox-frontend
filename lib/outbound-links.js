// Outbound link-equity policy.
//
// Infrabox receives dofollow outbound links, as do the client sites featured in our
// published case studies (we credit case-study partners with real link equity back to
// their site). Every other external link (competitors, third-party sources, citations,
// support docs) is nofollow. Centralized here so every template applies the same rule
// consistently.
const DOFOLLOW_HOSTS = [
  "infrabox.software",
  // Case-study client / partner sites.
  "leadhaste.com",
  "anevomarketing.com",
  "outreachbloom.com",
];

/** Returns the rel attribute for an outbound link per the dofollow policy above. */
export function outboundRel(href) {
  let host;
  try {
    host = new URL(href, "https://www.infrabox.software").hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "nofollow noopener noreferrer";
  }
  const dofollow = DOFOLLOW_HOSTS.some((d) => host === d || host.endsWith(`.${d}`));
  return dofollow ? "noopener noreferrer" : "nofollow noopener noreferrer";
}

/** True only for Infrabox and case-study partner sites. */
export function isDofollowHost(href) {
  return outboundRel(href) === "noopener noreferrer";
}

// Last date the competitor pricing/feature claims on comparison pages were manually
// verified. Surface this on vs/compare/alternatives pages so the data carries a
// visible "verified" signal and a review cadence. Bump when you re-check pricing.
export const PRICING_VERIFIED = "June 2026";
