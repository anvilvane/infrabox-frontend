export const article = {
  slug: "why-emails-go-to-spam",
  title: "Why Are My Emails Going to Spam? (Fix Guide)",
  metaDescription:
    "Your emails are landing in spam because of infrastructure, authentication, or content issues. Here is how to diagnose the exact cause and fix it.",
  headline:
    "Why Are My Emails Going to Spam? (Fix Guide)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-07-29",
  author: "Rahul Lakhaney",
  category: "Guides",
  readingTime: "12 min read",
  tags: [
    "emails spam",
    "email deliverability",
    "spam fix",
    "inbox placement",
    "email authentication",
  ],
  excerpt:
    "Emails land in spam because of infrastructure problems, authentication failures, content triggers, or reputation damage. Here is how to diagnose the exact cause and fix it step by step.",
  screenshots: [{ src: "/images/dashboard/email-insights.png", alt: "Infrabox email insights showing deliverability and spam metrics", caption: "Infrabox Email Insights tracking sent, received, reply rate, and bounce rate per mailbox to diagnose spam placement issues" }],  type: "educational",
  sections: [
    {
      heading: "The Three Spam Causes",
      content:
        "Emails go to spam for three categories of reasons. Here is the complete **12-cause checklist** with the fix for each:\n\n| # | Category | Cause | Fix | Priority |\n|---|----------|-------|-----|----------|\n| **1** | Infrastructure | Shared IP addresses (Mailforge, Infraforge) | Switch to real Google/Microsoft accounts. Infrabox **$2.50/mo** | Critical |\n| **2** | Infrastructure | No warmup or incomplete warmup | Complete **14-21 day** warmup before any cold outreach | Critical |\n| **3** | Infrastructure | Domain blacklisted | Check MXToolbox, request delisting, pause sending for 24-48 hours | Critical |\n| **4** | Infrastructure | Sending volume too high per mailbox | Stay at **30-40 emails/day** per mailbox maximum | High |\n| **5** | Infrastructure | New domain with zero reputation | Buy domains **2-4 weeks** before you need them; age + warmup | High |\n| **6** | Authentication | SPF record missing or misconfigured | Add correct SPF TXT record; verify with Gmail Show Original | Critical |\n| **7** | Authentication | DKIM not enabled | Enable DKIM for every sending domain. **10-15%** inbox placement impact | Critical |\n| **8** | Authentication | DMARC record missing | Add DMARC record with p=none minimum; Google/Yahoo require it | High |\n| **9** | Content | Spam trigger words in subject line | Avoid free, guaranteed, act now, limited time, click here | Medium |\n| **10** | Content | Too many links or link shorteners | Keep to **1-2 links** maximum; no bit.ly or similar shorteners | Medium |\n| **11** | Content | Heavy HTML formatting | Emails should be **plain text**. look like a real human sent them | Medium |\n| **12** | Content | No unsubscribe option | Add one-click unsubscribe. required by CAN-SPAM and Google/Yahoo | High |\n\n**Most spam issues are infrastructure-related (causes 1-5 account for ~70%).** Fix infrastructure first, content second. Infrabox eliminates causes 1, 2, 5, 6, 7, and 8 automatically.",
    },
    {
      heading: "Infrastructure Diagnosis",
      content:
        "**Check your mailbox type:** Shared IP mailboxes (Mailforge, Infraforge) have 15-25% lower inbox placement than real Google/Microsoft accounts (Infrabox, Zapmail). If you are on shared IPs, this is likely your primary issue.\n\n**Check warmup status:** Did you warm up for 14-21 days? Did you maintain warmup during campaigns? Insufficient warmup is the number one cause of spam.\n\n**Check for blacklists:** Use MXToolbox or similar tools. A blacklisted IP or domain kills deliverability instantly.\n\n**Check sending volume:** Over 50 emails/day per mailbox triggers spam filters. Stay at 30-40 for best results.\n\n**InfraGuard on Infrabox catches all infrastructure issues automatically.**",
    },
    {
      heading: "Authentication Diagnosis",
      content:
        "Send a test email to a Gmail account, open it, click three dots > \"Show Original\":\n\n- **SPF:** Should show PASS. If FAIL, your SPF record is misconfigured.\n- **DKIM:** Should show PASS. If FAIL, DKIM is not set up for your sending domain.\n- **DMARC:** Should show PASS. If FAIL, your DMARC record is missing or misaligned.\n\n**All three must pass.** One failure can send you to spam.\n\n**Infrabox sets up all three automatically** and monitors them continuously.",
    },
    {
      heading: "Content Diagnosis",
      content:
        "**Spam trigger words:** Avoid \"free,\" \"guaranteed,\" \"act now,\" \"limited time,\" \"click here\" in subject lines.\n\n**Link count:** Keep to 1-2 links maximum. No link shorteners.\n\n**HTML vs plain text:** Emails should look like regular emails. Heavy HTML formatting triggers filters.\n\n**Personalization:** Generic emails get flagged. Use merge tags for first name, company, and specific details.\n\n**Unsubscribe link:** Required by CAN-SPAM. Missing it increases spam complaints.",
    },
    {
      heading: "Fix Priority Order",
      content:
        "Follow this **7-step recovery protocol** in exact order. Do not skip steps:\n\n| Step | Action | How to Verify | Time to Impact |\n|------|--------|--------------|----------------|\n| **1** | Switch to real Google/Microsoft accounts if on shared IPs | Check your provider. Infrabox Google WS at **$2.50/mo** | Immediate (new accounts need warmup) |\n| **2** | Complete warmup for **14-21 days** before any cold outreach | Monitor open rates (**40%+** during warmup) and bounce rates (**<3%**) | 14-21 days |\n| **3** | Verify SPF, DKIM, DMARC all pass | Gmail > Show Original. all three should show **PASS** | 1-4 hours after DNS changes |\n| **4** | Enable InfraGuard monitoring | Activate in Infrabox dashboard. checks run every few hours | Immediate |\n| **5** | Run inbox placement tests before every campaign | Infrabox built-in testing. target **85%+** inbox placement | 10-15 minutes per test |\n| **6** | Clean your email list | Remove bounces, unengaged contacts, and catch-all addresses | Before every campaign |\n| **7** | Optimize content | Remove spam triggers, reduce to 1-2 links, personalize with real details | Ongoing |\n\n**Expected recovery timeline:** If you follow all 7 steps, expect inbox placement to improve from **50-60%** to **80-90%** within **3-4 weeks** for new accounts, or **1-2 weeks** for accounts with existing but damaged reputation.",
    },
    {
      heading: "Prevention Strategy",
      content:
        "**Use Infrabox** for real Google/Microsoft accounts with automatic DNS setup, isolated warmup, and InfraGuard monitoring. This prevents 90% of infrastructure-related spam issues.\n\n**Run inbox placement tests** before every major campaign. Built into Infrabox.\n\n**Monitor continuously.** Problems compound silently. InfraGuard catches issues in hours, not days.\n\n**Maintain warmup.** Even after campaigns start, keep warmup activity running to maintain reputation.",
    },
  ],
  faqs: [
    {
      question: "What is the most common reason emails go to spam?",
      answer:
        "Poor infrastructure: shared IPs, insufficient warmup, or misconfigured DNS. Fix infrastructure first, content second.",
    },
    {
      question: "How do I check if my emails are going to spam?",
      answer:
        "Use inbox placement testing (built into Infrabox) to send test emails to seed accounts and see exactly where they land.",
    },
    {
      question: "Can I recover a domain that has been flagged as spam?",
      answer:
        "Sometimes. Remove from blacklists, fix authentication, re-warm for 2-3 weeks. If severely damaged, starting with new domains is often faster.",
    },
  ],
  sources: [
    { title: "Google Email Sender Guidelines", url: "https://support.google.com/a/answer/81126", date: "2024" },
    { title: "Yahoo Sender Best Practices", url: "https://senders.yahooinc.com/best-practices/", date: "2024" },
    { title: "Spamhaus - Understanding DNS-based Blocklists", url: "https://www.spamhaus.org/faq/section/DNSBL%20Usage", date: "2026" },
    { title: "Google Postmaster Tools - Spam Rate Dashboard", url: "https://postmaster.google.com", date: "2026" },
    { title: "Infrabox InfraGuard Monitoring", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: [
    "domain-warmup-best-practices",
    "spf-record-setup-email",
    "check-domain-blacklisted",
  ],
};
