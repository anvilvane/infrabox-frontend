export const article = {
  slug: "email-domain-setup-checklist",
  title: "Email Domain Setup Checklist (2026)",
  metaDescription: "15-step checklist for email domain setup. Domain purchase, DNS configuration, warmup, and common mistakes to avoid.",
  headline: "Email Domain Setup Checklist: 15 Steps (2026)",
  publishedAt: "2026-03-31",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "10 min read",
  tags: ["domain setup", "email checklist", "DNS setup", "email infrastructure"],
  excerpt: "Every step from buying a domain to sending your first campaign. Based on 10,000+ domain setups on Infrabox.",
  type: "educational",
  screenshots: [
    { src: "/images/dashboard/quick-setup.png", alt: "Infrabox Quick Setup wizard", caption: "Infrabox Quick Setup: Domains, Mailboxes, Sequencer, Configure, Review. Under 10 minutes." },
    { src: "/images/dashboard/domains.png", alt: "Infrabox domains with DNS status", caption: "287 domains with green SPF, DKIM, DMARC indicators." },
  ],
  sections: [
    {
      heading: "The Complete 15-Step Checklist",
      content: "Based on 10,000+ domain setups on Infrabox.\n\n| Step | Task | Time | Infrabox Automated? | Common Mistake |\n|------|------|------|-------------------|----------------|\n| 1 | Choose domain name | 5 min | Search tool | Using exact brand names |\n| 2 | Select extension (.com/.co) | 2 min | TLD filter | Choosing .xyz (low trust) |\n| 3 | Purchase domain | 2 min | In-app | Overpaying at registrars |\n| 4 | Point nameservers | 5 min | Automatic | Wrong NS, 48h propagation |\n| 5 | Configure SPF | 3 min | **Automatic** | >10 DNS lookups (RFC 7208) |\n| 6 | Configure DKIM | 3 min | **Automatic** | Wrong selector, weak key |\n| 7 | Configure DMARC | 2 min | **Automatic** | Starting with p=reject |\n| 8 | Set up MX records | 2 min | **Automatic** | Missing MX = no replies |\n| 9 | Create mailboxes (3/domain) | 5 min | **Automatic** | >5 per domain (risky) |\n| 10 | Set profile pictures | 3 min | Bulk upload | Skipping (hurts trust) |\n| 11 | Configure MFA | 2 min | **Automatic** | Skipping (Google flags) |\n| 12 | Start warmup | 1 min | $3/mailbox/mo | Skipping warmup entirely |\n| 13 | Connect sequencer | 3 min | One-click export | Wrong SMTP settings |\n| 14 | Set up domain forwarding | 2 min | Dashboard | No website on domain |\n| 15 | Enable monitoring | 1 min | InfraGuard | No monitoring = blind |\n| **Total** | | **~40 min manual** | **~10 min Infrabox** | |\n\n**Source:** Infrabox Quick Setup wizard automates steps 4-12. DNS record formats per Google Workspace Admin Help (support.google.com/a/answer/33786).",
    },
    {
      heading: "Domain Extension Impact on Deliverability",
      content: "Extension choice matters more than most people think.\n\n| Extension | Inbox Rate | Cost/Year | Recommendation | Source |\n|-----------|-----------|-----------|---------------|--------|\n| .com | 85-95% | $12-15 | **Best if available** | Infrabox IPT data |\n| .co | 82-92% | $8-10 | **Great alternative** | Infrabox IPT data |\n| .io | 80-90% | $30-40 | Good for tech | Infrabox IPT data |\n| .net | 78-88% | $12-15 | Acceptable | Industry data |\n| .xyz | 60-75% | $1-3 | **Avoid** | Validity 2025 |\n| .info | 55-70% | $2-5 | **Avoid** | Validity 2025 |\n\n**Why .xyz and .info perform poorly:** These extensions are heavily used by spammers due to low cost. ISPs have learned to be suspicious of them. Source: Validity 2025 Deliverability Report.",
    },
    {
      heading: "Mailbox Density: How Many Per Domain",
      content: "The number of mailboxes per domain affects deliverability risk.\n\n| Mailboxes/Domain | Risk | Volume/Day | Best For |\n|-----------------|------|-----------|----------|\n| 1-2 | Very Low | 30-60 | Conservative |\n| **3** | **Low** | **90** | **Recommended** |\n| 4-5 | Medium | 120-150 | With monitoring |\n| 6-10 | High | 180-300 | Agencies only |\n| 10+ | Very High | 300+ | Not recommended |\n\n**Why 3 is the sweet spot:** 3 mailboxes x 30 emails/day = 90/day per domain. At $2.50/mailbox: $8.97/mo per domain. Cost-effective without reputation risk.\n\nSource: Infrabox recommended setup, aligned with Instantly and SmartLead best practices.",
    },
    {
      heading: "Warmup Timeline",
      content: "Don't skip warmup. The data is clear.\n\n| Day | Volume/Mailbox | Inbox Placement | Activity |\n|-----|---------------|----------------|----------|\n| 1-3 | 5/day | 40-60% | Warmup only |\n| 4-7 | 10-15/day | 55-70% | Warmup + light testing |\n| 8-14 | 15-25/day | 70-85% | Small campaigns OK |\n| 15-21 | 25-40/day | 80-90% | Ramp campaigns |\n| 22-30 | 30-50/day | 85-95% | Full volume |\n\nInfrabox warmup: $3/mailbox/month, isolated pools (not shared). Source: Infrabox warmup data across 5,000+ cycles.",
    },
    {
      heading: "Total Cost Calculator",
      content: "What it actually costs to set up email infrastructure.\n\n| Scale | Domains | Mailboxes | Domain Cost | Mailbox Cost | Warmup | **Total/Month** |\n|-------|---------|-----------|------------|-------------|--------|----------------|\n| Starter | 4 | 12 | $4/mo | $35.88 | $36 | **$75.88** |\n| Growth | 12 | 36 | $12/mo | $107.64 | $108 | **$227.64** |\n| Scale | 28 | 84 | $28/mo | $251.16 | $252 | **$531.16** |\n| Agency | 56 | 168 | $56/mo | $502.32 | $504 | **$1,062.32** |\n\n**Math:** Domain ~$12/year = $1/mo. Google Workspace $2.50/mailbox/mo. Warmup $3/mailbox/mo.\n\nSource: Infrabox pricing (infrabox.software). No platform fees, no minimums.",
    },
  ],
  faqs: [
    { question: "How long does full setup take?", answer: "10 minutes with Infrabox (automated DNS), then 14 days warmup before first campaign. Manual setup: 40-60 minutes + same warmup." },
    { question: "How many domains for 1,000 emails/day?", answer: "About 12 domains with 3 mailboxes each (36 mailboxes x 30/day = 1,080/day). Cost: ~$228/mo on Infrabox." },
    { question: "Can I skip warmup?", answer: "You can but inbox placement drops from 85-95% to 15-35%. The 14-day warmup is the difference between campaigns that work and campaigns in spam." },
    { question: "Google or Microsoft?", answer: "Both work. Use 70% Google + 30% Microsoft for provider diversity. Infrabox plans start at $39/mo and support Google, Microsoft, and Azure. Google warms up faster; Microsoft has higher daily limits." },
    { question: "What's the cheapest way to start?", answer: "4 domains, 12 Google mailboxes: $35.88/mo for mailboxes + $36/mo for warmup ($3/mailbox/mo add-on) = $75.88/mo total with warmup. Sends ~360 emails/day safely." },
  ],
  sources: [
    { title: "Google Workspace Admin Help", url: "https://support.google.com/a", date: "2026" },
    { title: "RFC 7208 SPF", url: "https://datatracker.ietf.org/doc/html/rfc7208", date: "2026" },
    { title: "RFC 6376 DKIM", url: "https://datatracker.ietf.org/doc/html/rfc6376", date: "2026" },
    { title: "RFC 7489 DMARC", url: "https://datatracker.ietf.org/doc/html/rfc7489", date: "2026" },
    { title: "Infrabox DNS Docs", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: ["email-infrastructure-setup-guide", "dns-setup-guide", "how-many-domains-email"],
};
