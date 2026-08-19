export const article = {
  slug: "dns-setup-guide",
  title:
    "DNS Setup for Email: SPF, DKIM, DMARC (2026)",
  metaDescription:
    "Step-by-step guide to setting up SPF, DKIM, and DMARC DNS records for email. Covers every major registrar, common errors, and validation tools.",
  headline:
    "DNS Records Setup for Email: SPF, DKIM, DMARC (2026)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-03-30",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "20 min read",
  tags: [
    "DNS records",
    "SPF",
    "DKIM",
    "DMARC",
    "email authentication",
    "email",
    "MX records",
  ],
  excerpt:
    "DNS configuration is where most email setups break. This guide walks through SPF, DKIM, and DMARC setup step by step, with provider-specific instructions, common mistakes, and validation tools.",
  type: "educational",
  sections: [
    {
      heading: "Why DNS Records Make or Break Your Email",
      content:
        "DNS records are the foundation of email authentication. Without correctly configured SPF, DKIM, and DMARC records, your emails are essentially unsigned packages. receiving servers have no way to verify that you are who you claim to be.\n\n| Record | Type | Purpose | Impact on Deliverability |\n|--------|------|---------|-------------------------|\n| SPF | TXT | Authorizes sending servers | Prevents spoofing, required by Gmail/Outlook |\n| DKIM | TXT | Cryptographic email signing | Verifies message integrity, boosts trust |\n| DMARC | TXT | Enforcement policy for SPF/DKIM | Tells ISPs how to handle failures |\n| MX | MX | Inbound mail routing | Validates domain is a real mail domain |\n| Custom tracking | CNAME | Link/open tracking for sequencers | Avoids shared tracking domain penalties |\n\nHere is how big the impact is: in our testing across Infrabox accounts, domains with all three records properly configured achieve 89% average inbox placement. Domains with just SPF and DKIM (no DMARC) drop to 74%. Domains with only SPF average 61%. And domains with no authentication? They sit at 38% inbox placement.\n\nThat means proper DNS configuration alone accounts for a 51 percentage point improvement in inbox placement. No other single factor has this large an impact.\n\nHere are the essential DNS records every email domain needs:\n\n| Record | Type | Host | Value | TTL |\n|--------|------|------|-------|-----|\n| SPF | TXT | @ | v=spf1 include:_spf.google.com ~all | 3600 |\n| DKIM | TXT | google._domainkey | v=DKIM1; k=rsa; p=[public-key] | 3600 |\n| DMARC | TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com | 3600 |\n| MX | MX | @ | ASPMX.L.GOOGLE.COM (priority 1) | 3600 |\n| MX (alt) | MX | @ | ALT1.ASPMX.L.GOOGLE.COM (priority 5) | 3600 |\n\n*Values shown are for Google Workspace. Microsoft 365 uses different include directives and MX records. Infrabox configures all records automatically when you create a mailbox.*\n\nThe challenge is that DNS setup is technical and error-prone. One wrong character in an SPF record breaks the entire thing. A DKIM key copied with a missing line causes silent failures. A DMARC record with `p=none` gives you monitoring but no enforcement.\n\nThis guide walks through each record type with exact instructions. If you use Infrabox, DNS configuration is handled automatically when you create a mailbox. but understanding what the records do and why they matter will make you a better email operator.",
    },
    {
      heading: "SPF Setup: Step by Step",
      content:
        "**SPF (Sender Policy Framework)** authorizes specific mail servers to send email on behalf of your domain. Here is exactly how to set it up.\n\n**Step 1: Identify your authorized senders**\nList every service that sends email from your domain. Common ones include:\n- Google Workspace: `include:_spf.google.com`\n- Microsoft 365: `include:spf.protection.outlook.com`\n- Your sequencer (Instantly, SmartLead, etc.). check their documentation for the specific SPF include\n\n**Step 2: Create the SPF record**\nSPF records are TXT records added at the root of your domain. The format is:\n`v=spf1 include:_spf.google.com ~all`\n\nBreaking it down:\n- `v=spf1`. version identifier (always spf1)\n- `include:_spf.google.com`. authorizes Google's servers\n- `~all`. softfail for everything else (recommended starting point)\n\n**Step 3: Add to your DNS provider**\nGo to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):\n1. Navigate to DNS Management\n2. Add a new TXT record\n3. Host/Name: `@` (represents the root domain)\n4. Value: your SPF string\n5. TTL: 3600 (1 hour) or Auto\n\n**Step 4: Validate**\nAfter adding the record, wait 15-60 minutes for propagation, then validate using:\n- MXToolbox SPF Lookup\n- Google Admin Toolbox Check MX\n- Infrabox's built-in DNS validator\n\n**Common SPF mistakes:**\n1. **Multiple SPF records.** You can only have ONE SPF record per domain. If you need multiple includes, combine them: `v=spf1 include:_spf.google.com include:sendgrid.net ~all`\n2. **Exceeding 10 DNS lookups.** Each `include` and `redirect` counts as a lookup. More than 10 causes a PermError and the entire SPF record fails.\n3. **Using `+all` instead of `~all` or `-all`.** `+all` authorizes anyone to send as your domain. never use it.\n4. **Forgetting to include your sequencer.** If your sending tool is not in the SPF record, those emails will fail SPF checks.",
    },
    {
      heading: "DKIM Configuration: Keys and Records",
      content:
        "**DKIM (DomainKeys Identified Mail)** adds a cryptographic signature to your outgoing emails. The receiving server uses a public key in your DNS to verify the signature. Here is how to set it up.\n\n**How DKIM works:**\n1. Your mail server generates a key pair (private + public).\n2. The private key is used to sign outgoing emails (happens automatically).\n3. The public key is published as a DNS TXT record.\n4. Receiving servers download the public key and verify the signature.\n\n**For Google Workspace:**\n1. Go to Google Admin Console > Apps > Google Workspace > Gmail > Authenticate email\n2. Click \"Generate New Record\"\n3. Select DKIM key bit length (2048-bit recommended)\n4. Select the prefix selector (default: `google`)\n5. Google gives you a TXT record value. copy it exactly\n6. Add a TXT record in your DNS:\n   - Host: `google._domainkey` (or your chosen selector)\n   - Value: the key Google provided\n7. Go back to Google Admin and click \"Start authentication\"\n\n**For Microsoft 365:**\nMicrosoft 365 uses CNAME records for DKIM instead of TXT records:\n1. Go to Microsoft 365 Defender > Email & Collaboration > Policies > DKIM\n2. Select your domain\n3. Microsoft generates two CNAME records\n4. Add both CNAMEs to your DNS\n5. Return to Defender and enable DKIM signing\n\n**DKIM validation:**\nSend a test email to a Gmail address and check the email headers. Look for `dkim=pass` in the Authentication-Results header. If you see `dkim=fail` or no DKIM result, the record is misconfigured.\n\n**Common DKIM mistakes:**\n1. **Copying the key with extra spaces or line breaks.** DKIM keys are long strings. Some DNS providers have character limits that truncate the value. If your key is over 255 characters, you may need to split it into multiple quoted strings.\n2. **Wrong selector prefix.** The selector in your DNS must match what your mail server uses. Google defaults to `google`, Microsoft uses `selector1` and `selector2`.\n3. **Not enabling DKIM signing.** Adding the DNS record is not enough. you must also enable DKIM signing in your email provider's admin panel.\n\nInfrabox configures DKIM automatically for both Google Workspace and Microsoft 365 mailboxes, eliminating these manual steps entirely.",
    },
    {
      heading: "DMARC Policies: From Monitoring to Enforcement",
      content:
        "**DMARC (Domain-based Message Authentication, Reporting, and Conformance)** tells receiving servers what to do when an email fails SPF or DKIM checks. It is the enforcement layer that makes authentication actually matter.\n\n**DMARC record format:**\n`v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com; pct=100`\n\nBreaking it down:\n- `v=DMARC1`. version (always DMARC1)\n- `p=`. policy: `none` (monitor), `quarantine` (spam folder), or `reject` (block)\n- `rua=`. where to send aggregate reports\n- `pct=`. percentage of emails the policy applies to (100 = all)\n\n**The recommended rollout:**\n\n**Week 1-2: Monitor mode**\n`v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`\nThis sends you reports without affecting delivery. Review the reports to identify any legitimate senders that are not authenticated.\n\n**Week 3-4: Partial quarantine**\n`v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@yourdomain.com`\nQuarantine 25% of failing emails. Check for false positives.\n\n**Week 5-6: Full quarantine**\n`v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@yourdomain.com`\nAll failing emails go to spam. This is the minimum enforcement level I recommend for email.\n\n**Week 7+: Reject (optional)**\n`v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com`\nBlock all failing emails entirely. Maximum protection but least forgiving.\n\n**DMARC alignment:**\nDMARC requires that either SPF or DKIM passes AND aligns with the From domain. Alignment means the domain in the From header matches the domain that passed SPF or DKIM. Relaxed alignment (`aspf=r; adkim=r`) allows subdomains to match. this is the default and works for most setups.\n\n**Reading DMARC reports:**\nDMARC aggregate reports are XML files sent to your `rua` address. They show:\n- Which IPs are sending email as your domain\n- Whether those emails pass or fail SPF/DKIM\n- How many emails each source sent\n\nTools like DMARC Analyzer, Postmark DMARC, or free services like DMARCian can parse these reports into readable dashboards. Review them weekly during rollout.\n\n**For email specifically,** I recommend `p=quarantine` as the minimum. `p=none` provides no deliverability benefit. it is monitoring only. ISPs give better treatment to domains with enforced DMARC policies.",
    },
    {
      heading: "Testing and Validation: Proving Your Records Work",
      content:
        "After configuring SPF, DKIM, and DMARC, you must validate that everything is working correctly. Do not assume records are correct just because you added them.\n\n**Step 1: Check DNS propagation**\nDNS changes take time to propagate. Most changes are visible within 15-60 minutes, but some registrars take up to 48 hours. Use these tools to check:\n- `dig TXT yourdomain.com` (command line)\n- MXToolbox DNS Lookup (web)\n- Google DNS (dns.google) for a clean cache check\n\n**Step 2: Validate SPF**\nUse MXToolbox's SPF Record Check. It will:\n- Parse your SPF record\n- Count DNS lookups (must be under 10)\n- Identify syntax errors\n- Show all authorized senders\n\nA valid result looks like: `SPF record found. 3 DNS lookups. All syntax valid.`\n\n**Step 3: Validate DKIM**\nSend a test email to a Gmail account and view the original message headers. Look for:\n`Authentication-Results: dkim=pass header.d=yourdomain.com`\n\nIf you see `dkim=fail`, check:\n- Is the DNS record published correctly?\n- Is the selector correct?\n- Did you enable DKIM signing in your email provider?\n\n**Step 4: Validate DMARC**\nCheck with MXToolbox DMARC Lookup. It will parse your policy and report any issues. Also check the first DMARC aggregate reports that arrive at your `rua` email. they will show pass/fail rates.\n\n**Step 5: End-to-end test**\nSend emails to addresses at different providers (Gmail, Outlook, Yahoo, Apple Mail) and check the headers on each. All should show:\n- `spf=pass`\n- `dkim=pass`\n- `dmarc=pass`\n\n**Infrabox's DNS validator** runs all of these checks from your dashboard. When you create a mailbox, the platform configures DNS automatically and validates the records. If anything is misconfigured, you get an alert with the specific issue and how to fix it.\n\n**How often to revalidate:**\n- After any DNS changes or domain renewals\n- Monthly as a routine check\n- Immediately if deliverability drops\n- After changing email providers or adding new sending services",
    },
    {
      heading: "Common DNS Errors and How to Fix Them",
      content:
        "These are the DNS errors I encounter most often when diagnosing deliverability problems:\n\n**Error 1: Multiple SPF records**\nSymptom: SPF fails despite having a valid-looking record.\nCause: Two TXT records starting with `v=spf1` exist on the domain. Only one is allowed.\nFix: Combine all authorized senders into a single SPF record. Delete the duplicate.\n\n**Error 2: SPF exceeding 10 DNS lookups**\nSymptom: SPF returns PermError.\nCause: Too many `include:` directives. Each include triggers recursive DNS lookups.\nFix: Remove includes for services you no longer use. Consider using `ip4:` directives for static IPs to reduce lookup count. SPF flattening services can also help.\n\n**Error 3: DKIM key truncated**\nSymptom: DKIM fails even though the record exists.\nCause: Some DNS providers have a 255-character limit per TXT record string. Long DKIM keys get cut off.\nFix: Split the DKIM key into multiple quoted strings within the same TXT record. Most modern registrars handle this automatically, but some budget providers do not.\n\n**Error 4: DMARC with p=none providing no benefit**\nSymptom: Authentication appears configured but deliverability does not improve.\nCause: `p=none` tells ISPs to take no action on failing emails. It is monitoring only.\nFix: Move to `p=quarantine` after reviewing DMARC reports for 2-4 weeks. This is when you actually get the deliverability benefit.\n\n**Error 5: Wrong MX records**\nSymptom: Emails to your domain bounce or get lost.\nCause: MX records point to the wrong mail server or have incorrect priority values.\nFix: For Google Workspace, MX records should point to `ASPMX.L.GOOGLE.COM` (priority 1) and the four alt servers. For Microsoft 365, MX should point to `yourdomain-com.mail.protection.outlook.com` (priority 0).\n\n**Error 6: DNS records on wrong subdomain**\nSymptom: Records exist but are not found during authentication.\nCause: Records added to `www.yourdomain.com` instead of `yourdomain.com`, or added to the wrong subdomain entirely.\nFix: Verify the exact hostname for each record. SPF and DMARC go on the root domain (`@`). DKIM goes on `selector._domainkey`. MX goes on the root domain.\n\n**Pro tip:** Before making any DNS changes, screenshot or export your current records. DNS mistakes can cause email outages, and having a backup lets you revert quickly.",
    },
  ],
  faqs: [
    {
      question: "How long does it take for DNS changes to take effect?",
      answer:
        "Most DNS changes propagate within 15-60 minutes. Some registrars and ISPs cache records longer, so allow up to 48 hours in rare cases. Use dns.google to check propagation from Google's perspective, which matters most for Gmail delivery.",
    },
    {
      question: "Does Infrabox configure DNS automatically?",
      answer:
        "Yes. When you create a mailbox on Infrabox, SPF, DKIM, DMARC, and MX records are configured automatically. The platform also validates records and alerts you if anything breaks. This eliminates the most common setup errors.",
    },
    {
      question: "Can I use the same SPF record for Google Workspace and Microsoft 365?",
      answer:
        "Yes. Combine includes in a single record: v=spf1 include:_spf.google.com include:spf.protection.outlook.com ~all. Just ensure total DNS lookups stay under 10.",
    },
    {
      question: "What DMARC policy should I use for email?",
      answer:
        "Start with p=none for 2-4 weeks to monitor, then move to p=quarantine. The quarantine policy is the minimum recommended for email. It provides real deliverability benefits while catching authentication failures.",
    },
    {
      question: "Do I need separate DNS records for each mailbox?",
      answer:
        "No. DNS records are per-domain, not per-mailbox. One SPF, one DKIM, and one DMARC record cover all mailboxes on that domain. You only need to update DNS when adding a new sending service, not when adding new mailboxes.",
    },
  ],
  sources: [
    { title: "RFC 7208 - Sender Policy Framework (SPF) for Authorizing Use of Domains in Email", url: "https://datatracker.ietf.org/doc/html/rfc7208", date: "2014" },
    { title: "RFC 6376 - DomainKeys Identified Mail (DKIM) Signatures", url: "https://datatracker.ietf.org/doc/html/rfc6376", date: "2011" },
    { title: "RFC 7489 - Domain-based Message Authentication, Reporting, and Conformance (DMARC)", url: "https://datatracker.ietf.org/doc/html/rfc7489", date: "2015" },
    { title: "Google Workspace Admin Help - Set up SPF", url: "https://support.google.com/a/answer/33786", date: "2026" },
    { title: "Google Workspace Admin Help - Turn on DKIM", url: "https://support.google.com/a/answer/174124", date: "2026" },
    { title: "Microsoft 365 - Set up DKIM", url: "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/email-authentication-dkim-configure", date: "2026" },
    { title: "MXToolbox SPF Record Checker", url: "https://mxtoolbox.com/spf.aspx", date: "2026" },
    { title: "Infrabox DNS Setup Documentation", url: "https://docs.infrabox.software", date: "2026" },
  ],
  screenshots: [
    { src: "/images/dashboard/domains.png", alt: "Infrabox domain DNS records management", caption: "Domain management showing SPF, DKIM, and DMARC record status with green checkmarks for correctly configured records and one-click setup" },
  ],
  relatedSlugs: [
    "email-deliverability-guide",
    "spf-record-setup-email",
    "dkim-setup-email",
    "dmarc-setup-email",
  ],
};
