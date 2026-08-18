/**
 * Capacity and retry facts used by the product pages.
 *
 * ── Why this file exists ──────────────────────────────────────────────────
 * `src/lib/product.ts` holds the prices and the pipeline, and
 * `src/content/relay.ts` holds the SMTP relay's own numbers. Neither is owned
 * by this workstream, so these few remaining values live here instead of being
 * bolted onto them. They follow exactly the same rule both of those do: **no
 * number appears here that was not read out of a real file in this repository,
 * and every one cites the file and the constant it came from.** When those
 * modules are next edited, these belong in them and this file should go away.
 *
 * Relay host, port, security, auth methods and the daily cap are deliberately
 * NOT duplicated here — import them from `@/content/relay`.
 *
 * Sources (read 2026-08-19):
 *  - api-server/infrabox-api-server/src/api/utils/mailbox-limits.js
 *  - api-server/infrabox-api-server/src/api/models/team.model.js
 *  - api-server/infrabox-api-server/src/api/services/provisioning/google/step-sequence.js
 */

/**
 * mailbox-limits.js — `DEFAULT_MAILBOX_LIMITS.GOOGLE`. The default number of
 * mailbox slots on one Google Workspace domain.
 */
export const DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN = 5;

/**
 * team.model.js — the `custom_mailbox_limits` schema bound for Google, which
 * is what a per-account increase may be raised to.
 */
export const GOOGLE_MAILBOXES_PER_DOMAIN_MAX = 20;

/**
 * team.model.js — `domain_connection_limit`, the number of domains that may be
 * connected in one batch. Admin-adjustable per team.
 */
export const DOMAIN_CONNECTION_LIMIT = 250;

/**
 * step-sequence.js — the bespoke `retryPolicy` on the `site_verification`
 * step: 60s initial delay, doubling, capped at 15 minutes, up to 40 attempts.
 * It exists because, in the code comment's own words, "NS delegation routinely
 * takes hours". Every other step uses the shared default of 5 attempts at a
 * flat 60 seconds.
 */
export const SITE_VERIFICATION_RETRY = {
  maxAttempts: 40,
  initialDelaySeconds: 60,
  maxDelayMinutes: 15,
} as const;

/**
 * team.model.js — the `role` enum on a team member. Billing permission is a
 * separate flag (`canManageBilling`) rather than being implied by a role.
 */
export const TEAM_ROLES = ["owner", "admin", "member"] as const;
