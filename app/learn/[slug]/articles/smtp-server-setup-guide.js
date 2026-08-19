export const article = {
  slug: "smtp-server-setup-guide",
  title: "SMTP Server Setup Guide for Email (2026)",
  metaDescription:
    "Configure an SMTP server or relay for email: authentication, ports, TLS, and the DNS records you need. Plus why managed mailboxes beat raw SMTP for inboxing.",
  headline: "SMTP Server Setup Guide for Email",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "12 min read",
  tags: [
    "smtp server",
    "smtp setup",
    "email",
    "email authentication",
    "tls",
    "deliverability",
  ],
  excerpt:
    "A practical walkthrough for configuring an SMTP server or relay to send email: ports, TLS, auth, DNS records, and connecting a sequencer. Plus the deliverability trade-offs versus managed mailboxes.",
  type: "guide",
  sections: [
    {
      heading: "What You Need to Send Email Over SMTP",
      content:
        "To send email over SMTP you need four things working together: an authenticated SMTP endpoint (a mail server or a relay service), a sending domain with correct DNS records, encryption on the connection (TLS), and a client or sequencer that submits messages using the right port and credentials.\n\nThe minimum checklist looks like this:\n\n| Requirement | What It Is | Typical Value |\n|-------------|-----------|---------------|\n| **SMTP host** | The server or relay that accepts your mail | smtp.gmail.com, smtp.office365.com, or a relay |\n| **Submission port** | The port your client connects to | **587** (STARTTLS) or **465** (implicit TLS) |\n| **Authentication** | Username and password or token | App password / OAuth / API key |\n| **Encryption** | TLS to protect credentials and content | STARTTLS on 587, SSL/TLS on 465 |\n| **Sending domain** | The From domain you control | yourdomain.com |\n| **DNS records** | SPF, DKIM, DMARC, and MX | Published in your DNS zone |\n\nGet any one of these wrong and mail either fails to send or lands in spam. The rest of this guide walks through each piece. If you are unsure which port to use, our [SMTP ports explained](/learn/smtp-ports-explained) guide breaks down 25, 465, 587, and 2525 in detail.",
    },
    {
      heading: "SMTP Server vs SMTP Relay: Pick the Right Model",
      content:
        "There are two ways to send. Running your own mail server (Postfix, Exim, or a self-hosted stack) gives you full control but puts you in charge of IP reputation, blacklist hygiene, and patching. Using an SMTP relay (the submission endpoint of Google Workspace, Microsoft 365, or a transactional provider) offloads the infrastructure but limits volume and configuration.\n\n| Factor | Self-hosted SMTP server | Managed relay / provider |\n|--------|------------------------|--------------------------|\n| **Setup time** | Days (OS, MTA, certs, DNS, rDNS) | Minutes |\n| **IP reputation** | You own it from zero | Shared or provider-managed |\n| **Blacklist risk** | High if misconfigured | Lower, provider monitors |\n| **Deliverability for cold** | Hard to achieve | Better with real mailboxes |\n| **Cost** | VPS plus your time | Per-mailbox or per-message |\n| **Scaling** | Manual | Add mailboxes or upgrade plan |\n\nThe deeper trade-offs of running your own box are covered in [self-hosted email server](/learn/self-hosted-email-server) and the distinction between the two endpoints in [SMTP relay vs SMTP server](/learn/smtp-relay-vs-smtp-server). For cold outreach specifically, raw SMTP from a fresh IP almost always underperforms real provider mailboxes, which is why most senders use Google Workspace or Microsoft 365.",
    },
    {
      heading: "Step 1: Choose Ports and Encryption",
      content:
        "Use the submission ports, not port 25. Port 25 is for server-to-server relay and is blocked outbound by most residential and cloud providers to limit spam. For a client or sequencer submitting authenticated mail, the choices are:\n\n- **Port 587 with STARTTLS** is the modern default per [RFC 6409](https://datatracker.ietf.org/doc/html/rfc6409). The connection starts in plaintext, then upgrades to TLS before credentials are sent.\n- **Port 465 with implicit TLS** opens an encrypted connection immediately. It was deprecated, then re-registered for submission in [RFC 8314](https://datatracker.ietf.org/doc/html/rfc8314), which now recommends implicit TLS.\n- **Port 2525** is an unofficial fallback some relays offer when 587 is blocked by a network.\n\nNever submit authenticated mail without TLS. Sending credentials over plaintext exposes them on the wire. If a provider offers only port 25 for submission, that is a red flag.",
    },
    {
      heading: "Step 2: Configure Authentication",
      content:
        "Modern providers no longer accept a plain account password over SMTP. You will use one of three mechanisms:\n\n**App passwords.** Google Workspace and Microsoft 365 let you generate a single-purpose password for SMTP clients when basic auth is still permitted. This is the simplest path for a sequencer that supports SMTP credentials.\n\n**OAuth 2.0 (XOAUTH2).** The preferred and increasingly required method. The client exchanges a token rather than a static password. Microsoft has been retiring basic authentication for Exchange Online, so OAuth is the durable choice. See [Microsoft 365 SMTP settings](/learn/microsoft-365-smtp-settings) for the exact host, port, and auth flow.\n\n**API keys.** Transactional relays authenticate with an API key over SMTP AUTH or via an HTTP API.\n\nA failed login returns a `535 5.7.8` authentication error. If you see that, regenerate the app password, confirm the username is the full email address, and verify the account is licensed for SMTP. The full catalog of failures is in [common SMTP errors and fixes](/learn/smtp-errors-and-fixes).",
    },
    {
      heading: "Step 3: Publish the DNS Records",
      content:
        "Authentication records are what stand between your mail and the spam folder. Google and Yahoo require SPF, DKIM, and a DMARC policy for bulk senders, and treat missing records as a strong negative signal. The four records you need:\n\n| Record | Purpose | Where to Configure |\n|--------|---------|--------------------|\n| **SPF** | Lists IPs/hosts allowed to send for your domain | TXT record, one per domain |\n| **DKIM** | Cryptographically signs each message | TXT record with provider's public key |\n| **DMARC** | Tells receivers what to do on auth failure | _dmarc TXT record |\n| **MX** | Routes inbound mail to your mailbox host | MX records at the domain apex |\n\nStart with the [SPF record setup](/learn/spf-record-setup-email), then [DKIM setup](/learn/dkim-setup-email), then [DMARC setup](/learn/dmarc-setup-email). If you want the full picture of how the three interlock, read [email authentication SPF DKIM DMARC explained](/learn/email-authentication-spf-dkim-dmarc-explained). Stay under the SPF 10-lookup limit, and start DMARC at `p=none` so you can monitor reports before enforcing.\n\nFor server-to-server delivery you also want a PTR (reverse DNS) record matching your sending hostname. Many receivers reject mail from IPs without valid forward-confirmed reverse DNS.",
    },
    {
      heading: "Step 4: Connect Your Sequencer",
      content:
        "Once the server, ports, auth, and DNS are in place, connect your sending tool. Most sequencers accept either native provider integration (recommended) or raw SMTP credentials.\n\n**Native integration** uses OAuth to connect Google Workspace or Microsoft 365 directly. This is more stable and respects provider sending limits cleanly.\n\n**SMTP connection** requires you to enter host, port, username, and password. A typical Google Workspace configuration:\n\n```\nHost: smtp.gmail.com\nPort: 587\nEncryption: STARTTLS\nUsername: you@yourdomain.com\nPassword: <app password>\n```\n\nAfter connecting, send a test message to a seed inbox and check the headers with Gmail's Show Original view. Confirm SPF, DKIM, and DMARC all show **PASS**. Respect the per-mailbox daily caps documented in [email sending limits for Google and Microsoft](/learn/email-sending-limits-google-microsoft); exceeding them triggers rate-limit errors and reputation damage.",
    },
    {
      heading: "Step 5: Warm Up Before Volume",
      content:
        "A new domain and a new sending identity have no reputation. Sending a few hundred emails on day one from a fresh setup is the fastest way to the spam folder or an outright block. Ramp gradually.\n\n| Week | Approx. daily volume per mailbox | Focus |\n|------|----------------------------------|-------|\n| 1 | 5 to 10 | Warmup network only |\n| 2 | 10 to 20 | Warmup plus a few real sends |\n| 3 | 20 to 30 | Increase real sends |\n| 4+ | 30 to 50 | Steady-state cold volume |\n\nThese figures are guidance, not guarantees; engagement signals matter more than raw numbers. The full process is in the [email warmup guide](/learn/email-warmup-guide) and [domain warmup best practices](/learn/domain-warmup-best-practices). Monitor reputation throughout with [Google Postmaster Tools](/learn/google-postmaster-tools-guide).",
    },
    {
      heading: "Why Managed Mailboxes Often Beat Raw SMTP for Email",
      content:
        "Raw SMTP from a self-built server can work for transactional mail, but cold outreach is judged on inbox placement, and that depends on reputation you cannot buy overnight. A fresh IP, an unsigned hostname, or a single misconfigured record can sink an entire campaign.\n\nManaged providers solve the reputation and configuration problem. [Infrabox](/learn/what-is-infrabox) provisions real Google Workspace, Microsoft 365, and Azure mailboxes on US IPs, and configures SPF, DKIM, DMARC, and MX automatically through Cloudflare in under 60 seconds. Its InfraGuard monitoring runs blacklist checks every six hours, watches your DNS, and auto-pauses sending if something breaks, which removes the most common cause of email failure: silent misconfiguration. It connects to 24-plus sequencers natively, so you skip manual SMTP credential entry entirely.\n\nThe trade-off is control versus reliability. If you need fine-grained server control, self-host. If you need email to land, real mailboxes with managed DNS win. Pricing and slot counts are in [Infrabox pricing](/learn/infrabox-pricing).",
    },
    {
      heading: "Troubleshooting Checklist",
      content:
        "When mail fails to send or lands in spam, work through this list in order:\n\n1. **Connection refused or timeout.** Port 25 is blocked, or you are using the wrong port. Switch to 587 or 465.\n2. **535 authentication failed.** Wrong username, expired app password, or basic auth disabled. Regenerate credentials or move to OAuth.\n3. **TLS handshake errors.** Mismatched encryption mode for the port (implicit TLS on 587, or STARTTLS on 465). Match the mode to the port.\n4. **550 relay denied.** The server will not relay for your domain or recipient. Authenticate, or confirm the relay allows your domain.\n5. **Mail sends but goes to spam.** Check SPF, DKIM, and DMARC pass; check the domain and IP against blacklists with [check domain blacklisted](/learn/check-domain-blacklisted); and review [why emails go to spam](/learn/why-emails-go-to-spam).\n6. **Sudden delivery drop.** Run a [blacklist removal](/learn/email-blacklist-removal-guide) check and review reputation in Postmaster Tools.\n\nEach numeric reply maps to a defined meaning, explained in [SMTP error codes explained](/learn/smtp-error-codes-explained).",
    },
  ],
  faqs: [
    {
      question: "Which SMTP port should I use for email?",
      answer:
        "Use port 587 with STARTTLS as the default, or port 465 with implicit TLS. Avoid port 25 for submission, since most networks block it outbound and it is meant for server-to-server relay, not authenticated client sending.",
    },
    {
      question: "Do I need my own SMTP server to send email?",
      answer:
        "No. Most senders use the SMTP relay of a provider like Google Workspace or Microsoft 365, or managed mailboxes. Running your own server gives full control but requires you to manage IP reputation, reverse DNS, blacklists, and patching yourself.",
    },
    {
      question: "What DNS records does an SMTP setup require?",
      answer:
        "At minimum SPF, DKIM, and DMARC for authentication, plus MX records to receive replies. A PTR (reverse DNS) record is also expected for self-hosted servers. Missing records are a primary reason email lands in spam.",
    },
    {
      question: "Why does my SMTP login keep failing with a 535 error?",
      answer:
        "A 535 5.7.8 error means authentication failed. The usual causes are a wrong username (use the full email address), an expired or missing app password, or basic auth being disabled in favor of OAuth. Regenerate credentials or switch to OAuth.",
    },
    {
      question: "Can I send email at scale from a single SMTP server?",
      answer:
        "Volume is limited by provider sending caps and by your IP and domain reputation. Sending too fast triggers rate-limit errors and reputation damage. Warm up gradually and respect per-mailbox daily limits before scaling.",
    },
  ],
  sources: [
    { title: "RFC 6409 - Message Submission for Mail", url: "https://datatracker.ietf.org/doc/html/rfc6409", date: "2025" },
    { title: "RFC 8314 - TLS for Email Submission and Access", url: "https://datatracker.ietf.org/doc/html/rfc8314", date: "2025" },
    { title: "RFC 5321 - Simple Mail Transfer Protocol", url: "https://datatracker.ietf.org/doc/html/rfc5321", date: "2025" },
    { title: "Google Workspace - Send email from a printer, scanner, or app (SMTP)", url: "https://support.google.com/a/answer/176600", date: "2025" },
    { title: "Microsoft - How to set up a multifunction device to send email using Microsoft 365", url: "https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365", date: "2025" },
    { title: "Google Email Sender Guidelines", url: "https://support.google.com/mail/answer/81126", date: "2025" },
  ],
  relatedSlugs: [
    "smtp-ports-explained",
    "smtp-relay-vs-smtp-server",
    "self-hosted-email-server",
    "microsoft-365-smtp-settings",
    "spf-record-setup-email",
  ],
};
