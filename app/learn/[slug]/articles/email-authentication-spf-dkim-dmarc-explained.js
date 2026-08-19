export const article = {
  slug: "email-authentication-spf-dkim-dmarc-explained",
  title: "SPF vs DKIM vs DMARC Explained (2026)",
  metaDescription:
    "SPF, DKIM, and DMARC email authentication explained. How each protocol works, why they matter for email, and real DNS record examples.",
  headline: "SPF vs DKIM vs DMARC: Email Authentication Explained",
  publishedAt: "2026-03-31",
  updatedAt: "2026-03-31",
  author: "Rahul Lakhaney",
  category: "Guides",
  readingTime: "8 min read",
  tags: ["SPF", "DKIM", "DMARC", "email authentication", "DNS records", "deliverability"],
  excerpt:
    "SPF verifies the sending server, DKIM verifies the message wasn't tampered with, and DMARC tells receivers what to do when checks fail. Here's how they work together with real DNS record examples.",
  type: "educational",
  screenshots: [
    { src: "/images/dashboard/domains.png", alt: "Infrabox domains with SPF DKIM DMARC status", caption: "Infrabox domains page showing green SPF, DKIM, DMARC indicators for all 287 domains. All records configured automatically during setup." },
  ],
  sections: [
    {
      heading: "The Three Layers of Email Authentication",
      content:
        "Email authentication has three protocols that work together. Each solves a different problem:\n\n| Protocol | What It Verifies | Analogy | DNS Record Type |\n|----------|-----------------|---------|----------------|\n| **SPF** | Is this server allowed to send for this domain? | Return address on an envelope | TXT at domain root |\n| **DKIM** | Was this message tampered with in transit? | Wax seal on a letter | TXT at selector._domainkey |\n| **DMARC** | What should happen when SPF or DKIM fails? | Instructions to the post office | TXT at _dmarc.domain |\n\n**Why all three matter for email:**\n- Without SPF: Receivers can't verify you're authorized to send. Gmail rejects unauthenticated mail since February 2024 (source: blog.google/products/gmail/gmail-security-authentication-spam-protection).\n- Without DKIM: Your emails can be modified in transit. Some providers add spam warnings to unsigned messages.\n- Without DMARC: You have no control over what happens to spoofed emails using your domain. This damages your domain reputation even if YOU aren't the spammer.\n\n**Infrabox configures all three automatically** when you add a domain. The screenshot above shows SPF, DKIM, and DMARC green indicators on all active domains.",
    },
    {
      heading: "SPF (Sender Policy Framework)",
      content:
        "SPF tells receiving servers which IP addresses and mail servers are authorized to send email on behalf of your domain.\n\n**How it works:**\n1. You publish a TXT record listing authorized senders\n2. Receiving server looks up your SPF record\n3. Checks if the sending server's IP matches\n4. Passes or fails the check\n\n**Example SPF records:**\n\n| Provider | SPF Record | Source |\n|----------|-----------|--------|\n| Google Workspace | `v=spf1 include:_spf.google.com ~all` | support.google.com/a/answer/33786 |\n| Microsoft 365 | `v=spf1 include:spf.protection.outlook.com ~all` | learn.microsoft.com/en-us/microsoft-365/security/office-365-security/email-authentication-spf-configure |\n| Both (mixed) | `v=spf1 include:_spf.google.com include:spf.protection.outlook.com ~all` | Combined |\n\n**SPF qualifiers explained:**\n\n| Qualifier | Meaning | Use Case |\n|-----------|---------|----------|\n| `+all` | Allow everything | Never use. defeats the purpose |\n| `~all` | Soft fail (accept but mark) | Recommended during setup |\n| `-all` | Hard fail (reject) | Strictest. use after testing |\n| `?all` | Neutral | Not recommended |\n\n**Common SPF mistake:** Having more than 10 DNS lookups. Each `include:` counts as a lookup. If you exceed 10, SPF fails entirely (source: RFC 7208, Section 4.6.4).\n\n**Infrabox's approach:** We set the correct SPF record for your mailbox type (Google or Microsoft) automatically. No manual DNS editing required.",
    },
    {
      heading: "DKIM (DomainKeys Identified Mail)",
      content:
        "DKIM adds a cryptographic signature to every email you send. The receiving server verifies the signature using your public key published in DNS.\n\n**How it works:**\n1. Your mail server signs each email with a private key\n2. The signature is added as a DKIM-Signature header\n3. Receiving server retrieves your public key from DNS\n4. Verifies the signature matches. proving the email wasn't modified\n\n**DKIM key sizes:**\n\n| Key Size | Security | Compatibility | Recommendation |\n|----------|----------|---------------|----------------|\n| 1024-bit | Adequate | Universal | Minimum acceptable |\n| 2048-bit | Strong | Most providers | **Recommended** (Google default) |\n| 4096-bit | Very strong | Some DNS limits | Overkill for email |\n\n**Source:** Google recommends 2048-bit keys (support.google.com/a/answer/174124). Microsoft 365 also uses 2048-bit by default.\n\n**What DKIM looks like in DNS:**\n```\nselector._domainkey.yourdomain.com TXT \"v=DKIM1; k=rsa; p=MIIBIjAN...\"\n```\n\nThe `selector` is a label chosen by your email provider. Google uses `google` as the default selector. Microsoft uses `selector1` and `selector2`.\n\n**Infrabox generates and publishes DKIM keys automatically** for both Google Workspace and Microsoft 365 accounts during provisioning.",
    },
    {
      heading: "DMARC (Domain-based Message Authentication)",
      content:
        "DMARC builds on SPF and DKIM. It tells receiving servers what to do when authentication fails AND sends you reports about who's using your domain to send email.\n\n**DMARC policies:**\n\n| Policy | Action on Failure | Risk Level | When to Use |\n|--------|------------------|------------|-------------|\n| `p=none` | Monitor only (deliver anyway) | Reports only | **Start here**. first 2 weeks |\n| `p=quarantine` | Send to spam folder | Medium enforcement | After 2 weeks of clean reports |\n| `p=reject` | Block the email entirely | Full enforcement | After 30 days, for maximum protection |\n\n**Example DMARC records:**\n\n| Stage | Record | What Happens |\n|-------|--------|-------------|\n| Monitoring | `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com` | Collect reports, deliver all mail |\n| Gradual | `v=DMARC1; p=quarantine; pct=50; rua=mailto:dmarc@yourdomain.com` | Quarantine 50% of failing mail |\n| Full | `v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com` | Block all failing mail |\n\n**Source:** Google requires at minimum `p=none` for bulk senders since February 2024 (support.google.com/a/answer/2466580). The RFC is at tools.ietf.org/html/rfc7489.\n\n**DMARC alignment:**\nDMARC checks that the domain in the From header aligns with either SPF or DKIM. There are two modes:\n\n| Mode | SPF Check | DKIM Check | Strictness |\n|------|-----------|------------|------------|\n| Relaxed (`aspf=r`) | Subdomain OK | Subdomain OK | Default, recommended |\n| Strict (`aspf=s`) | Exact match only | Exact match only | Can break forwarding |\n\n**Infrabox sets `p=none` by default** during domain setup, giving you monitoring without risk. You can upgrade to `p=quarantine` or `p=reject` through the dashboard once you've verified no legitimate mail is failing.",
    },
    {
      heading: "How SPF + DKIM + DMARC Work Together",
      content:
        "The three protocols create a chain of trust:\n\n| Step | Check | Question Answered | If It Fails |\n|------|-------|-------------------|-------------|\n| 1 | SPF | Is this server authorized? | DMARC policy applies |\n| 2 | DKIM | Was the message modified? | DMARC policy applies |\n| 3 | DMARC Alignment | Does the From domain match? | DMARC policy applies |\n| 4 | DMARC Policy | What to do with failures? | none/quarantine/reject |\n\n**A message passes DMARC if:**\n- SPF passes AND aligns with From domain, **OR**\n- DKIM passes AND aligns with From domain\n\nIt doesn't need both. just one aligned pass is enough. This is important because email forwarding often breaks SPF but preserves DKIM.\n\n**Impact on deliverability (from Validity 2025 Benchmark Report):**\n\n| Authentication Level | Average Inbox Placement | Source |\n|---------------------|------------------------|--------|\n| None | 23-45% | Validity 2025 |\n| SPF only | 55-70% | Validity 2025 |\n| SPF + DKIM | 72-85% | Validity 2025 |\n| SPF + DKIM + DMARC (reject) | 85-95% | Validity 2025 / Infrabox data |\n\nThe difference between no authentication and full authentication is **~60 percentage points** of inbox placement. For email, this is the difference between campaigns that work and campaigns that go entirely to spam.\n\n**Infrabox automates the entire chain.** Every domain gets SPF, DKIM, and DMARC configured in under 10 minutes. The domains dashboard shows real-time status for all three protocols across every domain (see screenshot).",
    },
  ],
  faqs: [
    { question: "Do I need all three (SPF, DKIM, DMARC)?", answer: "Yes. Google requires SPF or DKIM for all senders, and DMARC for bulk senders (5,000+/day). For email, you should have all three. Infrabox configures them automatically." },
    { question: "What happens if SPF fails but DKIM passes?", answer: "The email can still pass DMARC if the DKIM domain aligns with the From domain. This is common with forwarded emails where SPF breaks but DKIM signature survives." },
    { question: "How long does it take for DNS records to propagate?", answer: "Typically 15 minutes to 48 hours, depending on TTL settings. Infrabox domains usually propagate within 30 minutes because we use low TTL values during initial setup." },
    { question: "Can I have SPF records for both Google and Microsoft?", answer: "Yes. Use: v=spf1 include:_spf.google.com include:spf.protection.outlook.com ~all. Just make sure total DNS lookups stay under 10 (RFC 7208 limit)." },
    { question: "What DMARC policy should I start with?", answer: "Start with p=none (monitoring). After 2 weeks of clean DMARC reports, move to p=quarantine. After 30 days, move to p=reject for maximum protection. Infrabox starts with p=none by default." },
  ],
  sources: [
    { title: "RFC 7208: Sender Policy Framework (SPF)", url: "https://tools.ietf.org/html/rfc7208", date: "2014" },
    { title: "RFC 6376: DomainKeys Identified Mail (DKIM)", url: "https://tools.ietf.org/html/rfc6376", date: "2011" },
    { title: "RFC 7489: Domain-based Message Authentication (DMARC)", url: "https://tools.ietf.org/html/rfc7489", date: "2015" },
    { title: "Google Workspace DKIM Setup", url: "https://support.google.com/a/answer/174124", date: "2026" },
    { title: "Infrabox DNS Configuration Documentation", url: "https://www.infrabox.software/resources/tools/dns-checker", date: "2026" },
  ],
  relatedSlugs: ["dkim-setup-email", "dmarc-setup-email", "spf-record-setup-email"],
};
