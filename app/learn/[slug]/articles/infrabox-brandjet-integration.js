export const article = {
  slug: "infrabox-brandjet-integration",
  title: "Connect Infrabox to BrandJet (2026)",
  metaDescription: "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to BrandJet using its API-key-only validation flow and AI Unibox sentiment analysis.",
  headline: "Connect Infrabox Mailboxes to BrandJet in 90 Seconds",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "7 min read",
  tags: ["BrandJet integration", "AI Unibox", "brand intelligence", "email setup", "API key", "sentiment analysis"],
  excerpt: "BrandJet is one of only two sequencers in Infrabox that skips email + password entirely and uses an API-key-only validation flow. Here is the exact connect sequence, plus how the AI Unibox routes your replies.",
  type: "how-to",
  screenshots: [
    { src: "/images/dashboard/sequencers.png", alt: "Infrabox Sequencers page with BrandJet connected", caption: "Infrabox Sequencers page, BrandJet uses an API-key-only flow, unlike most outreach platforms in the catalog." },
    { src: "/images/dashboard/exports.png", alt: "Infrabox exports tracking a BrandJet push", caption: "Infrabox Exports page showing a successful BrandJet connection with account details returned on validation." },
  ],
  sections: [
    {
      heading: "The Fast Path: One API Key, No Passwords",
      content: "BrandJet is one of only two sequencers in the entire Infrabox catalog that uses API-key-only authentication, the other is [Supersend](/learn/infrabox-supersend-integration). Everything else uses email + password. That matters because the connect screen for BrandJet looks different: a single API Key field, no email, no password, and a debounced validation that calls BrandJet's verify endpoint after 800 milliseconds of typing idle.\n\nYou paste the key, Infrabox validates it, and a green badge appears showing your BrandJet account name and email. Click Connect Account and every selected Infrabox mailbox flows into BrandJet as a new sender. Total time: about 90 seconds. This is the integration to pick if you are running brand-intelligence outreach and want AI Unibox sentiment tracking on every reply.",
    },
    {
      heading: "How BrandJet's API-Key Validation Works",
      content: "When you paste a BrandJet API key into the Infrabox Connect screen, the flow is:\n\n| Phase | What happens | Time |\n|---|---|---|\n| 1 | User pastes the API key into the single API Key field | 0s |\n| 2 | Infrabox waits 800ms for keystroke idle (debounce) | 0.8s |\n| 3 | Infrabox POSTs `{platform: 'brandjet', api_key}` to its own verify endpoint |, |\n| 4 | Verify endpoint calls BrandJet's API to confirm the key and fetch account info | 100-500ms |\n| 5 | On success, Infrabox shows a green card with `brandjetAccountInfo`: account name, email | 1-2s |\n| 6 | On failure, a toast appears: 'Invalid API Key' | 1-2s |\n| 7 | The Connect Account button stays disabled until the key is validated |, |\n\nThe reason for the debounce is UX: pasting a long key character-by-character would trigger dozens of validation calls without it. The 800ms wait means BrandJet's API gets exactly one verify call per paste operation, even if you type the key instead of pasting it.\n\n**What the green card shows you.** After a successful validation, the connect screen renders `Connected as {account.email}` plus a small card with the account's full name and email address. This is your confirmation that you are about to push mailboxes into the correct BrandJet account. If the name on the card does not match who you think you are connecting to, stop and check, you may have pasted a key for a different BrandJet account.",
    },
    {
      heading: "Prerequisites Before You Connect",
      content: "Gather these items before opening the Infrabox Sequencers Connect screen:\n\n| Item | Where | Required |\n|---|---|---|\n| BrandJet account | brandjet.ai | Yes |\n| BrandJet API key | BrandJet → Settings → API Keys → **Generate new key** | Yes |\n| At least one Infrabox mailbox | Infrabox → Mailboxes | Yes |\n| Domain DNS (SPF, DKIM, DMARC, MX) live | Infrabox auto-configures via Cloudflare in under 60 seconds | Yes |\n| Sentiment tracking enabled on your BrandJet plan | BrandJet → Plan features | No: degrades to basic Unibox if disabled |\n\n**On finding the BrandJet API key.** API keys live in Settings → API Keys inside BrandJet. Generate a new key rather than reusing one you already shared with another tool, that way revoking it later doesn't break other integrations. Keys are long (usually 40+ characters) and prefixed with something like `bj_` so you can tell them apart from other sequencer keys. For a comparative look at how email tools authenticate, see [email sequencer integration guide](/learn/email-sequencer-integration-guide).",
    },
    {
      heading: "Step-by-Step: Connect BrandJet",
      content: "The full click path from Infrabox dashboard:\n\n| Step | Action | Time |\n|---|---|---|\n| 1 | Infrabox → **Sequencers** → **Connect New Sequencer** | 5 sec |\n| 2 | Filter by **Outreach** and pick **BrandJet** | 5 sec |\n| 3 | Paste the BrandJet API key into the single **API Key** field | 5 sec |\n| 4 | Wait for the debounced validation (800ms): green badge appears with `Connected as {email}` | 1-2 sec |\n| 5 | Review the account card: confirm name and email match the BrandJet account you expect | 5 sec |\n| 6 | Click **Connect Account** |, |\n| 7 | Infrabox pushes every selected Infrabox mailbox into BrandJet as a new sender | 20-40 sec |\n| 8 | Redirect to `/sequencers` with success toast |, |\n\n**Total: about 90 seconds.**\n\nNote that the Connect Account button stays disabled until the API key is validated, you cannot bypass the check. If you see the button disabled and the green card not showing, the validation is still pending or the key is invalid. Wait 2 seconds, then check for the red 'Invalid API Key' badge.",
    },
    {
      heading: "AI Unibox: What BrandJet Does With Your Replies",
      content: "AI Unibox is BrandJet's differentiator. Every reply to a mailbox connected via the Infrabox integration lands inside Unibox, and BrandJet classifies each reply automatically:\n\n| Classification | What it means | Typical reply |\n|---|---|---|\n| Positive | Interested, asks for a meeting | 'Sure, Tuesday at 2pm works' |\n| Neutral | Acknowledges, no commitment yet | 'Send me more info' |\n| Objection | Disputes pricing, timing, fit | 'We just signed a 12-month contract with X' |\n| Out-of-office | Auto-reply | 'I'm out until Friday' |\n| Unsubscribe | Opt-out request | 'Please remove me' |\n| Bounce | SMTP failure | Postmaster auto-reply |\n\nBrandJet's AI triages these so you can focus on the positives and objections, not the out-of-offices. This is similar to what [ReachInbox's Onebox](/learn/infrabox-reachinbox-integration) does for AI classification, but BrandJet layers in brand-sentiment on top, it tracks whether the brand-mention sentiment across all your outreach is trending positive or negative over time. For high-volume outreach where you cannot hand-read every reply, this is the main reason to pick BrandJet over a standard unified-inbox tool.\n\n**How it works with Infrabox.** Infrabox does not touch the reply classification, that is 100% on the BrandJet side. Infrabox's job ends when the mailbox is successfully provisioned in BrandJet. From there, BrandJet pulls replies via IMAP (standard flow) and runs them through its classifier.",
    },
    {
      heading: "Daily Sending Limits and Warmup",
      content: "Set these inside BrandJet once the import completes:\n\n| Mailbox age | Daily send | BrandJet daily_limit | Notes |\n|---|---|---|---|\n| Day 1-14 | 0 | 0 | Warmup only: pause the sender in BrandJet |\n| Day 15-30 | 15-20 | 15 | Early sends |\n| Day 31-60 | 25-40 | 30 | Full ramp |\n| Day 60+ | 40-50 | 40 | Steady state |\n\nBrandJet does not ship a first-party warmup product, so pair it with either the [Infrabox isolated warmup add-on](/learn/email-warmup-guide) ($3/mailbox/month) or a dedicated warmup tool like [TrulyInbox](/learn/infrabox-trulyinbox-integration) or [Warmy](/learn/infrabox-warmy-integration). Pick one: running two warmup engines on the same mailbox generates inconsistent signals at Gmail Postmaster. For a side-by-side of the major warmup options, see the [email warmup tools comparison](/learn/email-warmup-tools-comparison-2026).",
    },
    {
      heading: "Errors and How to Fix Them",
      content: "The specific error badges Infrabox will surface during a BrandJet connect, and what to do:\n\n| Error | Cause | Fix |\n|---|---|---|\n| 'Invalid API Key' (red badge) | Typo in the pasted key, or key was revoked | Regenerate key in BrandJet → Settings → API Keys and paste the new value |\n| 'Enter your API key to validate' stays indefinitely | Key field is empty or whitespace only | Paste the key again, watch for the debounce to fire (~1s) |\n| 'Validating API Key...' never resolves | Network issue between Infrabox and BrandJet | Check internet connection; retry in 30 seconds |\n| Connect Account button stays disabled after green badge | Should not happen: indicates a UI state mismatch | Refresh the page and re-paste the key |\n| Mailboxes export but BrandJet shows zero new senders | BrandJet plan hit sender cap | Upgrade BrandJet plan or delete unused senders |\n\n**On API key rotation.** BrandJet API keys do not expire automatically, but you should rotate them every 6 months as security hygiene. When you rotate, the existing Infrabox connection will keep syncing until the next export attempt, then fail with 'Invalid API Key'. Fix: edit the connection in Infrabox → Sequencers → BrandJet → paste the new key. The existing mailboxes inside BrandJet are not affected.",
    },
    {
      heading: "Verifying the Connection Works",
      content: "Four smoke tests:\n\n**Test 1: account card matches expectations.** Before clicking Connect Account, confirm the BrandJet account name and email on the green card match who you think you're connecting to. If they don't match, stop.\n\n**Test 2: mailbox appears in BrandJet.** After the connect completes, log into BrandJet and open Senders. Confirm every Infrabox mailbox you selected is listed. If one is missing, the export hit BrandJet's per-call rate limit: retry that mailbox alone from Infrabox → Exports → Retry.\n\n**Test 3: send test.** From BrandJet, send a test email to your own address. Confirm delivery in <30 seconds with DKIM passing in headers.\n\n**Test 4: reply triage.** Reply to the test with 'yes I'm interested'. Within 2 minutes, BrandJet's AI Unibox should classify it as 'Positive'. If the classification is missing, the sentiment feature may be gated behind your BrandJet plan tier. Check BrandJet → Plan Features.",
    },
  ],
  faqs: [
    { question: "Can I use one BrandJet API key across multiple Infrabox workspaces?", answer: "Yes, as long as all those workspaces should push mailboxes into the same BrandJet account. If you have multiple BrandJet accounts (e.g. one per client), generate a separate API key per account and paste each into its matching Infrabox connection. Keys are account-scoped, not workspace-scoped." },
    { question: "Does BrandJet's sentiment analysis cost extra on top of the API plan?", answer: "Depends on the BrandJet plan tier. Basic plans get binary classification (positive/negative). Higher tiers get the full multi-class Unibox (positive / neutral / objection / OOO / unsub / bounce). Check BrandJet → Plan Features to confirm your tier includes the full classification. If not, replies still flow into Unibox, they just appear as 'Unclassified' until you manually tag." },
    { question: "What happens to the BrandJet connection if I delete the API key in BrandJet?", answer: "The next time Infrabox tries to sync a new mailbox, validation will fail with 'Invalid API Key' and the Infrabox Sequencers page flags the connection as needing attention. Existing mailboxes already pushed to BrandJet continue to function because BrandJet handles sending via stored SMTP credentials, not the API key. But you lose the ability to add new mailboxes until you rotate the key." },
    { question: "Does BrandJet pull Infrabox mailbox metadata automatically (tags, categories)?", answer: "Yes. Any tags you set on the Infrabox side are included in the export payload and arrive at BrandJet as sender-level metadata. You can filter BrandJet campaigns by Infrabox tag, which is handy for agencies running multiple client pools from a single BrandJet account." },
    { question: "Is BrandJet a good fit if I only send 100 emails per day?", answer: "BrandJet's big wedge is AI Unibox sentiment analysis at scale, the more replies you process, the more value the classifier adds. At 100 emails/day you might only see 5-10 replies, which you can easily hand-triage. BrandJet is typically more cost-effective above 500 emails/day. For smaller volume, [Instantly](/learn/infrabox-instantly-integration) or [Lemlist](/learn/infrabox-lemlist-integration) may be a simpler fit." },
  ],
  sources: [
    { title: "BrandJet Documentation", url: "https://docs.brandjet.ai", date: "2026" },
    { title: "Google Workspace: Enable IMAP Access", url: "https://support.google.com/a/answer/105694", date: "2026" },
    { title: "Google Workspace SMTP settings", url: "https://support.google.com/a/answer/176600", date: "2026" },
    { title: "Microsoft 365 Authenticated SMTP", url: "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission", date: "2026" },
  ],
  relatedSlugs: [
    "infrabox-review",
    "email-sequencer-integration-guide",
    "infrabox-instantly-integration",
    "email-warmup-tools-comparison-2026",
    "email-infrastructure-setup-guide",
  ],
};
