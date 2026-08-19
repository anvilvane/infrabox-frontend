export const article = {
  slug: "email-infrastructure-setup-guide",
  title: "Email Infrastructure Setup Guide (2026)",
  metaDescription:
    "Step-by-step guide to setting up email infrastructure in 2026. Covers domains, DNS, mailboxes, warmup, monitoring, and sequencer integration.",
  headline:
    "Email Infrastructure Setup: Complete Guide (2026)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "14 min read",
  tags: [
    "email infrastructure setup",
    "email setup guide",
    "dns configuration",
    "email warmup",
    "deliverability",
  ],
  excerpt:
    "The complete guide to setting up email infrastructure from scratch. Domains, DNS records, mailboxes, warmup, monitoring, and sequencer integration. everything you need in one place.",
  type: "educational",
  sections: [
    {
      heading: "What Does Email Infrastructure Include?",
      content:
        "Email infrastructure has five layers, and **skipping any single layer compromises everything above it.** A $50,000 outreach campaign can fail because of a missing DMARC record.\n\n| Layer | What It Is | Why It Matters | Infrabox Cost |\n|-------|-----------|----------------|---------------|\n| **1. Domains** | The foundation of your sending identity | Each domain handles ~50 emails/day safely | Starting at **$2/year** |\n| **2. DNS Records** | SPF, DKIM, DMARC, MX authentication | Without all four, emails land in spam | **Included** (automated) |\n| **3. Mailboxes** | Google Workspace, Microsoft 365, or Azure accounts | Real accounts get **20+ points** better inbox placement than shared IPs | Google **$2.50/mo** (annual), Microsoft **$2.50/mo**, Azure **$30/tenant** |\n| **4. Warmup** | Building sender reputation before campaigns | Skipping warmup = **54% inbox placement** vs **88%** with proper warmup | **$3/mailbox/mo** |\n| **5. Monitoring** | Ongoing health checks and deliverability tracking | Catches blacklists, DNS changes, and reputation drops before they kill campaigns | InfraGuard (per-domain pricing) |\n\n> **Screenshot reference:** See the *quick-setup.png* screenshot in the Infrabox dashboard. the 5-step setup wizard walks you through domain purchase, DNS configuration, mailbox creation, warmup activation, and sequencer connection in a single guided flow.",
    },
    {
      heading: "Step 1: Domain Strategy",
      content:
        "**How many domains?** Rule of thumb: 1 domain per 50 emails/day. Sending 500 emails/day? Buy 10 domains.\n\n**Domain naming:** Use variations of your brand or related industry terms. Avoid exact copies of your primary domain.\n\n**Domain extensions:** .com is safest. .io, .co, .net are acceptable. Avoid obscure TLDs.\n\n**Where to buy:** Infrabox includes domain registration starting at $2/year with automatic DNS configuration. Or buy elsewhere and point nameservers to Infrabox.\n\n**Domain age:** New domains need 2-4 weeks of warmup. Aged domains can ramp faster.",
    },
    {
      heading: "Step 2: DNS Configuration",
      content:
        "**SPF (Sender Policy Framework):** Tells receiving servers which IPs can send on behalf of your domain. Must be configured correctly or emails fail authentication.\n\n**DKIM (DomainKeys Identified Mail):** Cryptographic signature proving emails were not altered in transit. Each mailbox provider has specific DKIM records.\n\n**DMARC (Domain-based Message Authentication):** Policy telling receivers what to do with emails that fail SPF/DKIM. Start with p=none, move to p=quarantine after warmup.\n\n**MX Records:** Points your domain to the correct mail server.\n\n**Infrabox automates all DNS configuration.** When you create a mailbox, SPF, DKIM, DMARC, and MX records are set up automatically within minutes.",
    },
    {
      heading: "Step 3: Mailbox Provisioning",
      content:
        "Here is the complete decision matrix for mailbox provisioning:\n\n| Factor | Google Workspace | Microsoft 365 |\n|--------|-----------------|---------------|\n| **Infrabox price** | **$2.50/mo** (annual) | **$2.50/mo** |\n| **Warmup time** | **14-16 days** (faster) | 17-21 days |\n| **Gmail inbox rate** | **85-92%** (higher) | 78-85% |\n| **Outlook inbox rate** | 75-82% | **82-90%** (higher) |\n| **Best for** | Gmail-heavy B2B audiences | Provider diversity + Outlook audiences |\n| **Recommended split** | **70%** of your mailboxes | **30%** of your mailboxes |\n\n**Mailboxes per domain:** 2-3 is the safe maximum. More than 5 per domain increases domain-level reputation risk.\n\n**Mailbox naming rules:**\n| Do This | Do Not Do This |\n|---------|---------------|\n| john.smith@ | sales@ |\n| sarah@ | info@ |\n| mike.johnson@ | noreply@ |\n| j.williams@ | contact@ |\n\n**Infrabox provisioning:** Bulk creation supports **30+ mailboxes** in a single batch with automatic DNS configuration for each domain.",
    },
    {
      heading: "How Does Email Warmup Work?",
      content:
        "**Why warmup?** New mailboxes have zero reputation. Sending emails immediately will land in spam. Warmup builds reputation through controlled sending and receiving.\n\n**Duration:** 14-21 days minimum. Do not skip or shorten.\n\n**Volume ramp:** Start at 5-10 emails/day, increase by 2-3 per day. Target 30-40/day for cold outreach.\n\n**Isolated vs shared warmup:** Isolated (Infrabox) produces 92% inbox placement. Shared pool produces 80-85%. The difference compounds at scale.\n\n**Infrabox warmup:** Activate from the dashboard. The isolated network handles everything automatically.",
    },
    {
      heading: "Step 5: Monitoring",
      content:
        "**What to monitor:**\n- Blacklist status (check daily)\n- DNS record integrity (SPF, DKIM, DMARC still correct)\n- Sender reputation scores\n- Bounce rates (above 5% is a red flag)\n- Spam complaint rates (above 0.1% is dangerous)\n\n**Manual monitoring** takes 4-5 hours/week for 50+ mailboxes.\n\n**InfraGuard (Infrabox)** automates all monitoring: continuous DNS checks, blacklist scanning, reputation tracking, anomaly detection, and auto-pause when issues are found. Replaces manual monitoring entirely.",
    },
    {
      heading: "Step 6: Sequencer Integration",
      content:
        "Connect your warmed-up mailboxes to your email sending tool:\n\n**Infrabox supports one-click export to:** Instantly, SmartLead, Salesforge, Woodpecker, Reply.io, Snov.io, Lemlist, Saleshandy, Emailbison, ReachInbox, Manyreach, Supersend, BrandJet, and 10+ more (23+ total integrations).\n\n**Connection methods:** IMAP/SMTP credentials or OAuth (Google/Microsoft). OAuth is preferred for security and reliability.\n\n**Sending limits:** Start at 20-30 emails/day per mailbox. Increase gradually to 40-50 max.",
    },
    {
      heading: "What Are the Most Common Setup Mistakes?",
      content:
        "Here is the complete setup mistake checklist with the fix for each:\n\n| # | Mistake | Impact | Fix | Infrabox Auto-Fix? |\n|---|---------|--------|-----|-------------------|\n| **1** | Skipping warmup | **54% vs 88%** inbox placement | Complete 14-21 day warmup before any cold outreach | Automated warmup at **$3/mailbox/mo** |\n| **2** | Wrong DNS records | SPF/DKIM/DMARC failures = emails land in spam | Verify all three pass via Gmail Show Original | **Yes**. auto-configured |\n| **3** | Too many mailboxes per domain | Domain reputation risk if one mailbox gets flagged | Stay at **2-3 mailboxes** per domain maximum | **Yes**. enforced during provisioning |\n| **4** | Sending too fast | Triggers spam filters and ISP rate limiting | Start at **20-30/day** per mailbox, increase gradually | Warmup handles ramp-up |\n| **5** | No monitoring | Blacklists and DNS issues compound silently for days | Check blacklists daily, DNS weekly, reputation weekly | **Yes**. InfraGuard continuous monitoring |\n| **6** | Same content across all mailboxes | Pattern detection by email providers | Rotate subject lines, body copy, and CTAs across mailboxes | Manual (copy strategy) |\n| **7** | Ignoring bounce rates | Bounces above **5%** trigger spam filters | Clean and verify email lists before every campaign | InfraGuard alerts on bounce spikes |\n\n> **Screenshot reference:** See the *quick-setup.png* screenshot. Infrabox's guided wizard prevents mistakes 2, 3, and 5 by automating DNS, enforcing domain limits, and enabling InfraGuard during initial setup.",
    },
  ],
  faqs: [
    {
      question: "How long does email infrastructure setup take?",
      answer:
        "With Infrabox: 15 minutes for initial setup, 14-21 days for warmup. Total time to campaign-ready: 2-3 weeks.",
    },
    {
      question: "How much does email infrastructure cost?",
      answer:
        "On Infrabox: Agency plan $99/mo (30 included) + additional at $3.25 each, domains from $2/year. A 50-mailbox setup costs $164/month (Agency + 20 extra), plus $150/month for warmup ($3/mailbox/mo add-on).",
    },
    {
      question: "Do I need both Google and Microsoft mailboxes?",
      answer:
        "Not required but recommended. Provider diversity reduces risk. A 70/30 Google/Microsoft split is common.",
    },
  ],
  screenshots: [
    { src: "/images/dashboard/quick-setup.png", alt: "Infrabox 5-step setup wizard", caption: "Infrabox's guided 5-step setup wizard walking through domain purchase, DNS configuration, mailbox creation, warmup activation, and sequencer connection" },
    { src: "/images/dashboard/domains.png", alt: "Infrabox domain DNS management", caption: "Automated DNS record management showing SPF, DKIM, and DMARC status with one-click configuration for all domains" },
  ],
  sources: [
    { title: "Google Workspace Admin Help", url: "https://support.google.com/a", date: "2026" },
    { title: "Microsoft 365 Admin", url: "https://admin.microsoft.com", date: "2026" },
    { title: "RFC 7208 SPF", url: "https://datatracker.ietf.org/doc/html/rfc7208", date: "2026" },
    { title: "Infrabox Docs", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: [
    "what-is-infrabox",
    "spf-record-setup-email",
    "domain-warmup-best-practices",
  ],
};
