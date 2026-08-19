export const article = {
  "slug": "agentmail-pricing",
  "title": "AgentMail Pricing (2026)",
  "metaDescription": "Full AgentMail pricing breakdown for 2026: the Free, Developer ($20), and Startup ($200) tiers, what the email-API-for-agents model includes, and how it differs from email infrastructure.",
  "headline": "AgentMail Pricing 2026: Free, Developer, Startup & Enterprise Plans",
  "publishedAt": "2026-06-06",
  "updatedAt": "2026-06-06",
  "author": "Mohit Mimani",
  "category": "Pricing",
  "readingTime": "9 min read",
  "tags": [
    "agentmail pricing",
    "email api for ai agents",
    "agentmail review",
    "email infrastructure pricing",
    "infrabox"
  ],
  "excerpt": "AgentMail is a different kind of product from most \"inbox\" providers: it's an email inbox API built for AI agents, not an email sending service. It gives autonomous agents their own real inboxes — create, send, receive, and search email via REST API, with an MCP server, SDKs, and webhooks. Pricing is volume-tiered by inboxes and emails per month, starting free and scaling to $200/month for the Startup tier. This guide breaks down AgentMail pricing in 2026, what each plan includes, and where AgentMail fits versus email infrastructure.",
  "screenshots": [
    {
      "src": "/images/compare/agentmail-pricing.png",
      "alt": "AgentMail pricing page showing Free, Developer, and Startup plans",
      "caption": "AgentMail's usage-based tiers: Free ($0, 3 inboxes), Developer ($20/mo, 10 inboxes), and Startup ($200/mo, 150 inboxes, SOC 2) — priced by inbox count and monthly email volume."
    }
  ],
  "type": "pricing-teardown",
  "sections": [
    {
      "heading": "Quick summary (TL;DR)",
      "content": "AgentMail has four plans: **Free ($0 — 3 inboxes, 3,000 emails/month, 100/day cap), Developer ($20/month — 10 inboxes, 10,000 emails/month, 10 custom domains), Startup ($200/month — 150 inboxes, 150,000 emails/month, 150 custom domains, dedicated IPs on request, SOC 2, Slack support), and Enterprise (custom — usage-based, white-label, EU/BYO cloud, SSO).** Pricing scales by inboxes and email volume, not just seats, which makes it cheap to spin up many agent inboxes (Startup works out to ~$1.33/inbox). Every plan includes the API, SDKs, MCP server, threads, labels, attachments, and DKIM/SPF/DMARC. The key thing to understand: AgentMail is purpose-built for **AI agent email** (two-way agentic workflows), using optimized shared IPs by default (dedicated IPs on request from the Startup tier) — it's a different category from cold-outreach infrastructure."
    },
    {
      "heading": "How AgentMail pricing works",
      "content": "AgentMail's model is developer/API-first and usage-based:\n\n- **Tiered by inboxes + email volume.** Each plan sets an inbox count and a monthly email allowance; you pick the tier that fits your agent fleet's volume.\n- **Cheap to create many inboxes.** Because pricing scales with volume rather than per-seat, spinning up lots of agent inboxes is practical (Startup = 150 inboxes for $200).\n- **API as the product.** REST API, SDKs, an MCP server, webhooks, and websockets are the core — built for programmatic inbox creation and two-way agent conversations.\n- **Deliverability basics included, dedicated IPs higher up.** DKIM/SPF/DMARC and optimized shared IPs come standard; dedicated IPs start at the Startup tier (contact us).\n\nThere's a free tier (no credit card), and early-stage startups can get a free month on the Startup tier via a launch offer."
    },
    {
      "heading": "All AgentMail pricing plans",
      "content": "| Plan | Price | Inboxes | Emails/month | Custom domains | Notable |\n|---|---|---|---|---|---|\n| Free | $0 | 3 | 3,000 (100/day) | — | No card required |\n| Developer | $20/mo | 10 | 10,000 | 10 | Email support, no daily cap |\n| Startup | $200/mo | 150 | 150,000 | 150 | Dedicated IPs on request, SOC 2, Slack support |\n| Enterprise | Custom | Custom | Custom | Custom | White-label, EU/BYO cloud, SSO, usage-based |\n\nRates are from the [AgentMail pricing page](https://agentmail.to/pricing). All plans include threads, labels, attachments, drafts, schedule send, SDKs, and an MCP server."
    },
    {
      "heading": "What you actually get",
      "content": "- **Real inboxes for AI agents via API** — programmatic create/send/receive/search, designed for autonomous agents and agentic workflows.\n- **Developer tooling** — REST API, SDKs, MCP server, webhook endpoints (2 on Free/Developer, 10 on Startup), websockets, and metrics.\n- **Email primitives** — threads, labels, attachments, drafts, schedule send, and SMTP relay.\n- **Deliverability foundations** — automated DKIM/SPF/DMARC, suppression list, and optimized shared IPs; dedicated IPs on request from the Startup tier.\n- **Security & compliance** — multi-factor auth, signed webhooks, SOC 2 report (Startup+), and OIDC/SAML SSO (Enterprise).\n- **Custom domains** — 10 on Developer, 150 on Startup."
    },
    {
      "heading": "The real per-inbox cost",
      "content": "AgentMail's volume-tiered model makes per-inbox cost low at scale:\n\n- **Developer:** $20 ÷ 10 inboxes = **$2/inbox/month** (10,000 emails included).\n- **Startup:** $200 ÷ 150 inboxes = **~$1.33/inbox/month** (150,000 emails included) — very cheap per inbox.\n- **The binding constraint is email volume, not inbox count.** Like other usage-based products, you choose a tier based on how many emails your agents send/receive per month; the inbox count is generous relative to typical agent workloads.\n\nBecause the included email volume is high relative to inbox count, AgentMail is economical for fleets of agents that each handle modest email volume."
    },
    {
      "heading": "Hidden costs and gotchas",
      "content": "Five things to weigh:\n\n1. **It's built for agents, not cold outreach.** AgentMail optimizes for two-way agentic email (support bots, agent conversations, transactional/agent workflows) — not bulk email campaigns. The deliverability model and IP strategy reflect that.\n2. **Shared IPs by default.** Optimized shared IPs come standard; dedicated IPs start at the Startup tier (contact us). For deliverability-critical bulk sending, that matters.\n3. **Volume tiers, not unlimited.** Each plan caps monthly emails (3k / 10k / 150k). Exceeding your tier means upgrading.\n4. **Daily cap on Free.** The Free tier limits 100 emails/day; paid tiers remove the daily limit.\n5. **SOC 2 and dedicated IPs gate at Startup.** If you need compliance documentation or dedicated IPs, you're on the $200 tier or above."
    },
    {
      "heading": "How AgentMail pricing compares",
      "content": "| Provider | Model | Price | Built for | IPs | Best for |\n|---|---|---|---|---|---|\n| AgentMail | Tiered by inboxes + volume | $0 / $20 / $200 / custom | AI agent email (API) | Shared (dedicated on request) | Developers building agentic email |\n| Infrabox | Plan + mailbox slots | $2.50–$3.50/mailbox | Email infrastructure | US IPs included | Cold outreach at scale + monitoring |\n| Maildoso (SMTP) | Per-mailbox packages | $1.80–$3.10/mailbox | Email (SMTP) | Shared (rotation) | Budget high-volume B2B SMTP |\n| Premium Inboxes | Per-inbox, done-for-you | $2.80–$4.50/inbox | Email (official accounts) | — | White-glove official inboxes |\n\nThe honest positioning: AgentMail and Infrabox aren't direct competitors — they solve different problems. AgentMail is the right tool when you're **building AI agents that need their own inboxes** to send and receive email programmatically (agent identities, autonomous workflows, two-way conversations), with a developer-first API, MCP server, and SDKs. [Infrabox](https://infrabox.software/) is the right tool when you're running **email outreach at scale** and need official Google Workspace, Microsoft 365, or Azure mailboxes engineered for deliverability — with US IPs, per-domain admin panels, 24+ sequencer integrations, and always-on InfraGuard monitoring (blacklist checks every 6 hours, DNS watchdog, bounce tracking). Infrabox also exposes a full REST API and webhooks, so teams that want programmatic *official* mailboxes for outreach get that too. If your use case is agent inboxes, AgentMail; if it's email deliverability, Infrabox. The two can even be complementary."
    },
    {
      "heading": "Who AgentMail is best for at this price",
      "content": "AgentMail makes sense for **developers and teams building AI agents that need real email inboxes** — support agents, sales agents, autonomous workflows, or any product where an agent must send and receive email programmatically. The free tier makes it easy to prototype, the Developer tier ($20) suits individual builders, and the Startup tier ($200 for 150 inboxes + dedicated IPs on request + SOC 2) fits production agent fleets. Its API-first design, MCP server, and SDKs are purpose-built for agentic email in a way general mailbox providers aren't."
    },
    {
      "heading": "Who should consider an alternative",
      "content": "AgentMail is harder to justify when:\n\n- **You're doing email outreach.** AgentMail isn't built for bulk cold campaigns; for deliverability-critical outreach you want official Google/Microsoft mailboxes with monitoring — see [Infrabox](https://infrabox.software/).\n- **You need dedicated IPs at the entry level.** Dedicated IPs start at the Startup tier; email providers include dedicated/US IPs lower down.\n- **You need official Google/Microsoft accounts.** AgentMail provisions agent inboxes on its own infrastructure, not official Workspace/365 accounts with admin panels.\n- **Deliverability monitoring is critical.** AgentMail covers DKIM/SPF/DMARC and suppression lists, but always-on blacklist/DNS/bounce monitoring (InfraGuard) is an email-specific layer."
    },
    {
      "heading": "Final verdict",
      "content": "AgentMail is a well-designed, developer-first email API for AI agents, and its pricing reflects that: a genuinely useful free tier, a $20 Developer plan for builders, and a $200 Startup plan that delivers 150 inboxes, dedicated IPs on request, and SOC 2 for production agent fleets. Priced by inboxes and volume, it's economical for spinning up many agent inboxes, and the API/MCP/SDK tooling is purpose-built for agentic workflows.\n\nJust be clear on the category: AgentMail is for giving AI agents inboxes, not for email outreach. If your goal is deliverability-critical cold sending — official Google, Microsoft 365, or Azure mailboxes with US IPs, admin panels, sequencer integrations, and always-on InfraGuard monitoring (plus a full API for programmatic management) — that's a different product. [See how Infrabox compares](https://infrabox.software/)."
    }
  ],
  "faqs": [
    {
      "question": "How much does AgentMail cost?",
      "answer": "AgentMail has four tiers: Free ($0 — 3 inboxes, 3,000 emails/month), Developer ($20/month — 10 inboxes, 10,000 emails/month), Startup ($200/month — 150 inboxes, 150,000 emails/month, dedicated IPs on request, SOC 2), and Enterprise (custom, usage-based). Pricing scales by inboxes and email volume."
    },
    {
      "question": "What is AgentMail used for?",
      "answer": "AgentMail is an email inbox API for AI agents. It gives autonomous agents real inboxes to create, send, receive, and search email programmatically via REST API, with an MCP server, SDKs, and webhooks — built for agentic workflows rather than cold outreach."
    },
    {
      "question": "Is AgentMail good for email?",
      "answer": "Not really — it's purpose-built for AI agent email, using optimized shared IPs by default (dedicated IPs on request from the Startup tier). For email outreach at scale, official Google/Microsoft mailboxes with deliverability monitoring (e.g., Infrabox) are the better fit."
    },
    {
      "question": "Does AgentMail have a free plan?",
      "answer": "Yes. The Free tier includes 3 inboxes, 3,000 emails/month (100/day cap), and 3 GB storage with no credit card required. Early-stage startups can also get a free month on the Startup tier via a launch offer."
    },
    {
      "question": "When do you get dedicated IPs on AgentMail?",
      "answer": "Dedicated IPs start at the Startup tier ($200/month, contact us) and Enterprise. The Free and Developer tiers use optimized shared IPs."
    },
    {
      "question": "How does AgentMail's per-inbox cost work out?",
      "answer": "On the Startup tier, $200 for 150 inboxes is ~$1.33/inbox/month; on Developer, $20 for 10 inboxes is $2/inbox. The real constraint is the monthly email allowance per tier, not the inbox count."
    }
  ],
  "sources": [
    {
      "title": "AgentMail Official Pricing",
      "url": "https://agentmail.to/pricing",
      "date": "2026"
    },
    {
      "title": "Infrabox Pricing",
      "url": "https://www.infrabox.software/#pricing",
      "date": "2026"
    }
  ],
  "relatedSlugs": [
    "agentmail-review",
    "infrabox-pricing",
    "best-email-infrastructure-2026"
  ]
};
