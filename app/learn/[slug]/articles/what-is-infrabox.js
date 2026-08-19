export const article = {
  slug: "what-is-infrabox",
  title:
    "What is Infrabox? Email Infrastructure Platform",
  metaDescription:
    "Infrabox is an email infrastructure platform: real Google Workspace, Microsoft 365, and Azure mailboxes with automated DNS, warmup, and monitoring. From $39/mo.",
  headline:
    "What is Infrabox?",
  publishedAt: "2026-03-30",
  updatedAt: "2026-08-19",
  author: "",
  category: "Guides",
  readingTime: "9 min read",
  tags: [
    "infrabox",
    "email infrastructure",
    "google workspace",
    "microsoft 365",
    "email warmup",
    "deliverability",
  ],
  excerpt:
    "Infrabox is an email infrastructure platform. It provisions real Google Workspace, Microsoft 365, and Azure mailboxes, configures SPF, DKIM, DMARC, and MX automatically, warms the mailboxes on an isolated network, monitors them with InfraGuard, and exports them to your sequencer in one click. Plans start at $39/mo with 10 mailboxes included.",
  type: "what-is",
  sections: [
    {
      heading: "Infrabox in One Paragraph",
      content:
        "Infrabox is an email infrastructure platform. It provisions the mailboxes, domains, and DNS that outbound email actually runs on, warms those mailboxes up, watches them for deliverability problems, and hands them to whichever sending tool you use. All of it happens from one dashboard instead of across a registrar, a Google admin console, a DNS provider, and a spreadsheet.\n\nWhat you get concretely: real Google Workspace, Microsoft 365, and Azure mailboxes on US IPs, sitting on domains you either register through Infrabox or already own, with SPF, DKIM, DMARC, and MX records written for you through Cloudflare in under 60 seconds per domain.\n\nInfrabox is not a sequencer, and it does not replace one. It does not build lists, write copy, or run campaigns. It supplies and maintains the accounts your sequencer sends from. That is the layer most teams underestimate, and the layer most deliverability problems trace back to.",
    },
    {
      heading: "Who Infrabox Is For",
      content:
        "Infrabox is built for teams that send from more than a handful of mailboxes.\n\n**Email agencies.** If you run infrastructure for multiple clients, the workspace system, tagging, and bulk operations replace most of the manual setup work. Spinning up a new client means buying domains, creating mailboxes, and exporting credentials to their sequencer, rather than a day of console clicking.\n\n**B2B sales teams.** Outbound at scale needs mailboxes that stay healthy. Infrabox handles provisioning, authentication, and monitoring so the team spends its time on targeting and copy instead of DNS records.\n\n**Lead generation companies.** High-volume senders need consistent placement across many domains. Automated DNS, isolated warmup, and per-domain monitoring are exactly the parts of the job that do not scale by hand.\n\nIf you send from one or two mailboxes on a single domain, you do not need a platform for this. Infrabox starts paying off once the manual version becomes repetitive.",
    },
    {
      heading: "What You Actually Get",
      content:
        "**Real mailboxes on Google Workspace, Microsoft 365, and Azure.** These are genuine provider accounts with admin panel access, 2FA, and app passwords, not shared-IP relays. Google Workspace mailboxes are provisioned on US-based IPs, which tend to start with better standing at North American mailbox providers. Google and Microsoft cost the same on every plan; there is no Microsoft premium. Azure tenants are priced separately at $30 per domain for up to 100 mailboxes, and are the option to reach for when you want provider diversity beyond Google and Microsoft.\n\n**Automated DNS.** When a domain is provisioned, Infrabox writes SPF, DKIM, DMARC, MX, and tracking-domain records through Cloudflare in under 60 seconds. This is the step that quietly breaks most self-built setups: a missing DKIM key or a second SPF record is invisible until placement collapses weeks later. The [email authentication guide](/learn/email-authentication-spf-dkim-dmarc-explained) covers what each record does.\n\n**Warmup on an isolated network.** Warmup is a $3.00/mailbox/mo add-on. Your mailboxes exchange warmup mail with a controlled pool rather than a shared pool of other companies' accounts, so someone else's bad sending cannot contaminate your reputation. Volume, ramp speed, and target metrics are configurable per mailbox, and a mailbox is typically ready for real sending after 14 to 21 days. If you cannot wait, the Prewarm Inventory sells already-warmed mailboxes on aged domains at $6 for 2 to 4 weeks of warmup, $7 for 4 to 8 weeks, and $9 for 8 or more weeks, plus a one-time domain transfer fee.\n\n**Per-domain isolation.** Each domain is its own unit: its own authentication records, its own group of mailboxes, its own monitoring. When something goes wrong on one domain, the damage and the response stay scoped to it instead of spreading across the fleet. That is why volume is spread across several domains as standard practice, and why the platform is organised around domains rather than one flat list of mailboxes.\n\n**InfraGuard monitoring.** InfraGuard checks your domains against blacklists every six hours, watches for DNS drift, and tracks bounce rates. When it detects a problem it alerts you and can automatically pause the affected mailboxes, which is the part manual monitoring cannot replicate: an alert at 2am sits unread until morning, and an automatic pause does not. Pricing is per domain.\n\n**Inbox placement testing.** Seed-based placement tests show where your mail is landing across providers before you scale a campaign. Tests are paid per test from your wallet.\n\n**One-click export to sequencers.** Infrabox exports mailboxes with IMAP and SMTP credentials to 23+ sending platforms, including Instantly, SmartLead, Salesforge, Woodpecker, Reply.io, Snov.io, Lemlist, Saleshandy, Emailbison, ReachInbox, Manyreach, and Supersend. Nothing is copied by hand, and you are not locked into one sender.\n\n**The dashboard.** One screen for every domain, mailbox, warmup status, and deliverability signal you own, plus renewal forecasting so domain expiries do not surprise you. Workspaces separate clients or business units, with tagging, filtering, and bulk actions across them. Mailbox forwarding rules route replies to a central inbox, and a REST API covers programmatic mailbox and domain management.",
    },
    {
      heading: "How Setup Works",
      content:
        "A first batch of mailboxes takes roughly 15 minutes of hands-on time:\n\n1. **Create an account** at infrabox.software and add funds to your wallet.\n2. **Add domains.** Register them through Infrabox from $2/year, or point the nameservers of domains you already own.\n3. **Create mailboxes** on Google Workspace, Microsoft 365, or Azure, within the slots your plan includes.\n4. **Let DNS configure itself.** SPF, DKIM, DMARC, and MX are written automatically at provisioning; you verify status per domain instead of editing zone files.\n5. **Activate warmup** at $3.00/mailbox/mo and let it run for 14 to 21 days before real sending.\n6. **Export to your sequencer** in one click, with IMAP and SMTP credentials pushed for you.\n7. **Enable InfraGuard** so blacklist, DNS, and bounce problems are caught and paused automatically from then on.\n\nThe waiting is the warmup, not the setup. Steps 1 through 4 are the part that used to take an afternoon per batch.",
    },
    {
      heading: "Plans and Pricing",
      content:
        "Infrabox uses tiered subscriptions with mailbox slots included, and no platform fee on top of the plan price:\n\n| Plan | Monthly Price | Included Mailboxes | Additional Mailbox |\n|---|---|---|---|\n| **Professional** | **$39/mo** | 10 | $3.50/mailbox |\n| **Agency** | **$99/mo** | 30 | $3.25/mailbox |\n| **Enterprise** | **$299/mo** | 100 | $2.50/mailbox |\n\nGoogle Workspace and Microsoft 365 mailboxes draw on the same slots at the same rate. Annual billing costs less than monthly (Enterprise annual works out to $250/mo, with additional mailboxes at $2.50).\n\n| Add-On | Price |\n|---|---|\n| Warmup | **$3.00/mailbox/mo** (isolated network) |\n| Azure Domain | **$30/domain** (up to 100 mailboxes) |\n| Domain Registration | From **$2/year** |\n| InfraGuard Monitoring | Per-domain pricing |\n| DNS Configuration | Included |\n| Inbox Placement Tests | Per test, from wallet |\n\nA worked example: 50 mailboxes on the Agency plan with warmup on all of them is $99 + (20 x $3.25) + (50 x $3.00) = **$314/mo**. The full breakdown, including competitor comparisons, is in [Infrabox pricing](/learn/infrabox-pricing).",
    },
    {
      heading: "How Infrabox Compares",
      content:
        "The category splits on two questions: are the mailboxes real provider accounts or shared-IP relays, and is warmup and monitoring bundled, sold separately, or absent entirely.\n\n| Feature | Infrabox | ZapMail | Mailforge | Instantly |\n|---|---|---|---|---|\n| Plans | From **$39/mo** (10 mailboxes) | From $39/mo (10 mailboxes) | Flat per-mailbox | Bundled in platform |\n| Per-Mailbox (at scale) | From **$2.50** (Enterprise) | From $3.00 (Pro) | $2-3/mo (shared IP) | ~$4/mo |\n| Microsoft 365 | **Yes** | Yes | Shared IP only | No |\n| Azure Mailboxes | **Yes** ($30/domain, 100 mailboxes) | No | No | No |\n| Warmup | Isolated ($3/mo add-on) + Prewarm Inventory ($6-9/mailbox) | Pre-warmed (12 weeks, pricing not public) | None (Warmforge extra) | Shared pool |\n| Monitoring | InfraGuard (per-domain) | ZapShield (blacklist + DNS) | None (Infraforge extra) | Basic score |\n| Integrations | 23+ sequencers | 50+ | 3 | Instantly only |\n| Account Type | Real Google/Microsoft/Azure | Real Google/Microsoft | Shared IP | Real Google only |\n\nInfrabox and ZapMail run near-identical plan structures, so choosing between them comes down to warmup architecture and monitoring rather than price. Against shared-IP providers the trade is straightforward: you pay more per mailbox for accounts whose reputation belongs to you alone. For the wider field, see [best email infrastructure](/learn/best-email-infrastructure-2026).",
    },
    {
      heading: "Trade-Offs to Know",
      content:
        "Four things worth knowing before committing:\n\n1. **Warmup is a paid add-on, not a bundled feature.** At $3.00/mailbox/mo it is a real line item, and for teams warming every mailbox it can approach the plan price itself. Budget for it rather than assuming the plan covers it.\n\n2. **Azure domains cost $30 each.** That is well above standard registrar pricing, and it buys the Azure tenant rather than the domain alone. If you only need Google or Microsoft mailboxes, you never touch this.\n\n3. **There is a learning curve.** The dashboard exposes domains, mailboxes, warmup, monitoring, workspaces, and integrations at once, and the first session can feel dense. It gets fast after the model clicks, but expect to spend time in it.\n\n4. **Warmup still takes time.** 14 to 21 days is the honest number for a fresh mailbox. The Prewarm Inventory exists precisely because no platform can shortcut sender reputation on demand.",
    },
  ],
  faqs: [
    {
      question: "Is Infrabox legit?",
      answer:
        "Yes. Infrabox provisions real Google Workspace, Microsoft 365, and Azure accounts rather than shared-IP relays, and gives you admin panel access to every account it creates. The mailboxes are verifiable in the provider's own console.",
    },
    {
      question: "How much does Infrabox cost?",
      answer:
        "Three plans: Professional at $39/mo (10 mailboxes, $3.50 per additional), Agency at $99/mo (30 mailboxes, $3.25 per additional), and Enterprise at $299/mo (100 mailboxes, $2.50 per additional). Domain registration starts at $2/year, and annual billing costs less than monthly.",
    },
    {
      question: "Does Infrabox include warmup?",
      answer:
        "Warmup is a $3.00/mailbox/mo add-on, not part of the plan price. It runs on an isolated network rather than a shared pool, and volume, ramp speed, and target metrics are configurable per mailbox from the dashboard.",
    },
    {
      question: "What sequencers does Infrabox integrate with?",
      answer:
        "23+ platforms, including Instantly, SmartLead, Salesforge, Woodpecker, Reply.io, Snov.io, Lemlist, Saleshandy, Emailbison, ReachInbox, Manyreach, and Supersend. Export is one click and pushes IMAP and SMTP credentials for you.",
    },
    {
      question: "Can I use my own domains with Infrabox?",
      answer:
        "Yes. Register domains through Infrabox or point the nameservers of domains you already own. Either way, SPF, DKIM, DMARC, and MX records are configured and monitored automatically.",
    },
    {
      question: "What is InfraGuard?",
      answer:
        "InfraGuard is the monitoring layer. It checks your domains against blacklists every six hours, watches for DNS drift, and tracks bounce rates. On detecting a problem it alerts you and can automatically pause the affected mailboxes. Pricing is per domain.",
    },
    {
      question: "How long does warmup take on Infrabox?",
      answer:
        "14 to 21 days before a fresh mailbox is ready for real outbound. If you need to send sooner, the Prewarm Inventory offers already-warmed mailboxes on aged domains at $6 to $9 per mailbox depending on warmup duration.",
    },
  ],
  screenshots: [
    { src: "/images/dashboard/dashboard-home.png", alt: "Infrabox dashboard managing 18M+ emails, 5K domains, 16K mailboxes", caption: "Infrabox dashboard managing 18M+ emails sent, 5,039 domains, and 16,754 mailboxes across Google, Microsoft, and Azure with renewal forecasting" },
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox sequencer integrations with 23+ platforms", caption: "One-click export to 23+ sequencers including Instantly, SmartLead, Apollo, Reply, Lemlist, and more" },
    { src: "/images/dashboard/domains.png", alt: "Infrabox domain management with DNS records", caption: "Domain management panel with automated SPF, DKIM, and DMARC configuration status for each domain" },
  ],
  sources: [
    { title: "Infrabox Official Site", url: "https://www.infrabox.software", date: "2026" },
    { title: "Infrabox Docs", url: "https://docs.infrabox.software", date: "2026" },
    { title: "Google Workspace Admin Help", url: "https://support.google.com/a", date: "2026" },
  ],
  relatedSlugs: ["infrabox-review", "best-email-infrastructure-2026"],
};
