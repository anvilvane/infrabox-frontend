export const article = {
  slug: "email-infrastructure-germany",
  title: "Email Infrastructure for Germany (2026)",
  metaDescription:
    "Germany is Europe's hardest email market. UWG §7 bars it without explicit consent. Here's what's legal, what gets sued, and the infrastructure setup.",
  headline: "Email Infrastructure for Germany",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "11 min read",
  tags: [
    "email germany",
    "uwg §7",
    "german email law",
    "gdpr germany",
    "abmahnung email",
    "b2b email germany",
  ],
  excerpt:
    "Unsolicited commercial email to German recipients is prohibited under UWG §7. There is no B2B exemption the way there is in the UK. Here is the honest guide to what is legal and how to structure infrastructure around it.",
  screenshots: [
    {
      src: "/images/dashboard/email-insights.png",
      alt: "Infrabox email insights dashboard for deliverability monitoring to German recipients",
      caption:
        "Detailed delivery metrics per mailbox: essential for German senders who need to prove they are not operating outside narrow UWG-compliant scenarios.",
    },
  ],
  type: "guide",
  sections: [
    {
      heading: "The Honest Truth About Email to Germany",
      content:
        "Germany is the hardest market in the EU for email, and it is not close. The [Gesetz gegen den unlauteren Wettbewerb (UWG) §7 Abs. 2 Nr. 2](https://www.gesetze-im-internet.de/uwg_2004/__7.html), the Act Against Unfair Competition: prohibits electronic marketing messages to consumers *or* businesses without prior explicit consent. Unlike the UK's PECR, there is no corporate subscriber exemption. Unlike Australia's Spam Act, there is no inferred consent path. An email to a German `@gmbh.de` address is a UWG violation in almost every case.\n\nEnforcement happens in two ways that make Germany unusual. First, German competitors, trade associations, and consumer groups can issue an [Abmahnung](https://www.bundesjustizamt.de): a formal cease-and-desist letter backed by the threat of a civil injunction. The Abmahnung industry in Germany is large, well-organized, and routinely targets email senders. A single Abmahnung can carry €500-€5,000 in legal fees plus a cease-and-desist pledge with contractual penalties on repeat.\n\nSecond, recipients themselves can sue for an injunction under UWG §8. Courts have consistently awarded injunctions for unsolicited commercial email going back to a [2004 Federal Supreme Court (BGH) decision](https://juris.bundesgerichtshof.de) that treated a single unsolicited B2B marketing email as an unlawful interference with the recipient's business operations.\n\n**What is legal in Germany:**\n1. Express opt-in (double opt-in is the de facto standard)\n2. Existing customer exception (§7 Abs. 3 UWG), you sold someone a product, they gave you their email during the transaction, you can send them similar-products marketing with clear opt-out\n3. Pre-existing business relationships where the recipient has an expectation of contact\n\n**What is not legal in Germany:**\n- Email to a public `info@` address\n- Email to a named `@company.de` address scraped from a website, LinkedIn, or any other source\n- 'Cold' B2B sales outreach even if highly relevant\n- Adding a recipient to a list based on a business card exchanged at a trade show (courts have split on this but the conservative read is 'no')\n\nThe honest guidance: **German email programs should not exist in the traditional sense.** Teams that want to reach German buyers should use account-based marketing with manual 1:1 outreach from real people (not bulk tools), LinkedIn messaging via LinkedIn's own systems, or paid advertising. The infrastructure piece of this article exists for senders who are running *properly-consented* German sequences or who are sending to German recipients as part of a mostly non-German outreach and need to handle German addresses correctly.\n\n| Setup | Use case | Mailboxes | Infrabox cost |\n|-------|---------|-----------|---------------|\n| Consented German newsletter | Opt-in list built via web forms | 5-10 | $39/mo |\n| Customer re-engagement (UWG §7 Abs. 3) | Existing customer base | 10-30 | $99/mo |\n| German segment within pan-EU list | Mostly non-German, small German share | 25-75 | $99-$149/mo |\n| Full German cold outbound | **Do not do this** | n/a | n/a |\n\n*A fully cold German outbound program is not legally viable. Budget for account-based outreach through other channels.*",
    },
    {
      heading: "UWG §7: Why Germany Has No B2B Email Exemption",
      content:
        "The text of UWG §7 Abs. 2 Nr. 2 states (translated): 'An unreasonable nuisance is always to be assumed in the case of advertising through electronic mail without the recipient's prior express consent.' There is no carve-out for B2B. There is no 'conspicuously published' exemption. There is no 'corporate subscriber' distinction.\n\nThe reason is historical. German consumer protection and business law have always treated unsolicited advertising as an unfair competitive practice, and the UWG was updated in 2004 to implement the EU's ePrivacy Directive with *stricter* rules than the directive required. Most EU countries chose to exempt business-to-business messaging. Germany did not. The federal courts have reinforced this position consistently, [BGH judgment I ZR 164/02](https://juris.bundesgerichtshof.de) held that even a single unsolicited B2B email is an unlawful nuisance, and later decisions have not softened that.\n\n**The existing-customer exception (UWG §7 Abs. 3)** is the narrow path that legal German email marketing operates through. Its four cumulative conditions:\n1. The sender obtained the email address from the recipient in the context of selling goods or services.\n2. The sender uses the address for direct advertising of its own similar goods or services.\n3. The recipient has not objected to the use.\n4. The recipient is clearly informed at the time of collection, and in every subsequent message, of their right to object free of charge.\n\nThis works for re-engaging existing customers. It does not work for prospecting.\n\n**Double opt-in is the de facto safety standard** for consented marketing in Germany. A single opt-in: box ticked on a form: is technically legal under UWG but has been challenged in courts where the sender could not prove the opt-in was informed. Double opt-in (confirmation email, click to verify) creates a paper trail that survives Abmahnungen.\n\n**Documentation requirements.** German marketers retain the IP address, timestamp, and form-source of every opt-in for at least 3 years, the statute of limitations for UWG injunction claims. Without this documentation, a sender cannot prove consent existed at the time of sending, and courts will assume it did not.",
    },
    {
      heading: "The German Inbox Mix",
      content:
        "Germany has a fundamentally different consumer inbox mix from every other Western market. Web.de and GMX: both owned by United Internet / 1&1 Mail & Media: together account for the largest share of personal email in Germany. T-Online (Deutsche Telekom) is still meaningful. Gmail and Outlook.com are large but not dominant.\n\n| Provider | Share of German B2C | Share of German B2B |\n|----------|--------------------|--------------------|\n| Web.de / GMX (1&1) | 25-35% | 5-10% |\n| Gmail / Google Workspace | 25-35% | 35-45% |\n| Microsoft 365 / Outlook.com | 15-25% | 30-40% |\n| T-Online (Deutsche Telekom) | 8-15% | 3-6% |\n| 1&1 IONOS hosted mail | 2-5% | 15-25% (SMB) |\n| Strato hosted mail | 2-4% | 8-12% (SMB) |\n| Others (Posteo, Mailbox.org) | 1-3% | 2-4% |\n\nTwo practical implications for consented German email programs.\n\n**Web.de and GMX have their own filtering rules.** Both are part of United Internet's [Mail-Abuse-Report](https://postmaster.1and1.com/) postmaster platform. They enforce strict authentication (SPF + DKIM + DMARC with alignment) and they are more aggressive than Gmail on content-based filtering. A newsletter that delivers cleanly to Gmail may sit in Web.de junk for weeks. Senders reaching Web.de/GMX audiences should monitor the 1&1 postmaster tools weekly and be prepared for higher bounce rates on list imports.\n\n**The German SMB long tail is large.** 1&1 IONOS, Strato, and smaller German webhosts still serve a significant share of German business email, especially for companies under 50 employees. These mailboxes run on varied backends with inconsistent filtering. Sending from US IPs to these recipients compounds latency and reputation issues. Microsoft 365-style throttling shows up on IONOS-hosted mailboxes too.",
    },
    {
      heading: "GDPR on Top of UWG: What German Consent Actually Looks Like",
      content:
        "Consented German email marketing operates at the intersection of two laws:\n\n**UWG §7** requires prior express consent for the electronic marketing message itself. This is about the act of sending a commercial message.\n\n**GDPR Art. 6 and Art. 7** require a lawful basis for processing the recipient's personal data. For marketing, the practical options are consent (Art. 6(1)(a)) or legitimate interest (Art. 6(1)(f)). German regulators: notably the [Bayerisches Landesamt für Datenschutzaufsicht](https://www.lda.bayern.de): have consistently said that legitimate interest is not a valid basis for cold marketing email, because UWG §7 already requires explicit consent. So in practice, German senders must rely on GDPR consent for the data processing piece too.\n\n**A compliant German consent flow looks like this:**\n1. Clear, informed opt-in form: not pre-ticked, not bundled with unrelated terms\n2. Confirmation email with a link the recipient must click (double opt-in)\n3. Explicit wording that names the sender and describes what kinds of messages the recipient will receive\n4. Statement of GDPR Art. 7(3) right to withdraw consent at any time\n5. Privacy notice (GDPR Art. 13) available at the opt-in point\n6. Storage of IP address, timestamp, form version, and confirmation click for at least 3 years\n\n**Unsubscribe mechanics:**\n- One-click unsubscribe in the message (also required by Gmail/Yahoo bulk sender rules)\n- Unsubscribe honored immediately (not 'within 10 days', German courts expect same-day processing)\n- Suppression list keyed by email with indefinite retention\n- Confirmation email after unsubscribe is optional but reduces dispute risk\n\n**Double-opt-in confirmation email caveat.** German courts have sometimes treated the confirmation email itself as a UWG §7 violation if the initial opt-in was too generic (e.g. 'Sign up for our newsletter' without describing content), the argument being that the confirmation message is unsolicited marketing. This is a minority position but real enough that conservative senders phrase their opt-in forms explicitly and keep the confirmation email content-free (just a click-to-verify link).",
    },
    {
      heading: "Infrastructure for Consented German Email",
      content:
        "For a sender running a legitimate opt-in German email program, the infrastructure story is mostly standard, but every choice is under higher scrutiny.\n\n**Domain plan:**\n- 1-3 `.de` domains for the sending zones (German recipients trust `.de` addresses)\n- Register `.de` through a [DENIC](https://www.denic.de) accredited registrar\n- Meet DENIC's admin-C requirement (a German administrative contact)\n- Publish a complete [Impressum](https://www.bundesjustizamt.de) on every sending domain's landing page, this is legally required for any German commercial web presence\n- 301 redirect secondary domains to the primary brand\n\n**Mailbox plan:**\n- Google Workspace or Microsoft 365: both work fine with German recipients\n- Consider Microsoft 365 EU data region if the sender is subject to Schrems II concerns\n- Per-mailbox volumes stay conservative for German traffic, 40-60/day maximum even after warmup, because German recipients are more likely to mark content as spam if it looks automated\n- [Isolated warmup](/learn/email-warmup-guide) before any real traffic\n\n**DNS checklist:**\n- SPF with strict alignment\n- DKIM with two selectors\n- DMARC at `p=quarantine` after 30 days (German recipients are more DMARC-aware)\n- MX matches mailbox provider\n- Consider BIMI for Gmail and Yahoo brand indicator\n\n**German-specific content rules:**\n- Impressum link required in every commercial message (GmbH, address, authorized representative, commercial register number, USt-ID)\n- German-language subject lines for German recipients (English-language email to German recipients triggers higher spam complaint rates even when otherwise compliant)\n- Unsubscribe link labeled 'Abbestellen' or 'Newsletter abmelden'\n- GDPR Art. 13 notice at the opt-in point\n\n![Infrabox email insights dashboard for deliverability monitoring to German recipients](/images/dashboard/email-insights.png)",
    },
    {
      heading: "The Abmahnung Risk Calculator",
      content:
        "German email senders who push their luck get Abmahnungen. The practical risk model has three drivers.\n\n**Driver 1: Volume.** A sender who emails 100 German addresses in a month might get 0 Abmahnungen. A sender who emails 10,000 in a month will likely get 1-3 over a quarter. Abmahnung frequency scales linearly with volume.\n\n**Driver 2: Recipient sophistication.** Lawyers, tax advisors, consultants, and agencies are much more likely to issue Abmahnungen than manufacturing or retail SMBs. Targeting German legal or professional services with email is a guaranteed Abmahnung pipeline.\n\n**Driver 3: Ignoring the first complaint.** A recipient who receives one cold message and replies with 'unsubscribe' or 'kein Interesse' and then receives a second message will almost always escalate. A recipient whose first message was ignored won't escalate unless they're part of an Abmahnung mill.\n\n**Cost of an Abmahnung:**\n- Initial letter: €500-€2,500 in legal fees paid by the sender\n- Cease-and-desist pledge: contractual penalty per violation, typically €2,500-€10,000\n- If ignored: injunction proceedings, further legal costs, public court record\n- Repeat offenders: criminal proceedings possible under StGB §263a if the sender actively deceived recipients\n\n**Cost of prevention:**\n- Not emailing German recipients. €0.\n\nThe math almost always favors prevention. Email to Germany is a bad business decision even before it becomes a legal one.",
    },
    {
      heading: "Practical Setup for Consented German Email",
      content:
        "If you are running a legitimate opt-in German email program (newsletter, product announcement to existing customers, post-purchase sequences), here is the setup:\n\n**Week 0:**\n- [ ] Register 1-3 `.de` domains through a DENIC registrar\n- [ ] Publish Impressum on every domain's landing page\n- [ ] Provision 5-15 Google Workspace or Microsoft 365 mailboxes\n- [ ] Automated SPF/DKIM/DMARC via Infrabox\n- [ ] Enable [InfraGuard monitoring](/learn/email-deliverability-monitoring-setup)\n- [ ] Build double-opt-in form on landing pages\n\n**Week 1-4:**\n- [ ] Isolated warmup on every mailbox\n- [ ] Confirm 1&1 / Web.de / GMX postmaster monitoring is live\n- [ ] Draft German-language content templates with Impressum block\n- [ ] Legal review of opt-in flow\n\n**Week 5+:**\n- [ ] Start newsletter / re-engagement sequences\n- [ ] First-day opt-out processing (suppression list auto-sync)\n- [ ] Weekly deliverability review (Gmail, Microsoft 365, Web.de, GMX, T-Online)\n- [ ] Quarterly compliance audit: retention of opt-in records\n\n**Red flags:**\n- Any Abmahnung: respond via legal counsel, stop sending to that address and to the source list\n- Spam complaint rate above 0.2%: throttle immediately\n- Web.de / GMX reputation degradation",
    },
  ],
  faqs: [
    {
      question: "Is email legal in Germany?",
      answer:
        "No, in almost every case. UWG §7 Abs. 2 Nr. 2 prohibits unsolicited commercial electronic messages without prior explicit consent, and Germany applies this rule to business-to-business email with no exemption. The only legal paths are express opt-in (double opt-in is the de facto standard) and the narrow UWG §7 Abs. 3 existing-customer exception for similar-products marketing to people who bought from you before.",
    },
    {
      question: "What is an Abmahnung and how much does it cost?",
      answer:
        "An Abmahnung is a formal cease-and-desist letter under German law, typically issued by a competitor, trade association, or recipient. It includes legal fees (€500-€2,500) and a cease-and-desist pledge with contractual penalties of €2,500-€10,000 per future violation. Ignoring an Abmahnung triggers injunction proceedings that add court costs and public record exposure.",
    },
    {
      question: "Why is GDPR not enough for German email?",
      answer:
        "GDPR governs personal data processing; UWG §7 governs the act of sending a commercial message. Both apply to email to German recipients, and UWG is stricter. Even if a GDPR legitimate interest analysis would work in another EU country, German courts have consistently held that UWG §7 requires explicit consent for the electronic marketing message itself: regardless of whether the underlying data processing has a GDPR basis.",
    },
    {
      question: "Can I email German B2B addresses if the pitch is relevant?",
      answer:
        "No. UWG §7 has no B2B exemption, unlike the UK's PECR regulation 22(4) or Australia's Spam Act inferred consent. Even a single, highly-relevant, personalized email to a named German executive is a UWG violation in case law going back to BGH I ZR 164/02 (2004). Account-based outreach to Germany should happen through LinkedIn, paid advertising, or warm intros: not email.",
    },
    {
      question: "What is the right infrastructure for consented German email?",
      answer:
        "On Infrabox, a consented German newsletter or existing-customer re-engagement program typically runs on 5-15 Google Workspace or Microsoft 365 mailboxes across 1-3 `.de` domains, with automated SPF/DKIM/DMARC, isolated warmup, and InfraGuard monitoring. Monthly cost lands between €40-€150 depending on volume, plus $3/mailbox for warmup.",
    },
  ],
  sources: [
    {
      title: "UWG §7, Gesetz gegen den unlauteren Wettbewerb",
      url: "https://www.gesetze-im-internet.de/uwg_2004/__7.html",
      date: "2026",
    },
    {
      title: "Bayerisches Landesamt für Datenschutzaufsicht",
      url: "https://www.lda.bayern.de",
      date: "2026",
    },
    {
      title: "1&1 Mail & Media Postmaster (Web.de / GMX)",
      url: "https://postmaster.1and1.com/",
      date: "2026",
    },
    {
      title: "DENIC, .de Domain Registry",
      url: "https://www.denic.de",
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
    "email-deliverability-monitoring-setup",
    "email-warmup-guide",
    "email-authentication-spf-dkim-dmarc-explained",
  ],
};
