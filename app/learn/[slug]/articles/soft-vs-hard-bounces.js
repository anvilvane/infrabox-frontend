export const article = {
  slug: "soft-vs-hard-bounces",
  title: "Soft vs Hard Bounces Explained (2026)",
  metaDescription:
    "A clear breakdown of soft vs hard bounces in email: what each means, common causes, how they hit your sender reputation, and exactly what to do with each.",
  headline: "Soft vs Hard Bounces: What They Mean and How to Handle Each",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Comparisons",
  readingTime: "11 min read",
  tags: ["soft bounce", "hard bounce", "bounce rate", "deliverability"],
  excerpt:
    "Soft and hard bounces look similar in a campaign report but mean very different things. Here is how to tell them apart, what causes each, how they affect reputation, and the right response to both.",
  type: "comparison",
  sections: [
    {
      heading: "The Short Answer",
      content:
        "A bounce is any message a receiving server refuses to deliver. The refusal comes back as a non-delivery report, and that report tells you whether the failure is permanent or temporary. That single distinction is the whole difference between a hard bounce and a soft bounce.\n\nA **hard bounce** is a permanent failure. The address does not exist, the domain does not resolve, or the server has flatly rejected the recipient. Sending to that address again will fail the same way every time, so the address should be removed from your list immediately.\n\nA **soft bounce** is a temporary failure. The mailbox is full, the server is briefly unavailable, the message was too large, or sending was rate limited. The address itself may be perfectly valid, and a later attempt can succeed.\n\nFor email this matters because the two failures call for opposite responses. Hard bounces must be purged on sight. Soft bounces can be retried, but only within limits, because a soft bounce that repeats often enough is a signal you should treat as a hard bounce. The rest of this guide covers the causes, the reputation impact, the right handling for each, and the point where a soft bounce should be retired for good.",
    },
    {
      heading: "How the Server Tells You Which Bounce It Is",
      content:
        "Every bounce carries an SMTP reply code and, on modern servers, an enhanced status code defined by [RFC 3463](https://www.rfc-editor.org/rfc/rfc3463). Reading these is how you classify a bounce without guessing.\n\nThe basic SMTP code is three digits. A code in the **5xx** range is a permanent failure, which maps to a hard bounce. A code in the **4xx** range is a temporary failure, which maps to a soft bounce. The enhanced status code adds a second layer of detail in the form `class.subject.detail`, where the class is `2` for success, `4` for transient, and `5` for permanent.\n\n| Code class | Meaning | Bounce type | Example |\n| --- | --- | --- | --- |\n| 4xx / 4.x.x | Transient, try again later | Soft | 452 4.2.2 mailbox full |\n| 5xx / 5.x.x | Permanent, do not retry | Hard | 550 5.1.1 user unknown |\n\nThe subject digit narrows it further. A `5.1.x` code points at an address problem, `5.2.x` at a mailbox problem, `5.7.x` at a policy or security rejection. A full catalog of these codes and what each one means lives in our [SMTP error codes explained](/learn/smtp-error-codes-explained) reference. The key habit is to read the code rather than the human-readable text, because the text varies wildly between providers while the code does not.\n\nOne caveat: some providers return a `5xx` permanent code for what is really a temporary block, such as a reputation-based rejection that would clear after warmup. The code says hard, but the cause is fixable. We cover that gray area later.",
    },
    {
      heading: "Common Causes, Side by Side",
      content:
        "The fastest way to internalize the difference is to see the typical causes lined up. Hard bounces almost always trace back to the address or domain being wrong or gone. Soft bounces trace back to a temporary condition on the receiving side or with the message itself.\n\n| Cause | Bounce type | Typical code | Why it happens |\n| --- | --- | --- | --- |\n| Address does not exist | Hard | 550 5.1.1 | Typo, churned employee, fake signup |\n| Domain does not resolve | Hard | 550 5.1.2 | Dead domain, MX misconfigured |\n| Recipient server rejects sender | Hard | 550 5.7.1 | Blocked by policy or blacklist |\n| Mailbox full | Soft | 452 4.2.2 | Recipient over quota |\n| Server temporarily unavailable | Soft | 421 4.3.2 | Maintenance, overload |\n| Message too large | Soft | 552 5.3.4 | Attachment over limit |\n| Greylisting | Soft | 451 4.7.1 | Server defers first attempt |\n| Rate limited | Soft | 421 4.7.0 | You sent too fast |\n\nNote that greylisting is a deliberate spam defense: the receiver defers the first attempt from an unknown sender and accepts it on a retry a few minutes later. A well-behaved mail server retries automatically, so greylisting rarely shows up as a final bounce. It is the textbook soft bounce that resolves itself.\n\nMailbox-full and rate-limited bounces are the two soft bounces most worth watching in email. A repeated mailbox-full bounce often means an abandoned account, which is effectively dead. Repeated rate limiting means you are sending faster than the receiver tolerates, which is a problem with your sending pattern rather than the address. For deeper handling of these, see [how to fix soft bounces in email](/learn/soft-bounce-email-fix).",
    },
    {
      heading: "How Each Bounce Affects Your Sender Reputation",
      content:
        "Both bounce types feed into your reputation, but they do not weigh the same. Hard bounces are far more damaging because they are the clearest signal that you are sending to a list you have not maintained, which is the exact behavior spam filters are built to catch.\n\nWhen you hard bounce, the receiving provider records that you attempted delivery to an address that does not exist. A small number is normal. A pattern of them tells Gmail, Outlook, and Yahoo that your list is stale or purchased, and they respond by routing more of your mail to spam or rejecting it outright. Hitting too many dead addresses is also one of the fastest routes onto a blacklist, because some of those dead addresses are spam traps.\n\nSoft bounces are gentler on reputation in isolation. A full mailbox or a brief server outage is not your fault and providers know it. The danger is volume and repetition. A wall of soft bounces in a short window can look like a sending burst against an unwilling server, and repeated soft bounces to the same address start to resemble hard bounces in the provider's eyes.\n\nGoogle and Yahoo now hold bulk senders to explicit standards, including authenticated mail and a complaint rate held under 0.3 percent. The thresholds are laid out in the [Google and Yahoo sender requirements for 2026](/learn/google-yahoo-sender-requirements-2026). High bounce rates of either type pull you toward the line where filtering kicks in, so neither type is safe to ignore.",
    },
    {
      heading: "What to Do With a Hard Bounce",
      content:
        "The rule for hard bounces is simple and absolute: remove the address from every active list the moment it bounces. There is no retry, no second attempt, no waiting. The address is gone, and every further attempt only adds another permanent-failure signal against your reputation.\n\nMost sending platforms suppress hard-bounced addresses automatically so you cannot accidentally mail them again. Confirm that yours does. If you export and re-import lists, make sure your suppression list travels with you, because a hard bounce you cleaned in one tool can re-enter through a fresh import.\n\nThe better fix sits upstream. The majority of hard bounces are preventable with list verification before you send. A good verification pass flags non-existent addresses, dead domains, and known spam traps so they never enter the campaign in the first place. If a recent campaign produced a spike of hard bounces, treat the whole list as suspect and re-verify it before the next send rather than picking off bounces one at a time.\n\nKeep a record of your hard bounce rate over time. A sudden climb usually means a data-source problem, such as a scraped or aged list, and it is cheaper to fix the source than to keep cleaning the output.",
    },
    {
      heading: "What to Do With a Soft Bounce",
      content:
        "Soft bounces deserve a measured response: retry, but with a cap, and escalate to removal if the retries keep failing. A single soft bounce means almost nothing on its own.\n\nMost platforms retry soft bounces automatically over a window of one to three days, spacing attempts so the receiving server has time to recover. Let that process run rather than forcing immediate resends, which only adds load and can trip rate limits. If the message clears on a later attempt, no further action is needed.\n\nThe judgment call is when to stop. The widely used rule is to treat an address as a hard bounce once it soft bounces on a set number of consecutive sends, commonly three to five. At that point the temporary problem has lasted long enough to be effectively permanent, and continued attempts only burn reputation.\n\n| Soft bounce reason | Retry worth it? | Escalate to removal after |\n| --- | --- | --- |\n| Mailbox full | Sometimes | 3 to 5 repeats (likely abandoned) |\n| Server temporarily down | Yes | Resolves on its own usually |\n| Greylisting | Yes, automatic | Rarely needs action |\n| Message too large | No, fix the message | First occurrence |\n| Rate limited | Yes, slow down | Fix your send rate, not the address |\n\nRate limiting is the one soft bounce where the fix is on your side. If you see it often, your per-mailbox volume or send speed is too high. Slow the cadence, spread sends across more mailboxes, and the bounces clear. Our guide to [email sending limits for Google and Microsoft](/learn/email-sending-limits-google-microsoft) lays out the ceilings that trigger these rejections.",
    },
    {
      heading: "When a Soft Bounce Becomes a Hard Bounce",
      content:
        "This is the crossover point that trips up most senders. A soft bounce is temporary by definition, but temporary has a limit. Past that limit, the kindest thing you can do for your reputation is to treat the address as permanently dead.\n\nThree triggers move an address from soft to hard in practice. The first is **repetition**: the same address soft bounces on several consecutive campaigns. A mailbox that has been full for weeks is, for your purposes, abandoned. The second is **a code change**: an address that was soft bouncing starts returning a `5xx` permanent code, which is the server telling you the temporary problem is now permanent. The third is **a reputation-driven block** that returns as a `5xx` but is really about how you are sending, not the address itself.\n\nThat third case is the subtle one. A `550 5.7.1` rejection can mean the recipient server has blocked your sending IP or domain, not that the address is invalid. Removing the address would be the wrong fix, because the address is fine. The real fix is to repair your sending reputation through warmup and better list hygiene, then resume. Distinguishing a true address failure from a reputation block comes down to whether the same code appears across many recipients at once. If one address fails, it is the address. If a whole batch fails with the same policy code, it is you.\n\n| Situation | Started as | Now treat as | Action |\n| --- | --- | --- | --- |\n| 4xx mailbox-full repeated 5 times | Soft | Hard | Remove address |\n| Address now returns 5.1.1 | Soft | Hard | Remove address |\n| Whole batch returns 5.7.1 | Soft-looking | Reputation block | Pause, warm up, fix list |\n| One-off 4xx server outage | Soft | Soft | Let retries run |\n\nManaged infrastructure handles much of this for you. On Infrabox, Email Insights tracks sent, reply, and bounce figures per mailbox, so a rising bounce rate surfaces before it spreads, and InfraGuard can auto-pause a mailbox when the pattern looks like a reputation block rather than a list problem. For the full benchmarking picture, see the [email bounce rate benchmarks](/learn/email-bounce-rate-benchmarks).",
    },
    {
      heading: "A Simple Decision Flow",
      content:
        "Put together, the handling logic is short enough to keep in your head. Read the code first, then act.\n\nStart with the SMTP class. If it is `5xx` and the subject points at the address (`5.1.x` or `5.2.x`), it is a hard bounce: remove the address now. If it is `5xx` but the same code is hitting many recipients at once and points at policy (`5.7.x`), it is a reputation block: pause, fix your sending, and resume rather than purging valid addresses.\n\nIf the class is `4xx`, it is a soft bounce: let automatic retries run over the next one to three days. Track how many consecutive times each address soft bounces. Once an address crosses your threshold of three to five repeats, or once its code flips to a permanent `5xx`, retire it as a hard bounce.\n\nThe whole system rests on two upstream habits that prevent most bounces before they happen: verify lists before sending so dead addresses never enter, and warm up properly so reputation blocks never start. Everything downstream is just reading codes and applying the rule. The broader playbook for keeping both rates low sits in our [bounce rate management guide](/learn/bounce-rate-management).",
    },
  ],
  faqs: [
    {
      question: "What is the main difference between a soft and hard bounce?",
      answer:
        "A hard bounce is a permanent failure, usually a 5xx code meaning the address or domain does not exist, and the address should be removed immediately. A soft bounce is a temporary failure, usually a 4xx code such as a full mailbox or a brief server outage, and it can be retried.",
    },
    {
      question: "How many times should I retry a soft bounce before removing it?",
      answer:
        "The common rule is three to five consecutive soft bounces. Most platforms retry automatically over one to three days. If an address keeps soft bouncing past that threshold, treat it as a hard bounce and remove it.",
    },
    {
      question: "Do soft bounces hurt my sender reputation?",
      answer:
        "Less than hard bounces in isolation, since a full mailbox or server outage is not your fault. But a high volume of soft bounces, or repeated soft bounces to the same address, can look like a sending problem and pull you toward the filtering threshold.",
    },
    {
      question: "Why did a valid address return a hard bounce?",
      answer:
        "It is likely a reputation block, not a dead address. A 5.7.x policy rejection across many recipients at once usually means the receiving server blocked your IP or domain. The fix is warmup and better list hygiene, not removing the address.",
    },
  ],
  sources: [
    { title: "RFC 3463 Enhanced Mail System Status Codes", url: "https://www.rfc-editor.org/rfc/rfc3463", date: "2025" },
    { title: "Google Bulk Sender Guidelines", url: "https://support.google.com/mail/answer/81126", date: "2025" },
    { title: "Microsoft Anti-Spam Message Headers", url: "https://learn.microsoft.com/en-us/defender-office-365/message-headers-eop-mdo", date: "2025" },
    { title: "Woodpecker Bounce Rate Benchmarks", url: "https://woodpecker.co/blog/", date: "2025" },
  ],
  relatedSlugs: [
    "email-bounce-errors",
    "bounce-rate-management",
    "smtp-error-codes-explained",
    "email-bounce-rate-benchmarks",
    "soft-bounce-email-fix",
  ],
};
