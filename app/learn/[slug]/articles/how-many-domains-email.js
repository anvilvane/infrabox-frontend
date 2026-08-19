export const article = {
  slug: "how-many-domains-email",
  title:
    "How Many Domains for Email? (2026)",
  metaDescription:
    "Calculate exactly how many domains you need for email. Formula: 1 domain per 50 daily emails with 2-3 mailboxes each. Full calculator and scaling guide.",
  headline:
    "How Many Domains Do You Need for Email? (Calculator)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "domains for email",
    "email infrastructure planning",
    "email scaling",
    "domain strategy",
    "deliverability",
  ],
  excerpt:
    "The formula: 1 domain per 50 daily emails, 2-3 mailboxes per domain. Sending 500 emails/day? You need ~10 domains and 25 mailboxes. Full calculator and strategy guide inside.",
  screenshots: [{ src: "/images/dashboard/domains.png", alt: "Infrabox managing hundreds of email domains at scale", caption: "Infrabox domain management showing how hundreds of domains are organized with SPF, DKIM, and DMARC status at a glance" }],  type: "educational",
  sections: [
    {
      heading: "The Basic Formula",
      content:
        "**The formula:** Domains needed = Daily email volume / 50. Mailboxes needed = Domains x 2-3.\n\nHere is the complete calculator for monthly send volumes:\n\n| Monthly Sends | Daily Volume | Emails/Mailbox/Day | Mailboxes Needed | Domains (3/domain) | Infrabox Monthly Cost (Google) |\n|--------------|-------------|-------------------|-----------------|-------------------|-------------------------------|\n| **1,500** | 50/day | 30 | 2 | 1 | **$5.98/mo** |\n| **5,000** | ~170/day | 30 | 6 | 2 | **$17.94/mo** |\n| **10,000** | ~335/day | 30 | 12 | 4 | **$35.88/mo** |\n| **25,000** | ~835/day | 30 | 28 | 10 | **$83.72/mo** |\n| **50,000** | ~1,670/day | 30 | 56 | 19 | **$167.44/mo** |\n| **100,000** | ~3,335/day | 30 | 112 | 38 | **$334.88/mo** |\n\n*Costs shown are Google Workspace mailboxes at **$2.50/mo** each. Add **$3/mailbox/mo** for warmup. Microsoft 365 mailboxes are **$2.50/mo** each. Domains from **$2/year**.*\n\nThis assumes **30 emails per mailbox per day** for optimal deliverability. Pushing to 40-50/day is possible but increases spam risk.",
    },
    {
      heading: "Why Not More Mailboxes Per Domain?",
      content:
        "More than 3 mailboxes per domain increases risk:\n- **Domain reputation concentration**. if one mailbox gets flagged, it affects all mailboxes on that domain\n- **Suspicious patterns**. receiving servers notice multiple accounts sending from the same domain\n- **Recovery difficulty**. a compromised domain takes down more mailboxes\n\n2-3 mailboxes per domain is the safe maximum. At 2 mailboxes per domain, you have better isolation.",
    },
    {
      heading: "Domain Selection Strategy",
      content:
        "**Naming:** Use variations related to your brand or industry. Not exact copies of your primary domain.\n\n**Extensions:** .com preferred. .io, .co, .net acceptable. Avoid .xyz, .info, .biz.\n\n**Age:** New domains need 2-4 weeks of warmup. Aged domains (6+ months) can ramp faster.\n\n**Provider diversity:** Buy domains from different registrars for DNS diversity.\n\n**Infrabox domain registration** starts at $2/year with automatic DNS configuration.",
    },
    {
      heading: "Cost Calculator",
      content:
        "Here is the full cost breakdown on Infrabox at different scales, including all infrastructure components:\n\n| Scale | Domains | Mailboxes | Mailbox Cost (Google $2.50/mo) | Domain Cost ($2/yr) | Warmup ($3/mo) | Total Monthly |\n|-------|---------|-----------|-------------------------------|--------------------|--------------|--------------:|\n| **100/day** | 2 | 5 | $14.95 | $0.33 | $15.00 | **~$30/mo** |\n| **500/day** | 10 | 25 | $74.75 | $1.67 | $75.00 | **~$151/mo** |\n| **1,000/day** | 20 | 50 | $149.50 | $3.33 | $150.00 | **~$303/mo** |\n| **2,500/day** | 50 | 125 | $373.75 | $8.33 | $375.00 | **~$757/mo** |\n| **5,000/day** | 100 | 250 | $747.50 | $16.67 | $750.00 | **~$1,514/mo** |\n\n*Domain cost amortized monthly. InfraGuard monitoring is additional per-domain pricing. DNS automation is included at no extra cost.*\n\n**Compare to alternatives:** The same 500/day setup on Zapmail costs ~$74.75/mo for mailboxes (same $2.50/mo rate), but without isolated warmup or InfraGuard monitoring. On shared IP platforms like Mailforge, you save on mailbox cost but lose **20+ percentage points** of inbox placement.",
    },
    {
      heading: "Scaling Strategy",
      content:
        "**Start small, scale gradually:**\n1. Begin with 5-10 domains and 15-25 mailboxes\n2. Warm up for 14-21 days\n3. Run campaigns for 2-4 weeks to establish performance baseline\n4. Add 5-10 domains every 2 weeks as needed\n5. Monitor with InfraGuard throughout\n\n**Do not buy 100 domains on day one.** Scale infrastructure in line with your actual sending needs.",
    },
  ],
  faqs: [
    {
      question: "How many domains do I need for 500 emails per day?",
      answer:
        "10 domains with 2-3 mailboxes each (25 total). Each mailbox sends 20-40 emails/day.",
    },
    {
      question: "How many mailboxes per domain is safe?",
      answer:
        "2-3 mailboxes per domain maximum. More than 3 increases risk of domain-level reputation damage.",
    },
    {
      question: "How much does this infrastructure cost?",
      answer:
        "On Infrabox: 500 emails/day needs ~$74.75/month for 25 Google mailboxes, plus $75/month for warmup ($3/mailbox/mo add-on). InfraGuard monitoring included.",
    },
  ],
  sources: [
    { title: "Spamhaus TLD Statistics", url: "https://www.spamhaus.org/statistics/tlds/", date: "2026" },
    { title: "Google Sender Guidelines", url: "https://support.google.com/mail/answer/81126", date: "2026" },
    { title: "Infrabox Domain Docs", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: [
    "scale-email-100-to-10000",
    "best-domain-extensions-email",
    "email-infrastructure-setup-guide",
  ],
};
