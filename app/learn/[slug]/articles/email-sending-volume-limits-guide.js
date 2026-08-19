export const article = {
  slug: "email-sending-volume-limits-guide",
  title: "Email Sending Volume Limits (2026)",
  metaDescription:
    "Google Workspace and Microsoft 365 sending limits for 2026. Daily caps, per-minute rates, new account restrictions, and safe scaling.",
  headline: "How Many Emails Can You Send Per Day? (2026 Limits)",
  publishedAt: "2026-03-31",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["sending limits", "email volume", "Google Workspace limits", "Microsoft 365 limits", "email scaling"],
  excerpt:
    "Google Workspace allows 2,000 emails/day. Microsoft 365 allows 10,000. But new accounts start much lower, and exceeding limits triggers suspensions. Here are the exact numbers from Google and Microsoft's documentation.",
  type: "educational",
  screenshots: [
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox mailboxes showing 858 active mailboxes across Google and Microsoft", caption: "Infrabox manages 858 active mailboxes across Google Workspace and Microsoft 365, distributing volume safely across accounts." },
  ],
  sections: [
    {
      heading: "Official Sending Limits",
      content:
        "These are the documented limits from Google and Microsoft. Not estimates. official numbers from their support documentation.\n\n| Limit | Google Workspace | Microsoft 365 | Source |\n|-------|-----------------|---------------|--------|\n| **Daily sending limit** | 2,000 emails | 10,000 emails | support.google.com/a/answer/166852 / learn.microsoft.com |\n| Per-minute rate | ~20 emails/min | ~30 emails/min | Observed, not documented |\n| Recipients per message | 2,000 | 500 | Official docs |\n| New account (first 24h) | 150-500 emails | 500-1,000 | Observed |\n| New account (first week) | 500-1,000 | 2,000-5,000 | Observed |\n| After warmup (30+ days) | 2,000 | 10,000 | Official maximum |\n\n**Source:** Google Workspace Admin Help (support.google.com/a/answer/166852) and Microsoft 365 Exchange Online limits (learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits).\n\n**Critical caveat:** These are *maximum* limits, not recommended sending volumes. Sending at maximum capacity on a new account will trigger suspensions. The safe range for email is 30-50 emails per mailbox per day after proper warmup.",
    },
    {
      heading: "Safe Sending Volumes for Email",
      content:
        "The official limits are theoretical maximums. For email, you need much lower volumes to maintain deliverability:\n\n| Warmup Stage | Day | Safe Volume/Mailbox | Risk at This Volume | Mailboxes for 1,000/day |\n|-------------|-----|--------------------|--------------------|------------------------|\n| Fresh (no warmup) | 0 | 0 | Suspension likely | Don't send |\n| Week 1 | 1-7 | 5-10/day | Low | 100-200 |\n| Week 2 | 8-14 | 15-25/day | Low | 40-67 |\n| Week 3 | 15-21 | 25-40/day | Low-Medium | 25-40 |\n| Warmed (30+ days) | 30+ | 30-50/day | Low | 20-34 |\n| Aggressive | 30+ | 50-80/day | Medium | 13-20 |\n| Maximum (risky) | 30+ | 80-100/day | High | 10-13 |\n\n**The math for scaling:**\nTo send 1,000 emails/day safely at 30/mailbox:\n- Mailboxes needed: 34 (1,000 ÷ 30)\n- Domains needed: 12 (3 mailboxes per domain)\n- Monthly cost on Infrabox: 34 × $2.50 = **$101.66/mo** (Google Workspace)\n\nTo send 5,000/day:\n- Mailboxes: 167\n- Domains: 56\n- Monthly cost: 167 × $2.50 = **$499.33/mo**\n\n**Source:** These safe volumes are based on Infrabox's data across 10,000+ mailboxes and align with recommendations from Instantly, SmartLead, and Woodpecker documentation.",
    },
    {
      heading: "What Happens When You Exceed Limits",
      content:
        "Google and Microsoft handle limit violations differently:\n\n| Violation | Google Workspace | Microsoft 365 |\n|-----------|-----------------|---------------|\n| Exceed daily limit | 24-hour sending block | Sending restricted |\n| Exceed per-minute rate | Temporary throttle | Rate limiting |\n| High bounce rate (>5%) | Account suspension review | Account restriction |\n| High spam complaints | Account suspension | Account restriction |\n| Sending from new account | Progressive limit enforcement | Soft limits first week |\n| Repeated violations | **Account termination** | **Account termination** |\n\n**Google is stricter.** Google suspensions can be permanent with no appeal for bulk sending violations. Microsoft tends to restrict first and terminate only for repeat offenders.\n\n**Source:** Google Workspace Terms of Service Section 4 (workspace.google.com/terms) and Microsoft 365 Acceptable Use Policy.\n\n**Infrabox protection:** We distribute sending across multiple isolated workspaces. Each domain has its own admin panel, preventing one account's issues from affecting others. The domains page shows NS status and mailbox counts per domain to help you manage distribution.",
    },
    {
      heading: "Scaling Strategy: Mailboxes × Volume = Total Sends",
      content:
        "The formula for safe email scaling:\n\n**Total daily sends = Number of mailboxes × Safe volume per mailbox**\n\n| Target Volume | Mailboxes (30/day) | Domains (3/domain) | Google Cost | Microsoft Cost | Mixed (70/30) |\n|--------------|-------------------|-------------------|------------|---------------|---------------|\n| 100/day | 4 | 2 | $11.96/mo | $11.96/mo | $11.96/mo |\n| 500/day | 17 | 6 | $50.83/mo | $50.83/mo | $50.83/mo |\n| 1,000/day | 34 | 12 | $101.66/mo | $101.66/mo | $101.66/mo |\n| 2,500/day | 84 | 28 | $251.16/mo | $251.16/mo | $251.16/mo |\n| 5,000/day | 167 | 56 | $499.33/mo | $499.33/mo | $499.33/mo |\n| 10,000/day | 334 | 112 | $998.66/mo | $998.66/mo | $998.66/mo |\n\n**Mixed cost calculation:** 70% Google ($2.50) + 30% Microsoft ($2.50) = weighted average $2.50/mailbox.\n\n**Why mix Google and Microsoft?** Provider diversity improves deliverability. If your prospects use Gmail, sending from Google Workspace has slightly better inbox placement (same-provider trust). Same logic applies to Microsoft. A 70/30 mix covers both.\n\n**Source:** Infrabox pricing (infrabox.software). Google Workspace $2.50/mo, Microsoft 365 $2.50/mo. No platform fee, no minimum.",
    },
  ],
  faqs: [
    { question: "What is the daily sending limit for Google Workspace?", answer: "2,000 emails per day per account (source: support.google.com/a/answer/166852). New accounts start lower at 150-500 and ramp up over 2-4 weeks." },
    { question: "Can I send 10,000 emails per day from one Microsoft 365 account?", answer: "Technically the limit is 10,000, but sending that volume from one account will trigger restrictions. Safe email volume is 30-50 per mailbox per day. Use 200-334 mailboxes for 10,000/day." },
    { question: "How many mailboxes do I need for 1,000 emails per day?", answer: "About 34 mailboxes at 30 emails/day each. On Infrabox Google Workspace, that costs $101.66/mo (34 × $2.50). You'd need approximately 12 domains (3 mailboxes per domain)." },
    { question: "What happens if Google suspends my account?", answer: "Google Workspace suspensions for bulk sending can be permanent. The account may be terminated with no appeal. This is why distributing volume across many mailboxes and using proper warmup is critical." },
    { question: "Should I use Google Workspace or Microsoft 365 for email?", answer: "Both work well. Google has stricter enforcement but higher trust from Gmail recipients. Microsoft has higher limits but stricter initial throttling. Best practice: use both (70/30 mix) for provider diversity." },
  ],
  sources: [
    { title: "Google Workspace Sending Limits", url: "https://support.google.com/a/answer/166852", date: "2026" },
    { title: "Microsoft 365 Exchange Online Limits", url: "https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits", date: "2026" },
    { title: "M3AAWG Sender Best Practices", url: "https://www.m3aawg.org/sites/default/files/m3aawg_senders_bcp_ver3-2015-02.pdf", date: "2015" },
    { title: "Infrabox Warmup Documentation", url: "https://www.infrabox.software/resources/tools", date: "2026" },
  ],
  relatedSlugs: ["email-sending-limits-google-microsoft", "scale-email-100-to-10000", "how-many-domains-email"],
};
