export const article = {
  slug: "infrabox-manyreach-integration",
  title: "Connect Infrabox to Manyreach (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Manyreach, the pay-per-email cold outreach tool with unlimited senders.",
  headline: "Connect Infrabox Mailboxes to Manyreach in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Manyreach integration", "pay per email", "unlimited senders", "email setup", "Google Workspace", "Microsoft 365"],
  excerpt: "Manyreach charges per email sent instead of per sender, which changes the calculus for how many Infrabox mailboxes you push. Here is the exact connect flow, plus the math on when it beats subscription pricing.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Manyreach connected", caption: "Infrabox Sequencers page. Manyreach lives in the Outreach category and uses the standard credential flow." },
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox Mailboxes ready for Manyreach export", caption: "Infrabox Mailboxes page showing mailboxes you can push into Manyreach with unlimited sender support." },
  ],
  sections: [
    {
      heading: "The Fast Path: Email + Password Into Manyreach",
      content: "Manyreach connects to Infrabox via standard email + password in the Sequencers Connect screen. Paste your Manyreach login, Infrabox validates against Manyreach's API, and every selected Infrabox mailbox gets provisioned inside Manyreach as a new sender. The full connect takes about 90 seconds.\n\nManyreach's differentiator is the pricing model: you pay per email sent instead of per sender seat. That inverts the economics of how many Infrabox mailboxes you should push. With seat-based tools ([Instantly](/learn/infrabox-instantly-integration), [Smartlead](/learn/infrabox-smartlead-integration)), you want fewer mailboxes because each seat costs money. With Manyreach, you can push 30-100 mailboxes without added cost, and doing so actually *reduces* per-mailbox volume, which protects reputation.",
    },
    {
      heading: "Why Pay-Per-Email Changes the Infrabox Math",
      content: "Most outreach tools charge per sending seat: $37-$99/month no matter how many emails you send. Manyreach charges per email sent. Here is how the math looks for a typical 10,000-email/month campaign:\n\n| Model | Monthly cost | Per-mailbox load | Reputation risk |\n|---|---|---|---|\n| Instantly Professional (10 seats) | $37 | 1,000 emails/mailbox/month (~33/day) | Medium |\n| Smartlead Basic (limited seats) | $39 | 1,000 emails/mailbox/month (~33/day) | Medium |\n| Manyreach pay-per-email (30 Infrabox mailboxes) | ~$100 (usage-based) | 333 emails/mailbox/month (~11/day) | Low |\n\nAt 10,000 emails/month spread across 30 mailboxes instead of 10, each mailbox sends 11/day instead of 33/day. That's a 3x reduction in per-mailbox load, which directly translates to lower spam-flag rates and higher inbox placement. See [scale email 100 to 10000](/learn/scale-email-100-to-10000) for the full volume-vs-reputation math.\n\n**The trade-off.** At lower volumes, pay-per-email can cost more than a fixed subscription. For 1,000 emails/month, a $39 Instantly plan is usually cheaper than Manyreach's pay-per-email rate. The inflection point is typically around 5,000-10,000 emails/month depending on the exact per-email price Manyreach quotes you.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Gather these first:\n\n| Item | Where | Required |\n|---|---|---|\n| Manyreach account with funded credit balance | manyreach.com | Yes |\n| Manyreach login email | — | Yes |\n| Manyreach password | — | Yes |\n| Infrabox mailboxes provisioned | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes |\n| Target send volume per mailbox | Your campaign plan | Recommended |\n\n**On Manyreach credit funding.** Manyreach requires a prepaid credit balance before it will accept sends. If you connect Infrabox mailboxes but haven't funded the account, the connection itself succeeds but the sender mailboxes show as 'unfunded' inside Manyreach and won't send until you add credits. Fund before you connect.",
    },
    {
      heading: "Step-by-Step: Connect Manyreach",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Inside Manyreach: fund your credit balance (Billing → Add Credits) | 2 min |\n| 2 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 3 | Filter by **Outreach** and pick **Manyreach** | 5 sec |\n| 4 | Enter **Email**. Your Manyreach login | 5 sec |\n| 5 | Enter **Password**. Your Manyreach password | 5 sec |\n| 6 | Click **Connect Account** | — |\n| 7 | Infrabox validates credentials and pushes every selected mailbox | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast | — |\n\n**Total: about 3 minutes including funding the Manyreach account.**\n\nOne thing to know about the Manyreach connect: because there is no sender seat cap, Infrabox lets you push as many mailboxes as you have provisioned. If you are on [Infrabox Enterprise with 100 mailboxes](/learn/infrabox-pricing), you can push all 100 into Manyreach in one export and pay only for the actual emails sent. That's the main reason teams running high-volume outreach pair these two.",
    },
    {
      heading: "Optimal Mailbox Distribution for Pay-Per-Email",
      content: "Because Manyreach has no per-seat cost, you should push as many mailboxes as possible and spread volume thin. Here is the recommended distribution by total monthly send volume:\n\n| Monthly sends | Recommended Infrabox mailbox count | Per-mailbox/day | Plan fit |\n|---|---|---|---|\n| 1,000 | 5 | ~7 | Professional ($39) |\n| 5,000 | 15 | ~11 | Agency ($99) |\n| 10,000 | 30 | ~11 | Agency ($99 + $70 for extra 20 mailboxes) |\n| 25,000 | 60 | ~14 | Enterprise ($299) |\n| 50,000 | 100 | ~17 | Enterprise ($299) |\n\nThe thin-distribution strategy is deliberate: lower per-mailbox volume means Gmail Postmaster sees each mailbox as a moderate sender (not a spammer), and your overall deliverability stays above 90% much longer than if you ran 10 mailboxes at 1,000 each.\n\n**Warmup interaction.** None of this math works if the mailboxes are not warmed. Run [Infrabox warmup add-on](/learn/email-warmup-guide) ($3/mailbox/month) or a dedicated warmup tool like [TrulyInbox](/learn/infrabox-trulyinbox-integration) or [Warmy](/learn/infrabox-warmy-integration) for the first 14-21 days. Manyreach itself ships unlimited warmup as part of the pay-per-email plan, which is another reason the economics work at volume.",
    },
    {
      heading: "Unlimited Sender Support: What Actually Changes",
      content: "Most outreach tools describe 'unlimited accounts' but then cap you via plan limits or throttle per account. Manyreach's 'unlimited senders' is actually unlimited, here is what is and isn't true:\n\n| Feature | Limit | Notes |\n|---|---|---|\n| Number of senders you can connect | Unlimited | No cap on Infrabox mailbox count |\n| Number of campaigns running simultaneously | Unlimited | Multi-campaign per sender is fine |\n| Per-mailbox daily send cap | Enforced by Gmail/Microsoft, not Manyreach | ~40/day practical limit |\n| Email send volume | Pay-per-email, buy more credits, send more | Usage-based billing |\n| Warmup | Unlimited, included in plan | No per-mailbox warmup charge |\n\n**The practical meaning.** You can run 50 campaigns across 100 mailboxes without Manyreach charging you extra. You just pay for the emails that actually go out. Combined with Infrabox's mailbox-per-dollar advantage at the Enterprise tier, this is one of the cheapest ways to run high-volume outreach in 2026.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The common failure modes for Infrabox → Manyreach connections:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password, or 2FA on Manyreach | Verify login in a clean browser, disable 2FA during connect |\n| Mailboxes show 'unfunded' in Manyreach | Manyreach account credit balance = $0 | Fund via Manyreach Billing → Add Credits |\n| Some mailboxes missing from Manyreach after export | Rate limit on Manyreach's side during batch import | Export in groups of 20 with 60s between |\n| Sends paused despite credits available | Mailbox SMTP session failed | Re-sync from Infrabox → Sequencers → Manyreach → Retry |\n| Unexpected cost spike | Campaign volume exceeded planned budget | Set a per-campaign daily cap in Manyreach → Campaign Settings |\n\n**On unexpected cost spikes.** This is the one thing worth being defensive about. Pay-per-email means a runaway campaign is a runaway bill. Set daily spend caps in Manyreach → Account Settings → Daily Limit (e.g., $20/day) as a hard stop. If the cap is hit, Manyreach pauses all campaigns until you release it, which is exactly what you want if a misconfigured sequence starts blasting.",
    },
    {
      heading: "Verifying the Connection Works",
      content: "Three smoke tests before running a high-volume campaign:\n\n**Test 1: 10-prospect pilot.** Before loading 10,000 prospects, run a 10-prospect test campaign from a single mailbox for 1 day. Check: did Manyreach send all 10 from the Infrabox mailbox? Did DKIM pass on the recipient side? Did any bounce?\n\n**Test 2, multi-mailbox rotation.** Run a second 10-prospect campaign using a round-robin across 5 mailboxes. Confirm all 5 mailboxes actually sent (2 each). Manyreach should distribute by round-robin, not stack on one mailbox.\n\n**Test 3, cost dry run.** After the first 20 test sends, check Manyreach → Billing → Usage. Confirm the per-email cost matches what you budgeted. If the rate is higher than expected, you may be on a tier you didn't intend. Fix before you scale.\n\n**Test 4, inbox placement test.** Run a [seed-list inbox placement test](/learn/inbox-placement-testing-explained) through Gmail, Outlook, Yahoo, Hotmail. Target: 9/10+. For a pay-per-email tool, good inbox placement is especially important because every email going to spam is money wasted.",
    },
  ],
  faqs: [
    { question: "Is pay-per-email cheaper than a subscription for 5,000 emails/month?", answer: "Usually yes. Most pay-per-email rates in 2026 come out to roughly $40-$80 for 5,000 emails, competitive with a seat-based tool at that volume. The advantage grows as you scale: at 25,000+ emails/month, pay-per-email is often 30-50% cheaper than equivalent seat-based plans, and you get better reputation outcomes from thin mailbox distribution." },
    { question: "Does Manyreach support Microsoft 365 mailboxes from Infrabox?", answer: "Yes. Manyreach is SMTP/IMAP-based, so both Google Workspace and Microsoft 365 work. The prereq for Microsoft 365 is Authenticated SMTP enabled at the mailbox level. Infrabox provisions this automatically during mailbox creation." },
    { question: "Can I run Manyreach warmup alongside Infrabox warmup?", answer: "Pick one. Manyreach's warmup is a shared peer network; Infrabox's is an isolated peer network. Running both on the same mailbox roughly doubles warmup-sent volume and confuses Gmail Postmaster reputation signals. The simpler choice for Manyreach users is to use Manyreach's built-in warmup since it's included in the plan, toggle Infrabox warmup OFF for those mailboxes." },
    { question: "How does Manyreach handle mailbox rotation inside a campaign?", answer: "Manyreach uses round-robin distribution by default. If you have 10 mailboxes connected and a campaign of 100 prospects, each mailbox sends to 10 prospects. You can override this per-campaign by pinning a specific mailbox pool, which is how most agencies segment by client." },
    { question: "What happens if my Manyreach credit balance runs out mid-campaign?", answer: "Manyreach pauses the campaign and notifies you. Messages already sent stay sent; new sends are blocked until you add credits. Infrabox's side is unaffected, the mailboxes stay provisioned and ready to resume the moment credits are added." },
  ],
  sources: [
    { title: "Manyreach Documentation", url: "https://docs.manyreach.com", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "scale-email-100-to-10000",
    "infrabox-instantly-integration",
    "email-warmup-guide",
    "inbox-placement-testing-explained",
  ],
};
