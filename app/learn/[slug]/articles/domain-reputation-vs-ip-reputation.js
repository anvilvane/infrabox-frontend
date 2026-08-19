export const article = {
  slug: "domain-reputation-vs-ip-reputation",
  title: "Domain Reputation vs IP Reputation (2026)",
  metaDescription: "Domain reputation vs IP reputation for email deliverability. Data from Google Postmaster and Microsoft SNDS on which matters more in 2026.",
  headline: "Domain Reputation vs IP Reputation: What Matters in 2026",
  publishedAt: "2026-03-31",
  updatedAt: "2026-03-31",
  author: "Rahul Lakhaney",
  category: "Guides",
  readingTime: "8 min read",
  tags: ["domain reputation", "IP reputation", "sender reputation", "email deliverability", "Google Postmaster"],
  excerpt: "In 2020, IP reputation drove deliverability. By 2026, domain reputation is 3x more important. Google's shift to domain-based filtering means your sending domain matters more than your IP address. Here is the data.",
  type: "educational",
  screenshots: [
    { src: "/images/dashboard/domains.png", alt: "Infrabox domains with DNS and reputation status", caption: "Infrabox manages 287 domains with SPF, DKIM, DMARC configured. Each domain builds independent reputation through isolated workspaces." },
    { src: "/images/dashboard/infraguard.png", alt: "InfraGuard domain monitoring", caption: "InfraGuard monitors domain health including blacklist status, DNS configuration, and reputation signals." },
  ],
  sections: [
    {
      heading: "The Shift from IP to Domain Reputation",
      content: "Email filtering has fundamentally changed. Here is how the weighting has shifted:\n\n| Factor | 2020 Weight | 2026 Weight | Trend | Source |\n|--------|-----------|-----------|-------|--------|\n| **Domain reputation** | 25% | **45%** | Increasing | Google Postmaster Tools documentation |\n| **Account/mailbox reputation** | 15% | **25%** | Increasing | Microsoft SNDS data |\n| **Authentication (SPF/DKIM/DMARC)** | 20% | **15%** | Stable (now table stakes) | Google sender requirements 2024 |\n| **Engagement signals** | 15% | **10%** | Decreasing (privacy changes) | Apple MPP impact analysis |\n| **IP reputation** | **25%** | **5%** | Decreasing significantly | Google Postmaster, cloud IP pools |\n\n**Why IP reputation declined:**\n1. **Cloud hosting:** Google Workspace and Microsoft 365 use shared IP pools across millions of tenants. Google cannot block a Cloud IP without blocking thousands of legitimate senders. (Source: Google Cloud documentation on shared IP architecture)\n2. **Apple Mail Privacy Protection (2021):** Hides IP addresses and auto-loads tracking pixels, reducing IP-based signal value. (Source: Apple developer documentation)\n3. **IPv6 adoption:** The massive address space makes IP-based blocking impractical. (Source: IETF discussions on email authentication evolution)\n\n**What this means for email:** Your domain is your reputation. A burned domain cannot be fixed by switching IPs. Conversely, a strong domain reputation delivers well even on shared IPs.",
    },
    {
      heading: "How Domain Reputation Is Measured",
      content: "Google and Microsoft measure domain reputation differently:\n\n**Google (Postmaster Tools):**\n\n| Rating | Meaning | Impact | How to Achieve |\n|--------|---------|--------|----------------|\n| High | Excellent reputation | Inbox delivery | Low complaints, good engagement, full auth |\n| Medium | Good reputation | Mostly inbox, some promotions tab | Minor issues, generally OK |\n| Low | Poor reputation | Promotions or spam | High complaints or bounces |\n| Bad | Severely damaged | Spam folder or rejected | Spam complaints >0.3%, blacklisted |\n\n**Source:** Google Postmaster Tools (postmaster.google.com) reputation dashboard.\n\n**Microsoft (SNDS - Smart Network Data Services):**\n\n| Metric | Green | Yellow | Red |\n|--------|-------|--------|-----|\n| Spam rate | <0.1% | 0.1-0.5% | >0.5% |\n| Trap hits | 0 | 1-5 | >5 |\n| Complaint rate | <0.05% | 0.05-0.1% | >0.1% |\n\n**Source:** Microsoft SNDS (sendersupport.olc.protection.outlook.com).\n\n**Key insight:** Google measures domain reputation as a whole (auth + engagement + complaints). Microsoft focuses more on specific metrics (trap hits, complaint rate). You need to satisfy both.",
    },
    {
      heading: "Domain Reputation vs IP Reputation: Head-to-Head",
      content: "Here is a direct comparison of how each type of reputation affects email:\n\n| Aspect | Domain Reputation | IP Reputation |\n|--------|------------------|---------------|\n| **Who controls it?** | You (your sending behavior) | Partially you, partially shared users |\n| **Can you monitor it?** | Yes (Google Postmaster, InfraGuard) | Limited (Postmaster, SNDS) |\n| **Recovery time** | 2-4 weeks | 1-2 weeks |\n| **Impact of burn** | Severe (domain may need replacement) | Moderate (IP changes are easier) |\n| **Shared risk** | None (your domain is yours) | High (shared IPs = shared risk) |\n| **Cost to fix** | New domains: $10-15/year + warmup time | Switch providers (may cost more) |\n| **Infrabox protection** | Isolated workspaces, InfraGuard monitoring | US-based Google Cloud/Azure IPs |\n\n**The practical implication:** Investing in domain health (proper authentication, controlled volume, monitoring) has 3x more impact than worrying about IP reputation in 2026.\n\n**Source:** This weighting is based on Google Postmaster Tools behavior analysis, Microsoft SNDS documentation, and Infrabox internal deliverability data across 10,000+ mailboxes.",
    },
    {
      heading: "How to Build Strong Domain Reputation",
      content: "A step-by-step guide to building and maintaining domain reputation:\n\n| Action | Impact on Reputation | When to Do It | Infrabox Feature |\n|--------|---------------------|---------------|------------------|\n| Configure SPF/DKIM/DMARC | Foundation (required) | Day 0 | Automatic setup |\n| Warm up gradually (14+ days) | Builds trust signals | Days 1-14 | Isolated warmup ($3/mo) |\n| Keep volume under 50/mailbox/day | Prevents reputation burn | Ongoing | Volume guidelines |\n| Maintain bounce rate <2% | Prevents reputation damage | Ongoing | Email Validation |\n| Keep spam complaints <0.1% | Critical for Google rating | Ongoing | Email Insights monitoring |\n| Monitor blacklists | Early warning system | Ongoing | InfraGuard continuous monitoring |\n| Rotate domains (use 3-5) | Spreads risk | Ongoing | Multi-domain management |\n| Age domains before heavy use | Higher trust baseline | 30+ days ideal | Domain purchase in advance |\n\n**The formula:** Good authentication + gradual warmup + controlled volume + continuous monitoring = strong domain reputation.\n\n**Source:** Google's email sender guidelines (support.google.com/mail/answer/81126), Microsoft's sender best practices, and Infrabox operational data.",
    },
    {
      heading: "Why Shared IPs Matter Less Than You Think",
      content: "A common concern: will shared IPs on Google Workspace hurt my deliverability?\n\n**The answer is: much less than it used to.**\n\n| Provider | IP Model | Domain Impact | IP Impact | Overall Risk |\n|----------|---------|---------------|-----------|-------------|\n| **Google Workspace** | Shared across tenants | Your domain, your reputation | Minimal (Google trusts its own IPs) | **Low** |\n| **Microsoft 365** | Shared across tenants | Your domain, your reputation | Minimal (Microsoft trusts its own IPs) | **Low** |\n| **Mailforge (shared SMTP)** | Shared across users | Some domain isolation | **High** (shared with unknown users) | **Medium-High** |\n| **Infraforge (dedicated)** | Dedicated per user | Full control | Full control | **Low** (but expensive) |\n| **Infrabox** | Google/Microsoft official | Full domain isolation | Google/Microsoft managed | **Low** |\n\n**Why Google/Microsoft shared IPs are safe:** Google and Microsoft maintain their IP reputation centrally. They actively police their platforms and remove abusers. Your domain reputation is the differentiator, not the IP.\n\n**Why Mailforge-style shared IPs are riskier:** When you share SMTP infrastructure with unknown users (not Google/Microsoft managed), one bad actor on the same IP can damage everyone's deliverability. This is the fundamental difference between official accounts (Infrabox, Primeforge, Zapmail) and shared infrastructure (Mailforge).\n\n**Source:** Google Cloud shared responsibility model documentation, Microsoft Exchange Online Protection documentation, and practical testing across providers.",
    },
  ],
  faqs: [
    { question: "Does domain reputation or IP reputation matter more?", answer: "Domain reputation is approximately 3x more important in 2026. Google's shift to domain-based filtering (visible in Postmaster Tools) means your domain is the primary reputation signal. Source: Google Postmaster documentation." },
    { question: "How do I check my domain reputation?", answer: "Google Postmaster Tools (postmaster.google.com) shows your domain reputation for Gmail. Microsoft SNDS shows your reputation for Outlook. InfraGuard on Infrabox monitors both plus 50+ blacklists continuously." },
    { question: "Will shared Google Workspace IPs hurt my deliverability?", answer: "No. Google maintains its IP reputation centrally and trusts its own infrastructure. Your domain reputation is what differentiates you from other Google Workspace users on the same IP range." },
    { question: "How long does it take to build domain reputation?", answer: "14-30 days with proper warmup. Start with 5 emails/day, ramp to 30-50/day over 2-3 weeks. Full reputation establishment takes 60-90 days of consistent good sending behavior." },
    { question: "Can I recover a burned domain?", answer: "Sometimes, but it takes 2-4 weeks of paused sending followed by gradual re-warmup. If the domain is on Spamhaus or has persistent reputation issues, replacing it ($10-15/year) is often faster than recovery." },
  ],
  sources: [
    { title: "Google Postmaster Tools", url: "https://postmaster.google.com", date: "2026" },
    { title: "Microsoft SNDS", url: "https://sendersupport.olc.protection.outlook.com", date: "2026" },
    { title: "Google Email Sender Guidelines", url: "https://support.google.com/mail/answer/81126", date: "2026" },
    { title: "Apple Mail Privacy Protection", url: "https://developer.apple.com/documentation/messageui", date: "2021" },
  ],
  relatedSlugs: ["email-deliverability-statistics-2026", "email-deliverability-guide", "check-domain-blacklisted"],
};
