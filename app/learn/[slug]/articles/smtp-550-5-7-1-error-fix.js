export const article = {
  slug: "smtp-550-5-7-1-error-fix",
  title: 'How to Fix the SMTP "550 5.7.1" Error and "Message Queued" Delays in Gmail',
  metaDescription:
    'A step-by-step fix for the SMTP 550 5.7.1 error and Gmail "message queued" delays. Learn what the code means, the most common causes, and how to prevent it with proper authentication and reputation.',
  headline: 'Fixing SMTP "550 5.7.1" Errors and Gmail "Message Queued" Delays',
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: ["smtp errors", "550 5.7.1", "gmail deliverability", "email authentication"],
  excerpt:
    'The 550 5.7.1 response is a policy rejection: the receiving server accepted your connection but refused the message. Here is what each variant means, why Gmail shows "message queued," and how to fix and prevent both.',
  type: "how-to",
  sections: [
    {
      heading: "What you are actually looking at",
      content:
        'If you are reading this, you sent an email and got bounced with a line like `550 5.7.1` in the rejection, or you are watching messages sit in Gmail with a "message queued" status that never clears. Both point to the same root issue: the receiving mail server decided your message violated a policy and either rejected it outright or throttled it.\n\nThe `550 5.7.1` code is a **permanent rejection** for a **policy or authorization reason**. The `550` is the SMTP reply code (mailbox unavailable or action refused), and the `5.7.1` is the [enhanced status code](https://www.rfc-editor.org/rfc/rfc3463) meaning "delivery not authorized, message refused." A "message queued" state in Gmail is the softer cousin: Gmail accepted the message but is holding or slow-walking it, usually because of rate limits or reputation checks.\n\nThis guide breaks down every common variant of `550 5.7.1`, explains the Gmail queue behavior, and walks through fixes you can apply today plus prevention that keeps it from coming back.',
    },
    {
      heading: "Decoding the 550 5.7.1 variants",
      content:
        'The bare code rarely travels alone. The text after it tells you which policy you tripped. Here are the variants you will actually see in bounce messages.\n\n| Bounce text fragment | What it means | Where it comes from |\n|---|---|---|\n| "Relaying denied" | The server will not relay mail for your domain or IP | Open-relay protection (RFC 5321 relay rules) |\n| "Authentication required" | You tried to send without logging in via SMTP AUTH | The sending server you connected to |\n| "Unauthenticated email... not accepted" | SPF/DKIM/DMARC failed or are missing | Gmail, Yahoo, Microsoft |\n| "Message rejected due to policy" | Content, attachment, or sender policy block | Recipient gateway / spam filter |\n| "Email blocked... see [URL]" | Your IP or domain is on a blocklist | Recipient using Spamhaus or similar |\n| "Daily user sending limit exceeded" | Mailbox hit its send cap | Google Workspace / M365 |\n\nThe first job is to read the full bounce, not just the number. A "relaying denied" problem is fixed in your sending configuration. An "unauthenticated email" problem is fixed in DNS. They share a code but have nothing else in common.',
    },
    {
      heading: "Cause 1: Relay and authentication failures",
      content:
        'The classic `550 5.7.1 Relaying denied` happens when you point a script or app at a mail server and ask it to deliver to an external domain without authenticating first. Per [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321), a server is only obligated to accept mail for domains it hosts. To send anywhere else, you must prove you are an authorized user.\n\n**Fix it:**\n\n1. Confirm you are connecting to the correct submission endpoint. For Microsoft 365 that is `smtp.office365.com` on port 587 with STARTTLS; see our [Microsoft 365 SMTP settings guide](/learn/microsoft-365-smtp-settings) for the full table.\n2. Enable **SMTP AUTH** on the mailbox and supply valid credentials (often an app password if MFA is on).\n3. Make sure your client is using `AUTH LOGIN` or `AUTH PLAIN` over the encrypted channel, not trying to send before the handshake completes.\n4. If you are using a relay connector or a fixed IP, confirm that IP is in the allowed list on the sending platform.\n\nIf you are unsure which port or encryption mode to use, our [SMTP ports explained](/learn/smtp-ports-explained) breakdown covers 25, 465, 587, and 2525 and when each applies.',
    },
    {
      heading: "Cause 2: Authentication policy rejections (SPF, DKIM, DMARC)",
      content:
        'The variant that bites email senders hardest is `550-5.7.1 ... This message does not have authentication information or fails to pass authentication checks`. This is Gmail (and increasingly Yahoo and Microsoft) refusing mail that cannot prove who sent it.\n\nSince the [Google and Yahoo sender requirements](/learn/google-yahoo-sender-requirements-2026) took effect, every sending domain needs:\n\n- A valid **SPF** record that authorizes your sending IP. See [SPF record setup for email](/learn/spf-record-setup-email).\n- A passing **DKIM** signature. See [DKIM setup for email](/learn/dkim-setup-email).\n- A **DMARC** policy published in DNS, even at `p=none` to start. See [DMARC setup for email](/learn/dmarc-setup-email).\n\n**Fix it:**\n\n1. Pull the failing message header and read the `Authentication-Results` line. It will show `spf=`, `dkim=`, and `dmarc=` results.\n2. Whichever shows `fail` or `none` is your target. A `softfail` on SPF still gets rejected by strict gateways.\n3. Confirm your DNS publishes all three records and that the `From` domain aligns with the signing domain (DMARC alignment).\n4. Wait for DNS propagation, then send a test to a Gmail address and recheck the header.\n\nGetting all three to pass together is the single highest-leverage fix for `550 5.7.1` on email. Our overview of [SPF, DKIM, and DMARC explained](/learn/email-authentication-spf-dkim-dmarc-explained) ties the three together if you want the full picture.',
    },
    {
      heading: 'Cause 3: The Gmail "message queued" delay',
      content:
        'A queued message is different from a bounce. Gmail accepted the SMTP transaction, returned a `250` success, then held the message internally. You will see it stuck in "Sending" or labeled queued in the API. The message has not failed, but it is not moving either.\n\nThe usual causes:\n\n| Symptom | Likely cause | What to do |\n|---|---|---|\n| Queue clears after minutes | Normal rate shaping on a new sender | Keep volume low and let it drain |\n| Queue never clears | Mailbox hit its daily send limit | Check the [Google and Microsoft sending limits](/learn/email-sending-limits-google-microsoft) |\n| Repeated queueing on a new domain | Reputation not yet established | Run structured [warmup](/learn/email-warmup-guide) |\n| Queue plus delayed bounces | Recipient throttling a low-reputation IP | Improve [domain reputation](/learn/domain-reputation-vs-ip-reputation) |\n\nGoogle publishes its sending caps and throttling behavior; a single Workspace mailbox is held to a daily external recipient cap, and pushing past it triggers queueing and then hard `550` limit errors. Spreading volume across mailboxes and warming each one is the durable answer, not retrying the same overloaded mailbox.',
    },
    {
      heading: "Cause 4: Blocklists and reputation blocks",
      content:
        'Some `550 5.7.1` messages include a URL pointing at a blocklist, for example a [Spamhaus](https://www.spamhaus.org/) lookup page. This means the recipient server checked your sending IP or domain against a list and found it, so it refused the message regardless of authentication.\n\n**Fix it:**\n\n1. Check whether your domain or IP is listed. Our [check if a domain is blacklisted](/learn/check-domain-blacklisted) walkthrough shows where to look.\n2. If listed, follow the [email blacklist removal guide](/learn/email-blacklist-removal-guide) to request delisting and fix the underlying cause.\n3. Stop sending from the flagged source until you understand why it was listed. Continuing to send digs the hole deeper.\n4. Audit your list hygiene. High bounce rates and spam-trap hits are the fastest routes onto a blocklist.\n\nReputation blocks are the hardest variant to fix quickly because delisting takes time and the underlying behavior has to change. Prevention beats cure here by a wide margin.',
    },
    {
      heading: "A step-by-step triage checklist",
      content:
        'When a `550 5.7.1` or stubborn Gmail queue lands, work the list in order. Each step rules out a cause before you spend time on the next.\n\n1. **Read the full bounce text.** Identify which variant you have. Do not guess from the number alone.\n2. **Check authentication first.** Pull the header, read `Authentication-Results`, and fix any SPF, DKIM, or DMARC failure. This resolves the largest share of email cases.\n3. **Confirm you are authenticating to send.** Relay-denied and auth-required errors mean your client is not logging in correctly.\n4. **Check sending limits.** If the mailbox is over its daily cap, no fix to DNS will help. Reduce volume and spread across mailboxes.\n5. **Check blocklists.** If a URL appears, verify listing and start delisting.\n6. **Verify reputation and warmup.** New domains and IPs get throttled until they earn trust.\n7. **Send a controlled test.** One message to a known Gmail inbox, then read the header again to confirm the fix.\n\nIf you reach the end and messages still bounce, the problem is almost always reputation, which no single configuration change repairs overnight.',
    },
    {
      heading: "Preventing it from coming back",
      content:
        'Most `550 5.7.1` incidents are preventable with the same foundation that drives good [email deliverability](/learn/email-deliverability-guide) overall.\n\n- **Authenticate before you send a single email.** SPF, DKIM, and DMARC published and aligned, verified against a real Gmail test.\n- **Warm every new mailbox.** Reputation is earned by consistent, engaged sending over weeks, not bought.\n- **Respect sending limits.** Keep per-mailbox daily volume comfortably under the provider cap and grow gradually.\n- **Monitor for blocklist hits continuously**, not just after a problem appears.\n- **Keep your lists clean** so bounce and complaint rates stay low.\n\nThis is the operational burden that makes email infrastructure tedious to run by hand. Infrabox provisions real Google Workspace, Microsoft 365, and Azure mailboxes with SPF, DKIM, DMARC, and MX configured automatically through Cloudflare in under sixty seconds, then runs InfraGuard to check blacklists every six hours and auto-pause sending if reputation slips. The point is not the product, it is that the prevention checklist above is exactly what stops `550 5.7.1` from recurring, whether you automate it or do it by hand.',
    },
  ],
  faqs: [
    {
      question: "Is 550 5.7.1 a permanent or temporary error?",
      answer:
        "The 550 prefix indicates a permanent failure, so the receiving server will not retry on its own. However, the underlying cause (a missing DMARC record, an over-limit mailbox, a fresh blocklist entry) is usually fixable, after which new messages can be accepted. Resending the same message before fixing the cause will just bounce again.",
    },
    {
      question: 'Why does Gmail say "message queued" instead of bouncing?',
      answer:
        'A queued message was accepted by Gmail but is being held or rate-shaped internally, often because the sender is new, the mailbox is near its daily limit, or reputation is still being established. It is a throttle rather than a rejection. If queueing persists, reduce volume, warm the mailbox, and improve authentication and reputation.',
    },
    {
      question: "Will fixing SPF, DKIM, and DMARC stop 550 5.7.1 errors?",
      answer:
        "It resolves the most common variant for email, the authentication-failure rejection. It will not fix relay-denied errors (a sending configuration issue), over-limit rejections (a volume issue), or blocklist blocks (a reputation issue). Read the full bounce text to confirm which cause you are dealing with before assuming authentication is the fix.",
    },
    {
      question: "How long after fixing DNS before emails deliver again?",
      answer:
        "DNS changes propagate within minutes to a few hours depending on TTL. Once SPF, DKIM, and DMARC pass on a fresh test message, authentication-based rejections stop almost immediately. Reputation-based blocks and blocklist delisting take longer, often days, because the receiving systems need to observe sustained good behavior.",
    },
  ],
  sources: [
    {
      title: "RFC 5321 - Simple Mail Transfer Protocol",
      url: "https://www.rfc-editor.org/rfc/rfc5321",
      date: "2025",
    },
    {
      title: "RFC 3463 - Enhanced Mail System Status Codes",
      url: "https://www.rfc-editor.org/rfc/rfc3463",
      date: "2025",
    },
    {
      title: "Spamhaus Blocklist Removal",
      url: "https://www.spamhaus.org/",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "smtp-errors-and-fixes",
    "email-authentication-spf-dkim-dmarc-explained",
    "why-emails-go-to-spam",
    "email-sending-limits-google-microsoft",
  ],
};
