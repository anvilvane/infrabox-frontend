export const article = {
  slug: "smtp-error-codes-explained",
  title: "SMTP Error Codes Explained: 2xx, 4xx, 5xx",
  metaDescription:
    "SMTP error codes explained: how the 2xx, 4xx, and 5xx reply system works, enhanced status codes from RFC 3463, and what common codes like 550 and 421 actually mean.",
  headline: "SMTP Error Codes Explained",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: [
    "smtp error codes",
    "smtp reply codes",
    "enhanced status codes",
    "rfc 3463",
    "email deliverability",
    "bounce codes",
  ],
  excerpt:
    "How the SMTP reply code system works, the difference between 2xx, 4xx, and 5xx, the enhanced status codes from RFC 3463, and what the most common codes mean for senders.",
  type: "guide",
  sections: [
    {
      heading: "How SMTP Reply Codes Work",
      content:
        "Every SMTP response is a three-digit reply code, optionally followed by an enhanced status code and a human-readable message. The first digit tells you the outcome category, and that is the most important thing to read. Defined in [RFC 5321](https://datatracker.ietf.org/doc/html/rfc5321):\n\n| First Digit | Class | Meaning | What to Do |\n|-------------|-------|---------|------------|\n| **2xx** | Success | The command was accepted | Continue |\n| **3xx** | Intermediate | Server needs more input | Send the next command |\n| **4xx** | Transient failure | Temporary problem | Retry later with backoff |\n| **5xx** | Permanent failure | The command failed for good | Do not retry as-is; fix the cause |\n\nThe single most useful rule: **4xx is temporary, 5xx is permanent.** A `421` deferral should be retried; a `550` rejection should not, because retrying an address that does not exist only harms your reputation. The second and third digits add specificity, but the first digit alone tells you whether to wait or to stop.\n\nThe second digit groups the response by what part of the conversation it concerns. A second digit of 0 covers syntax, 2 covers connection state, and 5 covers the mail system itself, which is why the codes you care about most as a sender (the 250s, 421s, and 550s) sit in the 5 group. You do not need to memorize the second and third digits; the practical habit is to read the first digit for the verdict and then read the human-readable text and any enhanced code for the reason. The companion guide [common SMTP errors and fixes](/learn/smtp-errors-and-fixes) maps these to concrete actions, and the rest of this article walks each class with the codes you will actually meet.",
    },
    {
      heading: "Enhanced Status Codes (RFC 3463)",
      content:
        "Three-digit codes are coarse. To add precision, [RFC 3463](https://datatracker.ietf.org/doc/html/rfc3463) defines **enhanced status codes** in the form `class.subject.detail`, for example `5.7.1`. You will see these alongside the basic reply code, like `550 5.7.1`.\n\n| Part | Position | Examples | Meaning |\n|------|----------|----------|---------|\n| **Class** | First digit | 2, 4, 5 | Success, transient, permanent (mirrors the reply class) |\n| **Subject** | Second digit | 1, 2, 7 | Addressing, mailbox, security/policy |\n| **Detail** | Third digit | varies | Specific condition within the subject |\n\nCommon subject values worth knowing: **X.1.x** addressing problems (bad recipient or sender), **X.2.x** mailbox problems (full or disabled), **X.4.x** network and routing, and **X.7.x** security and policy (auth, SPF/DKIM/DMARC, spam). So `550 5.7.1` is a permanent (5) security/policy (7) rejection, typically relay denied or a policy block, while `550 5.1.1` is a permanent addressing (1) error meaning the recipient does not exist.",
    },
    {
      heading: "Common 2xx Success Codes",
      content:
        "Success codes confirm a command was accepted. You rarely act on these, but recognizing them helps when reading a session log.\n\n| Code | Enhanced | Meaning |\n|------|----------|---------|\n| **220** | - | Service ready (server greeting) |\n| **221** | 2.0.0 | Closing connection, goodbye |\n| **235** | 2.7.0 | Authentication successful |\n| **250** | 2.1.0 / 2.6.0 | Requested action completed (the workhorse OK) |\n| **354** | - | Start mail input (a 3xx intermediate, end with a dot) |\n\nThe one to watch is **250**. After your `DATA` command and the closing dot, a `250 2.0.0 OK` with a queued message ID means the receiving server accepted the message. Acceptance is not the same as inbox placement; a `250` only means the server took the message, not that it landed in the inbox rather than spam. Placement depends on reputation and authentication, covered in the [email deliverability guide](/learn/email-deliverability-guide).",
    },
    {
      heading: "Common 4xx Transient Codes",
      content:
        "A 4xx code is a temporary failure. The correct behavior is to retry later with exponential backoff. These are the ones you will encounter sending email at volume:\n\n| Code | Enhanced | Meaning | Typical Cause |\n|------|----------|---------|---------------|\n| **421** | 4.7.0 | Service not available, closing | Rate limiting or temporary block |\n| **450** | 4.2.1 | Mailbox unavailable | Recipient mailbox busy or temporarily disabled |\n| **451** | 4.7.1 | Local error / policy defer | Greylisting or server-side processing issue |\n| **452** | 4.2.2 | Insufficient storage | Recipient mailbox over quota |\n| **454** | 4.7.0 | TLS temporarily unavailable | STARTTLS negotiation failed |\n\n**Greylisting** is a common cause of `451`: the receiver deliberately defers a first attempt from an unknown sender and accepts the retry. The logic is that spam software often does not retry, while a legitimate mail server always will, so a forced wait of a few minutes filters out a chunk of junk for free. A normal sending system handles this invisibly by retrying; you only notice it as a short delay on the first message to a new recipient domain.\n\n**Backoff in practice** means waiting longer between each retry rather than hammering the server. A reasonable schedule retries after a few minutes, then a quarter hour, then an hour, then a few hours, giving up after a day or two. Retrying a `4xx` immediately and repeatedly looks like abuse and can convert a soft defer into a hard block. A `421` that persists across messages signals a rate or reputation problem, not a transient blip, and the right response is to slow down and investigate, not to retry harder. Provider sending caps that trigger `421` are documented in [email sending limits for Google and Microsoft](/learn/email-sending-limits-google-microsoft).",
    },
    {
      heading: "Common 5xx Permanent Codes",
      content:
        "A 5xx code is a permanent rejection. Retrying the same command will fail again and, in the case of bad recipients, will hurt your reputation. Fix the underlying cause before resending.\n\n| Code | Enhanced | Meaning | Fix |\n|------|----------|---------|-----|\n| **550** | 5.1.1 | Recipient address does not exist | Remove from list, validate addresses |\n| **550** | 5.7.1 | Relay denied or policy block | Authenticate, verify sending domain |\n| **551** | 5.1.6 | User not local | Send to the correct server |\n| **552** | 5.2.2 | Mailbox full (permanent) | Nothing to fix on your side |\n| **553** | 5.1.3 | Invalid address syntax | Correct the address format |\n| **554** | 5.7.1 | Transaction failed / spam block | Investigate reputation and content |\n\nTwo of these matter most for email. **550 5.1.1** is a hard bounce; a high rate of these damages reputation fast, so keep your list clean per [email bounce rate benchmarks](/learn/email-bounce-rate-benchmarks). **554 5.7.1** often means the receiver flagged your mail as spam or your IP/domain is blocklisted; check with [check domain blacklisted](/learn/check-domain-blacklisted).",
    },
    {
      heading: "The X.7.x Codes That Signal Authentication Problems",
      content:
        "The `X.7.x` security and policy subject is where authentication and reputation failures surface. These are the codes that most often mean your SPF, DKIM, or DMARC setup is wrong, or your reputation has slipped.\n\n| Enhanced Code | Meaning |\n|---------------|---------|\n| **5.7.1** | Delivery not authorized (relay denied or policy reject) |\n| **5.7.8** | Authentication credentials invalid |\n| **5.7.26** | Unauthenticated email: SPF, DKIM, or DMARC failed |\n| **4.7.0** | Temporary security-related deferral (often throttling) |\n\nCode **5.7.26** is increasingly common as Google and Yahoo enforce stricter authentication; it means the message failed the authentication checks required by bulk-sender rules. The wording you see often spells it out, for example a message saying unauthenticated email is not accepted from this domain. The fix is to publish and align [SPF, DKIM, and DMARC](/learn/email-authentication-spf-dkim-dmarc-explained) and meet the [Google and Yahoo sender requirements](/learn/google-yahoo-sender-requirements-2026). Alignment is the part people miss: SPF and DKIM can each pass on their own, but DMARC also requires that the domain they pass for matches the visible From domain, and a mismatch still produces a `5.7.26`.\n\nThe distinction between the X.7.x codes is worth holding onto. A `5.7.1` is about authorization (you are not permitted to send this, often relay scope or a policy block). A `5.7.8` is about identity (your login was rejected). A `5.7.26` is about authentication of the mail itself (the message did not prove it came from the domain it claims). They look similar but lead to different fixes: scope and permission for `5.7.1`, credentials or OAuth for `5.7.8`, and DNS authentication records for `5.7.26`. A `5.7.8` points to the SMTP login itself, fixed by regenerating credentials or moving to OAuth as described in [Microsoft 365 SMTP settings](/learn/microsoft-365-smtp-settings).",
    },
    {
      heading: "Reading a Real Bounce Message",
      content:
        "Bounce messages (non-delivery reports) bundle the reply code, enhanced status code, and a diagnostic string. Reading them in order saves time.\n\nA typical bounce contains:\n\n1. **The reply code**, for example `550`, which tells you permanent versus temporary at a glance.\n2. **The enhanced status code**, for example `5.7.1`, which tells you the category (security/policy).\n3. **The diagnostic text**, often the most specific, sometimes naming a blocklist or the failing check.\n\nExample: `550 5.7.1 Service unavailable, Client host [203.0.113.5] blocked using Spamhaus`. The `550` says permanent, `5.7.1` says policy, and the text names the cause: a [Spamhaus](https://www.spamhaus.org/) listing. The fix is delisting, walked through in the [email blacklist removal guide](/learn/email-blacklist-removal-guide), and prevention through ongoing monitoring per [email deliverability monitoring setup](/learn/email-deliverability-monitoring-setup).\n\nDifferent providers word their diagnostics differently, so always read the full text, not just the numeric code.",
    },
    {
      heading: "Turning Codes Into Action",
      content:
        "The practical workflow once you understand the code system:\n\n1. **Read the first digit.** 4xx means retry with backoff; 5xx means stop and fix.\n2. **Read the enhanced code.** The subject digit (1 addressing, 2 mailbox, 7 security) tells you where to look.\n3. **Read the diagnostic text.** It often names the exact cause, including blocklists.\n4. **Fix the root cause, not the symptom.** A `5.7.26` is solved by authentication, not by resending.\n5. **Watch trends.** A rising rate of `5xx` or `421` across mailboxes is a reputation problem, tracked through [domain reputation vs IP reputation](/learn/domain-reputation-vs-ip-reputation) and Postmaster Tools.\n\nManaged infrastructure reduces how often you read these codes at all. [Infrabox](/learn/what-is-infrabox) configures SPF, DKIM, and DMARC automatically, which prevents most `5.7.x` authentication failures, and its InfraGuard monitoring checks blacklists every six hours and auto-pauses sending before a `554` block compounds across a campaign.",
    },
  ],
  faqs: [
    {
      question: "What is the difference between a 4xx and 5xx SMTP code?",
      answer:
        "A 4xx code is a transient (temporary) failure, so the correct response is to retry later with backoff. A 5xx code is a permanent failure that will fail again if retried, so you must fix the underlying cause before resending. The first digit of the reply code is the key signal.",
    },
    {
      question: "What does 550 5.7.1 mean?",
      answer:
        "It is a permanent (5) security and policy (7) rejection. It usually means relay denied or a policy block: the server will not deliver your message because you are not authorized, often due to missing authentication or sending from an unverified domain.",
    },
    {
      question: "What are enhanced status codes?",
      answer:
        "Enhanced status codes, defined in RFC 3463, are three-part codes in the form class.subject.detail (for example 5.7.1) that add precision to the basic three-digit reply code. The class mirrors success/transient/permanent, the subject indicates the problem area, and the detail pinpoints the condition.",
    },
    {
      question: "What does SMTP code 5.7.26 mean?",
      answer:
        "5.7.26 indicates unauthenticated email: the message failed the SPF, DKIM, or DMARC checks required for bulk senders by Google and Yahoo. The fix is to publish and align SPF, DKIM, and DMARC and meet the current sender requirements.",
    },
    {
      question: "Does a 250 OK mean my email reached the inbox?",
      answer:
        "No. A 250 reply means the receiving server accepted the message into its system. It does not guarantee inbox placement; the message can still be filtered to spam. Placement depends on reputation, authentication, and content, not on the acceptance code.",
    },
  ],
  sources: [
    { title: "RFC 5321 - Simple Mail Transfer Protocol", url: "https://datatracker.ietf.org/doc/html/rfc5321", date: "2025" },
    { title: "RFC 3463 - Enhanced Mail System Status Codes", url: "https://datatracker.ietf.org/doc/html/rfc3463", date: "2025" },
    { title: "RFC 5248 - Registry of Enhanced Mail System Status Codes", url: "https://datatracker.ietf.org/doc/html/rfc5248", date: "2025" },
    { title: "Google Workspace - SMTP error messages reference", url: "https://support.google.com/a/answer/3726730", date: "2025" },
    { title: "Microsoft - Email non-delivery reports and SMTP errors in Exchange Online", url: "https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/non-delivery-reports-in-exchange-online/non-delivery-reports-in-exchange-online", date: "2025" },
    { title: "Spamhaus Blocklist Removal Center", url: "https://www.spamhaus.org/", date: "2025" },
  ],
  relatedSlugs: [
    "smtp-errors-and-fixes",
    "smtp-server-setup-guide",
    "email-authentication-spf-dkim-dmarc-explained",
    "email-blacklist-removal-guide",
    "email-bounce-rate-benchmarks",
  ],
};
