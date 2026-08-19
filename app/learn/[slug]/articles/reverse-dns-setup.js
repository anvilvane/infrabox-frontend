export const article = {
  slug: "reverse-dns-setup",
  title: "Reverse DNS (PTR) Setup for Email Servers (2026)",
  metaDescription:
    "How to set up reverse DNS (PTR) records for email servers. What a PTR record is, why it must match forward DNS and HELO, who controls it, and how to verify it.",
  headline: "How to Set Up Reverse DNS (PTR) for Email Servers",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: ["reverse DNS", "PTR record", "email server", "deliverability"],
  excerpt:
    "A PTR record maps a sending IP back to a hostname. Receivers check it before they accept your mail. This guide explains what it is, who controls it, how to set one, and how to confirm it matches forward DNS and HELO.",
  type: "how-to",
  sections: [
    {
      heading: "What a PTR Record Is and Why You Are Here",
      content:
        "If you run your own mail server and your messages keep getting deferred or rejected with a note about \"no PTR\" or \"reverse DNS does not resolve,\" you are in the right place. A PTR record is the piece of DNS that maps an IP address back to a hostname, and most receiving mail servers check it before they decide whether to accept your mail.\n\nForward DNS answers the question \"what IP does mail.example.com point to?\" Reverse DNS answers the opposite: \"what hostname does 203.0.113.25 belong to?\" Both questions need a consistent answer for a mail server to look trustworthy.\n\n| Lookup type | Question asked | Record type | Lives in |\n|-------------|----------------|-------------|----------|\n| Forward DNS | Hostname to IP | A / AAAA | Your domain zone |\n| Reverse DNS | IP to hostname | PTR | The IP owner's reverse zone |\n\nThe key point that trips people up: a PTR record does not live in your domain's DNS zone. It lives in a special reverse zone controlled by whoever owns the IP address block. That is usually your hosting provider or VPS host, not your registrar. We will cover who to ask and how, then how to confirm everything lines up.\n\nIf you use managed mailboxes instead of running your own server, this is handled for you. More on that at the end.",
    },
    {
      heading: "How Reverse DNS Actually Works",
      content:
        "Reverse DNS uses a special domain called `in-addr.arpa` for IPv4 and `ip6.arpa` for IPv6. The IP address is reversed and turned into a name. For example, the IP `203.0.113.25` becomes a PTR query at `25.113.0.203.in-addr.arpa`. The answer to that query is the hostname, such as `mail.example.com`.\n\nThis design comes straight from the original DNS specification. The [RFC 1035](https://www.rfc-editor.org/rfc/rfc1035) standard defines the PTR record type and the `in-addr.arpa` structure used for reverse mapping.\n\nThe reason this matters for email is that the host that owns the IP block controls the reverse zone. When a network like Cloudflare or a VPS provider assigns you an IP, they hold the authority to set the PTR. You set the forward A record yourself, but the PTR has to be set by them or through a panel they give you.\n\n| Element | Who controls it | Where it is set |\n|---------|-----------------|-----------------|\n| A record (hostname to IP) | You | Your domain DNS |\n| PTR record (IP to hostname) | IP owner / host | Provider reverse zone |\n| HELO / EHLO name | You | Mail server config |\n\nThe three need to agree. A receiving server can run all three checks in a few milliseconds, and a mismatch is a cheap, reliable signal that something is off.",
    },
    {
      heading: "Why PTR Must Match Forward DNS and HELO",
      content:
        "Receivers do not just check that a PTR exists. They check that it agrees with the other identities your server presents. There are two relationships that matter.\n\n**Forward-confirmed reverse DNS (FCrDNS).** The receiver takes your IP, looks up the PTR to get a hostname, then looks up the A record for that hostname. If the A record resolves back to the original IP, the pair is confirmed. If it does not, the PTR is considered unverified even though it technically exists. This round trip is the actual test, not the presence of a PTR alone.\n\n**HELO consistency.** When your server opens an SMTP conversation it announces itself with a HELO or EHLO hostname. [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321) requires this to be a fully qualified domain name that resolves. Many receivers expect the HELO name, the PTR hostname, and the forward A record to describe the same machine.\n\n| Check | Pass condition | Common failure |\n|-------|----------------|----------------|\n| PTR exists | IP has a PTR answer | Generic ISP default or none |\n| FCrDNS | PTR hostname A record points back to IP | A record missing or wrong IP |\n| HELO match | EHLO name resolves and matches PTR | HELO is bare hostname or default |\n\nA generic PTR such as `host-203-0-113-25.pool.example-isp.net` is a frequent red flag. It exists, but it screams residential or dynamic IP, and several large receivers treat that as a reason to defer or reject. The fix is a clean, dedicated hostname that matches your forward DNS.",
    },
    {
      heading: "Who Controls the PTR Record",
      content:
        "This is the single most common point of confusion, so it deserves its own section. You cannot add a PTR record at your domain registrar the way you add SPF or DKIM. The PTR lives in the reverse zone for the IP block, and that zone is delegated to whoever owns the IP.\n\nHere is who to talk to depending on your setup.\n\n| Setup | Who sets the PTR | How |\n|-------|------------------|-----|\n| VPS or dedicated server | Hosting provider | Control panel field or support ticket |\n| Cloud instance (major clouds) | Cloud provider | Console setting on the IP / instance |\n| Your own IP allocation | You | Ask your upstream to delegate the reverse zone |\n| Shared sending platform | The platform | Already set, you cannot change it |\n\nMost VPS and cloud hosts now expose a single field labeled \"reverse DNS\" or \"PTR\" next to the IP address in their dashboard. You type the hostname you want, save, and the provider writes the PTR into the reverse zone. If there is no field, open a support request and give them the exact hostname.\n\nBefore you ask, make sure the forward A record for that hostname already points to the IP. If you set the PTR to `mail.example.com` but `mail.example.com` does not resolve to the IP, FCrDNS will fail and the PTR does you no good.",
    },
    {
      heading: "Step by Step: Setting the PTR Record",
      content:
        "Follow these steps in order. The order matters because forward DNS must exist before the reverse check can confirm it.\n\n**Step 1: Pick a hostname.** Choose a dedicated name for the sending machine, for example `mail.example.com` or `smtp.example.com`. Avoid generic or shared names.\n\n**Step 2: Set the forward A record.** In your domain DNS, add an A record so the hostname resolves to your sending IP:\n- Host: `mail`\n- Type: `A`\n- Value: `203.0.113.25` (your sending IP)\n\nFor IPv6, add an AAAA record as well. If your server has both IPv4 and IPv6 and sends over both, each address needs its own PTR and matching forward record.\n\n**Step 3: Set the PTR with the IP owner.** In your host's control panel, find the reverse DNS or PTR field for the IP and enter the same hostname, `mail.example.com`. If there is no panel field, submit a ticket: \"Please set the PTR for 203.0.113.25 to mail.example.com.\"\n\n**Step 4: Set the HELO name.** Configure your mail server so its HELO / EHLO greeting uses the same hostname. In Postfix this is the `myhostname` directive. In other MTAs look for the SMTP banner or greeting hostname setting.\n\n**Step 5: Wait for propagation.** Reverse zones often carry longer TTLs than forward zones, so allow up to a few hours. Major cloud providers describe the reverse DNS field directly in their networking docs, such as [Cloudflare's guidance on PTR for email-sending IPs](https://developers.cloudflare.com/dns/manage-dns-records/how-to/email-records/).\n\nGetting all three records into a clean, matching state by hand for a single server is manageable. Doing it across dozens of sending identities is where teams move to managed infrastructure.",
    },
    {
      heading: "Verification Steps and a Checklist",
      content:
        "Once the records are set, confirm them before you send real mail. Run these checks from a machine that is not the mail server itself.\n\n**Check the PTR (reverse lookup):**\n```\ndig -x 203.0.113.25 +short\nnslookup 203.0.113.25\n```\nYou should see your hostname, for example `mail.example.com`.\n\n**Check the forward A record:**\n```\ndig mail.example.com A +short\n```\nThis should return the same IP, `203.0.113.25`. If the PTR hostname and this IP agree in both directions, FCrDNS passes.\n\n**Check the HELO name** by sending a test message and reading the received headers, or by inspecting your MTA's SMTP banner.\n\n| Check | Command or method | Expected result |\n|-------|-------------------|-----------------|\n| PTR resolves | `dig -x <ip> +short` | Your hostname |\n| Forward confirms | `dig <hostname> A +short` | Same IP |\n| HELO matches | Read SMTP banner / headers | Same hostname |\n| Not generic | Inspect PTR string | No `pool`, `dynamic`, `dhcp` |\n| IPv6 covered | `dig -x <ipv6> +short` | Hostname if you send over v6 |\n\nFree tools like MXToolbox reverse lookup and the [Google Workspace Toolbox](https://toolbox.googleapps.com/apps/dig/) let you confirm the same results from outside your network. Google's own [sender guidelines](https://support.google.com/mail/answer/81126) state that sending IPs need a valid PTR matching forward DNS, so treating this as a hard requirement is the safe stance.\n\nIf any row fails, fix that record before continuing. A half-configured PTR is worse than none because it can confuse the FCrDNS round trip.",
    },
    {
      heading: "Common PTR Mistakes",
      content:
        "These are the failures that come up most often when a server cannot get past reverse DNS checks.\n\n1. **Adding PTR at the registrar.** As covered above, the PTR does not live in your domain zone. Adding a \"PTR\" TXT or fake record at your registrar does nothing. It must be set by the IP owner.\n\n2. **Forward record missing.** The PTR points to a hostname that has no A record, or whose A record points to a different IP. FCrDNS then fails. Always set the forward record first.\n\n3. **Generic or default PTR.** Many hosts ship a default PTR like `static.203-0-113-25.clients.example-isp.net`. It resolves, but receivers treat it as low trust. Replace it with your own clean hostname.\n\n4. **HELO mismatch.** The server greets with `localhost` or an internal name that does not resolve. Set the HELO to the same FQDN as the PTR.\n\n5. **Forgetting IPv6.** If the server also sends over IPv6 but only the IPv4 PTR is set, mail sent over v6 fails the check. Set a PTR for every address you actually send from.\n\n6. **Expecting instant propagation.** Reverse zones can have long TTLs. Confirm with `dig` rather than assuming the change is live.\n\nWhy this matters in the bigger picture is covered in [why reverse DNS impacts deliverability](/learn/reverse-dns-deliverability), and reverse DNS sits alongside SPF, DKIM, and DMARC in the wider [email authentication picture](/learn/email-authentication-spf-dkim-dmarc-explained).",
    },
    {
      heading: "When Managed Mailboxes Handle This for You",
      content:
        "Everything above applies when you run your own mail server on your own IP. If you send through managed mailboxes, the PTR is already set on the platform's sending IPs and you cannot and should not try to change it. The platform owns those IPs, keeps the reverse DNS clean, and keeps it consistent with HELO and forward DNS.\n\nThat is the model Infrabox uses. Mailboxes run on real Google Workspace, Microsoft 365, and Azure infrastructure on US IPs, with reverse DNS handled at the infrastructure level. The records you do control, SPF, DKIM, DMARC, and MX, are configured automatically through Cloudflare in under 60 seconds when a mailbox is created, so you skip the manual round trips described in this guide. InfraGuard then watches DNS and runs blacklist checks every six hours.\n\n| Approach | PTR responsibility | Setup effort |\n|----------|--------------------|--------------|\n| Self-hosted mail server | You, via your IP host | Manual, per IP |\n| Managed mailboxes | Platform | None |\n\nThe practical takeaway: PTR setup is real work and a real requirement when you self-host, but it is not something you should be doing by hand at scale. Either set it carefully per server using the steps above, or use managed infrastructure where reverse DNS is part of the platform. Either way, confirm the FCrDNS round trip with `dig` before you send. For the broader record set, see the [DNS setup guide](/learn/dns-setup-guide) and the [email domain setup checklist](/learn/email-domain-setup-checklist).",
    },
  ],
  faqs: [
    {
      question: "Can I add a PTR record at my domain registrar?",
      answer:
        "No. A PTR record lives in the reverse DNS zone for the IP address, which is controlled by whoever owns the IP block, usually your hosting or cloud provider. Your registrar only controls your domain's forward zone. To set a PTR, use your host's reverse DNS field or open a support ticket.",
    },
    {
      question: "What is forward-confirmed reverse DNS (FCrDNS)?",
      answer:
        "FCrDNS is the check where a receiver looks up the PTR for your IP to get a hostname, then looks up the A record for that hostname to confirm it points back to the same IP. If both directions agree, the pair is confirmed. Many receivers require this, not just the presence of a PTR.",
    },
    {
      question: "Does my HELO name need to match the PTR?",
      answer:
        "It should. RFC 5321 requires the HELO/EHLO name to be a fully qualified domain name that resolves, and many receivers expect the HELO name, the PTR hostname, and the forward A record to describe the same machine. A mismatch or a default like localhost is a common reason mail is deferred.",
    },
    {
      question: "Do I need a PTR for IPv6 too?",
      answer:
        "Yes, if your server sends mail over IPv6. Each sending address, whether IPv4 or IPv6, needs its own PTR and a matching forward record. Setting only the IPv4 PTR while sending over IPv6 will fail the reverse DNS check on those messages.",
    },
    {
      question: "Do managed mailboxes require me to set a PTR?",
      answer:
        "No. With managed mailboxes such as those from Infrabox, the platform owns the sending IPs and keeps reverse DNS set and consistent. You only manage the records in your own domain zone, and even those (SPF, DKIM, DMARC, MX) are automated through Cloudflare.",
    },
  ],
  sources: [
    {
      title: "RFC 1035: Domain Names, Implementation and Specification",
      url: "https://www.rfc-editor.org/rfc/rfc1035",
      date: "2025",
    },
    {
      title: "RFC 5321: Simple Mail Transfer Protocol",
      url: "https://www.rfc-editor.org/rfc/rfc5321",
      date: "2025",
    },
    {
      title: "Cloudflare DNS: Email records and PTR guidance",
      url: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/email-records/",
      date: "2025",
    },
    {
      title: "Google: Email sender guidelines",
      url: "https://support.google.com/mail/answer/81126",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "reverse-dns-deliverability",
    "dns-setup-guide",
    "email-domain-setup-checklist",
    "email-authentication-spf-dkim-dmarc-explained",
  ],
};
