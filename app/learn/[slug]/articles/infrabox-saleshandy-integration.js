export const article = {
  slug: "infrabox-saleshandy-integration",
  title: "Connect Infrabox to Saleshandy (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Saleshandy, 800M+ B2B database with sender rotation and unified inbox.",
  headline: "Connect Infrabox Mailboxes to Saleshandy in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Saleshandy integration", "B2B database", "sender rotation", "email setup", "Google Workspace", "Microsoft 365"],
  excerpt: "Saleshandy bundles an 800M+ B2B database with sender rotation and a unified inbox. Infrabox provides the mailboxes. Here is the exact connect flow, plus how rotation changes volume math.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Saleshandy connected", caption: "Infrabox Sequencers page, Saleshandy in the Outreach category alongside Instantly, Smartlead, and Reply.io." },
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox Mailboxes ready for Saleshandy batch export", caption: "Infrabox Mailboxes page, Saleshandy's sender rotation works best with 10+ mailboxes pushed together." },
  ],
  sections: [
    {
      heading: "The Fast Path: Credentials Into Saleshandy",
      content: "Saleshandy connects to Infrabox via standard email + password in the Sequencers Connect screen. Paste your Saleshandy login, Infrabox validates against their API, and every selected Infrabox mailbox gets provisioned inside Saleshandy as a new sender. The connect takes about 90 seconds.\n\nSaleshandy's differentiators are its built-in 800M+ B2B contact database (you can source prospects directly inside the tool instead of importing from Apollo or ZoomInfo) and its sender rotation logic (Saleshandy automatically splits a campaign across multiple mailboxes to keep each one under reputation thresholds). Both of those work best when paired with real mailboxes, which is where Infrabox comes in.",
    },
    {
      heading: "Sender Rotation: How It Changes the Mailbox-Count Math",
      content: "Saleshandy's sender rotation distributes a campaign's daily send volume across every connected mailbox automatically. You don't manually configure 'mailbox 1 does 10, mailbox 2 does 15', Saleshandy just spreads the load. The practical effect is that you should push more Infrabox mailboxes than you would for tools without rotation.\n\n| Campaign size | No rotation (manual split) | Saleshandy rotation | Mailboxes needed |\n|---|---|---|---|\n| 1,000 sends/month | 1 mailbox at 33/day | 3 mailboxes at 11/day | 3 |\n| 5,000 sends/month | 4 mailboxes at 41/day (risky) | 12 mailboxes at 14/day | 12 |\n| 10,000 sends/month | 8 mailboxes at 42/day (risky) | 25 mailboxes at 13/day | 25 |\n\nThe thin-distribution approach is what protects reputation. At 13-14/day per mailbox, each sender looks like a moderate-volume professional, not a bulk email machine. Reputation holds steady and deliverability stays high. For the math on how per-mailbox volume maps to reputation, see [scale email 100 to 10000](/learn/scale-email-100-to-10000).\n\n**Infrabox plan fit.** 25 mailboxes means [Agency plan at $99/month](/learn/infrabox-pricing). The math is: $99 + 25 × $3.25 extra-mailbox cost = ~$180/month for 25 mailboxes. Compare that to pushing 8 mailboxes into a tool without rotation and getting worse deliverability. The Agency tier plus Saleshandy rotation is a much better cost-per-reliable-send ratio at volume.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Gather these:\n\n| Item | Where | Required |\n|---|---|---|\n| Saleshandy account (any paid plan) | saleshandy.com | Yes |\n| Saleshandy login email |, | Yes |\n| Saleshandy password |, | Yes |\n| Infrabox mailboxes provisioned (10+ recommended) | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes |\n| Saleshandy plan with B2B database access (optional) | Saleshandy → Billing | Optional: only if using the database |\n\n**On the 800M database.** Saleshandy's contact database is behind a paid tier of the Saleshandy plan, it's not free with every account. If you're not using the database, you can connect on a lower tier and use Saleshandy purely as a sender + unified inbox. For teams bringing their own prospect data (from Clay, Apollo, LinkedIn Sales Navigator), the basic Saleshandy plan plus the Infrabox mailbox layer is the cheapest configuration.",
    },
    {
      heading: "Step-by-Step: Connect Saleshandy",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** category and pick **Saleshandy** | 5 sec |\n| 3 | Enter **Email**: your Saleshandy login | 5 sec |\n| 4 | Enter **Password**: your Saleshandy password | 5 sec |\n| 5 | Click **Connect Account** |, |\n| 6 | Infrabox validates credentials via Saleshandy's API | 1-3 sec |\n| 7 | Selected Infrabox mailboxes pushed into Saleshandy | 30-60 sec (slightly slower than most because of rotation registration) |\n| 8 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 2 minutes.**\n\nThe slightly longer export time is because Saleshandy registers each mailbox into its rotation pool during the push, which requires an extra API call per mailbox. For a 10-mailbox export, expect ~40-60 seconds.",
    },
    {
      heading: "Daily Sending Limits and Ramp-Up With Rotation",
      content: "Because Saleshandy rotates automatically, you set a *total daily volume* at the campaign level and Saleshandy figures out the per-mailbox distribution. The ramp-up still matters, though: new mailboxes should stay in warmup-only for days 1-14 and gradually contribute to campaigns after that.\n\n| Mailbox age | Safe per-mailbox send | Campaign total possible (10 mailboxes) |\n|---|---|---|\n| Day 1-14 | 0 (warmup only) | 0 |\n| Day 15-30 | 15 | 150/day |\n| Day 31-60 | 30 | 300/day |\n| Day 60+ | 40 | 400/day |\n\n**Mixed-age pool.** If you have some mailboxes at day 30 and others at day 60, Saleshandy applies per-mailbox caps and rotates accordingly. Set the mature mailboxes to 40/day and the new ones to 15/day, and the rotation will naturally skew volume toward the mature mailboxes. This is the right way to scale a campaign: add new mailboxes to the pool, start them at 15/day, let them mature, bump them up after day 30.\n\n**Warmup.** Saleshandy does not ship built-in warmup: pair with [Infrabox isolated warmup](/learn/email-warmup-guide) at $3/mailbox/month, or a dedicated tool like [TrulyInbox](/learn/infrabox-trulyinbox-integration) or [Warmy.io](/learn/infrabox-warmy-integration). Do not run two warmup engines on the same mailbox simultaneously.",
    },
    {
      heading: "The Unified Inbox: Handling Replies at Scale",
      content: "Saleshandy's unified inbox aggregates replies across every connected Infrabox mailbox. At 25 mailboxes running, you could see 50-200 replies/day depending on response rate. The unified inbox is the tool that makes this manageable.\n\n| Feature | Saleshandy Unified Inbox |\n|---|---|\n| Reply aggregation | Yes, all mailboxes in one view |\n| Auto-classification | Positive / neutral / OOO / bounce / unsub |\n| Assignment to team members | Yes (on Agency and up) |\n| SLA tracking | Yes |\n| Cross-tool aggregation | No, Saleshandy-only |\n\nFor a single-sender-tool setup (Saleshandy only), the unified inbox is plenty. If you're running multiple senders (Saleshandy + Instantly + Smartlead), stack [Master Inbox](/learn/infrabox-masterinbox-integration) on top for cross-tool aggregation.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The failure modes for Infrabox → Saleshandy connections:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password, or 2FA on Saleshandy account | Verify login in a clean browser; disable 2FA during connect |\n| Mailboxes in Saleshandy but rotation not active | Campaign not yet configured to use the mailbox pool | Saleshandy → Campaign → Sender Settings → attach the pool |\n| Some mailboxes missing after batch export | Sender cap on Saleshandy plan hit | Upgrade Saleshandy or delete unused senders |\n| 'IMAP handshake failed' on reply fetch | IMAP disabled at Google Workspace OU | Enable IMAP in admin.google.com → Gmail → End User Access |\n| Rotation fires but some mailboxes never used | Saleshandy per-account throttle detected new mailbox as risky | Wait 7 days, Saleshandy's throttle auto-releases as reputation improves |\n\n**On the rotation throttle.** This is worth flagging because it looks like the rotation is broken when it's actually working correctly. Saleshandy tracks per-mailbox reputation internally and throttles mailboxes it thinks are at risk. For new mailboxes, Saleshandy may skip them in rotation for the first 3-7 days even if they're technically available. The fix is patience: let warmup finish, let Saleshandy observe a week of healthy sending, and the throttle auto-releases.",
    },
    {
      heading: "Verifying the Connection Works",
      content: "Five checks before scaling a campaign:\n\n**Test 1: all mailboxes appear in Saleshandy.** Log into Saleshandy and open Email Accounts. Confirm every Infrabox mailbox you exported is listed with status 'Active'.\n\n**Test 2: rotation is firing.** Run a 100-prospect test campaign. After Saleshandy sends the first 50, check which mailboxes actually sent. You want to see ~5 per mailbox across 10 mailboxes, not 50 from one mailbox. If it's lopsided, rotation is either disabled or throttled.\n\n**Test 3: reply round-trip into unified inbox.** Reply to one of the test sends. Within 2 minutes, the reply should appear in Saleshandy's unified inbox with an auto-classification. If it doesn't, IMAP is broken.\n\n**Test 4: inbox placement.** Run a [seed-list test](/learn/inbox-placement-testing-explained) across Gmail, Outlook, Yahoo, Hotmail. Target 9/10+. Saleshandy's thin-rotation approach should land you consistently above 9/10 for any properly warmed mailbox pool.\n\n**Test 5: sender reputation after 7 days.** After a week of real campaign sends, check [Google Postmaster Tools](/learn/google-postmaster-tools-guide) for your sending domain. You want 'High' or 'Medium' reputation. If it's declining, something is wrong: usually warmup or DNS, not Saleshandy itself.",
    },
  ],
  faqs: [
    { question: "Can Saleshandy's rotation work with just 2-3 Infrabox mailboxes?", answer: "Yes, but the advantage shrinks. Sender rotation's whole point is thin distribution, and at 2-3 mailboxes you're already near the per-mailbox ceiling. Rotation really kicks in at 10+ mailboxes, which is why we recommend the Infrabox Agency tier ($99 for 30 mailboxes) when pairing with Saleshandy. For small-scale outreach with 1-3 mailboxes, [Instantly](/learn/infrabox-instantly-integration) or [Smartlead](/learn/infrabox-smartlead-integration) are simpler fits." },
    { question: "Does Saleshandy pull prospect data from Clay, or only its own database?", answer: "Saleshandy supports CSV upload, so you can bring data from Clay, Apollo, LinkedIn Sales Navigator, or anywhere else. The built-in 800M database is an add-on for teams that want to skip the enrichment step and source prospects inside Saleshandy directly. Many users bring external enriched data and skip the database." },
    { question: "How does Saleshandy's unified inbox compare to a dedicated tool like Hothawk?", answer: "Saleshandy's unified inbox is scoped to Saleshandy-only, it aggregates replies from Saleshandy campaigns and nothing else. [Hothawk](/learn/infrabox-hothawk-integration) and [Master Inbox](/learn/infrabox-masterinbox-integration) aggregate across multiple tools. If you're running Saleshandy as your only outreach tool, the built-in unified inbox is enough. If you're running multiple tools, add a cross-tool aggregator on top." },
    { question: "Can I pause Saleshandy rotation and manually assign sends to specific mailboxes?", answer: "Yes. Saleshandy → Campaign Settings → Sender Strategy → Manual. This disables rotation and lets you pick which mailbox handles each prospect. Most teams use rotation as the default and only override for specific VIP prospects where they want a specific sender's relationship history." },
    { question: "What happens to an in-progress campaign if I delete an Infrabox mailbox?", answer: "Saleshandy will start getting SMTP auth failures on sends routed to the deleted mailbox and pause it after 3 consecutive failures. Rotation automatically excludes paused mailboxes, so the campaign keeps running on the remaining pool. Clean up the Saleshandy sender list manually once a quarter to remove stale references." },
  ],
  sources: [
    { title: "Saleshandy Documentation", url: "https://docs.saleshandy.com", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "scale-email-100-to-10000",
    "infrabox-instantly-integration",
    "infrabox-masterinbox-integration",
    "email-warmup-guide",
  ],
};
