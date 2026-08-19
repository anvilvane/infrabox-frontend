export const article = {
  slug: "microsoft-365-email-spam-fix",
  title: "Microsoft 365 Email Spam Fix Guide (2026)",
  headline: "Microsoft 365 Email Spam Fix Guide (2026)",
  metaDescription:
    "Emails landing in Microsoft 365 Junk or Outlook Quarantine? Here's how to decode EOP headers, fix SCL and BCL scores, and recover sender reputation.",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "11 min read",
  tags: [
    "microsoft 365 spam",
    "outlook junk",
    "exchange online protection",
    "scl score",
    "email deliverability",
  ],
  excerpt:
    "Microsoft 365 runs its own filter stack. Exchange Online Protection, with different rules than Gmail. Here's how to read the headers, decode the scores, and fix emails landing in Junk or Quarantine.",
  screenshots: [
    {
      src: "/images/dashboard/email-insights.png",
      alt: "Infrabox email insights showing Microsoft 365 inbox placement per mailbox",
      caption: "Infrabox Email Insights tracks per-provider inbox placement so you can tell whether it's Microsoft 365, Gmail, or both that are routing your email to Junk.",
    },
  ],
  type: "how-to",
  sections: [
    {
      heading: "Why Emails Land in Microsoft 365 Junk",
      content:
        "Microsoft 365 runs every inbound message through **Exchange Online Protection (EOP)**: Microsoft's anti-spam and anti-malware filter. EOP uses a different scoring model than Gmail's classifier:\n\n1. **SPF, DKIM, and DMARC authentication** (table-stakes; failures route to Junk or Quarantine instantly).\n2. **SCL (Spam Confidence Level)**, a 0-9 score where 0-1 is inbox, 5-6 is Junk, 7-9 is Quarantine.\n3. **BCL (Bulk Complaint Level)**, a 0-9 score specifically for bulk senders; 4+ triggers filtering.\n4. **Sender reputation** via SNDS (Smart Network Data Services) and Microsoft's internal IP/domain history.\n5. **Tenant-level policies**: many enterprise M365 tenants have custom anti-spam rules from the tenant admin that override defaults.\n\n**The consistent mistake emailers make:** applying Gmail deliverability advice to Microsoft 365 and expecting the same result. Microsoft is **stricter on authentication alignment** (SPF matters more than with Gmail), **more tolerant of volume** (fewer rate-limit bounces), and **more opaque about filter decisions** (no public Postmaster-style dashboard). Different fix strategy.\n\nThis guide covers the Microsoft-specific diagnostic path: reading EOP headers, decoding SCL/BCL, and the fixes that move email out of Junk and into the Focused Inbox.",
    },
    {
      heading: "Step 1: Read the EOP Headers",
      content:
        "Send a test to a real Microsoft 365 mailbox. In Outlook (desktop or web), open the message > File > Properties (desktop) or the three dots > View message source (web). The critical headers:\n\n```\nX-Forefront-Antispam-Report: CIP:203.0.113.5;CTRY:US;LANG:en;SCL:5;SRV:;IPV:NLI;SFV:SPM;H:mail.yourdomain.com;PTR:mail.yourdomain.com;CAT:BULK;SFS:(4636009)(6029001)(7916004);DIR:INB;SFTY:;\nX-Microsoft-Antispam: BCL:7;\nAuthentication-Results: spf=pass smtp.mailfrom=yourdomain.com; dkim=pass header.d=yourdomain.com; dmarc=pass action=none header.from=yourdomain.com;\n```\n\nThe important fields and how to read them:\n\n| Field | Meaning | Good Values | Bad Values |\n|-------|---------|-------------|------------|\n| **SCL** | Spam Confidence Level (0-9) | 0, 1 (inbox) | 5-6 (Junk), 7-9 (Quarantine) |\n| **BCL** | Bulk Complaint Level (0-9) | 0-3 | 4-9 (bulk sender, filtered) |\n| **SFV** | Spam Filter Verdict | `SKN` (safe), `NSPM` (not spam) | `SPM` (spam), `SKA` (sender allowed, someone else's list), `BLK` (blocked) |\n| **CAT** | Category | None | `BULK`, `SPM`, `PHSH`, `HSPM` (high-confidence spam) |\n| **CIP** | Connecting IP | Your actual sending IP | Shared-pool IP |\n| **PTR** | Reverse DNS | Resolves to your domain | Missing or mismatched |\n| **Authentication-Results** | SPF/DKIM/DMARC | All three `pass` | Any `fail` |\n\n**The diagnostic formula:** if SCL is 5-6 but authentication is all pass, the problem is **content or BCL**. If authentication has any fail, fix that first. If BCL is 4+, your domain is being classified as a bulk sender and needs the fixes in Step 3.",
    },
    {
      heading: "Step 2: Fix Authentication Alignment (Microsoft Is Stricter)",
      content:
        "Microsoft 365 enforces SPF/DKIM/DMARC alignment more aggressively than Gmail for cold senders. Alignment fails here route mail directly to Junk or Quarantine, not just a reputation downgrade.\n\n**Microsoft-specific authentication rules:**\n\n| Requirement | Microsoft Behavior | Fix |\n|-------------|-------------------|-----|\n| **SPF must pass and align** | `spf=pass smtp.mailfrom=yourdomain.com`. Envelope sender must resolve to your domain. | For real Google Workspace → M365 recipients, this is automatic. For relay ESPs (Sendgrid), set up a custom bounce domain. |\n| **DKIM must pass and align** | `dkim=pass header.d=yourdomain.com`. Signing domain must match From:. | Set up custom DKIM on your sequencer/ESP; verify with [dmarc-failed-gmail-fix](/learn/dmarc-failed-gmail-fix) step 1. |\n| **DMARC must pass or be null** | `dmarc=pass` or no DMARC record | Minimum p=none record; move to p=quarantine after 14 days |\n| **PTR (reverse DNS)** must resolve back | `PTR:mail.yourdomain.com` | Real Google Workspace / M365 handle this automatically. Self-hosted needs explicit reverse DNS setup. |\n| **No IP in Spamhaus SBL or Barracuda** | EOP consults both | See [domain-blacklisted-diagnosis-guide](/learn/domain-blacklisted-diagnosis-guide) |\n\n**The single most common cause of M365 spam routing for email:** SPF alignment failure when using a sequencer that relays through a transactional ESP. Microsoft reads the envelope sender (`mailfrom=`) and if it's `bounces@sendgrid.net` while the visible From: is `you@yourdomain.com`, SPF is technically pass but alignment is fail. Microsoft routes to Junk.\n\n**The fix:** either send directly from a real Microsoft 365 mailbox (no relay) or configure your ESP to use a custom bounce subdomain on your own domain. Reference record syntax in [spf-record-setup-email](/learn/spf-record-setup-email).",
    },
    {
      heading: "Step 3: Lower Your Bulk Complaint Level (BCL)",
      content:
        "BCL is Microsoft's \"how much does this look like a bulk newsletter\" score. It ranges 0-9. Anything 4+ routes the message into Junk even with clean authentication.\n\n**What raises BCL:**\n\n| Signal | BCL Impact | Fix |\n|--------|-----------|-----|\n| List-Unsubscribe header | High | Remove for low-volume cold (< 5000/day); required at higher volumes |\n| Tracking pixel (1x1 image) | High | Disable open tracking in your sequencer |\n| Multiple CTAs or links in body | Medium | 1 link maximum in email first-touch |\n| Inline images or banner | High | Plain text or minimal HTML only |\n| Long body (>200 words) | Medium | Keep under 120 words |\n| Identical body across recipients | High | Personalize with first name + company minimum |\n| Subject with emoji or ALL CAPS | Medium | Sentence case, no emoji |\n| Marketing-style signature (logo, address block) | Medium | Text-only signature, minimal |\n\n**Check BCL in the headers.** A message with BCL:0 and clean authentication lands in the Focused Inbox. A message with BCL:4 lands in Junk. Most emailers never check this. They just assume Outlook is \"being weird\" when actually BCL is the direct signal they need to address.\n\n**The three-sentence email format** reliably produces BCL:0 because it mechanically has no bulk markers: no pixel, no tables, no images, 1 link, under 80 words, personalized. Template reference in [email-ab-testing-guide](/learn/email-ab-testing-guide).",
    },
    {
      heading: "Step 4: Throttle for Microsoft's Rate Limits",
      content:
        "Microsoft 365's rate limits are different from Gmail's. Microsoft is more tolerant of per-mailbox volume but stricter on per-minute bursts and per-IP accumulation.\n\n**Microsoft 365 rate limits (observed in 2026):**\n\n| Scope | Limit | Exceeding It |\n|-------|-------|-------------|\n| Per-mailbox per day (cold sends) | ~40-50 safe | 4.7.500 \"Server busy\" or BCL spike |\n| Per-minute per mailbox | ~5-10 sends | Throttling for 5-15 min |\n| Per-IP per hour to one tenant | ~100 sends | 4.4.5 rate limit |\n| Per-IP per day (shared outbound pool) | ~2000 | Tempfail 421 4.7.500 for the day |\n\n**Configuring your sequencer for Microsoft 365:**\n\n1. **Daily volume cap:** 40 cold sends per Microsoft 365 mailbox. Go higher and SCL/BCL start drifting up.\n2. **Send interval:** 60-120 seconds between sends. Not because Microsoft demands it but because staggered sends generate cleaner engagement patterns.\n3. **Stagger mailbox start times.** If you have 5 M365 mailboxes in rotation, don't have them all fire at 9:00. Start each 5-10 minutes apart.\n4. **Separate tenants:** if running at scale, consider Azure multi-tenant setups where each tenant is isolated. Infrabox offers Azure tenants at **$30/tenant for 100 mailboxes**.\n\n**Important:** Microsoft's rate limits apply per-tenant, so a single Azure tenant with 100 mailboxes × 40/day = 4000 sends/day without hitting tenant-level throttling. This is the per-tenant capacity advantage of Azure over single-mailbox M365.",
    },
    {
      heading: "Step 5: Monitor via SNDS and ListUnsubscribe",
      content:
        "Microsoft doesn't publish a Postmaster Tools equivalent. Instead, the diagnostic signals live in three places:\n\n| Source | What It Shows | Availability |\n|--------|---------------|-------------|\n| **SNDS (Smart Network Data Services)** | IP-level data for dedicated IPs: volume, complaint rate, trap hits | https://sendersupport.olc.protection.outlook.com/snds/, request access |\n| **JMRP (Junk Mail Reporting Program)** | Feedback loop. Microsoft emails you when a recipient marks your mail as spam | Request enrollment per sending IP |\n| **DMARC aggregate reports** | Per-receiver authentication results; Microsoft 365 sends these if you set rua= | Automatic if DMARC record has rua= |\n\n**SNDS is the closest thing to Microsoft Postmaster Tools.** Once your IP is enrolled, you get daily data on:\n\n- Complaint rate (% of recipients marking as spam)\n- Trap hit count (sending to Microsoft-operated honeypots)\n- Filter results (% of your sends that got spam-filtered)\n- Sample message headers (redacted)\n\n**For email on real Microsoft 365 mailboxes, SNDS is usually blank** because the sending IP belongs to Microsoft. You don't control it. SNDS is most useful for **self-hosted or dedicated-IP setups**. If you're running email through real M365, rely on:\n\n1. Direct seed testing across 10+ M365 recipient mailboxes.\n2. DMARC aggregate reports parsed by dmarcian or Postmark DMARC.\n3. Per-mailbox reply rate as a lagging indicator. If it drops, Junk routing is likely.\n\nFull monitoring setup in [email-deliverability-monitoring-setup](/learn/email-deliverability-monitoring-setup).",
    },
    {
      heading: "Step 6: Get Out of Focused vs Other Routing",
      content:
        "Outlook's Focused Inbox is Microsoft's equivalent of Gmail's Primary tab. Messages routed to \"Other\" are technically in the inbox, not spam, but recipients rarely check \"Other.\" Reply rate on emails in Other is 30-50% lower than in Focused.\n\n**Focused vs Other is not controlled by SCL/BCL.** It's a separate machine-learned classifier that runs after EOP and looks at per-recipient engagement signals:\n\n| Signal | Boosts Focused Routing | Boosts Other Routing |\n|--------|------------------------|---------------------|\n| Prior reply from recipient | Strong boost to Focused | — |\n| Recipient added sender to contacts | Strong boost to Focused | — |\n| 1:1 email shape (no CC, no list headers) | Medium boost | — |\n| Bulk-sender headers (List-Unsubscribe) | — | Medium boost to Other |\n| Newsletter-style HTML | — | Medium boost to Other |\n| Generic salutation (\"Dear customer\") | — | Light boost to Other |\n| Personalized subject | Light boost to Focused | — |\n\n**Fixes that move email from Other to Focused:**\n\n1. **Ask the recipient to move you to Focused.** Works per-recipient, classifier learns. Direct phrasing: \"If this lands in Other, moving it to Focused makes sure you see my reply.\"\n2. **Reply to every reply fast.** Thread activity is the strongest Focused signal.\n3. **Send from a real M365 mailbox**, not a relay. Microsoft trusts its own outbound more.\n4. **Keep body under 120 words and single-CTA.** Matches 1:1 email shape.\n\nThis is similar but not identical to Gmail Promotions routing, see [emails-landing-in-promotions-tab](/learn/emails-landing-in-promotions-tab) for the Gmail equivalent.",
    },
    {
      heading: "How Infrabox Fixes Microsoft 365 Deliverability at the Root",
      content:
        "Infrabox runs real Microsoft 365 mailboxes (not forwarded SMTP relays), which eliminates most M365-specific spam causes:\n\n| M365 Spam Cause | Infrabox Control |\n|-----------------|------------------|\n| SPF envelope sender mismatch | Real M365 mailboxes send directly, envelope sender is always your domain. Automatic alignment. |\n| DKIM signing domain mismatch | Microsoft's default DKIM signs with your domain when you set up custom DKIM CNAMEs. Infrabox automates this in <60s. |\n| Shared IP contamination | Sends go through Microsoft-owned outbound infrastructure. Your neighbor's bad activity doesn't affect you. |\n| PTR record missing | Microsoft handles reverse DNS for your tenant automatically. |\n| Unaligned DMARC | Cloudflare-automated DMARC record setup in <60s per domain. |\n| Volume ramp too fast | Built-in daily volume caps per mailbox; ramps automatically over warmup period. |\n| Drift over time | InfraGuard checks SPF/DKIM/DMARC every 6h; alerts on drift. |\n\n**Pricing:**\n- **Professional**: $39/mo, 10 slots, $3.50 per extra slot. Good for <100 mailbox setups.\n- **Agency**: $99/mo, 30 slots, $3.25 per extra slot. Sweet spot for agencies.\n- **Enterprise**: $299/mo, 100 slots, $2.99 per extra slot.\n- **Azure tenants**: $30/tenant for up to 100 M365 mailboxes. Lowest per-mailbox cost for high-volume Microsoft setups.\n\nFull pricing breakdown in [infrabox-pricing](/learn/infrabox-pricing). See [google-workspace-vs-microsoft-365-email](/learn/google-workspace-vs-microsoft-365-email) for the provider comparison if you're deciding between Google and Microsoft for email.",
    },
  ],
  faqs: [
    {
      question: "What's the difference between SCL and BCL in Microsoft 365 headers?",
      answer:
        "SCL (Spam Confidence Level, 0-9) is the general spam score, higher means more likely spam. BCL (Bulk Complaint Level, 0-9) specifically measures whether the message looks like a bulk newsletter. Emails typically want SCL:0-1 and BCL:0-3. Either score crossing its threshold routes to Junk.",
    },
    {
      question: "Does Microsoft 365 have something like Google Postmaster Tools?",
      answer:
        "Partially. SNDS (Smart Network Data Services) gives IP-level data but requires you to control the sending IP, which most emailers on real M365 mailboxes don't. For email, seed testing + DMARC aggregate reports are the practical diagnostic tools.",
    },
    {
      question: "Why does Microsoft 365 route my email to Junk even though Gmail puts it in Primary?",
      answer:
        "Microsoft is stricter on SPF alignment than Gmail, and Microsoft's BCL scoring punishes bulk-sender markers more aggressively. A message that passes Gmail's classifier can still hit BCL:4+ on Microsoft and route to Junk. Fix: remove List-Unsubscribe for low-volume sends, disable open tracking, and shorten the body.",
    },
    {
      question: "Is a custom bounce domain required for email through M365?",
      answer:
        "Not if you send directly from a real Microsoft 365 mailbox, the envelope sender is already your domain. Custom bounce domains are only needed when you're relaying through a transactional ESP (Sendgrid, Mailgun) that wants to capture bounces on their own domain.",
    },
    {
      question: "Can I use Azure instead of paying per-mailbox on M365?",
      answer:
        "Yes. Azure tenants let you provision up to 100 M365 mailboxes under one tenant subscription. Infrabox offers Azure tenants at $30/tenant for up to 100 mailboxes, typically the lowest per-mailbox cost for high-volume Microsoft email setups.",
    },
  ],
  sources: [
    {
      title: "Microsoft 365 - Anti-spam message headers",
      url: "https://learn.microsoft.com/en-us/defender-office-365/message-headers-eop-mdo",
      date: "2026",
    },
    {
      title: "Microsoft 365 - Exchange Online Protection overview",
      url: "https://learn.microsoft.com/en-us/defender-office-365/eop-about",
      date: "2026",
    },
    {
      title: "Microsoft SNDS (Smart Network Data Services)",
      url: "https://sendersupport.olc.protection.outlook.com/snds/",
      date: "2026",
    },
    {
      title: "Microsoft 365 - Bulk Complaint Level (BCL)",
      url: "https://learn.microsoft.com/en-us/defender-office-365/anti-spam-bulk-complaint-level-bcl-about",
      date: "2026",
    },
    {
      title: "Infrabox Microsoft 365 Documentation",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
  ],
  relatedSlugs: [
    "google-workspace-vs-microsoft-365-email",
    "dmarc-failed-gmail-fix",
    "spf-record-setup-email",
    "emails-landing-in-promotions-tab",
    "emails-going-to-spam-gmail-fix",
  ],
};
