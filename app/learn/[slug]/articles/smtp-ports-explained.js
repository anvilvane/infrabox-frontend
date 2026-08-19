export const article = {
  slug: "smtp-ports-explained",
  title: "SMTP Ports Explained: 25, 465, 587, and 2525",
  metaDescription:
    "SMTP ports 25, 465, 587, and 2525 explained: what each is for, TLS vs SSL vs STARTTLS, ISP blocking of port 25, and which port to use for sending email.",
  headline: "SMTP Ports Explained: 25, 465, 587, and 2525",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "10 min read",
  tags: [
    "smtp ports",
    "port 587",
    "port 465",
    "port 25",
    "tls",
    "starttls",
  ],
  excerpt:
    "A clear breakdown of SMTP ports 25, 465, 587, and 2525, the encryption each uses, why ISPs block port 25, and which port to pick for authenticated email sending.",
  type: "guide",
  sections: [
    {
      heading: "The Short Answer: Which Port to Use",
      content:
        "For sending authenticated email from a client or sequencer, use **port 587 with STARTTLS**, or **port 465 with implicit TLS**. Use **port 2525** only as a fallback when a network blocks 587. Do **not** use **port 25** to submit mail; it is reserved for server-to-server relay and is blocked outbound by most providers.\n\n| Port | Role | Encryption | Use For |\n|------|------|-----------|---------|\n| **25** | Server-to-server relay (MTA to MTA) | Opportunistic STARTTLS | Receiving mail, never client submission |\n| **465** | Submission (implicit TLS) | TLS from connect | Authenticated sending, encrypted on connect |\n| **587** | Submission (STARTTLS) | STARTTLS upgrade | Default for authenticated sending |\n| **2525** | Unofficial submission fallback | STARTTLS (provider-defined) | When 587 is blocked by the network |\n\nThe rest of this guide explains why these distinctions exist and how the encryption modes differ. For the full sending setup, see the [SMTP server setup guide](/learn/smtp-server-setup-guide).",
    },
    {
      heading: "Port 25: The Original SMTP Port",
      content:
        "Port 25 is the original SMTP port defined in [RFC 5321](https://datatracker.ietf.org/doc/html/rfc5321). It handles **server-to-server relay**: when one mail server hands a message to the next mail server on the path to the recipient. It is the port your inbound mail arrives on, which is why your domain's MX records point receivers at a server listening on 25.\n\nPicture the path of a message you send to a recipient at another company. Your submission server accepts the message from your client, looks up the recipient domain's MX record, opens a connection to that destination server on port 25, and delivers the message. The first hop (client to your server) is submission. The second hop (your server to theirs) is relay over port 25. The two hops use different ports on purpose, because they have different trust models.\n\nWhat port 25 is **not** for is client submission. Because spammers historically abused open relays on port 25 to blast mail directly, the industry moved authenticated client submission to dedicated ports. An open relay on 25 will forward mail for anyone, which is exactly the behavior a spammer wants and exactly the behavior blocklists punish on sight.\n\nEncryption on port 25 is **opportunistic**: servers may negotiate STARTTLS if both support it, but will fall back to plaintext if not. That is acceptable for relay between cooperating servers, since the alternative is no delivery at all, but it is unsuitable for sending credentials. You never want to risk transmitting a username and password over a channel that might silently drop to plaintext.\n\n**Key point:** if your sequencer or app asks for port 25 to send authenticated mail, something is misconfigured. Use 587 or 465 instead. The one time you legitimately care about port 25 is when you run your own receiving server, because that is the port inbound mail will arrive on, and it must be reachable from the public internet for delivery to work.",
    },
    {
      heading: "Why ISPs and Cloud Providers Block Port 25",
      content:
        "Most residential ISPs and cloud platforms block outbound port 25 by default. The reason is spam control. A compromised home computer or a cheap VPS could otherwise send mail directly to any recipient server, bypassing authenticated submission entirely. A single infected machine on a fast connection can attempt millions of direct deliveries before anyone notices, so the cheapest defense is to refuse outbound 25 from networks that have no reason to run a mail server.\n\nProviders that block or restrict outbound port 25 include major cloud platforms (AWS, Google Cloud, and Azure throttle or block it by default) and nearly all consumer ISPs. Getting it unblocked usually requires a support request and proof of legitimate use, and is often denied. AWS, for example, asks you to fill out a request form and assign a reverse DNS record before it will consider lifting the throttle, and even then approval is not guaranteed for new accounts.\n\nThis is the single most common reason a self-hosted mail server cannot send: the host blocks outbound 25. People spend hours checking their configuration when the real problem is a firewall they do not control. A fast test is to try opening a connection to a known mail server on port 25 from the host in question; if the connection never completes while 587 to the same provider works, the network is the culprit. The practical consequences for self-hosting are covered in [self-hosted email server](/learn/self-hosted-email-server). For client submission you sidestep the issue entirely by using 587 or 465, which are not subject to the same blocks because they carry authenticated traffic that the provider can hold accountable.",
    },
    {
      heading: "Port 587: The Modern Default for Submission",
      content:
        "Port 587 is the designated **message submission** port, defined in [RFC 6409](https://datatracker.ietf.org/doc/html/rfc6409). It is the port a mail client uses to hand an outgoing message to its own server with authentication. The RFC drew a deliberate line between submission and relay so that a server can apply stricter rules to mail it originates: require a login, enforce sender rules, add tracking headers, and rate-limit per account.\n\nPort 587 uses **STARTTLS**. The connection opens in plaintext, the client issues the `STARTTLS` command, and the session upgrades to an encrypted TLS channel before any credentials or message content are sent. Submission on 587 requires authentication, which is exactly what you want for email sending. A correctly configured server will refuse the `AUTH` command until STARTTLS has completed, so credentials never cross the wire in the clear.\n\nA simplified 587 session looks like this in order: the server greets with `220`, the client sends `EHLO` and sees `STARTTLS` listed in the capabilities, the client issues `STARTTLS`, the TLS handshake runs, the client re-sends `EHLO` over the now-encrypted channel, authenticates with `AUTH LOGIN`, and only then sends `MAIL FROM`, `RCPT TO`, and `DATA`. If any step is skipped, the server rejects the message.\n\nThis is the default you should reach for. Google Workspace (smtp.gmail.com), Microsoft 365 (smtp.office365.com), and almost every transactional relay support 587. If you connect a sequencer over SMTP, 587 with STARTTLS is the standard configuration. See [Microsoft 365 SMTP settings](/learn/microsoft-365-smtp-settings) for the exact provider values.",
    },
    {
      heading: "Port 465: Implicit TLS Submission",
      content:
        "Port 465 has a complicated history. It was originally registered for SMTPS, then deprecated, then formally re-registered for **submission with implicit TLS** in [RFC 8314](https://datatracker.ietf.org/doc/html/rfc8314).\n\nThe difference from 587 is timing. On port 465 the TLS handshake happens **immediately** on connection; there is no plaintext phase and no `STARTTLS` upgrade. The whole session is encrypted from the first byte.\n\nRFC 8314 actually recommends implicit TLS (port 465) over STARTTLS for new deployments, because there is no plaintext window at all. In practice both 465 and 587 are secure when configured correctly. Use whichever your provider documents. Mixing them up, for example pointing a client at 465 but telling it to use STARTTLS, produces a TLS handshake error.",
    },
    {
      heading: "Port 2525: The Unofficial Fallback",
      content:
        "Port 2525 is **not** an official IANA-assigned SMTP port and is not part of any RFC. It exists because some networks block the standard submission ports, and several relay providers chose to also listen on 2525 as a workaround.\n\nWhen you might use it:\n\n- Your office or hosting network blocks 587 and 465.\n- Your relay provider explicitly documents 2525 as an alternate port.\n\nIt typically supports STARTTLS, the same as 587, but behavior is provider-defined since there is no standard. Treat 2525 as a last resort, not a default. If neither 587 nor 465 works, check whether your network is blocking outbound ports before reaching for 2525.",
    },
    {
      heading: "TLS vs SSL vs STARTTLS: Clearing Up the Terms",
      content:
        "These terms get used loosely, which causes configuration mistakes. Here is the accurate picture:\n\n| Term | What It Means | Port Association |\n|------|---------------|------------------|\n| **SSL** | The old protocol name, now deprecated and insecure | Often used loosely to mean implicit TLS on 465 |\n| **TLS** | The current encryption protocol (TLS 1.2 / 1.3) | Underlies both implicit and STARTTLS modes |\n| **Implicit TLS** | Encrypted from connection start, no upgrade step | Port 465 |\n| **STARTTLS** | Starts plaintext, upgrades to TLS via a command | Port 587 (and opportunistically on 25) |\n\nWhen a client UI says \"SSL\" it almost always means implicit TLS (port 465), and \"TLS\" or \"STARTTLS\" means the upgrade flow (port 587). The actual encryption is TLS in both cases; true SSL is obsolete and should never be used. The rule that prevents errors: match the encryption mode to the port. Implicit TLS goes with 465, STARTTLS goes with 587.",
    },
    {
      heading: "Diagnosing Port Problems Step by Step",
      content:
        "When a send fails, the port and encryption settings are the first thing to check, because they produce distinct, recognizable symptoms. Work through them in order rather than changing settings at random.\n\n| Symptom | Likely Port/Encryption Cause | What to Change |\n|------|------|------|\n| Connection hangs, then times out | Outbound 25 blocked, or wrong host | Switch to 587 or 465, verify host name |\n| TLS handshake fails immediately on 587 | Implicit TLS selected on a STARTTLS port | Set encryption to STARTTLS on 587 |\n| TLS handshake fails immediately on 465 | STARTTLS selected on an implicit-TLS port | Set encryption to SSL/TLS on 465 |\n| Connects, then auth is refused before login | Server requires STARTTLS first | Confirm STARTTLS is enabled in the client |\n| Works on 465 but not 587 (or vice versa) | Network blocks one submission port | Use the port that connects, or try 2525 |\n\nA practical test sequence: first try 587 with STARTTLS. If it times out rather than returning an auth error, the port is blocked at the network level, so try 465. If 465 connects but 587 does not, you have confirmed selective blocking. If both time out, the network blocks all outbound submission and you need a different network or a relay reachable on 2525. If a port connects but then throws a TLS error, the encryption mode is mismatched, not the port itself. Separating connection failures from encryption failures from authentication failures is the whole skill here, and the [common SMTP errors and fixes](/learn/smtp-errors-and-fixes) guide expands each branch.",
    },
    {
      heading: "Choosing the Right Port for Email",
      content:
        "For cold outreach, the port choice is straightforward, but it is only one piece of inbox placement. Encryption protects the connection; it does nothing for reputation. Authentication records and warmup do the heavy lifting.\n\n**Recommended setup:**\n\n1. Use **587 with STARTTLS** as your primary submission port.\n2. Fall back to **465 with implicit TLS** if your tool prefers it.\n3. Use **2525** only if both are network-blocked.\n4. Never use **25** for sending.\n\nThen make sure the rest is in place: publish [SPF](/learn/spf-record-setup-email), [DKIM](/learn/dkim-setup-email), and [DMARC](/learn/dmarc-setup-email), and ramp volume with the [email warmup guide](/learn/email-warmup-guide). If sends fail on a given port, the [common SMTP errors and fixes](/learn/smtp-errors-and-fixes) guide maps the symptoms to causes.\n\nManaged providers remove port and credential guesswork entirely. [Infrabox](/learn/what-is-infrabox) provisions real Google Workspace and Microsoft 365 mailboxes that connect to 24-plus sequencers natively, so you never hand-configure ports or worry about a blocked 25.",
    },
  ],
  faqs: [
    {
      question: "What is the difference between port 587 and port 465?",
      answer:
        "Port 587 uses STARTTLS: the connection starts in plaintext and upgrades to TLS before credentials are sent. Port 465 uses implicit TLS: the session is encrypted from the first byte. Both are secure for authenticated submission; use whichever your provider documents.",
    },
    {
      question: "Why is port 25 blocked?",
      answer:
        "Most ISPs and cloud providers block outbound port 25 to stop spam. Port 25 is for server-to-server relay, and a compromised machine could otherwise send mail directly to any recipient. Authenticated client submission was moved to ports 587 and 465 to avoid this abuse.",
    },
    {
      question: "Is port 2525 secure?",
      answer:
        "Port 2525 is an unofficial fallback offered by some relay providers when standard ports are blocked. It usually supports STARTTLS, so it can be secure, but it is not defined by any standard, so behavior depends on the provider. Use it only when 587 and 465 are unavailable.",
    },
    {
      question: "Does SSL mean the same thing as TLS for SMTP?",
      answer:
        "In client settings, SSL usually refers to implicit TLS on port 465, while TLS or STARTTLS refers to the upgrade flow on port 587. The actual encryption is TLS in both cases. True SSL is deprecated and insecure and should not be used.",
    },
    {
      question: "Which SMTP port is best for email?",
      answer:
        "Port 587 with STARTTLS is the recommended default for authenticated email submission, with port 465 implicit TLS as an alternative. The port secures the connection but does not affect deliverability; SPF, DKIM, DMARC, and warmup determine inbox placement.",
    },
  ],
  sources: [
    { title: "RFC 5321 - Simple Mail Transfer Protocol", url: "https://datatracker.ietf.org/doc/html/rfc5321", date: "2025" },
    { title: "RFC 6409 - Message Submission for Mail", url: "https://datatracker.ietf.org/doc/html/rfc6409", date: "2025" },
    { title: "RFC 8314 - Cleartext Considered Obsolete: TLS for Email Submission and Access", url: "https://datatracker.ietf.org/doc/html/rfc8314", date: "2025" },
    { title: "IANA Service Name and Transport Protocol Port Number Registry", url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", date: "2025" },
    { title: "Google Workspace - SMTP relay and send-from settings", url: "https://support.google.com/a/answer/176600", date: "2025" },
  ],
  relatedSlugs: [
    "smtp-server-setup-guide",
    "smtp-relay-vs-smtp-server",
    "microsoft-365-smtp-settings",
    "smtp-errors-and-fixes",
    "spf-record-setup-email",
  ],
};
