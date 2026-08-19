export const article = {
  slug: "time-zone-email",
  title: "Time-Zone Settings for Cold Campaigns: A How-To Guide",
  metaDescription:
    "How to set up time-zone settings for email campaigns. Why recipient local time wins, how to detect and segment by timezone, scheduling windows, global lists, and sequencer settings.",
  headline: "Time-Zone Settings for Cold Campaigns: Send in Recipient Local Time",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "10 min read",
  tags: ["time zones", "email", "campaign scheduling", "sequencers"],
  excerpt:
    "Sending in the recipient's local morning beats firing a global list at one fixed clock time. This how-to covers detecting and segmenting timezones, scheduling windows, handling global lists, and configuring your sequencer.",
  type: "how-to",
  sections: [
    {
      heading: "Why send in recipient local time",
      content:
        "An email lands best when it arrives during the recipient's active hours. The morning triage window and the post-lunch reset are when people actually process their inbox. Those windows are defined by the recipient's clock, not yours.\n\nIf you send a global list at one fixed time, you optimize for exactly one zone and misfire everywhere else. A 9am Eastern send reaches Los Angeles at 6am, London at 2pm, and Sydney in the middle of the night. The same campaign that lands in a prime window for one segment lands in a dead window for another.\n\nThis is why timezone alignment matters more than picking the perfect hour. The difference between a good and bad hour within a single zone is modest, as the [best time to send](/learn/best-time-to-send-emails) data shows. The difference between landing in someone's morning versus at 3am is enormous. Get the zone right first, then fine-tune the hour. This guide walks through doing exactly that.",
    },
    {
      heading: "Step 1: detect the recipient's time zone",
      content:
        "You cannot schedule by local time until you know each recipient's zone. There are several signals, in rough order of reliability.\n\nThe most reliable is an explicit location field in your data: city, state, or country attached to the contact record. Map that to a time zone and you are done.\n\nNext is company location. For B2B lists, the company headquarters or office location is often a good proxy, especially for office-based roles. Enrichment tools usually return a location you can map to a zone.\n\nWeaker signals include phone-number country and area codes, which give country and sometimes region, and domain country-code TLDs like .co.uk or .de, which hint at a country.\n\n| Signal | Reliability | Notes |\n|---|---|---|\n| Explicit city/state field | High | Best case, map directly to zone |\n| Company HQ location | Medium to high | Strong B2B proxy |\n| Phone area code | Medium | Country reliable, region less so |\n| Country-code TLD | Low to medium | Hints at country only |\n| No data | None | Assign to a default fallback bucket |\n\nThe practical goal is to tag every contact with a time zone or, failing that, a sensible default. A clean list with a location column makes this nearly automatic.",
    },
    {
      heading: "Step 2: segment your list by zone",
      content:
        "Once contacts are tagged, group them into a manageable number of zone buckets. You do not need one bucket per exact offset. A handful of broad regional buckets captures almost all the benefit with far less complexity.\n\nA workable default segmentation for a global list:\n\n| Segment | Covers | Approx offset (from UTC) |\n|---|---|---|\n| Americas West | US Pacific, Mountain | UTC-8 to UTC-7 |\n| Americas East | US Central, Eastern, eastern Canada | UTC-6 to UTC-5 |\n| Europe/Africa | UK, Western and Central Europe | UTC+0 to UTC+2 |\n| Middle East/South Asia | Gulf, India | UTC+3 to UTC+5:30 |\n| Asia-Pacific | SE Asia, China, Japan, Australia | UTC+7 to UTC+11 |\n| Default fallback | Unknown zone contacts | Use a primary-market zone |\n\nEach segment gets its own scheduled sending window aligned to its local morning. Contacts with no usable location data drop into the fallback bucket, which you schedule for whichever zone represents most of your audience. This keeps the unknowns from being sent at random hours.",
    },
    {
      heading: "Step 3: choose your local scheduling windows",
      content:
        "For each segment, define a sending window in that segment's local time. The benchmark-backed sweet spot is mid-morning, with an early-afternoon fallback, on mid-week days.\n\n| Local window | Use | Priority |\n|---|---|---|\n| 8:00am to 11:00am local | Primary first-touch window | High |\n| 1:00pm to 3:00pm local | Secondary fallback | Medium |\n| Before 7:00am / after 6:00pm | Avoid for first touches | Low |\n| Weekends | Avoid for B2B | Low |\n\nThe key configuration point is that the window is expressed in local time per segment, and the system translates it to the actual send moment for each contact. When the Americas East window opens at 8am Eastern, the sequencer fires that segment; the Asia-Pacific segment waits until its own 8am arrives. You define one logical window and it executes correctly across every zone.\n\nKeep the window wide enough that throttling can spread sends across it. A two-to-three-hour window gives room to drip messages out at randomized intervals rather than bunching them, which the [email throttling](/learn/email-throttling) guide explains in depth.",
    },
    {
      heading: "Step 4: handle global lists cleanly",
      content:
        "Global lists raise a few practical issues worth handling deliberately.\n\nMailbox capacity across zones. If you send to five zones from a fixed pool of mailboxes, each zone's window opens at a different absolute time, so your mailboxes are working across a long stretch of the day. That is fine, but make sure per-mailbox daily caps account for the combined load. Respect the limits in the [sending volume limits guide](/learn/email-sending-volume-limits-guide).\n\nDaylight saving shifts. Offsets change twice a year in many regions, and not on the same dates. Relying on a system that tracks current local time per zone, rather than a hardcoded offset, avoids sends drifting an hour off after a DST change.\n\nThe unknown-zone bucket. Decide its policy explicitly. Sending unknowns in your largest market's window is usually the safest default, since it lands well for the plurality and avoids 3am sends.\n\nRamp interaction. If you are ramping new mailboxes, the volume curve from the [throttling](/learn/email-throttling) ramp tables applies per mailbox regardless of how many zones you cover. Do not let multi-zone scheduling tempt you into exceeding a young mailbox's safe daily cap.",
    },
    {
      heading: "Step 5: configure the sequencer",
      content:
        "Modern sequencers do the heavy lifting once you set them up correctly. The settings that matter:\n\nTimezone source. Point the sequencer at the contact field holding location or zone. Some tools detect zone from a location column automatically; others want an explicit timezone field. Make sure the mapping is correct before launching.\n\nSchedule in recipient local time. Enable the option that interprets your sending window as recipient-local rather than account-local. This is the single setting that turns a fixed-clock blast into a per-zone campaign. It is often labeled something like \"send in recipient time zone.\"\n\nWindow and days. Set the local window (for example 8am to 11am) and the active days (for example Tuesday to Thursday).\n\nThrottle and randomization. Set per-mailbox daily caps and randomized intervals so sends spread across the window naturally.\n\nInfrabox fits into this layer rather than replacing it. It provisions real Google Workspace, Microsoft 365, and Azure mailboxes on US IPs with isolated warmup, and integrates with 24 or more sequencers that handle the scheduling, throttling, and timezone alignment described here. You connect the mailboxes, configure the sequencer's local-time settings, and InfraGuard monitoring watches mailbox health while the campaign runs. The deliverability fundamentals behind all of this live in the [deliverability guide](/learn/email-deliverability-guide).",
    },
    {
      heading: "Verifying it works",
      content:
        "After launch, confirm the configuration is actually doing what you intended. A quick verification routine:\n\n1. Pull a sample of sent timestamps and convert each to the recipient's local time. They should cluster inside your defined window, not your own.\n2. Check the unknown-zone bucket. Confirm those sends landed in your chosen fallback window rather than scattering across odd hours.\n3. Watch for DST drift. Around clock-change dates, re-check that local send times still land where expected.\n4. Compare engagement by segment. If one zone underperforms badly, the window may be mistuned for that audience, which is a cue to test as described below.\n\nThe most common silent failure is a sequencer left on account-local scheduling, so everything fires at your time despite the segments being set up. Verifying real local send times catches this immediately.",
    },
    {
      heading: "Testing and refining per audience",
      content:
        "Default windows are a starting hypothesis. Your specific audience may engage at hours that differ from the generic mid-morning pattern, especially for non-standard professions or consumer segments.\n\nRefine with a clean experiment: hold copy, list, and mailboxes constant, vary only the local window, and compare replies (not opens, which are noisy) bucketed by recipient local hour. The [A/B testing guide](/learn/email-ab-testing-guide) covers sample size so you can tell a real difference from noise. Because within-zone timing effects are modest, you need enough volume per arm to draw a real conclusion.\n\nA sensible refinement order: get the zone right first (the biggest lever), then test the local window, then layer in [send-time](/learn/best-time-to-send-emails) and [follow-up cadence](/learn/follow-up-email-cadence) tuning. Most of the gain comes from simply not sending at 3am local time, which correct timezone settings deliver on day one.",
    },
  ],
  faqs: [
    {
      question: "Why should I send emails in the recipient's local time?",
      answer:
        "Because engagement peaks during the recipient's active hours, defined by their clock, not yours. A fixed send time optimizes for one zone and misfires everywhere else. Landing in someone's local morning instead of the middle of their night is the single biggest timing improvement you can make.",
    },
    {
      question: "How do I figure out a contact's time zone?",
      answer:
        "Use the most reliable signal you have: an explicit city or state field, then company headquarters location, then phone area code or country-code domain. Map it to a zone and tag the contact. Contacts with no usable signal go into a default fallback bucket scheduled for your primary market.",
    },
    {
      question: "Do I need a separate segment for every time zone?",
      answer:
        "No. A handful of broad regional buckets, such as Americas West, Americas East, Europe, and Asia-Pacific, captures almost all the benefit with far less complexity than one bucket per exact offset.",
    },
    {
      question: "What sequencer setting controls timezone sending?",
      answer:
        "The key setting interprets your sending window as recipient-local rather than account-local, often labeled \"send in recipient time zone.\" Combined with a timezone source field, it makes one logical window execute correctly across every zone.",
    },
    {
      question: "How does daylight saving time affect this?",
      answer:
        "Offsets shift twice a year, on different dates by region. Use a sequencer that tracks current local time per zone rather than a hardcoded offset, so send times do not drift an hour off after a DST change. Re-verify send times around clock-change dates.",
    },
  ],
  sources: [
    {
      title: "Lemlist: Best Time to Send Emails",
      url: "https://www.lemlist.com/blog/best-time-to-send-cold-emails",
      date: "2025",
    },
    {
      title: "Woodpecker: Best Time to Send Emails",
      url: "https://woodpecker.co/blog/best-time-to-send-emails/",
      date: "2025",
    },
    {
      title: "Mailshake: Best Time to Send Email",
      url: "https://mailshake.com/blog/best-time-to-send-email/",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "best-time-to-send-emails",
    "email-throttling",
    "follow-up-email-cadence",
    "email-ab-testing-guide",
  ],
};
