export const article = {
  slug: "infrabox-hothawk-integration",
  title: "Connect Infrabox to Hothawk (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Hothawk, the team-first inbox management tool for sales organizations.",
  headline: "Connect Infrabox Mailboxes to Hothawk in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Hothawk integration", "team inbox", "sales pipeline", "email setup", "Google Workspace", "Microsoft 365"],
  excerpt: "Hothawk sits in the 'inbox management' category, it's where sales teams collaborate on replies and run pipeline. Infrabox plugs in via a standard credential flow. Here is the exact setup.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Hothawk connected", caption: "Infrabox Sequencers page. Hothawk lives in the Inbox Management category alongside Master Inbox." },
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox Mailboxes ready for Hothawk team pool", caption: "Infrabox Mailboxes page showing the mailboxes you can push into a shared Hothawk team inbox." },
  ],
  sections: [
    {
      heading: "The Fast Path: Email + Password Into Hothawk",
      content: "Hothawk connects via standard email + password in the Infrabox Sequencers Connect screen. You paste your Hothawk login, Infrabox validates against Hothawk's API, and every selected Infrabox mailbox gets provisioned inside Hothawk as a shared team inbox. The entire connect takes about 90 seconds.\n\nHothawk is the only outreach-adjacent tool in the Infrabox catalog that lives in the **Inbox Management** category (alongside [Master Inbox](/learn/infrabox-masterinbox-integration)), not the Outreach category. That distinction matters: Hothawk is not an email sender. It is a shared inbox and pipeline tool for sales teams to collaborate on replies from email sequences they're already running elsewhere. You still need a sender like [Instantly](/learn/infrabox-instantly-integration) or [Smartlead](/learn/infrabox-smartlead-integration) to actually send the first touches. Hothawk handles the reply side.",
    },
    {
      heading: "Why Hothawk Is in the Inbox Management Category",
      content: "The Infrabox Sequencers Connect screen groups platforms by category: Outreach, Warmup, and Inbox Management. Hothawk sits in Inbox Management because its entire value prop is on the reply side of the funnel, not the send side.\n\n| Layer | What Hothawk does | What Hothawk does NOT do |\n|---|---|---|\n| Reply assignment | Auto-assign replies to a sales rep | Generate first touches |\n| Pipeline tracking | Kanban view of deals at each stage | Warmup |\n| Team collaboration | Notes, mentions, shared views | SMTP sending |\n| SLA tracking | First-response-time metrics per rep | Sequence orchestration |\n| Unlimited accounts | No per-seat limit on connected mailboxes | Import prospects |\n\nWhat this means for your stack: run Instantly or Smartlead as the sender, run Hothawk as the shared inbox and pipeline layer, and use Infrabox to provision the real mailboxes underneath both. When a prospect replies, the reply lands in Gmail / Outlook as normal, Hothawk pulls it via IMAP, auto-assigns it to the right rep, and tracks it through the pipeline. Your senders on the email tool side (Instantly / Smartlead) still see the reply in their own Unibox, but the team-management layer is handled by Hothawk.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Have these ready:\n\n| Item | Where | Required |\n|---|---|---|\n| Hothawk account with team workspace | hothawk.ai | Yes |\n| Hothawk login email | — | Yes |\n| Hothawk account password | — | Yes |\n| Infrabox mailboxes provisioned | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes (Hothawk pulls replies via IMAP) |\n| Team members invited to Hothawk | Hothawk → Team → Invite | Recommended, otherwise assignments have nowhere to go |\n\n**IMAP is non-negotiable.** Hothawk's entire model is reading replies from connected mailboxes, classifying them, and assigning them to reps. It does this via IMAP. If IMAP is disabled for the Google Workspace OU containing your Infrabox mailboxes, Hothawk will show the mailbox as 'connected' but pull zero replies, a state that looks like the tool is broken but is actually a one-line admin fix. See the [email domain setup checklist](/learn/email-domain-setup-checklist) for the full list of Google Workspace admin settings that email tools require.",
    },
    {
      heading: "Step-by-Step: Connect Hothawk in Infrabox",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Inbox Management** and pick **Hothawk** | 5 sec |\n| 3 | Enter **Email**. Your Hothawk login | 5 sec |\n| 4 | Enter **Password**. Your Hothawk password | 5 sec |\n| 5 | Click **Connect Account** | — |\n| 6 | Infrabox validates credentials against Hothawk's API | 1-3 sec |\n| 7 | Selected Infrabox mailboxes pushed into Hothawk team workspace | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast | — |\n\n**Total: about 90 seconds.**\n\nHothawk uses the standard credential form, no workspace picker, no API key. Validation is synchronous on submit. If you have a multi-workspace Hothawk setup and your login is associated with multiple workspaces, Hothawk defaults to your current active workspace, switch inside Hothawk before running the export if you need to target a specific one.",
    },
    {
      heading: "Team Pipeline: How Replies Flow After the Connect",
      content: "Once the connect is live, here is what happens to a reply sent to one of your Infrabox mailboxes:\n\n| Step | Who does it | Time |\n|---|---|---|\n| Prospect sends reply | External | — |\n| Reply lands in Google Workspace / Microsoft 365 inbox | Mailbox | 1-30s |\n| Hothawk IMAP poll picks up the new message | Hothawk | 30-120s (configurable) |\n| Hothawk classifies the reply (positive / OOO / bounce / unsub) | Hothawk AI | — |\n| Hothawk assigns to a rep based on routing rules | Hothawk | — |\n| Assigned rep gets notification | Hothawk | — |\n| Rep replies inside Hothawk | Hothawk → SMTP via Infrabox mailbox | 2-5s |\n| Reply lands in prospect inbox | SMTP | — |\n\n**The reply-send flow uses the Infrabox mailbox.** When a rep replies inside Hothawk, Hothawk uses the stored SMTP credentials of the Infrabox mailbox to send the reply. This is why your Infrabox warmup and daily-send limits still matter for Hothawk workflows. Every rep reply counts against the mailbox's daily quota just like a sequence send would. See [email sending limits google microsoft](/learn/email-sending-limits-google-microsoft) for the underlying Google and Microsoft caps.",
    },
    {
      heading: "Warmup Interaction: Hothawk Doesn't Warm, You Have To",
      content: "Hothawk does not ship a warmup product. It is an inbox management tool, not an outreach tool. If you want warmup on your Infrabox mailboxes while running them through Hothawk, pair with one of:\n\n- **Infrabox isolated warmup add-on**: $3/mailbox/month, separate peer network, stays with the mailbox regardless of which tool you send from\n- **Dedicated warmup tool**: [TrulyInbox](/learn/infrabox-trulyinbox-integration), [Warmy](/learn/infrabox-warmy-integration), [MailToaster](/learn/infrabox-mailtoaster-integration), or [Warmforge](/learn/infrabox-warmforge-integration)\n- **Bundled warmup in your sender**: Instantly, Smartlead, Lemlist all ship their own warmup\n\nThe typical Hothawk stack runs: Instantly (send + warmup) → Hothawk (reply management) → Infrabox (mailbox provision). In this setup, Instantly handles warmup as part of its plan, and Hothawk never touches the warmup side. For a deeper look at which warmup engine to pick, see [email warmup tools comparison](/learn/email-warmup-tools-comparison-2026).",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The failure modes you are likely to hit:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password or 2FA on Hothawk | Verify login in a clean browser; disable 2FA during connect |\n| Mailbox shows 'connected' but no replies arriving | IMAP disabled at Google Workspace OU level | Enable IMAP in admin.google.com → Gmail → End User Access |\n| Replies arrive but aren't assigned to reps | Routing rules not configured in Hothawk | Hothawk → Settings → Routing Rules → create a default rule |\n| Assigned rep can't send a reply from Hothawk | Infrabox mailbox SMTP session stale | Re-sync the mailbox from Infrabox → Sequencers → Hothawk → Retry |\n| Pipeline stages out of sync with actual deal status | Not an integration issue. Hothawk pipeline state is manual | Train reps to move cards as deals progress |\n\n**On IMAP polling interval.** Hothawk defaults to a 60-second IMAP poll. If you need faster reply routing (e.g. for a high-response-rate campaign), upgrade to a Hothawk tier that supports 30-second polling. Below 30 seconds, you hit Google's IMAP rate limits and start getting throttled, which causes missed replies, a strictly worse state than 60-second polling with reliable pickup.",
    },
    {
      heading: "Verifying the Connection Works",
      content: "Three smoke tests before you trust Hothawk with a real pipeline:\n\n**Test 1, reply round-trip.** Send yourself a test email from one of your Infrabox mailboxes (use the mailbox's Gmail webmail directly). Reply to it from a different address. Within 2 minutes, the reply should appear in Hothawk's shared inbox and get auto-assigned according to your routing rules. If it doesn't appear, IMAP is broken.\n\n**Test 2, rep reply from inside Hothawk.** Reply to that test from inside the Hothawk UI as one of your team members. Confirm the outgoing message actually reaches the prospect inbox in <30 seconds with DKIM passing. This verifies Hothawk can use the stored SMTP credentials to send.\n\n**Test 3, pipeline state change.** Move the test conversation across Hothawk's pipeline stages (New → Contacted → Replied → Interested → Closed). Confirm each move triggers the notifications you expect for the assigned rep. This isn't an integration test. It is a workflow test for your team's pipeline setup.",
    },
  ],
  faqs: [
    { question: "Does Hothawk replace the Unibox in my email sender (Instantly, Smartlead)?", answer: "It supplements, not replaces. Your sender's Unibox still shows every reply. Hothawk just adds a team-management layer on top, with routing, assignment, and pipeline tracking. Some teams disable the sender's Unibox entirely and use Hothawk as the single source of truth for replies; others keep both. The right call depends on whether reps work primarily inside Hothawk or inside the sender UI." },
    { question: "How many Infrabox mailboxes can I push into one Hothawk workspace?", answer: "Hothawk advertises unlimited email accounts on its paid tiers, so the limit is effectively whatever Infrabox plan you're on. [Infrabox Professional gives you 10 mailboxes at $39/month](/learn/infrabox-pricing); Agency gives you 30; Enterprise gives you 100. Push as many as you need. Hothawk won't cap you on the mailbox count." },
    { question: "Can Hothawk auto-categorize replies by intent?", answer: "Yes. Hothawk's AI classifier tags replies as positive, objection, out-of-office, unsubscribe, or bounce, similar to [BrandJet's AI Unibox](/learn/infrabox-brandjet-integration). The classification runs on every incoming reply automatically. You can add custom categories in Hothawk → Settings → Classification Rules if the defaults don't match your sales process." },
    { question: "What happens to Hothawk if I stop using my email sender?", answer: "Hothawk keeps working for the mailboxes you've connected. You can reply, track pipeline, and run team workflows entirely from Hothawk without ever sending an email sequence. Some teams use it this way. They run outbound via sales calls or LinkedIn and only need shared inbox management for inbound replies." },
    { question: "Does Hothawk impact mailbox sending volume or reputation?", answer: "Only when reps reply through Hothawk, those outgoing messages count against the mailbox's daily send limit. If you're already running 40 sends/day from a sequencer, and reps send 5 replies/day from Hothawk, the mailbox is at 45 total. Stay aware of the combined total and scale horizontally with more mailboxes if needed. See [scale email 100 to 10000](/learn/scale-email-100-to-10000) for the math." },
  ],
  sources: [
    { title: "Hothawk Documentation", url: "https://docs.hothawk.ai", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "infrabox-masterinbox-integration",
    "infrabox-instantly-integration",
    "infrabox-smartlead-integration",
    "email-warmup-guide",
  ],
};
