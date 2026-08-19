export const article = {
  slug: "dkim-setup-email",
  title:
    "How to Set Up DKIM for Email (2026)",
  metaDescription:
    "DKIM setup guide for email. Learn how DKIM works, configure it for Google Workspace and Microsoft 365, and avoid common mistakes that hurt deliverability.",
  headline: "How to Set Up DKIM for Email (2026)",
  publishedAt: "2026-03-30",
  updatedAt: "2026-07-29",
  author: "Saksham Jain",
  category: "Guides",
  readingTime: "10 min read",
  tags: [
    "dkim setup",
    "email authentication",
    "dns configuration",
    "email",
    "deliverability",
  ],
  excerpt:
    "DKIM proves your emails were not tampered with in transit. Without it, inbox placement drops 10-15%. Here is how to set it up correctly for Google Workspace and Microsoft 365.",
  screenshots: [{ src: "/images/dashboard/domains.png", alt: "Infrabox domain management showing DKIM configuration status", caption: "Infrabox domains page displaying DKIM authentication status with green indicators for correctly configured records" }],  type: "educational",
  sections: [
    {
      heading: "What Is DKIM?",
      content:
        "**DKIM (DomainKeys Identified Mail)** adds a cryptographic signature to every email you send. The receiving server uses a public key published in your DNS to verify the signature.\n\nIf verification passes, the receiving server knows two things: **(1)** the email actually came from your domain, and **(2)** the email body and headers were not modified in transit.\n\nWithout DKIM, receiving servers have no way to verify email integrity. In our testing across **2,000+ email mailboxes**, accounts missing DKIM see **10-15% lower inbox placement** compared to properly authenticated accounts. DKIM is not optional. it is a hard requirement for email in 2026.",
    },
    {
      heading: "How DKIM Works",
      content:
        "DKIM operates through a **5-step verification process** that happens on every email you send:\n\n| Step | What Happens | Where |\n|------|-------------|-------|\n| **1** | Your mail server generates a cryptographic hash of the email headers and body | Sending server |\n| **2** | The hash is encrypted with your domain's **private key** and added to the email header as `DKIM-Signature` | Sending server |\n| **3** | The receiving server extracts the DKIM selector from the header and looks up your **public key** in DNS | Receiving server |\n| **4** | The receiving server decrypts the signature using the public key and computes its own hash | Receiving server |\n| **5** | If the hashes match, **DKIM passes**. If not, the email is flagged as potentially spoofed or tampered | Receiving server |\n\nThe signature covers specific headers (From, To, Subject, Date) and the email body. Altering **even a single character** after sending breaks the DKIM signature.",
    },
    {
      heading: "Step-by-Step DKIM Setup: Google Workspace vs Microsoft 365",
      content:
        "Here is the complete DKIM setup process for both providers side by side:\n\n| Step | Google Workspace | Microsoft 365 |\n|------|-----------------|---------------|\n| **1. Access admin panel** | Google Admin Console > Apps > Google Workspace > Gmail > Authentication | Microsoft 365 Admin Center > Settings > Domains |\n| **2. Generate DKIM key** | Click \"Generate New Record\". select **2048-bit** key length | Microsoft auto-generates two CNAME records when you add a domain |\n| **3. Get DNS records** | Copy the TXT record value (starts with v=DKIM1; k=rsa; p=...) | Copy both CNAME records: selector1._domainkey and selector2._domainkey |\n| **4. Record type** | Add a **TXT record** with host google._domainkey | Add **two CNAME records** pointing to selector1-yourdomain-com._domainkey.yourdomain.onmicrosoft.com |\n| **5. Add to DNS** | Add the TXT record at your domain registrar or DNS provider | Add both CNAME records at your domain registrar or DNS provider |\n| **6. Activate** | Return to Google Admin and click **Start Authentication** | Go to Security Center > Threat Management > DKIM and click **Enable** |\n| **7. Propagation** | Wait **1-48 hours** (usually under 4 hours) | Wait **1-48 hours** (usually under 4 hours) |\n| **8. Verify** | Send test email to Gmail, check Show Original for DKIM: PASS | Send test email to Gmail, check Show Original for DKIM: PASS |\n\n**Infrabox automates this entire process.** When you create a Google Workspace mailbox (**\$2.50/mo**) or Microsoft 365 mailbox (**\$2.50/mo**), DKIM records are configured automatically within minutes. Zero manual DNS editing required.\n\n> **Screenshot reference:** See the *domains.png* screenshot in the Infrabox dashboard. the DNS status panel shows real-time SPF, DKIM, and DMARC verification status with green checkmarks for each domain. Any misconfiguration is flagged immediately with a red indicator and one-click fix option.",
    },
    {
      heading: "Common DKIM Mistakes",
      content:
        "These are the **5 most frequent DKIM failures** we see across Infrabox support tickets:\n\n| # | Mistake | Impact | Fix |\n|---|---------|--------|-----|\n| **1** | Not enabling DKIM at all | Emails fail authentication; **10-15%** inbox placement drop | Enable DKIM for every sending domain. all three records (SPF, DKIM, DMARC) are required |\n| **2** | Wrong selector name | DKIM lookup fails silently; receiving servers cannot find your public key | Google uses google._domainkey, Microsoft uses selector1._domainkey. verify the exact selector |\n| **3** | Sending before DNS propagation | DKIM fails for all emails sent before records propagate | Wait **1-4 hours minimum** after adding records; verify with MXToolbox before sending |\n| **4** | Copy-paste errors in key value | A single wrong character breaks the entire cryptographic signature | Use the **raw copy** button in your admin panel; never manually type DKIM values |\n| **5** | Multiple DKIM records for same selector | DNS resolvers may return the wrong record | Only one DKIM record per selector; delete old records before adding new ones |\n\n**Pro tip:** DKIM keys should be **2048-bit** (not 1024-bit). Google defaults to 2048-bit, but some older configurations may still use 1024-bit keys. Upgrade if you have not already.",
    },
    {
      heading: "Verifying DKIM",
      content:
        "Use these **3 verification methods** to confirm DKIM is working correctly:\n\n| Method | How To | Best For |\n|--------|--------|----------|\n| **Gmail Header Check** | Send a test email to a Gmail account > open it > click three dots > Show Original > look for dkim=pass | Quick manual verification of a single mailbox |\n| **MXToolbox DKIM Lookup** | Go to mxtoolbox.com/dkim.aspx > enter your domain and selector (e.g., google for Google Workspace) | Verifying DNS record is published correctly |\n| **Infrabox InfraGuard** | Navigate to InfraGuard in your Infrabox dashboard. DKIM status is checked automatically every few hours | Ongoing automated monitoring across all mailboxes |\n\n**What each DKIM result means:**\n- **DKIM: PASS**. Signature verified. Your emails are authenticated.\n- **DKIM: FAIL**. Signature did not match. Check your DNS record for errors.\n- **DKIM: NONE**. No DKIM signature found. DKIM is not enabled for this mailbox.\n- **DKIM: TEMPERROR**. DNS lookup timed out. Usually a temporary issue; recheck in 1 hour.\n\nInfrabox's InfraGuard monitors DKIM for every mailbox and alerts you immediately if a record breaks or is removed. For teams running **50+ mailboxes**, this automated monitoring replaces hours of manual checking per week.",
    },
  ],
  faqs: [
    {
      question: "Does Infrabox set up DKIM automatically?",
      answer:
        "Yes. DKIM is configured automatically for both Google Workspace and Microsoft 365 mailboxes during provisioning.",
    },
    {
      question: "What happens without DKIM?",
      answer:
        "Emails fail DKIM authentication, which can cause 10-15% lower inbox placement. DMARC policies may also reject or quarantine unsigned emails.",
    },
    {
      question: "How long does DKIM take to propagate?",
      answer:
        "Usually 1-4 hours, can take up to 48 hours. Do not send campaigns until DKIM is verified.",
    },
  ],
  sources: [
    { title: "RFC 6376 - DomainKeys Identified Mail (DKIM) Signatures", url: "https://datatracker.ietf.org/doc/html/rfc6376", date: "2011" },
    { title: "Google Workspace Admin Help - Turn on DKIM for your domain", url: "https://support.google.com/a/answer/174124", date: "2026" },
    { title: "Microsoft 365 - Use DKIM to validate outbound email", url: "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/email-authentication-dkim-configure", date: "2026" },
    { title: "Infrabox DKIM Setup Documentation", url: "https://docs.infrabox.software", date: "2026" },
  ],
  relatedSlugs: [
    "spf-record-setup-email",
    "dmarc-setup-email",
    "email-infrastructure-setup-guide",
  ],
};
