export const article = {
  slug: "infrabox-trulyinbox-integration",
  title: "Connect Infrabox to TrulyInbox (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to TrulyInbox, the forever-free, AI industry-specific warmup network.",
  headline: "Connect Infrabox Mailboxes to TrulyInbox in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["TrulyInbox integration", "email warmup", "email setup", "Google Workspace", "Microsoft 365", "free warmup"],
  excerpt: "TrulyInbox runs a forever-free warmup network with AI industry-specific conversations. Here is how to push every Infrabox mailbox into that network in one connect without paying anything.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with TrulyInbox in the warmup category", caption: "Infrabox Sequencers page. TrulyInbox sits in the Warmup category with a popular badge because of the forever-free plan." },
    { src: "/images/dashboard/warmup.png", alt: "Infrabox warmup dashboard running alongside TrulyInbox", caption: "Infrabox Warmup dashboard. You can run Infrabox's isolated warmup OR TrulyInbox, not both simultaneously." },
  ],
  sections: [
    {
      heading: "The Fast Path: Free Warmup for Every Infrabox Mailbox",
      content: "TrulyInbox runs one of the only genuinely free email warmup networks on the market, their forever-free plan lets you warm an unlimited number of mailboxes without paying a cent. Infrabox connects to TrulyInbox via email + password, pushes every selected mailbox into TrulyInbox's warmup network, and TrulyInbox's AI picks industry-specific conversation partners to simulate real inbox activity. No per-mailbox OAuth, no SMTP dropdown, no app password generation.\n\nTotal connect time is about 3 minutes. This is the path to pick if you don't want to pay for [Infrabox's isolated warmup add-on](/learn/email-warmup-guide) at $3/mailbox/month and are OK sharing the warmup network with the rest of TrulyInbox's user base.",
    },
    {
      heading: "Why TrulyInbox Is Different From Most Warmup Tools",
      content: "Most warmup products charge per-mailbox-per-month even for the network-only tier. TrulyInbox's forever-free plan gives unlimited mailboxes and unlimited warmup at $0. The trade-off is the shared pool: your mailbox is warming alongside every other TrulyInbox free user's mailbox, which can include senders with uneven sending habits.\n\n| Dimension | TrulyInbox free | Infrabox isolated warmup |\n|---|---|---|\n| Price | $0 | $3/mailbox/month |\n| Pool size | Shared with all free users | Isolated per-customer network |\n| AI personalization | Industry-specific conversation templates | Industry-agnostic, human-sounding replies |\n| Warmup messages/day per mailbox | 3-20 ramp | 3-25 ramp |\n| Provider coverage | 18+ providers (Gmail, Workspace, Outlook, O365, Zoho, SendGrid, Mailgun, Amazon SES, more) | Google Workspace + Microsoft 365 + Azure |\n\nTrulyInbox's own site lists the provider coverage explicitly: 'We support 18+ providers including Gmail, Google Workspace, Outlook.com, Office 365, Yahoo Mail, Zoho, iCloud, GoDaddy, Yandex, GMX, SendGrid, Mailgun, Amazon' ([source](https://www.trulyinbox.com/)). That's broader than most competitors but the free-tier pool is shared, which matters if you care about who your mailbox is 'talking to' during warmup.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Gather these:\n\n| Item | Where | Required |\n|---|---|---|\n| TrulyInbox account | [trulyinbox.com](https://www.trulyinbox.com/), free plan works | Yes |\n| TrulyInbox login email | — | Yes |\n| TrulyInbox password | — | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Apps → Gmail → End User Access | Yes |\n| SPF, DKIM, DMARC, MX live | Infrabox Cloudflare automation | Yes (auto) |\n| Infrabox mailboxes provisioned | Infrabox → Mailboxes | Yes |\n\n**Why IMAP matters for warmup.** TrulyInbox's AI warmup works by sending warmup messages and then reading the replies to mark them as read, move them to primary, or flag as important. Without IMAP access, TrulyInbox can send but cannot read or interact with the inbox, which breaks the warmup signal. The TrulyInbox 'How It Works' page describes this: 'Sign in with Google or Microsoft OAuth. No passwords to share. For SMTP providers, just enter your credentials' ([source](https://www.trulyinbox.com/how-it-works/)). The Infrabox integration uses the SMTP credential path because it's the universal option across all 18+ providers TrulyInbox supports.\n\nInfrabox already provisions SPF, DKIM, DMARC, and MX automatically. See [email authentication explained](/learn/email-authentication-spf-dkim-dmarc-explained) if you want to verify manually.",
    },
    {
      heading: "Step-by-Step: Connect TrulyInbox in Infrabox",
      content: "The click path is a standard email + password flow:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Warmup** category and pick **Truly Inbox** | 5 sec |\n| 3 | Enter **Email**. Your TrulyInbox login | 5 sec |\n| 4 | Enter **Password**. Your TrulyInbox password | 5 sec |\n| 5 | Click **Connect Account** | — |\n| 6 | Infrabox validates credentials against TrulyInbox's auth endpoint | 1-2 sec |\n| 7 | Selected Infrabox mailboxes push into TrulyInbox's warmup network | 30-60 sec |\n| 8 | Redirect to `/sequencers` with success toast | — |\n\n**Total: about 90 seconds.**\n\nYou do not touch TrulyInbox's UI at any point during this connect. Infrabox handles the entire push, and the next time you log into TrulyInbox, the mailboxes will already be listed in your warmup queue.",
    },
    {
      heading: "What TrulyInbox Does With Each Mailbox After Connect",
      content: "Once pushed, TrulyInbox runs each mailbox through a 3-stage warmup pipeline:\n\n| Stage | Duration | What happens |\n|---|---|---|\n| Stage 1. Network entry | Day 1-3 | 3-5 warmup messages/day, all from TrulyInbox's AI partners. Mailbox builds initial sender reputation |\n| Stage 2. Ramp | Day 4-14 | 10-15 messages/day, mixed industry conversations |\n| Stage 3. Steady state | Day 15+ | 20-25 messages/day, AI keeps rotating partners to prevent pattern detection |\n\nTrulyInbox's AI picks industry-specific conversation templates based on the domain TLD and the sender name pattern. A mailbox on `johnsdoctoroffice.com` will get healthcare-adjacent warmup conversations; a mailbox on `bobssaasventure.io` will get SaaS-adjacent ones. This matters because Gmail's spam filter learns what 'normal' looks like for your domain. If the warmup traffic matches the expected industry, the model trains faster.\n\n**Do not run two warmup systems at once.** If you already pay for Infrabox's isolated warmup add-on, disable TrulyInbox's warmup for that mailbox in TrulyInbox's settings. Running both roughly doubles warmup sent volume and confuses Google's reputation classifiers. See [domain warmup best practices](/learn/domain-warmup-best-practices) for the full trade-off.",
    },
    {
      heading: "Daily Limits and Real Sending After Warmup",
      content: "TrulyInbox only handles warmup. It does not send your real email campaigns. You pair it with an outreach sequencer like [Instantly](/learn/infrabox-instantly-integration), [Smartlead](/learn/infrabox-smartlead-integration), or [Salesforge](/learn/infrabox-salesforge-integration) for actual sends. Use this ramp when you move a mailbox from warmup-only to real campaigns:\n\n| Mailbox age | TrulyInbox warmup | Real outreach daily cap | Notes |\n|---|---|---|---|\n| Day 1-14 | 3-15 ramp | 0 | Warmup only |\n| Day 15-30 | 20/day | 10-15 | First real campaigns, low risk |\n| Day 31-45 | 20/day | 20-30 | Ramp aggressively |\n| Day 46-60 | 20/day | 30-40 | Near steady state |\n| Day 60+ | 20/day | 40-50 | Steady state |\n\nGoogle's practical email ceiling per mailbox is 40-50 per day regardless of warmup depth. To hit higher volumes, add more Infrabox mailboxes horizontally. See [scale email 100 to 10000](/learn/scale-email-100-to-10000) for the mailbox-count math and [email sending limits](/learn/email-sending-limits-google-microsoft) for the Google vs Microsoft limits.",
    },
    {
      heading: "Five Errors That Break TrulyInbox Setups",
      content: "| Error | Cause | Fix | Frequency |\n|---|---|---|---|\n| 'Invalid credentials' on connect | Typo in email or password, or account is on free-plan cooldown | Re-enter credentials; if cooldown, wait 15 min | 25% |\n| 'IMAP handshake timeout' | IMAP disabled at Google Workspace OU level | admin.google.com → Gmail → End User Access → enable IMAP | 30% |\n| Mailbox not appearing in TrulyInbox queue | Warmup pool sync delay | Wait 2 minutes and refresh | 15% |\n| 'Duplicate mailbox' warning | Mailbox already connected to another TrulyInbox account | Remove from the old account first | 10% |\n| Warmup counts stay at zero after 24h | TrulyInbox daily limit set to 0 during onboarding | TrulyInbox → Mailbox settings → set warmup limit > 0 | 20% |\n\n**One more footgun:** TrulyInbox's free plan has a 'sharing penalty' because the network is shared, your mailbox will sometimes receive warmup mail from senders whose reputation is worse than yours. This is fine during ramp but becomes noise after day 30. If you're serious about deliverability, upgrade to [Infrabox's isolated warmup add-on](/learn/email-warmup-guide) after the first month.",
    },
    {
      heading: "Verifying TrulyInbox Is Actually Warming",
      content: "Run these three checks after every new TrulyInbox connect:\n\n**Test 1: Appears in TrulyInbox queue.** Log into TrulyInbox → Mailboxes. Every Infrabox mailbox you pushed should be listed within 60 seconds with status 'Warming up'. If any are missing, the push silently failed, check the Infrabox Exports page for the error.\n\n**Test 2: 24-hour activity count.** After 24 hours, check the Activity tab in TrulyInbox. You should see 5-10 sent, 3-8 received, 2-5 replied. If all counts are zero, either warmup is disabled on the mailbox or IMAP is broken.\n\n**Test 3: Inbox placement test.** After 7 days of warmup, run a test via [Mail Tester](https://www.mail-tester.com/) or GlockApps. You're looking for 8/10+. Anything lower means the warmup pool is not recovering your reputation fast enough, switch to isolated warmup. See [inbox placement testing explained](/learn/inbox-placement-testing-explained) for full methodology.",
    },
  ],
  faqs: [
    { question: "Is TrulyInbox really forever free?", answer: "Yes, the free plan lets you warm unlimited mailboxes with no paid tier required. The trade-off is the shared network. Your mailbox warms alongside every other free user's mailbox, which can include senders with uneven reputation. TrulyInbox also offers paid plans with private pools, but the free tier is genuinely unlimited." },
    { question: "Can I use TrulyInbox alongside Infrabox's warmup add-on?", answer: "No, pick one. Running both simultaneously roughly doubles the outbound warmup volume for the mailbox, which Google reads as suspicious behavior and can damage reputation. Choose TrulyInbox if you need free warmup; choose Infrabox's isolated warmup if you need a dedicated network at $3/mailbox/month." },
    { question: "Does TrulyInbox handle real outreach sends?", answer: "No. TrulyInbox is warmup-only. Pair it with an outreach sequencer like Instantly, Smartlead, Salesforge, or Reply.io for real campaigns. The typical stack is Infrabox for mailboxes, TrulyInbox for free warmup, and one outreach sequencer for sends." },
    { question: "How long until a mailbox is 'warm' enough for email?", answer: "About 14 days of consistent TrulyInbox warmup produces a baseline-ready mailbox. Serious email setups wait 21-30 days before sending to a cold audience, warmup isn't instant, and rushing it damages reputation on the first real campaign." },
    { question: "Which mailbox types does TrulyInbox support?", answer: "TrulyInbox supports 18+ providers including Gmail, Google Workspace, Outlook.com, Office 365, Yahoo Mail, Zoho, iCloud, GoDaddy, Yandex, GMX, SendGrid, Mailgun, and Amazon SES. Infrabox provisions Google Workspace, Microsoft 365, and Azure mailboxes, all of which are supported." },
  ],
  sources: [
    { title: "TrulyInbox. The Smartest Email Warmup Platform", url: "https://www.trulyinbox.com/", date: "2026" },
    { title: "TrulyInbox. How It Works", url: "https://www.trulyinbox.com/how-it-works/", date: "2026" },
    { title: "Google Workspace IMAP Settings", url: "https://support.google.com/mail/answer/7126229", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "email-warmup-guide",
    "domain-warmup-best-practices",
    "inbox-placement-testing-explained",
    "scale-email-100-to-10000",
  ],
};
