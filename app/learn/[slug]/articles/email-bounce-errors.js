export const article = {
  slug: "email-bounce-errors",
  title: "Common Email Bounce Errors Explained (2026)",
  metaDescription:
    "A field guide to the most common email bounce messages: mailbox full, user unknown, blocked, rate limited, and policy rejections, mapped to SMTP enhanced status codes with fixes.",
  headline: "Common Email Bounce Errors Explained, With Codes and Fixes",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "12 min read",
  tags: ["bounce errors", "smtp codes", "ndr", "deliverability"],
  excerpt:
    "Bounce messages are written for machines, not people. This guide decodes the most common ones, maps each to its SMTP enhanced status code, and tells you exactly what to do about it.",
  type: "guide",
  sections: [
    {
      heading: "How to Read a Bounce Message",
      content:
        "When a server refuses your mail, it returns a non-delivery report, often called an NDR or bounce-back. Buried in that report is the only part that matters: the SMTP reply code and, on modern servers, the enhanced status code. The human-readable text wrapped around them is just a hint, and it changes from one provider to the next.\n\nThe SMTP reply code is three digits. A `5xx` code is a permanent failure and a `4xx` code is a temporary one. The enhanced status code, defined by [RFC 3463](https://www.rfc-editor.org/rfc/rfc3463), adds the form `class.subject.detail`. The class is `4` for transient and `5` for permanent. The subject narrows the cause: `1` is about the address, `2` is about the mailbox, `3` is about the system, `4` is about the network, and `7` is about security or policy.\n\nSo `550 5.1.1` reads as permanent failure, address problem, no such user. And `452 4.2.2` reads as transient failure, mailbox problem, over quota. Once you can decode the pair, every bounce becomes legible regardless of how the provider phrased it.\n\nThis guide walks through the bounce errors you will actually see in email, grouped by what causes them, and maps each to its code so you can act without guessing. For a permanent-versus-temporary breakdown, pair this with [soft vs hard bounces](/learn/soft-vs-hard-bounces).",
    },
    {
      heading: "User Unknown and Address Errors",
      content:
        "The most common bounce in any cold campaign is the address that does not exist. The recipient left the company, the address was a typo, or the data was scraped and never valid. These are permanent failures, so the address must be removed on the first bounce.\n\n| Message you might see | SMTP code | Enhanced code | Meaning |\n| --- | --- | --- | --- |\n| User unknown | 550 | 5.1.1 | No mailbox by that name |\n| No such user here | 550 | 5.1.1 | Same, different wording |\n| Recipient address rejected | 550 | 5.1.1 | Address not accepted |\n| Domain not found | 550 | 5.1.2 | Domain does not resolve |\n| Bad destination mailbox address | 550 | 5.1.1 | Mailbox does not exist |\n\nThe `5.1.1` family means the address itself is dead. The `5.1.2` variant means the domain is dead, which is worse, because it suggests your data source is feeding you addresses at defunct companies. Either way the action is the same: suppress the address immediately and do not retry.\n\nThe real fix is upstream. A large share of `5.1.x` bounces never need to happen because list verification catches non-existent addresses and dead domains before you send. If a campaign returns a cluster of these, treat the underlying list as stale and re-verify the whole thing rather than cleaning bounces one by one. Repeated `5.1.2` domain failures are a strong sign of a scraped or aged data source.",
    },
    {
      heading: "Mailbox Full and Quota Errors",
      content:
        "A full mailbox is a temporary failure. The address is valid, but the recipient is over their storage quota, so the server cannot accept new mail right now. These are soft bounces, and the right move is to let automatic retries run.\n\n| Message you might see | SMTP code | Enhanced code | Meaning |\n| --- | --- | --- | --- |\n| Mailbox full | 452 | 4.2.2 | Over quota, temporary |\n| Over quota | 552 | 5.2.2 | Over quota, treated permanent |\n| Insufficient system storage | 452 | 4.3.1 | Server out of space |\n| Mailbox unavailable | 450 | 4.2.1 | Disabled or busy, temporary |\n\nWatch the class digit. A `4.2.2` is transient and will likely clear. A `5.2.2` is the same condition reported as permanent, which some servers do when a mailbox has been full long enough to be considered abandoned. If you see the permanent variant, or if the same address returns `4.2.2` across several consecutive sends, treat it as effectively dead and remove it.\n\nA mailbox that stays full for weeks is almost always an account nobody checks anymore. Retrying it forever wastes sends and slowly nudges your reputation, so apply a cap of three to five repeats and then retire the address. Detailed handling of these transient cases sits in [how to fix soft bounces in email](/learn/soft-bounce-email-fix).",
    },
    {
      heading: "Blocked and Reputation Errors",
      content:
        "These are the bounces that should worry you most, because they are about you rather than the recipient. A blocked bounce means the receiving server has rejected your sending IP or domain on reputation grounds, often after a blacklist lookup. The address is usually valid; the problem is your standing.\n\n| Message you might see | SMTP code | Enhanced code | Meaning |\n| --- | --- | --- | --- |\n| Message rejected due to local policy | 550 | 5.7.1 | Blocked by policy |\n| Client host blocked using a DNSBL | 554 | 5.7.1 | IP on a blacklist |\n| Spam message rejected | 550 | 5.7.1 | Scored as spam |\n| Access denied, sender blocked | 550 | 5.7.1 | Sender on a blocklist |\n| Connection refused | 421 | 4.7.0 | Temporary reputation throttle |\n\nThe tell for a reputation block is scale. If a single address returns `5.7.1`, it might be a quirk on their side. If a whole batch returns `5.7.1` at once, your IP or domain has been flagged, and removing those addresses would be exactly the wrong fix because the addresses are fine.\n\nThe response is to pause sending, find out why you were blocked, and repair it before resuming. Common triggers are a bounce or complaint rate over the line, sending volume ramped too fast, or a missing authentication record. Confirm whether you are on a blacklist using the steps in [how to check if a domain is blacklisted](/learn/check-domain-blacklisted), and if you are listed, work through the [email blacklist removal guide](/learn/email-blacklist-removal-guide). A `421 4.7.0` is the softer cousin: a temporary throttle that clears once your reputation recovers or your send rate drops.",
    },
    {
      heading: "Rate Limited and Throttling Errors",
      content:
        "Rate limiting is the server telling you to slow down. You are sending faster than it will accept from a sender of your standing, so it defers the message. These are temporary failures, and the fix is on your side: reduce volume and spread sends out.\n\n| Message you might see | SMTP code | Enhanced code | Meaning |\n| --- | --- | --- | --- |\n| Too many messages | 421 | 4.7.0 | Rate exceeded |\n| Rate limit exceeded | 451 | 4.7.1 | Sending too fast |\n| Try again later | 421 | 4.3.2 | Server asking you to defer |\n| Connection rate limit | 421 | 4.7.0 | Too many connections |\n| Greylisted, try again | 451 | 4.7.1 | Deferred pending retry |\n\nGreylisting deserves a note. A `451 4.7.1` greylisting deferral is a deliberate spam defense: the server refuses an unknown sender's first attempt and accepts it on a retry minutes later. A properly configured mail server retries automatically, so greylisting rarely becomes a final bounce. If it does, your retry logic is the problem.\n\nGenuine rate limiting that persists means your per-mailbox volume or send speed is too high for your current reputation. New or lightly warmed mailboxes hit these limits fast. Slow the cadence, distribute sends across more mailboxes, and respect the provider ceilings laid out in [email sending limits for Google and Microsoft](/learn/email-sending-limits-google-microsoft). Sending under roughly 50 messages per mailbox per day keeps most senders well clear of these throttles.",
    },
    {
      heading: "Policy and Authentication Errors",
      content:
        "The last group covers messages rejected for failing a rule rather than for a bad address. Most of these trace back to authentication: the receiving server cannot verify that you are allowed to send for your domain, so it refuses the message. With Gmail and Yahoo now enforcing authentication on bulk senders, these have become common.\n\n| Message you might see | SMTP code | Enhanced code | Meaning |\n| --- | --- | --- | --- |\n| SPF check failed | 550 | 5.7.23 | Sender not authorized by SPF |\n| DKIM signature invalid | 550 | 5.7.20 | DKIM failed or missing |\n| DMARC policy violation | 550 | 5.7.1 | Failed DMARC alignment |\n| Message too large | 552 | 5.3.4 | Exceeds size limit |\n| Encryption required | 550 | 5.7.30 | TLS required, not offered |\n\nAuthentication failures are fully preventable and worth fixing before any other bounce, because they block otherwise valid mail at scale. SPF, DKIM, and DMARC must be configured correctly on every sending domain, and DMARC alignment has to pass, not just exist. The exact records and thresholds Gmail and Yahoo require are in the [Google and Yahoo sender requirements for 2026](/learn/google-yahoo-sender-requirements-2026).\n\nA `5.3.4` message-too-large bounce is the odd one out: it is about the message, not the sender or recipient. Trim the attachment or move it to a link, and it sends. These are rare in email since the messages are usually short, but bulky signature images can trip the limit.",
    },
    {
      heading: "The Full Fix Table",
      content:
        "Pulling it together, here is every category mapped to its action. Read the enhanced code first, locate the row, and apply the fix. The pattern is consistent: address problems get the address removed, system and network problems get retried, and policy or reputation problems get paused and repaired.\n\n| Error category | Enhanced code range | Bounce type | What to do |\n| --- | --- | --- | --- |\n| User unknown | 5.1.x | Hard | Remove address now, verify list |\n| Mailbox full | 4.2.x / 5.2.x | Soft to hard | Retry, remove after 3 to 5 repeats |\n| Server down | 4.3.x | Soft | Let automatic retries run |\n| Network or connection | 4.4.x | Soft | Retry, check your MX and connectivity |\n| Rate limited | 4.7.0 / 4.7.1 | Soft | Slow down, spread across mailboxes |\n| Blocked or blacklisted | 5.7.1 | Reputation | Pause, check blacklists, repair |\n| Authentication failed | 5.7.20 to 5.7.30 | Policy | Fix SPF, DKIM, DMARC, then resend |\n| Message too large | 5.3.4 | Soft | Trim message, then resend |\n\nTwo upstream habits prevent most of this table from ever firing. Verifying lists before you send eliminates the `5.1.x` block entirely. Warming up properly and authenticating correctly keeps the `5.7.x` rows quiet. Everything else is routine retry logic.\n\nOn managed infrastructure this classification runs without manual work. Infrabox's Email Insights records sent, reply, and bounce figures per mailbox, so a spike in any one category is visible immediately, and InfraGuard can auto-pause a mailbox when the bounce pattern points at a reputation block rather than a list problem. For benchmarks on what bounce rate is normal, see the [email bounce rate benchmarks](/learn/email-bounce-rate-benchmarks), and for the day-to-day system, the [bounce rate management guide](/learn/bounce-rate-management).",
    },
  ],
  faqs: [
    {
      question: "What does a 550 5.1.1 bounce mean?",
      answer:
        "It is a permanent failure for an address that does not exist, often shown as user unknown or no such user. The recipient may have left, the address may be a typo, or the data may be invalid. Remove the address immediately and do not retry.",
    },
    {
      question: "What is the difference between mailbox full and over quota?",
      answer:
        "They are the same condition reported with different urgency. A 452 4.2.2 mailbox-full bounce is transient and will likely clear, so retry. A 552 5.2.2 over-quota bounce is reported as permanent, usually for a mailbox that has been full long enough to be considered abandoned, so remove it.",
    },
    {
      question: "Why are my emails being blocked with a 5.7.1 error?",
      answer:
        "A 5.7.1 rejection across many recipients means your sending IP or domain has been flagged on reputation grounds, often after a blacklist lookup. The addresses are usually valid. Pause sending, check whether you are blacklisted, fix the cause such as high bounces or fast ramping, then resume.",
    },
    {
      question: "How do I fix authentication bounce errors?",
      answer:
        "Configure SPF, DKIM, and DMARC correctly on every sending domain and confirm DMARC alignment passes. Codes in the 5.7.20 to 5.7.30 range mean the receiver could not verify you are authorized to send for your domain. Fix the DNS records before resending.",
    },
  ],
  sources: [
    { title: "RFC 3463 Enhanced Mail System Status Codes", url: "https://www.rfc-editor.org/rfc/rfc3463", date: "2025" },
    { title: "Google SMTP Error and Bounce Messages", url: "https://support.google.com/a/answer/3221692", date: "2025" },
    { title: "Microsoft Email Non-Delivery Reports", url: "https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/non-delivery-reports-in-exchange-online/non-delivery-reports-in-exchange-online", date: "2025" },
    { title: "Lemlist Deliverability Resources", url: "https://www.lemlist.com/blog", date: "2025" },
  ],
  relatedSlugs: [
    "smtp-error-codes-explained",
    "soft-vs-hard-bounces",
    "bounce-rate-management",
    "email-bounce-rate-benchmarks",
    "check-domain-blacklisted",
  ],
};
