export const article = {
  slug: "email-infrastructure-india",
  title: "Email Infrastructure for India (2026)",
  metaDescription:
    "Email to India in 2026: what the DPDP Act means for B2B outreach, how IT Act rules apply, and CERT-In logging obligations.",
  headline: "Email Infrastructure for India",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "email india",
    "dpdp act",
    "india it act",
    "cert-in",
    "india email",
    "b2b email india",
  ],
  excerpt:
    "India's Digital Personal Data Protection Act is reshaping email compliance for Indian recipients. Here is what B2B senders need to know and the infrastructure that works for a Gmail-dominated inbox market.",
  screenshots: [
    {
      src: "/images/dashboard/prewarm.png",
      alt: "Infrabox pre-warm dashboard for email senders reaching Indian recipients",
      caption:
        "Infrabox's isolated warmup reduces cold-start delays, critical for Indian outbound where latency from US IPs already adds overhead.",
    },
  ],
  type: "guide",
  sections: [
    {
      heading: "The State of Email Compliance in India",
      content:
        "India is the world's second-largest email market by user count and one of the most active for cold outbound, both inbound to India and outbound from Indian teams reaching global buyers. The legal framework changed meaningfully in 2023 with the passage of the [Digital Personal Data Protection Act 2023 (DPDP Act)](https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf), which began phased enforcement in 2025 and is now the primary law for personal data processing in India. Layered on top are the [Information Technology Act 2000](https://www.meity.gov.in/content/information-technology-act-2000) with its amendments, the [CERT-In directions of April 2022](https://www.cert-in.org.in) on cybersecurity logging, and sector-specific rules from SEBI, TRAI, and the RBI for regulated industries.\n\n**What this means for email senders in 2026:**\n\n1. **The DPDP Act governs the personal data side.** Email addresses are personal data. Processing them for commercial prospection requires a lawful basis. The DPDP Act recognizes consent and 'legitimate uses' (a specific list in Section 7) as lawful bases. Cold marketing email does not fit any of the Section 7 legitimate uses, which means Indian senders and senders targeting Indian recipients need consent, with an exception for B2B contact where the recipient has voluntarily shared professional details.\n\n2. **The IT Act and TRAI rules govern commercial messages in aggregate.** TRAI's Telecom Commercial Communications Customer Preference Regulations (TCCCPR) apply primarily to SMS and voice, but their spirit extends to email via IT Act rules against sending offensive or unsolicited messages. In practice, Indian email enforcement is much lower than CASL or GDPR enforcement, but that is changing.\n\n3. **CERT-In logging applies to the sending infrastructure.** Any service provider in India, including email sending services and SMTP operators, must retain ICT system logs for 180 days and report cybersecurity incidents within 6 hours. This affects Indian-based infrastructure operators more than senders, but it affects how Indian email tools must be built.\n\n**Current enforcement reality:** India's email enforcement is significantly lighter than the US, EU, UK, Canada, or Australia as of 2026. The DPDP Act's Data Protection Board (DPB) is still ramping up. There are not yet published fines targeting email senders. This creates a 'compliance honeymoon' that smart senders are using to build proper practices before the DPB starts actively prosecuting because the DPDP Act penalties are high (up to ₹250 crore per violation) once the board is fully operational.\n\n| Setup | Daily volume | Mailboxes | Domains | Infrabox cost |\n|-------|-------------|-----------|---------|---------------|\n| Indian founder / solo | 100-200 | 5-10 | 2-3 | $39/mo |\n| Indian B2B SaaS team | 500-1,500 | 25-50 | 8-15 | $99-$149/mo |\n| Indian outbound agency | 2,000-5,000 | 75-150 | 25-50 | $299-$599/mo |\n| Enterprise India→Global outbound | 5,000-15,000 | 150-400 | 50-120 | $600-$1,500/mo |\n\n*Infrabox USD pricing. A 2,000/day Indian cold outreach operation typically lands at around ₹17,500-₹20,000 per month (~$215/mo).*",
    },
    {
      heading: "DPDP Act: What Indian Cold Senders Must Do in 2026",
      content:
        "The DPDP Act is India's first comprehensive data protection law. Its core obligations for email senders, whether the sender is Indian or foreign, are:\n\n**Lawful basis.** Section 6 requires consent or one of the Section 7 legitimate uses. For B2B email, consent is the primary path. The DPDP Act does not recognize 'legitimate interest' as a standalone basis the way GDPR does. This makes India *stricter* on paper than the UK, Netherlands, or France, and closer to Germany.\n\n**Consent must be free, specific, informed, unconditional, and unambiguous.** Section 6(1) lists these criteria. A pre-ticked box is not unambiguous. Consent buried in terms of service is not specific. Consent conditioned on service access is not free. Indian senders running opt-in lists must build consent flows that meet all five tests.\n\n**Notice at the time of consent.** Section 5 requires a notice in English or one of 22 Indian languages listed in the Eighth Schedule, covering: the purpose of processing, the rights of the data principal (Indian term for data subject), and the manner in which the principal can file a complaint with the DPB.\n\n**Data principal rights.** Sections 11-15 establish the right to access, correct, update, erase, and nominate a representative. These rights apply to email addresses held for cold outreach. Senders need a workflow for responding to DPIIT requests.\n\n**The B2B carve-out, and its limits.** DPDP Act Section 17(1)(c) exempts personal data 'made available by a data principal to whom it relates, for a specified purpose that was reasonably ascertainable'. Some Indian lawyers read this as allowing email to a conspicuously-published professional address, similar to Australia's inferred consent. This is a reasonable interpretation but untested. Until the DPB issues clear guidance, conservative senders should not rely on Section 17(1)(c) for cold prospection.\n\n**Practical Indian B2B email in 2026:** Senders are mostly continuing cold outbound programs while building compliance infrastructure in parallel. The compliance infrastructure includes:\n- Consent tracking system with timestamp, source, purpose, and version\n- Privacy notice in English and at least one Indian language for Indian audiences\n- DPB complaint workflow (an email inbox, responsive within 30 days)\n- Suppression list with indefinite retention\n- Breach notification plan (72 hours to DPB under DPDP Act Section 8(6))",
    },
    {
      heading: "Indian Inbox Providers: Gmail-Dominated with a Long Tail",
      content:
        "India's inbox mix is more Gmail-dominated than any other major market. Microsoft 365 is the second player, but distant, and Indian ISP-branded mail has largely disappeared.\n\n| Provider | Share of Indian B2B recipients | Notes |\n|----------|-------------------------------|-------|\n| Gmail / Google Workspace | 65-75% | Dominant. Indian B2B runs on Gmail |\n| Microsoft 365 / Outlook.com | 15-25% | Enterprise and public sector |\n| Rediffmail / Rediff Pro | 1-3% | Legacy Indian mailbox, mostly consumer |\n| Zoho Mail | 2-5% | Indian-origin provider with growing B2B share |\n| Yahoo Mail India | 1-2% | Declining |\n| Apple iCloud Mail | 1-3% | Growing with iPhone penetration |\n| Others | 2-4% | Zoho self-hosted, small hosts |\n\n**Gmail dominance has practical consequences.** The [2024 Google bulk sender rules](/learn/google-yahoo-sender-requirements-2026) apply directly, a cold sender reaching 5,000 Indian Gmail recipients per day is immediately inside the bulk threshold and needs DMARC alignment, one-click unsubscribe, and 0.3%-max complaint rate. Because Indian B2B skews Gmail even more than the US or UK, this is unavoidable.\n\n**Zoho Mail is the one Indian-origin player worth knowing.** Zoho Corporation is headquartered in Chennai and runs a Google Workspace alternative used by many Indian SMBs. Zoho Mail follows close-to-Gmail filtering rules but maintains its own [postmaster practices](https://www.zoho.com/mail/help/postmaster/). Senders reaching Zoho-hosted recipients should register for Zoho Postmaster Tools if volume warrants it.\n\n**Latency is a real concern.** Sending from US IPs to Indian Gmail recipients crosses Pacific or Atlantic + Europe paths with 200-280ms round-trip times. SMTP handshake reliability drops slightly, and Google's inbound MTAs in Mumbai and Bangalore treat trans-Pacific connections with marginally more scrutiny. Indian senders often pair US-IP mailboxes with warmup from servers in India or Singapore to improve the SMTP success rate.",
    },
    {
      heading: "CERT-In Logging and What It Means for Infrastructure",
      content:
        "CERT-In's [April 28, 2022 directions](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf) apply to service providers, intermediaries, data centres, body corporates, and government organizations operating in India. Email senders and mailbox operators in India are affected in several ways:\n\n**180-day log retention.** All ICT system logs must be retained in India for 180 days. This includes email sending logs, authentication logs, and access logs. Indian-based SMTP operators and sequencing tools need log storage that meets this rule.\n\n**6-hour incident reporting.** Any cybersecurity incident, including unauthorized access to email accounts, credential leaks, phishing hosted on the sender's infrastructure, must be reported to CERT-In within 6 hours of discovery.\n\n**Known customer identification.** Service providers must maintain KYC records of their Indian customers. This matters if you're using an Indian email infrastructure provider. They will need your KYC docs.\n\n**Practical impact on cold senders:**\n- **If you are an Indian entity using Infrabox (or similar US-based tools):** CERT-In directions primarily cover your local logs and any incident affecting your own systems. Infrabox retains activity logs by default and Indian customers can export them for CERT-In reporting if needed.\n- **If you are building your own SMTP infrastructure in India:** you're a 'service provider' and the full set of CERT-In obligations applies, including 180-day log retention, incident reporting, and KYC.\n- **If you are a foreign entity emailing Indian recipients:** CERT-In does not directly regulate you, but any incident affecting Indian recipients (credential leak, phishing) may still require a coordinated response with Indian authorities.\n\nThe [Data Protection Board](https://www.meity.gov.in) is the new primary enforcer for the DPDP Act, but CERT-In still handles the cybersecurity side. Sensible Indian email programs loop both into their compliance planning.",
    },
    {
      heading: "Domain and Mailbox Setup for Indian Email",
      content:
        "**Domain plan for Indian outreach:**\n- 1-3 `.in` or `.co.in` domains for India-native outreach (recipients open `.in` addresses at ~3-5% higher rates than `.com`)\n- 3-5 `.com` or `.io` domains for outbound to global buyers\n- Register `.in` through a [NIXI](https://registry.in) accredited registrar\n- 301 redirect secondary domains to the primary brand\n- Publish a privacy notice on every redirect target\n\n**Mailbox plan:**\n- Google Workspace is the default for reaching Indian recipients. Gmail dominance makes this obvious\n- Microsoft 365 at 20-30% to cover the enterprise minority\n- Consider adding Zoho Mail mailboxes if targeting Indian SMB\n- Per-mailbox volumes ramp: 20/day week 1 → 40/day week 2 → 60/day week 3 → 80+/day after week 4\n- [Isolated warmup](/learn/email-warmup-guide) for 14-28 days\n\n**DNS checklist:**\n- SPF: `v=spf1 include:_spf.google.com ~all`\n- DKIM: two selectors\n- DMARC: `p=none` to start, `p=quarantine` after 30 days\n- MX: matches mailbox provider\n\n**Indian-specific content rules:**\n- Clear sender identification (legal entity name, address)\n- Privacy notice link in every message, the English version is usually sufficient, but a Hindi version improves compliance optics\n- One-click unsubscribe\n- Mention of the DPB complaint pathway\n- Optional: bilingual subject lines for consumer or regional outreach (English + Hindi, or English + Tamil/Telugu/Bengali/Marathi depending on region)\n\n![Infrabox pre-warm dashboard for email senders reaching Indian recipients](/images/dashboard/prewarm.png)",
    },
    {
      heading: "Volume, Warmup, and the India Latency Gap",
      content:
        "Indian email volume planning runs on Gmail's rules. The 2024 bulk sender requirements are the binding constraint. DMARC alignment, 0.3% complaint ceiling, one-click unsubscribe.\n\n**The latency gap.** US-IP mailboxes reach Indian Gmail recipients with 200-280ms round-trip times. This doesn't break delivery but does amplify SMTP retry behavior, which shows up as a higher soft-bounce rate (1-2%) compared to same-region sending. Indian senders running volume above 5,000/day benefit from a mix of US-IP mailboxes and warmup traffic originating closer to India, which helps the receiving MTAs see consistent connection patterns.\n\n**Safe warmup cadence for India:**\n- Week 1: 10-20/day per mailbox, warmup only\n- Week 2: 20-40/day per mailbox, 5-10 real cold touches\n- Week 3: 40-60/day per mailbox, 70/30 warmup-to-cold\n- Week 4+: 60-100/day per mailbox, 30/70 warmup-to-cold\n\n**Volume math for 3,000/day Indian outbound:**\n- ~50 active mailboxes at 60/day each\n- ~15 domains at 3-4 mailboxes each\n- Infrabox Agency ($99/mo, 30 slots) + 20 extras at $3.25 = $164/mo\n- Warmup: 50 × $3 = $150/mo\n- InfraGuard: ~$15/mo for 15 domains\n- **Total: ~$329/month (~₹27,500/month) for 3,000 Indian emails/day**: about ₹0.30 per sent message.",
    },
    {
      heading: "India→Global Outbound: A Common Pattern",
      content:
        "A lot of Infrabox's Indian customers aren't sending *to* Indian recipients. They're Indian SaaS companies, agencies, and freelancers sending *from* India to US, UK, and European buyers. This is the more common pattern, and the infrastructure needs are slightly different.\n\n**The operational challenge:** an Indian team using Indian infrastructure to send to US recipients sees US-recipient inbox placement trail US-origin senders by 5-15%. The reason is the same IP geolocation signal that hurts trans-continental sending in every direction. The fix is to use mailboxes on US-based IPs, which is Infrabox's default for Indian customers targeting US markets.\n\n**Recommended setup for Indian agencies running outbound to US/EU:**\n- Google Workspace mailboxes on Infrabox US IPs (matches recipient geography)\n- Domains `.com` or `.io`, not `.in` (US recipients are less likely to open `.in` domains)\n- English-language content optimized for US or UK audiences\n- Warmup from US-based engaged recipients\n- [InfraGuard](/learn/email-deliverability-monitoring-setup) running on the global DNSBL set (Spamhaus, Barracuda, SORBS)\n\nThis setup costs the same as any other Infrabox deployment but delivers 5-15% better US inbox placement than sending from Indian IPs. For an Indian agency running 5,000 messages per day to US recipients, that's 250-750 extra Primary-tab placements per day.",
    },
    {
      heading: "Indian Email Setup Checklist",
      content:
        "**Week 0, provisioning:**\n- [ ] Register 5-10 domains (mix of `.in`, `.co.in`, `.com`, `.io`)\n- [ ] Publish English privacy notice; add Hindi version if targeting Hindi-speaking audiences\n- [ ] Provision Google Workspace (70%) + Microsoft 365 (25%) + optional Zoho Mail (5%)\n- [ ] Automated DNS via Infrabox\n- [ ] Enable isolated warmup and InfraGuard\n\n**Week 1-4, warmup and compliance:**\n- [ ] Document DPDP Act consent and processing methodology\n- [ ] Build consent capture flow for opt-in paths\n- [ ] Test unsubscribe workflow\n- [ ] Establish DPB complaint handling inbox\n- [ ] Ensure CERT-In log retention is meeting 180 days if operating Indian infrastructure\n\n**Week 5+, live outreach:**\n- [ ] Start sequences at 40-60/day per mailbox\n- [ ] First-touch plain text, clear sender identity, simple unsubscribe\n- [ ] Daily opt-out processing\n- [ ] Weekly deliverability review across Gmail, Microsoft 365, Zoho Mail\n- [ ] Quarterly DPDP Act compliance review\n\n**Red flags to escalate:**\n- Any DPB correspondence\n- Google Postmaster domain reputation drops to Medium\n- Complaint rate above 0.2%\n- Any CERT-In incident reporting trigger",
    },
  ],
  faqs: [
    {
      question: "Is email legal in India?",
      answer:
        "Yes, in practice, though the legal framework is tightening. The Digital Personal Data Protection Act 2023 (DPDP Act) governs the personal data side and requires a lawful basis, primarily consent, for processing Indian recipient data. Enforcement by the new Data Protection Board (DPB) is still ramping up in 2026, creating a compliance honeymoon. B2B email continues to operate but smart senders are building DPDP-compliant infrastructure now.",
    },
    {
      question: "What is the DPDP Act and how does it apply to email?",
      answer:
        "The Digital Personal Data Protection Act 2023 is India's first comprehensive data protection law, passed in 2023 and now in phased enforcement. It requires consent or specific legitimate uses for processing personal data, email addresses count as personal data. Cold marketing email does not fit any of the Section 7 legitimate uses, so consent is the primary lawful basis for Indian recipients. Penalties can reach ₹250 crore per violation once the DPB is fully operational.",
    },
    {
      question: "Do CERT-In logging rules apply to email senders?",
      answer:
        "They apply to Indian service providers, including Indian SMTP operators and email sending services. The 180-day log retention and 6-hour incident reporting obligations affect anyone operating email infrastructure in India. If you are a foreign sender (or using a foreign tool like Infrabox from India), CERT-In directions apply primarily to the tool provider, not to your own sending activity, but any incident affecting Indian recipients may still require a coordinated response.",
    },
    {
      question: "Should Indian senders use US IPs or Indian IPs?",
      answer:
        "It depends on recipient geography. Indian senders reaching Indian recipients should use whichever mailboxes deliver best to Gmail, typically US-based Google Workspace because Gmail's inbound infrastructure handles trans-Pacific traffic cleanly. Indian senders reaching US or EU recipients should use US-based mailboxes (Infrabox's default) because IP geolocation matches recipient geography and improves inbox placement by 5-15%.",
    },
    {
      question: "How much does Indian email infrastructure cost?",
      answer:
        "On Infrabox: ₹3,200/mo (~$39) for a founder or solo, ₹8,200-₹12,000/mo (~$99-$149) for a small team, ₹25,000-₹49,000/mo (~$299-$599) for an agency, and ₹49,000-₹125,000/mo (~$599-$1,500) for enterprise outbound. A 3,000/day Indian campaign lands around ₹27,500/month total (~$329/mo), or ₹0.30 per sent message.",
    },
  ],
  sources: [
    {
      title: "Digital Personal Data Protection Act 2023",
      url: "https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf",
      date: "2023",
    },
    {
      title: "Information Technology Act 2000",
      url: "https://www.meity.gov.in/content/information-technology-act-2000",
      date: "2026",
    },
    {
      title: "CERT-In. April 2022 Directions",
      url: "https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf",
      date: "2022",
    },
    {
      title: "Google & Yahoo Bulk Sender Requirements",
      url: "https://support.google.com/a/answer/14229414",
      date: "2024",
    },
    {
      title: "Ministry of Electronics and Information Technology",
      url: "https://www.meity.gov.in",
      date: "2026",
    },
  ],
  relatedSlugs: [
    "email-compliance-gdpr-can-spam",
    "email-infrastructure-setup-guide",
    "us-ip-benefits-guide",
    "email-warmup-guide",
    "google-yahoo-sender-requirements-2026",
  ],
};
