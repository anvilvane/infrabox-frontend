export const article = {
  slug: "smtp-errors-and-fixes",
  title: "Common SMTP Errors and Fixes (2026)",
  metaDescription:
    "A how-to catalog of common SMTP send errors and fixes: authentication failed, connection timeout, TLS errors, rate limits, and relay denied, with a quick-reference table.",
  headline: "Common SMTP Errors and How to Fix Them",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: [
    "smtp errors",
    "smtp troubleshooting",
    "authentication failed",
    "relay denied",
    "rate limit",
    "deliverability",
  ],
  excerpt:
    "The SMTP errors that break email sends and exactly how to fix each one: auth failures, timeouts, TLS handshake problems, rate limits, and relay denials.",
  type: "how-to",
  sections: [
    {
      heading: "Quick-Reference: The Most Common SMTP Errors",
      content:
        "When an SMTP send fails, the server returns a reply code and a message. Here are the errors that account for most email sending problems and the fix for each:\n\n| Error / Code | Meaning | Most Common Fix |\n|--------------|---------|-----------------|\n| **535 5.7.8** | Authentication failed | Regenerate app password or switch to OAuth |\n| **Connection timeout** | Cannot reach the server/port | Use port 587 or 465, not blocked 25 |\n| **TLS handshake failed** | Encryption mismatch | Match encryption mode to the port |\n| **550 5.7.1 relay denied** | Server will not relay your mail | Authenticate, or send from an allowed domain |\n| **421 4.7.0 / rate limit** | Too many messages too fast | Slow sending, respect daily caps |\n| **550 5.1.1** | Recipient address does not exist | Verify and clean your list |\n| **454 4.7.0 TLS not available** | STARTTLS required but unavailable | Enable TLS on the client or server |\n\nThe sections below walk through each category with diagnosis steps. For what the numbers themselves mean, see [SMTP error codes explained](/learn/smtp-error-codes-explained).",
    },
    {
      heading: "Authentication Failed (535 5.7.8)",
      content:
        "A `535 5.7.8` reply means the server rejected your credentials. This is the single most common SMTP error when connecting a sequencer, and it is also the most misdiagnosed, because senders assume the password is wrong when the real problem is usually that the protocol itself is switched off.\n\n**Causes and fixes:**\n\n1. **Wrong username.** Use the full email address (you@yourdomain.com), not just the local part. Gmail and Microsoft both expect the full address as the login, and a bare local part fails silently.\n2. **Expired or missing app password.** If the provider still allows basic auth, generate a fresh app password and paste it exactly, with no spaces. App passwords are often displayed with spaces for readability, and pasting those spaces is a frequent cause of failure.\n3. **Basic auth disabled.** Microsoft has been retiring basic authentication for Exchange Online. If basic auth is off, you must use OAuth (XOAUTH2). See [Microsoft 365 SMTP settings](/learn/microsoft-365-smtp-settings) for the OAuth flow.\n4. **Account not licensed for SMTP.** Confirm the mailbox has SMTP AUTH enabled at the tenant and per-user level. On Microsoft 365 both layers must allow it; one switched off blocks the send regardless of the other.\n5. **MFA without an app password.** If the account has multi-factor auth, a normal password will not work over SMTP; you need an app password or OAuth.\n\n**Worked example:** you paste your Microsoft 365 mailbox address and password into a sequencer, it works in Outlook on the web, but the connection test returns `535 5.7.8 SmtpClientAuthentication is disabled for the mailbox`. The diagnostic text is doing you a favor here: it is telling you the credentials are fine and the protocol is off. An administrator enables Authenticated SMTP on that mailbox, you wait for the change to propagate, and the same credentials now work.\n\n**Diagnosis:** if the same credentials work in webmail but fail over SMTP, the problem is almost always disabled basic auth or a missing app password, not a typo. Read the diagnostic string after the code; it frequently names the exact cause.",
    },
    {
      heading: "Connection Timeout and Connection Refused",
      content:
        "A timeout means your client opened a connection that never completed; a refusal means the port is closed or blocked. Both point to a network or port problem rather than credentials. The distinction matters: a refusal comes back quickly because something actively rejected the connection, while a timeout hangs for many seconds because packets are being silently dropped by a firewall that does not bother to reply.\n\n**Causes and fixes:**\n\n- **Outbound port 25 blocked.** Most ISPs and cloud hosts block port 25. Switch to **587** or **465**. This is covered in depth in [SMTP ports explained](/learn/smtp-ports-explained).\n- **Wrong host or port.** Double-check the SMTP host and port against the provider docs. A trailing space or a typo in the host name produces a resolution failure that looks like a timeout.\n- **Firewall rule.** A local or cloud firewall may block outbound submission ports. Allow outbound 587 and 465.\n- **DNS resolution failure.** If the host name will not resolve, the connection cannot start. Verify the host resolves with a DNS lookup before blaming the port.\n- **IPv6 reachability.** If the host resolves to an IPv6 address your network cannot route, the connection stalls. Forcing IPv4 sometimes clears a phantom timeout.\n\n**Diagnosis:** try connecting on 587 and 465 from the same machine. If 587 times out but 465 works, a network rule is selectively blocking one submission port. If both fail but the host resolves fine in DNS, the network blocks all outbound submission and you need a different network or a fallback port like 2525. If the host does not resolve at all, fix the host name first; no port change will help.",
    },
    {
      heading: "TLS and Encryption Errors",
      content:
        "TLS errors stop the connection from being secured, which providers treat as fatal for authenticated submission. The most common mistake is a mismatch between the port and the encryption mode.\n\n| Symptom | Likely Cause | Fix |\n|---------|--------------|-----|\n| Handshake fails on 587 with SSL selected | Implicit TLS chosen on a STARTTLS port | Set the client to STARTTLS on 587 |\n| Handshake fails on 465 with STARTTLS | STARTTLS chosen on an implicit-TLS port | Set the client to SSL/TLS on 465 |\n| **454 4.7.0** STARTTLS not available | Server not offering STARTTLS | Enable TLS on the server, or use 465 |\n| Certificate error | Expired or mismatched server cert | Update the cert; do not disable verification |\n\n**The rule:** implicit TLS pairs with port 465, STARTTLS pairs with port 587. Never disable certificate verification to make an error go away; that exposes credentials. If you self-host, the certificate and TLS config are your responsibility, as detailed in [self-hosted email server](/learn/self-hosted-email-server).",
    },
    {
      heading: "Relay Denied (550 5.7.1)",
      content:
        "A `550 5.7.1` relay-denied error means the server refused to forward your message because it does not consider you authorized to send to that recipient. This is an authorization problem, not a credential one.\n\n**Causes and fixes:**\n\n1. **Not authenticated.** You connected without logging in. The server only relays for authenticated users. Provide valid SMTP AUTH credentials.\n2. **Sending from a domain the relay does not own.** Some relays only accept mail from domains verified in the account. Verify your sending domain with the provider.\n3. **Recipient outside allowed scope.** A relay configured for internal-only delivery will reject external recipients. Use a submission endpoint meant for outbound mail.\n4. **SPF or alignment failure on a strict relay.** If the From domain is not authorized, the relay may refuse. Confirm [SPF](/learn/spf-record-setup-email) lists the sending host.\n\n**Diagnosis:** if authenticated mail to your own domain works but external recipients are denied, the relay scope is the issue. The difference between a relay and a full server is explained in [SMTP relay vs SMTP server](/learn/smtp-relay-vs-smtp-server).",
    },
    {
      heading: "Rate Limits and Throttling (421 4.7.0)",
      content:
        "A `421` reply with a throttling message means you are sending faster than the provider allows, or you have hit a daily cap. The connection is temporarily deferred, not permanently failed.\n\n**Causes and fixes:**\n\n- **Daily send cap exceeded.** Google Workspace and Microsoft 365 enforce per-mailbox daily limits. Stay under them; see [email sending limits for Google and Microsoft](/learn/email-sending-limits-google-microsoft).\n- **Burst too fast.** Even under the daily cap, sending hundreds of messages in a minute triggers throttling. Add delays between sends.\n- **New mailbox sending too much.** A fresh mailbox has a low reputation and tighter limits. Warm it up gradually with the [email warmup guide](/learn/email-warmup-guide).\n- **Reputation-based throttling.** If your domain or IP reputation has dropped, the receiver may slow you down. Check it in [Google Postmaster Tools](/learn/google-postmaster-tools-guide).\n\n**Diagnosis:** a `4xx` code is temporary, so a well-behaved sender retries with backoff. Persistent `421` across mailboxes signals a reputation problem, not a config one. Volume planning is covered in the [email sending volume limits guide](/learn/email-sending-volume-limits-guide).",
    },
    {
      heading: "Bounces and Invalid Recipients (550 5.1.1)",
      content:
        "A `550 5.1.1` error means the recipient address does not exist. A high rate of these (a high hard-bounce rate) damages your sender reputation quickly and is a top reason cold campaigns get throttled or blocked.\n\n**Causes and fixes:**\n\n1. **Stale or unverified list.** Validate addresses before sending. Remove role accounts and obvious typos.\n2. **Catch-all confusion.** Some domains accept then bounce later; verification tools that detect catch-alls reduce surprises.\n3. **Scraped data.** Lists built from scraping have high invalid rates. Clean aggressively.\n\nKeep your hard-bounce rate low. Benchmarks and targets are in [email bounce rate benchmarks](/learn/email-bounce-rate-benchmarks). A sudden spike in `5xx` recipient errors often means a bad import; pause and re-verify before continuing.",
    },
    {
      heading: "A Repeatable Troubleshooting Workflow",
      content:
        "Random setting changes waste time and can make things worse. Work an SMTP failure in a fixed order so you isolate the layer that is actually broken.\n\n| Step | Question | If it fails |\n|------|----------|-------------|\n| 1 | Does the host name resolve in DNS? | Fix the host name; stop here |\n| 2 | Does the port connect at all? | Network or port block; try 465 or 2525 |\n| 3 | Does the TLS handshake complete? | Encryption mode mismatch; match it to the port |\n| 4 | Does authentication succeed? | Credentials, app password, or disabled SMTP AUTH |\n| 5 | Is the message accepted (250)? | Relay scope, recipient validity, or rate limit |\n| 6 | Does accepted mail reach the inbox? | Reputation and authentication, not SMTP config |\n\nThe value of the ladder is that each rung rules out everything below it. If the TLS handshake completes, the port and DNS are fine, so stop checking them. If authentication succeeds but the message is refused with `550 5.7.1`, the problem is authorization or relay scope, not your password. Most people skip straight to step four and change their password repeatedly when the failure is actually at step two or three. A failure at step six is special: the send technically succeeded, the server returned `250`, and yet the message landed in spam or vanished. That is not an error you fix with SMTP settings at all, which is the subject of the next section.",
    },
    {
      heading: "When Errors Point to a Deeper Reputation Problem",
      content:
        "Some failures are not configuration bugs; they are reputation signals. If authenticated, correctly configured mail still gets deferred, blocked, or filtered, look beyond SMTP settings.\n\n**Investigate in this order:**\n\n1. **Blacklists.** Check your domain and IP with [check domain blacklisted](/learn/check-domain-blacklisted), and if listed, follow the [email blacklist removal guide](/learn/email-blacklist-removal-guide).\n2. **Authentication alignment.** Confirm [SPF, DKIM, and DMARC](/learn/email-authentication-spf-dkim-dmarc-explained) all pass and align.\n3. **Reputation trend.** Review [domain reputation vs IP reputation](/learn/domain-reputation-vs-ip-reputation) and your Postmaster Tools dashboard.\n4. **Content and spam triggers.** Review [why emails go to spam](/learn/why-emails-go-to-spam).\n\nThis is where managed infrastructure earns its keep. [Infrabox](/learn/what-is-infrabox) runs InfraGuard, which checks blacklists every six hours, watches your DNS, and auto-pauses sending when something breaks, so a silent misconfiguration does not quietly tank a campaign. Automatic SPF, DKIM, and DMARC setup also removes the most common source of authentication errors before they happen.",
    },
  ],
  faqs: [
    {
      question: "What does SMTP error 535 5.7.8 mean?",
      answer:
        "It means authentication failed: the server rejected your username or password. The usual causes are using a partial username instead of the full email address, an expired app password, or basic auth being disabled in favor of OAuth. Regenerate credentials or switch to OAuth.",
    },
    {
      question: "Why does my SMTP connection time out?",
      answer:
        "A timeout usually means the port is blocked or wrong. Most ISPs and cloud hosts block outbound port 25, so switch to 587 or 465. Also check for firewall rules blocking outbound submission and confirm the SMTP host name resolves in DNS.",
    },
    {
      question: "How do I fix a 550 5.7.1 relay denied error?",
      answer:
        "Relay denied means the server will not forward your mail. Authenticate with valid SMTP credentials, confirm you are sending from a domain the relay is authorized to send for, and use an outbound submission endpoint rather than an internal-only relay.",
    },
    {
      question: "What causes SMTP rate-limit errors?",
      answer:
        "A 421 throttling reply means you are sending faster than allowed or have hit a daily cap. Slow your sending rate, respect per-mailbox daily limits, warm up new mailboxes gradually, and check reputation if throttling persists across mailboxes.",
    },
    {
      question: "Are SMTP errors starting with 4 permanent?",
      answer:
        "No. A 4xx code is a temporary failure, so a well-behaved sender retries later with backoff. A 5xx code is permanent and should not be retried as-is. The first digit of the reply code tells you whether the failure is transient or final.",
    },
  ],
  sources: [
    { title: "RFC 5321 - Simple Mail Transfer Protocol (reply codes)", url: "https://datatracker.ietf.org/doc/html/rfc5321", date: "2025" },
    { title: "RFC 3463 - Enhanced Mail System Status Codes", url: "https://datatracker.ietf.org/doc/html/rfc3463", date: "2025" },
    { title: "Microsoft - Fix email delivery issues for error code 550 5.7.1", url: "https://learn.microsoft.com/en-us/exchange/troubleshoot/email-delivery/ndr/fix-error-code-5-7-1-in-exchange-online", date: "2025" },
    { title: "Google Workspace - SMTP error messages and limits", url: "https://support.google.com/a/answer/3726730", date: "2025" },
    { title: "Google Email Sender Guidelines", url: "https://support.google.com/mail/answer/81126", date: "2025" },
  ],
  relatedSlugs: [
    "smtp-error-codes-explained",
    "smtp-ports-explained",
    "smtp-server-setup-guide",
    "smtp-relay-vs-smtp-server",
    "email-bounce-rate-benchmarks",
  ],
};
