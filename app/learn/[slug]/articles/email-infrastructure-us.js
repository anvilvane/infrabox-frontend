export const article = {
  slug: "email-infrastructure-us",
  title: "Email Infrastructure for the US (2026)",
  metaDescription:
    "Email infrastructure for US senders. CAN-SPAM rules, Gmail/Yahoo bulk-sender requirements, US-IP reputation, plus the mailbox setup that lands inboxes.",
  headline: "Email Infrastructure for the United States",
  publishedAt: "2026-04-11",
  updatedAt: "2026-07-29",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "email united states",
    "us email infrastructure",
    "can-spam compliance",
    "us ip reputation",
    "gmail yahoo bulk sender",
    "us deliverability",
  ],
  excerpt:
    "What US cold senders actually need in 2026: CAN-SPAM basics, Gmail + Yahoo bulk-sender rules, US-IP reputation, and a domain + mailbox plan that keeps you out of spam.",
  screenshots: [
    {
      src: "/images/dashboard/mailboxes.png",
      alt: "Infrabox mailbox dashboard showing Google Workspace and Microsoft 365 mailboxes on US IPs",
      caption:
        "Infrabox mailbox list: real Google Workspace and Microsoft 365 accounts assigned to US-based IP pools for US-to-US cold outreach.",
    },
  ],
  type: "guide",
  sections: [
    {
      heading: "What US Cold Senders Actually Need in 2026",
      content:
        "A US email stack in 2026 has three non-negotiables: CAN-SPAM compliance, full SPF/DKIM/DMARC alignment, and sending from US-based IPs that match the geography of your recipients. The US market is dominated by Gmail, Outlook.com, Yahoo Mail, and Apple iCloud Mail, and since February 2024 Google and Yahoo enforce the [Google & Yahoo bulk sender requirements](https://support.google.com/a/answer/14229414). Anyone sending above 5,000 messages per day to Gmail addresses from the same domain has to pass DMARC, publish a `p=none` or stricter policy, keep spam complaint rates under 0.3%, and offer one-click unsubscribe via `List-Unsubscribe-Post`.\n\nThe email failure mode in the US is almost always the same: an outreach team buys shared-IP mailboxes from a cheap bulk provider, skips warmup, hits Gmail with 200 messages per mailbox on day one, and ends up in spam inside a week. The fix is boring: real Google Workspace or Microsoft 365 accounts, US IPs, a 14-28 day warmup, and volumes per mailbox that stay under 50/day per account for the first month.\n\n| Setup | Daily volume | Mailboxes | Domains | Infrabox cost |\n|-------|-------------|-----------|---------|---------------|\n| Founder (solo) | 100-200 | 5-10 | 2-3 | $39/mo |\n| Sales team (3-8 reps) | 500-1,500 | 25-50 | 8-15 | $99-$149/mo |\n| Agency (10+ clients) | 2,000-5,000 | 75-150 | 25-50 | $299-$599/mo |\n| Enterprise outbound | 5,000-15,000 | 150-400 | 50-120 | $600-$1,500/mo |\n\n*Pricing based on Infrabox's Professional ($39/mo, 10 slots), Agency ($99/mo, 30 slots), and Enterprise ($299/mo, 100 slots) tiers with $2.50-$3.50 extra per mailbox. Warmup add-on is $3/mailbox/month. InfraGuard is billed per domain with the first month free.*",
    },
    {
      heading: "CAN-SPAM: The Law US Senders Keep Oversimplifying",
      content:
        "CAN-SPAM (the Controlling the Assault of Non-Solicited Pornography And Marketing Act of 2003) is the federal baseline for commercial email in the US. Unlike GDPR, it does not require prior consent, but every requirement on the list below is enforceable, and the FTC can fine senders up to $53,088 per violating message under [updated 2024 penalty figures](https://www.federalregister.gov/documents/2024/01/10/2024-00279/adjustments-to-civil-penalty-amounts).\n\n**The seven CAN-SPAM requirements every cold sender must meet:**\n1. **Accurate header information.** `From`, `Reply-To`, and routing headers must identify the real sender. Infrabox registers mailboxes under your legal sending entity so this happens automatically.\n2. **Non-deceptive subject lines.** No fake `RE:` or `FWD:` prefixes unless the message actually is a reply.\n3. **Clear commercial disclosure.** The message must be identifiable as a commercial solicitation. A short `This is an outreach message from {Company}` line at the bottom is enough.\n4. **A valid physical postal address.** Every message needs a real street address or PO box. This is the single most commonly missed requirement.\n5. **A clear opt-out mechanism.** An unsubscribe link or reply-to-opt-out instruction, honored within 10 business days.\n6. **No sending to scraped addresses harvested from websites.** Scraping is specifically called out in the statute and carries higher penalties.\n7. **No forged headers, open relays, or borrowed accounts.** Using compromised mailboxes triples exposure.\n\nCAN-SPAM preempts most state anti-spam laws but not [California's CCPA](https://oag.ca.gov/privacy/ccpa), which applies if you process personal information of California residents: even B2B work emails count when scraped without permission. A California recipient who opts out of your sequence has a CCPA right to request deletion of their contact record. A clean outbound workflow handles that with a suppression list that survives mailbox rotation.",
    },
    {
      heading: "Gmail, Yahoo, Outlook.com: The Inbox Mix That Decides US Deliverability",
      content:
        "US B2B inboxes skew Gmail-heavy but are not Gmail-only. The practical mix a US sender can expect in 2026 looks like this:\n\n| Inbox provider | Share of US B2B recipients | Key rule for senders |\n|----------------|----------------------------|----------------------|\n| Gmail / Google Workspace | 45-55% | DMARC required, 0.3% spam rate ceiling, one-click unsubscribe |\n| Microsoft 365 / Outlook.com | 30-40% | SNDS reputation, SmartScreen filtering, strict throttles for new senders |\n| Yahoo Mail / AOL | 5-10% | Same 2024 bulk sender rules as Gmail |\n| Apple iCloud Mail | 3-8% | Relies on SPF+DKIM, aggressive on unauthenticated mail |\n| Smaller providers (Fastmail, ProtonMail, Tutanota, Comcast, Cox) | 2-5% | Per-provider quirks, usually harmless with authenticated mail |\n\nTwo things matter in this mix. First, **Gmail and Microsoft 365 disagree about reputation**. Gmail watches domain reputation across all your sending. Microsoft 365 weighs IP reputation more heavily, which is why a US sender with a clean domain can still land in Outlook.com junk if their sending IP has historic complaints. Infrabox's US IP pools are segmented: new mailboxes go onto lower-volume IPs first and only graduate to higher-volume pools after warmup completes.\n\nSecond, the Gmail inbox split matters. Messages can land in *Primary*, *Promotions*, *Updates*, or *Social*. Cold outreach should target Primary. The tabs are determined mostly by content: personalized, 1:1-sounding plain-text emails with a clear ask land in Primary, while emails with heavy HTML, tracking pixels, and merge-tag-heavy greetings get swept into Promotions. US email teams that strip tracking pixels from first touches consistently report 2-3x higher reply rates.",
    },
    {
      heading: "Why US IPs Matter for US-to-US Email",
      content:
        "An email from a European or Asian IP to a US Gmail recipient is technically legal and technically authenticated, and still ends up junked more often than the same message sent from a US IP. Three reasons.\n\nOne, **IP geolocation is a reputation signal.** Gmail and Microsoft feed sender IPs through geolocation databases, and messages that cross continents to reach a recipient pick up a small but measurable reputation penalty, especially if the sending domain is also new. Two, **latency to the receiving MTA affects SMTP handshake success.** TLS renegotiations and RFC 5321 timeouts misbehave more often over 200ms round-trip paths, which quietly bumps bounce rates. Three, **ISP peering matters.** US-to-US traffic usually rides high-quality peering directly into Google and Microsoft's edge, while trans-Atlantic traffic can be routed through transit providers with noisier neighbors.\n\nInfrabox runs [real Google Workspace and Microsoft 365 accounts on US-based IPs](/learn/us-ip-benefits-guide) as the default for US cold senders. This matters more for Microsoft 365 delivery than for Gmail, but the compounding effect on first-touch open rate is real, we typically see 5-12% higher inbox placement for US-domiciled campaigns that match sender and recipient geography.\n\n![Infrabox mailbox dashboard showing Google Workspace and Microsoft 365 mailboxes on US IPs](/images/dashboard/mailboxes.png)\n\nA practical test: once your US infrastructure is live, send a calibration batch to [GlockApps](https://glockapps.com) seed list and compare Primary vs Promotions rates for identical content sent from US IPs vs non-US IPs. The delta is usually 10-20% in favor of US IPs.",
    },
    {
      heading: "Domain and Mailbox Setup for US Senders",
      content:
        "The US email domain strategy is the same everywhere: protect the brand domain, send from secondary domains, rotate mailboxes, but the execution details matter.\n\n**Domain plan for US outreach:**\n- Register 3-8 secondary domains (`.com` preferred for US recipients, `.io`, `.co`, and `.app` land fine but test slightly worse in our data).\n- Vary registrars. Using one registrar for all domains creates a correlated failure mode.\n- Redirect all secondary domains to the primary brand site with a 301 so link clicks on secondary domains still build brand trust.\n- Keep each secondary domain to 3-5 mailboxes. More than that starts to look like bulk on shared-domain scoring.\n\n**Mailbox plan:**\n- Prefer Google Workspace for US recipients. Google-to-Google delivery is the highest-trust path in the US inbox mix.\n- Mix in Microsoft 365 mailboxes at a 20-30% ratio. Microsoft 365 often performs better when reaching Outlook.com / Microsoft 365 recipients.\n- New mailbox ceilings: 20/day in week 1, 40/day in week 2, 60/day in week 3, 80+/day only after week 4.\n- Use Infrabox's [isolated warmup network](/learn/email-warmup-guide): not a shared warmup pool where a neighbor's complaints pollute your reputation.\n\n**DNS checklist for every US-facing domain:**\n- `v=spf1 include:_spf.google.com ~all` (or Microsoft equivalent)\n- Two `dkim` selectors published (`google`, `selector1`)\n- `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com` at minimum; tighten to `p=quarantine` after 30 days of clean reports.\n- MX records matching your mailbox provider\n- Optional: BIMI record for brand indicator display in Gmail and Yahoo\n\nInfrabox automates all of this through Cloudflare in under 60 seconds per domain.",
    },
    {
      heading: "Volume, Warmup, and the 5,000 Message Gmail Threshold",
      content:
        "Google's 2024 bulk sender rules draw a bright line at 5,000 messages per day to Gmail from a single domain. Cold senders should treat that as a planning constraint, not a target. A properly warmed US setup sending 5,000 emails per day is distributing them across at least 50-100 mailboxes on 15-30 domains, never hitting the 5,000/domain ceiling on any single zone.\n\n**The safe US warmup cadence:**\n- **Days 1-7:** 10-20 messages per mailbox per day, all outbound to warmup network, zero cold outreach.\n- **Days 8-14:** 20-40 messages per mailbox per day, warmup network only, start sending 5-10 test emails to known-engaged recipients.\n- **Days 15-21:** 40-60 messages per day with a 70/30 warmup-to-cold ratio.\n- **Day 22+:** 60-100 messages per day, flipping to 30/70 warmup-to-cold. Full cold volume after day 28.\n\n**Volume math for a 10,000/day US campaign:**\n- 10,000 messages / 60 per mailbox = ~170 active mailboxes\n- 170 mailboxes / 4 mailboxes per domain = ~45 domains\n- At Infrabox Enterprise ($299 for 100 slots + $2.50 extra): ~$500/month infrastructure cost\n- Warmup add-on: 170 × $3 = $510/month\n- InfraGuard: ~$50/month for 45 domains\n- **Total: ~$1,060/month for 10,000 emails/day**: under $0.004 per sent message.\n\nCompare that to Instantly's bundled sequencer + infrastructure pricing at roughly $0.008-$0.015 per sent message for equivalent volume, or an in-house rebuild where the human cost of managing 45 domains and 170 mailboxes manually dwarfs the infrastructure bill.",
    },
    {
      heading: "Monitoring: What Breaks First in US Email",
      content:
        "The three failure modes for US cold senders, in order of frequency:\n\n1. **Silent domain blacklisting.** A recipient marks one of your messages as spam, their domain's reputation drops, Gmail quietly throttles delivery. You see the symptom (reply rates falling) two weeks later. Fix: continuous blacklist monitoring (Spamhaus SBL, SORBS, Barracuda) + Google Postmaster domain reputation checks every 6 hours. Infrabox's [InfraGuard](/learn/email-deliverability-monitoring-setup) handles this natively.\n\n2. **DNS drift.** A well-meaning engineer adds a new vendor to SPF, pushes the record over 10 DNS lookups, SPF evaluation returns `permerror`, DMARC alignment silently breaks. Fix: DNS watch that alerts on any unexpected record mutation.\n\n3. **Mailbox suspension.** Google Workspace suspends a mailbox for policy violation. Existing sequences keep trying to send, pile up bounces, hurt the whole domain's reputation. Fix: auto-pause on suspension so the bad mailbox doesn't drag its neighbors down.\n\nUS senders should watch [Google Postmaster Tools](https://postmaster.google.com) and [Microsoft SNDS](https://postmaster.live.com) weekly at minimum. Domain reputation in Postmaster Tools should stay in the High bucket; once it drops to Medium, throttling is already happening. Spam complaint rate should hover under 0.1%, the 0.3% Google threshold is the *enforcement* line, not the operating target.",
    },
    {
      heading: "Setup Checklist for a US Email Stack",
      content:
        "**Week 0: infrastructure provisioning:**\n- [ ] Register 5-10 secondary domains, spread across 2+ registrars\n- [ ] Create Infrabox account, pick the tier that matches projected volume\n- [ ] Provision Google Workspace mailboxes (70%) + Microsoft 365 mailboxes (30%)\n- [ ] Automated DNS (SPF/DKIM/DMARC/MX) via Infrabox + Cloudflare\n- [ ] Enable isolated warmup on every mailbox\n- [ ] Enable InfraGuard on every domain\n\n**Week 1-4: warmup ramp:**\n- [ ] Confirm all mailboxes reach the warmup network and send engagement metrics\n- [ ] Daily check on Postmaster Tools domain reputation\n- [ ] Review SNDS data for Microsoft 365 IP ranges\n- [ ] Build suppression list (CAN-SPAM 10-day opt-out honoring)\n\n**Week 5+: live outreach:**\n- [ ] Start cold sequences at 40-60 messages per mailbox per day\n- [ ] A/B test subject lines and first-touch content\n- [ ] Weekly deliverability review: Primary tab %, open rate, reply rate, complaint rate\n- [ ] Rotate mailboxes out at 0.1% complaint rate threshold\n\n**Red flags to escalate immediately:**\n- Google Postmaster domain reputation drops to Low\n- Spam complaint rate crosses 0.2%\n- Daily bounce rate crosses 3%\n- InfraGuard alerts on a blacklist hit",
    },
  ],
  faqs: [
    {
      question: "Is email legal in the United States?",
      answer:
        "Yes, if you comply with CAN-SPAM. The law does not require prior consent but does require accurate headers, a valid physical address, a working unsubscribe mechanism, and honoring opt-outs within 10 business days. Sending to scraped addresses harvested from websites carries additional penalties. California residents have additional CCPA rights that apply to B2B work emails.",
    },
    {
      question: "Do the 2024 Gmail and Yahoo bulk sender rules apply to email?",
      answer:
        "Yes, if you send more than 5,000 messages per day to Gmail recipients from a single domain. Even under the threshold, DMARC alignment, SPF/DKIM, and one-click unsubscribe have become de facto requirements because Gmail's filter uses those signals for all senders now, not only bulk ones.",
    },
    {
      question: "Do I need US IPs to send email to US recipients?",
      answer:
        "You do not technically need US IPs, but deliverability is measurably better with them: typically 5-12% higher inbox placement for US-to-US campaigns. IP geolocation is a minor reputation signal and SMTP latency to Google and Microsoft's MTAs is lower from US-peered networks. Infrabox assigns US IPs to US senders by default.",
    },
    {
      question: "How much does US email infrastructure cost?",
      answer:
        "On Infrabox: $39/mo for a founder sending 100-200/day, $99-$149/mo for a 3-8 person sales team sending 500-1,500/day, $299-$599/mo for an agency running 2,000-5,000/day, and $600-$1,500/mo for enterprise outbound at 5,000-15,000/day. That works out to under $0.004 per sent message at scale.",
    },
    {
      question: "How many mailboxes does a US cold sender need?",
      answer:
        "At 50-60 safe sends per mailbox per day, plan for one mailbox per 50-60 daily messages. A 500/day team needs 8-10 mailboxes, a 2,000/day operation needs 35-40, a 10,000/day enterprise needs 170+. Spread them across 3-5 mailboxes per domain.",
    },
  ],
  sources: [
    {
      title: "Google & Yahoo Bulk Sender Requirements (2024)",
      url: "https://support.google.com/a/answer/14229414",
      date: "2024",
    },
    {
      title: "FTC CAN-SPAM Act Compliance Guide",
      url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      date: "2024",
    },
    {
      title: "Federal Register, CAN-SPAM civil penalty adjustments",
      url: "https://www.federalregister.gov/documents/2024/01/10/2024-00279/adjustments-to-civil-penalty-amounts",
      date: "2024",
    },
    {
      title: "Google Postmaster Tools",
      url: "https://postmaster.google.com",
      date: "2026",
    },
    {
      title: "Microsoft SNDS",
      url: "https://postmaster.live.com",
      date: "2026",
    },
  ],
  relatedSlugs: [
    "email-infrastructure-setup-guide",
    "us-ip-benefits-guide",
    "google-yahoo-sender-requirements-2026",
    "email-compliance-gdpr-can-spam",
    "email-warmup-guide",
  ],
};
