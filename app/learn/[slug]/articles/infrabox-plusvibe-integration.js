export const article = {
  slug: "infrabox-plusvibe-integration",
  title: "Connect Infrabox to PlusVibe (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to PlusVibe, the AI personalization tool with 80+ data sources and unlimited warmup.",
  headline: "Connect Infrabox Mailboxes to PlusVibe in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["PlusVibe integration", "AI personalization", "email setup", "Google Workspace", "Microsoft 365", "unlimited warmup"],
  excerpt: "PlusVibe (formerly known as pipl) runs 80+ AI personalization sources per prospect and ships unlimited warmup. Infrabox connects via standard credentials. Here is the exact flow.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with PlusVibe connected", caption: "Infrabox Sequencers page, PlusVibe sits in the Outreach category next to other AI-personalization tools." },
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox Mailboxes ready to export to PlusVibe", caption: "Infrabox Mailboxes page showing the mailboxes you can batch-push into a PlusVibe campaign." },
  ],
  sections: [
    {
      heading: "The Fast Path: Email + Password Into PlusVibe",
      content: "PlusVibe connects to Infrabox via a standard email + password flow in the Sequencers Connect screen. You paste your PlusVibe login, Infrabox validates against the PlusVibe API, and every selected Infrabox mailbox gets provisioned inside PlusVibe as a new sender. The full connect takes about 90 seconds.\n\nOne naming note that confuses new users: inside Infrabox's sequencer metadata, PlusVibe is listed under the internal platform key `pipl` (the product's original name). The user-facing name everywhere else is PlusVibe, and the website is plusvibe.ai. You will see 'PlusVibe' in the connect screen, but if you look at the underlying API payload or database entries the platform key shows as `pipl`. That's cosmetic, it doesn't affect the flow.",
    },
    {
      heading: "Why PlusVibe's 80+ Data Sources Matter for Deliverability",
      content: "PlusVibe's big wedge is AI personalization pulling from 80+ data sources per prospect: not just name and company, but recent LinkedIn posts, GitHub commits, podcast appearances, funding announcements, job changes, and more. For Infrabox users, the relevant consequence is that each outgoing email has much higher variance than templated outreach, which matters for Gmail's spam filter.\n\n| Personalization level | Variance per 1000 sends | Gmail spam classification risk |\n|---|---|---|\n| Templated (Hi [firstName]) | Low, ~50 unique variations | High: patterns get flagged |\n| Merge-tag based | Medium, ~500 unique variations | Medium |\n| PlusVibe-style 80-source AI | High: essentially unique per prospect | Low |\n\nThe more unique each message is, the less likely Gmail's classifier is to detect it as bulk outreach. This is the same principle behind [Salesforge's Agent Frank](/learn/infrabox-salesforge-integration) and similar AI-writing tools, but PlusVibe's multi-source approach pushes it further. For a deeper look at how message variance affects spam scoring, see [why emails go to spam](/learn/why-emails-go-to-spam).",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Gather these first:\n\n| Item | Where | Required |\n|---|---|---|\n| PlusVibe account (any paid plan) | plusvibe.ai | Yes |\n| PlusVibe login email |, | Yes |\n| PlusVibe password |, | Yes |\n| Infrabox mailboxes provisioned | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes |\n| Prospect list with enrichable fields (LinkedIn URL at minimum) | Your source | Yes, for the 80-source AI to actually work |\n\n**The enrichment prereq.** PlusVibe's personalization engine works by looking up 80+ sources per prospect, but it needs something to look up from. At minimum, you want a LinkedIn URL or a company domain per row. Without those anchor fields, PlusVibe falls back to basic merge tags, which defeats the whole reason to pay for it. Build your prospect list with enrichable fields before you run a campaign: most teams source from [Clay](/learn/infrabox-zazu-integration), Apollo, or LinkedIn Sales Navigator and feed the output into PlusVibe via CSV.",
    },
    {
      heading: "Step-by-Step: Connect PlusVibe in Infrabox",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** category and pick **PlusVibe** | 5 sec |\n| 3 | Enter **Email**: your PlusVibe (pipl) login | 5 sec |\n| 4 | Enter **Password**: your PlusVibe password | 5 sec |\n| 5 | Click **Connect Account** |, |\n| 6 | Infrabox validates credentials against PlusVibe's API | 1-3 sec |\n| 7 | Selected Infrabox mailboxes pushed into PlusVibe as senders | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90 seconds.**\n\nPlusVibe uses the standard credential flow: no workspace picker, no API key, no custom validation UI. If you have access to multiple PlusVibe workspaces, the connect defaults to your active workspace; switch inside PlusVibe before running the export if you need a specific one.",
    },
    {
      heading: "Unlimited Warmup: What PlusVibe Ships and When to Use It",
      content: "PlusVibe includes unlimited warmup as part of every paid plan, the same design as [Emelia](/learn/infrabox-emelia-integration) and [Instantly](/learn/infrabox-instantly-integration). Here is how it stacks against the Infrabox isolated warmup add-on:\n\n| Warmup option | Cost | Network | When to pick |\n|---|---|---|---|\n| PlusVibe built-in | Included in PlusVibe plan | Shared peer pool | If every mailbox stays in PlusVibe long-term |\n| Infrabox isolated warmup | $3/mailbox/month | Separate peer network | Multi-sequencer setup, or if you move mailboxes |\n\nFor PlusVibe-only users, the built-in warmup is the right choice because it's free at the margin. For mixed setups (some mailboxes in PlusVibe, some in Smartlead, some in Instantly), the Infrabox isolated warmup gives you one consistent reputation trajectory regardless of which sender uses a given mailbox on a given day.\n\n**Do not run both at once.** The double-warmup trap applies here just like with [MailToaster](/learn/infrabox-mailtoaster-integration) and [Warmy](/learn/infrabox-warmy-integration). Running two warmup engines on one mailbox roughly doubles warmup volume and confuses Gmail Postmaster reputation signals. Pick one and toggle the other off.",
    },
    {
      heading: "Daily Sending Limits Inside PlusVibe",
      content: "Set these inside PlusVibe → Accounts → (select mailbox) → Daily Limit after the import completes:\n\n| Mailbox age | Safe daily send | PlusVibe daily_limit | Notes |\n|---|---|---|---|\n| Day 1-14 | 0 | 0 | Warmup only |\n| Day 15-30 | 15-20 | 15 | Early sends |\n| Day 31-60 | 25-40 | 30 | Full ramp |\n| Day 60+ | 40-50 | 40 | Steady state |\n\nPlusVibe's personalization-heavy sends actually tend to land better than templated outreach at the same daily volume, but don't push the mailbox beyond 50/day as a hard ceiling. [Google Workspace's per-day cap](/learn/email-sending-limits-google-microsoft) is 2,000 external recipients, but nobody running real email should ever come close to that number on a single mailbox. Scale horizontally with more mailboxes: see [scale email 100 to 10000](/learn/scale-email-100-to-10000) for the math.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The failure modes to watch for:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password, or 2FA on PlusVibe | Verify login in a clean browser; disable 2FA during connect |\n| Success but mailboxes missing in PlusVibe | Plan sender cap hit | Upgrade PlusVibe plan or delete unused senders, then Retry Export |\n| Personalization falls back to merge tags | Prospect records missing LinkedIn/domain | Fix the source CSV before re-running the campaign |\n| 'IMAP handshake failed' on reply fetch | IMAP disabled at Google Workspace OU | Enable IMAP in admin.google.com → Gmail → End User Access |\n| Warmup volume stuck at 0 | PlusVibe warmup paused or double-warmup conflict | Check PlusVibe → Mailbox → Warmup toggle, and turn off Infrabox warmup if active |\n\n**On the personalization fallback.** This is a silent failure mode specific to PlusVibe. If the source data is thin, PlusVibe will send the email using basic merge tags instead of full AI personalization, and you will only notice because your open rate doesn't improve. Check PlusVibe → Campaign → (select sequence) → Personalization Coverage. You want ≥80% of rows showing 'Full AI' personalization. Below that, your source data is the problem, not PlusVibe.",
    },
    {
      heading: "Verifying the Integration Works",
      content: "Four smoke tests:\n\n**Test 1: mailbox test send.** In PlusVibe → Accounts → (pick Infrabox mailbox) → Send Test. Confirm delivery in <30 seconds with DKIM passing in headers.\n\n**Test 2: personalization quality.** Run a 5-prospect test sequence with real enriched data. Read each generated first touch. Are they actually distinct? Do they reference something specific about the prospect (a recent post, a company announcement)? If every email looks the same, the personalization engine isn't firing: check your source data.\n\n**Test 3: reply round-trip.** Reply to one of your test sends. Within 2 minutes, PlusVibe's unified inbox should show the reply. If not, IMAP is broken.\n\n**Test 4: inbox placement test.** Run a [seed-list test](/learn/inbox-placement-testing-explained) across Gmail, Outlook, Yahoo, Hotmail. Target 9/10+. PlusVibe's high-variance outputs should land better than templated alternatives, if your score is below 8/10 despite that, the DNS or warmup side needs work.",
    },
  ],
  faqs: [
    { question: "Is PlusVibe the same product as pipl?", answer: "Same product, new name. The platform rebranded from pipl.ai to plusvibe.ai, but the underlying Infrabox integration still carries the internal platform key `pipl` in the sequencer metadata. You'll see 'PlusVibe' everywhere in the user-facing UI. The website is plusvibe.ai." },
    { question: "Does PlusVibe work with Microsoft 365 mailboxes from Infrabox?", answer: "Yes. PlusVibe uses SMTP/IMAP, so Google Workspace and Microsoft 365 both work. The prereq for Microsoft 365 is Authenticated SMTP enabled at the mailbox level. Infrabox handles this automatically during provisioning." },
    { question: "Can PlusVibe personalize emails without LinkedIn data?", answer: "Yes, but you lose most of the 80-source advantage. PlusVibe can fall back to company-level enrichment (domain → company data), but the quality drops significantly without prospect-level signals. For the best results, include LinkedIn URLs in your source list. If you can't get LinkedIn URLs, consider pairing with Clay enrichment before feeding the data into PlusVibe." },
    { question: "How does PlusVibe's AI compare to Salesforge's Agent Frank?", answer: "Both use AI to generate personalized first touches, but their approaches differ. Agent Frank is an autonomous SDR that runs a full sequence end-to-end with its own judgment on follow-up timing. PlusVibe is more of a personalization engine, it writes the email but leaves campaign orchestration to you. For a fully hands-off AI SDR, Salesforge. For maximum personalization with human oversight, PlusVibe." },
    { question: "Does running multiple campaigns in PlusVibe split mailbox usage evenly?", answer: "PlusVibe uses round-robin distribution across connected mailboxes within a single campaign. If you run two campaigns simultaneously on the same mailbox pool, both draw from the same pool and can compete for daily send capacity. Set per-campaign daily caps in PlusVibe → Campaign Settings to prevent one campaign from eating all the send quota." },
  ],
  sources: [
    { title: "PlusVibe Documentation", url: "https://docs.plusvibe.ai", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "why-emails-go-to-spam",
    "infrabox-salesforge-integration",
    "email-warmup-tools-comparison-2026",
    "inbox-placement-testing-explained",
  ],
};
