export const article = {
  slug: "spf-softfail-fix",
  title: "SPF Softfail Fix Guide (2026)",
  headline: "SPF Softfail Fix Guide (2026)",
  metaDescription:
    "SPF showing 'softfail' in Gmail or headers? Here's what softfail actually means, why it's hurting DMARC alignment, and the exact DNS fix.",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "9 min read",
  tags: [
    "spf softfail",
    "spf record fix",
    "dns troubleshooting",
    "dmarc alignment",
    "email authentication",
  ],
  excerpt:
    "SPF softfail means your sending IP isn't authorized in your SPF record and the `~all` mechanism told receivers to accept-but-mark. It breaks DMARC alignment and drives spam routing. Here's how to fix it.",
  screenshots: [
    {
      src: "/images/dashboard/domains.png",
      alt: "Infrabox domain management showing SPF status per domain",
      caption: "Infrabox domain management surfaces SPF resolution status per domain so softfails get caught before they propagate into DMARC alignment failures.",
    },
  ],
  type: "how-to",
  sections: [
    {
      heading: "What SPF Softfail Actually Means",
      content:
        "SPF softfail is the result when a receiving server evaluates your SPF record, finds that the sending IP is **not in the authorized list**, and the SPF record ends with `~all` (the soft-fail mechanism). The receiving server then reports:\n\n```\nspf=softfail (google.com: domain of you@yourdomain.com does not designate 203.0.113.5 as permitted sender)\n```\n\n**Softfail is not a pass.** It's a \"probably unauthorized, accept anyway but mark the message suspicious.\" Three consequences:\n\n1. **DMARC sees softfail as fail for alignment purposes.** Your DMARC record either passes via DKIM alone or fails entirely. If DKIM is also broken or unaligned, DMARC fails, and Gmail / Microsoft route the message to spam.\n2. **Gmail penalizes softfail-only senders** in reputation scoring, even when DMARC is satisfied via DKIM.\n3. **Some corporate filters treat softfail as hardfail.** Exchange, Barracuda, and Proofpoint instances may reject softfail messages outright depending on tenant policy.\n\n**The fix is mechanical:** figure out which sending IP or domain is missing from your SPF record and add it. The rest of this guide walks through the diagnostic and the five common causes. For the full SPF syntax reference, see [spf-record-setup-email](/learn/spf-record-setup-email).",
    },
    {
      heading: "Read the Softfail in Gmail Show Original",
      content:
        "Send a test from the affected mailbox to a personal Gmail account. Open > three dots > Show Original. Look for the Authentication-Results line:\n\n```\nspf=softfail (google.com: domain of user@yourdomain.com does not\n     designate 203.0.113.5 as permitted sender)\n     smtp.mailfrom=user@yourdomain.com\n```\n\nThe three pieces of information you need:\n\n| Field | Example | What It Tells You |\n|-------|---------|-------------------|\n| **The IP that failed** | `203.0.113.5` | This IP must be added to your SPF record (or its parent ESP's include) |\n| **smtp.mailfrom** | `user@yourdomain.com` | This is the envelope sender, the domain whose SPF record is being checked |\n| **Softfail vs fail vs neutral** | `softfail` | Softfail means `~all` at the end of your SPF record. Fail means `-all`. Neutral means `?all`. |\n\n**Then check your current SPF record:**\n\n```\ndig TXT yourdomain.com +short | grep spf1\n```\n\nOr use `https://mxtoolbox.com/spf.aspx` and enter your domain. Compare the IP from Show Original against the authorized senders in your SPF record. The missing IP is your fix target.\n\n**The exact text of the failure message contains the fix.** If it says \"does not designate 203.0.113.5\", add that IP. If it says \"does not designate mail.sequencer.com\", add the sequencer's SPF include mechanism. Read it carefully before making changes.",
    },
    {
      heading: "Softfail vs Hardfail vs Neutral: Which Is Correct for Email",
      content:
        "Your SPF record ends with one of four mechanisms. The choice matters more than most emailers realize:\n\n| Mechanism | Result for Unauthorized IPs | When to Use | Risk |\n|-----------|-----------------------------|-------------|------|\n| **`-all`** (hardfail) | Receiving server rejects the message outright | Mature setups with zero missing senders | **HIGH**. One typo or a forgotten sequencer rejects all your mail |\n| **`~all`** (softfail) | Accept-but-mark | **Recommended for email** | Low, misses catch your attention without blocking delivery |\n| **`?all`** (neutral) | No opinion, accept anyway | Never for production | High, no protection against spoofing |\n| **`+all`** (pass) | Authorize all IPs | **Never. This is a spoofer's dream** | Catastrophic |\n\n**For email, use `~all`.** Hardfail is theoretically more secure, but a single missing ESP include causes 100% delivery failure. Softfail gives you the signal (softfail messages you'll catch in monitoring) without the risk of total delivery collapse.\n\n**The right mental model:** SPF softfail is a symptom, not a problem. It's telling you \"your record isn't complete.\" The fix is **always** to add the missing sender to the record, not to change `~all` to `+all`. Changing to `+all` \"makes the error go away\" but also neuters SPF entirely.\n\n**Never change `~all` to `+all` to suppress softfails.** If you do, you'll stop seeing the softfail, but spoofers will also stop being blocked by SPF, and your domain becomes trivially impersonable.",
    },
    {
      heading: "Fix 1: Add the Missing Sender to Your SPF Record",
      content:
        "The most common softfail cause: you added a new sending source (sequencer, ESP, monitoring tool) without adding its SPF include to your record.\n\n**The common SPF includes by sender type:**\n\n| Sender | Add to SPF |\n|--------|-----------|\n| Google Workspace | `include:_spf.google.com` |\n| Microsoft 365 | `include:spf.protection.outlook.com` |\n| Sendgrid | `include:sendgrid.net` |\n| Mailgun | `include:mailgun.org` |\n| Postmark | `include:spf.mtasv.net` |\n| Instantly | `include:sendgrid.net` (uses Sendgrid under the hood) |\n| SmartLead | `include:_spf.smartlead.ai` |\n| Lemlist | `include:_spf.lemlist.com` |\n| Apollo | `include:_spf.apolloapi.io` |\n| Woodpecker | `include:wdpkr.com` |\n| Zoho Mail | `include:zoho.com` |\n| Amazon SES (us-east-1) | `include:amazonses.com` |\n\n**Combined SPF record example for Google Workspace + SmartLead:**\n\n```\nv=spf1 include:_spf.google.com include:_spf.smartlead.ai ~all\n```\n\n**Rules when editing:**\n\n1. **Only one SPF record per domain.** If you already have a TXT record starting with `v=spf1`, edit it, do not create a second one. Two records is an automatic SPF fail.\n2. **Start with `v=spf1`.** No other prefix is valid.\n3. **End with `~all`.** Only one `all` mechanism, and it must be last.\n4. **Wait for DNS propagation.** Changes take 15 minutes to 4 hours depending on your TTL. Re-test with Show Original after propagation.\n\n**Then re-send a test to Gmail and check Show Original again.** SPF should now show `pass` instead of `softfail`. If it still shows softfail, move to Fix 2.",
    },
    {
      heading: "Fix 2: Check for the 10 DNS Lookup Limit",
      content:
        "SPF records have a hard limit: **no more than 10 DNS lookups during SPF evaluation**. Each `include:` mechanism counts as 1 lookup and may trigger additional nested lookups inside the included record. Exceed 10 and the SPF evaluation returns `permerror`, which some receivers treat as softfail, and others treat as hardfail.\n\n**Common include lookup counts:**\n\n| Include | Lookups |\n|---------|---------|\n| `include:_spf.google.com` | 3-4 |\n| `include:spf.protection.outlook.com` | 2-3 |\n| `include:sendgrid.net` | 1-2 |\n| `include:_spf.smartlead.ai` | 1 |\n| `include:mailgun.org` | 2 |\n| `include:amazonses.com` | 1 |\n\n**Example that exceeds the limit:**\n\n```\nv=spf1 include:_spf.google.com include:spf.protection.outlook.com\n  include:sendgrid.net include:mailgun.org include:amazonses.com\n  include:_spf.smartlead.ai include:_spf.apolloapi.io ~all\n```\n\nTotal: 3+3+2+2+1+1+1 = **13 lookups**. SPF evaluation fails with permerror, and every recipient may see softfail.\n\n**The fix when you're near or over the limit:**\n\n1. **Remove unused includes.** Audit which sending sources you actually use. Drop anything dormant.\n2. **Use ip4: directly** for static IPs that don't change. `ip4:` counts as **zero** lookups. If your sequencer has a documented static IP range, listing those IPs directly saves lookups.\n3. **Flatten includes with a tool.** Services like `spf.transip.eu` or `dmarcly.com/tools/spf-flattener` expand includes into literal IPs so you stay under 10 lookups. Warning: flattened records require regular updates because IP lists change.\n4. **Split sending across subdomains.** Each subdomain has its own SPF record with its own 10-lookup budget. Move your transactional sends to `mail.yourdomain.com` and keep your email on `yourdomain.com`.\n\n**Verify with MXToolbox SPF record lookup:** https://mxtoolbox.com/spf.aspx. The tool reports the lookup count explicitly. Target is <10, ideally <8 to leave headroom.",
    },
    {
      heading: "Fix 3: Resolve Multiple SPF Records",
      content:
        "A second softfail cause: **you have more than one TXT record starting with `v=spf1`**. RFC 7208 section 4.5 is explicit. One SPF record per domain. Multiple records return a permerror, which receivers treat as softfail or fail.\n\n**How to check:**\n\n```\ndig TXT yourdomain.com +short\n```\n\nLook for **every line starting with `v=spf1`**. If you see two or more, that's your problem.\n\n**Common causes of duplicate SPF records:**\n\n1. **You added a new record instead of editing the existing one.** When Sendgrid or your sequencer gave you an SPF record to add, you created a second TXT record next to the existing one.\n2. **Your DNS provider merged two records during a bulk import.** Cloudflare, Route 53, and Namecheap sometimes store them as separate entries while they evaluate as multiple records.\n3. **Your registrar autocreated an SPF record when you set up a mailbox**, and you manually added another later.\n\n**The fix:**\n\n1. Delete all existing TXT records starting with `v=spf1`.\n2. Create a **single** new TXT record that includes all your authorized senders.\n3. Verify with `dig TXT yourdomain.com +short`, should return exactly one line starting with `v=spf1`.\n4. Wait 15-60 minutes for DNS propagation, then re-test with Gmail Show Original.\n\n**Cloudflare gotcha:** Cloudflare stores the SPF record with neighboring TXT records (DMARC, verification tokens) all under the same hostname. That's fine, as long as only **one** of them starts with `v=spf1`. If you see two TXT records on the same hostname and both start with `v=spf1`, that's the duplicate.",
    },
    {
      heading: "Fix 4: Handle Sequencer/Relay Softfails",
      content:
        "Sequencer softfails are a special case. Your sequencer (Instantly, Apollo, Smartlead, Lemlist) may send through its own ESP infrastructure by default. In that case, the **envelope sender** is the sequencer's domain, not yours, so your SPF record isn't even being consulted.\n\n**What this looks like in headers:**\n\n```\nspf=pass smtp.mailfrom=bounces@instantly-mail.net\nheader.from=you@yourdomain.com\n```\n\nSPF technically passes (on Instantly's domain), but **DMARC alignment fails** because the envelope sender domain (`instantly-mail.net`) doesn't match the visible From: (`yourdomain.com`). Receivers see this as functionally equivalent to softfail and may route to spam.\n\n**The fix, three options:**\n\n| Option | What It Does | Complexity |\n|--------|-------------|-----------|\n| **Send directly from a real mailbox** (Google Workspace, M365, Infrabox) | Envelope sender becomes your domain automatically. No relay chain. | Low, just change the sending account. |\n| **Set up a custom tracking/bounce domain** on your sequencer | Your sequencer stops using its own ESP envelope sender and uses a subdomain of yours instead. | Medium, usually a CNAME + TXT record in DNS. |\n| **Rely on DKIM alignment only** | If your sequencer signs with DKIM on your domain, DMARC passes via DKIM even if SPF alignment fails. | Low, but requires custom DKIM setup on the sequencer. |\n\n**For email, option 1 is usually cleanest.** Real Google Workspace or Microsoft 365 mailboxes (Infrabox at $2.50-3.50/mailbox/mo) remove the relay chain entirely. Option 2 is for setups that must use a relay ESP for volume reasons. Option 3 is a band-aid when you can't change the relay.\n\nFor the full DMARC alignment walkthrough, see [dmarc-failed-gmail-fix](/learn/dmarc-failed-gmail-fix) and [dkim-setup-email](/learn/dkim-setup-email).",
    },
    {
      heading: "Verify the Fix",
      content:
        "After any SPF change, verify the fix with this 4-step test:\n\n1. **Wait for DNS propagation.** Changes take 15 minutes to 4 hours. Check with `dig TXT yourdomain.com +short`, the new record should appear.\n2. **Lookup test with MXToolbox.** Run the full SPF check at https://mxtoolbox.com/spf.aspx. Look for:\n   - Single `v=spf1` record ✓\n   - Total lookups < 10 ✓\n   - All expected includes present ✓\n   - Ends with `~all` ✓\n3. **Send a test email to Gmail.** Use a personal Gmail, not your own Workspace account (bias). Open > Show Original. Check for:\n   - `spf=pass` (not softfail)\n   - `smtp.mailfrom=yourdomain.com` (aligned with From:)\n   - `dmarc=pass`\n4. **Check DMARC aggregate reports over 48 hours.** If you have `rua=mailto:...` in your DMARC record, the reports will show whether other receivers (Yahoo, Microsoft 365) also see the fix. Use dmarcian, Postmark DMARC, or parsedmarc to read them.\n\n**If the softfail persists after the fix**, the most likely cause is TTL. Your old SPF record is still cached at the receiving end. Wait 4-24 hours for the cache to expire, then re-test. DNS changes outlive the TTL in some recursive resolvers.\n\nFor continuous monitoring so softfails get caught before they damage reputation, see [email-deliverability-monitoring-setup](/learn/email-deliverability-monitoring-setup).",
    },
    {
      heading: "How Infrabox Prevents SPF Softfails",
      content:
        "Infrabox's approach to SPF is automation + continuous monitoring:\n\n| Feature | SPF Protection |\n|---------|---------------|\n| **Automated SPF record creation** | Cloudflare-automated DNS publishes the correct `v=spf1 include:_spf.google.com ~all` (or M365 equivalent) per domain in <60 seconds. No manual editing. |\n| **Lookup count awareness** | Built-in validation of SPF lookup count before publishing. Alerts if the record would exceed 8 lookups. |\n| **Direct-send architecture** | Real Google Workspace / Microsoft 365 mailboxes send directly, not via a relay. Envelope sender is always your domain, no alignment gap. |\n| **InfraGuard continuous SPF monitoring** | Checks SPF record integrity every 6 hours. Alerts and auto-pauses sending if the record is modified, deleted, or exceeds 10 lookups. |\n| **Drift alerts** | Notifies immediately if a teammate or an automated system changes the SPF record without authorization. |\n\nPricing: **$39/mo for 10 slots** on Professional, **$99/mo for 30 slots** on Agency, **$299/mo for 100 slots** on Enterprise. Azure tenants at **$30/tenant for 100 M365 mailboxes**.\n\nFor email setups running more than ~5 domains, manual SPF management is a significant time sink, editing records across multiple registrars, tracking lookup counts, and remembering to update when sequencer includes change. Automation is usually worth it once you pass that threshold. See [dns-setup-guide](/learn/dns-setup-guide) for the broader DNS setup context.",
    },
  ],
  faqs: [
    {
      question: "Is SPF softfail the same as SPF fail?",
      answer:
        "No. Softfail (~all) tells receivers \"probably unauthorized, accept anyway.\" Hardfail (-all) tells receivers \"unauthorized, reject.\" For email, softfail is the correct posture because it doesn't cause total delivery failure from a single config mistake. But both are still failures for DMARC alignment purposes.",
    },
    {
      question: "Can I fix SPF softfail by changing ~all to +all?",
      answer:
        "Never do this. `+all` authorizes every IP on the internet to send as your domain, which means spoofers can send as you and pass SPF. It makes softfails \"go away\" at the cost of neutering SPF entirely. Always fix softfails by adding the missing sender to the include list, not by changing the all-mechanism.",
    },
    {
      question: "How do I know my SPF record has too many DNS lookups?",
      answer:
        "Run your domain through MXToolbox SPF lookup (https://mxtoolbox.com/spf.aspx). It reports the total lookup count. Above 10 causes permerror. Target under 8 to leave headroom. If you're over, drop unused includes, use ip4: for static IPs, or split sending across subdomains.",
    },
    {
      question: "Does SPF softfail affect my Gmail domain reputation?",
      answer:
        "Yes. Gmail penalizes senders whose SPF evaluates to softfail even when DKIM keeps DMARC passing. It's not as severe as a hard DMARC fail, but it does lower Postmaster Tools Domain Reputation over time. Fix it as soon as you spot it.",
    },
    {
      question: "My sequencer sends through its own ESP, how do I fix softfail?",
      answer:
        "Three options: migrate to a real mailbox (Google Workspace, Microsoft 365) so the envelope sender is your domain automatically; set up a custom tracking/bounce domain on your sequencer; or rely on DKIM alignment (which passes DMARC even when SPF alignment fails). Option one is usually the cleanest for email.",
    },
  ],
  sources: [
    {
      title: "RFC 7208 - Sender Policy Framework (SPF)",
      url: "https://datatracker.ietf.org/doc/html/rfc7208",
      date: "2014",
    },
    {
      title: "Google Workspace - Set up SPF",
      url: "https://support.google.com/a/answer/33786",
      date: "2026",
    },
    {
      title: "Microsoft 365 - Set up SPF",
      url: "https://learn.microsoft.com/en-us/defender-office-365/email-authentication-spf-configure",
      date: "2026",
    },
    {
      title: "MXToolbox SPF Record Lookup",
      url: "https://mxtoolbox.com/spf.aspx",
      date: "2026",
    },
    {
      title: "Infrabox DNS Documentation",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
  ],
  relatedSlugs: [
    "spf-record-setup-email",
    "dmarc-failed-gmail-fix",
    "dkim-setup-email",
    "email-authentication-spf-dkim-dmarc-explained",
    "dns-setup-guide",
  ],
};
