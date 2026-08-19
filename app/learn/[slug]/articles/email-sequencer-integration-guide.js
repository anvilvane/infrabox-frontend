export const article = {
  slug: "email-sequencer-integration-guide",
  title: "Connect Infrabox Mailboxes to Sequencer (2026)",
  metaDescription: "Step-by-step integration guides for connecting Infrabox mailboxes to Instantly, SmartLead, Lemlist, Woodpecker, and 20+ other sequencer platforms.",
  headline: "Connect Infrabox to Instantly, SmartLead, and 22 More Sequencers",
  publishedAt: "2026-03-31",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["sequencer integration", "Instantly", "SmartLead", "Lemlist", "email sequencer", "SMTP IMAP"],
  excerpt: "Infrabox works with 23+ sequencer platforms. Here is how to connect your mailboxes to each one, with exact steps, connection methods, and troubleshooting tips.",
  type: "educational",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox connected sequencers", caption: "Infrabox Sequencers page showing 7 connected accounts across Instantly, ReachInbox, and SmartLead." },
    { src: "/images/dashboard/exports.png", alt: "Infrabox mailbox exports", caption: "3,093 successful mailbox exports to sequencer platforms. Status tracking and retry functionality built in." },
  ],
  sections: [
    {
      heading: "Which Sequencer Platforms Does Infrabox Support?",
      content: "Infrabox integrates with 23 email, warmup, and inbox management platforms. Here is the full list grouped by category.\n\n**Outreach Platforms (17):**\n\n| Sequencer | Connection Method | Auto-Export? |\n|-----------|------------------|--------------|\n| **Instantly** | Login credentials + optional API key | No |\n| **SmartLead** | Login credentials | No |\n| **Salesforge** | Login credentials | No |\n| **Saleshandy** | Login credentials | No |\n| **Reply.io** | Login credentials | No |\n| **Snov.io** | Login credentials | No |\n| **Lemlist** | Login credentials | No |\n| **Woodpecker** | Login credentials | No |\n| **EmailBison** | Login credentials | No |\n| **ReachInbox** | Login credentials | No |\n| **Emelia** | Login credentials | No |\n| **PlusVibe** | Login credentials | No |\n| **BrandJet** | API key | No |\n| **LeadsPicker** | Login credentials | No |\n| **Manyreach** | Login credentials | No |\n| **Supersend** | API key | No |\n| **Za-Zu** | Login credentials | No |\n\n**Warmup Tools (4):**\n\n| Sequencer | Connection Method | Auto-Export? |\n|-----------|------------------|--------------|\n| **TrulyInbox** | Login credentials | No |\n| **Warmforge** | Login credentials | No |\n| **MailToaster** | Login credentials | No |\n| **Warmy.io** | Login credentials | No |\n\n**Inbox Management (2):**\n\n| Sequencer | Connection Method | Auto-Export? |\n|-----------|------------------|--------------|\n| **Hothawk** | Login credentials | No |\n| **Master Inbox** | Login credentials | No |\n\n**Connection methods:**\n- **Login credentials:** Provide your sequencer account email and password. Infrabox authenticates and exports mailboxes directly to your sequencer.\n- **API key:** Provide your platform API key. Used by BrandJet and Supersend.\n\n**Source:** Infrabox Sequencers page (docs.infrabox.software) and each platform's integration documentation.",
    },
    {
      heading: "How Do You Connect Infrabox to Instantly?",
      content: "Instantly is the most popular sequencer among Infrabox users. Here is the exact process:\n\n| Step | Action | Time |\n|------|--------|------|\n| 1 | Go to Infrabox Sequencers page | 10 sec |\n| 2 | Click 'Add Sequencer' and select Instantly | 10 sec |\n| 3 | Enter your Instantly API key (from Instantly Settings > Integrations) | 30 sec |\n| 4 | Configure CNAME record (Infrabox provides the value) | 1 min |\n| 5 | Select mailboxes to export | 30 sec |\n| 6 | Click Export. mailboxes appear in Instantly within minutes | 30 sec |\n\n**Total time: ~3 minutes.**\n\n**CNAME configuration:** Instantly requires a CNAME record to verify domain ownership. Infrabox provides the exact CNAME value in the sequencer setup flow. The record typically propagates within 15-30 minutes.\n\n**Source:** Infrabox Sequencers page (see screenshot), Instantly integration documentation.",
    },
    {
      heading: "Connecting via SMTP/IMAP (Universal Method)",
      content: "For sequencers that don't support API integration, use SMTP/IMAP credentials. This works with ANY email platform.\n\n**Google Workspace SMTP/IMAP settings:**\n\n| Setting | Value | Source |\n|---------|-------|--------|\n| SMTP Server | smtp.gmail.com | support.google.com/a/answer/176600 |\n| SMTP Port | 587 (TLS) or 465 (SSL) | Google Workspace Admin Help |\n| IMAP Server | imap.gmail.com | support.google.com/a/answer/9003945 |\n| IMAP Port | 993 (SSL) | Google Workspace Admin Help |\n| Username | Full email address | - |\n| Password | App-specific password | support.google.com/accounts/answer/185833 |\n\n**Microsoft 365 SMTP/IMAP settings:**\n\n| Setting | Value | Source |\n|---------|-------|--------|\n| SMTP Server | smtp.office365.com | learn.microsoft.com |\n| SMTP Port | 587 (TLS) | Microsoft documentation |\n| IMAP Server | outlook.office365.com | learn.microsoft.com |\n| IMAP Port | 993 (SSL) | Microsoft documentation |\n| Username | Full email address | - |\n| Password | Account password or app password | - |\n\n**Important:** Google Workspace requires app-specific passwords (not your regular password) for SMTP/IMAP connections. Generate one at myaccount.google.com/apppasswords.\n\n**Source:** Google Workspace SMTP settings (support.google.com/a/answer/176600), Microsoft 365 SMTP settings (learn.microsoft.com).",
    },
    {
      heading: "How Do You Export Mailboxes in Bulk?",
      content: "At scale, you need to export hundreds of mailboxes efficiently.\n\n**Infrabox export capabilities:**\n\n| Feature | Details | Source |\n|---------|---------|--------|\n| Bulk export | Export all mailboxes to a sequencer in one click | Infrabox Exports page |\n| CSV export | Download mailbox credentials as CSV | Infrabox Mailboxes page |\n| Export history | Track all 3,093+ exports with status | Infrabox Exports page (see screenshot) |\n| Failed export retry | One-click retry for failed exports | Infrabox Exports page |\n\n**Export status tracking:**\nThe Exports page (screenshot above) shows every export with:\n- Mailbox email address\n- Target sequencer\n- Status (Completed/Failed/Pending)\n- Timestamp\n- Retry option for failures\n\n**At 858 mailboxes and 3,093 exports,** Infrabox handles large-scale export operations reliably. The average export completes within 2-5 minutes.\n\n**Source:** Infrabox Exports page data (see screenshot).",
    },
    {
      heading: "How Do You Fix Common Integration Issues?",
      content: "The most common problems and their fixes:\n\n| Issue | Cause | Fix | Frequency |\n|-------|-------|-----|----------|\n| CNAME not verifying | DNS propagation delay | Wait 30 min, check with DNS Checker | 30% of issues |\n| SMTP authentication failed | Wrong password type | Use app-specific password (Google) | 25% of issues |\n| IMAP connection timeout | Port blocked | Use port 993 with SSL, check firewall | 15% of issues |\n| Export stuck at 'Pending' | Sequencer API rate limit | Wait 5 min, retry | 15% of issues |\n| Mailboxes not appearing | Sequencer cache | Refresh sequencer mailbox list | 10% of issues |\n| Duplicate mailbox error | Already exported | Check sequencer for existing account | 5% of issues |\n\n**Google-specific issues:**\n- 'Less secure app access' is no longer available. You MUST use app passwords or OAuth.\n- App passwords require 2-Step Verification to be enabled first.\n- Source: Google security documentation (support.google.com/accounts/answer/185833)\n\n**Microsoft-specific issues:**\n- Modern Authentication (OAuth) may be required by organization policy.\n- Legacy SMTP authentication must be enabled per-mailbox in Exchange Admin Center.\n- Source: Microsoft 365 SMTP auth documentation (learn.microsoft.com)",
    },
  ],
  faqs: [
    { question: "Which sequencer works best with Infrabox?", answer: "Instantly has the deepest integration (login credentials plus an optional API key). SmartLead and ReachInbox also support direct connections. All 23 platforms connect through login credentials or API key. Infrabox handles the mailbox export automatically." },
    { question: "Can I use multiple sequencers with the same mailboxes?", answer: "Technically yes, but we do not recommend it. Each mailbox should be connected to one sequencer to prevent sending conflicts and maintain deliverability." },
    { question: "How long does the export take?", answer: "Login-based exports (Instantly, SmartLead, and most platforms): 2-5 minutes per batch. API key exports (BrandJet, Supersend): 2-3 minutes. Bulk CSV export: instant download." },
    { question: "Do I need different settings for Google vs Microsoft mailboxes?", answer: "No. Infrabox handles the differences automatically. Whether your mailboxes are Google Workspace or Microsoft 365, you connect your sequencer account once and Infrabox exports the correct credentials for each mailbox type." },
    { question: "What if my export fails?", answer: "Check the Exports page for error details. Most failures are CNAME propagation delays or API rate limits. Use the one-click retry button after fixing the issue." },
  ],
  sources: [
    { title: "Google Workspace SMTP Settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 SMTP Settings", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
    { title: "Infrabox API Documentation", url: "https://docs.infrabox.software", date: "2026" },
    { title: "Instantly Integration Guide", url: "https://instantly.ai/integrations", date: "2026" },
  ],
  relatedSlugs: ["email-infrastructure-setup-guide", "scale-email-100-to-10000", "email-sending-volume-limits-guide"],
};
