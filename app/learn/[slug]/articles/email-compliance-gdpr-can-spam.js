export const article = {
  slug: "email-compliance-gdpr-can-spam",
  title: "Email Compliance: GDPR & CAN-SPAM (2026)",
  metaDescription:
    "Email compliance guide for GDPR and CAN-SPAM in 2026. What is legal, what is not, opt-out requirements, and how to stay compliant at scale.",
  headline: "Email Compliance: GDPR & CAN-SPAM Guide (2026)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-07-29",
  author: "Rahul Lakhaney",
  category: "Educational",
  readingTime: "9 min read",
  tags: [
    "email compliance",
    "gdpr",
    "can-spam",
    "email regulations",
    "legal requirements",
  ],
  excerpt:
    "Email is legal under both GDPR and CAN-SPAM when done correctly. Here are the exact requirements, common misconceptions, and how to stay compliant at scale.",
  screenshots: [{ src: "/images/dashboard/domains.png", alt: "Infrabox domain management with SPF, DKIM, and DMARC status indicators", caption: "Infrabox domain management showing DNS authentication status for compliant email infrastructure" }],  type: "educational",
  sections: [
    {
      heading: "Is Email Legal?",
      content:
        "**Yes, cold B2B email is legal** in most jurisdictions when done correctly.\n\n**CAN-SPAM (US):** Email is explicitly permitted. Does not require prior consent. Must include opt-out mechanism, physical address, and accurate sender information.\n\n**GDPR (EU/UK):** B2B email is generally permitted under the \"legitimate interest\" basis. Must be relevant to the recipient's professional role, include opt-out, and process data minimally.\n\n**CASL (Canada):** Stricter. Requires implied or express consent. B2B is possible under the \"conspicuously published\" exception for publicly listed business contacts.\n\nHere is how the major regulations compare:\n\n| Regulation | Region | Cold B2B Allowed | Consent Required | Max Penalty |\n| --- | --- | --- | --- | --- |\n| CAN-SPAM | US | Yes | No | $50,120/violation |\n| GDPR | EU/UK | Yes (legitimate interest) | No for B2B | 4% revenue or 20M EUR |\n| CASL | Canada | Restricted | Implied or express | $10M CAD/violation |\n| PECR | UK | Yes (B2B) | No for B2B | Varies |\n\nThe key: email is legal. Spam is not. The difference is compliance and relevance.",
    },
    {
      heading: "CAN-SPAM Requirements",
      content:
        "All emails to US recipients must:\n\n1. **Accurate From line**. Sender name and email must identify your business\n2. **Honest subject line**. Cannot be deceptive or misleading\n3. **Physical address**. Include a valid physical postal address\n4. **Unsubscribe mechanism**. Clear, one-click opt-out that works within 10 business days\n5. **Honor opt-outs**. Process within 10 business days, no re-emailing opted-out contacts\n6. **Identify as ad**. If the email is primarily promotional, it must be identifiable as such\n\n**Penalty:** Up to $50,120 per violation.",
    },
    {
      heading: "GDPR Requirements for B2B Email",
      content:
        "Under GDPR, B2B email is permissible under legitimate interest if:\n\n1. **Relevant to recipient's role**. You are contacting them about something related to their professional function\n2. **Data minimization**. Only collect and use necessary data (name, business email, company)\n3. **Easy opt-out**. Clear unsubscribe in every email\n4. **Privacy notice accessible**. Link to your privacy policy\n5. **Legitimate interest assessment**. Document why your outreach serves a legitimate business purpose\n6. **Right to erasure**. Delete contact data upon request\n\n**Key distinction:** GDPR applies to personal data of EU/UK individuals, even in B2B contexts.",
    },
    {
      heading: "Compliance at Scale",
      content:
        "Use this checklist for every email campaign. Each item is a legal requirement under at least one regulation:\n\n| Requirement | CAN-SPAM | GDPR | CASL | How to Implement |\n| --- | --- | --- | --- | --- |\n| Unsubscribe link in every email | Required | Required | Required | Built into sequencer templates |\n| Process opt-outs within 10 days | Required | Required | Required | Automate via suppression list |\n| Physical postal address | Required | Recommended | Required | Email footer |\n| Accurate sender name and email | Required | Required | Required | Real names, business addresses |\n| Relevant to recipient's role | Best practice | Required | Required | Segment by industry/role |\n| Privacy policy link | Not required | Required | Recommended | Email footer |\n| Legitimate interest documentation | Not required | Required | N/A | Internal records |\n| Geographic segmentation | Not required | Required | Required | Separate EU/CA from US lists |\n| Data deletion on request | Not required | Required | Required | CRM process |\n| List cleaning (bounces, complaints) | Best practice | Required | Required | Automated via InfraGuard |\n\n**Automate as much as possible.** At scale, manual compliance is error-prone. Your sequencer should handle unsubscribes, and InfraGuard monitors for complaint-based issues automatically.",
    },
    {
      heading: "Common Misconceptions",
      content:
        "**\"Email is illegal under GDPR.\"** False. B2B email under legitimate interest is permitted. Personal (B2C) email requires consent.\n\n**\"I need consent for every email.\"** False under CAN-SPAM. True for CASL. Depends on jurisdiction.\n\n**\"Unsubscribe links hurt deliverability.\"** False. They are required by law and actually improve deliverability by reducing spam complaints.\n\n**\"If they do not reply, I can keep emailing.\"** Technically legal under CAN-SPAM (until they opt out), but harmful to reputation. Limit follow-ups to 3-4 per contact.",
    },
  ],
  faqs: [
    {
      question: "Is cold B2B email legal?",
      answer:
        "Yes, in most jurisdictions. CAN-SPAM (US) explicitly allows it. GDPR (EU) permits it under legitimate interest for B2B. Always include opt-out mechanism.",
    },
    {
      question: "Do I need an unsubscribe link in emails?",
      answer:
        "Yes. Required by CAN-SPAM and best practice under GDPR. It also reduces spam complaints, which helps deliverability.",
    },
    {
      question: "What is the penalty for non-compliance?",
      answer:
        "CAN-SPAM: up to $50,120 per violation. GDPR: up to 4% of annual revenue or 20 million euros.",
    },
  ],
  sources: [
    { title: "CAN-SPAM Act: A Compliance Guide for Business", url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business", date: "2023" },
    { title: "GDPR Official Text - Regulation (EU) 2016/679", url: "https://gdpr-info.eu/", date: "2016" },
    { title: "CASL - Canada's Anti-Spam Legislation", url: "https://crtc.gc.ca/eng/internet/anti.htm", date: "2014" },
    { title: "ICO Guide to PECR - Privacy and Electronic Communications Regulations", url: "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/", date: "2026" },
    { title: "FTC Enforcement Actions Under CAN-SPAM", url: "https://www.ftc.gov/legal-library/browse/cases-proceedings?search_api_fulltext=CAN-SPAM", date: "2026" },
    { title: "Infrabox Compliance Documentation", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: [
    "why-emails-go-to-spam",
    "email-infrastructure-setup-guide",
    "email-bounce-rate-benchmarks",
  ],
};
