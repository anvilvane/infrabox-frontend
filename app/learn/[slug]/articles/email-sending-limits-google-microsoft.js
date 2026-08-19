export const article = {
  slug: "email-sending-limits-google-microsoft",
  title: "Email Sending Limits: Google vs Microsoft (2026)",
  metaDescription:
    "Google Workspace and Microsoft 365 email sending limits explained. Daily caps, per-minute limits, and practical recommendations for email outreach.",
  headline:
    "Email Sending Limits: Google Workspace vs Microsoft 365",
  publishedAt: "2026-03-30",
  updatedAt: "2026-03-30",
  author: "Rahul Lakhaney",
  category: "Educational",
  readingTime: "8 min read",
  tags: [
    "email sending limits",
    "google workspace limits",
    "microsoft 365 limits",
    "email",
    "deliverability",
  ],
  excerpt:
    "Google Workspace allows 2,000 emails/day. Microsoft 365 allows 10,000/day. But for email, the practical limit is 30-50/day per mailbox to maintain deliverability.",
  screenshots: [{ src: "/images/dashboard/email-insights.png", alt: "Infrabox email insights monitoring sending volume across providers", caption: "Infrabox Email Insights tracking per-mailbox sending volume, helping teams stay within Google Workspace and Microsoft 365 limits" }],  type: "educational",
  sections: [
    {
      heading: "Google Workspace Sending Limits",
      content:
        "Here is the side-by-side comparison of every sending limit:\n\n| Limit | Google Workspace | Microsoft 365 |\n| --- | --- | --- |\n| Daily send | 2,000/24 hrs | 10,000/24 hrs |\n| Per minute | ~20/min | ~30/min |\n| Recipients/message | 2,000 | 500 |\n| New account limit | 500/day first 2-4 weeks | Full limits day one |\n| Overage consequence | 24-hr suspension | Queued and delayed |\n| Recovery time | 24-48 hours | 12-24 hours |\n\nMicrosoft has 5x the daily limit, but for email you should never exceed 50/day per mailbox on either provider.",
    },
    {
      heading: "What Happens When You Exceed Limits",
      content:
        "The consequences differ by provider:\n\n| Event | Google Workspace | Microsoft 365 |\n| --- | --- | --- |\n| First overage | 24-hr sending suspension | Emails queued and delayed |\n| Second overage (within 30 days) | 48-72 hr suspension | Temporary sending block |\n| Repeated violations | Account restrictions possible | Sending caps reduced |\n| Reputation impact | Immediate inbox placement drop | Gradual throttling increase |\n| Recovery time | 1-2 weeks full recovery | 3-7 days full recovery |\n\n**The reputation damage is harder to fix than the limit itself.** Even staying under provider limits, high volume per mailbox signals to receiving servers that you might be a spammer.",
    },
    {
      heading: "Practical Limits for Email",
      content:
        "**Ignore the provider limits. Focus on deliverability limits.** The provider limit is a ceiling, not a target.\n\n| Scenario | Emails/Day/Mailbox | Risk Level | Notes |\n| --- | --- | --- | --- |\n| Warmup (day 1-7) | 5-25 | None | Building reputation |\n| Warmup (day 8-21) | 25-45 | None | If engagement is healthy |\n| Campaign (sweet spot) | 30-40 | Low | Recommended range |\n| Campaign (pushing it) | 40-50 | Medium | Monitor closely |\n| Overloaded | 50-100 | High | Reputation degradation starts |\n| Dangerous | 100+ | Severe | Suspension likely |\n\n**The safe maximum is 40 emails/day per mailbox.** To send 500 emails/day, use 12-15 mailboxes at 35-40 each. Scaling horizontally (more mailboxes) always beats scaling vertically (more emails per mailbox).",
    },
    {
      heading: "Scaling Volume with Infrabox",
      content:
        "Instead of pushing individual mailboxes to their limits, scale by adding more mailboxes:\n\n- **100 emails/day:** 3 mailboxes at 35/day\n- **500 emails/day:** 13 mailboxes at 40/day\n- **1,000 emails/day:** 25 mailboxes at 40/day\n- **5,000 emails/day:** 125 mailboxes at 40/day\n\nWith Infrabox at $2.50/mo per Google mailbox, 25 mailboxes for 1,000 emails/day costs just $62.50/month.\n\n| Daily Volume | Mailboxes | Cost/mo |\n| --- | --- | --- |\n| 100 | 3 | $7.50 |\n| 500 | 13 | $32.50 |\n| 1,000 | 25 | $62.50 |\n| 5,000 | 125 | $312 |\n| 10,000 | 250 | $625 |",
      callout: {
        variant: "tip",
        title: "Mix Providers for Diversity",
        text: "Combine Google Workspace and Microsoft 365 mailboxes for provider diversity. Infrabox plans from $39/mo support both. If Google throttles, your Microsoft accounts keep sending. Infrabox is the only provider offering both from one dashboard.",
      },
    },
    {
      heading: "New Account Restrictions and Warmup Requirements",
      content:
        "Both Google and Microsoft impose stricter limits on new accounts.\n\n**Google Workspace new account limits:**\n- First 2-4 weeks: 500 emails/day (vs 2,000 for established accounts)\n- Google monitors engagement during this period\n- Low engagement or complaints can extend the restricted period\n\n**Microsoft 365 new account behavior:**\n- No explicit reduced limits documented, but deliverability is lower\n- New accounts sending aggressively trigger rate limiting faster\n\n**Warmup schedule aligned with provider limits:**\n\n| Day | Google (new acct limit: 500) | Microsoft (full limits) | Recommended Cold Volume |\n| --- | --- | --- | --- |\n| 1-3 | 5-10 warmup only | 5-10 warmup only | 0 emails |\n| 4-7 | 15-25 warmup | 15-25 warmup | 0-5 emails |\n| 8-14 | 25-40 mixed | 25-40 mixed | 10-20 emails |\n| 15-21 | 30-45 mixed | 30-45 mixed | 20-35 emails |\n| 22+ | 35-50 campaign | 35-50 campaign | 30-40 emails |\n\nInfrabox's warmup system manages this ramp-up automatically. See [Infrabox warmup docs](https://docs.infrabox.software) for details.\n\nSource: [Google Workspace sending limits](https://support.google.com/a/answer/166852), [Microsoft 365 Exchange Online limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits)",
    },
    {
      heading: "Rate Limiting vs Sending Limits",
      content:
        "**Sending limits** control how many you can send. **Rate limiting** controls how fast. Both matter.\n\n| Concept | Google Workspace | Microsoft 365 | Why It Matters |\n| --- | --- | --- | --- |\n| **Daily limit** | 2,000/24h | 10,000/24h | Hard ceiling on total volume |\n| **Per-minute rate** | ~20/min | ~30/min | Speed of delivery |\n| **Burst tolerance** | Low | Medium | Rapid sending triggers flags |\n\nEven if you stay under daily limits, sending 200 emails in 5 minutes looks automated. ISPs track sending patterns and flag burst behavior.\n\n**Safe sending pattern:**\n- Space emails 60-90 seconds apart\n- Send during 8am-6pm in recipient's timezone\n- Randomize send times slightly\n- Vary content with personalization\n\nMost sequencers (Instantly, SmartLead, etc.) handle send spacing automatically. Infrabox integrates with 24+ sequencers. See [Infrabox integrations](https://docs.infrabox.software).",
    },
  ],
  sources: [
    { title: "Google Workspace Sending Limits", url: "https://support.google.com/a/answer/166852", date: "2026" },
    { title: "Microsoft 365 Exchange Online Limits", url: "https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits", date: "2026" },
    { title: "Google Email Sender Guidelines", url: "https://support.google.com/a/answer/81126", date: "2024" },
    { title: "M3AAWG Sending Best Practices", url: "https://www.m3aawg.org/sites/default/files/m3aawg_senders_bcp_ver3-2015-02.pdf", date: "2015" },
    { title: "Infrabox Warmup Documentation", url: "https://docs.infrabox.software", date: "2026" },
  ],
  faqs: [
    {
      question: "How many emails can I send per day per mailbox?",
      answer:
        "30-50 maximum for consistent deliverability. 40/day is the sweet spot. Scale by adding more mailboxes, not by increasing per-mailbox volume.",
    },
    {
      question: "Does Google or Microsoft have higher sending limits?",
      answer:
        "Microsoft 365 has a higher daily limit (10,000 vs 2,000) but for email the practical limit is the same: 30-50/day per mailbox.",
    },
    {
      question: "How do I scale to 1,000+ emails per day?",
      answer:
        "Add more mailboxes. 25 mailboxes at 40/day = 1,000/day. Infrabox Agency plan at $99/mo for 30 mailboxes makes this affordable.",
    },
    {
      question: "What happens if I exceed Google Workspace sending limits?",
      answer:
        "Google suspends sending for 24 hours on first offense, 48-72 hours on second offense within 30 days. Recovery takes 1-2 weeks for full reputation restoration. The suspension itself causes reputational damage beyond just the downtime.",
    },
    {
      question: "Should I use Google or Microsoft for higher volume?",
      answer:
        "Use both. Google Workspace has better Gmail deliverability, Microsoft 365 has better Outlook deliverability. Infrabox plans support both providers (from $39/mo). Provider diversity improves overall inbox placement.",
    },
  ],
  relatedSlugs: [
    "google-workspace-vs-microsoft-365-email",
    "scale-email-100-to-10000",
    "how-many-domains-email",
  ],
};
