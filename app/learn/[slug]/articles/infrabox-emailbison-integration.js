export const article = {
  slug: "infrabox-emailbison-integration",
  title: "Connect Infrabox to Email Bison (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Email Bison: dedicated-server email with per-client IP isolation.",
  headline: "Connect Infrabox Mailboxes to Email Bison in 3 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "8 min read",
  tags: ["Email Bison integration", "dedicated IP", "email setup", "Google Workspace", "Microsoft 365", "private warmup"],
  excerpt: "Email Bison runs a dedicated server per client with its own private warmup pool. Infrabox mailboxes plug in via a standard credentials flow: here is the exact setup, plus how the two isolation layers stack.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Email Bison connected", caption: "Infrabox Sequencers page showing Email Bison in the Outreach category alongside Instantly, Smartlead, and Salesforge." },
    { src: "/images/dashboard/mailboxes.png", alt: "Infrabox mailboxes ready to export to Email Bison", caption: "Infrabox Mailboxes page: select Google Workspace or Microsoft 365 mailboxes and push them to Email Bison as a batch." },
  ],
  sections: [
    {
      heading: "The Fast Path: Credentials Into a Dedicated Email Bison Server",
      content: "Email Bison connects via email + password inside Infrabox's Sequencers Connect screen. Unlike shared-server tools like Instantly or Smartlead, every Email Bison client runs on a dedicated server with a dedicated IP, and your Infrabox mailboxes inherit that isolation the moment they are imported. The connect itself is standard. Infrabox validates the credentials against your Email Bison instance URL, then pushes each selected mailbox via SMTP and IMAP. Expect about 90 seconds start to finish.\n\nThis is the integration to pick if you are running sensitive B2B outreach, compliance-scoped verticals (legal, finance, healthcare), or any workflow where you need to be able to prove that your sending IP is not shared with another tenant.",
    },
    {
      heading: "What Makes Email Bison Different From Shared-IP Sequencers",
      content: "Email Bison's architectural bet is dedicated infrastructure per client. Every other mainstream sequencer. Instantly, Smartlead, Reply.io, Lemlist: puts your SMTP traffic on a shared sender pool. Bison doesn't.\n\n| Design choice | Shared-server tools | Email Bison |\n|---|---|---|\n| Sending IP | Shared pool across tenants | One IP per client |\n| Warmup network | Shared warmup pool | Private warmup pool per client |\n| Database | Multi-tenant | Dedicated DB per client |\n| Cost | $37-$99/mo | Typically $299+/mo |\n| Best for | SMB email | Privacy-sensitive verticals, large agencies |\n\nThis matters because of how Gmail and Microsoft score reputation. Shared sending IPs can be pulled down by another tenant's bad behavior, if someone else on the Instantly pool sends 10,000 spam messages on Tuesday, your Wednesday sends are now on a slightly damaged IP. With Bison, that blast radius is zero. You own the IP, so your reputation moves only when you move it.\n\nInfrabox doesn't compete with this, it complements it. Infrabox provisions real Google Workspace and Microsoft 365 mailboxes on US-based IPs, which is the *mailbox* side of the equation. Bison handles the *sending gateway* side. Together, you get isolation on both halves. See [shared vs private email infrastructure](/learn/shared-vs-private-email-infrastructure) for a deeper look at the trade-offs.",
    },
    {
      heading: "Prerequisites: Email Bison Account Setup",
      content: "Before you open the Infrabox Sequencers Connect screen, make sure these are in place:\n\n| Item | Where | Required |\n|---|---|---|\n| Email Bison subscription with a provisioned dedicated server | emailbison.com | Yes |\n| Bison account login (email + password) | Your onboarding email from Bison | Yes |\n| Bison instance URL (e.g. app.yourcompany.bison.io) | Your dedicated subdomain, assigned at signup | Yes: needed during validation |\n| At least one Infrabox mailbox | Infrabox → Mailboxes | Yes |\n| Domain DNS (SPF, DKIM, DMARC, MX) live | Infrabox auto-configures via Cloudflare in under 60 seconds | Yes |\n| Private warmup pool enabled inside Bison | Bison Settings → Warmup | Recommended |\n\n**Critical note on the Bison instance URL.** Because each client runs on a dedicated subdomain, the Infrabox connect flow asks for it up front. If your Bison onboarding email says `https://acmeinc.bison.io`, paste exactly that: without trailing slash: into the App URL field. Getting this wrong is the single most common connection failure. Your Bison support contact can tell you the exact URL if you are not sure.",
    },
    {
      heading: "Step-by-Step: Connect Email Bison",
      content: "Here is the full click path:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Pick **Email Bison** from the Outreach category | 5 sec |\n| 3 | Enter **Email**: your Bison account login | 5 sec |\n| 4 | Enter **Password**: your Bison account password | 5 sec |\n| 5 | Click **Connect Account** |, |\n| 6 | Infrabox validates the credentials against your dedicated Bison instance | 1-3 sec |\n| 7 | Mailboxes are pushed to Bison via SMTP | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90 seconds.**\n\nUnlike BrandJet or Supersend (which use API keys with special validation UIs), Email Bison uses the standard credential form. Validation is synchronous on submit: a wrong credential pair returns an instant error.\n\nOne UX detail that trips new users: Bison's login email and the sending mailbox address are usually different. The Email field on the connect screen should be your Bison account email (the one you log into app.yourcompany.bison.io with), not the Infrabox mailbox address you want to send from. The mailbox addresses come from Infrabox, you never type them into Bison manually.",
    },
    {
      heading: "Private Warmup: Bison vs Infrabox Warmup Add-On",
      content: "Email Bison ships a private warmup pool as part of the dedicated-infrastructure package. Infrabox's warmup add-on ($3/mailbox/month) is a separate isolated peer network. You have to pick one per mailbox: running both at once just burns reputation and confuses signals.\n\n| Warmup option | Cost | Network | When to pick |\n|---|---|---|---|\n| Email Bison private warmup | Included in Bison plan | Bison's per-client pool | If every mailbox lives inside Bison long-term |\n| Infrabox isolated warmup | $3/mailbox/month | Separate peer network | Multi-sequencer setup, or if you move mailboxes between tools |\n\nFor most Bison customers, Bison's built-in warmup is the right call because it runs on the same dedicated infrastructure as the actual sends, which means the warmup traffic directly trains the IP and domain reputation you are about to use for outreach. The Infrabox warmup add-on is better if you are running mailboxes across multiple sequencers (e.g. some in Bison, some in Smartlead) and want one consistent warmup profile across all of them.\n\nDo not double-warm. The [email warmup tools comparison](/learn/email-warmup-tools-comparison-2026) and [email warmup guide](/learn/email-warmup-guide) both break down why running two warmup engines on one mailbox generates inconsistent reputation signals at Gmail Postmaster.",
    },
    {
      heading: "Daily Sending Limits on a Bison Dedicated Server",
      content: "Even on a dedicated IP, Gmail and Microsoft still enforce per-mailbox send limits. Your mailbox is still a single Google Workspace account, and Google caps it at [~2,000 external recipients per day](/learn/email-sending-limits-google-microsoft). Email best practice is to stay well below that.\n\n| Mailbox age | Safe daily send | Bison daily_limit | Notes |\n|---|---|---|---|\n| Day 1-14 | 0 | 0 | Warmup only |\n| Day 15-30 | 15-20 | 15 | Early sends |\n| Day 31-60 | 25-40 | 30 | Full ramp |\n| Day 60+ | 40-50 | 40 | Steady state |\n\nThe advantage of a dedicated Bison IP is that you can run closer to the upper edge of this range without worrying about a neighbor dragging your reputation down. Some agencies with fully-warmed Bison mailboxes run 50-60/day per mailbox in mature mode. That is still far under Google's hard cap, but gets meaningful scale when you have 50+ mailboxes going. See the [scale email 100 to 10000 playbook](/learn/scale-email-100-to-10000) for how the mailbox-count math works at each tier.",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "Five most common failure modes for Infrabox → Email Bison connections:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Instance URL not reachable' | Wrong subdomain, typo, or DNS propagation incomplete | Verify with `curl -I https://yourcompany.bison.io`: should return 200 |\n| 'Authentication failed' | Wrong credentials, or account not yet provisioned on the dedicated server | Check login at app.yourcompany.bison.io in a browser first |\n| 'Connection timeout' | Bison instance still warming up post-provisioning | Wait 5-10 minutes after Bison confirms your instance is live |\n| Some mailboxes export but not others | Infrabox hits Bison's rate limit mid-batch | Export in groups of 10 with 60s between |\n| SMTP auth error inside Bison after successful import | Target mailbox has 2-step verification on without app password | Generate Google app password or use OAuth path |\n\n**On the dedicated-server timing issue:** Email Bison onboarding can take a few hours to provision your dedicated instance even after payment. If you try to connect Infrabox before the Bison instance is fully up, you will get a 'Connection timeout' error with no useful detail. Confirm the instance is live by logging in via the web first, then retry the Infrabox connect.",
    },
    {
      heading: "Verifying the Integration Works End to End",
      content: "Four checks before your first real campaign:\n\n**Check 1: SMTP test send.** In Bison, open the imported mailbox, send a test email to your own address. Confirm it lands in <30 seconds with DKIM passing in the headers.\n\n**Check 2: IMAP reply fetch.** Reply to the test. Return to Bison's unified inbox within 2 minutes. If the reply appears, IMAP is working. Bison pulls replies via IMAP just like Salesforge Primebox and [Instantly's Unibox](/learn/infrabox-instantly-integration), so the same Google Workspace IMAP-at-OU-level prerequisite applies.\n\n**Check 3: sending IP verification.** This is Bison's whole value proposition: confirm you are actually sending from a dedicated IP. Send a test to a seed address, open the raw headers, find the `Received:` line. Run the IP through [MXToolbox](https://mxtoolbox.com/blacklists.aspx). You should see your Bison instance IP, not a shared pool IP. If you see a shared pool, contact Bison support.\n\n**Check 4: inbox placement test.** Run a seed test across Gmail, Outlook, Yahoo, Hotmail. Look for 9/10+ on a dedicated-IP Bison setup, you paid for a clean IP, so the score should be excellent from day one. If it is not, see [inbox placement testing explained](/learn/inbox-placement-testing-explained) to diagnose.",
    },
  ],
  faqs: [
    { question: "Does the dedicated Bison IP replace the need for Infrabox mailboxes to be on US IPs?", answer: "No, they stack. The Infrabox mailbox IP is the IP that the mailbox's OAuth session originates from. The Bison IP is the sending IP that the actual SMTP relay uses. Both matter. US-based mailbox IPs help with Google's geo-reputation on the inbound side, and the Bison dedicated IP is what external mail servers see on the outbound side. For most email setups, having both is ideal." },
    { question: "How many mailboxes can I push into one Bison dedicated server?", answer: "Depends on the server size you bought, but most Bison dedicated plans support 50-200 mailboxes on a single instance. If you are planning to scale past 200, talk to Bison support about a multi-server setup. Infrabox can split exports across multiple Bison instances by running the connect flow twice with different credentials." },
    { question: "What happens if my Bison account is paused for non-payment?", answer: "The connection stays in place in Infrabox, but any new export attempts will fail with 'Authentication failed' until billing is resolved. Existing mailboxes already pushed to Bison are not affected on the Infrabox side, they stay provisioned in Bison and resume sending the moment billing is restored." },
    { question: "Can I use Bison and another sequencer on the same Infrabox mailbox?", answer: "Technically yes, but we don't recommend it. Two sequencers will race on sending and fight over IMAP read flags, which causes inconsistent reply attribution. Dedicate each mailbox to one tool. If you must split, at least split at the mailbox level: 5 mailboxes for Bison, 5 for Smartlead, etc." },
    { question: "Does Email Bison support Microsoft 365 mailboxes from Infrabox?", answer: "Yes. Bison's dedicated-server architecture is transport-agnostic, it uses SMTP + IMAP, which both Google Workspace and Microsoft 365 support. The prerequisite for Microsoft 365 is that your admin enabled Authenticated SMTP at the mailbox level, which Infrabox handles during provisioning." },
  ],
  sources: [
    { title: "Email Bison Documentation", url: "https://docs.emailbison.com", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
    { title: "MXToolbox Blacklist Check", url: "https://mxtoolbox.com/blacklists.aspx", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "shared-vs-private-email-infrastructure",
    "email-warmup-guide",
    "inbox-placement-testing-explained",
    "scale-email-100-to-10000",
  ],
};
