export const article = {
  slug: "email-infrastructure-netherlands",
  title: "Email Infrastructure for Netherlands (2026)",
  metaDescription:
    "Dutch email law: Telecommunicatiewet permits B2B messages to legal entities without consent. What the ACM and AP expect, plus the infrastructure setup.",
  headline: "Email Infrastructure for the Netherlands",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "email netherlands",
    "telecommunicatiewet",
    "acm enforcement",
    "dutch gdpr",
    "b2b email netherlands",
    "autoriteit persoonsgegevens",
  ],
  excerpt:
    "The Netherlands has one of the clearest B2B email exemptions in Europe: legal entities are fair game with clear opt-out. Here is what Dutch law expects and the infrastructure that works.",
  screenshots: [
    {
      src: "/images/dashboard/dashboard-home.png",
      alt: "Infrabox dashboard home for Dutch email senders",
      caption:
        "Infrabox dashboard: unified view of mailboxes, warmup, and deliverability across domains used by Dutch B2B senders.",
    },
  ],
  type: "guide",
  sections: [
    {
      heading: "The Dutch B2B Email Framework",
      content:
        "The Netherlands is one of the friendlier European markets for B2B email. Dutch email is governed by the [Telecommunicatiewet (Telecommunications Act) article 11.7](https://wetten.overheid.nl/BWBR0009950/), which implements the EU ePrivacy Directive with a B2B exemption that both Germany and (formally) France chose not to apply. The law draws a sharp line between natural persons and legal entities:\n\n**Natural persons** (consumers, sole traders, freelancers who haven't registered a BV or NV) require **prior express consent** to receive commercial email. This is the standard ePrivacy rule.\n\n**Legal entities** (BV, NV, stichting, vereniging, coöperatie) can be emailed for commercial purposes **without prior consent**, provided:\n1. The sender clearly identifies themselves\n2. The message offers a clear opt-out mechanism\n3. Each subsequent message continues to honor opt-out requests\n4. The sender maintains a suppression list\n\nThis is a genuinely useful exemption for B2B email, and it is why the Netherlands has a more active cold outbound market than Germany or France. Dutch B2B [SaaS companies](/learn/email-infrastructure-saas), agencies, and recruiters run large email programs into Dutch limited companies and public sector entities every day, legally and at scale.\n\n**Enforcement is split between two regulators:**\n- [Autoriteit Consument & Markt (ACM)](https://www.acm.nl/en) enforces the Telecommunicatiewet itself, including the electronic marketing rules\n- [Autoriteit Persoonsgegevens (AP)](https://www.autoriteitpersoonsgegevens.nl/en) enforces the Dutch implementation of GDPR (Uitvoeringswet AVG)\n\nBoth can fine Dutch senders. ACM typically focuses on technical violations (missing opt-outs, hidden sender identity, ignored suppression lists) while AP focuses on the data-processing side (lawful basis, privacy notices, data subject rights).\n\n| Setup | Daily volume | Mailboxes | Domains | Infrabox cost |\n|-------|-------------|-----------|---------|---------------|\n| Dutch founder / solo | 100-200 | 5-10 | 2-3 | $39/mo |\n| Small Dutch B2B team | 500-1,500 | 25-50 | 8-15 | $99-$149/mo |\n| Dutch agency | 2,000-5,000 | 75-150 | 25-50 | $299-$599/mo |\n| Enterprise BeNeLux outbound | 5,000-15,000 | 150-400 | 50-120 | $600-$1,500/mo |\n\n*A 2,000/day Dutch email operation typically lands around €210/month total.*",
    },
    {
      heading: "Natural Person vs Legal Entity: The Test That Matters",
      content:
        "The Netherlands email compliance test is mostly about correctly classifying recipients. A Dutch email program that maps every contact to a legal-entity classification survives ACM scrutiny; one that blasts `@company.nl` addresses without classification does not.\n\n**Legal entities under Dutch civil law:**\n- Besloten Vennootschap (BV): private limited company\n- Naamloze Vennootschap (NV): public limited company\n- Stichting: foundation\n- Vereniging: association\n- Coöperatie: cooperative\n- Public sector bodies (ministries, municipalities, universities)\n\n**Natural persons (not eligible for the B2B exemption):**\n- Zelfstandige zonder personeel (ZZP) / sole trader not registered as a legal entity\n- Freelancer operating under their own name\n- Private individuals\n- Partners in a commanditaire vennootschap (CV) or vennootschap onder firma (VOF): because these are not separate legal entities under Dutch law\n\n**How to verify legal entity status:** The [Kamer van Koophandel (KvK) Handelsregister](https://www.kvk.nl/en/) is the Dutch business register. Every legal entity in the Netherlands has a KvK number, which can be looked up to confirm its status. Dutch cold senders should verify that their list contacts work for KvK-registered BVs, NVs, stichtingen, etc. before first send. This is a small piece of friction but it is the single best defense against ACM complaints.\n\n**The subtle issue:** a VOF (general partnership) is the most common Dutch SMB legal form and does *not* count as a legal entity under the Telecommunicatiewet B2B exemption. Each partner is a natural person. So an email to `jan@smitenjansen.nl` where Smit en Jansen is a VOF technically requires prior consent: even though the recipient is acting in a clearly professional capacity. This is the most common mistake in Dutch cold outbound.\n\n**Practical classification workflow:**\n1. Scrape or acquire the target list\n2. For each domain, look up the KvK Handelsregister to confirm the entity type\n3. Filter out natural-person entities (ZZP, VOF, CV)\n4. For remaining legal-entity domains, match role relevance\n5. Send",
    },
    {
      heading: "Dutch Inbox Providers and Delivery Context",
      content:
        "The Netherlands has a fairly standard Gmail + Microsoft 365 dominated inbox mix, with a meaningful share of ISP-branded webmail from KPN (formerly the Dutch national telco) and hosted mail from Dutch webhosts.\n\n| Provider | Share of Dutch B2B recipients | Notes |\n|----------|-------------------------------|-------|\n| Gmail / Google Workspace | 45-55% | [2024 bulk sender rules](/learn/google-yahoo-sender-requirements-2026) apply |\n| Microsoft 365 / Outlook.com | 30-40% | Strong Dutch enterprise install base |\n| KPN Mail (kpnmail.nl) | 2-5% | Legacy national telco mailbox, now runs on a Microsoft backend |\n| Ziggo (ziggo.nl) | 1-3% | Dutch cable ISP holdover |\n| TransIP / Strato / Antagonist | 2-5% | Dutch hosted mail for SMB |\n| Apple iCloud Mail | 3-5% | Mandatory SPF + DKIM |\n| Others | 1-3% | Fastmail, ProtonMail, smaller hosts |\n\n**KPN Mail is easier than Orange in France.** After KPN migrated its consumer mailbox service to a Microsoft-hosted backend in 2022, the filtering rules converged with standard Microsoft 365 filtering, so KPN delivery issues usually track the same root causes as Outlook.com issues. Ziggo and TransIP are smaller but have their own quirks: both are stricter on unauthenticated mail and both benefit from clean DMARC alignment.\n\n**Dutch recipients are unusually tolerant of English-language email.** Unlike France or Germany, where native-language content is effectively required for acceptable open rates, Dutch B2B recipients (especially in tech, SaaS, finance, and logistics) open and engage with English-language email at rates comparable to native-language messages. This is a real operational advantage for teams running pan-EU outreach out of a single English-language sequence.",
    },
    {
      heading: "GDPR Overlay: What Dutch Senders Have to Document",
      content:
        "The Telecommunicatiewet B2B exemption covers the electronic marketing message. GDPR still applies to the underlying data processing. Dutch cold senders need to cover both.\n\n**Lawful basis under GDPR for Dutch B2B email** is typically legitimate interest (Art. 6(1)(f)). The Autoriteit Persoonsgegevens (AP) has accepted legitimate interest for B2B prospection to legal entities as long as the sender:\n- Documents a legitimate interest assessment (LIA) covering purpose, necessity, and balancing\n- Provides clear information at first contact (GDPR Art. 13)\n- Honors the right to object (GDPR Art. 21), which dovetails with the Telecommunicatiewet opt-out requirement\n- Minimizes the personal data processed (name, role, work email is fine; anything beyond that needs justification)\n\n**Documentation checklist:**\n- GDPR Art. 13 privacy notice at the data collection point\n- Privacy notice link in every email\n- LIA document (internal, not shared unless AP asks)\n- Record of Processing Activities (ROPA) entry under Art. 30, Dutch senders with more than 250 employees or high-risk processing must maintain a ROPA\n- Suppression list with indefinite retention\n- Per-contact record showing how the data was obtained and why it was relevant\n\n**AP fines in practice** have ranged from €525,000 for repeated GDPR violations involving commercial data processing down to small-business warnings. AP focuses more on data minimization and transparency than on the sending act itself, which is ACM's domain.",
    },
    {
      heading: "Domain and Mailbox Setup for the Netherlands",
      content:
        "**Domain plan:**\n- 2-3 `.nl` domains for Netherlands-native outreach (Dutch recipients open `.nl` addresses at ~5-8% higher rates)\n- 3-5 `.com`, `.eu`, or `.io` domains for pan-BeNeLux or international outreach\n- Register `.nl` through a [SIDN](https://www.sidn.nl) accredited registrar\n- Meet SIDN's administrative contact requirement\n- Publish a Dutch privacy notice on every redirect target\n- 301 redirect secondary domains to the primary brand\n\n**Mailbox plan:**\n- Google Workspace default\n- Microsoft 365 at 35-40% to reach enterprise and KPN-migrated recipients\n- Consider EU-region Microsoft 365 for Schrems II comfort\n- Per-mailbox volumes: 20/day week 1 → 40/day week 2 → 60/day week 3 → 80+/day after week 4\n- [Isolated warmup](/learn/email-warmup-guide) for 14-28 days\n\n**DNS checklist:**\n- SPF: `v=spf1 include:_spf.google.com ~all`\n- DKIM: two selectors\n- DMARC: `p=none` to start, `p=quarantine` after 30 days\n- MX: matches mailbox provider\n\n**Dutch-specific content rules:**\n- Sender legal entity name and KvK number in the footer (not required by law but signals legitimacy)\n- Physical mailing address\n- Privacy notice link\n- Clear opt-out, 'Afmelden' or 'Uitschrijven' as the link label\n- Optional but recommended: a one-line explanation of how the recipient data was obtained ('We found your details on [source]')\n\n![Infrabox dashboard home for Dutch email senders](/images/dashboard/dashboard-home.png)",
    },
    {
      heading: "Volume, Warmup, and ACM-Visible Risks",
      content:
        "Dutch email has the same Gmail + Microsoft 365 volume math as everywhere else, with two ACM-specific drivers.\n\n**Driver 1: Suppression list integrity.** ACM has fined Dutch senders for continuing to email addresses after an opt-out. This is the most commonly cited violation and the easiest to prevent: mailbox rotation must not lose the suppression list. Infrabox's mailbox-independent suppression approach (maintained by the sequencer, not per-mailbox) avoids this.\n\n**Driver 2: Sender identification.** ACM has also fined senders who hid their identity behind unclear 'From' names or used fake reply-to addresses. The Telecommunicatiewet opt-out clause becomes meaningless if the recipient can't identify the sender, so ACM treats these together.\n\n**Safe warmup cadence for Dutch outbound:**\n- Week 1: 10-20/day per mailbox, warmup only\n- Week 2: 20-40/day per mailbox, 5-10 real cold touches\n- Week 3: 40-60/day per mailbox, 70/30 warmup-to-cold\n- Week 4+: 60-100/day per mailbox, 30/70 warmup-to-cold\n\n**Volume math for 2,000/day Dutch outbound:**\n- ~35 active mailboxes at 60/day each\n- ~10 domains at 3-4 mailboxes each\n- Infrabox Agency ($99/mo, 30 slots) + 5 extras at $3.25 = $115/mo\n- Warmup: 35 × $3 = $105/mo\n- InfraGuard: ~$10/mo for 10 domains\n- **Total: ~$230/month (~€210/month) for 2,000 Dutch emails/day**: about €0.005 per sent message.",
    },
    {
      heading: "Dutch Email Setup Checklist",
      content:
        "**Week 0: provisioning:**\n- [ ] Register 5-10 domains (mix of `.nl`, `.com`, `.eu`)\n- [ ] Publish Dutch privacy notice on every domain redirect target\n- [ ] Provision Google Workspace (65%) + Microsoft 365 (35%)\n- [ ] Automated DNS via Infrabox\n- [ ] Enable isolated warmup and InfraGuard\n\n**Week 1-4: warmup and compliance:**\n- [ ] Verify KvK legal entity status for every target contact's employer\n- [ ] Filter out ZZP, VOF, and CV recipients (they need opt-in consent)\n- [ ] Draft email templates with sender identity, KvK number, opt-out, privacy notice link\n- [ ] Document legitimate interest assessment\n- [ ] Build suppression list workflow\n\n**Week 5+: live outreach:**\n- [ ] Start sequences at 40-60/day per mailbox\n- [ ] First-touch in English or Dutch (both work for Dutch B2B)\n- [ ] Same-day opt-out processing\n- [ ] Weekly deliverability review (Gmail, Microsoft 365, KPN, Ziggo)\n- [ ] Monthly KvK re-verification for new contacts\n\n**Red flags to escalate:**\n- Any ACM or AP correspondence\n- Google Postmaster domain reputation drops to Medium\n- Complaint rate above 0.15%\n- Any opt-out processing delay beyond 24 hours",
    },
  ],
  faqs: [
    {
      question: "Is email legal in the Netherlands?",
      answer:
        "Yes, to legal entities (BV, NV, stichting, vereniging, coöperatie, public sector bodies) without prior consent, under the Telecommunicatiewet article 11.7 B2B exemption. Email to natural persons (private individuals, ZZP sole traders, VOF partners) requires prior express consent. Every message must clearly identify the sender and offer a functional opt-out mechanism.",
    },
    {
      question: "What counts as a legal entity under Dutch law?",
      answer:
        "Legal entities (rechtspersonen) under Dutch civil law include BV (private limited company), NV (public limited company), stichting (foundation), vereniging (association), and coöperatie (cooperative), plus public sector bodies. General partnerships (VOF) and limited partnerships (CV) are not legal entities: each partner is a natural person, so the B2B exemption does not apply. ZZPs are sole traders and count as natural persons unless they've registered a separate legal entity.",
    },
    {
      question: "How do I verify if a recipient works for a legal entity?",
      answer:
        "Use the Kamer van Koophandel (KvK) Handelsregister at kvk.nl. Every registered legal entity in the Netherlands has a KvK number and an entity type. Looking up a company's KvK number confirms whether it is a BV, NV, or something else. Dutch email programs build this verification into their list-building workflow before first send.",
    },
    {
      question: "Do I have to send Dutch email in Dutch?",
      answer:
        "No. Dutch B2B recipients: especially in tech, SaaS, finance, and logistics: open and engage with English-language email at rates comparable to Dutch-language messages. This is unusual among European markets and makes the Netherlands a good testbed for pan-EU English-language outreach. For consumer or public sector outreach, Dutch-language content still outperforms English.",
    },
    {
      question: "How much does Dutch email infrastructure cost?",
      answer:
        "On Infrabox: €35-€90/mo for a solo or small team, €90-€140/mo for a small Dutch B2B sales team, €280-€560/mo for an agency, and €560-€1,400/mo for enterprise BeNeLux outbound. A 2,000/day Dutch email campaign typically costs around €210/month total, or €0.005 per sent message.",
    },
  ],
  sources: [
    {
      title: "Telecommunicatiewet: art. 11.7",
      url: "https://wetten.overheid.nl/BWBR0009950/",
      date: "2026",
    },
    {
      title: "Autoriteit Consument & Markt (ACM)",
      url: "https://www.acm.nl/en",
      date: "2026",
    },
    {
      title: "Autoriteit Persoonsgegevens (AP)",
      url: "https://www.autoriteitpersoonsgegevens.nl/en",
      date: "2026",
    },
    {
      title: "Kamer van Koophandel, Handelsregister",
      url: "https://www.kvk.nl/en/",
      date: "2026",
    },
    {
      title: "Google & Yahoo Bulk Sender Requirements",
      url: "https://support.google.com/a/answer/14229414",
      date: "2024",
    },
  ],
  relatedSlugs: [
    "email-compliance-gdpr-can-spam",
    "email-infrastructure-setup-guide",
    "email-infrastructure-france",
    "email-warmup-guide",
    "google-yahoo-sender-requirements-2026",
  ],
};
