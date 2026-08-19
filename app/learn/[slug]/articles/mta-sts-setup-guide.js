export const article = {
  slug: "mta-sts-setup-guide",
  title: "MTA-STS Setup Guide: Enforce TLS for Inbound Email (RFC 8461)",
  metaDescription:
    "A step-by-step MTA-STS setup guide covering the policy file, the _mta-sts TXT record, the well-known URL, TLS-RPT reporting, and how to test with a checker. Based on RFC 8461.",
  headline: "How to Set Up MTA-STS and TLS-RPT for Your Email Domain",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: ["mta-sts", "tls-rpt", "rfc 8461", "email security"],
  excerpt:
    "MTA-STS tells sending servers to require TLS when delivering mail to your domain, closing a downgrade gap that plain SMTP leaves open. This guide walks through the policy file, the TXT record, the well-known URL, TLS-RPT reporting, and testing.",
  type: "how-to",
  sections: [
    {
      heading: "What MTA-STS and TLS-RPT are",
      content:
        "When one mail server delivers to another, it normally tries to upgrade the connection to TLS using STARTTLS. The weakness is that STARTTLS is opportunistic: if the upgrade is stripped or the certificate is invalid, most senders quietly fall back to plaintext rather than refusing to deliver. An attacker positioned between the servers can force that downgrade and read or alter mail in transit.\n\nMTA-STS (Mail Transfer Agent Strict Transport Security) closes that gap. It lets a receiving domain publish a policy that says, in effect, \"servers sending to me must use TLS, must present a valid certificate, and must match these MX hosts; if they cannot, do not deliver in plaintext.\" Sending servers that support MTA-STS fetch and cache that policy and enforce it. The standard is defined in [RFC 8461](https://datatracker.ietf.org/doc/html/rfc8461).\n\nTLS-RPT (TLS Reporting), defined in [RFC 8460](https://datatracker.ietf.org/doc/html/rfc8460), is the companion. It asks sending servers to send you daily aggregate reports about TLS connection successes and failures to your domain. Without TLS-RPT you enforce a policy blind; with it you see which senders are failing TLS and why, which is essential before you turn enforcement on. The two are almost always deployed together.",
    },
    {
      heading: "Why MTA-STS matters for senders too",
      content:
        "MTA-STS protects mail coming in to your domain, so at first it looks like a receiver-only concern. For anyone running email it matters for two further reasons.\n\nFirst, it signals operational maturity. Receivers increasingly read the full set of published security records when forming an opinion of a domain. A domain with SPF, DKIM, DMARC, and MTA-STS all in place looks like infrastructure run by a competent operator, not a throwaway. That reputation feeds into how your outbound is judged.\n\nSecond, when your sending domains also receive replies and bounce notifications, MTA-STS protects that inbound traffic from interception. Reply handling is part of a real conversation, and protecting it in transit is part of treating the domain as a genuine mailbox rather than a one-way blaster.\n\nMTA-STS does not replace SPF, DKIM, or DMARC. Those authenticate the message; MTA-STS secures the transport channel. They sit at different layers and you want both. For the authentication layer, see [email authentication explained](/learn/email-authentication-spf-dkim-dmarc-explained) and the [email deliverability guide](/learn/email-deliverability-guide).",
    },
    {
      heading: "The three pieces you need to publish",
      content:
        "An MTA-STS deployment has exactly three moving parts, plus one optional reporting record. Get all of them right and the policy is live.\n\n| Piece | Where it lives | What it does |\n| --- | --- | --- |\n| Policy file | `https://mta-sts.yourdomain.com/.well-known/mta-sts.txt` | The actual rules: mode, MX hosts, max age |\n| `_mta-sts` TXT record | DNS at `_mta-sts.yourdomain.com` | Tells senders a policy exists and its version id |\n| `mta-sts` subdomain | DNS A/CNAME for `mta-sts.yourdomain.com` | Hosts the policy file over HTTPS |\n| `_smtp._tls` TXT (TLS-RPT) | DNS at `_smtp._tls.yourdomain.com` | Where to send TLS failure reports |\n\nThe order of operations is deliberate. You publish the policy file and make it reachable over HTTPS first, then publish the DNS TXT record that points senders at it. Publishing the TXT record before the file exists tells senders to fetch a policy that is not there, which produces errors. The next sections walk each piece in order.",
    },
    {
      heading: "Step 1: write and host the policy file",
      content:
        "The policy file is a small text file served at a fixed path on a dedicated subdomain. The exact URL must be `https://mta-sts.yourdomain.com/.well-known/mta-sts.txt`. It must be served over HTTPS with a valid certificate, because senders refuse to trust a policy fetched over plain HTTP.\n\nA typical policy file looks like this:\n\n```\nversion: STSv1\nmode: enforce\nmx: aspmx.l.google.com\nmx: *.google.com\nmax_age: 604800\n```\n\nThe fields:\n\n- `version` is always `STSv1`.\n- `mode` is `none`, `testing`, or `enforce`. Always start at `testing`, which makes senders report failures without blocking delivery.\n- `mx` lists every hostname that legitimately handles mail for your domain. These must match your real MX records exactly, wildcards included. Mismatched MX is the most common reason a policy backfires.\n- `max_age` is how long, in seconds, senders cache the policy. 604800 is one week. Use a short value while testing so changes apply quickly, then raise it.\n\nHost the subdomain wherever you can serve static content over HTTPS. If your certificate is invalid or expired the policy fetch fails, so confirm TLS on the subdomain works. For certificate issues, see [SSL and email deliverability](/learn/ssl-email-deliverability) and [SSL troubleshooting](/learn/ssl-troubleshooting).",
    },
    {
      heading: "Step 2: publish the _mta-sts TXT record",
      content:
        "Once the policy file is reachable over HTTPS, publish the DNS TXT record that tells senders a policy exists. It goes at `_mta-sts.yourdomain.com`:\n\n```\n_mta-sts.example.com.  TXT  \"v=STSv1; id=20260618000000\"\n```\n\nTwo fields:\n\n- `v=STSv1` is the version, fixed.\n- `id` is an arbitrary string that you change every time you update the policy file. Senders compare the cached id against the published id; when it changes, they know to re-fetch the policy. A timestamp like `20260618000000` is a common convention because it is unique and self-documenting.\n\nThe critical discipline: every time you edit the policy file, change the `id` in this TXT record. If you update the file but leave the id unchanged, senders keep serving the cached old policy until `max_age` expires and never notice your change. You also need the `mta-sts` subdomain itself resolving via an A or CNAME record so the HTTPS fetch in Step 1 works. Publishing DNS records across many domains at once is covered in [bulk DNS updates](/learn/bulk-dns-updates).",
    },
    {
      heading: "Step 3: add the TLS-RPT record",
      content:
        "TLS-RPT is a single TXT record that asks senders to report TLS connection results to you. It goes at `_smtp._tls.yourdomain.com`:\n\n```\n_smtp._tls.example.com.  TXT  \"v=TLSRPTv1; rua=mailto:tlsrpt@example.com\"\n```\n\n- `v=TLSRPTv1` is the version.\n- `rua` is where reports go. It can be a `mailto:` address or an `https:` endpoint. A mailbox you actually read is the simplest start.\n\nReports arrive as daily JSON summaries from each sending provider, listing how many sessions succeeded and failed and the failure types. This is the data that makes a safe rollout possible. Before you switch the policy from `testing` to `enforce`, you want a stretch of reports showing that legitimate senders are connecting over TLS successfully. If reports show a particular sender failing, you fix the cause (often a wrong MX entry or a certificate problem) before enforcing. Turning on enforcement without ever reading TLS-RPT data is how you accidentally block legitimate mail.",
    },
    {
      heading: "Step 4: test with a checker, then enforce",
      content:
        "With all three pieces published in `testing` mode, validate the deployment before raising the stakes. A checker fetches your TXT record, follows it to the policy file, validates the file syntax, confirms the HTTPS certificate, and checks that the MX hosts in the policy match your real MX records.\n\nInfrabox offers a free MTA-STS checker that runs these checks in one pass, which is the fastest way to confirm the policy is well formed and reachable before you trust it. Run it after publishing and again after any edit.\n\nThe rollout sequence:\n\n1. Publish everything with `mode: testing` and a short `max_age`.\n2. Run the checker and fix any errors it reports.\n3. Watch TLS-RPT reports for a week or two until legitimate senders show consistent TLS success.\n4. Change the policy file `mode` to `enforce`, bump the `id` in the TXT record, and re-run the checker.\n5. Raise `max_age` to a week once you are confident.\n\nNever jump straight to `enforce`. The `testing` window exists precisely so a misconfiguration surfaces as a report rather than as blocked mail. If the checker or reports surface DNS-level issues, the [DNS troubleshooting checklist](/learn/dns-troubleshooting-checklist) walks the diagnosis in order.",
    },
    {
      heading: "Common mistakes and how MTA-STS fits the bigger picture",
      content:
        "A few errors account for most failed MTA-STS deployments:\n\n| Mistake | Effect | Fix |\n| --- | --- | --- |\n| MX in policy does not match real MX | Senders distrust policy, may not enforce | Copy MX hosts exactly, wildcards included |\n| Policy file served over HTTP, not HTTPS | Fetch fails, policy ignored | Serve over HTTPS with a valid certificate |\n| `id` not changed after editing the file | Senders keep the cached old policy | Bump `id` on every policy edit |\n| Jumped straight to `enforce` | Legitimate mail can be blocked | Start at `testing`, read TLS-RPT first |\n| TLS-RPT pointed at an unread mailbox | No visibility into failures | Send `rua` to a mailbox you monitor |\n\nMTA-STS sits at the top of a stack. Below it, SPF, DKIM, and DMARC authenticate who sent the message; MTA-STS secures the pipe it travels through; and underneath all of it the DNS itself has to be correct and stable. For email run across many domains, maintaining all of these by hand is the real challenge. Infrabox configures SPF, DKIM, DMARC, and MX automatically through Cloudflare in under 60 seconds per domain and watches them continuously with InfraGuard, which keeps the authentication layer healthy so transport security like MTA-STS sits on solid ground. See [what Infrabox is](/learn/what-is-infrabox) for how that fits a multi-domain setup, and [BIMI setup](/learn/bimi-setup-guide) for the brand-logo layer that builds on a passing DMARC policy.",
    },
  ],
  faqs: [
    {
      question: "What is the difference between MTA-STS and TLS-RPT?",
      answer:
        "MTA-STS (RFC 8461) is the policy that tells sending servers to require valid TLS when delivering mail to your domain and to refuse plaintext fallback. TLS-RPT (RFC 8460) is the companion reporting mechanism that asks senders to send you daily aggregate reports on TLS connection successes and failures. You deploy them together: the policy enforces, the reports give you visibility before and after enforcing.",
    },
    {
      question: "Why should I start MTA-STS in testing mode?",
      answer:
        "Testing mode makes sending servers report TLS failures through TLS-RPT without actually blocking delivery. This lets you confirm that legitimate senders connect over TLS successfully and catch misconfigurations, like a wrong MX host or an invalid certificate, before they block real mail. Jumping straight to enforce mode risks blocking legitimate email if anything is wrong.",
    },
    {
      question: "Where does the MTA-STS policy file have to be hosted?",
      answer:
        "At the exact URL https://mta-sts.yourdomain.com/.well-known/mta-sts.txt, served over HTTPS with a valid certificate. You need a DNS A or CNAME record for the mta-sts subdomain so the HTTPS fetch resolves, and the certificate must be valid because senders refuse to trust a policy fetched over plain HTTP or with a bad certificate.",
    },
    {
      question: "Why do senders ignore my updated MTA-STS policy?",
      answer:
        "Almost always because you edited the policy file but did not change the id value in the _mta-sts TXT record. Senders cache the policy and only re-fetch when the published id differs from the cached one. Change the id, often to a fresh timestamp, every time you edit the policy file, then re-run a checker to confirm the new policy is served.",
    },
  ],
  sources: [
    {
      title: "RFC 8461: SMTP MTA Strict Transport Security (MTA-STS)",
      url: "https://datatracker.ietf.org/doc/html/rfc8461",
      date: "2025",
    },
    {
      title: "RFC 8460: SMTP TLS Reporting (TLS-RPT)",
      url: "https://datatracker.ietf.org/doc/html/rfc8460",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "email-authentication-spf-dkim-dmarc-explained",
    "dns-troubleshooting-checklist",
    "ssl-email-deliverability",
    "bimi-setup-guide",
  ],
};
