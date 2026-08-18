/**
 * Every number and step name on this site comes from here, and every entry
 * below cites the file it was read out of. If you change a price, change it
 * because the source changed — do not invent one.
 *
 * Sources (read 2026-08-18):
 *  - api-server/infrabox-api-server/src/api/models/team.model.js
 *  - api-server/infrabox-api-server/src/api/services/domain-pricing.service.js
 *  - api-server/infrabox-api-server/src/api/config/pricing.config.js
 *  - api-server/infrabox-api-server/src/api/services/provisioning/google/step-sequence.js
 *  - customer-dashboard/infrabox-dashboard/src/lib/mailbox-provisioning.ts
 */

/**
 * USD / mailbox / month.
 *
 * The application's own default (`team.model.js` -> `credits_per_google_mailbox`)
 * is still 3.99. This site advertises 3.79, a deliberate 0.20 reduction, so the
 * two are currently out of step: until `credits_per_google_mailbox` is lowered to
 * match, a customer would be quoted 3.79 here and billed 3.99 by the app. That
 * has to be reconciled before the price is used commercially.
 */
export const MAILBOX_PRICE_USD = 3.79;

/** pricing.config.js — markup added to the registrar's base price. */
export const DOMAIN_MARKUP = {
  /** `STANDARD_MARKUP` — domains under 12 months old. */
  standard: 6,
  /** `PREMIUM_AGE_MARKUP` — domains 12+ months old. */
  aged: 10,
  /** `PREMIUM_AGE_THRESHOLD_YEARS` */
  agedThresholdYears: 1,
} as const;

/**
 * domain-pricing.service.js — `BASE_TLD_PRICES` (USD/year) and
 * `PREWARM_TLD_PRICES` (base + a 2.5 pre-warm premium).
 *
 * Note: the service's own comments flag that `.co` is inconsistent between the
 * two tables (14.99 base vs a prewarm entry implying a 10 base). We surface the
 * values as written and say plainly that checkout quotes the final price.
 */
export const TLD_PRICES: {
  tld: string;
  base: number;
  prewarmed: number | null;
}[] = [
  { tld: ".com", base: 12.5, prewarmed: 15 },
  { tld: ".net", base: 15, prewarmed: 17.5 },
  { tld: ".org", base: 9, prewarmed: 11.5 },
  { tld: ".co", base: 14.99, prewarmed: 12.5 },
  { tld: ".shop", base: 2, prewarmed: 4.5 },
];

export type PipelineStep = {
  /** Backend step name in `STEP_SEQUENCE`. */
  key: string;
  /** Customer-facing label — same wording the dashboard shows during provisioning. */
  label: string;
  /** One line, plain English, for the landing page. */
  short: string;
  /** The longer explanation used on /how-it-works. */
  long: string;
  /** `typicalMinutes` from the dashboard's own progress model. */
  typicalMinutes: number;
};

/**
 * The eight steps, in the order the backend actually runs them. Labels and
 * `typicalMinutes` are copied from the dashboard's PROVISIONING_STEPS so the
 * marketing site and the progress screen never disagree.
 */
export const PIPELINE: PipelineStep[] = [
  {
    key: "order",
    label: "Workspace order",
    short: "The Workspace order for your domain is placed and confirmed.",
    long: "Before anything is created we check the order is actually fulfillable — the domain, the seat capacity and the billing all have to line up. Nothing external happens in this step, which is exactly why it is first: a bad order fails here, in a second, instead of halfway through a Google setup.",
    typicalMinutes: 15,
  },
  {
    key: "admin_setup",
    label: "Admin account",
    short: "The admin account that owns this domain's mailboxes is created.",
    long: "Your domain is attached to a Google Workspace as a secondary domain and the admin account that will own its mailboxes is created. You never see a Workspace signup form, and you never hold the admin password — the platform holds it so the remaining steps can run without you.",
    typicalMinutes: 15,
  },
  {
    key: "email_verification",
    label: "Activation",
    short: "Google confirms the new account is live and in good standing.",
    long: "Google has to acknowledge the new account before it can be configured. This step waits for that acknowledgement and confirms the account is active and unsuspended, rather than assuming it and failing later with a confusing error.",
    typicalMinutes: 30,
  },
  {
    key: "workspace_dns",
    label: "Workspace & DNS",
    short: "MX, SPF and DMARC records are published for the domain.",
    long: "The records that make a domain able to send and receive mail — MX, SPF and DMARC — are written straight into DNS with the values Google expects. This is the step people most often get wrong by hand: a stray SPF include or a missing DMARC record is the difference between the inbox and the spam folder.",
    typicalMinutes: 20,
  },
  {
    key: "site_verification",
    label: "Domain verification",
    short: "Google is asked to confirm you own the domain. Google sets the pace here.",
    long: "Google will not let a domain send until it has proved ownership of it. We publish the verification token and then ask Google to check it, repeatedly, for hours if that is what it takes. Nameserver and DNS propagation is genuinely slow and entirely outside anyone's control, so this is the one step where waiting is normal rather than a symptom of something broken. It is also the step that dominates total setup time.",
    typicalMinutes: 300,
  },
  {
    key: "dkim",
    label: "DKIM signing",
    short: "A DKIM key is generated, published to DNS and switched on.",
    long: "DKIM is the signature that lets a receiving server prove your mail was not tampered with in transit, and it is the piece most cold-email setups skip because Google only exposes it through the Admin Console. We generate the key, publish it to DNS and turn signing on for the domain, so it is done rather than on a checklist.",
    typicalMinutes: 30,
  },
  {
    key: "auth_oauth",
    label: "Sending credential",
    short: "A working sending credential is minted and verified against Gmail.",
    long: "The mailbox is authorised for programmatic sending and the credential is verified by actually calling Google with it — not just issued and hoped for. There is no app password to generate, no per-mailbox secret for you to store, and no 2-step verification prompt to click through.",
    typicalMinutes: 20,
  },
  {
    key: "renewal",
    label: "Renewal",
    short: "The renewal schedule is set so the mailbox keeps running.",
    long: "The mailbox is put on its renewal schedule so it does not quietly lapse mid-campaign. Bookkeeping, but the kind you notice when it is missing.",
    typicalMinutes: 5,
  },
];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://infrabox.io";

export function usd(n: number) {
  return `$${n.toFixed(2)}`;
}
