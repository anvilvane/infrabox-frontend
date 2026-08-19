export const article = {
  slug: "infrabox-supersend-integration",
  title: "Connect Infrabox to Supersend (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Supersend using a single API key, custom validation, and bulk mailbox push.",
  headline: "Connect Infrabox Mailboxes to Supersend in Under 2 Minutes",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["Supersend integration", "api key", "email setup", "Google Workspace", "Microsoft 365", "sequencer"],
  excerpt: "Supersend is one of only two sequencers in the Infrabox catalog that uses a single API key instead of email + password. Infrabox validates the key, shows the connected account, and pushes every selected mailbox in one call.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with Supersend connected", caption: "Infrabox Sequencers page, Supersend is listed alongside BrandJet as an API-key sequencer in the Outreach category." },
    { src: "/images/dashboard/exports.png", alt: "Infrabox exports tracking Supersend push", caption: "Infrabox Exports page showing a Supersend push with per-mailbox status and one-click retry." },
  ],
  sections: [
    {
      heading: "The Fast Path: One API Key, Zero Passwords",
      content: "Supersend is one of only two sequencers in the Infrabox catalog (the other is [BrandJet](/learn/infrabox-brandjet-integration)) that connects with a single API key instead of email + password. You generate a key inside Supersend, paste it into the Infrabox Sequencers Connect screen, and Infrabox validates the key against Supersend's account endpoint. On success, Infrabox displays the account name and email on a green card so you can confirm you're pushing mailboxes into the right Supersend account before hitting Connect.\n\nTotal setup time is under 2 minutes once you have the API key in your clipboard. There are no per-mailbox consent screens, no SMTP server to remember, and no app password generation. This is the fastest connect path in the entire catalog.",
    },
    {
      heading: "Why Supersend Uses an API Key Instead of Credentials",
      content: "Every other sequencer in the Infrabox catalog asks for either email + password (Instantly, Smartlead, Reply.io) or goes through full OAuth. Supersend picked a different pattern because of how its sending architecture works:\n\n| Design choice | What it means for you |\n|---|---|\n| Account-scoped API keys | One key corresponds to one Supersend account, not one seat |\n| Managed SMTP inside Supersend | You never paste SMTP credentials into Infrabox, Supersend handles the outbound layer |\n| Account info returned on validation | Infrabox shows the account email + display name in a green card before you click Connect |\n| Debounced key validation | 800ms after you stop typing, Infrabox pings Supersend's verify endpoint automatically |\n\nThe key validation is specifically implemented in the Infrabox connect flow as a debounced API-key check against Supersend's verify endpoint. If the key is invalid, you see 'Invalid API Key'. If the key is valid, you see the account's email and display name on a confirmation card. The flow mirrors BrandJet's API-key validation but returns slightly different metadata.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Have these ready before opening the Infrabox Sequencers Connect screen:\n\n| Item | Where to find it | Required |\n|---|---|---|\n| Supersend account (any paid plan) | supersend.io | Yes |\n| Supersend API key | Supersend → Settings → API / Integrations → **Generate API Key** | Yes |\n| At least one Infrabox mailbox provisioned | Infrabox → Mailboxes | Yes |\n| SPF, DKIM, DMARC, MX records live | Infrabox handles this automatically via Cloudflare in under 60 seconds | Yes |\n| Infrabox plan on Professional or higher | [infrabox.software/pricing](/learn/infrabox-pricing) | Yes |\n\n**Where the API key lives:** Inside Supersend, go to **Settings** → **API** (or **Integrations** on older accounts). Click **Generate new key**, name it 'Infrabox', and copy it once, Supersend only shows the full key on generation. Store it in a password manager; if you lose it, you have to rotate and reconnect. Source: [Supersend help center, Senders Overview](https://help.supersend.io/en/article/senders-overview-vqg87v/).\n\nInfrabox already provisions SPF, DKIM, DMARC, and MX automatically via Cloudflare at mailbox creation time, so the DNS row is green before you reach Supersend. If you want to double-check the records, see the [email domain setup checklist](/learn/email-domain-setup-checklist).",
    },
    {
      heading: "Step-by-Step: Connect Supersend in Infrabox",
      content: "Once you have the API key in your clipboard, the actual connection is a single screen:\n\n| Step | Action | Expected time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** and pick **Supersend** | 5 sec |\n| 3 | Paste your Supersend API key into the single **API Key** field | 5 sec |\n| 4 | Infrabox auto-validates the key 800ms after you stop typing | 1 sec |\n| 5 | On success, a green card appears showing the Supersend account's email and display name |, |\n| 6 | Confirm the account is correct, then click **Connect Account** | 5 sec |\n| 7 | Infrabox pushes every selected mailbox to that Supersend account | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90 seconds, start to finish.**\n\nThere is no email, no password, no SMTP dropdown, no per-mailbox OAuth consent screen. The Supersend account display card is the only confirmation you need, if the account email matches the one you logged into Supersend with, the connection is pointed at the right place.",
    },
    {
      heading: "What the Account Info Card Actually Tells You",
      content: "After validation, Infrabox renders a card with two pieces of metadata pulled from Supersend's verify endpoint:\n\n| Field | Source | What to check |\n|---|---|---|\n| Account email | Supersend account owner email | Matches the email you log into Supersend with |\n| Display name | Supersend account display name | Matches the team or workspace name you expect |\n\nIf the email doesn't match: for example, you copied an API key from a stale browser tab logged into a different Supersend account: stop and regenerate the key from the correct account. Pushing 30 mailboxes into the wrong Supersend account is recoverable, but you have to delete them from inside Supersend one at a time. Five seconds of verification saves 20 minutes of cleanup.\n\n**Silent failure mode:** If Supersend's verify endpoint is down, Infrabox will toast a 'Service Unavailable' error instead of a validation result. Retry once; if it persists, check [status.supersend.io](https://help.supersend.io/en/article/integrations-overview-r3pvl9/) or come back in 15 minutes. Do not try to force-submit without validation, the Connect Account button is disabled until the green card appears.",
    },
    {
      heading: "How Supersend Handles Infrabox Mailboxes After Connect",
      content: "Once connected, Supersend provisions each Infrabox mailbox as a 'Sender' inside its own Senders list. Supersend's public docs describe this as: 'Create thousands of sending identities from a single connection.' Each Infrabox mailbox becomes one sending identity.\n\n| Pipeline stage | What Supersend does | What the mailbox does |\n|---|---|---|\n| Provision | Supersend adds the mailbox as a Sender record | Receives a new sending identity |\n| Warmup hookup | Supersend's built-in warmup network queues the mailbox | Starts sending 3-5 warmup messages/day |\n| Campaign assignment | You assign senders to campaigns in Supersend UI | Mailbox starts receiving real send commands |\n| SMTP relay | Supersend relays through Google/Microsoft via the mailbox's managed credentials | Sends outbound campaign emails |\n| Reply sync | Supersend polls via IMAP | Delivers replies to Supersend Inbox |\n\n**Use one warmup system, not two.** If you already pay for [Infrabox's isolated warmup add-on](/learn/email-warmup-guide) at $3/mailbox/month, turn off Supersend's built-in warmup in the Sender settings. Running both roughly doubles warmup sent volume and confuses Google's inbox classifiers. Pick one or the other.",
    },
    {
      heading: "Daily Limits and Ramp-Up",
      content: "Supersend's default daily limit is too aggressive for brand-new Infrabox mailboxes. Use this schedule instead:\n\n| Mailbox age | Daily limit | Warmup target | Notes |\n|---|---|---|---|\n| Day 1-14 | 0 | 5-10/day | Warmup only, no real sends |\n| Day 15-30 | 15 | 15 | First real campaigns |\n| Day 31-45 | 25 | 20 | Ramp |\n| Day 46-60 | 35 | 25 | Approaching steady state |\n| Day 60+ | 40-50 | 25 | Steady state |\n\nGoogle's published hard cap for Google Workspace outbound relay is around 2,000 external recipients per day ([source](https://support.google.com/a/answer/166852)), but the practical email ceiling is 40-50 per mailbox before reputation degrades. To hit higher volume, add more Infrabox mailboxes instead of pushing any single mailbox past 50/day. For the full volume math, see [scale email 100 to 10000](/learn/scale-email-100-to-10000) and [email sending limits Google vs Microsoft](/learn/email-sending-limits-google-microsoft).",
    },
    {
      heading: "Five Errors That Break Supersend Setups",
      content: "| Error | Cause | Fix | Frequency |\n|---|---|---|---|\n| 'Invalid API Key' badge after paste | Key was copied with a trailing space, or was rotated in Supersend | Regenerate the key in Supersend Settings → API, paste fresh | 40% |\n| 'Service Unavailable' toast | Supersend's verify endpoint timed out | Retry after 15 minutes, check Supersend status page | 15% |\n| Green card shows wrong account email | API key came from a different Supersend account | Log out of the stale account, generate a new key from the correct one | 20% |\n| Mailboxes pushed but don't appear in Supersend Senders list | Warmup status not yet synced | Wait 2 minutes and refresh the Supersend Senders page | 15% |\n| 'Domain not verified' on first send | SPF/DKIM/DMARC not propagated from the Infrabox mailbox domain | Wait 30 minutes, re-check via [DNS Checker](https://dnschecker.org) | 10% |\n\n**One more footgun:** If you hit the Connect Account button too fast: before the debounced validation completes, the button stays disabled. Wait for the green card before clicking.",
    },
    {
      heading: "Verifying the Connection Actually Works",
      content: "Do not trust the green toast alone. Run this three-step smoke test after every new Supersend connect:\n\n**Test 1: Check the Senders list.** Supersend → **Senders** → filter by recently-added. Every Infrabox mailbox you selected should appear within 60 seconds. If any are missing, they failed validation on Supersend's side: usually an IMAP handshake issue.\n\n**Test 2: Send a test from Supersend.** Pick one Sender → **Send test email** to your own inbox. Expect delivery within 30 seconds. If the test fails, SMTP relay is broken.\n\n**Test 3: Warmup activity after 24 hours.** Check the Sender's Warmup tab. You should see 5-10 sent, 3-7 received, 1-3 replies. If all counts are zero, warmup never started, the Sender is still in pending state. See [inbox placement testing explained](/learn/inbox-placement-testing-explained) for deeper validation of deliverability.",
    },
  ],
  faqs: [
    { question: "Can I use the same Infrabox mailbox in Supersend and another sequencer at the same time?", answer: "Only if each sequencer targets different recipients and never sends within the same minute. In practice, two sequencers racing on the same mailbox will hit Google's per-minute SMTP limits and fight over IMAP read flags. Dedicate each mailbox to one sequencer at a time." },
    { question: "Does Supersend's built-in warmup replace Infrabox's warmup add-on?", answer: "Pick one. Supersend's warmup uses a shared pool and is included. Infrabox's isolated warmup ($3/mailbox/month) uses a separate peer network and generally produces cleaner reputation signals. Running both at once roughly doubles warmup volume and confuses Google." },
    { question: "How is Supersend different from BrandJet if they both use API keys?", answer: "Both use a single API key, but the returned metadata differs. Supersend shows account email + display name. BrandJet shows account email + name. Both render in Infrabox as a green confirmation card. Functionally the connect flow is identical, the only difference is the underlying sending architecture inside each product." },
    { question: "Where do I generate a Supersend API key?", answer: "Inside Supersend, go to Settings → API (or Integrations on older accounts), click Generate new key, name it 'Infrabox', and copy the full key once. Supersend only shows the full value on generation: store it in a password manager or you'll have to rotate." },
    { question: "Does Supersend charge per connected mailbox?", answer: "Yes. Supersend bills by active Sender. Every Infrabox mailbox you connect counts against your Supersend tier. Compare the connection cost against your Infrabox plan: at [$39/month for 10 mailboxes on Infrabox Professional](/learn/infrabox-pricing), you'd want a matching Supersend tier." },
  ],
  sources: [
    { title: "Supersend: Senders Overview", url: "https://help.supersend.io/en/article/senders-overview-vqg87v/", date: "2026" },
    { title: "Supersend: Integrations Overview", url: "https://help.supersend.io/en/article/integrations-overview-r3pvl9/", date: "2026" },
    { title: "Supersend: Domain Setup and DNS Checklist", url: "https://help.supersend.io/en/article/domain-setup-and-dns-checklist-1ivzp11/", date: "2026" },
    { title: "Google Workspace SMTP Settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "infrabox-brandjet-integration",
    "email-warmup-guide",
    "infrabox-pricing",
  ],
};
