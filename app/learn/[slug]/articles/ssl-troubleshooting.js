export const article = {
  slug: "ssl-troubleshooting",
  title: "SSL Troubleshooting for Email Domains (2026)",
  metaDescription:
    "Diagnose and fix TLS/SSL errors on email domains: certificate mismatch, expired certs, unsupported protocols, and STARTTLS not offered. Includes openssl s_client steps.",
  headline: "SSL Troubleshooting for Email Domains",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: ["ssl troubleshooting", "tls errors", "starttls", "openssl", "email"],
  excerpt:
    "When mail defers for no obvious reason, the transport layer is often the culprit. Here is how to read TLS errors, diagnose them with openssl s_client, and fix the common ones.",
  type: "how-to",
  sections: [
    {
      heading: "When TLS Is the Real Problem",
      content:
        "Most email troubleshooting starts with content and reputation, but a stubborn class of failures lives lower down in the **transport layer**. If mail to one specific recipient domain keeps deferring, if Outlook refuses your connection outright, or if Gmail shows recipients a broken-padlock warning, you are likely looking at a TLS problem rather than a spam-filter problem.\n\nThe symptoms are distinct from filtering. Filtered mail is *accepted* and then sorted into spam. TLS-failed mail is often *deferred* or *rejected* at the connection stage, before the message body is even transmitted. Knowing which one you have saves hours of chasing the wrong fix. If your mail is being accepted and then filtered, the [why emails go to spam](/learn/why-emails-go-to-spam) guide is the better starting point. This article is for the connection-stage failures.\n\nBefore you debug, confirm the conceptual model in [why SSL matters for email deliverability](/learn/ssl-email-deliverability), because the fixes below make more sense once you know how STARTTLS and certificate verification work.",
    },
    {
      heading: "The Common TLS Errors",
      content:
        "There are five TLS failures that account for almost all email transport problems. Learn to recognize them by their signature in mail logs and bounce messages.\n\n| Error | What you see | Root cause |\n|-------|-------------|-----------|\n| **Certificate mismatch** | `hostname mismatch` or `name does not match` | The certificate does not cover the mail server hostname being connected to |\n| **Expired certificate** | `certificate has expired` | The TLS certificate passed its validity date and was not renewed |\n| **Self-signed / untrusted** | `unable to verify the first certificate` or `self signed certificate` | The certificate is not issued by a trusted CA, or the chain is incomplete |\n| **Unsupported protocol** | `no protocols available` or `handshake failure` | The two servers share no common TLS version, often a server stuck on TLS 1.0/1.1 |\n| **STARTTLS not offered** | No `250-STARTTLS` in the EHLO response | The receiving server is not advertising TLS upgrade capability |\n\nEach of these produces a deferral or rejection on a strict-TLS receiver and a silent cleartext fallback on an opportunistic one. The diagnosis steps below tell them apart, and the fix table at the end maps each to a remedy.",
    },
    {
      heading: "Step 1: Reproduce the Failure with openssl s_client",
      content:
        "The single most useful tool for TLS diagnosis is `openssl s_client`. It connects exactly the way a sending mail server would and prints the full handshake so you can see what actually happened.\n\nTo test STARTTLS on the standard SMTP transit port:\n\n```\nopenssl s_client -starttls smtp -connect mail.example.com:25 -crlf\n```\n\nTo test submission over implicit TLS on port 465:\n\n```\nopenssl s_client -connect mail.example.com:465 -crlf\n```\n\nRead the output top to bottom:\n\n- **`Certificate chain`** lists the presented certificates. A short or broken chain points to a self-signed or incomplete-chain problem.\n- **`Verify return code`** is the verdict. `0 (ok)` means the chain verified. Anything else names the problem, for example `10 (certificate has expired)` or `18 (self signed certificate)`.\n- **`subject`** and **`issuer`** lines tell you which hostname the certificate covers and who issued it. Compare the subject to the hostname you connected to for a mismatch.\n- **`Protocol`** and **`Cipher`** near the bottom show what was negotiated. A missing handshake here means no common protocol.\n\nIf the command hangs or returns nothing after `STARTTLS`, the server is almost certainly not advertising STARTTLS at all, which is the fifth error in the table above.\n\nA worked example makes this concrete. Suppose mail to a partner domain keeps deferring and you run the STARTTLS test. The handshake completes but the tail of the output reads `Verify return code: 10 (certificate has expired)`, and the `notAfter` date in the certificate block is last month. That single line tells you the whole story: the receiving server presents a certificate that lapsed, your strict-TLS sender refuses to trust it, and the message defers rather than downgrading to cleartext. You did not change anything; their renewal simply failed. The fix is theirs, and your correct move is to keep retrying with normal backoff while notifying their postmaster.\n\nTwo flags are worth knowing for cleaner output. Add `-servername mail.example.com` so the server selects the right certificate when several share an IP, which prevents a false mismatch on hosts that use SNI. Add `-showcerts` when you suspect a broken chain, because it prints every certificate the server sent, letting you confirm whether the intermediate is present or missing.",
    },
    {
      heading: "Step 2: Pin Down the Specific Cause",
      content:
        "Once you have the `openssl s_client` output, walk it against this decision path:\n\n- **Verify return code is not 0.** Read the code. `10` is expired, `18`/`19` is self-signed or untrusted root, `20`/`21` is an incomplete chain. These are certificate problems on the receiving side.\n- **Subject hostname differs from the connect hostname.** That is a certificate mismatch. The receiving operator needs to present a cert that covers the name their MX record points to.\n- **`no protocols available` or handshake failure with no cipher.** Force a version to confirm: add `-tls1_2` to require TLS 1.2. If that succeeds but the default failed, the far side rejected something in your offered list, or it is stuck on a deprecated version.\n- **No STARTTLS line in the capabilities.** Run a plain connection first with `openssl s_client -connect host:25` then type `EHLO test.com` and read the `250-` lines. No `250-STARTTLS` confirms it.\n\nCross-check DNS while you are here. A certificate mismatch frequently traces back to MX, A, or PTR records that disagree. The [MX records explained](/learn/mx-records-explained) and [reverse DNS setup](/learn/reverse-dns-setup) guides cover the records that need to line up with the certificate hostname.",
    },
    {
      heading: "Step 3: Separate Your Problem from Theirs",
      content:
        "A critical distinction in email: are you debugging *your* sending infrastructure or the *recipient's* receiving infrastructure?\n\nIf you run your own relay or SMTP server, an expired or mismatched certificate on your side is yours to fix, and it affects how recipients verify and trust your connections. If you send through real provider mailboxes, the outbound TLS is handled by the provider and the certificate you might be seeing in an error is the *recipient's*, which you cannot fix directly.\n\nThis is where managed infrastructure removes a whole category of work. **Infrabox** provisions real Google Workspace and Microsoft 365 mailboxes, so TLS negotiation, certificates, and protocol versions are maintained on genuine provider infrastructure rather than a relay you patch yourself. The errors you might still encounter are then almost always on the receiving end, where the correct response is usually to retry and, if it persists, to report the misconfiguration to the recipient rather than to change your own setup.\n\nTo tell which side owns the problem: if `openssl s_client` against *your own* sending host shows a bad verify code, it is yours. If your sending host verifies cleanly but mail to one recipient domain defers, it is theirs.",
    },
    {
      heading: "Step 4: Apply the Fix",
      content:
        "Map each diagnosed cause to its remedy. The \"who fixes it\" column matters because it tells you whether to act or to retry and report.\n\n| Diagnosis | Fix | Who fixes it |\n|-----------|-----|-------------|\n| **Expired certificate** | Renew the certificate; automate renewal with [Let's Encrypt](https://letsencrypt.org/docs/) and a tool like certbot so it never lapses | Whoever owns the failing server |\n| **Certificate mismatch** | Reissue a certificate covering the exact mail hostname the MX record points to | Server operator |\n| **Self-signed / broken chain** | Replace with a CA-issued certificate and include the full intermediate chain | Server operator |\n| **Unsupported protocol** | Enable TLS 1.2 and 1.3, disable TLS 1.0/1.1 per [Microsoft TLS requirements](https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/transport-layer-security) | Server operator |\n| **STARTTLS not offered** | Enable the STARTTLS extension per [RFC 3207](https://datatracker.ietf.org/doc/html/rfc3207); verify the daemon advertises it on EHLO | Server operator |\n| **Recipient-side failure** | Retry with normal backoff; if persistent, notify the recipient's postmaster | You retry, they fix |\n\nFor most cold senders on managed mailboxes, the action for the first five rows is simply confirming the failing host is the recipient's, not yours, and then retrying. The whole-config rebuilds belong to people running their own mail servers.",
    },
    {
      heading: "How TLS Failures Show Up in Real Logs",
      content:
        "Knowing the abstract error is one thing; recognizing it in a live mail log is another. The exact wording varies by mail server software, but the patterns are consistent enough to map.\n\n| Where you see it | Sample line | What it means |\n|------------------|-------------|---------------|\n| Postfix deferral | `Cannot start TLS: handshake failure` | No common protocol, or the peer aborted the handshake |\n| Postfix verify | `certificate verification failed for ...: untrusted issuer` | Self-signed or missing intermediate on the far side |\n| Exim defer | `TLS error on connection ... SSL_connect: certificate verify failed` | Chain did not verify; read the reason that follows |\n| Bounce / NDR | `4.7.5 Cannot decrypt the message` or `STARTTLS required` | Receiver enforces TLS your server could not satisfy |\n| Gmail Show Original | no `Encryption: TLS` line, padlock shows broken | The hop arrived in cleartext or failed verification |\n\nThe key reading skill is separating a *deferral* from a *bounce*. A 4xx deferral, the leading `4` in codes like `4.7.5`, means the server will retry, so a transient TLS hiccup on the far side often clears on its own within an hour. A 5xx permanent failure means the message will not be retried, which points to a configuration problem that needs a real fix rather than patience. When the log shows a 4xx TLS deferral against a single recipient domain and your own host verifies cleanly, the disciplined response is to wait out the backoff window before touching anything.\n\nIf you are unsure whether the deferral is even TLS-related, the giveaway is the stage at which it happens. TLS failures appear right after the connection opens and before any `DATA` or message body is sent. A failure that appears after the body transmits is a content or policy rejection, not a transport one, and belongs in the spam-and-filtering investigation instead.",
    },
    {
      heading: "Step 5: Verify the Fix and Monitor",
      content:
        "After any change, re-run the same `openssl s_client` command and confirm `Verify return code: 0 (ok)` and a negotiated TLS 1.2 or 1.3 protocol. Then send a live test message and check the headers at the receiving end: Gmail's *Show Original* view reports whether the message arrived encrypted, and the absence of a broken-padlock warning confirms a clean transit.\n\nKeep a short verification loop:\n\n- **Re-test the handshake** with `openssl s_client` until the verify code is 0.\n- **Send a real test** to a Gmail and an Outlook address and inspect the headers.\n- **Watch the mail logs** for the recurrence of the deferral that started the investigation.\n\nFor ongoing peace of mind, monitor rather than spot-check. Certificate expiry is the most common recurring TLS failure precisely because it is silent until the day it breaks. Automated renewal plus an expiry monitor prevents the classic Monday-morning outage. On managed infrastructure this is handled for you: real provider mailboxes keep TLS current automatically, and the SPF, DKIM, DMARC, and MX records that interact with transport are provisioned through Cloudflare in under sixty seconds, so the records and the certificate never drift apart. If you want the conceptual backing for what you just fixed, revisit [why SSL matters for email deliverability](/learn/ssl-email-deliverability).",
    },
  ],
  faqs: [
    {
      question: "How do I check if a mail server supports STARTTLS?",
      answer:
        "Run openssl s_client -starttls smtp -connect host:25. If the handshake completes you get STARTTLS. You can also connect plain and send EHLO; a 250-STARTTLS line in the response confirms support. No such line means STARTTLS is not offered.",
    },
    {
      question: "What does Verify return code 10 mean?",
      answer:
        "Code 10 from openssl means the certificate has expired. The owner of that server needs to renew it. If it is the recipient's server, retry with backoff and report it to their postmaster if it persists.",
    },
    {
      question: "Why does mail to one domain keep deferring with a TLS error?",
      answer:
        "That recipient likely enforces strict TLS or MTA-STS while presenting an invalid or mismatched certificate, so your server refuses to downgrade. The fix is on their side; you retry and, if it continues, notify their postmaster.",
    },
    {
      question: "Do I need to fix TLS myself on provider mailboxes?",
      answer:
        "No. On real Google Workspace and Microsoft 365 mailboxes the provider maintains certificates and protocol versions. Any TLS error you see in that case is usually the recipient server's, which you cannot fix directly.",
    },
    {
      question: "How can I tell a TLS deferral apart from a spam-filter rejection?",
      answer:
        "Look at the stage and the code. TLS failures happen right after the connection opens, before the message body is sent, and often show as a 4xx deferral or a handshake error in the log. A rejection that arrives after the body transmits, or a message accepted then sorted to spam, is a content or policy problem, not transport.",
    },
  ],
  sources: [
    { title: "RFC 3207 - SMTP Service Extension for Secure SMTP over TLS (STARTTLS)", url: "https://datatracker.ietf.org/doc/html/rfc3207", date: "2025" },
    { title: "OpenSSL - s_client command documentation", url: "https://docs.openssl.org/master/man1/openssl-s_client/", date: "2025" },
    { title: "Microsoft - Exchange Online TLS configuration and requirements", url: "https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/transport-layer-security", date: "2025" },
    { title: "Let's Encrypt - How It Works", url: "https://letsencrypt.org/docs/", date: "2025" },
  ],
  relatedSlugs: [
    "ssl-email-deliverability",
    "mta-sts-setup-guide",
    "reverse-dns-setup",
    "mx-records-explained",
  ],
};
