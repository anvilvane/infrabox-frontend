export const article = {
  slug: "infrabox-whitelabel-guide",
  title: "Infrabox Whitelabel Guide (2026)",
  metaDescription:
    "Complete guide to Infrabox's whitelabel partner program. Custom branding, client management, billing integration, partner API, and agency revenue calculator.",
  headline: "Infrabox Whitelabel Guide for Agencies",
  publishedAt: "2026-03-31",
  updatedAt: "2026-03-31",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "15 min read",
  tags: [
    "whitelabel",
    "partner program",
    "agency",
    "email infrastructure reseller",
    "custom branding",
    "client management",
  ],
  excerpt:
    "Infrabox's whitelabel program lets agencies offer email infrastructure under their own brand. Custom domain, your logo, client management, and wholesale pricing. Here is how to set it up and the revenue math behind it.",
  type: "educational",
  sections: [
    {
      heading: "What Infrabox Whitelabel Offers",
      content:
        "Infrabox's whitelabel program gives agencies a fully branded email infrastructure platform they can offer to clients as their own product. Your clients see your brand, your domain, and your support. Infrabox powers everything behind the scenes.\n\n**What is customizable:**\n\n| Element | Customizable | Details |\n|---------|-------------|--------|\n| **Logo** | Yes | Your logo throughout the dashboard |\n| **Brand colors** | Yes | Primary, secondary, accent colors |\n| **Custom domain** | Yes | portal.youragency.com instead of app.infrabox.software |\n| **Email notifications** | Yes | From your domain, your branding |\n| **Client-facing features** | Yes | Toggle which features clients see |\n| **Pricing** | Yes | Set your own pricing for clients |\n| **Support** | Your responsibility | You handle client support |\n| **Billing** | Flexible | Wholesale from Infrabox, retail to clients |\n\n**How it works architecturally:**\n1. Infrabox provides the platform infrastructure (servers, Google/Microsoft provisioning, DNS automation, warmup)\n2. You get a branded portal on your domain\n3. Your clients access the portal and see only your brand\n4. You buy at wholesale, sell at retail\n5. Infrabox handles the technical operations\n\nFull whitelabel setup documentation: [docs.infrabox.software](https://docs.infrabox.software)",
    },
    {
      heading: "Setting Up Your Branded Portal",
      content:
        "Setup takes about 30 minutes with Infrabox's guided process:\n\n**Step 1: Apply for the partner program**\nContact the Infrabox partner team or apply through [infrabox.software/partners](/partners). Whitelabel is available for agencies managing 50+ mailboxes.\n\n**Step 2: Configure your brand**\nIn the partner dashboard, set:\n- Company name and logo (SVG or PNG, 200x50px recommended)\n- Primary brand color (hex code)\n- Secondary and accent colors\n- Favicon\n\n**Step 3: Set up your custom domain**\nPoint your chosen subdomain to Infrabox's whitelabel servers:\n\n```dns\n; DNS records for custom domain\nportal.youragency.com  CNAME  whitelabel.infrabox.software\n```\n\nSSL certificates are provisioned automatically via Let's Encrypt.\n\n**Step 4: Configure email notifications**\nSet your sending domain for client-facing emails (welcome emails, alerts, reports). Requires SPF/DKIM configuration on your agency domain.\n\n**Step 5: Set pricing and features**\nChoose which features your clients can access and set your retail pricing. You can configure different pricing tiers for different client segments.\n\nSee [docs.infrabox.software](https://docs.infrabox.software) for detailed branding configuration options.",
    },
    {
      heading: "Client Management",
      content:
        "The partner dashboard gives you a complete client management layer on top of Infrabox's infrastructure:\n\n**Client features:**\n\n| Feature | Description | Configuration |\n|---------|------------|---------------|\n| **Client accounts** | Separate login for each client | Email + password or SSO |\n| **Resource isolation** | Each client sees only their domains/mailboxes | Automatic |\n| **Feature toggles** | Control which features each client accesses | Per-client |\n| **Usage limits** | Set max domains/mailboxes per client | Per-client |\n| **Sub-billing** | Track per-client costs | Automatic |\n| **Activity logs** | Monitor client actions | Read-only |\n\n**Client onboarding workflow:**\n1. Create client account in partner dashboard\n2. Set their domain and mailbox limits\n3. Configure which features they can see\n4. Send them login credentials\n5. Client manages their own domains and mailboxes within your platform\n\n**For agencies managing clients hands-on:** You can manage all infrastructure from a single partner dashboard and only give clients read-only access or no access at all. Some agencies prefer to keep all infrastructure management in-house.\n\nSee [docs.infrabox.software](https://docs.infrabox.software) for client management documentation.",
    },
    {
      heading: "Revenue Model: The Agency Math",
      content:
        "The whitelabel model creates a recurring revenue stream from email infrastructure management. Here is the math:\n\n**Wholesale pricing (what you pay Infrabox):**\nPartner pricing varies by volume commitment. Contact the partner team for exact rates.\n\n**Retail pricing (what you charge clients):**\nYou set your own prices. Common agency pricing models:\n\n| Model | How It Works | Example |\n|-------|-------------|--------|\n| **Per-mailbox markup** | Charge $5-8/mailbox/mo | 100 mailboxes at $6 = $600/mo revenue |\n| **Flat monthly retainer** | Infrastructure included in management fee | $500-2,000/mo per client |\n| **Tiered packages** | Starter/Growth/Enterprise bundles | $199/$499/$999 per month |\n| **Cost-plus** | Wholesale + fixed markup % | 40-60% margin on infrastructure |\n\n**Revenue calculator at different scales:**\n\n| Clients | Mailboxes/Client | Total Mailboxes | Retail at $6/mb | Monthly Revenue | Annual Revenue |\n|---------|-----------------|----------------|----------------|----------------|----------------|\n| 5 | 20 | 100 | $6.00 | **$600** | **$7,200** |\n| 10 | 30 | 300 | $6.00 | **$1,800** | **$21,600** |\n| 20 | 40 | 800 | $5.50 | **$4,400** | **$52,800** |\n| 50 | 50 | 2,500 | $5.00 | **$12,500** | **$150,000** |\n\n**Key insight:** Email infrastructure is a sticky, recurring revenue stream. Once clients are set up on your platform, switching costs are high (DNS migration, new warmup cycle). Retention rates for infrastructure services typically exceed 90% annually.\n\nThat stickiness also makes infrastructure a useful retention tool when a client's budget tightens. [The Playbook Agency cut churn 80%](/case-studies/playbook-white-label-downsell-model-infrabox) by offering whitelabel infrastructure as a downsell tier instead of losing accounts outright, and grew infrastructure revenue 30% in the process.",
      callout: {
        variant: "verdict",
        title: "Revenue Potential",
        text: "An agency with 20 clients averaging 40 mailboxes each can generate $50,000+ in annual recurring revenue from infrastructure alone. This is on top of any campaign management or consulting fees.",
      },
    },
    {
      heading: "Partner API: Programmatic Client Management",
      content:
        "The Partner API extends Infrabox's standard API with multi-tenant capabilities for managing clients programmatically:\n\n```bash\n# List all clients\ncurl -H \"Authorization: Bearer PARTNER_API_KEY\" \\\n  https://api.infrabox.software/v1/partner/clients\n\n# Create a new client\ncurl -X POST -H \"Authorization: Bearer PARTNER_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\": \"Acme Corp\", \"email\": \"admin@acme.com\", \"maxMailboxes\": 50}' \\\n  https://api.infrabox.software/v1/partner/clients\n\n# Provision mailboxes for a client\ncurl -X POST -H \"Authorization: Bearer PARTNER_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"clientId\": \"client_123\", \"email\": \"outreach@acmedomain.com\", \"provider\": \"google\"}' \\\n  https://api.infrabox.software/v1/partner/mailboxes\n```\n\n**Partner-specific endpoints:**\n\n| Method | Endpoint | Description |\n|--------|----------|-------------|\n| GET | /partner/clients | List all your clients |\n| POST | /partner/clients | Create a client account |\n| GET | /partner/clients/:id | Get client details |\n| PUT | /partner/clients/:id | Update client settings |\n| GET | /partner/billing | View wholesale billing |\n| GET | /partner/usage | Usage breakdown by client |\n\nFull partner API documentation: [docs.infrabox.software](https://docs.infrabox.software)",
    },
    {
      heading: "Whitelabel vs Direct Reselling",
      content:
        "Agencies have two options for offering email infrastructure to clients: whitelabel (branded platform) or direct reselling (managing Infrabox accounts on behalf of clients).\n\nHere is how they compare:",
      proscons: {
        pros: [
          "Full brand ownership. clients see your brand only",
          "Custom domain builds credibility and trust",
          "Higher perceived value justifies premium pricing",
          "Client lock-in through branded experience",
          "Professional appearance for enterprise clients",
          "Dedicated partner API for automation",
        ],
        cons: [
          "Requires 50+ mailbox minimum commitment",
          "You handle all client support",
          "Setup time (30 min) vs direct reselling (instant)",
          "Monthly partner fee on top of wholesale pricing",
          "You are responsible for client communication",
        ],
      },
    },
    {
      heading: "Agency Success Playbook",
      content:
        "Based on our most successful whitelabel partners, here is the playbook for building a profitable email infrastructure offering:\n\n**Phase 1: Foundation (Month 1)**\n- Set up whitelabel portal with your branding\n- Create 3 pricing tiers (starter, growth, agency)\n- Onboard your first 2-3 existing clients\n- Build internal documentation for your team\n\n**Phase 2: Growth (Month 2-3)**\n- Add infrastructure as an upsell to existing campaign management clients\n- Create a landing page for your branded infrastructure service\n- Build onboarding automation using the Partner API\n- Target agencies that need infrastructure for their clients\n\n**Phase 3: Scale (Month 4+)**\n- Automate client provisioning and billing\n- Add monitoring dashboards to your client reporting\n- Build case studies from early clients\n- Consider offering infrastructure-only plans for non-campaign clients\n\n**Pricing strategy that works:** Start at $5-6/mailbox/mo for clients. This gives you healthy margins while remaining competitive with direct Infrabox pricing. Clients pay a premium for your support, expertise, and bundled services.\n\n**The support question:** The #1 concern agencies have about whitelabel is support burden. In practice, Infrabox's automation handles 90% of infrastructure operations. The support you provide is primarily onboarding guidance and campaign strategy. which is your expertise anyway.\n\n**Use infrastructure as your downsell:** When a client cannot renew the full retainer, offer infrastructure on its own rather than letting them go. It is recurring, it requires almost none of your labor, and it keeps the relationship alive. [See how Playbook built this into a downsell tier](/case-studies/playbook-white-label-downsell-model-infrabox) and won 30% of those clients back into paid services.\n\nReady to get started? Apply at [infrabox.software/partners](/partners) or see the full whitelabel documentation at [docs.infrabox.software](https://docs.infrabox.software).",
      callout: {
        variant: "tip",
        title: "Start Small",
        text: "You do not need to migrate all clients on day one. Start with 2-3 clients to refine your workflow, then expand. Most successful partners reach profitability within the first month by converting existing clients.",
      },
    },
  ],
  faqs: [
    {
      question: "What is the minimum commitment for whitelabel?",
      answer:
        "The whitelabel program requires a minimum of 50 mailboxes under management. This can be spread across multiple clients. Contact the partner team for specific pricing at your expected volume.",
    },
    {
      question: "Can I set my own pricing for clients?",
      answer:
        "Yes. You buy at wholesale from Infrabox and set whatever retail price you want for your clients. Most partners charge $5-8 per mailbox per month, creating a 40-60% margin.",
    },
    {
      question: "Do my clients know Infrabox is behind the platform?",
      answer:
        "No. The whitelabel experience is fully branded with your logo, colors, domain, and emails. Clients interact only with your brand. Infrabox branding is completely removed.",
    },
    {
      question: "Who handles client support?",
      answer:
        "You handle all client-facing support. Infrabox provides partner-level support to you for technical issues. Infrabox's automation handles most infrastructure operations automatically.",
    },
    {
      question: "Can I use the Partner API to automate everything?",
      answer:
        "Yes. The Partner API supports full programmatic control. client creation, mailbox provisioning, DNS management, and billing. Many partners build automated onboarding flows that require zero manual intervention.",
    },
  ],
  sources: [
    { title: "Infrabox Whitelabel Documentation", url: "https://docs.infrabox.software", date: "2026" },
    { title: "Infrabox Partner API", url: "https://docs.infrabox.software", date: "2026" },
    { title: "Infrabox Branding Configuration", url: "https://docs.infrabox.software", date: "2026" },
    { title: "Infrabox Client Management", url: "https://docs.infrabox.software", date: "2026" },
    { title: "Infrabox Partner Program", url: "https://www.infrabox.software/partners", date: "2026" },
  ],
  screenshots: [
    { src: "/images/dashboard/dashboard-home.png", alt: "Infrabox whitelabel branding settings", caption: "Customize your whitelabel portal with your logo, colors, domain, and client-facing features from the partner dashboard" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "agency-workflows-guide",
    "infrabox-api-integration-guide",
    "best-email-infrastructure-agencies",
    "infrabox-pricing",
  ],
};
