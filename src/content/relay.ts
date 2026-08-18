/**
 * SMTP relay facts, in one place, each citing the file it was read out of.
 *
 * Same discipline as `src/lib/product.ts`: nothing here was chosen for how it
 * reads on a page. If one of these changes in the API server, change it here —
 * do not adjust it to suit a sentence.
 *
 * Sources (read 2026-08-19), all under
 * `api-server/infrabox-api-server/src/api/services/relay/`:
 *  - relay.config.js
 *  - relay-rate-limit.service.js
 *  - smtp-credentials.service.js
 *  - smtp-relay.server.js
 *  - gmail-send.service.js
 *
 * Note on defaults: the host, port, size cap and daily limit are all
 * environment-overridable in the API server. The values below are the defaults
 * the code ships with, which is what a customer gets unless told otherwise.
 */

/** relay.config.js — `SMTP_RELAY_HOST`, default `smtp.infrabox.io`. */
export const RELAY_HOST = "smtp.infrabox.io";

/** relay.config.js — `SMTP_RELAY_PORT`, default 587. */
export const RELAY_PORT = 587;

/** relay.config.js — `security` is fixed at STARTTLS. */
export const RELAY_SECURITY = "STARTTLS";

/** smtp-relay.server.js — `authMethods`. */
export const RELAY_AUTH_METHODS = ["PLAIN", "LOGIN"] as const;

/**
 * relay.config.js — `DEFAULT_MAX_MESSAGE_BYTES`, 10 MB. The constraint is the
 * Gmail API's JSON upload path, not SMTP.
 */
export const RELAY_MAX_MESSAGE_MB = 10;

/**
 * relay-rate-limit.service.js — `DEFAULT_DAILY_LIMIT`, counted from midnight
 * UTC to midnight UTC, and only successful sends count against it.
 */
export const RELAY_DAILY_LIMIT = 2000;

/** smtp-credentials.service.js — mailbox statuses the relay will send for. */
export const RELAY_SENDABLE_STATUSES = [
  "active",
  "scheduled_for_cancellation",
] as const;

/** smtp-credentials.service.js — generated password length, in characters. */
export const RELAY_PASSWORD_LENGTH = 24;

export type RelayCode = {
  code: string;
  meaning: string;
  /** What a sending tool should do about it, in one line. */
  action: string;
};

/**
 * relay.errors.js and gmail-send.service.js. The permanent/transient split is
 * deliberate on the server side: an unclassified failure is returned as 4xx,
 * because sending tools treat a 5xx as "this address is dead" and will stop
 * retrying a mailbox that was only briefly unavailable.
 */
export const RELAY_CODES: RelayCode[] = [
  {
    code: "535 5.7.8",
    meaning: "The relay credential is wrong, or has been rotated or revoked.",
    action: "Re-issue the credential in the dashboard and update the tool.",
  },
  {
    code: "550 5.1.1",
    meaning:
      "The mailbox is unknown to the relay, or is not in a state it will send for.",
    action: "Check the mailbox is active rather than still provisioning.",
  },
  {
    code: "550 5.7.1",
    meaning:
      "The From header does not match the authenticated mailbox. Google refuses this, not the relay.",
    action: "Set the tool's From address to the mailbox address exactly.",
  },
  {
    code: "452 4.2.2",
    meaning: "The mailbox has hit its daily cap.",
    action: "Wait for the UTC-midnight reset, or spread across more mailboxes.",
  },
  {
    code: "552 5.3.4",
    meaning: "The message is over the size limit.",
    action: "Link to large attachments instead of embedding them.",
  },
  {
    code: "451 4.x.x",
    meaning:
      "Something transient: Google rate-limiting, a Google 5xx, a network timeout, or a mailbox still finishing provisioning.",
    action: "Let the tool retry. Do not treat the address as dead.",
  },
  {
    code: "530 5.7.0",
    meaning: "A command was sent before authenticating.",
    action: "Enable authentication in the tool's SMTP settings.",
  },
];
