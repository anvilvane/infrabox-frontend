export const article = {
  slug: "custom-tracking-domain",
  title: "Custom Tracking Domain: What It Is and How to Set It Up (2026)",
  metaDescription:
    "What a custom tracking domain is, why shared tracking domains hurt deliverability, and how to set one up with a CNAME. Includes verification steps and a sequencer specifics table.",
  headline: "Custom Tracking Domain: What It Is and How to Set It Up",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "10 min read",
  tags: ["custom tracking domain", "cname", "open tracking", "email", "deliverability"],
  excerpt:
    "Open and click tracking rewrite your links through a tracking domain. If that domain is shared with thousands of other senders, its reputation is not yours. A branded one fixes that.",
  type: "how-to",
  sections: [
    {
      heading: "What a Custom Tracking Domain Is",
      content:
        "When an email sequencer tracks opens and clicks, it does not link straight to your real destination. It rewrites every link to route through a **tracking domain** first, so the click registers before the visitor is redirected onward. Open tracking works the same way: a tiny invisible image is loaded from the tracking domain, and that load is logged as an open.\n\nA **custom tracking domain** (also called a branded tracking domain) is a subdomain you own, such as `track.yourdomain.com`, that you point at your sequencer's tracking infrastructure with a CNAME record. Instead of links reading like `app.sequencer.io/abc123`, they read like `track.yourdomain.com/abc123`. The redirect still happens on the sequencer's servers, but the visible hostname is yours and matches your sending domain.\n\nThis is a small configuration change with an outsized effect on deliverability, because the tracking hostname is one of the things spam filters inspect inside the message body. The reasoning for why it matters is in the next section, and the setup is a single DNS record.",
    },
    {
      heading: "Why Shared Tracking Domains Hurt Deliverability",
      content:
        "Most sequencers ship with a **shared default tracking domain** used by every customer who has not configured their own. That domain has a reputation, and it is the aggregate reputation of thousands of unrelated senders, some of whom are spamming. When your message routes its links through that shared host, your mail inherits a reputation you do not control.\n\nThere are three concrete problems with shared tracking domains:\n\n- **Borrowed bad reputation.** If other senders on the same shared domain get it blocklisted, your links now point at a flagged host, and filters notice.\n- **Domain mismatch.** Your message claims to be from `yourdomain.com` but its links point at `sequencer.io`. That misalignment between the From domain and the link domains is a signal filters weigh against you.\n- **Pattern recognition.** Filters can recognize a widely shared tracking host as \"bulk sequencer traffic\" and treat it accordingly, regardless of your own behavior.\n\nA branded tracking domain solves all three. The reputation is yours alone, the links align with your sending domain, and there is no shared fingerprint. This is part of the broader trust picture covered in [why emails go to spam](/learn/why-emails-go-to-spam), where domain alignment is a recurring theme.",
    },
    {
      heading: "How Sequencers Use the CNAME",
      content:
        "The mechanism is a **CNAME record**, which is a DNS alias. You create a subdomain on a domain you control and point it, via CNAME, at a hostname the sequencer provides. From then on, the sequencer rewrites links and the open-tracking pixel to use your subdomain, and the DNS alias quietly resolves those requests to the sequencer's tracking servers.\n\nNothing about the tracking logic changes. The redirect, the click logging, and the open pixel all still run on the sequencer's infrastructure. The only difference is the hostname the recipient and the spam filter see. Because it is a CNAME rather than content you host, there is no server to maintain and no certificate for you to manage; the sequencer terminates TLS on its side for the aliased host.\n\nA worked example: you want `track.yourdomain.com` as your tracking domain. Your sequencer tells you to point it at `custom.sequencer.io`. You add one DNS record:\n\n```\nType:  CNAME\nHost:  track\nValue: custom.sequencer.io\nTTL:   3600 (or Auto)\n```\n\nThat is the entire mechanism. The subdomain choice (`track`, `email`, `go`, `link`) is cosmetic; what matters is that it is a subdomain of a domain you own and that aligns with your sending identity.",
    },
    {
      heading: "Step-by-Step Setup",
      content:
        "The process is the same across nearly every sequencer, with only the target hostname differing:\n\n| Step | Action |\n|------|--------|\n| **1** | In your sequencer settings, find the tracking domain or custom domain section and note the target hostname it gives you |\n| **2** | Choose a subdomain on a domain you own, for example `track.yourdomain.com` |\n| **3** | At your DNS provider, add a **CNAME** record: host `track`, value the sequencer's hostname |\n| **4** | Save and wait for DNS propagation, typically a few minutes to a few hours |\n| **5** | Return to the sequencer and click **Verify** so it can confirm the CNAME resolves |\n| **6** | Send a test email to yourself and confirm the links now use your branded domain |\n\nA few practical notes. Use a subdomain dedicated to tracking rather than your root domain, so it does not collide with web or mail records. Keep the tracking subdomain on the *same* root domain as your sending address for alignment. And if you run many sending domains, each typically gets its own tracking subdomain on its own root, which keeps reputations cleanly separated. The DNS mechanics here are the same ones covered in the [DNS setup guide](/learn/dns-setup-guide) if you need a refresher on adding records.",
    },
    {
      heading: "Verifying It Works",
      content:
        "Two checks confirm a correct setup, one in DNS and one in the message itself.\n\n**Confirm the CNAME resolves.** Use a DNS lookup tool or the command line to check that your tracking subdomain points where it should:\n\n```\nnslookup track.yourdomain.com\n```\n\nThe answer should show your subdomain as an alias for the sequencer's hostname. If it returns nothing or the wrong target, the record has not propagated or has a typo.\n\n**Confirm the links are rewritten.** Send a tracked test email to yourself, then inspect the message. Hover over any link and confirm it begins with `track.yourdomain.com` rather than the sequencer's default host. View the raw HTML and confirm the open-tracking pixel also loads from your subdomain.\n\nWhile verifying, check the TLS on the tracking host too. Open the tracking link in a browser and confirm a valid padlock with no certificate warning, because a tracking link that throws a security warning undoes the trust benefit. The relationship between link hostnames and transport trust is covered in [why SSL matters for email deliverability](/learn/ssl-email-deliverability). If a link looks broken, the [DMARC setup for email](/learn/dmarc-setup-email) guide also helps confirm your wider domain alignment is intact.",
    },
    {
      heading: "Sequencer Specifics",
      content:
        "Every sequencer exposes the custom tracking domain setting in a slightly different place, but the CNAME approach is universal. Here is how the common ones frame it:\n\n| Sequencer | Where to set it | Record type |\n|-----------|----------------|-------------|\n| **Instantly** | Settings, Tracking Domain | CNAME to provided host |\n| **Smartlead** | Email account settings, Custom Tracking Domain | CNAME to provided host |\n| **Lemlist** | Settings, Custom Tracking Domain | CNAME to provided host |\n| **Reply.io** | Settings, Tracking, Custom Domain | CNAME to provided host |\n| **Woodpecker** | Settings, Deliverability, Custom Tracking | CNAME to provided host |\n| **Salesforge** | Mailbox settings, Tracking Domain | CNAME to provided host |\n\nThe exact target hostname always comes from the sequencer itself, so copy it from their settings rather than guessing. If you run mailboxes across several of these tools, the [email sequencer integration guide](/learn/email-sequencer-integration-guide) covers connecting them consistently.\n\nThis is also where managed infrastructure reduces the busywork. **Infrabox** provisions real Google Workspace and Microsoft 365 mailboxes with SPF, DKIM, DMARC, and MX set up automatically through Cloudflare in under sixty seconds, and connects to 24+ sequencers, so the sending identity your branded tracking domain aligns with is already clean and consistent before you ever add the CNAME. With the mailbox side handled, the one tracking record is the last small step to a fully branded, reputation-isolated setup.",
    },
    {
      heading: "Common Setup Mistakes and How to Fix Them",
      content:
        "Most custom tracking domain problems trace back to a handful of small errors in the DNS record or the subdomain choice. Knowing them in advance saves an afternoon of guesswork.\n\n| Symptom | Likely cause | Fix |\n|---------|-------------|-----|\n| Verify button keeps failing | Record not propagated yet | Wait 15 to 60 minutes, recheck with an external DNS lookup |\n| Verify fails after hours | Typo in host or target value | Re-copy the exact hostname from the sequencer, remove trailing dots |\n| Browser shows a certificate warning | TLS not yet issued for the alias | Wait for the sequencer to provision the cert, usually automatic within an hour |\n| Links still show the default host | Tracking domain not saved or assigned | Confirm the domain is selected on the specific campaign or mailbox |\n| CNAME conflicts with existing record | A record already exists on that host | Use a fresh subdomain that has no other records |\n\nThe single most frequent mistake is putting the CNAME on a host that already carries an A record or MX record. DNS does not allow a CNAME to coexist with other record types on the same name, so a tracking subdomain must be a clean, dedicated label such as `track`, `link`, or `go`. A second common error is copying the target hostname with a trailing dot or an extra space, which some providers accept silently and then fail to resolve.\n\nIf you proxy DNS through a service like Cloudflare, set the tracking CNAME to **DNS only** rather than proxied. A proxied record routes traffic through Cloudflare's edge, which breaks the redirect the sequencer expects to terminate on its own servers. Toggle the orange cloud to grey for that one record. The general record mechanics are the same ones in the [DNS setup guide](/learn/dns-setup-guide).",
    },
    {
      heading: "Tracking Domains and the Wider Deliverability Picture",
      content:
        "A branded tracking domain is one piece of a larger alignment story, not a standalone fix. It matters because filters read the whole message as a set of signals that should agree with each other. When the From address, the authentication records, the links, and the open pixel all point at the same root domain, the message looks like what it claims to be. When they disagree, each mismatch is a small mark against you.\n\nThink of it as four layers that should line up:\n\n- **Authentication.** SPF, DKIM, and DMARC prove the message is genuinely from your domain. See [DMARC setup for email](/learn/dmarc-setup-email).\n- **From identity.** The visible sender address sits on the same root domain as everything else.\n- **Link hostnames.** Your tracking domain keeps click and open links on that same root.\n- **Transport.** Valid TLS on the tracking host so links resolve cleanly with no warning, covered in [SSL and email deliverability](/learn/ssl-email-deliverability).\n\nA practical consequence: turning off open and click tracking entirely is sometimes the right call for a high-risk send. Open tracking in particular relies on a remote image, and some privacy-focused clients block or pre-load those images, which makes open data noisy and adds one more remote resource to the message. If you only need click data, many teams track clicks and disable the open pixel. If you do track, a branded domain is the version that does the least damage to trust. None of this replaces the fundamentals in [why emails go to spam](/learn/why-emails-go-to-spam); it sits on top of them as a refinement.",
    },
  ],
  faqs: [
    {
      question: "What is a custom tracking domain?",
      answer:
        "A subdomain you own, such as track.yourdomain.com, that you point at your sequencer's tracking servers with a CNAME. Your open and click tracking links then use your branded hostname instead of the sequencer's shared default.",
    },
    {
      question: "Why not just use the sequencer's default tracking domain?",
      answer:
        "The default is shared by many senders, so you inherit their reputation, including any blocklisting. It also creates a mismatch between your From domain and your link domains, which spam filters weigh against you. A branded domain keeps your reputation isolated and aligned.",
    },
    {
      question: "What DNS record does a custom tracking domain use?",
      answer:
        "A single CNAME record. You create a subdomain like track.yourdomain.com and point it via CNAME at the hostname your sequencer provides. The tracking logic still runs on the sequencer; only the visible hostname becomes yours.",
    },
    {
      question: "Do I need a separate tracking domain for each sending domain?",
      answer:
        "Ideally yes. Putting a tracking subdomain on the same root as each sending domain keeps the link hostname aligned with the From address and keeps reputations cleanly separated across your domains.",
    },
    {
      question: "Why does my Verify button keep failing after I added the CNAME?",
      answer:
        "Usually one of two things. Either the record has not propagated yet, in which case waiting 15 to 60 minutes and rechecking with an external DNS lookup resolves it, or there is a typo such as a trailing dot or extra space in the target value. If you proxy DNS through Cloudflare, set the record to DNS only rather than proxied, because a proxied record breaks the redirect.",
    },
    {
      question: "Should I use a custom tracking domain on my root domain or a subdomain?",
      answer:
        "Always a dedicated subdomain such as track.yourdomain.com. DNS does not allow a CNAME to coexist with other record types on the same name, so the root domain, which already carries A and MX records, cannot hold the tracking CNAME. A clean subdomain avoids the conflict and keeps the tracking host separate from your web and mail records.",
    },
  ],
  sources: [
    { title: "MDN - CNAME record", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CNAME", date: "2025" },
    { title: "Google - Email sender guidelines", url: "https://support.google.com/a/answer/81126", date: "2025" },
    { title: "Cloudflare - Manage DNS records (CNAME)", url: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/", date: "2025" },
    { title: "RFC 1034 - Domain names, CNAME restrictions", url: "https://www.rfc-editor.org/rfc/rfc1034", date: "1987" },
  ],
  relatedSlugs: [
    "domain-masking-vs-forwarding",
    "dns-setup-guide",
    "email-sequencer-integration-guide",
    "why-emails-go-to-spam",
  ],
};
