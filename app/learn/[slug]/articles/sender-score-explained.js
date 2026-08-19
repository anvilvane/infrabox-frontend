export const article = {
  slug: "sender-score-explained",
  title: "Sender Score Explained: The 0-100 Scale and Your Campaigns",
  metaDescription:
    "What Validity's Sender Score is, how the 0-100 scale and ranges work, what feeds it, how it maps to inbox placement, and how to improve it for email.",
  headline: "Sender Score Explained and How It Affects Your Campaigns",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "10 min read",
  tags: ["sender score", "validity", "ip reputation", "deliverability"],
  excerpt:
    "Sender Score is a 0-to-100 reputation rating for your sending IP. Here is what feeds it, how the ranges map to inbox placement, and the levers that actually move it.",
  type: "guide",
  sections: [
    {
      heading: "What Sender Score Is",
      content:
        "Sender Score is a reputation rating, from 0 to 100, assigned to a sending IP address by [Validity](https://senderscore.org), the company that runs the Sender Score and Certification programs. Think of it like a credit score for your mail server. It is calculated from how mailbox providers and spam-monitoring networks have reacted to mail from your IP over a rolling window of roughly 30 days.\n\nThe credit-score comparison is useful in more ways than one. Like a credit score, it is built from your history of behavior rather than your intentions, it moves slowly in both directions, and it is read by third parties to decide how much to trust you before they have any direct experience with you. A mailbox provider that has never seen your IP before can pull the Sender Score and get an instant read on whether to take a chance on your mail. That is the entire point of a portable, provider-neutral rating.\n\nA higher number means receivers have historically treated your mail as wanted. A lower number means they have seen complaints, bounces, spam-trap hits, or other negative signals. The score is relative: it is a percentile rank against other IPs, so a 90 broadly means your IP outperforms about 90 percent of the IPs Validity observes. Because it is a percentile, the score can move even if your own behavior is unchanged, simply because the population of senders around you got better or worse. In practice that effect is small, but it explains why two senders with similar habits can sit a few points apart.\n\nSender Score is not a setting you control directly and it is not the only reputation signal mailbox providers use. Gmail leans on its own internal reputation through Postmaster Tools, and Microsoft uses SNDS. Each large provider trusts its own first-party data more than any external rating, because they see the full picture of how their own users react to your mail. But Sender Score is a useful, provider-neutral proxy, and a low one is a reliable early warning that campaigns are about to suffer. It is the one number you can check for any IP, including ones you do not control, which makes it valuable for vetting shared infrastructure before you commit to it.",
    },
    {
      heading: "The 0-100 Scale and What Each Range Means",
      content:
        "The score is a single number, but the practical effect on deliverability clusters into ranges. The table below maps each band to what you can expect from receivers.\n\n| Sender Score | Reputation | What receivers do | Action needed |\n| --- | --- | --- | --- |\n| 90 to 100 | Excellent | Inbox placement, few filters | Maintain |\n| 80 to 89 | Good | Mostly inbox, occasional filtering | Watch trends |\n| 70 to 79 | Fair | Mixed inbox and spam | Tighten list hygiene |\n| 50 to 69 | Poor | Heavy filtering, frequent spam folder | Pause and diagnose |\n| Below 50 | Critical | Blocks and deferrals likely | Stop, rebuild reputation |\n\nFor email, treat 80 as the floor you want to stay above. Below that, you are in territory where small mistakes get punished quickly. Below 70, you are losing a meaningful share of sends to spam folders regardless of how good the copy is. Below 50, receivers begin rejecting or deferring outright, and the IP needs active recovery rather than tuning.\n\nThe trend line matters as much as the absolute number. A score sliding from 95 to 85 over a week is a signal to investigate now, before it crosses into the ranges where filtering starts. A score holding flat at 88 is far healthier than one that has fallen to 91 from a previous 99, even though the second number is higher, because direction predicts where you are heading. Treat the score like a stock chart: the slope tells you more than the current price.\n\nOne more nuance on the ranges. The bands are not evenly spaced in their consequences. The drop from 90 to 80 costs you relatively little in real placement, because both are healthy. The drop from 75 to 65 is where the damage accelerates sharply, because that is the zone where providers shift from occasional filtering to routine filtering. So a ten-point fall does not mean the same thing everywhere on the scale. The closer you are to the cliff, the more each point hurts, which is the strongest argument for keeping a comfortable buffer above 80 rather than letting the score drift down to it.",
    },
    {
      heading: "What Feeds Your Sender Score",
      content:
        "Sender Score is built from a set of weighted inputs that mailbox providers and monitoring networks report. No single factor sets the score, but a few carry outsized weight for cold senders.\n\n| Factor | Direction | Relative weight |\n| --- | --- | --- |\n| Spam complaint rate | Lower is better | High |\n| Spam-trap hits | Fewer is better | High |\n| Bounce rate | Lower is better | High |\n| Blacklist appearances | Fewer is better | High |\n| Sending volume consistency | Steady is better | Medium |\n| Unknown-user (invalid) rate | Lower is better | Medium |\n| Authentication (SPF, DKIM, DMARC) | Present is better | Medium |\n| Volume spikes | Smooth is better | Medium |\n\nComplaints and spam-trap hits are the fastest way to drop a score, because both are unambiguous signals to receivers that your mail is unwanted. Bounce rate and blacklist appearances follow close behind. Google and Yahoo now enforce a complaint-rate ceiling and require authenticated mail, detailed in the [Google and Yahoo sender requirements for 2026](/learn/google-yahoo-sender-requirements-2026); the same behaviors that violate those rules also drag your Sender Score down.\n\nVolume consistency is the input cold senders most often overlook. A sudden jump from 50 emails a day to 5,000 reads as suspicious even if every recipient is valid, which is why a gradual warmup matters. Filters cannot tell the difference between a legitimate sender who just bought a big list and a spammer who just hijacked an IP, so they treat the sudden spike the same way: with suspicion. The fix is not to send less, it is to grow the daily number on a smooth curve so the pattern looks like an established sender scaling naturally rather than an unknown one flooding the gates overnight.\n\nIt helps to group these inputs into two families. The first family is recipient reactions: complaints, opens, replies, and the absence of spam reports. These are about whether people want your mail. The second family is hygiene and identity: bounces, trap hits, blocklist status, authentication, and volume shape. These are about whether your sending looks legitimate and well kept. A strong Sender Score needs both families to be healthy. You can have spotless hygiene and still score poorly if recipients keep complaining, and you can have engaged recipients and still score poorly if your list is full of dead addresses and traps. The worked levers later in this guide map onto these two families directly.",
    },
    {
      heading: "How Sender Score Maps to Inbox Placement",
      content:
        "Sender Score and inbox placement are correlated but not identical. The score describes your IP's reputation; inbox placement is the outcome at a specific mailbox provider, which also weighs your domain reputation, content, and engagement.\n\nIn practice, a high Sender Score is necessary but not sufficient. You can hold a 95 and still land in spam if your sending domain is new, your links point to a flagged domain, or your engagement is near zero. The IP gets you to the door; the domain and content decide whether you are let in. This split is the reason a clean IP check sometimes coexists with poor placement, a relationship covered in [domain reputation vs IP reputation](/learn/domain-reputation-vs-ip-reputation).\n\nThe useful mental model: a falling Sender Score predicts falling inbox placement, but a stable high score does not guarantee good placement on its own. Use it as one of several gauges. Pair it with Google Postmaster Tools for Gmail-specific reputation and with seed-based [inbox placement testing](/learn/inbox-placement-testing-explained) to see where mail actually lands across providers. Reading them together tells you whether a placement problem lives in the IP, the domain, or the content.",
    },
    {
      heading: "How to Check Your Sender Score",
      content:
        "Sender Score is checked per IP, not per domain. You enter the IP address of your sending server at the Sender Score site and it returns the current rating along with a breakdown of the contributing metrics over the trailing period.\n\nIf you send through a shared infrastructure or a managed platform, the IP you check may be a pool address shared across many senders, so the score reflects the pool rather than you alone. On a dedicated IP, the score is yours and yours alone, which is the trade-off discussed in [dedicated IP vs shared IP](/learn/dedicated-ip-vs-shared-ip).\n\nFor a fuller view than a single number, combine three free sources: Sender Score for the IP-level reputation percentile, Google Postmaster Tools for Gmail's own reputation rating, and Microsoft SNDS for Outlook and Hotmail. Each sees a slice of your reputation that the others miss. The Infrabox free reputation check is a fast way to pull an IP's standing without setting up dashboards, useful when you just need a quick read before launching a campaign.\n\nA practical reading habit: check the score on a fixed weekly cadence rather than obsessively, because the rolling 30-day window means it cannot meaningfully change hour to hour. Log the number each week so you have a trend rather than a snapshot. The single most useful thing the dashboard tells you is not the headline number but the contributing-metric breakdown underneath it, which points at the specific input that is dragging you down. If complaints are flat and bounces are climbing, you have a list-quality problem, not a content problem, and the breakdown tells you that before you waste time rewriting copy.",
    },
    {
      heading: "Shared, Dedicated, and Pooled IPs: Whose Score Is It?",
      content:
        "Because Sender Score is per IP, the question of which IP your mail actually leaves from decides whose reputation you are reading. This is where many cold senders misread their own number.\n\n| Sending setup | Whose behavior sets the score | What the score tells you |\n| --- | --- | --- |\n| Dedicated IP | Yours alone | A clean, direct read on your sending |\n| Small shared pool | You plus a few others | Mostly yours, some neighbor risk |\n| Large managed pool | Hundreds of senders | The pool's health, not yours specifically |\n| Provider mailboxes (Google, Microsoft) | The provider's vast ranges | Trusted baseline you inherit |\n\nOn a dedicated IP the score is a pure reflection of your own habits, which is the appeal and the burden discussed in [dedicated IP vs shared IP](/learn/dedicated-ip-vs-shared-ip): clean reads, but every mistake lands on you and nowhere to hide. On a shared pool the score blends your behavior with your neighbors', so a bad actor in the pool can drag your placement down through no fault of yours, and conversely a well-run pool can carry a new sender on its established reputation while their own domains warm up.\n\nThe key implication for email is this: when you send through real Google Workspace or Microsoft 365 mailboxes, you are sending from the provider's own enormous, carefully maintained IP ranges. Those ranges carry a trusted baseline reputation that no individual could build alone, which is why provider-backed sending sidesteps the cold-start problem a fresh dedicated IP faces. The Sender Score you would read for such an IP reflects the provider's stewardship of the range, not your campaign in isolation, so you lean on domain reputation and engagement signals as the more telling per-sender measures.",
    },
    {
      heading: "How to Improve a Low Sender Score",
      content:
        "A low Sender Score recovers by changing the behavior that produced the negative signals, then giving receivers a sustained run of good sending to overwrite the old data. There is no shortcut and no reset button; the rolling window simply ages out the bad data as new good data arrives.\n\n| Lever | Effect on score | Time to show |\n| --- | --- | --- |\n| Cut bounce rate below 3 percent | High | 1 to 2 weeks |\n| Drop complaint rate below 0.3 percent | High | 1 to 2 weeks |\n| Remove spam traps (verify lists) | High | 2 to 4 weeks |\n| Resolve any blacklist listings | High | Days to weeks |\n| Re-warm the IP gradually | Medium | 2 to 4 weeks |\n| Keep volume steady and authenticated | Medium | Ongoing |\n\nStart by verifying your list to strip invalid addresses and likely traps, since those two inputs do the most damage. Then hold volume steady and ramp slowly rather than blasting, because a smooth, consistent pattern is itself a positive signal. Confirm SPF, DKIM, and DMARC pass on every sending domain.\n\nIf you are starting from a damaged score, a clean warmup is the fastest reliable path back. Infrabox runs isolated warmup on real Google Workspace and Microsoft 365 mailboxes on US IPs, and InfraGuard checks blacklists every six hours so a listing does not silently undo your recovery. For the full ramp process, see the [email warmup guide](/learn/email-warmup-guide), and for ongoing tracking see [how to monitor IP reputation](/learn/monitor-ip-reputation).\n\nA realistic timeline helps set expectations. The list-quality fixes, cutting bounces and removing traps, show up first because they stop new negative data from arriving. The complaint-rate fix follows once recipients stop reporting you. The slowest part is simply waiting for the 30-day window to age out the old bad data, which means a genuinely damaged score takes the better part of a month to fully recover even if you do everything right on day one. There is no way to buy your way past that window. Anyone promising an instant reputation reset is selling something that does not exist.",
    },
    {
      heading: "Common Mistakes That Keep a Score Low",
      content:
        "Most senders who cannot lift a stuck Sender Score are repeating one of a handful of mistakes. Recognizing them is half the fix.\n\nThe first is treating symptoms instead of causes. Rewriting subject lines and swapping words does nothing for a score driven by bounces and complaints. The score reflects behavior and list quality, so the fix lives there, not in the copy.\n\nThe second is impatience. Senders see no movement after three days, conclude the effort failed, and either give up or, worse, start sending harder to force engagement. The rolling window guarantees there will be little movement early; the payoff comes in weeks, not days. Pushing volume to speed things up usually adds fresh negative signals and resets the clock.\n\nThe third is fixing one input while ignoring another. A sender cleans the list to kill bounces but keeps mailing an unengaged audience, so complaints stay high and the score stalls. Both families of inputs, hygiene and engagement, have to be healthy together, as covered earlier.\n\nThe fourth is monitoring the wrong IP. On shared infrastructure, the number you check may be a pool address that your own behavior barely influences, so you chase a metric you cannot move. Confirm which IP your mail actually leaves from before you invest effort in shifting its score. For the broader reputation picture these mistakes feed into, see [domain reputation vs IP reputation](/learn/domain-reputation-vs-ip-reputation) and [how to monitor IP reputation](/learn/monitor-ip-reputation).",
    },
  ],
  faqs: [
    {
      question: "What is a good Sender Score?",
      answer:
        "Aim for 80 or above. 90 to 100 is excellent. Below 70 you start losing mail to spam folders, and below 50 receivers begin blocking or deferring, so the IP needs active recovery.",
    },
    {
      question: "Is Sender Score the same as inbox placement?",
      answer:
        "No. Sender Score rates your sending IP's reputation, while inbox placement is the outcome at a specific provider, which also depends on domain reputation, content, and engagement. A high score helps but does not guarantee the inbox.",
    },
    {
      question: "How is Sender Score calculated?",
      answer:
        "Validity calculates it from weighted inputs over roughly 30 days, including complaint rate, spam-trap hits, bounce rate, blacklist appearances, volume consistency, and authentication. It is expressed as a percentile rank against other IPs.",
    },
    {
      question: "How do I raise a low Sender Score?",
      answer:
        "Fix the behavior behind the negative signals: verify lists to cut bounces and traps, hold complaints under 0.3 percent, clear any blacklist listings, authenticate your mail, and send steady volume. Improvement shows over one to four weeks.",
    },
    {
      question: "Why is my Sender Score the same as other senders?",
      answer:
        "You are almost certainly checking a shared pool IP, where the score blends your behavior with that of every other sender on the same address. On a dedicated IP the score is yours alone. When you send through provider mailboxes like Google Workspace or Microsoft 365, you inherit the trusted baseline of the provider's large IP ranges, so domain reputation and engagement become the more telling per-sender measures.",
    },
    {
      question: "How long does it take to fix a damaged Sender Score?",
      answer:
        "Plan on the better part of a month. List-quality fixes stop new negative data immediately, but the score is built on a rolling 30-day window, so the old bad data has to age out before the number fully recovers. There is no instant reset, and pushing volume to speed things up usually adds fresh negative signals and resets the clock.",
    },
  ],
  sources: [
    { title: "Validity Sender Score", url: "https://senderscore.org", date: "2025" },
    { title: "Google Postmaster Tools", url: "https://postmaster.google.com", date: "2025" },
    { title: "Microsoft SNDS", url: "https://sendersupport.olc.protection.outlook.com/snds/", date: "2025" },
    { title: "Spamhaus", url: "https://www.spamhaus.org", date: "2025" },
  ],
  relatedSlugs: [
    "domain-reputation-vs-ip-reputation",
    "monitor-ip-reputation",
    "inbox-placement-testing-explained",
    "email-warmup-guide",
  ],
};
