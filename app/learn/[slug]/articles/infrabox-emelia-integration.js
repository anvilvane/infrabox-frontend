export const article = {
  slug: "infrabox-emelia-integration",
  title: "Connect Infrabox to Emelia (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Emelia for email + LinkedIn outreach with built-in warmup.",
  headline: "Connect Infrabox Mailboxes to Emelia in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Emelia integration", "LinkedIn outreach", "email setup", "Google Workspace", "Microsoft 365", "beginner friendly"],
  excerpt: "Emelia is the beginner-friendly multichannel tool: email and LinkedIn in one dashboard. Infrabox handles the mailbox side via a standard credential flow. Here is the full setup.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Emelia connected", caption: "Infrabox Sequencers page, Emelia in the Outreach category with its standard credential flow." },
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox Mailboxes ready for Emelia export", caption: "Infrabox Mailboxes page showing the mailboxes you can select for a batch push to Emelia." },
  ],
  sections: [
    {
      heading: "The Fast Path: Email + Password Into Emelia",
      content: "Emelia connects to Infrabox via a standard credential form in the Sequencers Connect screen. You paste your Emelia login email and password, Infrabox validates them against Emelia's API, and every selected Infrabox mailbox gets provisioned inside Emelia as a new sender. The entire connect takes about 90 seconds end to end.\n\nEmelia positions itself as the 'beginner-friendly' option in the outreach category: one dashboard for email plus LinkedIn, a built-in warmup engine, and a unified view of both channels. That design choice matters for Infrabox users because Emelia's LinkedIn side does not touch the Infrabox mailbox at all, it runs from your LinkedIn session. The Infrabox connection only handles the email half of the pipeline.",
    },
    {
      heading: "What You Need Before Connecting",
      content: "Gather these before opening the Sequencers Connect screen:\n\n| Item | Where | Required |\n|---|---|---|\n| Emelia account (any paid plan) | emelia.io | Yes |\n| Emelia login email |, | Yes |\n| Emelia account password |, | Yes |\n| Infrabox mailboxes provisioned and DNS live | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes (for reply tracking) |\n| LinkedIn sales account (if using LinkedIn side) | linkedin.com | Optional |\n\n**The beginner note.** Emelia's UX is more hand-holdy than [Smartlead](/learn/infrabox-smartlead-integration) or [Instantly](/learn/infrabox-instantly-integration), but the underlying SMTP/IMAP mechanics are identical. The same Google Workspace admin settings that block a Smartlead connection will block an Emelia connection, IMAP at OU level, 2-Step Verification for Gmail app passwords, and Authenticated SMTP for Microsoft 365. Don't let Emelia's friendly wizard fool you into skipping those prereqs. See the [email domain setup checklist](/learn/email-domain-setup-checklist) for the complete admin checklist.",
    },
    {
      heading: "Step-by-Step: Connect Emelia in Infrabox",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** and pick **Emelia** | 5 sec |\n| 3 | Enter **Email**: your Emelia login | 5 sec |\n| 4 | Enter **Password**: your Emelia password | 5 sec |\n| 5 | Click **Connect Account** |, |\n| 6 | Infrabox validates credentials against Emelia's API | 1-3 sec |\n| 7 | Selected Infrabox mailboxes pushed to Emelia as senders | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90 seconds.**\n\nEmelia uses the standard credential flow: no workspace picker, no API key, no custom validation UI. Validation happens on submit, so you'll know within 2 seconds whether the credentials are correct.",
    },
    {
      heading: "The LinkedIn Side of Emelia (and Why It Does Not Touch Infrabox)",
      content: "Emelia is one of the few outreach tools that bundles LinkedIn automation into the same dashboard as email. For Infrabox users, it is important to understand that the LinkedIn side of Emelia runs entirely off your LinkedIn session, it has nothing to do with your Infrabox mailboxes.\n\n| Channel | What Emelia handles | What Infrabox provides |\n|---|---|---|\n| Email | Sequence orchestration, inbox warmup, reply routing | The actual Google Workspace / Microsoft 365 mailbox |\n| LinkedIn messages | Connection requests, follow-ups via your LinkedIn session |, (LinkedIn doesn't use email mailboxes) |\n| LinkedIn profile views | Automated profile views |, |\n| Multi-channel sequences | Email step → LinkedIn step → email step | Only the email steps touch Infrabox mailboxes |\n\n**The practical implication.** If you are using Emelia's multichannel sequences, only the email steps hit your Infrabox mailboxes and count against your daily send limits. The LinkedIn steps run from your LinkedIn session and are limited by LinkedIn's own rate limits (~100 connection requests per week, ~80 messages per day).\n\nIf email is the priority and LinkedIn is secondary, Emelia is fine. If LinkedIn is the priority, you may want a LinkedIn-first tool instead. For Infrabox users focused mostly on email, [Smartlead](/learn/infrabox-smartlead-integration) or [Instantly](/learn/infrabox-instantly-integration) typically deliver more campaign-management power per dollar.",
    },
    {
      heading: "Emelia's Built-In Warmup vs Infrabox Warmup",
      content: "Emelia ships a built-in warmup engine as part of every paid plan. The Infrabox isolated warmup add-on costs an extra $3/mailbox/month. You have to pick one per mailbox.\n\n| Warmup option | Cost | Network | When to pick |\n|---|---|---|---|\n| Emelia built-in | Included in Emelia plan | Emelia shared pool | If every mailbox lives inside Emelia long-term |\n| Infrabox isolated | $3/mailbox/month | Separate peer network | Multi-sequencer setups, or if you move mailboxes |\n\nEmelia's warmup is a shared-pool design, your mailbox's warmup traffic mingles with other Emelia tenants' warmup. That is typical for bundled-warmup outreach tools and is fine for most use cases. Infrabox's isolated warmup is a separate peer network, which gives you cleaner reputation signals but costs $3/month extra.\n\n**Do not run both at once.** Running two warmup engines on one mailbox roughly doubles warmup-sent volume, confuses reputation signals at [Google Postmaster Tools](/learn/google-postmaster-tools-guide), and can cause a deliverability dip. Toggle one off when the other turns on. For a deeper look at how warmup networks work internally, see [email warmup guide](/learn/email-warmup-guide).",
    },
    {
      heading: "Daily Sending Limits for Emelia",
      content: "Set these inside Emelia → Accounts → (select mailbox) → Daily Limit after the import completes:\n\n| Mailbox age | Safe daily send | Emelia daily_limit | Notes |\n|---|---|---|---|\n| Day 1-14 | 0 | 0 | Warmup only |\n| Day 15-30 | 10-20 | 15 | Ramp slowly |\n| Day 31-60 | 25-35 | 30 | Full ramp |\n| Day 60+ | 40-50 | 40 | Steady state |\n\nEmelia's ramp-up recommendation is slightly more conservative than [Instantly's](/learn/infrabox-instantly-integration) by default, it tends to cap new mailboxes at 10/day for the first two weeks of real sending. You can override this inside Emelia → Campaign Settings, but for deliverability reasons, keep the cap low in the first two weeks even if the tool allows more. See [email sending volume limits guide](/learn/email-sending-volume-limits-guide) for the math on how ramp-up affects reputation.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The typical failure modes for Infrabox → Emelia connections:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password, or 2FA on Emelia account | Verify login in a clean browser tab; disable 2FA during connect, re-enable after |\n| Success but mailboxes missing in Emelia | Sender cap reached on Emelia plan | Upgrade Emelia tier or delete unused senders, then Retry Export |\n| 'IMAP handshake failed' on reply fetch | IMAP disabled at Google Workspace OU level | Enable IMAP in admin.google.com → Gmail → End User Access |\n| Mailbox shows 'Warming' in Emelia forever | Emelia warmup engine requires 5+ days of history before switching to Active | Wait 5 days; if stuck longer, contact Emelia support |\n| LinkedIn step in a sequence fails but email step succeeds | LinkedIn session cookie expired: not an Infrabox issue | Re-authenticate LinkedIn inside Emelia → Integrations |\n\nThe LinkedIn failure mode is important to flag because the error can masquerade as an Infrabox connection problem. If the email steps work fine but the LinkedIn step fails, that is entirely on Emelia's LinkedIn integration and has nothing to do with your Infrabox mailboxes. Debug it from Emelia → Integrations → LinkedIn, not Infrabox.",
    },
    {
      heading: "Verifying the Integration Works",
      content: "Four checks before launching your first sequence:\n\n**Test 1: mailbox test send.** In Emelia → Accounts → (select Infrabox mailbox) → Send Test. Confirm delivery in <30 seconds with DKIM passing in headers.\n\n**Test 2: reply round-trip.** Reply to the test. Within 2 minutes, Emelia's unified inbox should show the reply. If not, IMAP is broken: fix that before anything else.\n\n**Test 3: pilot sequence.** Run a 10-prospect test sequence from one mailbox for 2 days. Watch for zero bounces, zero complaints, and Emelia's deliverability score ≥85%. If all green, scale the sequence.\n\n**Test 4: inbox placement test.** Send a seed-list test (Gmail, Outlook, Yahoo, Hotmail). Look for 9/10+. Below 8/10 means the DNS or warmup layer needs more time. See [inbox placement testing explained](/learn/inbox-placement-testing-explained) for the diagnostic tree.",
    },
  ],
  faqs: [
    { question: "Does Emelia charge per Infrabox mailbox I push?", answer: "Emelia bills by sender count on most plans. Each Infrabox mailbox you push into Emelia counts as one sender seat. Compare Infrabox Professional at $39/month for 10 mailboxes against Emelia's sender-seat pricing before you export, and make sure your Emelia tier supports the mailbox count you're planning." },
    { question: "Can I use Emelia's built-in warmup on a mailbox Infrabox already warms?", answer: "Pick one. Running both at the same time roughly doubles warmup volume and confuses Gmail Postmaster reputation signals. If you are using the Infrabox $3/mailbox/month isolated warmup, turn Emelia's warmup toggle OFF for that mailbox. If you want to use Emelia's warmup instead, turn Infrabox's warmup OFF in Infrabox → Mailboxes → Warmup." },
    { question: "Does Emelia require LinkedIn for email to work?", answer: "No. Emelia's email side is fully functional without LinkedIn. If you skip the LinkedIn integration, the multichannel sequence types will be hidden but email-only sequences work exactly the same. Many Emelia customers run email-only and ignore the LinkedIn features entirely." },
    { question: "What happens to Emelia sequences if I rotate an Infrabox mailbox password?", answer: "Emelia stores the SMTP session credentials at connection time, so rotating the underlying password invalidates them. The next send from that mailbox will fail with 'Authentication failed' and Emelia will pause the mailbox after 3 failures. Fix: re-connect the mailbox in Emelia, or re-export from Infrabox → Sequencers → Emelia → Retry Export." },
    { question: "Is Emelia a good starter tool for someone who has never done email?", answer: "Emelia's UX is built for beginners and the built-in warmup reduces the number of decisions you have to make on day one. The trade-off is less power and fewer analytics than Smartlead or Instantly. If you're completely new to email and don't want to think about warmup separately, Emelia is a reasonable starter. Once you scale past ~5 mailboxes, most teams graduate to a tool with more granular controls." },
  ],
  sources: [
    { title: "Emelia Documentation", url: "https://docs.emelia.io", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google App Passwords", url: "https://support.google.com/accounts/answer/185833", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "email-warmup-guide",
    "infrabox-instantly-integration",
    "infrabox-smartlead-integration",
    "email-warmup-tools-comparison-2026",
  ],
};
