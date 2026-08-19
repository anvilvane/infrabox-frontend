export const article = {
  slug: "dns-troubleshooting-checklist",
  title: "DNS Troubleshooting Checklist for Email Deliverability",
  metaDescription:
    "An ordered checklist for diagnosing email DNS problems: propagation, the SPF 10-lookup limit, DKIM selectors, DMARC alignment, MX, and PTR. Includes dig commands and a symptom-to-cause table.",
  headline: "DNS Troubleshooting Checklist: Diagnose Email DNS Problems in Order",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "12 min read",
  tags: ["dns troubleshooting", "email deliverability", "dig", "spf dkim dmarc"],
  excerpt:
    "When email DNS breaks, the fix is rarely where you first look. This checklist runs the diagnosis in the right order, from propagation through SPF lookups, DKIM selectors, DMARC alignment, MX, and PTR, with dig commands and a symptom-to-cause table.",
  type: "how-to",
  sections: [
    {
      heading: "How to use this checklist",
      content:
        "DNS problems for email feel random because the symptom and the cause are often far apart. A message lands in spam, but the root cause is a DKIM selector that does not resolve. Mail bounces, but the MX record is fine and the real issue is the receiving side reading a stale cached value. The way to cut through this is to diagnose in a fixed order rather than guessing.\n\nThis checklist goes from the most fundamental layer outward: first confirm the record exists and has propagated, then check each authentication record in the order receivers evaluate them, then check the transport records that decide whether mail is accepted at all. Run the steps in order and stop when you find the break. Each step has a `dig` command you can paste, plus what a passing result looks like.\n\nIf you are setting records up for the first time rather than fixing them, start with the [DNS setup guide](/learn/dns-setup-guide) and the [email domain setup checklist](/learn/email-domain-setup-checklist) instead. This article assumes records exist and something is wrong.",
    },
    {
      heading: "Step 1: confirm propagation and TTL",
      content:
        "Before debugging the value of any record, confirm you are even looking at the current value. DNS resolvers cache records for the duration of the TTL, so a change you made an hour ago may not be visible yet if the old record had a long TTL.\n\nQuery an authoritative nameserver directly to see the true current value, then query a public resolver to see what the rest of the world sees:\n\n```\n# what the authoritative server holds (the source of truth)\ndig +short TXT example.com @ns1.yourdns.com\n\n# what a public resolver currently caches\ndig +short TXT example.com @8.8.8.8\n```\n\nIf the two disagree, you are mid-propagation and need to wait out the old TTL. A common mistake is making a change, checking immediately against a cached resolver, seeing the old value, and assuming the change failed. Lower your TTL to 300 seconds a day before any planned change so propagation is fast. Note that lowering TTL itself only takes effect after the old TTL expires, so plan ahead. Once you have confirmed you are seeing the live value, move on.",
    },
    {
      heading: "Step 2: SPF record and the 10-lookup limit",
      content:
        "SPF is the most common silent failure because the record can look perfect and still break. The SPF spec caps the number of DNS lookups during evaluation at 10. Every `include:`, `a`, `mx`, `ptr`, and `redirect` mechanism counts. Chain a few provider includes together and you blow past 10 without realizing it, at which point SPF returns a `permerror` and receivers may treat the message as unauthenticated.\n\nCheck the record exists and is a single TXT:\n\n```\ndig +short TXT example.com\n```\n\nYou should see exactly one record starting with `v=spf1` and ending in `-all` or `~all`. Two SPF records is itself a failure, since the spec allows only one. Then count the lookups by expanding every `include:`. If you are near or over 10, flatten the record or remove includes for services you no longer use. The full rules are in [RFC 7208](https://datatracker.ietf.org/doc/html/rfc7208), and the practical setup is in the [SPF record setup guide](/learn/spf-record-setup-email). If SPF resolves cleanly and is under the limit, move on.",
    },
    {
      heading: "Step 3: DKIM selector resolution",
      content:
        "DKIM fails most often because the selector record simply is not there or is at the wrong name. The signature in the email header names a selector, and the receiver looks up `selector._domainkey.yourdomain.com` to find the public key. If that lookup returns nothing, DKIM cannot verify.\n\nFirst find the selector. It is in the `s=` tag of the `DKIM-Signature` header of a received message. Then resolve it:\n\n```\n# replace ik1 with your actual selector\ndig +short TXT ik1._domainkey.example.com\n```\n\nA pass returns a TXT record containing `v=DKIM1` and a `p=` public key. Common breaks: the selector in the header does not match any record you published, the key was truncated when pasted (long keys sometimes get split or cut), or the record was published at the root instead of under `_domainkey`. The key value must match exactly what your sending provider generated. For setup detail see the [DKIM setup guide](/learn/dkim-setup-email). If the selector resolves and the key looks intact, move on to alignment.",
    },
    {
      heading: "Step 4: DMARC record and alignment",
      content:
        "DMARC ties SPF and DKIM together and decides what receivers do when authentication fails. Two things can be wrong: the DMARC record itself, or alignment.\n\nCheck the record:\n\n```\ndig +short TXT _dmarc.example.com\n```\n\nYou want one TXT starting with `v=DMARC1` and a valid `p=` policy (`none`, `quarantine`, or `reject`). A syntax typo, a missing `v=DMARC1` prefix, or two DMARC records all cause the policy to be ignored.\n\nThe subtler issue is alignment. DMARC passes only if at least one of SPF or DKIM both passes and aligns with the domain in the visible `From:` header. SPF alignment compares the `From:` domain with the envelope-sender (Return-Path) domain. DKIM alignment compares the `From:` domain with the `d=` tag in the DKIM signature. A message can pass raw SPF and raw DKIM yet still fail DMARC if neither aligns with the `From:` domain, which happens when a sending tool uses its own bounce domain. The rules are in [RFC 7489](https://datatracker.ietf.org/doc/html/rfc7489), and the combined model is explained in [email authentication explained](/learn/email-authentication-spf-dkim-dmarc-explained) and the [DMARC setup guide](/learn/dmarc-setup-email).",
    },
    {
      heading: "Step 5: MX records",
      content:
        "If the problem is mail bouncing or not being received rather than landing in spam, check MX. The MX record tells other servers where to deliver mail for your domain.\n\n```\ndig +short MX example.com\n```\n\nYou should see one or more hosts with priority numbers, pointing at your mailbox provider (for example a Google or Microsoft 365 host). Common breaks: a stale MX left over from a previous provider, MX pointing at a hostname that itself does not resolve to an A record, or no MX at all. For email specifically, a missing or wrong MX can also affect how receivers judge the domain's legitimacy. The full explanation of priorities and fallbacks is in [MX records explained](/learn/mx-records-explained). If MX resolves to the correct provider host, move to the reverse side.",
    },
    {
      heading: "Step 6: reverse DNS (PTR)",
      content:
        "PTR is the record many people forget because it lives on the sending IP, not your domain. Reverse DNS maps your sending IP back to a hostname, and major receivers check that the IP has a PTR record that resolves and ideally matches the sending hostname (forward-confirmed reverse DNS). A missing PTR is a frequent cause of mail being throttled or rejected by Gmail and Outlook.\n\n```\n# replace with your sending IP\ndig +short -x 203.0.113.10\n```\n\nA pass returns a hostname, and ideally that hostname resolves forward back to the same IP. If you get nothing, the IP has no PTR and you need your hosting or mailbox provider to set one, since PTR is controlled by whoever owns the IP block, not by your domain's DNS. This is why sending from real provider infrastructure matters: Infrabox's mailboxes run on US IPs with reverse DNS handled at the infrastructure level. Deeper detail is in [reverse DNS setup](/learn/reverse-dns-setup) and [reverse DNS and deliverability](/learn/reverse-dns-deliverability).",
    },
    {
      heading: "Symptom-to-cause reference table",
      content:
        "Once you know the symptom, this table points you at the likely step. Work the step it names first, then fall back to running the full checklist in order if it does not resolve.\n\n| Symptom | Most likely cause | Checklist step |\n| --- | --- | --- |\n| Change not visible after editing | TTL still serving cached value | Step 1: propagation |\n| SPF shows `permerror` | Over the 10 DNS-lookup limit | Step 2: SPF |\n| Mail authenticated by some receivers, not others | Two SPF records, or partial propagation | Steps 1 and 2 |\n| DKIM fails verification | Selector not resolving or key truncated | Step 3: DKIM |\n| SPF and DKIM pass but DMARC fails | Alignment mismatch with From domain | Step 4: DMARC |\n| Mail bounces entirely | MX missing or pointing at wrong host | Step 5: MX |\n| Gmail or Outlook throttling or rejecting | Missing or mismatched PTR on sending IP | Step 6: PTR |\n| Lands in spam despite auth passing | Reputation or content, not DNS | See deliverability guide |\n\nIf every DNS step passes and mail still lands in spam, the issue has moved past DNS into reputation, content, or sending patterns. That is covered in [why emails go to spam](/learn/why-emails-go-to-spam) and the broader [email deliverability guide](/learn/email-deliverability-guide).",
    },
    {
      heading: "Tools and ongoing monitoring",
      content:
        "Two categories of tooling cover this work. Command-line `dig` is precise and scriptable, which is what you want when checking many domains or automating verification. For a quick visual check against a single domain, [MXToolbox](https://mxtoolbox.com/) runs SPF, DKIM, DMARC, MX, and blacklist lookups in a browser. For the latest receiver-side rules that DNS has to satisfy, see the [Google and Yahoo sender requirements for 2026](/learn/google-yahoo-sender-requirements-2026).\n\nThe harder problem is catching breaks before they cost you. DNS that passes today can break tomorrow when a record is edited, a provider rotates a key, or a registrar resets something. Manual checks do not scale across a fleet of sending domains. Infrabox's InfraGuard watches DNS records continuously and can auto-pause sending on any domain whose authentication breaks, so a silent DKIM or SPF failure does not keep sending unauthenticated mail. Infrabox also offers a free MTA-STS checker among its tools if you are layering on transport encryption. For one-time setup across many domains, [bulk DNS updates](/learn/bulk-dns-updates) covers pushing records at scale.",
    },
  ],
  faqs: [
    {
      question: "In what order should I troubleshoot email DNS problems?",
      answer:
        "Work from the most fundamental layer outward. First confirm propagation and TTL so you are seeing the live record, then check SPF and the 10-lookup limit, then DKIM selector resolution, then DMARC record and alignment, then MX, then reverse DNS (PTR) on the sending IP. Stop at the first break you find and fix it before moving on.",
    },
    {
      question: "Why does my SPF record fail even though it looks correct?",
      answer:
        "The most common cause is exceeding the 10 DNS-lookup limit defined in RFC 7208. Every include, a, mx, ptr, and redirect mechanism counts toward that limit, and chained provider includes add up fast. When you go over, SPF returns a permerror and receivers may treat the message as unauthenticated. Flatten the record or remove unused includes to get back under 10.",
    },
    {
      question: "Why does DMARC fail when SPF and DKIM both pass?",
      answer:
        "Because of alignment. DMARC requires that at least one of SPF or DKIM both passes and aligns with the domain in the visible From header. SPF alignment compares the From domain to the Return-Path domain; DKIM alignment compares the From domain to the signature d= tag. If a sending tool uses its own bounce domain, raw SPF and DKIM can pass while neither aligns, so DMARC fails.",
    },
    {
      question: "How do I check reverse DNS for my sending IP?",
      answer:
        "Run dig +short -x followed by your sending IP. A pass returns a hostname, ideally one that resolves forward back to the same IP (forward-confirmed reverse DNS). PTR records are controlled by whoever owns the IP block, not by your domain's DNS, so if there is no PTR you need your hosting or mailbox provider to set it.",
    },
  ],
  sources: [
    {
      title: "RFC 7208: Sender Policy Framework (SPF)",
      url: "https://datatracker.ietf.org/doc/html/rfc7208",
      date: "2025",
    },
    {
      title: "RFC 7489: Domain-based Message Authentication (DMARC)",
      url: "https://datatracker.ietf.org/doc/html/rfc7489",
      date: "2025",
    },
    {
      title: "MXToolbox SuperTool",
      url: "https://mxtoolbox.com/",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "dns-setup-guide",
    "email-authentication-spf-dkim-dmarc-explained",
    "mx-records-explained",
    "why-emails-go-to-spam",
  ],
};
