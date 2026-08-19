export const article = {
  slug: "email-infrastructure-france",
  title: "Email Infrastructure for France (2026)",
  metaDescription:
    "France allows B2B email to a named professional address when the pitch matches the role. What CNIL expects, how to stay legal, plus the infrastructure setup.",
  headline: "Email Infrastructure for France",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "email france",
    "lcen france",
    "cnil prospection",
    "french gdpr",
    "b2b email france",
    "prospection professionnelle",
  ],
  excerpt:
    "France is more permissive than Germany but stricter than the UK. CNIL's rules allow B2B email to a professional address when the pitch is relevant to the recipient's role. Here is the exact setup.",
  screenshots: [
    {
      src: "/images/dashboard/quick-setup.png",
      alt: "Infrabox quick setup dashboard for French email senders",
      caption:
        "Infrabox 60-second domain provisioning: matters for French senders maintaining GDPR documentation per domain and per mailbox.",
    },
  ],
  type: "guide",
  sections: [
    {
      heading: "What French Cold Senders Need to Know First",
      content:
        "France sits in the middle of the European email spectrum: more permissive than Germany, stricter than the United Kingdom. Two laws apply simultaneously: the [Loi pour la Confiance dans l'Économie Numérique (LCEN) of 2004](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164/) and the French implementation of GDPR, supervised by the [Commission Nationale de l'Informatique et des Libertés (CNIL)](https://www.cnil.fr/en/home).\n\n**The key rule for French email:** LCEN distinguishes between messages to natural persons in a private capacity (requires prior consent) and messages to professionals at their work address (allowed under specific conditions). CNIL has published clear guidance, the [prospection commerciale B2B page](https://www.cnil.fr/en/direct-marketing-business-to-business): confirming that email to a professional is legal when:\n\n1. The recipient is a professional contacted in their professional role.\n2. The message relates to a product or service connected to the recipient's profession or business.\n3. The recipient is informed, at the time of data collection and in every subsequent message, of their right to object to processing.\n4. The recipient can object via a simple, free mechanism (typically an unsubscribe link).\n\nThis is close to the UK's PECR corporate subscriber exemption, with the addition of the relevance-to-role test from GDPR legitimate interest.\n\n**What is not legal in France:**\n- Email to generic addresses (`contact@`, `info@`, `sales@`) as a practical matter, CNIL treats these as non-targeted and outside the professional exemption\n- Email to personal addresses (`@gmail.com`, `@orange.fr` for private use)\n- Email to French individuals acting in a private capacity regardless of the pitch\n- Messages that fail to identify the sender clearly\n- Messages that do not offer an immediate opt-out\n\n| Setup | Daily volume | Mailboxes | Domains | Infrabox cost |\n|-------|-------------|-----------|---------|---------------|\n| Solo French consultant | 100-200 | 5-10 | 2-3 | $39/mo |\n| Small French B2B team | 500-1,500 | 25-50 | 8-15 | $99-$149/mo |\n| French agency | 2,000-5,000 | 75-150 | 25-50 | $299-$599/mo |\n| Enterprise EU outbound | 5,000-15,000 | 150-400 | 50-120 | $600-$1,500/mo |\n\n*Infrabox pricing in USD. A 2,000/day French email operation typically lands around €250-€320/month total cost.*",
    },
    {
      heading: "LCEN + GDPR: The French Email Framework",
      content:
        "LCEN Article 22 sets the baseline: commercial prospection by email requires either prior express consent from the recipient, or the recipient's professional status combined with relevance of the pitch. GDPR adds the lawful basis requirement (legitimate interest works for B2B prospection in France, unlike Germany), transparency obligations, and the Art. 21 right to object.\n\n**CNIL's four pillars of compliant B2B prospection:**\n\n1. **Information at first contact.** The recipient must be told, at the very first message, who the sender is, what data is being processed, and how they can exercise their Art. 15-22 GDPR rights. CNIL accepts a short privacy notice in the message body or a link to a full privacy page on the sender's website.\n\n2. **Easy right to object.** One-click unsubscribe minimum. CNIL has repeatedly enforced the 'free and simple' requirement: unsubscribe workflows that require login, account creation, or multi-step confirmation have been fined.\n\n3. **Legitimate interest balancing test documented.** For each email program, the sender should document: (a) the commercial purpose, (b) why email is the least intrusive means, (c) the balancing analysis weighing sender interest against recipient expectations. CNIL does not require this document to be shared unless asked, but in inspections, inability to produce it is treated as non-compliance.\n\n4. **Suppression list with indefinite retention.** Opt-outs must be honored permanently. A sender who re-emails an unsubscribed address has committed a documented LCEN + GDPR violation visible in their own records.\n\n**CNIL enforcement in 2026** is led by its [répressive actions](https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil) division. Published sanctions in the past two years include fines from €3,000 to €600,000 for unsolicited commercial email violations, with pattern fines concentrated on senders who ignored opt-outs, failed to provide privacy notices, or used data obtained from illegal scraping.\n\nThe maximum GDPR fine is 4% of global annual turnover or €20 million, whichever is higher. CNIL has not applied the maximum to an email violation but has issued multi-hundred-thousand-euro fines to mid-size French companies that ignored its guidance.",
    },
    {
      heading: "French Inbox Providers and Deliverability Context",
      content:
        "France's inbox mix is distinct from both the UK and Germany. Gmail dominates B2B as elsewhere, but Orange (formerly France Télécom / Wanadoo), Free, and SFR still account for a meaningful share of business email, especially in SMB and regional markets.\n\n| Provider | Share of French B2B recipients | Notes |\n|----------|-------------------------------|-------|\n| Gmail / Google Workspace | 40-50% | [2024 bulk sender rules](/learn/google-yahoo-sender-requirements-2026) |\n| Microsoft 365 / Outlook.com | 25-35% | Large French enterprise install base |\n| Orange (orange.fr / wanadoo.fr) | 5-10% | Legacy operator mailboxes, strict filtering via [abuse@orange.fr](mailto:abuse@orange.fr) |\n| Free (free.fr) | 3-6% | Runs on custom infrastructure, occasionally aggressive on authentication |\n| SFR (sfr.fr) | 2-4% | Another French ISP holdover |\n| Laposte.net | 1-3% | French postal service email |\n| Apple iCloud Mail | 3-5% | Mandatory SPF + DKIM |\n\n**Orange is the main French-specific delivery problem.** Orange Mail has historically had one of the most aggressive filter engines in Europe and maintains a distinct postmaster contact ([abuse@orange.fr](mailto:abuse@orange.fr)) that senders must use to escalate reputation issues. A single high-complaint campaign can cause Orange to rate-limit a sender for weeks, and the escalation path requires email correspondence in French with evidence of consent.\n\n**Data residency considerations.** French law does not require recipient data to stay in France or the EU for email purposes. GDPR does require disclosure of cross-border transfers and adequacy of the destination, which for US-based mailbox providers means relying on [EU-US Data Privacy Framework](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_en) certification. Google Workspace and Microsoft 365 both offer EU-region tenants for customers who want to minimize cross-border transfer complexity. Infrabox's Microsoft 365 provisioning supports EU regions natively.",
    },
    {
      heading: "Domain and Mailbox Setup for France",
      content:
        "**Domain plan for French outreach:**\n- 2-3 `.fr` domains for France-native outreach (French recipients open `.fr` addresses at meaningfully higher rates)\n- 3-5 `.com`, `.eu`, or `.io` domains for pan-European outreach\n- Register `.fr` domains through an [AFNIC](https://www.afnic.fr) accredited registrar\n- Meet AFNIC's EU presence requirement (EU-based registrant or authorized agent)\n- Publish a [mentions légales](https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques/Mentions-legales-sites-internet) page on every domain's redirect target, French law requires this disclosure on any commercial website\n- 301 redirect secondary domains to the primary brand\n\n**Mailbox plan:**\n- Google Workspace default\n- Microsoft 365 at 30-40% to reach enterprise recipients\n- Consider EU-region Microsoft 365 tenants for Schrems II comfort\n- Per-mailbox volumes ramp: 20/day week 1 → 40/day week 2 → 60/day week 3 → 80+/day after week 4\n- [Isolated warmup](/learn/email-warmup-guide) for 14-28 days\n\n**DNS checklist per domain:**\n- SPF: `v=spf1 include:_spf.google.com ~all`\n- DKIM: two selectors published\n- DMARC: `p=none` to start, `p=quarantine` after 30 days\n- MX: matches mailbox provider\n\n**French-specific content rules:**\n- Mentions légales link in every commercial email\n- French-language subject line and body for French recipients (English-only email to France underperforms 2-3x on open and reply rates)\n- Unsubscribe link labeled 'Se désabonner' or 'Retirer mon consentement'\n- Privacy notice link in the message footer, not only on the landing page\n- [SIREN / SIRET number](https://www.sirene.fr) disclosure if the sender is a French entity\n\n![Infrabox quick setup dashboard for French email senders](/images/dashboard/quick-setup.png)",
    },
    {
      heading: "Volume, Warmup, and CNIL-Visible Risks",
      content:
        "French email is a Gmail + Microsoft 365 + Orange delivery problem. Volume math works the same as elsewhere, with French-specific risk drivers.\n\n**Risk 1: Complaint rate.** CNIL opens investigations based on recipient complaints forwarded through the [signal-spam.fr](https://www.signal-spam.fr) platform and direct complaints to CNIL's online form. A sustained pattern of complaints against a single domain triggers an investigation. Keep complaint rate under 0.1% as a target; the enforcement ceiling is somewhere in the 0.3-0.5% range based on published sanctions.\n\n**Risk 2: Unsubscribe processing delay.** CNIL has fined senders for opt-out processing delays. The expectation is that the next message after an unsubscribe should already be suppressed: not 'within 10 business days' as with CAN-SPAM. Same-day suppression is the operating standard.\n\n**Risk 3: Privacy notice visibility.** Every email must carry a privacy notice link. CNIL has specifically fined senders who buried the notice or linked to a generic corporate privacy page without specifying how recipient data was obtained.\n\n**Safe warmup cadence for France:**\n- Week 1: 10-20/day per mailbox, warmup only\n- Week 2: 20-40/day per mailbox, 5-10 real cold touches\n- Week 3: 40-60/day per mailbox, 70/30 warmup-to-cold\n- Week 4+: 60-100/day per mailbox, 30/70 warmup-to-cold\n\n**Volume math for 2,000/day French outbound:**\n- ~35 active mailboxes at 60/day each\n- ~10 domains at 3-4 mailboxes each\n- Infrabox Agency ($99/mo, 30 slots) + 5 extras at $3.25 = $115/mo\n- Warmup: 35 × $3 = $105/mo\n- InfraGuard: ~$10/mo for 10 domains\n- **Total: ~$230/month (~€210/month) for 2,000 French emails/day**: about €0.005 per sent message.",
    },
    {
      heading: "Records CNIL Expects From French Senders",
      content:
        "CNIL inspections, when they happen, test whether the sender can document compliance. A well-run French email program retains:\n\n**Per-contact records:**\n- Email address\n- Source (URL, professional directory, LinkedIn Sales Navigator export, manual capture)\n- Capture date\n- Role and employer of the recipient\n- Relevance of pitch to role (one-liner)\n- Send history\n- Unsubscribe date if applicable\n\n**Per-campaign records:**\n- Sender legal entity (SIREN if French)\n- Mentions légales link used\n- Privacy notice version and URL\n- Sending domain(s)\n- Message content template\n- Legitimate interest assessment document\n\n**Per-year records:**\n- GDPR compliance policy\n- Data Protection Officer (DPO) contact: required for some French senders under GDPR Art. 37\n- Record of Processing Activities (ROPA) under GDPR Art. 30\n- Training log for staff with access to the email program\n- Suppression list audit\n\n**Records should be retained for at least 3 years**: the statute of limitations for CNIL to open a proceeding based on a complaint. Some records (consent logs, opt-out logs) should be retained for as long as the sender is still processing the relevant data.",
    },
    {
      heading: "French Email Setup Checklist",
      content:
        "**Week 0: provisioning:**\n- [ ] Register 5-10 domains (mix of `.fr`, `.com`, `.eu`)\n- [ ] Publish mentions légales on every domain redirect target\n- [ ] Provision Google Workspace mailboxes (60%) + Microsoft 365 mailboxes (40%)\n- [ ] Consider EU-region Microsoft 365 tenants\n- [ ] Automated DNS via Infrabox\n- [ ] Enable isolated warmup and InfraGuard on every mailbox and domain\n\n**Week 1-4: warmup and compliance:**\n- [ ] Document legitimate interest assessment and ROPA entry\n- [ ] Build list from professional directories and role-relevant sources only\n- [ ] Draft French-language email templates with privacy notice link\n- [ ] Test unsubscribe flow: confirm same-day processing\n- [ ] Establish Orange postmaster contact pathway\n\n**Week 5+: live outreach:**\n- [ ] Start sequences at 40-60/day per mailbox\n- [ ] First-touch plain text, relevant pitch in French, clear sender identity, free opt-out\n- [ ] Daily opt-out processing into suppression list\n- [ ] Weekly deliverability review (Gmail, Microsoft 365, Orange, Free)\n- [ ] Quarterly suppression list audit and ROPA update\n\n**Red flags to escalate:**\n- Any CNIL correspondence or signal-spam.fr forwarded complaint\n- Google Postmaster domain reputation drops to Medium\n- Orange rate-limiting on any sending IP\n- Complaint rate above 0.15%",
    },
  ],
  faqs: [
    {
      question: "Is email legal in France?",
      answer:
        "Yes, to a professional at their work email address when the message relates to their profession or role. LCEN Article 22 and CNIL guidance allow B2B prospection without prior consent if the recipient is informed of their rights at first contact and offered a free, simple opt-out. Email to personal addresses or to individuals acting in a private capacity requires prior consent.",
    },
    {
      question: "What does CNIL expect from B2B email senders?",
      answer:
        "CNIL expects four things: (1) clear identification of the sender and purpose at first contact, (2) a privacy notice link in every message, (3) a one-click unsubscribe that is honored immediately, and (4) a documented legitimate interest assessment plus a GDPR Art. 30 record of processing activities. Senders who fail any of these have been fined in published sanctions from €3,000 to €600,000.",
    },
    {
      question: "Can I email generic addresses like contact@company.fr?",
      answer:
        "CNIL treats generic addresses (contact@, info@, sales@, admin@) as non-targeted, which puts them outside the B2B professional exemption under LCEN. Email to generic addresses in France is high-risk and should be avoided. Target named individuals with role-relevant pitches instead.",
    },
    {
      question: "Do I need to send in French?",
      answer:
        "Legally, no, LCEN does not mandate French-language content. In practice, English-language email to French recipients underperforms by 2-3x on open and reply rates, and CNIL has indicated that failure to provide privacy notices in French can be treated as inadequate information under GDPR Art. 13. Send in French for French audiences.",
    },
    {
      question: "How much does French email infrastructure cost?",
      answer:
        "On Infrabox: €35-€95/mo for solo or small teams, €90-€140/mo for a small French B2B sales team, €280-€560/mo for an agency, and €560-€1,400/mo for enterprise-scale outbound. A 2,000/day French campaign costs roughly €210/month total, or €0.005 per sent message.",
    },
  ],
  sources: [
    {
      title: "CNIL, Direct marketing business to business",
      url: "https://www.cnil.fr/en/direct-marketing-business-to-business",
      date: "2026",
    },
    {
      title: "Loi pour la Confiance dans l'Économie Numérique (LCEN)",
      url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164/",
      date: "2004",
    },
    {
      title: "CNIL, Published sanctions",
      url: "https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil",
      date: "2026",
    },
    {
      title: "Signal Spam, French spam reporting platform",
      url: "https://www.signal-spam.fr",
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
    "email-infrastructure-germany",
    "email-warmup-guide",
    "google-yahoo-sender-requirements-2026",
  ],
};
