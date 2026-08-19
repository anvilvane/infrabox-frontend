export const article = {
  slug: "infrabox-replyio-integration",
  title: "Connect Infrabox to Reply.io (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Reply.io: multichannel outreach with email, LinkedIn, SMS, and calls.",
  headline: "Connect Infrabox Mailboxes to Reply.io in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Reply.io integration", "multichannel outreach", "LinkedIn sequences", "email setup", "Google Workspace", "Microsoft 365"],
  excerpt: "Reply.io runs email, LinkedIn, SMS, and calls in one multichannel sequence. Infrabox provides the email side. Here is the exact connect flow, plus how the channels interact.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Reply.io connected", caption: "Infrabox Sequencers page showing Reply.io in the Outreach category: connected via standard credentials for the email channel." },
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox Mailboxes ready to export to Reply.io", caption: "Infrabox Mailboxes page: select mailboxes and push them to Reply.io for use in multichannel sequences." },
  ],
  sections: [
    {
      heading: "The Fast Path: Credentials Into Reply.io's Email Channel",
      content: "Reply.io connects to Infrabox via standard email + password in the Sequencers Connect screen. Paste your Reply.io login, Infrabox validates, and every selected Infrabox mailbox lands in Reply.io as a new email sender. The connect takes about 90 seconds.\n\nReply.io is the most channel-diverse tool in the Infrabox catalog. It runs email, LinkedIn messages, SMS, and even phone calls inside a single sequence. For Infrabox users, the important thing to understand is that only the email channel of Reply.io touches your Infrabox mailboxes, LinkedIn, SMS, and calls all use their own infrastructure inside Reply.io and are unrelated to the mailbox connect. This is similar to [Emelia's LinkedIn-plus-email design](/learn/infrabox-emelia-integration), but Reply.io goes further by adding SMS and calls.",
    },
    {
      heading: "Why Multichannel Sequences Work With Infrabox",
      content: "Reply.io's value prop is that a single sequence can mix channels to improve reply rates. A typical multichannel flow looks like this:\n\n| Step | Channel | Day | Reply.io component | Infrabox involved? |\n|---|---|---|---|---|\n| 1 | Email first touch | Day 1 | Email sequence | Yes: sends via Infrabox mailbox |\n| 2 | LinkedIn connection request | Day 3 | LinkedIn module | No: uses your LinkedIn session |\n| 3 | Email follow-up | Day 5 | Email sequence | Yes |\n| 4 | LinkedIn message | Day 7 | LinkedIn module | No |\n| 5 | SMS text | Day 10 | SMS module (requires Twilio) | No |\n| 6 | Phone call task | Day 12 | Call task (manual dial) | No |\n| 7 | Email breakup | Day 15 | Email sequence | Yes |\n\nThe email steps go through your Infrabox mailboxes and count against your daily send quota. The LinkedIn, SMS, and call steps are unrelated to Infrabox. This matters because if you're planning a 6-email sequence, each mailbox's daily quota has to handle the combined send volume of all email steps across the campaign.\n\nSee [email reply rate benchmarks 2026](/learn/email-reply-rate-benchmarks-2026) for the data on how multichannel sequences compare against email-only for reply rates. Published benchmarks suggest 2-3x lift at the cost of 3-5x the complexity.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Gather these:\n\n| Item | Where | Required |\n|---|---|---|\n| Reply.io account (any paid plan) | reply.io | Yes |\n| Reply.io login email |, | Yes |\n| Reply.io password |, | Yes |\n| Infrabox mailboxes provisioned | Infrabox → Mailboxes | Yes |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes |\n| LinkedIn Sales Navigator (for LinkedIn channel) | linkedin.com/sales | Optional |\n| Twilio account (for SMS channel) | twilio.com | Optional |\n\n**Important scope note on credentials.** Reply.io supports both traditional username/password authentication and an API key option inside their UI. The Infrabox connect uses the username/password path because it's universally supported across all Reply.io plans. API-key-only integrations are available inside Reply.io itself for direct API work, but the Infrabox mailbox push uses credentials. This is different from tools like [BrandJet](/learn/infrabox-brandjet-integration) or [Supersend](/learn/infrabox-supersend-integration) that use API keys exclusively.",
    },
    {
      heading: "Step-by-Step: Connect Reply.io in Infrabox",
      content: "The full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** and pick **Reply.io** | 5 sec |\n| 3 | Enter **Email**: your Reply.io login | 5 sec |\n| 4 | Enter **Password**: your Reply.io password | 5 sec |\n| 5 | Click **Connect Account** |, |\n| 6 | Infrabox validates credentials via Reply.io's API | 1-3 sec |\n| 7 | Selected Infrabox mailboxes pushed into Reply.io as email senders | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90 seconds.**\n\nReply.io uses the standard credential form. No workspace picker, no API key. Validation happens on submit. After the export completes, the mailboxes show up inside Reply.io → Email Accounts, ready to attach to a sequence.",
    },
    {
      heading: "Daily Send Budget Math for Multichannel Sequences",
      content: "Because multichannel sequences fire multiple emails per prospect over a 2-week window, your daily send budget has to account for the combined email volume. Here is the math:\n\n| Campaign size | Sequence steps (email) | Total email volume | Infrabox mailboxes needed |\n|---|---|---|---|\n| 100 prospects | 3 email steps | 300 emails over 2 weeks = ~22/day | 1 mailbox |\n| 500 prospects | 4 email steps | 2,000 emails over 2 weeks = ~143/day | 4 mailboxes |\n| 1,000 prospects | 4 email steps | 4,000 emails over 2 weeks = ~286/day | 8 mailboxes |\n| 5,000 prospects | 4 email steps | 20,000 emails over 2 weeks = ~1,430/day | 40 mailboxes |\n\nThe math assumes 40 emails/day per mailbox as the practical safe ceiling. [Google's published hard cap is higher](/learn/email-sending-limits-google-microsoft), but staying under 50/day protects reputation. If you are running 5,000-prospect multichannel campaigns, you need [Infrabox Enterprise at $299/month for 100 mailboxes](/learn/infrabox-pricing) to have comfortable headroom.\n\n**Warmup interaction.** Reply.io does not ship built-in warmup on all plans, so pair your Infrabox mailboxes with one of: [Infrabox isolated warmup add-on](/learn/email-warmup-guide) ($3/mailbox/month), [TrulyInbox](/learn/infrabox-trulyinbox-integration), [MailToaster](/learn/infrabox-mailtoaster-integration), or [Warmy.io](/learn/infrabox-warmy-integration). Pick one: running two on the same mailbox is always a bad idea.",
    },
    {
      heading: "LinkedIn Integration: What's Involved and What's Not",
      content: "Reply.io's LinkedIn channel is separate from Infrabox. Here's what you should know if you plan to use multichannel:\n\n- **LinkedIn channel runs off your LinkedIn session cookie.** Reply.io's LinkedIn module opens a browser tab (or uses their cloud extension) to drive your actual LinkedIn account. If your LinkedIn gets restricted, the LinkedIn steps fail regardless of Infrabox.\n- **Rate limits are LinkedIn's, not Reply.io's.** LinkedIn caps ~100 connection requests/week and ~80 messages/day per account. You can't bypass this by connecting 10 Infrabox mailboxes, they don't apply to LinkedIn.\n- **LinkedIn Sales Navigator is strongly recommended.** Reply.io's LinkedIn module works with free LinkedIn but restrictions hit much faster. Sales Navigator gives you higher per-day caps and better prospect search.\n- **LinkedIn failures don't break email steps.** If a LinkedIn step fails (restricted account, rate limit, etc.), the email step continues to fire. Reply.io just flags the LinkedIn step as 'skipped' in the campaign log.\n\nThe bottom line: Infrabox handles the email side. Reply.io's LinkedIn side is a separate tool that happens to live in the same dashboard. If the LinkedIn side breaks, it has nothing to do with your Infrabox mailbox connection.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The typical failure modes for Infrabox → Reply.io connections:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Authentication failed' | Wrong password, or 2FA on Reply.io | Verify login in a clean browser; disable 2FA during connect |\n| Success but mailboxes missing in Reply.io | Sender seat cap hit | Upgrade Reply.io plan or delete unused senders, then Retry Export |\n| 'IMAP handshake failed' | IMAP disabled at Google Workspace OU | Enable IMAP in admin.google.com → Gmail → End User Access |\n| LinkedIn step fails but email works | LinkedIn account restricted or session expired | Re-authenticate LinkedIn inside Reply.io: not an Infrabox issue |\n| SMS step fails | Twilio account not linked or credit exhausted | Fix inside Reply.io → Integrations → Twilio |\n| Email sends burst then pause | Reply.io per-account throttling kicked in | Spread sends over more mailboxes or lower per-mailbox daily cap |\n\n**The per-account throttle is worth understanding.** Reply.io throttles sends at the account level to prevent individual mailboxes from burning reputation. If you configure a mailbox for 40/day but Reply.io's throttler decides the mailbox is too new, it caps at 15/day and the difference just doesn't send. Check Reply.io → Settings → Daily Limits if you see your effective volume consistently below configured.",
    },
    {
      heading: "Verifying the Connection Works",
      content: "Four smoke tests:\n\n**Test 1: mailbox test send.** In Reply.io → Email Accounts → (pick Infrabox mailbox) → Send Test. Confirm delivery in <30 seconds with DKIM passing.\n\n**Test 2: reply round-trip.** Reply to the test. Check Reply.io's Unibox within 2 minutes. If the reply appears, IMAP is working.\n\n**Test 3: multichannel pilot.** Run a 3-prospect test sequence with email step 1, LinkedIn step 2, email step 3. Confirm all three fire. Email steps verify the Infrabox connection; LinkedIn step verifies your LinkedIn session is active in Reply.io.\n\n**Test 4: inbox placement test.** Run a [seed-list test](/learn/inbox-placement-testing-explained) across Gmail, Outlook, Yahoo, Hotmail. Target 9/10+. Reply.io's per-account throttler is strict, so a clean test here validates that your outgoing emails are passing every filter.",
    },
  ],
  faqs: [
    { question: "Does Reply.io count LinkedIn messages against my Infrabox mailbox volume?", answer: "No. LinkedIn messages go through your LinkedIn session, not through email. Only the email steps of a Reply.io sequence use Infrabox mailboxes. Plan daily send caps based on the email-only volume of your campaigns." },
    { question: "Can I use Reply.io without LinkedIn?", answer: "Yes. Reply.io's email side works independently of LinkedIn. Many Infrabox users run Reply.io email-only and ignore the LinkedIn/SMS/call channels. If email is your main channel, tools like [Instantly](/learn/infrabox-instantly-integration) or [Smartlead](/learn/infrabox-smartlead-integration) are more focused and often cheaper per seat. Reply.io's premium price mostly buys you the multichannel capability." },
    { question: "How many Infrabox mailboxes can I push into one Reply.io account?", answer: "Reply.io's email account limit depends on your plan: typically 20-200 senders per account. Check Reply.io → Billing → Plan Details for your specific cap. If you need more than your plan allows, split across multiple Reply.io accounts or upgrade the plan." },
    { question: "Does Reply.io warmup affect Infrabox warmup?", answer: "Reply.io's warmup (on plans that include it) is a shared peer network similar to Instantly's or Smartlead's. Running it alongside Infrabox's isolated warmup add-on doubles warmup volume and confuses reputation signals. Pick one. For most Infrabox users, the $3/mailbox/month Infrabox warmup is simpler because it's the same dashboard, but if you're Reply.io-only, their built-in warmup is fine to use alone." },
    { question: "Can I run Reply.io and another email sender on the same Infrabox mailbox?", answer: "Technically yes, but we don't recommend it. Two senders on one mailbox race on Google's per-minute limit, fight over IMAP read state, and produce inconsistent reply routing. Dedicate each mailbox to a single sender tool. If you need to split traffic across multiple tools, split by mailbox pool instead: 5 mailboxes for Reply.io, 5 for another tool." },
  ],
  sources: [
    { title: "Reply.io Documentation", url: "https://docs.reply.io", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "email-reply-rate-benchmarks-2026",
    "infrabox-instantly-integration",
    "email-warmup-tools-comparison-2026",
    "scale-email-100-to-10000",
  ],
};
