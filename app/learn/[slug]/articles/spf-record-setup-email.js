export const article = {
  slug: "spf-record-setup-email",
  title: "SPF Record Setup Guide for Email (2026)",
  metaDescription:
    "How to set up SPF records for email. Step-by-step guide covering syntax, common mistakes, multiple sender setup, and automatic configuration with Infrabox.",
  headline: "SPF Record Setup Guide for Email (2026)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "spf record",
    "email authentication",
    "dns setup",
    "email",
    "deliverability",
  ],
  excerpt:
    "SPF records tell receiving servers which IP addresses can send email on behalf of your domain. Get it wrong and your emails go straight to spam. Here is the complete setup guide.",
  screenshots: [{ src: "/images/dashboard/domains.png", alt: "Infrabox domain management showing SPF record configuration status", caption: "Infrabox domains page with green SPF status indicators showing correctly configured SPF records across all domains" }],  type: "educational",
  sections: [
    {
      heading: "What Is an SPF Record?",
      content:
        "**SPF (Sender Policy Framework)** is a DNS TXT record that lists the mail servers authorized to send email from your domain. When a receiving server gets an email from your domain, it checks the SPF record to verify the sending server is authorized.\n\nIf the sending server is not listed, the email fails SPF authentication. Depending on your DMARC policy, this can mean the email goes to spam or gets rejected entirely.",
    },
    {
      heading: "SPF Record Syntax",
      content:
        "Every SPF record follows the same structure. Here is the complete syntax reference:\n\n| Component | Example | What It Does |\n|-----------|---------|-------------|\n| **Version** | v=spf1 | Required prefix. always spf1 |\n| **include:** | include:_spf.google.com | Authorizes another domain's mail servers |\n| **ip4:** | ip4:192.168.1.0/24 | Authorizes a specific IPv4 address or range |\n| **~all** | ~all | **Soft fail**. recommended for email |\n| **-all** | -all | **Hard fail**. risky, can bounce legitimate emails |\n\n**Ready-to-use SPF records:**\n\n| Provider Setup | SPF Record |\n|---------------|------------|\n| Google Workspace only | v=spf1 include:_spf.google.com ~all |\n| Microsoft 365 only | v=spf1 include:spf.protection.outlook.com ~all |\n| Google + Microsoft | v=spf1 include:_spf.google.com include:spf.protection.outlook.com ~all |\n| Google + Instantly | v=spf1 include:_spf.google.com include:sendgrid.net ~all |\n\n**Critical rule:** Only **ONE** SPF record per domain. Combine all senders into a single record.",
    },
    {
      heading: "Common SPF Mistakes in Email",
      content:
        "These are the **5 SPF errors** that cause the most deliverability damage in email setups:\n\n| # | Mistake | What Happens | How to Fix |\n|---|---------|-------------|------------|\n| **1** | Too many DNS lookups (>10) | SPF record exceeds the **10 DNS lookup limit** and fails entirely for all emails | Each include: counts as 1+ lookups. Audit with MXToolbox SPF checker. Use ip4: for static IPs to reduce lookups |\n| **2** | Using -all instead of ~all | Hard fail (-all) causes legitimate emails to **bounce** if any config issue exists | Always use **~all** (soft fail) for email domains |\n| **3** | Multiple SPF records on one domain | Both SPF records fail validation. **all emails fail SPF** | Combine all authorized senders into a **single** TXT record starting with v=spf1 |\n| **4** | Forgetting to add your sequencer | Emails sent through Instantly, SmartLead, etc. **fail SPF authentication** | Check your sequencer docs for their SPF include: value and add it to your record |\n| **5** | Not updating after adding services | New sending service emails fail auth while old services continue working | Audit your SPF record every time you add a new sending tool or email service |\n\n**Quick diagnostic:** Send a test email to Gmail > click three dots > Show Original. If SPF shows **FAIL**, your record is misconfigured. If it shows **PERMERROR**, you have exceeded the 10-lookup limit or have duplicate records.",
    },
    {
      heading: "Setting Up SPF for Different Providers",
      content:
        "Here is the complete reference for SPF include values by provider and sequencer:\n\n| Provider / Sequencer | SPF Include Value | DNS Lookups Used |\n|---------------------|-------------------|-----------------|\n| **Google Workspace** | include:_spf.google.com | 3-4 lookups |\n| **Microsoft 365** | include:spf.protection.outlook.com | 2-3 lookups |\n| **Instantly** | include:sendgrid.net | 1-2 lookups |\n| **SmartLead** | include:_spf.smartlead.ai | 1 lookup |\n| **Lemlist** | include:_spf.lemlist.com | 1 lookup |\n| **Woodpecker** | include:wdpkr.com | 1 lookup |\n\n**Example combined records:**\n- Google + Instantly: v=spf1 include:_spf.google.com include:sendgrid.net ~all (**5-6 lookups**)\n- Google + Microsoft + SmartLead: v=spf1 include:_spf.google.com include:spf.protection.outlook.com include:_spf.smartlead.ai ~all (**7-8 lookups**)\n\n**Watch the 10-lookup limit.** Google alone uses 3-4 lookups. Adding Microsoft and a sequencer can push you to 7-8. Always verify your total lookup count with MXToolbox.\n\n**Infrabox configures the correct SPF record automatically** for Google Workspace (**$2.50/mo**) and Microsoft 365 (**$2.50/mo**) mailboxes.",
    },
    {
      heading: "Automatic SPF with Infrabox",
      content:
        "**Infrabox configures SPF records automatically** when you create a mailbox. Here is what happens behind the scenes:\n\n| Step | What Infrabox Does | Time |\n|------|-------------------|------|\n| **1. Record creation** | Generates the correct SPF TXT record for your mailbox provider (Google/Microsoft) | Instant |\n| **2. DNS propagation** | Publishes the record to your domain's DNS zone | **1-4 hours** |\n| **3. Validation** | Verifies the SPF record resolves correctly and lookup count is under 10 | Automatic |\n| **4. Ongoing monitoring** | InfraGuard checks SPF integrity every few hours | Continuous |\n| **5. Alert on changes** | Notifies you immediately if SPF records are modified, deleted, or corrupted | Instant alerts |\n\nThis eliminates the most common source of deliverability problems: incorrect DNS configuration. For teams managing **50+ domains**, Infrabox saves approximately **8-10 hours** of manual SPF configuration and prevents the copy-paste errors that break authentication.",
    },
    {
      heading: "How to Verify Your SPF Record",
      content:
        "**Check your current SPF:**\n1. Use a DNS lookup tool (MXToolbox, Google Admin Toolbox)\n2. Look for the TXT record starting with v=spf1\n3. Verify all your sending services are included\n4. Confirm you have only ONE SPF record\n5. Check the DNS lookup count is under 10\n\n**Infrabox users:** InfraGuard continuously monitors SPF records and alerts you to any issues automatically.",
    },
  ],
  faqs: [
    {
      question: "What happens if my SPF record is wrong?",
      answer:
        "Emails fail SPF authentication. Depending on your DMARC policy, they go to spam or get rejected. Always verify after making DNS changes.",
    },
    {
      question: "Does Infrabox set up SPF automatically?",
      answer:
        "Yes. Infrabox configures SPF records automatically when you create mailboxes. InfraGuard also monitors them continuously.",
    },
    {
      question: "Can I have multiple SPF records?",
      answer:
        "No. Only one SPF record per domain. Multiple records cause both to fail. Combine all authorized senders into a single record.",
    },
  ],
  sources: [
    { title: "RFC 7208 - Sender Policy Framework (SPF)", url: "https://datatracker.ietf.org/doc/html/rfc7208", date: "2014" },
    { title: "Google Workspace Admin Help - Set up SPF to prevent spoofing", url: "https://support.google.com/a/answer/33786", date: "2026" },
    { title: "Microsoft 365 - Set up SPF to help prevent spoofing", url: "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/email-authentication-spf-configure", date: "2026" },
    { title: "MXToolbox SPF Record Lookup", url: "https://mxtoolbox.com/spf.aspx", date: "2026" },
    { title: "Infrabox DNS Setup Documentation", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: [
    "dkim-setup-email",
    "dmarc-setup-email",
    "email-infrastructure-setup-guide",
  ],
};
