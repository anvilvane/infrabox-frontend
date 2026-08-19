export const article = {
  slug: "email-throttling",
  title: "Email Throttling Explained: How Drip-Sending Protects Reputation",
  metaDescription:
    "Email throttling explained for cold outreach. What throttling is, why drip-sending protects sender reputation, per-mailbox caps, send intervals, randomization, and ramp tables.",
  headline: "Email Throttling Explained: Why Drip-Sending Protects Your Sender Reputation",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: ["email throttling", "sender reputation", "email", "deliverability"],
  excerpt:
    "Throttling means metering how fast you send instead of dumping a batch at once. Done right, it mimics human sending, respects mailbox caps, and keeps you off spam filters. Here is how it works and how to set it.",
  type: "guide",
  sections: [
    {
      heading: "What email throttling actually means",
      content:
        "Email throttling is the practice of controlling the rate at which messages leave a mailbox: how many per hour, how many per day, and how much time sits between each send. Instead of releasing a hundred emails the instant you hit start, a throttled campaign drips them out over hours with small gaps between each one.\n\nThe goal is simple. A real person sending emails by hand does not fire 200 messages in 90 seconds. Receiving servers at Gmail and Outlook know what human sending looks like, and a sudden burst from a single mailbox is one of the clearest machine-sending signals there is. Throttling smooths your output into a pattern that looks human and stays inside the limits each provider enforces.\n\nThis matters most for email, where you are sending to recipients who have not engaged with you before and every reputation signal is under scrutiny. If you want the broader context on placement, the [deliverability guide](/learn/email-deliverability-guide) and the article on [why emails go to spam](/learn/why-emails-go-to-spam) sit alongside this one.",
    },
    {
      heading: "Why drip-sending protects sender reputation",
      content:
        "Sender reputation is a score that mailbox providers assign to your sending identity based on behavior over time. Sharp, unnatural patterns hurt that score. Throttling protects it on several fronts at once.\n\nFirst, it avoids rate-limit rejections. Providers cap how fast a single account can send. Exceed the rate and you get temporary deferrals (a 421 or 4xx response) or outright blocks. A throttled stream stays comfortably under those thresholds.\n\nSecond, it spreads risk over time. If a batch starts triggering spam complaints or bounces, a throttled campaign gives you a window to notice and stop before the damage compounds. A single instantaneous blast gives you no such chance.\n\nThird, it mimics human cadence. Even gaps, plus a little randomness, look like a person working through a list rather than a script. That pattern is far less likely to trip behavioral spam heuristics.\n\n| Behavior | Throttled sending | Burst sending |\n|---|---|---|\n| Provider rate limits | Stays under | Frequently hit |\n| Spam-filter pattern match | Human-like | Machine-like |\n| Time to react to problems | Hours | None |\n| Reputation trajectory | Stable | Volatile |",
    },
    {
      heading: "Per-mailbox daily caps and send intervals",
      content:
        "Throttling has two main dials: the daily cap (total sends per mailbox per day) and the interval (the gap between consecutive sends). Both are set per mailbox, because reputation is tracked per sending identity, not per campaign.\n\nDaily caps should respect what the provider allows and what your mailbox has earned through warmup. Provider ceilings are documented in the [Google and Microsoft sending limits](/learn/email-sending-limits-google-microsoft) reference and the [sending volume limits guide](/learn/email-sending-volume-limits-guide). For cold outreach specifically, the safe working cap is usually well below the hard provider limit.\n\nA common conservative pattern for an established email mailbox:\n\n| Setting | Conservative value | Notes |\n|---|---|---|\n| Daily sends per mailbox | 30 to 50 | Below provider hard limits for safety |\n| Interval between sends | 60 to 180 seconds | Randomized, not fixed |\n| Active sending window | 8am to 5pm local | Matches human work hours |\n| New recipients per day | Capped separately | First-touch volume is riskiest |\n\nIntervals matter as much as the daily total. Fifty emails in a tight ten-minute block looks nothing like fifty emails spread across an eight-hour workday, even though the daily count is identical. Spread them out.",
    },
    {
      heading: "Randomization: why fixed intervals are a tell",
      content:
        "A perfectly regular send pattern is itself a fingerprint. If your mailbox fires at exactly 90 seconds apart every single time, that metronome regularity is a machine signature. Humans are irregular: they pause to read a reply, get pulled into a meeting, grab coffee, then send three in a row.\n\nGood throttling randomizes the interval within a range rather than using a fixed value. Instead of \"every 90 seconds,\" it sends \"somewhere between 60 and 180 seconds,\" with the actual gap chosen unpredictably each time. The daily total stays controlled, but the moment-to-moment pattern looks organic.\n\nThe same logic applies to daily volume. Sending precisely 50 emails every single day is less natural than sending 42 one day and 51 the next. Small day-to-day variation around your target keeps the pattern from looking automated. Randomization is cheap to implement and meaningfully reduces the behavioral signals that filters look for.",
    },
    {
      heading: "Ramp-up: throttling for a new or warmed mailbox",
      content:
        "A brand-new mailbox has no reputation, so it cannot safely send at full volume on day one. Throttling and warmup work together here: you start with very low volume and increase it gradually as the mailbox builds trust. This is the same principle as [IP warming](/learn/ip-warming-guide), applied at the mailbox level.\n\nA representative ramp schedule for cold sending after warmup is underway:\n\n| Week | Daily sends per mailbox | New first-touch recipients |\n|---|---|---|\n| Week 1 | 5 to 10 | 5 |\n| Week 2 | 10 to 20 | 10 |\n| Week 3 | 20 to 35 | 20 |\n| Week 4 | 35 to 50 | 30 |\n| Week 5+ | Hold at safe cap | Hold |\n\nThese are illustrative starting points, not guarantees. The right curve depends on the provider, the mailbox age, and how engagement looks as you scale. The principle is constant: increase slowly, watch the signals, and back off if bounces or complaints rise. The [email warmup guide](/learn/email-warmup-guide) covers the engagement side that runs in parallel with this volume ramp.",
    },
    {
      heading: "How sequencers and warmup handle throttling for you",
      content:
        "You rarely set throttling by hand on a stopwatch. Two systems handle it: the sequencer that sends your campaigns and the warmup system that builds reputation.\n\nThe sequencer enforces the daily cap, spaces sends across your active window, randomizes intervals, and respects the per-mailbox ceiling so no single account overshoots. It also rotates across multiple mailboxes when you send at scale, so total campaign volume can be high while each individual mailbox stays in safe territory. Infrabox integrates with 24 or more sequencers that manage this scheduling, throttling, and timezone handling, so the per-mailbox caps you configure are actually respected in practice.\n\nWarmup runs underneath. Infrabox provisions real Google Workspace, Microsoft 365, and Azure mailboxes on US IPs, with isolated warmup that builds engagement on each mailbox before and alongside your cold sending. InfraGuard monitoring watches the health signals so problems surface early rather than after a reputation hit. The division of labor is clean: warmup earns the capacity, the sequencer meters how you spend it, and throttling is the rule set that keeps spending inside the budget.",
    },
    {
      heading: "Throttling mistakes that quietly hurt deliverability",
      content:
        "A few patterns undo the benefit of throttling even when senders think they have it configured.\n\nThe first is raising caps too fast. Hitting a high daily number because the campaign tool allows it does not mean the mailbox has earned it. Volume that outruns reputation is the fastest route to the spam folder.\n\nThe second is ignoring the new-recipient subset. Total daily volume can look safe while the share going to brand-new, never-engaged recipients is dangerously high. First-touch sends carry the most risk, so cap them separately from replies and follow-ups.\n\nThe third is treating all mailboxes as one pool. Reputation is per identity. Pushing one mailbox hard while others sit idle concentrates risk instead of spreading it. Rotate.\n\nThe fourth is fixed intervals and fixed daily totals, the metronome problem from earlier. Even a well-chosen cap looks robotic without randomization.\n\nThe fifth is changing throttle settings reactively in a panic. If bounces spike, the fix is to pause and diagnose, not to keep sending at a slightly lower rate. Throttling buys you reaction time only if you actually use it to react.",
    },
    {
      heading: "A simple throttling checklist",
      content:
        "Use this as a setup and review list for any email program:\n\n- Set a per-mailbox daily cap below the provider hard limit, sized to the mailbox's warmup stage.\n- Cap first-touch (new recipient) volume separately and more conservatively than total volume.\n- Use randomized intervals within a range, not a fixed gap.\n- Confine sending to human work hours in the recipient's local time, which ties into [time-zone settings](/learn/time-zone-email).\n- Vary daily totals slightly around the target rather than sending an identical count every day.\n- Rotate across multiple mailboxes so no single identity carries the whole load.\n- Ramp new mailboxes up over weeks, never all at once.\n- Monitor bounces and complaints, and pause to diagnose if either rises.\n\nGet these in place and throttling stops being a thing you think about. It becomes the quiet background discipline that keeps your mailboxes healthy while you focus on copy, targeting, and [send timing](/learn/best-time-to-send-emails).",
    },
  ],
  faqs: [
    {
      question: "What is email throttling in simple terms?",
      answer:
        "Throttling is controlling how fast you send: how many emails per day per mailbox and how much time between each send. Instead of releasing a whole batch at once, you drip messages out over hours so the pattern looks human and stays within provider limits.",
    },
    {
      question: "Why does throttling protect my sender reputation?",
      answer:
        "It keeps you under provider rate limits, makes your sending pattern look human rather than machine-generated, and gives you time to notice and stop if bounces or complaints start rising before the damage compounds.",
    },
    {
      question: "How many emails should I send per mailbox per day?",
      answer:
        "A common conservative range for an established email mailbox is 30 to 50 per day, kept below the provider hard limit, with first-touch volume capped lower. New mailboxes should ramp up gradually over several weeks rather than starting at full volume.",
    },
    {
      question: "Should send intervals be fixed or randomized?",
      answer:
        "Randomized. A perfectly regular interval is a machine fingerprint. Sending somewhere within a range, such as 60 to 180 seconds, with the actual gap varying each time looks far more like a human working through a list.",
    },
    {
      question: "Do I have to configure throttling manually?",
      answer:
        "No. Your sequencer enforces caps, intervals, randomization, and mailbox rotation automatically. Infrabox integrates with 24 or more sequencers that handle this, while its isolated warmup builds the reputation that earns the sending capacity.",
    },
  ],
  sources: [
    {
      title: "Woodpecker: Email Sending Limits and Throttling",
      url: "https://woodpecker.co/blog/email-sending-limits/",
      date: "2025",
    },
    {
      title: "Google Workspace: Email sending limits",
      url: "https://support.google.com/a/answer/166852",
      date: "2025",
    },
    {
      title: "Microsoft: Sending limits in Microsoft 365",
      url: "https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "email-sending-volume-limits-guide",
    "email-sending-limits-google-microsoft",
    "ip-warming-guide",
    "email-warmup-guide",
  ],
};
