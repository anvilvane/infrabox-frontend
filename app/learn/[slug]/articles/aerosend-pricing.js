export const article = {
  "slug": "aerosend-pricing",
  "title": "AeroSend Pricing (2026)",
  "metaDescription": "Full AeroSend pricing breakdown for 2026: the $4/inbox (first 150) then $2/inbox model, batches of 30, the bundled warmup and monitoring, and the real all-in math.",
  "headline": "AeroSend Pricing 2026: Per-Inbox Cost, What's Included & Real Math",
  "publishedAt": "2026-06-06",
  "updatedAt": "2026-06-06",
  "author": "Mohit Mimani",
  "category": "Pricing",
  "readingTime": "9 min read",
  "tags": [
    "aerosend pricing",
    "private email infrastructure",
    "aerosend review",
    "email infrastructure pricing",
    "infrabox"
  ],
  "excerpt": "AeroSend sells private email infrastructure priced per inbox: $4/inbox for your first 150 inboxes, then $2/inbox for every inbox after that, sold in batches of 30 with a 30-inbox minimum. Each batch of 30 is a fully isolated pod of 10 domains on dedicated aged IPs — and unusually, the price includes managed warmup, biweekly inbox placement tests, burn detection, and 24/7 monitoring with no add-ons. This guide breaks down AeroSend pricing in 2026 and the real all-in cost.",
  "screenshots": [
    {
      "src": "/images/compare/aerosend-pricing.png",
      "alt": "AeroSend pricing page showing per-inbox pricing starting at $2/month",
      "caption": "AeroSend's per-inbox pricing: $4/inbox for the first 150 inboxes, then $2/inbox after (50% less) — minimum 30 inboxes, sold in batches of 30, with dedicated IPs, managed warmup, and biweekly inbox placement tests included."
    }
  ],
  "type": "pricing-teardown",
  "sections": [
    {
      "heading": "Quick summary (TL;DR)",
      "content": "AeroSend prices **per inbox**: **$4/inbox/month for your first 150 inboxes, then $2/inbox/month for every inbox after 150**. Orders have a **30-inbox minimum and are sold in batches of 30** ($120 per batch for the first 150, $60 per batch above 150). Each batch of 30 is an isolated pod — **10 domains, 3 mailboxes per domain, on dedicated aged IPs** — handling roughly **12,000–15,000 emails/month**. Every order includes the full managed stack at no extra cost: **managed (ESP-tailored) warmup, biweekly inbox placement tests, 5-metric burn detection, 24/7 monitoring, proactive IP rotation, free domain replacement, and a deliverability guarantee.** Domains are bring-your-own (~$10–12/year each). It's private SMTP infrastructure (aged IPs), not Google/Microsoft accounts, with a ~3-week ramp to full sending. The standout: warmup and monitoring are bundled into the per-inbox price rather than sold as add-ons, and the blended rate falls toward $2/inbox as you scale."
    },
    {
      "heading": "How AeroSend pricing works",
      "content": "AeroSend's model is per-inbox and all-inclusive:\n\n- **Two-band per-inbox pricing.** Your first 150 inboxes are $4/inbox/month; every inbox after 150 is $2/inbox/month. The discount applies automatically as you cross 150 — there are no named tiers to choose.\n- **Sold in batches of 30, 30-inbox minimum.** Capacity is purchased in 30-inbox blocks ($120/batch below 150, $60/batch above 150). Each block of 30 is an isolated pod of 10 domains (3 mailboxes/domain) on its own aged, pre-warmed dedicated IPs — fully isolated from other customers.\n- **Everything is included.** Warmup, biweekly inbox placement tests, burn detection, 24/7 monitoring, IP rotation, and reporting come with every order — \"no add-ons, no hidden fees.\"\n- **Private SMTP, not Google/Microsoft.** AeroSend is purpose-built SMTP infrastructure with aged IPs; you connect the mailboxes to your sequencer (Smartlead, Instantly, lemlist, etc.) via CSV/IMAP/SMTP.\n\nThere are no contracts, you can cancel anytime, and AeroSend offers a deliverability guarantee (it will outperform your current infrastructure)."
    },
    {
      "heading": "AeroSend pricing at a glance",
      "content": "| Band | Price | Per batch of 30 | Notes |\n|---|---|---|---|\n| First 150 inboxes | $4/inbox/mo | $120 | 30-inbox minimum to start |\n| Every inbox after 150 | $2/inbox/mo | $60 | Discount applies automatically |\n\nExample configurations (exactly as AeroSend states them):\n\n| Setup | Inboxes | Monthly cost | Effective per inbox | Approx. volume |\n|---|---|---|---|---|\n| Small team | 30 | 30 × $4 = **$120** | $4.00 | ~12–15k emails/mo |\n| Growing agency | 300 | 150 × $4 + 150 × $2 = **$900** | $3.00 | ~120–150k emails/mo |\n| High volume | 900 | 150 × $4 + 750 × $2 = **$2,100** | $2.33 | ~360–450k emails/mo |\n\nEach batch of 30 inboxes = 10 domains (3 mailboxes/domain). Rates are from the [AeroSend pricing page](https://www.aerosend.io/pricing). The more you scale past 150, the closer your blended rate gets to $2/inbox."
    },
    {
      "heading": "What you actually get",
      "content": "Every AeroSend order is a complete, isolated, managed sending environment:\n\n- **Dedicated, aged, pre-warmed IPs** — 100% isolated, your reputation alone, with each batch of 10 domains on its own pod.\n- **3 mailboxes per domain**, auto SPF/DKIM/DMARC.\n- **Managed warmup, tailored to your ESP** (Smartlead/Instantly/lemlist behave differently).\n- **Biweekly inbox placement tests** across Gmail, Outlook, Yahoo.\n- **5-metric burn detection** with domain health scoring (0–100) to catch problems early.\n- **24/7 monitoring + intervention**, proactive IP rotation, and monthly performance reports.\n- **Free domain replacement** (you buy the ~$10–12 domain; AeroSend re-provisions free).\n- **Founder-led support** and a client portal with full visibility.\n\nThe notable part: warmup *and* monitoring are bundled — you're not paying separately for a warmup tool or a monitoring suite."
    },
    {
      "heading": "The real all-in cost",
      "content": "AeroSend bundles most things, so the real cost is close to the inbox price plus domains:\n\n- **Starter (30 inboxes):** $120/month + 10 domains (~$10/month amortized at ~$12/year) = **~$130/month** for 30 mailboxes (~$4.33/mailbox all-in).\n- **Plus a sequencer:** AeroSend is infrastructure only; budget ~$99/month for Smartlead or Instantly.\n- **A realistic full stack:** sequencer (~$99) + domains (~$10) + AeroSend (30 inboxes, $120) + lead data (~$30) + AI tools (~$10) = **~$269/month** for ~12–15k emails/month, with infrastructure roughly 45% of the total.\n- **At scale:** 300 inboxes = $900/month (~$3.00/inbox); 900 inboxes = $2,100/month (~$2.33/inbox).\n\nBecause warmup and monitoring are included, there are genuinely few surprise line items — the main extras are domains and your sequencer."
    },
    {
      "heading": "Hidden costs and gotchas",
      "content": "Five things to weigh:\n\n1. **It's private SMTP, not Google/Microsoft.** AeroSend uses aged dedicated IPs on its own servers. Excellent isolation and control, but a different deliverability profile than official Google/Microsoft accounts, and some audiences/filters favor established Google/Microsoft domains.\n2. **~3-week ramp to full capacity.** Domain provisioning is 24–48h, but managed warmup runs about 21 days — so plan ~3 weeks before full sending.\n3. **Bought in 30-inbox blocks.** You buy capacity in 30-mailbox batches; smaller needs still buy a full 30-inbox block (the minimum).\n4. **Conservative send limits.** Roughly 20–25 emails/mailbox/day — generous vs some, but still means more mailboxes for high volume.\n5. **Domains are bring-your-own.** ~$10–12/domain/year on top of the inbox fee (though replacement after a burn is free)."
    },
    {
      "heading": "How AeroSend pricing compares",
      "content": "| Provider | Model | Per-mailbox/mo | Mailbox type | Warmup + monitoring | Best for |\n|---|---|---|---|---|---|\n| AeroSend | Per inbox ($4 first 150, $2 after) | $2.00–$4.00 (by volume) | Private SMTP (aged IPs) | Both bundled | Managed private infra with monitoring included |\n| Infrabox | Plan + mailbox slots | $2.50–$3.50 | Official Google / Microsoft 365 / Azure | Warmup $3/mbx + InfraGuard add-on | Official inboxes, faster setup, API/Azure |\n| MailReef | $249/server + $0.001/send | ~$1.66–$8 (by fill) | Premium SMTP (dedicated) | Monitoring incl., per-send fee | High-volume dedicated-server senders |\n| Mailscale / Mailbloom | Flat per server (quote) | Flat | Proprietary SMTP | Monitoring incl. | Dedicated-IP senders at volume |\n\nThe honest positioning: AeroSend is one of the more complete managed private-infrastructure products — bundling ESP-tailored warmup, biweekly placement tests, 5-metric burn detection, and 24/7 monitoring into the per-inbox price is genuinely strong value, and the isolation (dedicated aged IPs per 10-domain pod) plus deliverability guarantee back it up. The trade-off is that it's private SMTP with aged IPs rather than official Google/Microsoft accounts, and there's a ~3-week ramp. [Infrabox](https://infrabox.software/) takes the official-account route: Google Workspace, Microsoft 365, and Azure mailboxes at $2.50–$3.50/mailbox with much faster setup (10 minutes to 2 hours), US-IP infrastructure, per-domain admin panels, and a full API. The key difference in *what's bundled*: AeroSend includes warmup and monitoring in its rate, while Infrabox prices warmup ($3/mailbox) and InfraGuard monitoring as add-ons — so compare AeroSend's $2–$4 all-in (by volume) against Infrabox's base rate *plus* the add-ons you want, weighed against Infrabox's official accounts, Azure option, and faster ramp."
    },
    {
      "heading": "Who AeroSend is best for at this price",
      "content": "AeroSend makes sense for **agencies and high-volume senders who want a fully-managed private SMTP setup with monitoring and warmup included** — and who value isolation (dedicated aged IPs) and a deliverability guarantee over running official Google/Microsoft accounts. If you want one all-inclusive per-inbox price that covers warmup, burn detection, and 24/7 monitoring, AeroSend's bundle is hard to assemble more cheaply piece by piece — and because the rate drops to $2/inbox above 150, it gets more attractive the more you scale. It's especially strong for teams that have been burned on shared infrastructure and want hands-off reliability."
    },
    {
      "heading": "Who should consider an alternative",
      "content": "AeroSend is harder to justify when:\n\n- **You want official Google/Microsoft accounts.** AeroSend is private SMTP with aged IPs. For official Google Workspace, Microsoft 365, or Azure mailboxes, see [Infrabox](https://infrabox.software/).\n- **You need to send fast.** The ~3-week managed-warmup ramp delays full sending; official-account providers can be live much sooner.\n- **You only need a handful of mailboxes.** The 30-inbox minimum means very small needs still buy a full block.\n- **You want à la carte control.** AeroSend bundles everything; if you'd rather pay only for the mailboxes and add warmup/monitoring selectively, a per-mailbox provider with add-ons fits better."
    },
    {
      "heading": "Final verdict",
      "content": "AeroSend is a strong, all-inclusive managed private-infrastructure product. Per-inbox pricing ($4/inbox for the first 150, then $2/inbox above 150, sold in batches of 30) is fair given everything bundled — aged dedicated IPs, ESP-tailored warmup, biweekly placement tests, 5-metric burn detection, and 24/7 monitoring with no add-ons. For agencies that want isolation, hands-off reliability, and a deliverability guarantee, it's a compelling package, and the blended rate falling toward $2/inbox at scale makes the high-volume math genuinely good.\n\nThe trade-offs are the infrastructure type and ramp: these are private SMTP aged-IP mailboxes rather than official Google/Microsoft accounts, and full sending takes ~3 weeks. If you'd prefer official Google, Microsoft 365, and Azure mailboxes with faster setup, US IPs, per-domain admin panels, and a full API — choosing warmup and InfraGuard monitoring as add-ons rather than a fixed bundle — [see how Infrabox compares](https://infrabox.software/)."
    }
  ],
  "faqs": [
    {
      "question": "How much does AeroSend cost?",
      "answer": "AeroSend is priced per inbox: $4/inbox/month for your first 150 inboxes, then $2/inbox/month for every inbox after 150. There's a 30-inbox minimum and orders are sold in batches of 30 ($120 per batch below 150, $60 per batch above). For example, 30 inboxes is $120/month, 300 inboxes is $900/month, and 900 inboxes is $2,100/month. Domains are bring-your-own at ~$10–12/year. Warmup, monitoring, burn detection, and inbox placement tests are included."
    },
    {
      "question": "What's included with AeroSend inboxes?",
      "answer": "Every order includes aged dedicated IPs, isolated pods of 10 domains (3 mailboxes per domain), automated SPF/DKIM/DMARC, ESP-tailored managed warmup, biweekly inbox placement tests, 5-metric burn detection, 24/7 monitoring, proactive IP rotation, free domain replacement, and monthly reports — with no separate add-on fees."
    },
    {
      "question": "Are AeroSend mailboxes Google or Microsoft accounts?",
      "answer": "No. AeroSend is private SMTP infrastructure with aged, pre-warmed dedicated IPs on its own servers. You connect the mailboxes to a sequencer (Smartlead, Instantly, lemlist, etc.) via CSV/IMAP/SMTP."
    },
    {
      "question": "How many emails can I send with AeroSend?",
      "answer": "Roughly 20–25 emails per mailbox per day. A 30-inbox batch handles approximately 600–750 emails/day, or 12,000–15,000 per month over a typical working month."
    },
    {
      "question": "Does AeroSend include warmup and monitoring?",
      "answer": "Yes — and that's a key differentiator. Managed ESP-tailored warmup, biweekly inbox placement tests, 5-metric burn detection, and 24/7 monitoring are all included in the per-inbox price with no add-ons."
    },
    {
      "question": "How long until AeroSend is fully sending?",
      "answer": "Domain provisioning takes 24–48 hours, but managed warmup runs about 21 days, so plan roughly 3 weeks from purchase to full sending capacity."
    }
  ],
  "sources": [
    {
      "title": "AeroSend Official Pricing",
      "url": "https://www.aerosend.io/pricing",
      "date": "2026"
    },
    {
      "title": "Infrabox Pricing",
      "url": "https://www.infrabox.software/#pricing",
      "date": "2026"
    }
  ],
  "relatedSlugs": [
    "aerosend-review",
    "infrabox-pricing",
    "cheapest-email-infrastructure-2026"
  ]
};
