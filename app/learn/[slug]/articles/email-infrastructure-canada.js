export const article = {
  slug: "email-infrastructure-canada",
  title: "Email Infrastructure for Canada (2026)",
  metaDescription:
    "Email into Canada is CASL-governed — one of the strictest anti-spam regimes worldwide. The legal playbook plus the exact infrastructure that lands inboxes.",
  headline: "Email Infrastructure for Canada",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "email canada",
    "casl compliance",
    "canadian anti-spam",
    "crtc enforcement",
    "canada deliverability",
    "implied consent",
  ],
  excerpt:
    "CASL is the strictest anti-spam law in the G7. Email to Canada is legal only under narrow exemptions, business-to-business existing relationship, conspicuously-published addresses, or implied consent. Here is the playbook.",
  screenshots: [
    {
      src: "/images/dashboard/infraguard.png",
      alt: "Infrabox InfraGuard monitoring dashboard for Canadian email senders",
      caption:
        "InfraGuard catches blacklist listings and DNS drift within 6 hours, critical for CASL senders where a single suspension can trigger investigation.",
    },
  ],
  type: "guide",
  sections: [
    {
      heading: "Why Canada Is the Hardest English-Speaking Market for Email",
      content:
        "Canada's [Anti-Spam Legislation (CASL)](https://crtc.gc.ca/eng/internet/anti.htm), in force since July 1, 2014, is commonly described as the strictest anti-spam law in the G7, stricter than CAN-SPAM, often stricter than GDPR on the electronic messaging piece. CASL applies to any commercial electronic message (CEM) sent to, from, or accessed from a computer system in Canada. Unlike CAN-SPAM's opt-out model, CASL is an **opt-in** law: you need consent before you send, with a handful of narrow exemptions that cold senders must fit inside.\n\nThe Canadian Radio-television and Telecommunications Commission (CRTC) enforces CASL and can issue administrative monetary penalties up to [CAD $10 million per violation for a corporation](https://crtc.gc.ca/eng/internet/anti.htm). The Competition Bureau and Office of the Privacy Commissioner have overlapping jurisdiction. The private right of action was paused indefinitely in 2017, so class actions are not a current risk, but CRTC investigations and settlements are routine.\n\n**The practical implication for cold senders:** you cannot legally blast a scraped list of Canadian recipients. You can, however, legally email Canadian businesses under specific exemptions, and thousands of North American B2B teams do so every day. The infrastructure side of the problem is the same as the US, real mailboxes, US/North American IPs, proper warmup, but the *legal* side requires more care than any other major English-speaking market.\n\n| Setup | Daily volume | Mailboxes | Domains | Infrabox cost |\n|-------|-------------|-----------|---------|---------------|\n| Canadian B2B founder | 100-200 | 5-10 | 2-3 | $39/mo |\n| Small Canadian sales team | 500-1,500 | 25-50 | 8-15 | $99-$149/mo |\n| Canadian agency | 2,000-5,000 | 75-150 | 25-50 | $299-$599/mo |\n| Enterprise North American outbound | 5,000-15,000 | 150-400 | 50-120 | $600-$1,500/mo |\n\n*Infrabox pricing reflects Professional, Agency, and Enterprise tiers plus warmup and InfraGuard add-ons.*",
    },
    {
      heading: "CASL's Three Legal Paths for Email",
      content:
        "CASL section 6 prohibits sending a commercial electronic message without consent. The sender has the burden of proving consent existed at the time of sending. There are three ways an email to a Canadian recipient can be legal:\n\n**1. Express consent.** The recipient actively opted in via a clear, informed consent mechanism, signing a form, checking an un-pre-ticked box, clicking a confirmation email. Express consent has no expiry. This is the gold standard and the only safe path for marketing to consumers in Canada. Cold outbound rarely has express consent, by definition.\n\n**2. Implied consent.** CASL section 10(9) defines several categories that create implied consent. The two relevant to email are:\n- **Existing business relationship (EBR)**, the recipient has purchased from you, accepted a contract, or inquired about your products within the last 2 years. Not useful for first-touch email.\n- **Conspicuously published business address**, the recipient has published their email address in a way that is not accompanied by a statement declining unsolicited commercial messages, and the message is *relevant to their business role*. This is the exemption that B2B email hangs on.\n\nThe 'conspicuously published' exemption is narrower than most senders think. The recipient must have published the address themselves (a corporate website, a LinkedIn profile, a conference attendee list, a professional directory). The address must relate to their business, not personal. The message must be relevant to the recipient's role, pitching a marketing tool to a CFO is not relevant. The sender must not have been told 'do not send unsolicited email' anywhere on the page where the address was published.\n\n**3. Exemptions in section 6(5) and (6).** A handful of carve-outs apply to: messages to an organization's employee about their role (internal), family/personal relationships, messages responding to a request, legal and regulatory notices. These rarely apply to cold outbound.\n\n**The mandatory message content under CASL section 6(2):**\n- Sender's name and legal entity (if different)\n- Sender's physical mailing address\n- One other contact mechanism (phone, email, URL)\n- An unsubscribe mechanism that must be honored within 10 business days\n- The unsubscribe must be free and must not require the recipient to submit information beyond their email address\n\nThis is not a CAN-SPAM footer, it's a CASL footer, and it has to appear in every CEM.",
    },
    {
      heading: "The Conspicuously-Published Address Exemption in Practice",
      content:
        "This is the one section most Canadian email programs rely on, so it's worth getting right. CRTC has published [several bulletins clarifying section 10(9)(b)](https://crtc.gc.ca/eng/archive/2012/rp120605.htm), and the pattern that survives enforcement is:\n\n**The address is public on an official business source.** The recipient's `@company.ca` address appearing on the company's Team page, LinkedIn profile with a public email, conference attendee list, industry association member directory, or regulator-published professional register.\n\n**The public source has no 'no solicitation' statement.** If the page that publishes the address says 'we do not accept unsolicited marketing email' anywhere, the exemption is defeated for that address.\n\n**The message is relevant to the published role.** Pitching a B2B SaaS tool to a VP of Operations with the address published on the company's leadership page is relevant. Pitching the same tool to an accounts-payable clerk whose address is in a public invoice template is not.\n\n**The sender can document how the address was discovered.** Keeping a record of the source URL, the scrape/capture date, and the role-relevance justification is critical. CRTC can compel records, and the burden is on the sender to prove the exemption applied at the time of sending.\n\n**Practical list-building for Canadian email:**\n- Pull contacts from LinkedIn Sales Navigator searches with 'public email' visible\n- Scrape corporate Team/About/Leadership pages with a tool that preserves the source URL\n- Cross-reference with Canada's publicly-available business registries (e.g. [ic.gc.ca Federal Corporations](https://ised-isde.canada.ca/app/scr/cc/CorporationsCanada/hm.html))\n- Do **not** buy lists from a data broker, the chain of provenance almost never survives a CASL audit\n- Maintain a suppression list keyed by email that survives mailbox rotation and outreach campaign resets\n\nThe conservative read: if you can't point at the public source URL and defend why the pitch is relevant to the role, don't send.",
    },
    {
      heading: "Canadian Inbox Providers and Deliverability Context",
      content:
        "Canada's inbox mix is North American, similar to the US but with a larger share of ISP-branded webmail, because Canadian broadband subscribers often still use mailboxes from their telco.\n\n| Provider | Share of Canadian recipients | Notes |\n|----------|-----------------------------|-------|\n| Gmail / Google Workspace | 45-55% | Same [2024 bulk sender rules](/learn/google-yahoo-sender-requirements-2026) |\n| Microsoft 365 / Outlook.com | 30-40% | Canadian SMB leans M365 for French-English bilingual support |\n| Rogers / Yahoo hybrid | 2-5% | Historically on Yahoo infra, strict on unauthenticated mail |\n| Bell / Sympatico | 1-3% | Legacy mailboxes, run on Bell-hosted infrastructure |\n| Shaw / Telus | 1-3% | Western Canada telco mailboxes |\n| Apple iCloud Mail | 3-6% | Growing share, SPF+DKIM mandatory |\n\nThe data-residency conversation matters less than people assume. CASL does not require Canadian recipient data to stay in Canada, and major Canadian enterprises routinely use US-hosted Google Workspace and Microsoft 365 tenants. Privacy laws like [PIPEDA](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/) and Quebec's [Law 25](https://www.cai.gouv.qc.ca/english/) do impose cross-border transfer disclosures, but those apply to the controller of the recipient data, not to the cold sender's choice of sending IP location. US IPs deliver fine to Canadian recipients.\n\n**Quebec is a special case.** Law 25 (formerly Bill 64) adds French-language requirements for any commercial communication with Quebec residents. An email sent in English to a Quebec recipient at their work address is generally fine for CASL purposes, but if the recipient is a consumer, Quebec's Consumer Protection Act and Law 25 add overlapping obligations. Practical rule: treat Quebec B2B email the same way you treat the rest of Canada under CASL, and have a French translation ready if the recipient replies in French.",
    },
    {
      heading: "Domain and Mailbox Setup for Canada",
      content:
        "**Domain plan for Canadian outreach:**\n- 2-3 `.ca` domains for Canada-native outreach (Canadian recipients open `.ca` addresses at noticeably higher rates)\n- 3-5 `.com` or `.io` domains for pan-North-American outreach\n- Register `.ca` domains through a [Canadian Internet Registration Authority (CIRA)](https://www.cira.ca) certified registrar\n- Meet CIRA's Canadian presence requirement (a CA registrant or authorized agent)\n- Spread across at least two registrars\n\n**Mailbox plan:**\n- Google Workspace default (Canadian B2B is Gmail-heavy)\n- Microsoft 365 at 30-40% ratio to reach enterprise and bilingual-French recipients\n- Per-mailbox volumes ramp slowly: 20/day week 1 → 40/day week 2 → 60/day week 3 → 80+/day after week 4\n- Isolated warmup for 14-28 days before first cold touch\n\n**DNS checklist per domain:**\n- SPF: `v=spf1 include:_spf.google.com ~all` (or Microsoft equivalent)\n- DKIM: two selectors published\n- DMARC: start at `p=none`, tighten to `quarantine` after 30 days of clean reports\n- MX: matches your mailbox provider\n\n**CASL-specific footer fields to include in every message:**\n- Legal entity name of sender\n- Physical mailing address (Canadian or foreign. CASL accepts both)\n- Phone or URL as a second contact\n- Unsubscribe link that works with a single click and does not require login\n- Unsubscribe must be honored within 10 business days (CRTC treats slower as non-compliance)\n\nInfrabox's isolated warmup network and InfraGuard monitoring give Canadian senders early warning on domain reputation issues before they compound into CRTC-visible problems.",
    },
    {
      heading: "Volume, Warmup, and CRTC-Visible Risks",
      content:
        "Canadian email volume planning is the same Gmail+Microsoft 365 math as US outbound, with two extra rules.\n\n**Rule 1: Keep unsubscribe-rate per campaign under 2%.** CRTC does not publish a hard threshold, but audit patterns suggest campaigns with higher unsubscribe rates are flagged for investigation because the bureau interprets high unsubscribes as a signal that consent was weak.\n\n**Rule 2: Keep complaint rate under 0.1%.** Canadian recipients can forward spam to the [Spam Reporting Centre](https://fightspam.gc.ca/eic/site/030.nsf/eng/home) which feeds complaints directly to CRTC and the Competition Bureau. Sustained complaints are the most reliable predictor of investigation.\n\n**Safe warmup cadence for Canadian outbound:**\n- Week 1: 10-20/day per mailbox, warmup network only\n- Week 2: 20-40/day per mailbox, 5-10 real cold touches to engaged contacts\n- Week 3: 40-60/day per mailbox, 70/30 warmup-to-cold\n- Week 4+: 60-100/day per mailbox, 30/70 warmup-to-cold\n\n**Volume math for a 3,000/day Canadian outbound:**\n- ~50 active mailboxes at 60/day each\n- ~15 domains at ~3-4 mailboxes each\n- Infrabox Agency ($99/mo, 30 slots) + 20 extra mailboxes at $3.25 = $164/mo\n- Warmup add-on: 50 × $3 = $150/mo\n- InfraGuard: ~$15/mo for 15 domains\n- **Total: ~$329/month for 3,000 Canadian emails/day**: roughly CAD $0.005 per sent message at today's FX.",
    },
    {
      heading: "What to Document Before Your First Canadian Email",
      content:
        "CRTC investigations start from complaints and escalate via records requests. A Canadian email program that survives one looks boring on paper:\n\n**Per-contact records to retain (keep 3 years minimum):**\n- Email address\n- Source URL where the address was conspicuously published\n- Capture date\n- Role relevance justification (one-liner)\n- Whether the source page had a no-solicitation notice (should always be 'no')\n- Send history (campaign IDs, dates, opened/replied/unsubscribed flags)\n- Unsubscribe date if applicable\n\n**Per-campaign records:**\n- Sender legal entity on the footer\n- Physical address used\n- Unsubscribe mechanism tested and working\n- Copy of the message body\n- Sending domain(s) used\n\n**Per-year records:**\n- Training log for anyone on the team who sends or supervises email\n- CASL compliance policy document\n- Suppression list integrity check (proves unsubscribes were honored)\n\nInfrabox's per-mailbox activity logs give you the send history piece automatically. The legal and list-provenance records you build yourself.",
    },
    {
      heading: "Canadian Email Setup Checklist",
      content:
        "**Week 0, provisioning:**\n- [ ] Register 5-10 domains (mix of `.ca`, `.com`, `.co`)\n- [ ] Meet CIRA Canadian presence requirement for `.ca` domains\n- [ ] Provision Google Workspace mailboxes (65%) + Microsoft 365 mailboxes (35%)\n- [ ] Automated DNS via Infrabox + Cloudflare\n- [ ] Enable isolated warmup on every mailbox\n- [ ] Enable InfraGuard on every domain\n\n**Week 1-4, warmup and compliance foundation:**\n- [ ] Document CASL compliance policy\n- [ ] Build list from conspicuously-published sources only\n- [ ] Retain source URL + role relevance per contact\n- [ ] Test unsubscribe flow end-to-end\n- [ ] Confirm the CASL footer is present on every sending template\n\n**Week 5+, live outreach:**\n- [ ] Start sequences at 40-60/day per mailbox\n- [ ] First-touch plain text, clear sender identity, relevant pitch, simple unsubscribe\n- [ ] Monitor complaint rate, throttle any campaign above 0.15%\n- [ ] Weekly review across Gmail, Microsoft 365, and ISP-branded recipients\n- [ ] Quarterly suppression list audit\n\n**Red flags to escalate immediately:**\n- Any CRTC correspondence or Spam Reporting Centre forward\n- Google Postmaster domain reputation drops to Medium\n- Complaint rate above 0.2%\n- Unsubscribe rate per campaign above 3%",
    },
  ],
  faqs: [
    {
      question: "Is email legal in Canada?",
      answer:
        "Email to Canadian recipients is legal under CASL only if it fits an exemption. The two that matter for B2B are (a) existing business relationship within 2 years, and (b) conspicuously-published business address where the pitch is relevant to the recipient's role and no 'no solicitation' notice appears on the source page. Every message must carry a CASL-compliant footer and an unsubscribe that is honored within 10 business days.",
    },
    {
      question: "What is the fine for CASL violations?",
      answer:
        "CRTC can issue administrative monetary penalties up to CAD $10 million per violation for a corporation and CAD $1 million for an individual. Settlements are more common than maximum penalties, typical undertakings range from CAD $50,000 to CAD $1.5 million depending on volume, intent, and prior warnings. The private right of action under CASL section 47 was paused indefinitely in 2017.",
    },
    {
      question: "Do I need a .ca domain to send email to Canadians?",
      answer:
        "No, `.com` and `.co` domains deliver fine to Canadian recipients. `.ca` domains get slightly higher open rates in Canada-to-Canada outreach because they signal local presence, but the trade-off is CIRA's Canadian presence requirement on registration. Most Canadian B2B email programs mix 20-30% `.ca` domains with 70-80% `.com` or `.co`.",
    },
    {
      question: "Can a US sender legally email Canadian recipients?",
      answer:
        "Yes, provided the message complies with CASL. CASL applies based on the location of the recipient's computer system, not the sender, so a US-based company sending to a Canadian address is fully subject to CASL. US senders should build CASL-compliant footers into their templates whenever a campaign includes Canadian addresses, not only when the entire list is Canadian.",
    },
    {
      question: "How much does Canadian email infrastructure cost?",
      answer:
        "On Infrabox: CAD $55-100/mo for a founder or small team, CAD $200-400/mo for a small sales operation, CAD $450-900/mo for an agency, and CAD $900-2,200/mo for enterprise outbound. Costs at 3,000 messages per day land around CAD $0.005 per sent message, excluding list-building and compliance labor.",
    },
  ],
  sources: [
    {
      title: "CRTC. Canada's Anti-Spam Legislation",
      url: "https://crtc.gc.ca/eng/internet/anti.htm",
      date: "2026",
    },
    {
      title: "CRTC. Information Bulletin 2012-548 on section 10(9)",
      url: "https://crtc.gc.ca/eng/archive/2012/rp120605.htm",
      date: "2012",
    },
    {
      title: "Fight Spam Canada. Spam Reporting Centre",
      url: "https://fightspam.gc.ca/eic/site/030.nsf/eng/home",
      date: "2026",
    },
    {
      title: "Office of the Privacy Commissioner. PIPEDA",
      url: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
      date: "2026",
    },
    {
      title: "Google & Yahoo Bulk Sender Requirements",
      url: "https://support.google.com/a/answer/14229414",
      date: "2024",
    },
  ],
  relatedSlugs: [
    "email-infrastructure-setup-guide",
    "email-compliance-gdpr-can-spam",
    "email-infrastructure-us",
    "email-warmup-guide",
    "email-deliverability-monitoring-setup",
  ],
};
