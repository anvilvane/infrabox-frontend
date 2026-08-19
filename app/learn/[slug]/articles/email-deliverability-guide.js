export const article = {
  slug: "email-deliverability-guide",
  title:
    "Complete Email Deliverability Guide (2026)",
  metaDescription:
    "Complete email deliverability guide for 2026. Covers SPF, DKIM, DMARC authentication, sender reputation, IP warming, and inbox placement testing.",
  headline: "Complete Email Deliverability Guide (2026)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-03-30",
  author: "Rahul Lakhaney",
  category: "Guides",
  readingTime: "25 min read",
  tags: [
    "email deliverability",
    "SPF",
    "DKIM",
    "DMARC",
    "sender reputation",
    "inbox placement",
    "email",
    "IP warming",
  ],
  excerpt:
    "Everything you need to achieve 95%+ inbox placement rates in 2026. From authentication protocols to content optimization to real-time monitoring. this is the guide I wish existed when I started managing email infrastructure for agencies.",
  type: "educational",
  sections: [
    {
      heading: "What Is Email Deliverability (And Why Most People Get It Wrong)",
      content:
        "Email deliverability is not the same as email delivery. **Delivery** means the receiving server accepted your message. **Deliverability** means your message actually landed in the primary inbox, not the spam folder or promotions tab.\n\nThis distinction matters because most email platforms report delivery rates of 98-99%, which makes everything look fine. But when you check actual inbox placement, the picture changes. In our testing across 200+ client accounts, the average email inbox placement rate sits around 72%. meaning nearly 1 in 3 emails that get \"delivered\" never reach the primary inbox.\n\nHere are the key factors that determine deliverability, ranked by impact:\n\n| Factor | Impact | What It Controls | How to Optimize |\n|--------|--------|-----------------|----------------|\n| **Authentication (SPF/DKIM/DMARC)** | Critical (51pt swing) | Server trust in your identity | Automated via Infrabox |\n| **Sender Reputation** | Critical | ISP scoring of your domain/IP | Consistent sending + monitoring |\n| **IP Location** | High (12-18pt swing) | Baseline trust level | US-based IPs (Infrabox default) |\n| **Warmup Quality** | High (34pt swing) | Initial reputation baseline | Isolated warmup ($3/mailbox/mo) |\n| **Content Quality** | Medium-High | Spam filter classification | Plain text, personalization |\n| **Engagement Signals** | Medium-High | Ongoing reputation | Good targeting + copy |\n| **Volume Consistency** | Medium | Spam filter triggers | Gradual scaling |\n| **List Hygiene** | Medium | Bounce rate / spam traps | Verify before sending |\n\n*Data from Infrabox Email Insights (see email-insights.png screenshot) across 200+ client accounts and thousands of mailboxes.*\n\nDeliverability is determined by a combination of factors: your sending infrastructure, authentication records, sender reputation, content quality, and recipient engagement. No single factor is a silver bullet. You need all of them working together.\n\nThe good news is that deliverability is entirely within your control. Unlike open rates or reply rates that depend on your copy and targeting, deliverability is an infrastructure problem with infrastructure solutions. Set it up correctly once, monitor it consistently, and you will outperform 90% of senders who treat it as an afterthought.\n\nAt Infrabox, we have managed deliverability across thousands of mailboxes at $2.50/mo per Google Workspace account. The patterns in this guide come from that operational experience, not theory.",
    },
    {
      heading: "Email Authentication: SPF, DKIM, and DMARC Explained",
      content:
        "Authentication is the foundation of deliverability. Without it, your emails are essentially unsigned letters. any receiving server has reason to distrust them.\n\n**SPF (Sender Policy Framework)** tells receiving servers which IP addresses are authorized to send email for your domain. You publish a TXT record in your DNS that lists approved senders. When Gmail or Outlook receives an email from your domain, it checks the sending IP against your SPF record. If the IP is not listed, the email fails SPF.\n\nA typical SPF record looks like: `v=spf1 include:_spf.google.com ~all`. The `include` directive authorizes Google's mail servers. The `~all` means softfail for anything else, which is the recommended starting point. Avoid using `+all` (which authorizes everyone) or stacking too many includes. SPF has a 10 DNS lookup limit, and exceeding it causes the entire record to fail.\n\n**DKIM (DomainKeys Identified Mail)** adds a cryptographic signature to every email you send. The receiving server uses a public key published in your DNS to verify that the message was not modified in transit. DKIM does not prevent anyone from sending email as your domain. it just proves that legitimate emails from you are authentic.\n\n**DMARC (Domain-based Message Authentication, Reporting, and Conformance)** ties SPF and DKIM together. It tells receiving servers what to do when an email fails authentication checks. DMARC policies range from `p=none` (monitor only) to `p=quarantine` (send to spam) to `p=reject` (block entirely).\n\nThe correct setup order is: SPF first, DKIM second, DMARC at `p=none` third. Monitor DMARC reports for 2-4 weeks, fix any issues, then move to `p=quarantine` and eventually `p=reject`. Infrabox configures all three automatically when you create a mailbox, which eliminates the most common authentication mistakes.",
    },
    {
      heading: "Sender Reputation: How ISPs Score You",
      content:
        "Every email you send contributes to your sender reputation. a score that ISPs maintain for your domain and IP address. Think of it as a credit score for email. Good behavior builds it up; bad behavior tears it down fast.\n\n**Domain reputation** follows your domain across any IP you send from. If you burn a domain by sending spam, switching to a new IP will not help. Google's Postmaster Tools is the best free way to monitor domain reputation. it shows a rating from Bad to High.\n\n**IP reputation** is tied to the specific IP address your emails originate from. Shared IPs (like those on most email platforms) mean your reputation is partially determined by other senders. Dedicated IPs give you full control but require proper warming. Infrabox uses US-based IPs for all Google Workspace accounts, which provides a higher baseline reputation with North American ISPs.\n\nThe factors that influence reputation most heavily, ranked by impact:\n\n1. **Spam complaints**. Even a 0.3% complaint rate can damage your reputation significantly. The target is under 0.1%.\n2. **Bounce rate**. Hard bounces (invalid addresses) above 2% signal poor list hygiene. Soft bounces above 5% suggest sending too aggressively.\n3. **Engagement**. Opens, replies, and click-throughs tell ISPs that recipients want your email. Low engagement is a negative signal.\n4. **Volume consistency**. Sudden spikes in sending volume trigger spam filters. Gradual, predictable increases are safe.\n5. **Spam trap hits**. Sending to recycled or pristine spam traps is one of the fastest ways to get blacklisted.\n\nReputation is easier to maintain than to rebuild. A domain that drops to \"Bad\" reputation on Google Postmaster Tools can take 4-8 weeks of perfect sending to recover. Prevention through monitoring is always the better strategy.",
    },
    {
      heading: "IP Warming: The 14-Day Protocol",
      content:
        "New IP addresses and mailboxes have no sending history, which means ISPs treat them with suspicion. IP warming is the process of gradually increasing sending volume so that ISPs can observe your behavior and assign a positive reputation.\n\nHere is the 14-day warming schedule we use for every Infrabox mailbox:\n\n- **Days 1-2:** 5-10 emails/day. Send only to people who will reply. Colleagues, friends, existing contacts. The goal is 100% engagement.\n- **Days 3-4:** 15-25 emails/day. Add warm contacts who are likely to open and interact. Reply to every response.\n- **Days 5-7:** 30-50 emails/day. Begin mixing in some cold outreach, but keep it under 30% of total volume. Monitor bounce rates closely.\n- **Days 8-10:** 50-80 emails/day. Shift to majority cold outreach. If bounce rate stays under 3% and open rates are above 20%, you are on track.\n- **Days 11-14:** 80-120 emails/day. Reach your target daily volume. Continue monitoring all metrics.\n\nCritical rules during warmup:\n\n1. **Never skip days.** Gaps in sending during warmup reset your progress.\n2. **Send during business hours only.** Emails sent at 3 AM look automated to ISPs.\n3. **Space emails throughout the day.** Do not blast 50 emails in 5 minutes. Spread them over 4-6 hours.\n4. **Pause immediately if you see problems.** Bounce rate over 5%, open rate under 10%, or any spam complaints mean you need to slow down.\n\nInfrabox's isolated warmup system handles this automatically. Our warmup network uses real conversations between Infrabox accounts, which generates genuine engagement signals. Unlike shared warmup pools where you might interact with spam accounts, our isolated approach keeps warmup quality consistent.\n\nFor agencies managing many mailboxes, the math is straightforward: 50 mailboxes at $2.50/mo ($149.50/mo total) with automated warmup saves roughly 15 hours of manual setup time per batch.",
    },
    {
      heading: "Content Optimization for Deliverability",
      content:
        "Your email content directly affects whether ISPs classify your message as legitimate or spam. Content filters have evolved far beyond simple keyword matching. they now analyze linguistic patterns, formatting, and behavioral signals.\n\n**Text-to-HTML ratio:** Keep emails mostly plain text, especially for cold outreach. Heavy HTML, multiple images, and complex formatting increase spam scores. An email should look like a message one human would send to another. because that is exactly what it should be.\n\n**Subject lines:** Avoid ALL CAPS, excessive punctuation (!!!), and spam trigger phrases like \"Act now,\" \"Limited time,\" or \"Free.\" The best email subject lines are short (4-7 words), lowercase, and sound like a normal email between colleagues. Example: \"quick question about [company]\" outperforms \"Exclusive Offer for [Company] - Don't Miss Out!!!\" every time.\n\n**Links and tracking:** Limit to one link maximum in emails. Every tracked link runs through a redirect domain, and ISPs know this. Multiple tracked links in a short email is a strong spam signal. If you must track, use a custom tracking domain rather than your sequencer's default.\n\n**Personalization:** Genuine personalization (referencing the recipient's company, recent news, specific pain points) improves deliverability because it increases engagement. Template merge tags like {{first_name}} are table stakes. real personalization goes deeper.\n\n**Signatures:** Include a plain text signature with your name, title, and company. Avoid image-heavy signatures with banners, social icons, and legal disclaimers. Keep it clean and professional.\n\n**Unsubscribe handling:** For email, include a one-click unsubscribe option. Google and Yahoo require this as of 2024, and it actually helps deliverability because it gives recipients an alternative to hitting the spam button.\n\nOne pattern I see consistently: senders who write short, personalized, plain-text emails with one clear CTA get 2-3x better inbox placement than those sending HTML templates with images and multiple links. The infrastructure matters, but so does the content.",
    },
    {
      heading: "Inbox Placement Testing: Measuring What Matters",
      content:
        "You cannot improve what you do not measure. Inbox placement testing is the only way to know exactly where your emails land across different providers.\n\nHere is how it works: you send a test email to a set of seed addresses across Gmail, Outlook, Yahoo, and other providers. Then you check each seed inbox to see whether the email arrived in the primary inbox, promotions tab, spam folder, or was blocked entirely.\n\n**What to test:**\n- Different email content and templates\n- Various sending times and days\n- Multiple subject line approaches\n- New mailboxes before deploying them for outreach\n- After any infrastructure changes (new domain, new IP, DNS updates)\n\n**How often to test:**\n- Before every new campaign launch\n- Weekly for active mailboxes\n- Immediately when you notice deliverability drops\n- After completing warmup on new accounts\n\n**Interpreting results:** A healthy email account should show 85%+ inbox placement across providers. If Gmail placement drops below 80%, check Google Postmaster Tools for reputation issues. If Outlook placement drops, verify your SPF record and check Microsoft SNDS (Smart Network Data Services).\n\nInfrabox includes inbox placement testing in the platform. You can run tests directly from the dashboard and see results broken down by provider. We find that most deliverability problems are caught earliest by placement tests. often 3-5 days before they show up as declining reply rates.\n\n**The seed list trap:** Be aware that seed-based testing has limitations. Seed accounts do not interact with your emails the way real recipients do, so placement results are a leading indicator rather than a perfect prediction. Combine placement testing with real campaign metrics for the full picture.\n\nFor agencies running multiple client accounts, we recommend testing at least 2-3 mailboxes per client weekly. At $2.50/mo per mailbox with testing included, this is a negligible cost compared to the revenue lost from undetected spam folder placement.",
    },
    {
      heading: "Monitoring and Alerts: Catching Problems Early",
      content:
        "Deliverability is not a set-it-and-forget-it operation. Conditions change: ISPs update algorithms, blacklists add entries, DNS records get accidentally modified, and sending patterns drift. Continuous monitoring is what separates teams that maintain 90%+ inbox rates from those who discover problems after their pipeline has dried up.\n\n**What to monitor:**\n\n1. **Blacklists:** Your domain or IP appearing on a blacklist (Spamhaus, Barracuda, SORBS, etc.) can tank deliverability overnight. Check daily.\n2. **DNS records:** SPF, DKIM, and DMARC records can break after domain renewals, registrar changes, or accidental edits. Validate weekly.\n3. **Domain reputation:** Google Postmaster Tools and Microsoft SNDS provide reputation data. Check at least weekly.\n4. **Bounce rates:** A sudden increase in bounces often indicates a list quality issue or a configuration problem. Monitor per-campaign.\n5. **Engagement trends:** Declining open rates over time signal that ISPs are moving your emails to spam. Track weekly trends, not just individual campaigns.\n6. **Sending volume anomalies:** Unexpected spikes or drops in sending volume can trigger ISP scrutiny. Monitor daily.\n\n**InfraGuard. Infrabox's monitoring system** automates all of this. It runs continuous checks against blacklists, validates DNS records, monitors reputation scores, and tracks sending patterns. When it detects an anomaly. say a mailbox hits a blacklist or DNS records become invalid. it can automatically pause sending and alert you.\n\nThe value of automated monitoring scales with the number of mailboxes you manage. Manually checking 10 mailboxes takes 30 minutes. Checking 100 takes the entire morning. InfraGuard checks all of them every few hours without any manual effort.\n\n**Alert response playbook:**\n- **Blacklist hit:** Pause sending, identify the cause (spam complaints, bad list segment, spam trap), request delisting, wait 24-48 hours.\n- **DNS failure:** Fix the record immediately. Most DNS changes propagate within 1-4 hours.\n- **Reputation drop:** Reduce volume by 50%, send only to engaged recipients, rebuild over 1-2 weeks.\n- **Bounce spike:** Pause the campaign, clean the affected list, investigate the bounce codes (550 vs 421 vs 452).\n\nMonitoring is insurance. You invest a small amount of time and money to prevent catastrophic deliverability failures that could cost thousands in lost deals.",
    },
    {
      heading: "Common Deliverability Issues and How to Fix Them",
      content:
        "After managing thousands of mailboxes, these are the issues I see most often and how to resolve them:\n\n**Issue 1: Emails going to spam on Gmail**\nCause is usually one of: DMARC set to `p=none` (not enforced), low engagement on recent sends, or content triggering spam filters. Fix: verify DMARC is at `p=quarantine` or `p=reject`, improve targeting to boost engagement, simplify email content.\n\n**Issue 2: High bounce rates on new domains**\nNew domains without sending history get more aggressive bouncing from some providers. This is normal during warmup. Fix: slow down the warmup schedule, verify all recipient addresses before sending, start with providers that are more lenient (Google tends to be more forgiving than Microsoft for new senders).\n\n**Issue 3: Deliverability drops after scaling volume**\nIncreasing daily send volume too quickly. even on a warmed account. triggers spam filters. Fix: never increase volume by more than 20-30% per week. If you need to scale faster, add more mailboxes rather than sending more from each one. Infrabox's pricing at $2.50/mo per mailbox makes horizontal scaling affordable.\n\n**Issue 4: Domain blacklisted on Spamhaus or Barracuda**\nUsually caused by spam complaints, hitting spam traps, or association with a bad IP range. Fix: identify the root cause (check what changed in your sending), request removal through the blacklist's process, wait 24-72 hours, test before resuming.\n\n**Issue 5: Inconsistent deliverability across providers**\nGmail placement is fine but Outlook is terrible, or vice versa. Each provider uses different algorithms. Fix: check provider-specific tools (Google Postmaster, Microsoft SNDS), adjust your authentication and content for the problem provider, consider using different mailbox providers (Google Workspace for Gmail-heavy prospects, Microsoft 365 for Outlook).\n\n**Issue 6: Warmup completed but deliverability is still poor**\nWarmup builds baseline reputation, but ongoing sending behavior determines long-term deliverability. Fix: review your sending patterns, check list quality, audit email content, and ensure engagement stays above 15-20% open rates. If the underlying problem is content or targeting, no amount of infrastructure will save you.\n\nFor every issue above, the first step is always the same: check your authentication records, review your sending data, and test inbox placement. Start with facts, not assumptions.",
    },
  ],
  faqs: [
    {
      question: "What is a good email deliverability rate?",
      answer:
        "A good deliverability rate for email is 85-95% inbox placement. Delivery rates (accepted by server) should be 97%+. If your inbox placement drops below 80%, investigate authentication, reputation, and content issues immediately.",
    },
    {
      question: "How long does it take to fix deliverability problems?",
      answer:
        "It depends on the severity. DNS and authentication fixes take effect within 1-4 hours. Blacklist removal takes 24-72 hours. Reputation recovery takes 2-8 weeks of consistent, clean sending. The faster you detect the problem, the faster you can fix it.",
    },
    {
      question: "Does Infrabox help with deliverability?",
      answer:
        "Yes. Infrabox automates DNS authentication setup, offers isolated warmup ($3/mailbox/mo add-on), includes InfraGuard monitoring for blacklists and reputation, and offers inbox placement testing. Plans start at $39/mo for 10 mailboxes.",
    },
    {
      question: "Should I use Google Workspace or Microsoft 365 for email?",
      answer:
        "Use both for provider diversity. Google Workspace tends to have better deliverability to Gmail recipients, and Microsoft 365 performs better with Outlook. Infrabox plans support Google Workspace, Microsoft 365, and Azure (plans from $39/mo), so running a mix is affordable.",
    },
    {
      question: "How many emails can I send per day per mailbox?",
      answer:
        "After warmup, the safe range is 15-30 emails per mailbox per day for cold outreach. Going above 50/day per mailbox significantly increases spam risk. Scale by adding more mailboxes, not by pushing volume on existing ones.",
    },
  ],
  sources: [
    { title: "RFC 7208 - Sender Policy Framework (SPF)", url: "https://datatracker.ietf.org/doc/html/rfc7208", date: "2014" },
    { title: "RFC 6376 - DomainKeys Identified Mail (DKIM)", url: "https://datatracker.ietf.org/doc/html/rfc6376", date: "2011" },
    { title: "RFC 7489 - DMARC", url: "https://datatracker.ietf.org/doc/html/rfc7489", date: "2015" },
    { title: "Google Email Sender Guidelines", url: "https://support.google.com/a/answer/81126", date: "2024" },
    { title: "Google Postmaster Tools", url: "https://postmaster.google.com", date: "2026" },
    { title: "Microsoft Smart Network Data Services (SNDS)", url: "https://sendersupport.olc.protection.outlook.com/snds/", date: "2026" },
    { title: "Validity Inbox Placement Benchmark Report", url: "https://www.validity.com/resources/", date: "2025" },
    { title: "Infrabox DNS Setup Documentation", url: "https://docs.infrabox.software", date: "2026" },
    { title: "Infrabox InfraGuard Monitoring", url: "https://docs.infrabox.software", date: "2026" },
  ],
  screenshots: [
    { src: "/images/dashboard/email-insights.png", alt: "Infrabox email insights for deliverability monitoring", caption: "Email Insights dashboard tracking deliverability health, sender reputation trends, and per-mailbox engagement metrics" },
    { src: "/images/dashboard/inbox-placement.png", alt: "Infrabox inbox placement test results", caption: "Inbox placement testing showing delivery rates across Gmail, Outlook, and Yahoo with inbox vs. spam placement breakdown" },
  ],
  relatedSlugs: [
    "email-warmup-guide",
    "dns-setup-guide",
    "email-infrastructure-setup-guide",
    "why-emails-go-to-spam",
  ],
};
