export const article = {
  slug: "google-postmaster-bad-reputation",
  title: "Google Postmaster Bad Reputation Fix Guide (2026)",
  headline: "Google Postmaster Bad Reputation Fix Guide (2026)",
  metaDescription:
    "Postmaster Tools showing Bad or Low domain reputation? Here's how to read the dashboards, diagnose the root cause, and run the 14-day recovery protocol.",
  publishedAt: "2026-04-11",
  updatedAt: "2026-04-11",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "11 min read",
  tags: [
    "google postmaster tools",
    "domain reputation",
    "gmail deliverability",
    "sender reputation fix",
    "spam rate",
  ],
  excerpt:
    "Postmaster Tools shows Bad or Low reputation when Gmail's internal classifier has flagged your domain. Fixing it takes a specific pause-diagnose-rebuild protocol, not just waiting it out.",
  screenshots: [
    {
      src: "/images/dashboard/domains.png",
      alt: "Infrabox InfraGuard reputation monitoring dashboard",
      caption: "InfraGuard checks domain reputation every 6 hours and alerts before Postmaster Tools shows Bad, catching the drop while you can still act.",
    },
  ],
  type: "how-to",
  sections: [
    {
      heading: "What \"Bad Reputation\" Actually Means in Postmaster Tools",
      content:
        "Google Postmaster Tools reports domain reputation on a four-level scale: **Bad**, **Low**, **Medium**, **High**. This rating is Gmail's own internal classification of your sender and it directly drives filter decisions. A Bad rating routes most of your mail to spam within 24-48 hours of the rating dropping.\n\n**The four levels translate roughly to:**\n\n| Level | Inbox Placement (rough) | Gmail's Opinion |\n|-------|-------------------------|-----------------|\n| **High** | 85-95% | This sender is trusted; route to Primary. |\n| **Medium** | 65-80% | Neutral; mix of signals, inbox is still default. |\n| **Low** | 25-45% | Enough negative signals to be skeptical; promotion/spam routing increases. |\n| **Bad** | 5-20% | Strong negative signals; default routing is spam. |\n\n**Bad reputation is Gmail telling you explicitly that something in your sending pattern, volume, list quality, or authentication is broken.** The rating is smoothed over ~7 days, so it lags actual behavior. By the time Postmaster shows Bad, the underlying issue has been active for at least a few days.\n\nThis guide walks through the exact pause-diagnose-rebuild protocol that reliably moves domains from Bad → Medium → High over 14-28 days. For the general overview of the Postmaster dashboards, see [google-postmaster-tools-guide](/learn/google-postmaster-tools-guide).",
    },
    {
      heading: "Step 1: Read All Five Dashboards, Not Just One",
      content:
        "\"Bad reputation\" is not a single diagnostic. It is a symptom that shows up in one place but is caused by signals across five dashboards. Read all of them before deciding on a fix:\n\n| Dashboard | What to Check | Healthy | Problem |\n|-----------|---------------|---------|---------|\n| **Domain Reputation** | Overall score | High / Medium | **Low / Bad** |\n| **IP Reputation** | Sending IP score | High / Medium | Low / Bad (usually only affects dedicated IPs) |\n| **Spam Rate** | % of recipients marking as spam | < 0.10% | > 0.30% (Google's official threshold for bulk senders) |\n| **Authenticated Traffic** | % of your mail passing SPF/DKIM/DMARC alignment | 100% | < 99% |\n| **Delivery Errors** | Rate and cause of rejections | Zero listed | \"Unauthenticated email\" / \"High unknown user rate\" / \"Spam detected\" |\n\n**The diagnostic pattern you're looking for:** which combination of dashboards is unhealthy tells you the root cause.\n\n| Pattern | Root Cause |\n|---------|------------|\n| Bad Domain Rep + > 0.30% Spam Rate | Content triggering spam complaints. Fix the email body, not the infrastructure. |\n| Bad Domain Rep + < 99% Authenticated Traffic | Authentication misalignment (usually DMARC). Fix SPF/DKIM/DMARC alignment first. |\n| Bad Domain Rep + Delivery Errors \"High unknown user rate\" | Bounce surge, list quality issue. Clean the list. |\n| Bad Domain Rep + clean elsewhere | Volume ramp too aggressive. Throttle immediately. |\n| Bad Domain Rep + Bad IP Rep | Shared-IP contamination. Migrate to real Google Workspace accounts. |\n\nDo not skip this step. Fixing the wrong root cause (e.g., rewriting content when the actual issue is DMARC misalignment) wastes 1-2 weeks and Gmail's rating moves slowly.",
    },
    {
      heading: "Step 2: Map the Symptom to the Root Cause",
      content:
        "Once you've identified which combination of dashboards is problematic, map it to the specific fix. This table is the single most useful reference in this guide. Screenshot it.\n\n| Symptom | Root Cause | Fix | Recovery Time |\n|---------|-----------|-----|---------------|\n| Spam Rate > 0.30%, Domain Rep Low/Bad | Recipients clicking \"Mark as spam\" | Rewrite template to cut promotional signals; kill tracking pixel; shorten body to <120 words; send to better-targeted lists | 2-3 weeks |\n| Delivery Errors: \"Unauthenticated email\" | DMARC alignment failing | Fix DKIM alignment on sequencer; add custom DKIM selector; verify with Show Original. See [dmarc-failed-gmail-fix](/learn/dmarc-failed-gmail-fix) | 3-7 days after fix |\n| Delivery Errors: \"High unknown user rate\" | Bounce rate > 3% on sends | Clean list with NeverBounce / ZeroBounce; remove all catch-all and role accounts; target bounce rate <2% | 1-2 weeks |\n| Volume graph shows recent 5x spike + Bad reputation | Volume ramp triggered bulk-sender filter | Drop volume to 30% of pre-spike level; ramp at 20% per week | 2-4 weeks |\n| Bad IP Rep on shared-IP provider | Neighbor contamination | Migrate to real Google Workspace or Microsoft 365 accounts. Shared-IP rehab is rarely worth it. | Immediate on migration + warmup |\n| Low Domain Rep on a brand new domain | Insufficient warmup | Pause cold sends; run isolated warmup for 14-21 days before resuming | 2-3 weeks |\n| Delivery Errors: \"Spam detected\" with clean content | Gmail ML classifier edge case | Switch templates; change subject lines; vary sending pattern | 2-4 weeks, variable |\n\n**If multiple rows apply, fix them in the table's order.** Authentication first, list quality second, content third, volume fourth. Address them in the wrong order and recovery stalls because you're not addressing the strongest signal.",
    },
    {
      heading: "Step 3: The 7-14 Day Pause Protocol",
      content:
        "Fixing the root cause alone is not enough. You have to stop sending long enough for Gmail's smoothing window to pick up the corrected behavior. Recovery follows a specific pattern:\n\n1. **Day 0: Pause all cold campaigns** on the affected domain. Keep warmup running. Fix the identified root cause.\n2. **Day 1-3: Monitor Postmaster Tools daily.** Ratings usually don't move yet because the rolling window still includes the bad days. This is normal.\n3. **Day 4-7: First signs of improvement** if the root cause is fixed. Spam Rate should drop first (within 2-3 days), Domain Reputation starts moving 2-4 days after that.\n4. **Day 7-10: If reputation is improving** (Bad → Low, or Low → Medium), resume cold sending at **30% of pre-pause volume**. If reputation is still Bad or dropping, the root cause is not fully fixed, so go back to Step 1.\n5. **Day 10-14: Ramp to 60% of pre-pause volume** if Postmaster Reputation continues climbing.\n6. **Day 14-21: Back to 100%** if Reputation is Medium or better.\n\n**Hard rules during the pause protocol:**\n\n- **Do not touch SPF/DKIM/DMARC during recovery** unless that's the identified root cause. Authentication changes during recovery introduce variance and muddy the signal.\n- **Do not run A/B tests during recovery.** Keep template, volume, and sending time constant so you can see what's causing the movement.\n- **Do not add new mailboxes to the domain during recovery.** New mailboxes introduce new warmup load that Gmail has to evaluate.\n- **Do keep warmup running.** Warmup is the positive-signal generator during recovery. Pausing warmup removes the counter-signal and slows recovery.",
    },
    {
      heading: "Step 4: Rebuild with Isolated Warmup",
      content:
        "Warmup is what generates the positive engagement signals Gmail uses to upgrade reputation. But not all warmup is equal:\n\n**Pooled warmup (shared across customers)**: Mailreef, Warmforge, most standalone warmup tools use a pool where your mailbox exchanges mail with every other customer's mailbox. During a reputation recovery, this is risky because if one customer in the pool has Bad reputation, your sends to them get marked as spam, which compounds your problem.\n\n**Isolated warmup**: each customer's warmup pool is segregated, so your mailbox only exchanges mail with trusted, known-good seed accounts. During recovery, isolated warmup reliably generates positive engagement without cross-customer contamination.\n\n**Warmup cadence for reputation recovery:**\n\n| Day | Warmup Volume | Cold Volume | Target Signal |\n|-----|---------------|-------------|---------------|\n| 0-7 | 20-30/day | 0 | Positive engagement only: opens, replies, \"Not Spam\" moves |\n| 7-14 | 25-35/day | 5-10/day (clean, high-intent) | Maintain warmup while small cold volume tests the new baseline |\n| 14-21 | 25-35/day | 10-20/day | Ramp cold if Postmaster Reputation climbs |\n| 21-28 | 20-25/day | 20-30/day | Return to steady state |\n\n**Infrabox isolated warmup runs at $3/mailbox/mo**, specifically engineered for reputation recovery scenarios. Deeper warmup reference in [domain-warmup-best-practices](/learn/domain-warmup-best-practices).",
    },
    {
      heading: "Step 5: Monitor Recovery Metrics",
      content:
        "During the recovery window, three Postmaster metrics matter more than the headline Domain Reputation number because they move faster and predict where Reputation will go next:\n\n| Metric | Leading / Lagging | What Healthy Looks Like During Recovery |\n|--------|------------------|----------------------------------------|\n| **Spam Rate** | Leading | Drops within 2-3 days of the root cause fix. Target < 0.15% during recovery, < 0.10% steady state. |\n| **Authenticated Traffic %** | Leading | Should be at 100% by day 1. If not, authentication is still broken. |\n| **Delivery Errors** | Leading | Errors stop within 1-2 days of the root cause fix. Persistent errors mean the root cause is wrong. |\n| **IP Reputation** | Lagging | Only relevant on dedicated IPs. Slowest to move. |\n| **Domain Reputation** | Lagging | 5-10 days behind the other metrics. Don't use as primary signal during active recovery. |\n\n**The pattern that means \"recovery is working\":**\n\n1. Spam Rate drops first (days 2-4).\n2. Delivery Errors clear (days 2-5).\n3. Domain Reputation begins climbing (days 5-10).\n4. Reply rate on live sends recovers (days 7-14).\n5. Bounce rate normalizes (days 7-14).\n\n**The pattern that means \"recovery is failing\":**\n\n1. Spam Rate stays above 0.20% despite content changes.\n2. Authenticated Traffic stays below 99%.\n3. Domain Reputation stays at Bad or Low after 14 days.\n\nIf you see the failing pattern at day 14, the root cause is either misdiagnosed or the domain is structurally damaged. Move to the retire-vs-rehab decision below.",
    },
    {
      heading: "When to Retire vs Rehab",
      content:
        "Not every damaged domain is worth saving. Use this decision framework:\n\n| Scenario | Decision | Rationale |\n|----------|----------|-----------|\n| First time Bad rating, clear root cause | **Rehab** | One-time incident, fixable in 2-4 weeks |\n| Second Bad rating within 90 days on same domain | **Retire** | Pattern indicates structural list/content/process issue |\n| Bad rating + Spamhaus DBL hit | **Retire** | Combined signal means the domain is flagged by multiple systems; rehab cost is very high |\n| Bad rating on a burner/secondary domain | **Retire** | Secondaries are meant to be replaced; replacement is faster than rehab |\n| Bad rating on main brand domain | **Rehab, aggressively** | Strategic value justifies the 4-6 week effort |\n| Bad rating + domain age < 60 days | **Retire** | Young domains have no reputation reserve; fresh domain + warmup is faster |\n| Bad rating + Authentication misaligned | **Rehab** | Fixable with DNS changes; reputation recovers once authentication passes |\n\n**The economics:** a burner email domain costs $10-15 + ~$3/mailbox/mo warmup. Full rehab of a Bad-rated domain takes 21-28 days of reduced sending. Fresh domain + 14-day warmup is typically 2-3x faster than rehab for most email setups. This is why professional emailers operate with **rotating burner domains**, and when one gets damaged, they retire it and spin up a replacement without disrupting campaigns. Architecture in [how-many-domains-email](/learn/how-many-domains-email).",
    },
    {
      heading: "Prevention with Continuous Monitoring",
      content:
        "Postmaster Tools has a 5-10 day lag because the ratings are smoothed. That means by the time you see Bad, the damaging behavior has been happening for 5-10 days already. Prevention beats rehab every time.\n\n**The three layers of continuous monitoring that prevent Bad reputation:**\n\n| Layer | What It Catches | Lead Time Advantage |\n|-------|----------------|---------------------|\n| **Bounce rate watchdog** | List quality issues before they trigger bulk rejections | 3-5 days before Postmaster reacts |\n| **SMTP error pattern watcher** | Throttling and soft bounces spiking above 3% | 2-3 days before reputation drops |\n| **Blacklist sweeper every 6h** | Domain appearing on Spamhaus DBL or similar | 24-48 hours before Gmail picks it up |\n\n**Infrabox InfraGuard implements all three** and auto-pauses sending on a mailbox or domain when any alert fires. The 6-hour check interval means you typically get 24-72 hours of lead time before Postmaster Tools would have shown a problem, enough time to fix the root cause without the reputation drop.\n\nInfraGuard is **free for the first month** on all plans and then billed per-domain. The Agency plan at **$99/mo for 30 slots** is a common sweet spot for teams running ~20 email domains.\n\nBeyond InfraGuard, two habits prevent Bad reputation entirely:\n\n1. **Verify every list before sending.** 10-minute manual check with NeverBounce or similar prevents the bounce-surge failure mode.\n2. **Keep per-mailbox daily volume under 40/day.** The single biggest predictor of a ramp-induced reputation drop is per-mailbox volume above 40/day.\n\nFor the full monitoring stack reference, see [email-deliverability-monitoring-setup](/learn/email-deliverability-monitoring-setup).",
    },
  ],
  faqs: [
    {
      question: "How long does Postmaster Tools take to show reputation changes?",
      answer:
        "5-10 days. The ratings are smoothed over a rolling window, so both the initial drop and the recovery are delayed. This is why leading indicators (Spam Rate, Delivery Errors) matter more during active recovery than the headline Reputation number.",
    },
    {
      question: "Can I recover a Bad rating without pausing campaigns?",
      answer:
        "Rarely. Bad means Gmail's classifier has already decided your pattern is abusive. Continuing to send the same pattern just confirms the classifier's decision. A 7-14 day pause while you fix the root cause is almost always faster than trying to push through.",
    },
    {
      question: "Does Postmaster Tools show data for Microsoft 365 or Yahoo?",
      answer:
        "No. Postmaster Tools is Google-only. For Microsoft 365, use SNDS (Smart Network Data Services). For Yahoo, there is no public postmaster dashboard, so you rely on DMARC aggregate reports and bounce patterns.",
    },
    {
      question: "Why does my Domain Reputation drop even though I didn't change anything?",
      answer:
        "Usually list quality decay or gradual content fatigue. Recipients who once engaged stop replying; bounce rate on old addresses increases; the same template starts getting marked as spam more often. Reputation is a moving target. You have to rotate content and clean lists continuously to hold a High rating.",
    },
    {
      question: "Is Bad reputation on Postmaster the same as being blacklisted?",
      answer:
        "No. Blacklist is a public DNSBL like Spamhaus. Postmaster reputation is Gmail's private internal score. The two are correlated (blacklist hits often cause Postmaster drops) but they're separate systems with separate fixes. For blacklist diagnosis see [domain-blacklisted-diagnosis-guide](/learn/domain-blacklisted-diagnosis-guide).",
    },
  ],
  sources: [
    {
      title: "Google Postmaster Tools Help",
      url: "https://support.google.com/mail/answer/6227174",
      date: "2026",
    },
    {
      title: "Google Email Sender Guidelines",
      url: "https://support.google.com/a/answer/81126",
      date: "2024",
    },
    {
      title: "Google Postmaster Tools Dashboard",
      url: "https://postmaster.google.com",
      date: "2026",
    },
    {
      title: "Microsoft SNDS (Smart Network Data Services)",
      url: "https://sendersupport.olc.protection.outlook.com/snds/",
      date: "2026",
    },
    {
      title: "Infrabox InfraGuard Documentation",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
  ],
  relatedSlugs: [
    "google-postmaster-tools-guide",
    "dmarc-failed-gmail-fix",
    "domain-blacklisted-diagnosis-guide",
    "domain-warmup-best-practices",
    "how-many-domains-email",
  ],
};
