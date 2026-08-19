export const article = {
  slug: "infrabox-reachinbox-integration",
  title: "Connect Infrabox to ReachInbox (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to ReachInbox, AI sequence generator and Onebox unified inbox with optional workspace.",
  headline: "Connect Infrabox Mailboxes to ReachInbox in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["ReachInbox integration", "AI sequence generator", "Onebox", "email setup", "Google Workspace", "Microsoft 365"],
  excerpt: "ReachInbox ships an AI sequence generator with Onebox unified inbox and supports an optional workspace field. Here is the exact Infrabox connect flow for each case.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with ReachInbox connected", caption: "Infrabox Sequencers page, ReachInbox is in the Outreach category alongside PlusVibe and Salesforge." },
    { src: "/images/dashboard/exports.png", alt: "Infrabox exports tracking the ReachInbox push", caption: "Infrabox Exports page showing a ReachInbox push with per-mailbox status." },
  ],
  sections: [
    {
      heading: "The Fast Path: Credentials, Plus an Optional Workspace",
      content: "ReachInbox connects to Infrabox via email + password, with an optional workspace name field if your ReachInbox account has multiple workspaces. You enter the credentials, optionally type the workspace name, click Connect Account, and every selected Infrabox mailbox flows into ReachInbox as a new sender. The connect takes about 90 seconds.\n\nReachInbox's selling point is the AI sequence generator plus the Onebox unified inbox. The AI generator writes your first touch and follow-ups from a short campaign brief (similar to [Salesforge's Agent Frank](/learn/infrabox-salesforge-integration)), and Onebox aggregates all reply traffic into a single view like [Master Inbox](/learn/infrabox-masterinbox-integration) does, but scoped to ReachInbox only. Infrabox's integration handles the mailbox provisioning side so you never have to hand-paste SMTP credentials.",
    },
    {
      heading: "Credentials vs Optional Workspace: Which You Need",
      content: "ReachInbox's sequencer config in Infrabox has three fields:\n\n| Field | Required | Purpose |\n|---|---|---|\n| sequencer_login | Yes | Your ReachInbox account email |\n| sequencer_password | Yes | Your ReachInbox account password |\n| sequencer_workspace | No | Your ReachInbox workspace name (if applicable) |\n\n**When to fill in the workspace field.** If your ReachInbox account has only one workspace, leave it blank and ReachInbox defaults to that workspace. If your account has multiple workspaces (common for agencies running multiple clients), fill in the exact workspace name: case-sensitive, so the mailboxes land in the correct place. Misspelling the workspace name does not error out immediately; ReachInbox silently picks your default workspace instead, and you only notice because the mailboxes are in the wrong place.\n\nThis is different from [Master Inbox](/learn/infrabox-masterinbox-integration)'s two-step credential-then-dropdown flow. ReachInbox does not expose an API to list workspaces before validation, so you have to know the workspace name ahead of time and type it manually. If you don't know it, check ReachInbox → Settings → Workspaces and copy the exact name.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Have these ready:\n\n| Item | Where | Required |\n|---|---|---|\n| ReachInbox account (any paid plan) | reachinbox.ai | Yes |\n| ReachInbox login email |, | Yes |\n| ReachInbox password |, | Yes |\n| Target workspace name | ReachInbox → Settings → Workspaces | Yes if multi-workspace |\n| Infrabox mailboxes provisioned | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes |\n| Optional: Google OAuth client configured in ReachInbox | ReachInbox → OAuth Setup | Optional. Infrabox push uses SMTP so OAuth is not required for the connect itself |\n\n**The OAuth client ID note.** ReachInbox's sequencer config in Infrabox actually includes a reference to a Google OAuth client ID (`549360251880-maeh4okn7btu9cjtf0l2bt1t5b22sbf8.apps.googleusercontent.com`). This client ID belongs to ReachInbox's OAuth app and is used by ReachInbox internally when mailboxes connect via OAuth directly inside their dashboard. For the Infrabox push flow you don't need to do anything with it. Infrabox hands off mailboxes via SMTP credentials, and ReachInbox manages the OAuth layer if you later upgrade a specific mailbox to OAuth inside its own UI.",
    },
    {
      heading: "Step-by-Step: Connect ReachInbox in Infrabox",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** category and pick **ReachInbox** | 5 sec |\n| 3 | Enter **Email**: your ReachInbox login | 5 sec |\n| 4 | Enter **Password**: your ReachInbox password | 5 sec |\n| 5 | (Optional) Enter **Workspace**: exact workspace name if multi-workspace | 5 sec |\n| 6 | Click **Connect Account** |, |\n| 7 | Infrabox validates credentials via ReachInbox's auth endpoint | 1-3 sec |\n| 8 | Selected Infrabox mailboxes pushed into the chosen ReachInbox workspace | 20-40 sec |\n| 9 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90 seconds for a single-workspace setup; 2 minutes if you need to look up the workspace name first.**",
    },
    {
      heading: "AI Sequence Generator: How It Uses Your Mailboxes",
      content: "ReachInbox's AI sequence generator writes email sequences from a short campaign brief: typically 2-3 sentences describing your offer, target audience, and desired action. It then rotates sending across every connected Infrabox mailbox using a round-robin distributor.\n\n| Stage | What ReachInbox does | What Infrabox mailboxes do |\n|---|---|---|\n| Brief input | You type 2-3 sentences |, |\n| AI generation | ReachInbox writes first touch + 2-3 follow-ups |, |\n| Prospect matching | ReachInbox substitutes prospect-specific fields |, |\n| Rotation assignment | ReachInbox picks which mailbox sends which email | Infrabox mailbox receives send command |\n| SMTP send | ReachInbox sends via Infrabox mailbox SMTP | Mailbox relays through Google/Microsoft |\n| Reply fetch | ReachInbox polls via IMAP | Mailbox delivers reply |\n| Onebox aggregation | ReachInbox shows reply in unified view |, |\n\nThe round-robin rotation means your campaign's total daily volume is divided across the mailbox pool. If you connect 10 Infrabox mailboxes and run a campaign with 400 daily sends, each mailbox handles ~40/day. Stay below that ceiling or Google starts flagging the mailboxes as high-volume senders. See [email sending volume limits guide](/learn/email-sending-volume-limits-guide) for the full guardrails.",
    },
    {
      heading: "Onebox: The Unified Inbox After Replies Start Flowing",
      content: "Onebox is ReachInbox's unified reply view. Every reply to any of your connected Infrabox mailboxes lands in Onebox automatically, and ReachInbox runs AI classification on each (positive / objection / OOO / unsub / bounce) similar to [BrandJet's AI Unibox](/learn/infrabox-brandjet-integration).\n\n**How Onebox pulls replies.** ReachInbox polls each connected mailbox via IMAP every 30-60 seconds. The poll fetches new unread messages, runs them through the classifier, and displays them in Onebox with a classification label and the campaign they belong to. If a reply comes in but doesn't show up in Onebox within 2 minutes, IMAP is either disabled or throttled: see the Errors section below.\n\n**How Onebox compares to alternatives.** If you're running multiple senders (ReachInbox + Smartlead + Instantly) and want one unified view across all of them, use [Master Inbox](/learn/infrabox-masterinbox-integration) instead, Onebox only aggregates within ReachInbox. If ReachInbox is your only sender, Onebox is the simpler choice because it's included in the plan and doesn't require a second tool.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The typical failure modes for Infrabox → ReachInbox connections:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password, 2FA on ReachInbox account | Verify login in a clean browser, disable 2FA during connect |\n| Mailboxes land in the wrong workspace | Workspace name misspelled or case-mismatched | Fix workspace name, re-run the connect |\n| 'IMAP handshake failed' on reply fetch | IMAP disabled at Google Workspace OU | Enable IMAP in admin.google.com → Gmail → End User Access |\n| AI sequence generator skips merge tags | Prospect list missing the referenced fields | Add required columns to the prospect CSV before re-running |\n| Some mailboxes missing from ReachInbox after export | Plan sender cap hit, or rate limit during batch import | Upgrade plan or export in groups of 10 with 60s between |\n\n**On the workspace silent-failure mode.** ReachInbox does not validate the workspace name client-side, so a typo produces no error, your mailboxes just land in your default workspace instead. Double-check the workspace in ReachInbox immediately after the connect completes. If they're in the wrong place, remove them from ReachInbox → Workspace → Senders → Remove, fix the name in the Infrabox connect, and re-push.",
    },
    {
      heading: "Verifying the Connection Works",
      content: "Four smoke tests before loading a real campaign:\n\n**Test 1: correct workspace check.** Log into ReachInbox and confirm the imported mailboxes are in the workspace you expected. If not, fix before running any sequence.\n\n**Test 2: mailbox test send.** In ReachInbox → Accounts → (pick Infrabox mailbox) → Send Test. Confirm delivery in <30 seconds with DKIM passing.\n\n**Test 3: reply into Onebox.** Reply to the test. Within 2 minutes, Onebox should show the reply with a classification label. If not, IMAP is broken.\n\n**Test 4: AI sequence pilot.** Run a 5-prospect test sequence using ReachInbox's AI generator. Read each generated first touch to verify it makes sense. If the quality is off, tweak the brief inside ReachInbox and regenerate before scaling to a real campaign. And always run a [seed-list inbox placement test](/learn/inbox-placement-testing-explained): target 9/10+, escalate anything below 8/10.",
    },
  ],
  faqs: [
    { question: "Does ReachInbox's AI sequence generator count against my Infrabox mailbox volume?", answer: "Yes. Every email the AI generates gets sent from a real mailbox, so it consumes your daily send quota. Plan the campaign volume against the combined daily caps of your connected mailboxes. At 40/day per mailbox and 10 mailboxes, you have ~400/day in campaign headroom before you're at the reputation red line." },
    { question: "Can I use ReachInbox with a single Infrabox mailbox?", answer: "Yes, but you lose the rotation advantages. A single mailbox can only send ~40/day safely on email, so the AI sequence generator is capped at that volume. Single-mailbox ReachInbox setups are typical for solo founders or very early-stage outreach testing. Once you scale past 500/month, push more Infrabox mailboxes into the pool." },
    { question: "What happens if ReachInbox changes my OAuth client ID in the config?", answer: "Infrabox uses SMTP credentials for the push itself, so ReachInbox's internal OAuth client ID changing does not affect the connect flow. It would only matter if you later reconnect a specific mailbox via OAuth inside ReachInbox's own UI: in which case ReachInbox handles the client ID internally. There's no Infrabox-side action needed." },
    { question: "Is ReachInbox's Onebox a replacement for Master Inbox?", answer: "Only if you're running ReachInbox as your single sender. Onebox aggregates replies within ReachInbox's own mailbox pool. Master Inbox aggregates replies across multiple senders (Smartlead + Instantly + ReachInbox + Lemlist, etc.). If you're a pure ReachInbox shop, Onebox is enough. If you run multiple senders, stack Master Inbox on top." },
    { question: "Does the workspace field support special characters?", answer: "Yes, but be careful with apostrophes and slashes, ReachInbox's API sometimes normalizes them inconsistently. For the most reliable results, stick with letters, numbers, spaces, and dashes in your workspace names. If your workspace name has unusual characters, test the connect with a small mailbox batch first before running a full export." },
  ],
  sources: [
    { title: "ReachInbox Documentation", url: "https://docs.reachinbox.ai", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "infrabox-masterinbox-integration",
    "infrabox-salesforge-integration",
    "infrabox-brandjet-integration",
    "email-sending-volume-limits-guide",
  ],
};
