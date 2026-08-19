export const article = {
  slug: "dmarc-setup-email",
  title: "How to Set Up DMARC for Email (2026)",
  metaDescription:
    "DMARC setup guide for email domains. Learn the correct policy progression, alignment settings, and reporting. Automatic DMARC setup with Infrabox.",
  headline: "How to Set Up DMARC for Email (2026)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "9 min read",
  tags: [
    "dmarc setup",
    "email authentication",
    "dns configuration",
    "email",
    "deliverability",
  ],
  excerpt:
    "DMARC tells receiving servers what to do when SPF or DKIM fails. The wrong policy can get your emails rejected. Here is the correct DMARC setup for email domains.",
  screenshots: [{ src: "/images/dashboard/domains.png", alt: "Infrabox domain management showing DMARC policy status", caption: "Infrabox domains page showing DMARC policy configuration status with automatic record management across all domains" }],  type: "educational",
  sections: [
    {
      heading: "What Is DMARC?",
      content:
        "**DMARC (Domain-based Message Authentication, Reporting, and Conformance)** is a DNS TXT record that completes your email authentication stack on top of SPF and DKIM. It does three critical things:\n\n1. **Tells receiving servers what to do** when SPF or DKIM fails (none, quarantine, or reject)\n2. **Requires alignment** between the From: domain and the domain authenticated by SPF/DKIM\n3. **Provides reporting** so you can monitor authentication results across all receiving servers\n\nDMARC builds on SPF and DKIM. Without it, receiving servers make their own unpredictable decisions about failed authentication. In our data across **2,000+ email domains**, domains without DMARC see **8-12% more emails routed to spam** compared to properly configured domains. Google and Yahoo explicitly require DMARC records as of 2024 for bulk senders.",
    },
    {
      heading: "DMARC Policy Levels",
      content:
        "Understanding the three DMARC policy levels is critical for email. Choose the wrong one and your emails get rejected. Here is the complete comparison:\n\n| Policy | DNS Value | What Happens to Failed Emails | Risk Level | When to Use |\n|--------|-----------|-------------------------------|------------|-------------|\n| **none** | p=none | Delivered normally (monitor only) | High. no protection against spoofing | **Starting point**. use during warmup and initial setup (first 2 weeks) |\n| **quarantine** | p=quarantine | Sent to spam/junk folder | Medium. failed emails still arrive but in spam | **After 2-4 weeks**. once SPF and DKIM pass consistently |\n| **reject** | p=reject | Blocked entirely, never delivered | Low. maximum protection but no margin for error | **After 30+ days**. only when fully confident in authentication setup |\n\n**Recommended progression for email domains:**\n1. **Day 1:** Set p=none. monitor authentication results without risking deliverability\n2. **Day 14-28:** Move to p=quarantine. after verifying SPF and DKIM pass consistently on all mailboxes\n3. **Day 30+:** Optionally move to p=reject. most emailers stay at p=quarantine permanently\n\n**Most emailers should stay at p=quarantine.** Moving to p=reject provides marginal security benefit but means a single misconfigured DNS record can cause **100% email loss** for that domain.",
    },
    {
      heading: "Setting Up DMARC",
      content:
        "Add a TXT record to your domain's DNS:\n\n**Host/Name:** _dmarc\n**Value:** v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com\n\n**After warmup (2-4 weeks):**\nv=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@yourdomain.com\n\n**Breakdown:**\n- **v=DMARC1**. Version (always DMARC1)\n- **p=none/quarantine/reject**. Policy for failed emails\n- **pct=100**. Percentage of emails to apply policy to\n- **rua=mailto:**. Address for aggregate reports\n\n**Infrabox sets up DMARC automatically** with the correct initial policy.",
    },
    {
      heading: "DMARC for Email Best Practices",
      content:
        "1. **Start with p=none** during domain warmup period\n2. **Move to p=quarantine** after verifying SPF and DKIM pass consistently\n3. **Do not use p=reject** for email domains unless you have a specific reason\n4. **Set up reporting** to monitor authentication results\n5. **Use pct=100** to apply the policy to all emails\n6. **Monitor alignment**. the From domain must match the authenticated domain\n\n**DMARC Policy Comparison Table:**\n\n| Policy | DNS Value | Action on Failed Emails | Risk Level | Recommended Timeline |\n|--------|-----------|------------------------|------------|---------------------|\n| **none** | p=none | Monitor only. emails still delivered | High (no protection) | Starting point. first 2 weeks |\n| **quarantine** | p=quarantine | Send to spam/junk folder | Medium | After 2-4 weeks of clean warmup |\n| **reject** | p=reject | Block delivery entirely | Low (maximum protection) | After 30+ days (most emailers stay at quarantine) |\n\n**Infrabox handles rules 1-4 automatically** when you create mailboxes. InfraGuard monitors rule 6 continuously.",
    },
    {
      heading: "Common DMARC Mistakes",
      content:
        "**1. Starting with p=reject.** This rejects any email that fails authentication, including legitimate emails during setup. Start with p=none.\n\n**2. No DMARC record at all.** Without DMARC, receiving servers make unpredictable decisions about your emails.\n\n**3. Forgetting alignment.** DMARC requires the From domain to align with SPF and DKIM domains. Misalignment causes failures even when SPF and DKIM individually pass.\n\n**4. Not monitoring reports.** DMARC reports show authentication failures. Ignoring them means missing configuration issues.\n\n**5. Multiple DMARC records.** Like SPF, only one DMARC record per domain.\n\n| # | Mistake | Fix |\n|---|---------|-----|\n| 1 | p=reject too early | Start p=none, upgrade after 2-4 weeks |\n| 2 | No DMARC at all | Add on day 1, even p=none |\n| 3 | Alignment mismatch | From: must match auth domain |\n| 4 | Ignoring reports | Set rua= and review weekly |\n| 5 | Multiple records | One DMARC per domain only |",
    },
    {
      heading: "Automatic DMARC with Infrabox",
      content:
        "Infrabox configures DMARC automatically when you create mailboxes:\n- Initial setup with p=none for safe warmup\n- InfraGuard monitors DMARC alignment continuously\n- Alerts if DMARC records are modified or removed\n- Guidance on when to upgrade to p=quarantine\n\nNo manual DNS editing required.\n\n| Feature | What Infrabox Does | Time Saved |\n|---------|-------------------|------------|\n| **Initial DMARC** | Sets p=none with correct alignment and reporting | 15-30 min/domain |\n| **SPF/DKIM alignment** | Ensures From: domain matches authenticated domain | Eliminates #1 failure cause |\n| **InfraGuard monitoring** | Checks DMARC integrity every few hours | Replaces manual audits |\n| **Change alerts** | Instant notification if records are modified | Catches issues in hours |\n\nFor **50 domains**, Infrabox saves ~**12-15 hours** of manual DMARC configuration.",
    },
  ],
  faqs: [
    {
      question: "What DMARC policy should I use for email?",
      answer:
        "Start with p=none during warmup. Move to p=quarantine after 2-4 weeks of clean warmup. Avoid p=reject for email domains.",
    },
    {
      question: "Does Infrabox set up DMARC automatically?",
      answer:
        "Yes. DMARC is configured automatically with the correct initial policy. InfraGuard monitors it continuously.",
    },
    {
      question: "Do I need DMARC if I have SPF and DKIM?",
      answer:
        "Yes. DMARC ties SPF and DKIM together and tells receivers what to do when they fail. Without DMARC, your authentication is incomplete.",
    },
  ],
  sources: [
    { title: "RFC 7489 - Domain-based Message Authentication, Reporting, and Conformance (DMARC)", url: "https://datatracker.ietf.org/doc/html/rfc7489", date: "2015" },
    { title: "Google Email Sender Guidelines - Authentication Requirements", url: "https://support.google.com/a/answer/81126", date: "2024" },
    { title: "Yahoo Sender Requirements", url: "https://senders.yahooinc.com/best-practices/", date: "2024" },
    { title: "DMARC.org Overview", url: "https://dmarc.org/overview/", date: "2026" },
    { title: "Infrabox DMARC Setup Documentation", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: [
    "spf-record-setup-email",
    "dkim-setup-email",
    "email-infrastructure-setup-guide",
  ],
};
