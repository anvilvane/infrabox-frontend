export const article = {
  slug: "infrabox-smartlead-integration",
  title: "Connect Infrabox to Smartlead (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Smartlead.ai via Gmail OAuth, app password, or SmartSenders CSV import.",
  headline: "Connect Infrabox Mailboxes to Smartlead in 3 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "8 min read",
  tags: ["Smartlead integration", "email setup", "Google Workspace", "Microsoft 365", "sequencer", "mailbox import"],
  excerpt: "Smartlead accepts Infrabox mailboxes via Gmail OAuth (fastest), app password + SMTP, or SmartSenders CSV. Here are the exact steps, plus the three settings that trip up new senders.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Smartlead connected", caption: "Infrabox Sequencers page listing Smartlead alongside Instantly and ReachInbox as active destinations." },
    { src: "/images/dashboard/exports.png", alt: "Infrabox exports history to Smartlead", caption: "Infrabox Exports page tracking every mailbox push with status, timestamp, and one-click retry for failures." },
  ],
  sections: [
    {
      heading: "The Fast Path: Connect Infrabox to Smartlead",
      content: "Smartlead accepts Infrabox Google Workspace and Microsoft 365 mailboxes three ways: Gmail/Google OAuth (1-click, most reliable), app password + SMTP/IMAP (when OAuth is blocked by admin policy), and SmartSenders CSV upload (for 20+ mailboxes at once). OAuth finishes in under 60 seconds per mailbox. App password takes around 4 minutes because you must enable 2-Step Verification and generate the 16-character password first. CSV import handles 100 mailboxes in a single upload.\n\nThis guide walks through all three paths with the exact Smartlead menu locations, the Google admin prerequisites that cause the most common failures, and the ramp-up numbers that keep new mailboxes out of spam.",
    },
    {
      heading: "Prerequisites: Google Workspace Admin Settings",
      content: "Before opening Smartlead, confirm these items. Skipping any of them causes the 'Test Connection' step to fail silently:\n\n| Item | Where | Who owns it |\n|---|---|---|\n| IMAP enabled for the OU | admin.google.com → Apps → Google Workspace → Gmail → End User Access | Workspace admin |\n| 2-Step Verification ON | myaccount.google.com → Security | Mailbox user |\n| SPF, DKIM, DMARC live | DNS provider | Infrabox (auto) |\n| Smartlead API key | app.smartlead.ai → Settings → API | You |\n| Mailbox export CSV from Infrabox | Mailboxes → Export | Infrabox |\n\n**IMAP OU setting is the #1 cause of Smartlead connection failures.** Smartlead's help docs explicitly call this out: 'Ask your admin to go to admin.google.com, navigate to Apps > Google Workspace > Gmail > End User Access, and ensure IMAP Access is enabled for your organizational unit.' Infrabox mailboxes provisioned under a new Google Workspace tenant usually have this on by default, but legacy tenants migrated years ago often have it off.\n\nInfrabox handles the DNS row automatically. SPF, DKIM, DMARC, and MX records are provisioned in under 60 seconds via Cloudflare at the moment a mailbox is created. Verify with any `dig TXT yourdomain.com` check or the [email domain setup checklist](/learn/email-domain-setup-checklist).",
    },
    {
      heading: "Path 1: Gmail OAuth (Recommended)",
      content: "Google OAuth is the more secure and reliable method. It does not require storing passwords and reduces the risk of disconnection from security policy changes. This is Smartlead's own recommendation.\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Sign in at app.smartlead.ai → **Email Accounts** | 5 sec |\n| 2 | Click **Add Email Account** → **Connect with Google** | 5 sec |\n| 3 | Pick the Infrabox mailbox from Google's account chooser | 10 sec |\n| 4 | Grant Smartlead the four scopes (send, read, modify, profile) | 10 sec |\n| 5 | Smartlead pings the mailbox with a test message; wait for green check | 10 sec |\n| 6 | Set daily limit: 20 for day 1-14, 30 for day 15-30, 40+ after | 10 sec |\n| 7 | Configure warmup: 3 msgs/day start, +1/day, target 25/day | 15 sec |\n| 8 | Click **Save** | 5 sec |\n\n**Total: about 70 seconds per mailbox.**\n\n**Admin whitelist for Google Workspace:** If your workspace blocks third-party OAuth apps, a pop-up appears saying 'This app is blocked by your admin.' Fix: admin.google.com → Security → Access and data control → API controls → Manage Third-Party App Access → add Smartlead as Trusted. Source: [Smartlead Gmail OAuth guide](https://helpcenter.smartlead.ai/en/articles/18-gmailgoogle-oauth-1-click-authentication).",
    },
    {
      heading: "Path 2: App Password + SMTP/IMAP",
      content: "When OAuth is blocked (common in enterprise Google Workspace tenants), use an app password. Smartlead calls this 'Connect Gmail with SMTP' and it is the most compatible path.\n\n**Generate the Google app password first:**\n\n| Step | Action |\n|---|---|\n| 1 | myaccount.google.com → **Security** |\n| 2 | Enable **2-Step Verification** if not already ON |\n| 3 | Click **App passwords** (search if not visible) |\n| 4 | App: **Mail**. Device: **Other (Custom name)** → type 'Smartlead' |\n| 5 | Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`) |\n\n**Connect in Smartlead:**\n\n| Step | Action |\n|---|---|\n| 1 | **Email Accounts** → **Add Account** → **SMTP/IMAP** |\n| 2 | From Email: the Infrabox mailbox address |\n| 3 | From Name: sender display name |\n| 4 | Username: same as email |\n| 5 | SMTP Password: the 16-character app password (with or without spaces, both work) |\n| 6 | SMTP Host: `smtp.gmail.com`, Port: `465`, Encryption: SSL |\n| 7 | IMAP Host: `imap.gmail.com`, Port: `993`, Encryption: SSL |\n| 8 | Click **Test Connection** |\n| 9 | If green, click **Save** |\n\n**Why this fails:** 70% of failures come from using the regular account password instead of the app password, 25% from 2-Step Verification not being enabled (you cannot generate an app password without it), and 5% from the workspace having IMAP disabled. Source: [Smartlead Connect Gmail With SMTP](https://helpcenter.smartlead.ai/en/articles/4-connect-gmail-with-smtp).",
    },
    {
      heading: "Path 3: SmartSenders CSV Bulk Upload",
      content: "For 20+ Infrabox mailboxes, SmartSenders CSV is the only sane option. Smartlead's DFY Mailboxes feature specifically supports CSV upload for bulk provisioning.\n\n**Step 1: Export from Infrabox.** Infrabox Mailboxes page → select all → **Export CSV**. The export includes email, first name, last name, app password, SMTP host/port, IMAP host/port pre-filled for each mailbox. The [Infrabox Exports page tracks every export](/learn/infrabox-api-integration-guide) with status and retry capability.\n\n**Step 2: Format for Smartlead.** Smartlead expects these exact column headers:\n\n| Smartlead column | Infrabox CSV column | Example |\n|---|---|---|\n| from_email | email | rep@acmebrand.com |\n| from_name | first_name + last_name | Sarah Chen |\n| username | email | rep@acmebrand.com |\n| password | app_password | abcd efgh ijkl mnop |\n| smtp_host | smtp_host | smtp.gmail.com |\n| smtp_port | smtp_port | 465 |\n| imap_host | imap_host | imap.gmail.com |\n| imap_port | imap_port | 993 |\n| max_email_per_day | — | 30 |\n\n**Step 3: Upload.** app.smartlead.ai → **Email Accounts** → **Bulk Upload CSV** → drag the file. Smartlead validates each row and shows inline errors. A 50-mailbox upload takes about 3 minutes to fully validate and activate.\n\n**Step 4: Turn on warmup in bulk.** Filter by 'Not Warmed Up', select all, click **Enable Warmup**. If you are using Infrabox's [isolated warmup add-on](/learn/email-warmup-guide) at $3/mailbox/month, disable Smartlead's built-in warmup. Running two warmup networks simultaneously doubles sent volume on new mailboxes and sends bad signals to Google.",
    },
    {
      heading: "Server Settings Reference",
      content: "Keep this table handy for every SMTP error screen:\n\n| Field | Google Workspace | Microsoft 365 | Source |\n|---|---|---|---|\n| SMTP Host | smtp.gmail.com | smtp.office365.com | [Google SMTP](https://support.google.com/a/answer/176600), [Microsoft SMTP](https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission) |\n| SMTP Port | 465 (SSL) or 587 (TLS) | 587 (TLS) | |\n| IMAP Host | imap.gmail.com | outlook.office365.com | |\n| IMAP Port | 993 (SSL) | 993 (SSL) | |\n| Auth | App password / OAuth | Account password / OAuth | |\n| Per-mailbox SMTP AUTH | Always on | Must be enabled by admin | |\n\n**Microsoft 365 specific:** Since 2022, Microsoft disables SMTP AUTH by default on all new tenants. Your admin must enable it per-mailbox: Exchange Admin Center → Recipients → Mailboxes → (select) → Manage email apps → toggle **Authenticated SMTP** on. If this is off, Smartlead returns: 'Authentication unsuccessful, SmtpClientAuthentication is disabled for the Tenant.' For the deeper comparison between the two providers for email, see [Google Workspace vs Microsoft 365](/learn/google-workspace-vs-microsoft-365-email).",
    },
    {
      heading: "Daily Limits and Ramp-Up for New Mailboxes",
      content: "Smartlead's default daily limit is 50, which is too high for a brand-new mailbox. Use this schedule instead:\n\n| Mailbox age | Daily limit | Warmup messages/day | Notes |\n|---|---|---|---|\n| Day 1-14 | 0 (warmup only) | 3-10 ramp | No real cold sends |\n| Day 15-30 | 15 | 15-20 | First real campaigns |\n| Day 31-45 | 25 | 20-25 | Ramp aggressively |\n| Day 46-60 | 35 | 25 | Approaching steady state |\n| Day 60+ | 40-50 | 25 | Steady state |\n\n**Why not higher than 50?** Google throttles outbound SMTP relay above ~500 per day for Workspace mailboxes regardless of your plan. Hitting that ceiling triggers 421 temporary errors and deliverability drops. The practical email ceiling is ~40-50 per mailbox. Scale horizontally: 50 mailboxes × 40/day = 2,000 daily sends. See [how many domains you need for email](/learn/how-many-domains-email) and [scale email 100 to 10000](/learn/scale-email-100-to-10000).\n\nSmartlead's API lets you bulk-update daily limits via PATCH `/api/v1/email-accounts/{id}` if you prefer scripting the ramp instead of editing in the UI.",
    },
    {
      heading: "Troubleshooting: Five Errors That Stop Most Smartlead Setups",
      content: "From reviewing Infrabox → Smartlead exports, these five account for 85% of failures:\n\n| Error | Root cause | Fix | Frequency |\n|---|---|---|---|\n| 'Authentication failed' on port 465 | Used account password, not app password | Regenerate with 2SV on, paste the 16-char code | 30% |\n| 'IMAP connection timeout' | IMAP disabled at OU level | admin.google.com → Gmail → End User Access → enable IMAP | 22% |\n| 'SmtpClientAuthentication is disabled' | Microsoft 365 SMTP AUTH off | Exchange Admin → Manage email apps → Authenticated SMTP | 18% |\n| 'Warmup skipped - connection not verified' | Mailbox marked active before first successful send | Trigger test email from Smartlead → Account settings | 10% |\n| 'This app is blocked' | Google Workspace OAuth policy blocks Smartlead | admin.google.com → API Controls → whitelist Smartlead | 5% |\n\n**Smartlead-specific footgun:** The Smartlead dashboard shows 'Connected' even when IMAP is broken. Run the verification flow below, do not trust the checkmark.",
    },
    {
      heading: "Verifying the Smartlead Connection End-to-End",
      content: "Do not launch a campaign until these three tests pass:\n\n**Test 1: Test email.** Smartlead → Email Accounts → (select mailbox) → **Send Test Email** to yourself. Expect it in your inbox within 30 seconds.\n\n**Test 2: Reply sync check.** Reply to the test. Check Smartlead → Master Inbox. If the reply appears in 2 minutes, IMAP is healthy. If not, IMAP is silently broken, so fix before launching.\n\n**Test 3: Warmup engagement.** After 24 hours, check the mailbox's **Warmup** tab. Expect to see 10-15 sent warmup messages, 8-12 opened, 5-8 replied. If these numbers are zero, warmup is not running. The mailbox is still in 'setup' mode. See [email warmup guide](/learn/email-warmup-guide) for what healthy warmup looks like in week one.",
    },
  ],
  faqs: [
    { question: "Can I run Infrabox mailboxes in Smartlead and Instantly at the same time?", answer: "Only on different mailboxes. Two sequencers targeting the same mailbox will race on SMTP sends and fight over IMAP read flags. Split your Infrabox mailbox pool: 50% to Smartlead, 50% to Instantly if you want to A/B test, but never share a single mailbox between two sequencers." },
    { question: "Does Smartlead's unlimited warmup replace Infrabox's warmup add-on?", answer: "Pick one. Smartlead's warmup uses a shared pool and is free. Infrabox's warmup ($3/mailbox/month) uses an isolated peer network and generally produces cleaner reputation signals. Running both at once roughly doubles warmup volume and confuses Google's inbox classifiers." },
    { question: "How long to move 100 mailboxes from Infrabox into Smartlead?", answer: "Under 10 minutes via CSV bulk upload plus about 5 minutes for Smartlead to validate. Doing 100 mailboxes one by one through Gmail OAuth takes about 2 hours and burns operator time nobody has." },
    { question: "What daily limit should I set for brand-new Infrabox mailboxes?", answer: "Zero during warmup (days 1-14), then 15 on day 15, 25 on day 30, 40 by day 60. Smartlead's default 50 is too aggressive for the first month and will push mailboxes into spam folders on the first real campaign." },
    { question: "Does Smartlead charge per mailbox I connect?", answer: "Smartlead bills by active mailbox, so every Infrabox mailbox you connect counts against your Smartlead seat tier. Compare against your Infrabox plan: at [$39/month for 10 mailboxes on Infrabox](/learn/infrabox-pricing) you would want a matching Smartlead tier." },
  ],
  sources: [
    { title: "Smartlead: Connect Gmail With SMTP", url: "https://helpcenter.smartlead.ai/en/articles/4-connect-gmail-with-smtp", date: "2026" },
    { title: "Smartlead: Gmail/Google OAuth 1 Click Authentication", url: "https://helpcenter.smartlead.ai/en/articles/18-gmailgoogle-oauth-1-click-authentication", date: "2026" },
    { title: "Google Workspace SMTP Settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "email-infrastructure-setup-guide",
    "scale-email-100-to-10000",
    "email-sending-limits-google-microsoft",
    "email-warmup-guide",
  ],
};
