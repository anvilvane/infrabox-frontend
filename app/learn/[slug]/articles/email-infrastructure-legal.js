export const article = {
  slug: "email-infrastructure-legal",
  title:
    "Email Infrastructure for Law Firms",
  metaDescription:
    "How law firms run business development email without violating ABA Rule 7.3. Domain strategy, bar-compliant cadences, and GC-targeted outreach playbook.",
  headline:
    "Email Infrastructure for Law Firms",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Solutions",
  readingTime: "9 min read",
  tags: [
    "email law firms",
    "legal bd",
    "attorney advertising",
    "gc outreach",
    "aba rule 7.3",
  ],
  excerpt:
    "Law firm BD outreach is governed by bar solicitation rules that most email tools ignore. Here is the infrastructure setup that keeps partners compliant and inbox-delivering to general counsel.",
  screenshots: [
    {
      src: "/images/dashboard/domains.png",
      alt: "Infrabox domain authentication for law firm BD outreach",
      caption: "Infrabox domain view showing authenticated SPF, DKIM, and DMARC for a law firm's dedicated BD outreach domains",
    },
  ],
  type: "solution-page",
  sections: [
    {
      heading: "What Makes Law Firm Email Different",
      content:
        "Every US state adopts some version of [ABA Model Rule 7.3](https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_3_solicitation_of_clients/), which governs solicitation of clients. Most states allow targeted written solicitation (including email) to sophisticated recipients like general counsel and business decision-makers, as long as the message is clearly labeled as advertising, does not involve coercion or duress, and is not sent to someone who has made known a desire not to be solicited. Some states, notably Florida and Texas, add specific labeling requirements like a bold \"ADVERTISING MATERIAL\" header. California's Rule 1-400 requires the attorney to retain a copy of every solicitation email for two years.\n\nThe technical implication: law firm email must be archived, labeled, and targeted at non-individual-consumer recipients. That is not what generic email infrastructure is built for.\n\nHere is how Infrabox supports compliant BD outreach for a typical law firm:\n\n| Firm Size | Mailboxes | Domains | Monthly Cost | Target Pipeline |\n|-----------|-----------|---------|--------------|-----------------|\n| Solo partner | 3-5 | 2 | $39 | $50K-$250K |\n| Boutique (5-15 attorneys) | 10-20 | 4-8 | $39-$89 | $250K-$1M |\n| Mid-size firm (15-50 attorneys) | 25-50 | 10-20 | $99-$189 | $1M-$5M |\n| AmLaw 200 / regional | 60-120 | 25-50 | $250-$500 | $5M-$20M |\n\n*Pricing reflects Infrabox's Professional ($39/mo for 10 mailboxes), Agency ($99/mo for 30), and Enterprise ($299/mo for 100) tiers. Warmup add-on at $3/mailbox/month. InfraGuard monitoring is strongly recommended for law firms given the reputational cost of a deliverability failure.*\n\nLaw firm email is low-volume and high-stakes. A single retained engagement from a Fortune 1000 GC can be worth $500K-$5M in billable hours.",
    },
    {
      heading: "Domain Strategy for Bar-Compliant BD",
      content:
        "**Never use the main firm domain for cold outreach.** `smithlaw.com` is the domain where retention letters, billing, and active-matter communications land. A bar complaint, blacklist hit, or aggressive spam filter would cripple client service overnight.\n\n**Use clearly affiliated BD domains:**\n- `smithlaw-advisory.com`\n- `smithlaw-insights.com`\n- `smith-bd.com`\n\nEach domain should be transparently tied to the firm in the message body and WHOIS record. Hiding affiliation can violate state-specific attorney advertising rules that require the sending firm's identity to be unambiguous.\n\n**Register through Infrabox** for automatic DNS. Missing or incorrect DMARC is a near-guaranteed rejection at most Fortune 500 M365 tenants, which is where general counsel typically receive mail.\n\n**Use .com only.** General counsel are the most conservative audience in B2B. A `.io` or `.co` domain is a near-automatic ignore for a BD pitch to a Fortune 1000 legal department.",
    },
    {
      heading: "Targeting Rules and Audience Guardrails",
      content:
        "Bar rules draw a sharp line between solicitation of a \"lawyer, family member, close personal friend, or a person with whom the lawyer has a prior professional relationship\" (always allowed) and solicitation of an individual consumer (often restricted). For BD outreach, the compliant audience is:\n\n- **General counsel and deputy GCs** at corporations\n- **Chief legal officers** at private companies and nonprofits\n- **In-house legal operations leaders**\n- **C-suite decision-makers with retained-counsel authority** (CFOs, COOs)\n- **Legal department procurement contacts**\n\nThe non-compliant audience in most states:\n\n- **Individual consumers** for personal legal matters (family law, personal injury, estate planning). These require much stricter solicitation rules in nearly every state.\n- **Anyone known to be represented by other counsel on the specific matter** being pitched.\n- **Anyone who has previously opted out** of solicitation from the firm.\n\nInfrabox does not build lists, but its sequencer integrations pass suppression state back to the CRM so a single opt-out applies across every partner's mailbox in the firm.",
    },
    {
      heading: "Labeling, Archiving, and Recordkeeping",
      content:
        "Several states require specific labeling on attorney advertising:\n\n- **Florida**: requires \"This is an advertisement\" or equivalent disclosure in written solicitations.\n- **Texas**: requires \"ADVERTISEMENT\" in the subject line or first sentence of the email.\n- **New York**: requires \"Attorney Advertising\" on the first page.\n- **California**: requires retention of copies of the communication for two years.\n- **Most other states**: follow ABA Rule 7.3 with minor variations.\n\nInfrastructure implication: every BD email needs a standard labeled footer, and every sent message must be archivable for 2-7 years depending on state. Infrabox's sequencer integrations automatically inject a firm-specified footer across every outbound message and the firm's CRM (Interaction, Foundation, HubSpot, or similar) handles the archival requirement.\n\nFor firms running BD across multiple states, the safe default is to include the strictest labeling in every message: bold \"Attorney Advertising\" in the subject and a standardized footer with the firm name, address, attorney responsible for content, and jurisdiction of admission.",
    },
    {
      heading: "Sending Pattern for Partners and BD Teams",
      content:
        "Law firm email is low-volume and extremely targeted. The pattern that actually works:\n\n- **Volume per mailbox:** 10-25 sends per working day. More than that triggers conservative Fortune 500 spam filters and violates the high-touch nature of BD outreach.\n- **Cadence:** 3-4 touches maximum, spaced 4-7 days apart. Pushy sequences are explicitly disallowed under Rule 7.3's \"coercion, duress, or harassment\" language.\n- **Personalization:** Every message references a specific matter in the recipient's public record: SEC filings, litigation docket entries, recent M&A activity, reported transactions. Generic \"We help companies with X\" pitches fail on both deliverability and compliance grounds.\n- **Sender identity:** Messages should come from a named partner with Bar admission, not from a generic `bd@firm.com` alias. Bar rules require identifying the responsible attorney.\n- **Reply handling:** Replies must be triaged by a human who can confirm no conflict-of-interest issue before the firm engages further. Infrabox's unified inbox view makes this simple for a managing partner overseeing 10+ BD mailboxes.\n\nFor a boutique firm with 10 partners, the sustainable volume is roughly 150-250 BD emails per day across the firm, or about 3,000-5,000 per month. That's enough to build a meaningful pipeline without violating any state's solicitation rules.",
    },
    {
      heading: "Compliance Stack for Law Firm BD",
      content:
        "The compliance requirements that infrastructure must support:\n\n- **Opt-out honored across all mailboxes**: a single unsubscribe must apply to every partner and BD mailbox in the firm, not just the one that sent the message.\n- **Archival for 2-7 years** per state: every outbound BD message must be stored in a system of record separate from the sending mailbox.\n- **Standardized advertising footer**: injected automatically to avoid partner-by-partner drift.\n- **Sender identity verification**: DMARC set to `p=reject` to prevent anyone from spoofing the firm's BD domain. Law firms are high-value spoofing targets because of the client-confidentiality trust their domains carry.\n- **No-contact list integration**: existing client conflicts and represented-party lists must load into the sequencer as a hard suppression before any BD campaign sends.\n\nInfrabox handles the sending-side pieces (DMARC, per-domain suppression, per-mailbox send windows). The CRM side (archival, no-contact list, advertising footer content) is owned by the firm's BD operations team, but Infrabox integrates cleanly with the major legal CRMs.",
    },
  ],
  faqs: [
    {
      question: "Is email to general counsel allowed under ABA Rule 7.3?",
      answer:
        "Yes, in most states. ABA Model Rule 7.3 allows targeted written solicitation to sophisticated business recipients like general counsel as long as the message is clearly labeled, not coercive, and not sent to anyone who has opted out. Check the specific state bar rules for any jurisdictions where the firm is admitted. Florida, Texas, and California have specific additional labeling or archival requirements.",
    },
    {
      question: "Should a law firm use its main domain for BD email?",
      answer:
        "No. A deliverability failure or spam complaint on the main domain would contaminate retention letters, billing, and active-matter communications. Always use dedicated BD domains clearly affiliated with the firm in WHOIS and message body.",
    },
    {
      question: "How much email volume is appropriate for a law firm?",
      answer:
        "10-25 sends per mailbox per working day. More than that violates the high-touch nature of BD outreach and triggers conservative Fortune 500 spam filters. A boutique firm with 10 partners can sustainably send 150-250 BD emails per day across the whole firm.",
    },
    {
      question: "Does a law firm need to archive every BD email?",
      answer:
        "Yes in several states. California requires attorney solicitations to be retained for two years; other states have similar or longer retention rules. The firm's CRM (Interaction, Foundation, HubSpot) handles archival. Infrabox pushes every sent message to the CRM via the sequencer integration layer.",
    },
  ],
  sources: [
    {
      title: "ABA Model Rule 7.3: Solicitation of Clients",
      url: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_3_solicitation_of_clients/",
      date: "2026",
    },
    {
      title: "FTC CAN-SPAM Compliance Guide",
      url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      date: "2026",
    },
    {
      title: "California Rules of Professional Conduct Rule 7.3",
      url: "https://www.calbar.ca.gov/Portals/0/documents/rules/Rule_7.3-Exec_Summary-Redline.pdf",
      date: "2018",
    },
    {
      title: "Infrabox Documentation",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
  ],
  relatedSlugs: [
    "email-infrastructure-setup-guide",
    "email-compliance-gdpr-can-spam",
    "dmarc-setup-email",
    "best-email-infrastructure-2026",
  ],
};
