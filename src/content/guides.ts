/**
 * The guide registry: one entry per published guide.
 *
 * It exists so the guides index, each guide's own `metadata`, the resources hub
 * and the sitemap all read the same titles and slugs. A guide that is not in
 * this array is not in the sitemap, which is the behaviour we want — the list
 * is the source of truth, not the filesystem.
 *
 * Every guide here is written from how this product actually works (the
 * provisioning pipeline, the relay, the credential model). None of them are
 * about a feature that does not exist.
 */

export type Guide = {
  slug: string;
  title: string;
  /** Used as the <title> and the index-card heading. Shorter than `title`. */
  shortTitle: string;
  /** Meta description, and the card summary on the index. */
  description: string;
  /** Rough grouping shown as a kicker on the index card. */
  topic: "Authentication" | "Credentials" | "Sending";
  /** Honest reading time: words / 220, rounded. Recomputed when a guide changes. */
  minutes: number;
};

export const GUIDES: Guide[] = [
  {
    slug: "spf-dkim-dmarc",
    shortTitle: "SPF, DKIM and DMARC",
    title: "SPF, DKIM and DMARC: what each one actually proves",
    description:
      "Three DNS records, three different claims. What SPF checks, what DKIM signs, why DMARC needs alignment rather than just a pass, and which of them Infrabox publishes for you.",
    topic: "Authentication",
    minutes: 8,
  },
  {
    slug: "app-passwords",
    shortTitle: "Why app passwords are a dead end",
    title: "Why Google app passwords cannot be automated",
    description:
      "App passwords need 2-step verification, 2-step verification can only be enabled by the user, and a brand-new Workspace user cannot sign in without a phone. The full chain, and what it forces.",
    topic: "Credentials",
    minutes: 7,
  },
  {
    slug: "domain-wide-delegation",
    shortTitle: "Domain-wide delegation",
    title: "How domain-wide delegation replaces per-mailbox credentials",
    description:
      "One service account, authorised once per Workspace, impersonating any mailbox on demand. Why that scales where app passwords do not, and what it costs you in blast radius.",
    topic: "Credentials",
    minutes: 8,
  },
  {
    slug: "smtp-relay",
    shortTitle: "Connecting your sending tool",
    title: "Connecting your sending tool to the Infrabox SMTP relay",
    description:
      "What to type into Instantly, Smartlead or Lemlist, what the relay does with a message once it has it, and how to read the error codes it sends back.",
    topic: "Sending",
    minutes: 9,
  },
];

export function getGuide(slug: string): Guide {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) {
    // A guide page importing a slug that is not registered is a build-time
    // mistake, not a runtime condition — fail loudly rather than render a page
    // that the sitemap will never link to.
    throw new Error(`No guide registered for slug "${slug}"`);
  }
  return guide;
}
