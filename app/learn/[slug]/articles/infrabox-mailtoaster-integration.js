export const article = {
  slug: "infrabox-mailtoaster-integration",
  title: "Connect Infrabox to MailToaster (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to MailToaster, the peer-to-peer warmup network with GPT-powered replies.",
  headline: "Connect Infrabox Mailboxes to MailToaster in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["MailToaster integration", "peer-to-peer warmup", "GPT warmup", "email setup", "Google Workspace", "Microsoft 365"],
  excerpt: "MailToaster runs a peer-to-peer warmup network with GPT-powered replies. Infrabox connects via a standard credential flow: here is the setup, plus why you only run one warmup engine per mailbox.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with MailToaster in the Warmup category", caption: "Infrabox Sequencers page showing MailToaster under Warmup, next to TrulyInbox, Warmforge, and Warmy.io." },
    { src: "/images/dashboard/warmup.png", alt: "Infrabox warmup add-on toggle", caption: "Infrabox Warmup page: toggle this OFF if you're using MailToaster warmup on the same mailbox to avoid double-warming." },
  ],
  sections: [
    {
      heading: "The Fast Path: Credentials Into a Peer-to-Peer Warmup Network",
      content: "MailToaster sits in the Warmup category in the Infrabox Sequencers Connect screen. You paste your MailToaster login email and password, Infrabox validates against the MailToaster API, and every selected Infrabox mailbox joins the peer-to-peer warmup network on the MailToaster side. The whole connect takes about 90 seconds.\n\nUnlike outreach-category integrations like [Instantly](/learn/infrabox-instantly-integration) or [Smartlead](/learn/infrabox-smartlead-integration), MailToaster does not send emails on your behalf, it warms the mailbox by exchanging messages with other MailToaster users in a shared peer network. Every member sends to every other member, GPT generates natural-looking replies, and the resulting inbox activity looks real to Gmail and Microsoft's spam filters. That inbox activity is what builds sender reputation.",
    },
    {
      heading: "How Peer-to-Peer Warmup Actually Works",
      content: "Peer-to-peer warmup is the most common warmup design, and it is what MailToaster, [Warmy](/learn/infrabox-warmy-integration), [TrulyInbox](/learn/infrabox-trulyinbox-integration), and most consumer warmup tools use. Here is what the network actually does:\n\n| Action | Who does it | How often |\n|---|---|---|\n| Your mailbox sends a warmup message | Your Infrabox mailbox via MailToaster | 2-10 times/day, growing over 2 weeks |\n| Another MailToaster user's mailbox receives it | Random peer mailbox in the network |, |\n| GPT generates a natural reply | MailToaster's backend | 30-90% of received messages |\n| Reply comes back to your mailbox | Peer mailbox via MailToaster |, |\n| Your mailbox marks the conversation as 'Read, Not Spam' | MailToaster auto-label |, |\n| Gmail Postmaster sees the positive signal | Gmail's internal reputation scorer | Within 24-48h |\n\nThe magic of the loop is that it trains Gmail's reputation engine to mark your sends as 'legitimate conversations' instead of 'outreach that gets marked as spam'. You do not need to hand-type any of this, MailToaster handles the whole loop once the mailbox is connected.\n\n**Why GPT replies matter.** Early peer-to-peer warmup tools used canned 10-template replies that Gmail eventually pattern-matched and ignored as fake. GPT replies solve this by generating variance: every warmup message gets a slightly different, contextual reply that reads like a real human exchange. MailToaster's GPT integration is what gives it an edge over legacy peer warmup.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Have these ready:\n\n| Item | Where | Required |\n|---|---|---|\n| MailToaster account | mailtoaster.ai | Yes |\n| MailToaster login email |, | Yes |\n| MailToaster password |, | Yes |\n| Infrabox mailboxes provisioned | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes (warmup reads+marks inbox state) |\n| **Infrabox warmup add-on toggled OFF** for this mailbox | Infrabox → Mailboxes → Warmup | Yes if you plan to use MailToaster warmup instead |\n\n**The double-warmup trap (this is the big one for warmup-category integrations).** Infrabox ships its own isolated warmup add-on at $3/mailbox/month. If that add-on is ON for a mailbox and you then connect the same mailbox to MailToaster, the mailbox is now receiving warmup traffic from two separate peer networks at the same time. Volume roughly doubles, Gmail Postmaster starts seeing contradictory signals, and reputation can move sideways instead of up. Pick one engine and turn the other off.\n\nFor most Infrabox users running multi-sequencer setups, the decision tree is: use MailToaster if you're also using it for outreach; use Infrabox warmup if you're running mailboxes across multiple senders and want consistent warmup regardless of which sender you use on a given day. See [email warmup tools comparison](/learn/email-warmup-tools-comparison-2026) for side-by-side trade-offs.",
    },
    {
      heading: "Step-by-Step: Connect MailToaster in Infrabox",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Mailboxes** → (select the mailbox) → **Warmup** → toggle OFF | 10 sec |\n| 2 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 3 | Filter by **Warmup** category and pick **MailToaster** | 5 sec |\n| 4 | Enter **Email**: your MailToaster login | 5 sec |\n| 5 | Enter **Password**: your MailToaster password | 5 sec |\n| 6 | Click **Connect Account** |, |\n| 7 | Infrabox validates credentials against MailToaster's API | 1-3 sec |\n| 8 | Selected Infrabox mailboxes join the MailToaster warmup network | 20-40 sec |\n| 9 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90-120 seconds including the Infrabox warmup toggle.**\n\nNote the extra step 1: turning off the Infrabox warmup before connecting MailToaster. This is the most common thing new users forget, and the reason their reputation signals look noisy for the first week.",
    },
    {
      heading: "Warmup Ramp-Up: What to Expect Over the First 30 Days",
      content: "MailToaster ramps warmup volume gradually. Here is the typical progression for a brand new Infrabox mailbox:\n\n| Day | Warmup sends/day | Warmup receives/day | Reply simulation | Notes |\n|---|---|---|---|---|\n| 1-3 | 2-5 | 5-10 | ~30% | Establishing presence in network |\n| 4-7 | 5-10 | 10-15 | ~50% | Starting to build reputation |\n| 8-14 | 10-20 | 15-25 | ~70% | Reputation visibly improving |\n| 15-21 | 20-30 | 25-40 | ~80% | Safe to start light outreach |\n| 22-30 | 30-40 | 40-50 | ~90% | Full warmup maturity |\n\n**When to start sending real email.** Most warmup experts agree: do not start real outreach until day 14 at the earliest, and ideally day 21. The mailbox needs time to accumulate enough positive reputation signals that real sends don't spike the spam rate. See [email warmup guide](/learn/email-warmup-guide) for the reasoning and the underlying Gmail Postmaster data.\n\nOne specific MailToaster feature to know about: after day 14, you can reduce warmup volume to maintenance mode (5-10 sends/day) while running real outreach alongside. This keeps reputation stable without wasting warmup-network capacity. Toggle it in MailToaster → Mailbox Settings → Warmup Mode → Maintenance.",
    },
    {
      heading: "MailToaster vs Infrabox Warmup Add-On",
      content: "Side-by-side comparison to help you pick one:\n\n| Feature | MailToaster | Infrabox isolated warmup |\n|---|---|---|\n| Pricing | Per-mailbox on MailToaster plan | $3/mailbox/month |\n| Network | Shared peer-to-peer network (larger volume) | Isolated peer network (cleaner signal) |\n| Reply generation | GPT-powered, high variance | Internal templates + AI variance |\n| Setup time | ~90 seconds via Infrabox connect | One toggle in Infrabox dashboard |\n| Integration | Requires separate MailToaster account | No separate account |\n| Best for | Teams already using MailToaster for other mailboxes | Infrabox-only users |\n\nFor most single-sequencer users, the Infrabox warmup is simpler: one toggle, no extra credentials, no double-warmup risk because it's the same dashboard managing both the mailbox and the warmup. MailToaster makes more sense if you are running warmup on mailboxes that live outside Infrabox and want to unify them into one warmup tool.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The failure modes you are likely to hit:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password or 2FA on MailToaster account | Verify login in a clean browser tab |\n| Mailbox in MailToaster but warmup volume stuck at 0 | Double-warmup conflict. Infrabox warmup still active | Turn OFF Infrabox warmup, wait 24h for MailToaster to detect |\n| Warmup messages going to spam on other members' side | Your DNS (SPF/DKIM/DMARC) not fully propagated | Verify DNS with `dig TXT yourdomain.com`, wait 2-4 hours for propagation |\n| Reputation score not improving after 7 days | Mailbox too new for meaningful signal | Wait to day 14 minimum before measuring |\n| 'IMAP handshake failed' | IMAP disabled at Google Workspace OU | Enable IMAP in admin.google.com → Gmail → End User Access |\n\nThe double-warmup error is worth flagging explicitly because it is silent. MailToaster doesn't know that Infrabox is also sending warmup traffic on the same mailbox: both think they own the warmup loop. Results look like: MailToaster reports 'sending 20/day', Infrabox reports 'sending 20/day', actual mailbox reports 40/day in Gmail Postmaster, and reputation becomes unstable because the signals conflict. The fix is always to pick one and turn off the other.",
    },
    {
      heading: "Verifying the Warmup Is Actually Working",
      content: "Four things to check over the first 14 days:\n\n**Check 1: warmup messages in the Sent folder.** Open Gmail webmail for one of your Infrabox mailboxes. Go to Sent. You should see MailToaster-generated messages going out: not your real outreach, but warmup messages to other MailToaster members. If the Sent folder is empty after day 3, MailToaster isn't actually sending from the mailbox: check Infrabox → Sequencers → MailToaster → Status.\n\n**Check 2: replies coming back.** Within the same Gmail webmail, check the Inbox for replies from other MailToaster members. You should see GPT-generated replies with natural-sounding content. If replies are missing, IMAP polling is broken on the MailToaster side.\n\n**Check 3: Gmail Postmaster trend.** Register your sending domain at [Google Postmaster Tools](/learn/google-postmaster-tools-guide). Watch the Reputation graph over 14-30 days. A healthy warmup shows a gradual climb from 'Low' or 'Medium' to 'High'. If it is flat or declining, something is wrong: usually DNS or double-warmup.\n\n**Check 4: inbox placement test after day 21.** Run an [inbox placement test](/learn/inbox-placement-testing-explained) via Mail Tester or GlockApps. Target: 9/10+. If the score is below 8/10 after a full warmup cycle, escalate, the mailbox needs more time, or there's a deeper DNS/content issue.",
    },
  ],
  faqs: [
    { question: "Can I warm a mailbox with MailToaster while running real email through Instantly at the same time?", answer: "Yes, that is the standard setup. Warmup engine = MailToaster, outreach engine = Instantly. Just make sure the Infrabox warmup add-on is OFF (to avoid double-warming) and that you're past day 14 of warmup before your outreach ramps up. Real sends on an underwarmed mailbox is the #1 cause of day-one spam placement." },
    { question: "Does MailToaster work with Microsoft 365 mailboxes from Infrabox?", answer: "Yes. MailToaster is SMTP/IMAP-based, so Google Workspace and Microsoft 365 both work. The prereq for Microsoft 365 is Authenticated SMTP enabled at the mailbox level, which Infrabox provisions during mailbox creation." },
    { question: "How many mailboxes can I push into MailToaster via Infrabox?", answer: "MailToaster's pricing is per-mailbox, so the limit is whatever you pay for. Infrabox does not cap the export count: on Professional you get 10 mailboxes, on Agency 30, on Enterprise 100. Scale your MailToaster plan to match." },
    { question: "Does MailToaster count against my Infrabox daily send limit?", answer: "Yes. Every warmup message MailToaster sends from your mailbox consumes one outgoing message quota at Google or Microsoft. During active warmup (days 1-21), your mailbox may be doing 20-30 warmup sends/day. Plan your outreach daily limit to stay below Google's ~40/day practical cap after accounting for warmup traffic." },
    { question: "What happens if I pause MailToaster warmup mid-campaign?", answer: "Reputation starts decaying after 7-14 days without activity. If you pause warmup to save money, plan to resume within 10 days or run maintenance-mode warmup (5-10 sends/day) to keep the mailbox reputation warm. A fully cold mailbox takes about 14 days to re-warm from scratch: see [email warmup guide](/learn/email-warmup-guide) for the full math." },
  ],
  sources: [
    { title: "MailToaster Documentation", url: "https://docs.mailtoaster.ai", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Postmaster Tools", url: "https://postmaster.google.com/", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-warmup-guide",
    "email-warmup-tools-comparison-2026",
    "infrabox-trulyinbox-integration",
    "google-postmaster-tools-guide",
    "inbox-placement-testing-explained",
  ],
};
