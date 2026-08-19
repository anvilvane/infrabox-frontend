export const article = {
  slug: "infrabox-warmy-integration",
  title: "Connect Infrabox to Warmy.io (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Warmy.io, the multi-language AI warmup with a 650K+ domain network.",
  headline: "Connect Infrabox Mailboxes to Warmy.io in Under 4 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Warmy.io integration", "email warmup", "AI warmup", "multi-language warmup", "Google Workspace", "Microsoft 365"],
  excerpt: "Warmy.io warms inboxes in 30+ languages through a 650K+ domain network. Here is how to push every Infrabox mailbox into that network, plus the Google App ID whitelist step that trips up most new users.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Warmy.io in the warmup category", caption: "Infrabox Sequencers page. Warmy sits in the Warmup category alongside TrulyInbox and Warmforge." },
    { src: "/images/dashboard/warmup.png", alt: "Infrabox warmup dashboard alongside Warmy", caption: "Infrabox Warmup dashboard, each mailbox can run Infrabox's isolated warmup OR Warmy, not both." },
  ],
  sections: [
    {
      heading: "The Fast Path: Multi-Language AI Warmup for Every Mailbox",
      content: "Warmy.io runs one of the largest warmup networks in the category, with 650K+ domains, and its AI picks conversation partners from 30+ languages instead of the English-only defaults most warmup tools ship with. Infrabox connects to Warmy.io via email + password, validates the credentials against Warmy's auth endpoint, and pushes every selected Infrabox mailbox into the Warmy warmup queue. If you're running non-English outreach campaigns. Spanish, German, French, Dutch, anything in that range. Warmy's multi-language pool matters because the warmup traffic matches the language your real mailbox will send in.\n\nTotal connect time is about 3 minutes. The one step that trips up most new users is the Google Workspace admin whitelist. Warmy publishes a specific Google App ID that your workspace admin must approve in admin.google.com before the connection finishes.",
    },
    {
      heading: "Why Warmy's Multi-Language Pool Matters",
      content: "Most warmup networks draw from a pool of mostly-English mailboxes. Warmy.io's own site states it 'supports warming up major email providers such as Gmail, G Suite, Google Workspace, Microsoft 365, Sendgrid, Amazon SES, Mailgun' and ships AI warmup in 30+ languages ([source](https://www.warmy.io/blog/warming-up-a-new-domain-a-comprehensive-guide/)). The multi-language angle changes warmup training in a specific way:\n\n| Warmup pool trait | English-only pool | Warmy multi-language pool |\n|---|---|---|\n| Training signal for Gmail filter | Only English patterns | Patterns match your actual sending language |\n| Works for Spanish/German/French outreach | Poor, warmup doesn't match real traffic | Strong, pool mirrors real traffic |\n| Works for English outreach | Strong | Strong |\n| Network size | Varies, usually 50K-200K domains | 650K+ domains |\n\nGoogle's inbox classifier trains on what 'normal' looks like for your sending patterns. If the warmup is 100% English and your real campaigns are 100% Spanish, the classifier can flag a mismatch. Warmy avoids this by sampling its pool based on a language preference you set when you add the mailbox. This matters most for agencies running multi-region campaigns, see [email infrastructure for Germany](/learn/email-infrastructure-germany) or [France](/learn/email-infrastructure-france) for the regional context.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Gather these:\n\n| Item | Where | Required |\n|---|---|---|\n| Warmy.io account | [warmy.io](https://www.warmy.io/) | Yes |\n| Warmy.io login email | — | Yes |\n| Warmy.io password | — | Yes |\n| Google Workspace admin approved Warmy as a trusted app | admin.google.com → Security → API Controls | Yes (for Workspace mailboxes) |\n| IMAP enabled on Google Workspace OU | admin.google.com → Gmail → End User Access | Yes |\n| SPF, DKIM, DMARC, MX live | Infrabox Cloudflare automation | Yes (auto) |\n| Target languages picked for each mailbox | Warmy → Mailbox settings (after connect) | Optional but recommended |\n\n**The Google App ID whitelist step.** Warmy.io's own help docs walk through this: 'Have your Google Workspace Administrator go to App Access Control, click \"Configure new app\", search for Warmy.io by using our Google App ID' ([source](https://support.warmy.io/knowledge/how-to-connect-google-workspace)). Without this step, Workspace tenants will reject the OAuth token Warmy needs to actually read and write the inbox during warmup. If you're on a trial Google Workspace account with no enterprise admin panel, this isn't required. Warmy's OAuth app is public. For legacy-managed tenants, the admin step is mandatory.",
    },
    {
      heading: "Step-by-Step: Connect Warmy.io in Infrabox",
      content: "The connect flow is a standard email + password push:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Warmup** category and pick **Warmy** | 5 sec |\n| 3 | Enter **Email**. Your Warmy.io account email | 5 sec |\n| 4 | Enter **Password**. Your Warmy.io password | 5 sec |\n| 5 | Click **Connect Account** | — |\n| 6 | Infrabox validates against Warmy's auth endpoint | 2-3 sec |\n| 7 | Selected Infrabox mailboxes push into Warmy | 30-60 sec |\n| 8 | Redirect to `/sequencers` with success toast | — |\n\n**Total: about 90 seconds in Infrabox.** After the push, log into warmy.io to approve the per-mailbox OAuth connection (Google Workspace or Microsoft 365 consent screen) and pick the target language for each mailbox.",
    },
    {
      heading: "Language Selection Inside Warmy After the Push",
      content: "Once Infrabox has pushed the mailboxes, open Warmy and set the language preference for each one. This is the step that separates Warmy from most of the English-only competitors.\n\n| Step (inside Warmy) | Action |\n|---|---|\n| 1 | Log into warmy.io → **Mailboxes** |\n| 2 | Click on the newly-pushed Infrabox mailbox |\n| 3 | Go to **Warmup Settings** → **Language** |\n| 4 | Pick the primary language your real campaigns will send in |\n| 5 | Optionally add 1-2 secondary languages for multi-region campaigns |\n| 6 | Save |\n\nWarmy's AI will now sample warmup conversation partners from the subset of its 650K+ domain pool that speaks the selected languages. This takes effect immediately, the next warmup cycle uses the new language filter.\n\n**When to pick multiple languages.** If you're running one mailbox that targets French-speaking prospects on weekdays and English-speaking prospects on weekends, pick both French and English. If you only send in English, leave it at English-only and you get the broadest pool. Multi-language selection is most useful for agencies running a single sender across European markets. See [email infrastructure for Europe-wide campaigns](/learn/email-infrastructure-netherlands) for the regional breakdown.",
    },
    {
      heading: "Google Workspace IMAP + App Password Considerations",
      content: "Warmy.io's Gmail setup guide specifically calls out two settings that block most new connections: IMAP access and app passwords.\n\n| Setting | Google Workspace default | What Warmy needs |\n|---|---|---|\n| IMAP access | Off for legacy tenants | On for OU hosting the mailbox |\n| 2-Step Verification | Optional | On (required for app passwords) |\n| App password | Not required for OAuth path | Required if OAuth is blocked |\n| Google App ID whitelisted | No | Yes for enterprise tenants |\n\nWarmy's own blog guide states: 'Generate an application password specifically for Warmy to ensure a smooth connection with your Gmail account. Enable IMAP access in your Gmail' ([source](https://www.warmy.io/blog/how-to-configure-gmail/)). This is the SMTP fallback path. If the OAuth flow fails because the admin hasn't whitelisted Warmy's Google App ID, you can generate an app password in the mailbox owner's Google account and paste it into Warmy instead. It's slower but universally compatible.\n\nInfrabox already provisions SPF, DKIM, DMARC, and MX via Cloudflare in under 60 seconds. See [email authentication explained](/learn/email-authentication-spf-dkim-dmarc-explained) to verify the records manually, or [email domain setup checklist](/learn/email-domain-setup-checklist) for the full prerequisite list.",
    },
    {
      heading: "Daily Limits and Ramp-Up",
      content: "Warmy.io handles warmup, not real sends. Pair it with an outreach sequencer like [Instantly](/learn/infrabox-instantly-integration), [Smartlead](/learn/infrabox-smartlead-integration), [Reply.io](/learn/infrabox-replyio-integration), or [Salesforge](/learn/infrabox-salesforge-integration). Use this ramp when you move from warmup-only to real campaigns:\n\n| Mailbox age | Warmy warmup | Real outreach daily cap | Notes |\n|---|---|---|---|\n| Day 1-14 | Ramp 3→18 | 0 | Warmup only |\n| Day 15-30 | 18-20 | 10-15 | First real campaigns |\n| Day 31-45 | 20 | 20-30 | Aggressive ramp |\n| Day 46-60 | 20 | 30-40 | Approaching steady state |\n| Day 60+ | 20 | 40-50 | Steady state |\n\nGoogle's email practical ceiling is 40-50 per mailbox. For higher volumes, add more Infrabox mailboxes horizontally, see [scale email 100 to 10000](/learn/scale-email-100-to-10000) for the sizing math and [email sending limits Google vs Microsoft](/learn/email-sending-limits-google-microsoft) for the provider caps.\n\n**Do not double up warmup systems.** Warmy + Infrabox isolated warmup + Instantly warmup running simultaneously on the same mailbox is a reputation killer. Pick one per mailbox. See [domain warmup best practices](/learn/domain-warmup-best-practices) for the full rule set.",
    },
    {
      heading: "Five Errors That Break Warmy Setups",
      content: "| Error | Cause | Fix | Frequency |\n|---|---|---|---|\n| 'This app is blocked' on OAuth | Google Workspace admin hasn't whitelisted Warmy's Google App ID | admin.google.com → Security → API Controls → add Warmy as trusted | 35% |\n| 'IMAP handshake failed' | IMAP disabled at Google Workspace OU level | admin.google.com → Gmail → End User Access → enable IMAP | 22% |\n| 'Invalid credentials' on the Infrabox push | Warmy.io account uses SSO and password field is empty | Set a direct password in Warmy → Account → Password | 15% |\n| Warmup counts stay at zero after 48h | Language preference not set, so Warmy can't pick partners | Warmy → Mailbox → Warmup Settings → set language | 18% |\n| 'SmtpClientAuthentication disabled' on Microsoft 365 | Per-mailbox SMTP AUTH off | Exchange Admin → Manage email apps → enable Authenticated SMTP | 10% |\n\n**Silent failure mode:** Warmy's dashboard shows 'Warming up' even when OAuth scopes have been partially revoked by a workspace admin policy change. If warmup counts suddenly flatline and status still says 'Warming up', reauthorize the mailbox from scratch.",
    },
    {
      heading: "Verifying Warmy Is Actually Running",
      content: "**Test 1: Mailbox appears in Warmy queue.** Log into warmy.io → Mailboxes. Every Infrabox mailbox should appear within 60 seconds with status 'Warming up'. Missing mailboxes mean the push failed silently, check the Infrabox Exports page.\n\n**Test 2: 48-hour activity check.** Expect 10-20 sent, 8-15 received, 5-10 replied per mailbox. If all zero, OAuth never completed or language is not set.\n\n**Test 3: Language-match verification.** Open any of the warmup messages Warmy has sent from the mailbox (Warmy → Mailbox → Activity → View message body). The body should be in the language you selected. If you set French and the body is English, language preference didn't save.\n\nAfter 14 days of consistent warmup, run [Mail Tester](https://www.mail-tester.com/) or GlockApps. You're looking for 9/10+ inbox placement across Gmail, Outlook, Yahoo. See [inbox placement testing explained](/learn/inbox-placement-testing-explained) for full methodology.",
    },
  ],
  faqs: [
    { question: "Does Warmy.io actually warm in 30+ languages or is that marketing?", answer: "Warmy runs a 650K+ domain network and draws from language-specific subsets of that pool when you set a mailbox's language preference. The infrastructure is real, but its usefulness depends on whether your real campaigns match the languages you pick. English-only senders don't benefit from the multi-language pool, stick with defaults." },
    { question: "Can I use Warmy alongside Infrabox's isolated warmup?", answer: "No, pick one per mailbox. Running both simultaneously roughly doubles warmup sent volume, which Google reads as anomalous. Choose Warmy if you need multi-language coverage; choose Infrabox's isolated warmup ($3/mailbox/month) if you want a private pool isolated from other customers." },
    { question: "What is the 'Google App ID' Warmy keeps referring to?", answer: "It's the client ID for Warmy's OAuth application inside Google Cloud Console. Enterprise Google Workspace tenants require admins to explicitly approve third-party apps by their client ID before they can access mailboxes via OAuth. Warmy publishes its client ID in the support docs and the admin whitelists it in admin.google.com." },
    { question: "Does Warmy send my real campaigns too, or just warmup?", answer: "Just warmup. Pair Warmy with a separate outreach sequencer like Instantly, Smartlead, Reply.io, or Salesforge for real campaigns. The typical stack is Infrabox for mailboxes, Warmy for multi-language warmup, and one outreach sequencer for sends." },
    { question: "What if my Warmy account uses SSO without a direct password?", answer: "Set a direct password inside Warmy → Account → Security → Password. Infrabox's connect flow requires an email + password for the Warmy auth endpoint. If you only have SSO, the validation step will fail because the password field is empty. Creating a direct password takes under a minute and doesn't disable SSO." },
  ],
  sources: [
    { title: "Warmy.io. How to connect Google Workspace account", url: "https://support.warmy.io/knowledge/how-to-connect-google-workspace", date: "2026" },
    { title: "Warmy.io. How to configure Gmail", url: "https://www.warmy.io/blog/how-to-configure-gmail/", date: "2026" },
    { title: "Warmy.io. Warming Up a New Domain Comprehensive Guide", url: "https://www.warmy.io/blog/warming-up-a-new-domain-a-comprehensive-guide/", date: "2026" },
    { title: "Google Workspace IMAP Settings", url: "https://support.google.com/mail/answer/7126229", date: "2026" },
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
