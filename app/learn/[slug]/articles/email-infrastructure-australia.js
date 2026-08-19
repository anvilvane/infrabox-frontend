export const article = {
  slug: "email-infrastructure-australia",
  title: "Email Infrastructure for Australia (2026)",
  metaDescription:
    "Email in Australia is governed by the Spam Act 2003 — consent, identification, and unsubscribe. The full legal playbook plus the infrastructure setup.",
  headline: "Email Infrastructure for Australia",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "email australia",
    "spam act 2003",
    "acma enforcement",
    "australian deliverability",
    "b2b email australia",
    "inferred consent",
  ],
  excerpt:
    "Australia runs on the Spam Act 2003: consent-based, enforced by ACMA, with high penalties. B2B email is viable under inferred consent. Here is the infrastructure and compliance layer that works.",
  screenshots: [
    {
      src: "/images/dashboard/warmup.png",
      alt: "Infrabox isolated warmup dashboard for Australian email senders",
      caption:
        "Isolated warmup network: each mailbox warms inside its own reputation pool, not a shared one, which matters for Australian senders reaching Telstra and Bigpond.",
    },
  ],
  type: "guide",
  sections: [
    {
      heading: "What Australian Senders Need to Know About the Spam Act 2003",
      content:
        "Australia's [Spam Act 2003](https://www.legislation.gov.au/C2004A01214/latest/text) is a consent-based anti-spam regime: closer to CASL than to CAN-SPAM, but with a more forgiving inferred-consent path. It applies to any commercial electronic message (CEM) sent to an Australian address or from an Australian computer. Enforcement sits with the [Australian Communications and Media Authority (ACMA)](https://www.acma.gov.au/rules-businesses-sending-marketing-emails).\n\nThe Spam Act defines three ways a CEM can legally be sent:\n1. **Express consent**: the recipient knowingly opted in.\n2. **Inferred consent**: the recipient has conspicuously published a work email address *and* the message is relevant to their role. This is the B2B email path.\n3. **Specific exemptions**: government, educational institution, charity, political party, religious organization messages carry narrow exemptions. Not useful for commercial outreach.\n\nEvery CEM must meet three mandatory conditions, regardless of the consent path:\n- **Identify the sender**: the message must clearly state the individual or organization that authorized it, with accurate contact information.\n- **Include a functional unsubscribe facility**: low-cost, easy to use, and functional for at least 30 days after the message was sent.\n- **Not use misleading header information**: `from`, `subject`, and routing headers must not deceive.\n\n**ACMA enforcement is active.** [Published infringement notices](https://www.acma.gov.au/enforcement-action) routinely run into AUD $1-3 million for senders that ignored unsubscribes or used harvested lists. The largest settlements have crossed AUD $4 million. First-time, low-volume violations usually result in infringement notices rather than prosecution, but ACMA does prosecute repeat offenders.\n\n| Setup | Daily volume | Mailboxes | Domains | Infrabox cost |\n|-------|-------------|-----------|---------|---------------|\n| Australian founder / solo | 100-200 | 5-10 | 2-3 | $39/mo |\n| Small Aussie sales team | 500-1,500 | 25-50 | 8-15 | $99-$149/mo |\n| Australian agency | 2,000-5,000 | 75-150 | 25-50 | $299-$599/mo |\n| Enterprise APAC outbound | 5,000-15,000 | 150-400 | 50-120 | $600-$1,500/mo |\n\n*Infrabox tier pricing in USD. Australian senders typically pay slightly more per message due to longer APAC round-trip times for warmup traffic.*",
    },
    {
      heading: "Inferred Consent: The Only Path for Australian Email",
      content:
        "The Spam Act's inferred consent test has two conditions. Both must be true before an email is legal:\n\n**Condition 1: The recipient's electronic address has been conspicuously published.** ACMA's guidance clarifies this means the address is publicly available in a way that suggests the recipient accepts receiving work-related commercial email at that address. Examples that satisfy the test:\n- Contact page of a business website with a work email\n- LinkedIn profile with a visible work email\n- Professional association directory where members expect business contact\n- Conference attendee listing or speaker bio\n- Australian Business Register (ABR) / Australian Business Number (ABN) registration data\n\nExamples that do **not** satisfy the test:\n- Personal email harvested from a forum\n- Work address published on a page that carries a 'no unsolicited email' notice\n- Work address published by a third party without the recipient's involvement\n\n**Condition 2: The message is relevant to the recipient's business, functions, or duties.** This is the second half of the test and it matters. A marketing tool pitch to a marketing director is relevant. The same pitch to a warehouse supervisor is not. The Spam Act language is 'relevant to the business, functions or duties of the person in a business or official capacity': pitch relevance is assessed by ACMA on complaint.\n\n**Importantly:** inferred consent is not 'forever'. The Spam Act does not set an explicit expiry, but ACMA has indicated that stale inferred consent (address first captured years ago, no intervening engagement) is a weaker defense. The conservative read is to rebuild lists from source every 12-24 months.\n\n**The 'no unsolicited email' defeater.** A single public statement on the recipient's own contact page saying 'we do not accept unsolicited marketing email' defeats inferred consent for that address. ACMA treats this as a clear opt-out signal. Australian email programs must check contact pages before scraping and maintain a 'poisoned sources' list of domains whose contact pages carry such notices.",
    },
    {
      heading: "Australian Inbox Providers and Delivery Quirks",
      content:
        "Australia's inbox mix is Google-dominated for B2B but has a meaningful long tail of ISP-branded webmail from Telstra, Bigpond, and Optus.\n\n| Provider | Share of Australian B2B recipients | Notes for senders |\n|----------|------------------------------------|-------------------|\n| Gmail / Google Workspace | 50-60% | [2024 bulk sender rules](/learn/google-yahoo-sender-requirements-2026) apply |\n| Microsoft 365 / Outlook.com | 30-40% | Strong Australian enterprise presence |\n| Telstra / Bigpond | 3-6% | Legacy ISP mailbox, managed on Outlook.com-style infrastructure since 2021 |\n| iiNet / Internode / TPG | 1-3% | Small Australian ISP mailboxes, varying filter quality |\n| Apple iCloud Mail | 3-5% | SPF + DKIM mandatory |\n| Others | 2-4% | Fastmail (Australian-headquartered!), ProtonMail, local hosts |\n\n**The APAC latency problem.** Australia is far from everything. Messages sent from US or European IPs to Australian MTAs incur 150-300ms round-trip times, which amplifies SMTP timeout issues, causes soft bounces on retry, and gives geography-weighted filters (especially Microsoft 365) a reason to add a small reputation penalty. Australian senders who reach Australian recipients from US IPs generally see 3-8% lower Primary-tab placement compared to Australian-hosted senders. This is measurable but not catastrophic: an Australian B2B program with a proper warmup and clean domain reputation will still hit 80%+ inbox placement on Gmail from US IPs.\n\n**Data residency is almost never an email issue.** Australia's Privacy Act 1988 and the Australian Privacy Principles (APPs) govern how Australian personal information is handled, but they do not require Australian recipient data to stay in Australia. Email to a `@company.com.au` work address from a US-hosted Google Workspace mailbox is fully Spam Act and APP compliant as long as the sender meets APP 8 disclosure obligations for overseas data transfers, which for a cold sender means a line in the privacy notice, not a technical constraint.",
    },
    {
      heading: "Domain and Mailbox Setup for Australia",
      content:
        "**Domain plan for Australian outreach:**\n- 2-3 `.com.au` domains for Australia-native outreach (Australian recipients open `.com.au` addresses at noticeably higher rates)\n- 3-5 `.com` or `.io` domains for pan-APAC or international-feel outreach\n- Register `.com.au` domains through an [auDA](https://www.auda.org.au) accredited registrar and meet the Australian presence requirement\n- Spread across at least two registrars\n- 301 redirect every secondary domain to the primary brand site\n\n**Mailbox plan:**\n- Google Workspace default, Australian B2B is Gmail-heavy\n- Microsoft 365 at 35-40% to reach enterprise and government recipients\n- Per-mailbox volumes ramp: 20/day week 1 → 40/day week 2 → 60/day week 3 → 80+/day after week 4\n- [Isolated warmup](/learn/email-warmup-guide) for 14-28 days before first cold touch\n- Consider a small Microsoft 365 tenant in Australian data centres if Microsoft 365 placement is critical. Infrabox's Azure tier ($30/tenant for up to 100 mailboxes) is a low-cost way to experiment\n\n**DNS checklist per domain:**\n- SPF: `v=spf1 include:_spf.google.com ~all`\n- DKIM: two selectors published\n- DMARC: `p=none` to start, `quarantine` after 30 days of clean reports\n- MX: matches Google Workspace or Microsoft 365\n\n**Spam Act footer fields in every message:**\n- Sender name and authorized legal entity\n- Australian physical address or accurate overseas address\n- Phone or URL as second contact method\n- Unsubscribe link that works for at least 30 days after send\n- Unsubscribe must be free, low-cost, and not require the recipient to provide information beyond their email address\n\n![Infrabox isolated warmup dashboard for Australian email senders](/images/dashboard/warmup.png)",
    },
    {
      heading: "Volume, Warmup, and ACMA-Visible Risks",
      content:
        "Australian email shares the same Gmail+Microsoft 365 volume constraints as every other English-speaking market. Two ACMA-specific considerations stack on top.\n\n**Constraint 1: Complaint rate must stay under 0.1%.** ACMA accepts consumer complaints via its [report spam page](https://www.acma.gov.au/report-spam) and its Spam SMS short code. Complaints feed directly into ACMA's enforcement pipeline. A pattern of repeat complaints against a single sending domain almost always triggers an investigation.\n\n**Constraint 2: Unsubscribe requests must be processed within 5 working days.** This is shorter than CAN-SPAM's 10 business days and shorter than PECR's 'prompt' standard. Australian senders should build suppression workflows that process opt-outs the same day, not the 5-day statutory maximum.\n\n**Safe warmup cadence:**\n- Week 1: 10-20/day per mailbox, warmup only\n- Week 2: 20-40/day per mailbox, 5-10 real cold touches\n- Week 3: 40-60/day per mailbox, 70/30 warmup-to-cold\n- Week 4+: 60-100/day per mailbox, 30/70 warmup-to-cold\n\n**Volume math for a 2,000/day Australian outbound:**\n- ~35 active mailboxes at 60/day each\n- ~10 domains at ~3-4 mailboxes each\n- Infrabox Agency ($99/mo, 30 slots) + 5 extras at $3.25 = $115/mo\n- Warmup: 35 × $3 = $105/mo\n- InfraGuard: ~$10/mo for 10 domains\n- **Total: ~$230/month for 2,000 Australian emails/day**: about AUD $0.005 per sent message.",
    },
    {
      heading: "Australian Records and Documentation",
      content:
        "ACMA investigations typically start from consumer complaints. The sender is expected to demonstrate, on request, that each message had a legitimate basis under the Spam Act. A documented Australian email program has:\n\n**Per-contact records:**\n- Email address\n- Source URL (the conspicuously-published page)\n- Capture date\n- Role-relevance justification\n- Confirmation that the source page did not carry a no-solicitation notice\n- Send history\n- Unsubscribe date if applicable\n\n**Per-campaign records:**\n- Authorizing legal entity\n- Physical address used in the footer\n- Sending domain(s)\n- Copy of the message content\n- Unsubscribe mechanism tested\n\n**Per-year records:**\n- Spam Act compliance policy\n- Training log for staff\n- Suppression list audit\n\nRecords should be retained for at least 2 years under ACMA's guidance, and longer if the sender is also subject to APP 11 retention requirements for personal information.",
    },
    {
      heading: "Australian Email Setup Checklist",
      content:
        "**Week 0: provisioning:**\n- [ ] Register 5-10 domains (mix of `.com.au`, `.com`, `.co`)\n- [ ] Meet auDA Australian presence requirement for `.com.au`\n- [ ] Provision Google Workspace (60%) + Microsoft 365 (40%)\n- [ ] Automated DNS via Infrabox + Cloudflare\n- [ ] Enable isolated warmup on every mailbox\n- [ ] Enable InfraGuard on every domain\n\n**Week 1-4: warmup and compliance:**\n- [ ] Document Spam Act compliance policy and inferred consent methodology\n- [ ] Build list from conspicuously-published sources only, log source URL\n- [ ] Test unsubscribe flow (must work for 30 days)\n- [ ] Confirm footer has authorizing entity, address, alternate contact, unsubscribe\n\n**Week 5+: live outreach:**\n- [ ] Start sequences at 40-60/day per mailbox\n- [ ] First-touch plain text, relevant pitch, same-day unsubscribe processing\n- [ ] Weekly deliverability review across Gmail, Microsoft 365, Telstra/Bigpond\n- [ ] Quarterly suppression list audit\n\n**Red flags to escalate:**\n- Any ACMA correspondence\n- Google Postmaster domain reputation drops to Medium\n- Complaint rate above 0.1%\n- Unsubscribe rate per campaign above 2.5%",
    },
  ],
  faqs: [
    {
      question: "Is email legal in Australia?",
      answer:
        "Yes, under the Spam Act 2003, if the sender has inferred consent and the message meets the three mandatory conditions: clear sender identification, a functional unsubscribe that works for 30 days, and non-misleading headers. B2B email to a conspicuously-published work address, where the pitch is relevant to the recipient's role, is legal in practice and widely used by Australian sales teams.",
    },
    {
      question: "What is inferred consent under the Spam Act 2003?",
      answer:
        "Inferred consent exists when the recipient has conspicuously published a work email address and the message is relevant to their business, functions, or duties in that role. A LinkedIn profile with a visible work email, a corporate contact page, or a professional directory entry all create inferred consent: provided the page does not carry a 'no unsolicited email' notice. Personal addresses harvested from forums or social media do not.",
    },
    {
      question: "How much does ACMA fine spam senders?",
      answer:
        "ACMA has issued infringement notices and settlements ranging from AUD $12,600 to over AUD $4 million. Larger penalties cluster around repeat offenders, senders who ignored unsubscribes, and mass-blast campaigns with no consent basis. First-time, low-volume violations usually result in warnings or smaller infringement notices.",
    },
    {
      question: "Do I need a .com.au domain to send email to Australia?",
      answer:
        "No, `.com` and `.io` domains deliver fine to Australian recipients. `.com.au` domains get slightly higher open rates in Australia-to-Australia outreach because they signal local presence. Most Australian email programs mix 20-30% `.com.au` domains with 70-80% `.com` or `.co`, because `.com.au` requires an auDA presence requirement that adds administrative overhead.",
    },
    {
      question: "How much does Australian email infrastructure cost?",
      answer:
        "On Infrabox: AUD $60-100/mo for a founder or solo, AUD $150-350/mo for a small sales team, AUD $450-900/mo for an agency, and AUD $900-2,300/mo for enterprise outbound. A 2,000/day Australian outreach operation lands around AUD $345/month total (infrastructure + warmup + monitoring), which is about AUD $0.005 per sent message.",
    },
  ],
  sources: [
    {
      title: "Spam Act 2003 (Australian Legislation)",
      url: "https://www.legislation.gov.au/C2004A01214/latest/text",
      date: "2026",
    },
    {
      title: "ACMA, Rules for businesses sending marketing emails",
      url: "https://www.acma.gov.au/rules-businesses-sending-marketing-emails",
      date: "2026",
    },
    {
      title: "ACMA, Enforcement action",
      url: "https://www.acma.gov.au/enforcement-action",
      date: "2026",
    },
    {
      title: "Google & Yahoo Bulk Sender Requirements",
      url: "https://support.google.com/a/answer/14229414",
      date: "2024",
    },
    {
      title: "Office of the Australian Information Commissioner, APPs",
      url: "https://www.oaic.gov.au/privacy/australian-privacy-principles",
      date: "2026",
    },
  ],
  relatedSlugs: [
    "email-infrastructure-setup-guide",
    "email-compliance-gdpr-can-spam",
    "google-yahoo-sender-requirements-2026",
    "email-warmup-guide",
    "us-ip-benefits-guide",
  ],
};
