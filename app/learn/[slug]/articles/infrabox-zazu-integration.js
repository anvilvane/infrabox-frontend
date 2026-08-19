export const article = {
  slug: "infrabox-zazu-integration",
  title: "Connect Infrabox to Za-Zu (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Za-Zu, the Clay-native AI outreach platform for multi-account senders.",
  headline: "Connect Infrabox Mailboxes to Za-Zu in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Za-Zu integration", "Clay integration", "AI personalization", "email setup", "Google Workspace", "Microsoft 365"],
  excerpt: "Za-Zu is the outreach layer many Clay users pair with real mailboxes. Infrabox handles the mailbox side; Za-Zu handles the AI-personalized sending. Here is the exact connect flow.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Za-Zu connected", caption: "Infrabox Sequencers page. Za-Zu sits in the Outreach category next to other AI-personalization tools like PlusVibe and ReachInbox." },
    { src: "/images/dashboard/exports.png", alt: "Infrabox Exports page tracking the Za-Zu push", caption: "Infrabox Exports page showing a Za-Zu mailbox export with per-mailbox status and retry." },
  ],
  sections: [
    {
      heading: "The Fast Path: Email + Password Into Za-Zu",
      content: "Za-Zu connects via standard credential handoff in the Infrabox Sequencers Connect screen. Paste your Za-Zu login email and password, click Connect Account, and Infrabox pushes every selected mailbox into your Za-Zu account for use in sequences. The actual connect completes in about 90 seconds. There is no API key, no workspace dropdown, and no multi-step validation. Za-Zu uses the simplest flow of any sequencer in the Infrabox catalog.\n\nThis is the integration to pick if you are a [Clay](https://clay.com) user doing AI personalization at scale and you want real Google Workspace or Microsoft 365 mailboxes (not shared-IP mailboxes) as the sending layer underneath Za-Zu's sequences.",
    },
    {
      heading: "Why Za-Zu Users Pair With Infrabox",
      content: "Za-Zu markets itself as 'the outreach tool Clay users pick.' The reason: Za-Zu accepts data directly from Clay tables, runs AI-personalized first touches, and supports multi-account management across many senders. What Za-Zu does *not* do is provision mailboxes for you, so you bring your own.\n\n| Layer | What Za-Zu provides | What Infrabox provides |\n|---|---|---|\n| Prospect data | Clay integration, CSV, manual | — |\n| AI first touches | Native AI personalization | — |\n| Multi-account rotation | Yes | — |\n| Real Google Workspace mailboxes | — | Yes (real, not shared-IP) |\n| Real Microsoft 365 mailboxes | — | Yes |\n| Azure mailboxes at scale | — | Yes, $30/tenant for 100 mailboxes |\n| US-based sender IPs | — | Yes |\n| DNS automation (SPF/DKIM/DMARC) | — | Yes, under 60 seconds via Cloudflare |\n| Isolated warmup | — | Optional $3/mailbox/month |\n\nFor Clay-heavy workflows, the typical stack is Clay → Za-Zu → Infrabox mailboxes. Clay hydrates the prospect rows, Za-Zu writes the AI first touch, Infrabox sends from a real mailbox. Each tool owns one layer of the pipeline and none of them overlap.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Before clicking Connect in Infrabox:\n\n| Item | Where | Required |\n|---|---|---|\n| Za-Zu account with at least one sender slot available | za-zu.com | Yes |\n| Za-Zu login email | — | Yes |\n| Za-Zu account password | — | Yes |\n| Infrabox mailboxes provisioned and DNS live | Infrabox → Mailboxes | Yes |\n| Clay workspace with your prospect data (if using Clay) | clay.com | Optional |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes (for reply tracking) |\n\n**The IMAP-at-OU prerequisite.** Za-Zu reads replies via IMAP, same as Instantly and Salesforge. If IMAP is disabled for the OU that contains your Infrabox mailboxes, Za-Zu will show zero replies even though sending works fine. Fix by enabling IMAP in the Google Workspace admin console before you connect. It takes 30 seconds and saves a half-hour of post-connect debugging. For a complete checklist of these Google Workspace admin prerequisites, see the [email domain setup checklist](/learn/email-domain-setup-checklist).",
    },
    {
      heading: "Step-by-Step: Connect Za-Zu in Infrabox",
      content: "The clean path from Infrabox dashboard to a connected Za-Zu account:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** category and pick **Za-Zu** | 5 sec |\n| 3 | Enter **Email**, your Za-Zu login | 5 sec |\n| 4 | Enter **Password**, your Za-Zu password | 5 sec |\n| 5 | (Optional) Enter an account nickname if you manage multiple Za-Zu tenants | 5 sec |\n| 6 | Click **Connect Account** | — |\n| 7 | Infrabox validates credentials and pushes selected mailboxes | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast | — |\n\n**Total: about 90 seconds.**\n\nZa-Zu does not require a separate workspace selection step (unlike [Master Inbox](/learn/infrabox-masterinbox-integration)) and does not use a custom API-key validation flow (unlike BrandJet or Supersend). It is the most direct credential flow in the catalog.",
    },
    {
      heading: "Using Za-Zu With Clay Tables",
      content: "If you are pairing Za-Zu with Clay, the workflow after the Infrabox connect looks like this:\n\n**Step 1: Inside Clay.** Build or import your prospect table. Add enrichment columns (company description, recent news, pain points) using Clay's built-in providers.\n\n**Step 2: Inside Za-Zu.** Connect the Clay table to a Za-Zu sequence. Za-Zu reads each row as a prospect, pulls the enrichment data, and generates the AI first touch.\n\n**Step 3: Inside Za-Zu.** Assign the sequence to a mailbox pool. This is where your Infrabox mailboxes live now, and they show up as a dropdown after the connect step above. Pick the pool you want for this campaign.\n\n**Step 4: Launch.** Za-Zu starts sending via the mailboxes' SMTP credentials, paces according to your daily limits, and routes replies into Za-Zu's inbox for you to handle.\n\nThe hand-off points are clean. Clay owns the data and enrichment. Za-Zu owns the AI writing and the sending orchestration. Infrabox owns the actual mailbox, the thing Gmail and Outlook see on the other end. Each tool handles exactly one layer.",
    },
    {
      heading: "Daily Sending Limits and Warmup",
      content: "Set these inside Za-Zu after the import completes:\n\n| Mailbox age | Daily send limit | Za-Zu config | Notes |\n|---|---|---|---|\n| Day 1-14 | 0 | Pause mailbox in Za-Zu, let Infrabox warm | Warmup only |\n| Day 15-30 | 15-20 | Set daily_limit = 15 | Early sends |\n| Day 31-60 | 25-40 | Set daily_limit = 30 | Full ramp |\n| Day 60+ | 40-50 | Set daily_limit = 40 | Steady state |\n\nZa-Zu does not ship its own warmup product. If you want warmup on these mailboxes, use one of:\n\n- **Infrabox isolated warmup add-on**: $3/mailbox/month, separate peer network, stays with the mailbox regardless of which sequencer you use\n- **Third-party warmup tool**: [TrulyInbox](/learn/infrabox-trulyinbox-integration), [Warmy](/learn/infrabox-warmy-integration), [MailToaster](/learn/infrabox-mailtoaster-integration), or [Warmforge](/learn/infrabox-warmforge-integration)\n\nPick one. Do not run two warmup engines on the same mailbox. It roughly doubles warmup-sent volume and confuses reputation signals at Gmail Postmaster. See [email warmup tools comparison](/learn/email-warmup-tools-comparison-2026) for a deeper look at each warmup engine.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The failure modes you are likely to hit:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password or 2FA on Za-Zu account | Verify login in a clean browser tab; disable 2FA temporarily if needed |\n| Green success but mailboxes missing in Za-Zu | Za-Zu sender slot limit hit | Upgrade Za-Zu plan or delete unused senders, then Retry Export |\n| 'IMAP handshake failed' on reply fetch | IMAP disabled at Google Workspace OU level | Enable IMAP in admin.google.com → Gmail → End User Access |\n| 'Clay table sync timeout' inside Za-Zu | Not an Infrabox issue, Clay webhook latency | Retry inside Za-Zu, not Infrabox |\n| Mailbox disconnects after password rotation | Password changed on underlying mailbox, Za-Zu SMTP session stale | Re-connect the mailbox in Za-Zu or re-run export in Infrabox |\n\n**On Clay-specific errors:** Za-Zu connects to Clay via webhook, and that connection is maintained inside Za-Zu, not inside Infrabox. If your Clay integration breaks, that has nothing to do with the Infrabox mailbox side. It is a Za-Zu ↔ Clay issue. Check Za-Zu → Integrations → Clay → Webhook Status first before touching anything on the Infrabox side.",
    },
    {
      heading: "Verifying the Connection Works",
      content: "Smoke test every new Za-Zu connection:\n\n**Test 1: send test email from one mailbox.** In Za-Zu → Mailboxes → (pick one) → Send Test. Confirm delivery <30 seconds.\n\n**Test 2: reply round-trip.** Reply to the test. Check Za-Zu's inbox within 2 minutes. If the reply appears, IMAP is working.\n\n**Test 3: one-prospect pilot sequence.** Before loading 500 prospects, run a 1-prospect test sequence end-to-end. You are verifying that Za-Zu's AI generates a reasonable first touch, sends it from the Infrabox mailbox, and logs the event correctly. If all three work, scale the sequence.\n\n**Test 4: inbox placement test.** Send a seed-list test (Gmail, Outlook, Yahoo, Hotmail). Target: 9/10+ score. Below 8/10 means something in the DNS or warmup layer needs work. See [inbox placement testing explained](/learn/inbox-placement-testing-explained) for the full methodology and common failure modes.",
    },
  ],
  faqs: [
    { question: "Does Za-Zu charge per Infrabox mailbox connected?", answer: "Za-Zu bills per sender slot. Each Infrabox mailbox you push into Za-Zu counts as one sender seat, regardless of how many sequences you run from it. Plan your mailbox count against Za-Zu's seat pricing tiers before you export. Infrabox gives you 10 mailboxes at [$39/month on the Professional plan](/learn/infrabox-pricing), so make sure your Za-Zu tier supports that many senders." },
    { question: "Can I use one Infrabox mailbox in both Za-Zu and another sequencer?", answer: "Technically yes, but we don't recommend it. Two sequencers sending from the same mailbox will race on Google's per-minute rate limit, fight over IMAP read flags, and make reply attribution inconsistent. Dedicate each mailbox to one sequencer. If you need to split traffic, split by mailbox pool: 5 mailboxes for Za-Zu, 5 for whatever else." },
    { question: "Does Za-Zu pull Clay prospect data automatically once connected, or do I have to re-import?", answer: "Za-Zu pulls from Clay via its own integration, which is set up inside Za-Zu → Integrations → Clay. The Infrabox connection handles only the mailbox side. Connecting Infrabox does not automatically re-import Clay prospects. You set that up once inside Za-Zu and it stays linked." },
    { question: "Is Za-Zu a good fit if I don't use Clay?", answer: "Za-Zu works without Clay. You can upload prospects via CSV or the Za-Zu UI. But its biggest wedge is the Clay integration, so if you are not a Clay user the comparative advantage shrinks and tools like [Instantly](/learn/infrabox-instantly-integration) or [Smartlead](/learn/infrabox-smartlead-integration) may suit you better for general cold outreach." },
    { question: "What happens to my Za-Zu sequences if I delete an Infrabox mailbox?", answer: "Za-Zu will start getting SMTP auth failures on the next send attempt and pause the mailbox after 3 consecutive failures. Existing sequences continue but skip that mailbox. Clean up stale mailbox references inside Za-Zu manually once a quarter to keep your sending pool tidy." },
  ],
  sources: [
    { title: "Za-Zu Documentation", url: "https://za-zu.com/docs", date: "2026" },
    { title: "Clay Integrations Directory", url: "https://clay.com/integrations", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "email-infrastructure-setup-guide",
    "infrabox-instantly-integration",
    "email-warmup-tools-comparison-2026",
    "email-domain-setup-checklist",
  ],
};
