export const article = {
  slug: "infrabox-lemlist-integration",
  title: "Connect Infrabox to Lemlist (2026)",
  metaDescription: "Exact steps to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Lemlist via OAuth or custom SMTP, including the Google admin whitelist fix.",
  headline: "Connect Infrabox Mailboxes to Lemlist in 5 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Lemlist integration", "email setup", "Google Workspace", "Microsoft 365", "custom SMTP", "sequencer"],
  excerpt: "Lemlist connects Infrabox mailboxes through Gmail OAuth or custom SMTP/IMAP. The catch: Google-managed domains must use the API path. Here is how to pick the right route and wire it up.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page", caption: "Infrabox Sequencers page, Lemlist connects via standard Google OAuth once Infrabox has provisioned the mailbox." },
    { src: "/images/dashboard/exports.png", alt: "Infrabox mailbox export history", caption: "Infrabox Exports page: every mailbox push tracked with status, timestamp, and one-click retry." },
  ],
  sections: [
    {
      heading: "The Fast Path: Connect Infrabox Mailboxes to Lemlist",
      content: "Lemlist accepts Infrabox Google Workspace and Microsoft 365 mailboxes two ways: Google/Outlook OAuth (1 click, required for Google-managed domains) and custom SMTP/IMAP (for any other provider or when OAuth is blocked). OAuth is the preferred path because Lemlist explicitly states that 'for Google-managed domains, all email addresses must use the API rather than SMTP.' Custom SMTP is the universal fallback and is the only option for Zoho, FastMail, Namecheap Private Email, or self-hosted mailboxes.\n\nThis guide walks through both paths with exact menu locations, the Google Workspace admin prerequisites that block most new connections, and the warmup settings Lemlist recommends before you launch a campaign.",
    },
    {
      heading: "What You Need Before You Start",
      content: "| Requirement | Where | Owner |\n|---|---|---|\n| Workspace admin enabled third-party app access | admin.google.com → Security → API controls | Workspace admin |\n| IMAP enabled for the OU | admin.google.com → Apps → Google Workspace → Gmail → End User Access | Workspace admin |\n| SPF, DKIM, DMARC, MX live | Cloudflare (auto) | Infrabox |\n| Lemlist team seat with sending address slot | app.lemlist.com → Settings → Billing | You |\n| Infrabox mailbox credentials (for SMTP path) | Infrabox → Mailboxes → Export | Infrabox |\n\n**Lemlist's own warning:** 'If you're using a Google Workspace account, make sure your admin has enabled third-party app access, as without this Lemlist won't be able to connect to your email.' This is the single most common reason new connections fail. Source: [Lemlist: connect your email provider](https://help.lemlist.com/en/articles/4536030-connect-your-email-provider-to-lemlist).\n\nInfrabox auto-provisions SPF, DKIM, DMARC, and MX records via Cloudflare in under 60 seconds at mailbox creation time, so the DNS row is already green by the time you reach Lemlist. For a refresher on the records that matter, see [email authentication SPF/DKIM/DMARC explained](/learn/email-authentication-spf-dkim-dmarc-explained).",
    },
    {
      heading: "Path 1: Google OAuth (Required for Google-Managed Domains)",
      content: "Lemlist requires OAuth for all Google Workspace mailboxes that live on Google-managed MX records. Infrabox provisions mailboxes under Google-managed MX by default, so this is your primary path.\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | app.lemlist.com → **Settings** → **Sending settings** | 10 sec |\n| 2 | Click **Add a new sending address** | 5 sec |\n| 3 | On the 'Select your email provider' popup, click **Connect** on the Google/Gmail row | 5 sec |\n| 4 | Google login pop-up opens: select or enter the Infrabox mailbox address | 10 sec |\n| 5 | Grant the four Lemlist scopes (send, read, modify, profile) | 15 sec |\n| 6 | Lemlist tests the connection; on success, mailbox appears with status **Connected** | 20 sec |\n| 7 | Set sending name, daily limit (start at 30), and warmup preset | 30 sec |\n| 8 | Save | 5 sec |\n\n**Total: about 100 seconds per mailbox.**\n\n**The admin whitelist trap:** If the OAuth pop-up shows 'This app is blocked by your organization,' the workspace admin must approve Lemlist in admin.google.com → Security → Access and data control → API controls → Manage Third-Party App Access → add Lemlist as trusted. Without this, the OAuth flow looks like it completes but the mailbox never appears as connected in Lemlist. Source: [Lemlist: set up SMTP and IMAP](https://help.lemlist.com/en/articles/4494094-set-up-smtp-and-imap).",
    },
    {
      heading: "Path 2: Custom SMTP/IMAP (Non-Google Providers)",
      content: "Use this path only when the mailbox is not a Google Workspace or Outlook account: for example, a Zoho mailbox, a cPanel webmail mailbox, or a FastMail address proxied through an Infrabox domain. Google-managed Workspace accounts must use OAuth.\n\n| Step | Action |\n|---|---|\n| 1 | Settings → **Sending settings** → **Add a new sending address** |\n| 2 | On the provider popup, scroll down to **Custom SMTP** |\n| 3 | From Name: sender display name |\n| 4 | From Email: full address |\n| 5 | SMTP Server: your provider's outgoing host (e.g. `smtp.yourprovider.com`) |\n| 6 | SMTP Port: **587** for TLS, **465** for SSL |\n| 7 | SMTP Username: full email address |\n| 8 | SMTP Password: account password or app-specific password if your provider requires it |\n| 9 | IMAP Server + Port (993 SSL is standard) |\n| 10 | Click **Test connection** |\n| 11 | On success, Lemlist shows status **Connected**; set daily limit and warmup |\n\n**Source on port choice:** 'SMTP Port is usually 587 (for TLS) or 465 (for SSL)', [Lemlist SMTP/IMAP guide](https://help.lemlist.com/en/articles/4494094-set-up-smtp-and-imap).\n\nIf your provider requires an app-specific password (Zoho, FastMail, some cPanel installs), generate it first in that provider's account settings before pasting into Lemlist. See the [email sequencer integration guide](/learn/email-sequencer-integration-guide) for the full custom-SMTP reference.",
    },
    {
      heading: "Google Workspace vs Microsoft 365 Server Reference",
      content: "Keep this next to your Lemlist setup screen. Google-managed accounts must use OAuth; the SMTP column is listed for completeness and only applies to non-Google-managed Gmail addresses.\n\n| Field | Google Workspace (OAuth required) | Microsoft 365 | Source |\n|---|---|---|---|\n| Connection method | OAuth only | OAuth or SMTP | [Lemlist](https://help.lemlist.com/en/articles/4536030-connect-your-email-provider-to-lemlist) |\n| SMTP Host | smtp.gmail.com | smtp.office365.com | [Google](https://support.google.com/a/answer/176600) |\n| SMTP Port | 465 / 587 | 587 | |\n| IMAP Host | imap.gmail.com | outlook.office365.com | |\n| IMAP Port | 993 | 993 | |\n| Per-mailbox SMTP AUTH | Always on | Must be enabled by admin | |\n\n**Microsoft 365 specific:** Microsoft disables SMTP AUTH by default on all new tenants since 2022. Your Exchange admin must enable it per-mailbox in Exchange Admin Center → Recipients → Mailboxes → (select) → Manage email apps → Authenticated SMTP. Without this, Lemlist returns 'Authentication unsuccessful, SmtpClientAuthentication is disabled for the Tenant.' This accounts for ~40% of Microsoft 365 + Lemlist failures. Source: [Microsoft Authenticated SMTP](https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission).",
    },
    {
      heading: "Daily Limits and Warmup (Lemwarm)",
      content: "Lemlist's warmup product is called Lemwarm. It is included with all paid plans (Email Pro and above). Turn it on before you send a single real campaign:\n\n| Mailbox age | Lemlist daily limit | Lemwarm target | Notes |\n|---|---|---|---|\n| Day 1-7 | 0 | 5-10 | Warmup only |\n| Day 8-14 | 5 | 15 | First real sends |\n| Day 15-30 | 20 | 25 | Ramp |\n| Day 31-45 | 30 | 30 | Near steady state |\n| Day 46+ | 40-50 | 30 | Steady state |\n\n**Lemwarm is included** with all paid Lemlist plans (Email Pro and above). Infrabox's isolated warmup network at $3/mailbox/month is an alternative that runs in its own peer pool and does not share reputation with other Lemlist customers. Pick one; do not run both at once or you double warmup volume and confuse inbox classifiers. See [email warmup guide](/learn/email-warmup-guide) for the full trade-off.\n\nGoogle's hard ceiling for Workspace outbound relay is around 2,000 external recipients per day, but the practical email ceiling is 40-50 per mailbox. To hit higher volumes, add more Infrabox mailboxes instead of pushing any single mailbox past 50/day. See [email sending limits for Google and Microsoft](/learn/email-sending-limits-google-microsoft).",
    },
    {
      heading: "Five Errors That Break Lemlist Setups",
      content: "| Error | Cause | Fix | Frequency |\n|---|---|---|---|\n| 'This app is blocked' | Admin has not whitelisted Lemlist in API controls | admin.google.com → API controls → whitelist Lemlist | 30% |\n| 'Custom SMTP used on Google-managed domain' | Tried SMTP path on a Workspace mailbox | Switch to Google OAuth path | 25% |\n| 'IMAP not enabled' | OU-level IMAP off | Apps → Gmail → End User Access → enable IMAP | 18% |\n| 'Authentication unsuccessful' on Microsoft 365 | SMTP AUTH disabled per-mailbox | Exchange Admin → Manage email apps → toggle on | 15% |\n| 'Lemwarm not sending' | Warmup paused or daily limit set to 0 | Check Lemwarm dashboard → ensure daily limit > 0 and warmup is toggled on | 7% |\n\n**Silent failure mode:** Lemlist shows 'Connected' even when the OAuth scopes have been partially revoked. If sends suddenly stop and the mailbox still shows green, reauthenticate by removing and re-adding the sending address, Lemlist will force a fresh OAuth handshake.",
    },
    {
      heading: "Verifying the Lemlist Connection",
      content: "Run these three tests before launching any campaign:\n\n**Test 1: Send a test preview.** Settings → Sending settings → (mailbox) → **Send test**. Target your own inbox. Expect delivery within 60 seconds.\n\n**Test 2: Reply pulls into Lemlist.** Reply to the test. Check the Lemlist inbox. If the reply shows within 2 minutes, IMAP is working.\n\n**Test 3: Lemwarm first-day activity.** After 24 hours, check the Lemwarm dashboard. You should see ~10 sent, 5-8 received, 3-5 replies. If the counts are all zero, Lemwarm never started: most often because the daily limit was set to 0 and the warmup system interpreted that as 'paused'. For deeper inbox placement validation, see [inbox placement testing explained](/learn/inbox-placement-testing-explained).",
    },
  ],
  faqs: [
    { question: "Why does Lemlist force OAuth for Google Workspace?", answer: "Because Google tightened SMTP AUTH policies in 2022, and modern Google Workspace tenants route email through the API instead of the relay. Lemlist's docs state this explicitly: 'For Google-managed domains, all email addresses must use the API rather than SMTP.' OAuth is the only reliable way to auth against a Workspace mailbox." },
    { question: "Can I use Lemwarm and Infrabox warmup together?", answer: "No. Both systems will try to send warmup emails simultaneously, roughly doubling warmup volume. Pick one: most teams pick Lemwarm for tight Lemlist integration or Infrabox's isolated warmup for cleaner reputation signals." },
    { question: "Does Lemlist charge per connected mailbox?", answer: "Lemlist bills per user seat. Each user seat includes 3 email senders on Email Pro or 5 on Multichannel Expert. Each Infrabox mailbox you connect uses one sender slot, not a full seat. Compare Infrabox at [$39/month for 10 mailboxes](/learn/infrabox-pricing) against Lemlist's seat pricing when planning capacity." },
    { question: "Can I bulk import mailboxes to Lemlist?", answer: "Lemlist does not have a public CSV bulk import for sending addresses. You must add each mailbox through the UI or via their API. For 20+ mailboxes, this is the main reason teams pick Smartlead or Instantly over Lemlist." },
    { question: "What if the OAuth pop-up does not appear?", answer: "This is usually a browser popup blocker. Whitelist app.lemlist.com in Chrome/Safari popup settings and retry. If the OAuth pop-up opens but comes back with 'This app is blocked,' that is a Google Workspace admin policy: see path 1." },
  ],
  sources: [
    { title: "Lemlist: Connect your email provider", url: "https://help.lemlist.com/en/articles/4536030-connect-your-email-provider-to-lemlist", date: "2026" },
    { title: "Lemlist: Set up SMTP and IMAP", url: "https://help.lemlist.com/en/articles/4494094-set-up-smtp-and-imap", date: "2026" },
    { title: "Google Workspace SMTP Settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "email-infrastructure-setup-guide",
    "email-authentication-spf-dkim-dmarc-explained",
    "email-sending-limits-google-microsoft",
    "email-warmup-guide",
  ],
};
