export const article = {
  slug: "bimi-setup-guide",
  title: "BIMI Setup Guide: Show Your Logo in Inbox (2026)",
  metaDescription:
    "BIMI record setup guide: SVG logo requirements, VMC certificates, DNS configuration, provider support, and verification with Infrabox's BIMI checker.",
  headline: "BIMI Record Setup Guide (2026)",
  publishedAt: "2026-03-31",
  updatedAt: "2026-03-31",
  author: "Rahul Lakhaney",
  category: "Guides",
  readingTime: "15 min read",
  tags: [
    "BIMI",
    "brand indicators",
    "email branding",
    "VMC certificate",
    "email authentication",
    "DNS records",
    "deliverability",
  ],
  excerpt:
    "BIMI (Brand Indicators for Message Identification) displays your logo next to emails in recipients' inboxes. It requires DMARC enforcement, a properly formatted SVG logo, and optionally a VMC certificate. Here is how to set it up.",
  type: "educational",
  sections: [
    {
      heading: "What Is BIMI and Why It Matters for Email",
      content:
        "**BIMI (Brand Indicators for Message Identification)** is a DNS-based email standard that allows senders to display their brand logo next to emails in supported inboxes. When a recipient sees your email in Gmail, Apple Mail, or Yahoo, your company logo appears instead of a generic avatar.\n\nFor email, BIMI provides two benefits:\n\n1. **Visual trust signal.** A branded logo increases perceived legitimacy. Recipients are less likely to ignore or report an email that shows a professional logo.\n2. **Indirect deliverability benefit.** BIMI requires DMARC enforcement (p=quarantine or p=reject), which itself improves deliverability. The BIMI setup process forces you to complete your authentication stack.\n\n| Provider | BIMI Support | VMC Required | Notes |\n|----------|-------------|-------------|-------|\n| **Gmail** | Yes (since 2021) | Yes, required | Only shows logo with valid VMC |\n| **Apple Mail** | Yes (since iOS 16) | Yes, required | Full BIMI support including VMC |\n| **Yahoo Mail** | Yes (since 2018) | No, optional | Shows logo without VMC |\n| **Fastmail** | Yes | No, optional | Shows logo without VMC |\n| **Microsoft Outlook** | Partial (2025+) | TBD | Rolling out gradually |\n| **AOL** | Yes | No, optional | Shows logo without VMC |\n\n**The catch:** Gmail and Apple Mail. the two largest email clients. require a VMC (Verified Mark Certificate), which costs $1,000-1,500/year. This makes BIMI primarily valuable for brands with established budgets. For email operations, the authentication requirements (DMARC enforcement) deliver the real value.\n\nSource: [BIMI Group Official Specification](https://bimigroup.org/), [RFC 9495 - BIMI](https://datatracker.ietf.org/doc/html/rfc9495)",
      callout: {
        variant: "info",
        title: "BIMI Without VMC",
        text: "Yahoo, Fastmail, and AOL display your BIMI logo without a VMC. If your audience uses these providers, you can get BIMI branding benefits for free (just DNS + SVG logo). Gmail and Apple Mail require the paid VMC certificate.",
      },
    },
    {
      heading: "Prerequisites: DMARC Enforcement Required",
      content:
        "BIMI will not work without DMARC enforcement. Your domain must have a DMARC policy of `p=quarantine` or `p=reject`. A `p=none` policy is not sufficient.\n\n**Required authentication stack:**\n\n| Requirement | Status Needed | How to Check |\n|-------------|--------------|-------------|\n| **SPF** | Passing | MXToolbox SPF checker or Infrabox DNS validator |\n| **DKIM** | Passing | Send test email, check Authentication-Results header |\n| **DMARC** | p=quarantine or p=reject | MXToolbox DMARC checker or Infrabox DNS validator |\n| **DMARC alignment** | SPF or DKIM aligned | DMARC aggregate reports |\n\nIf your DMARC is currently at `p=none`, you need to progress through the enforcement rollout before implementing BIMI:\n\n1. **Week 1-2:** Monitor DMARC reports at `p=none`\n2. **Week 3-4:** Move to `p=quarantine; pct=25`\n3. **Week 5-6:** Increase to `p=quarantine; pct=100`\n4. **Week 7+:** Optionally move to `p=reject`\n5. **After enforcement is stable:** Implement BIMI\n\nInfrabox configures DMARC automatically for all mailboxes. Check your current DMARC status in the [Infrabox domains dashboard](https://docs.infrabox.software) or use Infrabox's free [DMARC checker tool](/resources/tools/dmarc-checker).",
      callout: {
        variant: "warning",
        title: "Do Not Rush DMARC Enforcement",
        text: "Moving to p=reject too quickly can block legitimate emails from third-party services you have not authenticated. Always monitor DMARC reports for 2-4 weeks at p=quarantine before considering p=reject.",
      },
    },
    {
      heading: "Creating Your BIMI SVG Logo",
      content:
        "BIMI has strict requirements for the logo file format. A regular SVG from your website will not work.\n\n**BIMI SVG requirements:**\n\n| Requirement | Specification | Notes |\n|-------------|--------------|-------|\n| **Format** | SVG Tiny Portable/Secure (SVG P/S) | Not standard SVG |\n| **Size** | Square aspect ratio | Must be perfectly square |\n| **Background** | Solid, non-transparent | Transparent backgrounds not allowed |\n| **File size** | Under 32 KB | Keep it simple |\n| **Content** | Logo only | No text, animations, or external references |\n| **Encoding** | Base64 is not allowed | Must be valid SVG XML |\n| **viewBox** | Required | Must include viewBox attribute |\n| **Scripts** | None | No JavaScript or interactivity |\n\n**Converting your logo to BIMI-compliant SVG:**\n\n1. Start with your logo in SVG or high-res PNG format\n2. Open in a vector editor (Inkscape, Illustrator, Figma)\n3. Ensure it is perfectly square with a solid background\n4. Export as SVG Tiny 1.2\n5. Manually edit the SVG to add the BIMI profile:\n\n```xml\n<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.2\" baseProfile=\"tiny-ps\" viewBox=\"0 0 100 100\">\n  <title>Your Company Name</title>\n  <!-- Your logo paths here -->\n</svg>\n```\n\n6. Validate using Infrabox's [BIMI checker](/resources/tools/bimi-checker) or the BIMI Group's SVG validator\n7. Host the SVG on your domain over HTTPS (e.g., `https://yourdomain.com/bimi/logo.svg`)\n\n**Common SVG mistakes:** Using standard SVG instead of SVG Tiny P/S, including `<script>` tags, using external font references, or having a transparent background.",
    },
    {
      heading: "VMC Certificates: When You Need One",
      content:
        "A **VMC (Verified Mark Certificate)** is a digital certificate that verifies your organization owns the trademark associated with your BIMI logo. Gmail and Apple Mail require a VMC to display your logo.\n\n**VMC certificate providers and pricing:**\n\n| Provider | Annual Cost | Trademark Required | Validation Time |\n|----------|-----------|-------------------|----------------|\n| **DigiCert** | ~$1,499/year | Yes (registered trademark) | 2-4 weeks |\n| **Entrust** | ~$1,299/year | Yes (registered trademark) | 2-4 weeks |\n\n**Requirements for VMC:**\n- A registered trademark for your logo (USPTO, EUIPO, or equivalent)\n- The trademarked logo must match your BIMI SVG exactly\n- Organization validation (similar to EV SSL certificates)\n- Valid DMARC with enforcement (p=quarantine or p=reject)\n\n**Do you need a VMC?** It depends on your audience and goals:",
      proscons: {
        pros: [
          "Logo displays in Gmail (60%+ of email users)",
          "Logo displays in Apple Mail (iOS 16+)",
          "Strongest possible brand recognition",
          "Additional trust signal for cold outreach",
          "Certificate validates your organization is legitimate",
        ],
        cons: [
          "$1,300-1,500 annual cost per logo",
          "Requires a registered trademark (cost + time to register)",
          "2-4 week validation process",
          "Annual renewal required",
          "Overkill for small operations or testing",
        ],
      },
    },
    {
      heading: "DNS Record Configuration",
      content:
        "The BIMI DNS record is a TXT record added at a specific subdomain of your domain.\n\n**BIMI record format:**\n\n```dns\n; BIMI record without VMC (works on Yahoo, Fastmail, AOL)\ndefault._bimi.yourdomain.com IN TXT \"v=BIMI1; l=https://yourdomain.com/bimi/logo.svg;\"\n\n; BIMI record with VMC (works on Gmail, Apple Mail, and all others)\ndefault._bimi.yourdomain.com IN TXT \"v=BIMI1; l=https://yourdomain.com/bimi/logo.svg; a=https://yourdomain.com/bimi/cert.pem;\"\n```\n\n**Record breakdown:**\n\n| Component | Value | Required |\n|-----------|-------|----------|\n| **Host** | `default._bimi` | Yes |\n| **Type** | TXT | Yes |\n| **v=** | BIMI1 | Yes (version identifier) |\n| **l=** | HTTPS URL to SVG logo | Yes |\n| **a=** | HTTPS URL to VMC certificate (.pem) | Only for Gmail/Apple Mail |\n\n**Step-by-step DNS setup:**\n1. Host your BIMI SVG at a public HTTPS URL on your domain\n2. If using VMC, host the .pem certificate file at a public HTTPS URL\n3. Go to your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.)\n4. Add a TXT record:\n   - **Host/Name:** `default._bimi`\n   - **Value:** Your BIMI string (see format above)\n   - **TTL:** 3600\n5. Wait 15-60 minutes for propagation\n6. Validate using Infrabox's [BIMI checker tool](/resources/tools/bimi-checker)\n\n**Important:** The logo URL must use HTTPS and must be on the same domain (or a subdomain) as the email sender. Cross-domain logo hosting is not recommended.",
    },
    {
      heading: "Verification and Testing",
      content:
        "After setting up your BIMI record, verify everything works:\n\n**Step 1: Validate DNS record**\nUse Infrabox's [BIMI checker](/resources/tools/bimi-checker) or run:\n```\ndig TXT default._bimi.yourdomain.com\n```\n\n**Step 2: Validate SVG format**\nThe BIMI Group provides an SVG validator. Infrabox's BIMI checker also validates the SVG format, checking for Tiny P/S compliance.\n\n**Step 3: Send test emails**\nSend test emails to accounts on different providers and check if the logo appears:\n\n| Provider | Where to Check | Expected Result |\n|----------|---------------|----------------|\n| **Gmail** | Web client, avatar next to sender | Logo shows (VMC required) |\n| **Yahoo Mail** | Inbox list view | Logo shows (no VMC needed) |\n| **Apple Mail** | iOS/macOS sender avatar | Logo shows (VMC required) |\n| **Fastmail** | Inbox sender column | Logo shows (no VMC needed) |\n\n**Step 4: Monitor DMARC reports**\nBIMI will only work for emails that pass DMARC. Monitor your DMARC aggregate reports to ensure alignment stays above 95%.\n\n**Common verification failures:**\n- SVG not accessible at the URL (check HTTPS, CORS headers)\n- SVG not in Tiny P/S format (most common issue)\n- DMARC policy still at p=none\n- VMC certificate expired or not matching the logo\n- DNS record has typos in the hostname (`default._bimi` must be exact)",
    },
    {
      heading: "BIMI for Email: Practical Recommendations",
      content:
        "For email operations, here is my practical recommendation:\n\n**If you are just getting started (under 50 mailboxes):**\nSkip BIMI for now. Focus on SPF, DKIM, and DMARC enforcement. These provide the deliverability foundation. BIMI is cosmetic. it will not help if your authentication is broken.\n\n**If you are scaling (50-200 mailboxes):**\nSet up BIMI without a VMC. It takes 15 minutes and is free. Your logo will display on Yahoo, Fastmail, and AOL. roughly 15% of business email. The DMARC enforcement requirement ensures your authentication is solid.\n\n**If you are an agency or established brand:**\nInvest in a VMC certificate. The $1,300-1,500/year cost is justified when you are sending from branded domains at scale. Your logo appearing in Gmail and Apple Mail increases recognition and reduces spam complaints.\n\n**Cost-benefit analysis at scale:**\n\n| Scale | BIMI Without VMC | BIMI With VMC | Recommendation |\n|-------|-----------------|--------------|----------------|\n| 1-25 mailboxes | Free, 15 min setup | $1,500/year | Without VMC |\n| 25-100 mailboxes | Free, 15 min setup | $1,500/year | Without VMC |\n| 100-500 mailboxes | Free, 15 min setup | $1,500/year | With VMC (if branded domain) |\n| Agency (10+ clients) | Free per client | $1,500/year per client | Per-client decision |\n\nInfrabox's [BIMI checker tool](/resources/tools/bimi-checker) validates your entire BIMI setup. DNS record, SVG format, VMC certificate, and DMARC compliance. in one check.",
      callout: {
        variant: "verdict",
        title: "Recommendation",
        text: "Set up BIMI without a VMC on all your email domains. It is free, takes 15 minutes, and forces DMARC enforcement (which directly improves deliverability). Only invest in VMC certificates for primary brand domains where Gmail/Apple Mail logo display justifies the $1,500/year cost.",
      },
    },
  ],
  faqs: [
    {
      question: "Does BIMI improve email deliverability?",
      answer:
        "BIMI itself does not directly improve deliverability. However, it requires DMARC enforcement (p=quarantine or p=reject), which does improve deliverability. Think of BIMI as a branding bonus that comes with the deliverability benefit of DMARC enforcement.",
    },
    {
      question: "How much does BIMI cost?",
      answer:
        "BIMI without a VMC is free. you just need a compliant SVG logo and a DNS record. BIMI with a VMC (required for Gmail and Apple Mail) costs $1,300-1,500/year for the certificate, plus you need a registered trademark.",
    },
    {
      question: "Can I use BIMI with email domains?",
      answer:
        "Yes, but it makes the most sense for branded primary domains rather than secondary outreach domains. For email, the real value is the DMARC enforcement requirement, which improves deliverability regardless of whether recipients see your logo.",
    },
    {
      question: "Does Infrabox support BIMI?",
      answer:
        "Infrabox provides a free BIMI checker tool that validates your BIMI record, SVG format, VMC certificate, and DMARC compliance. Infrabox also configures DMARC automatically for all mailboxes, which is the primary prerequisite for BIMI.",
    },
    {
      question: "How long does BIMI take to start showing logos?",
      answer:
        "After DNS propagation (15-60 minutes), logos can appear within 24-48 hours. Gmail may take longer as it caches BIMI data. Yahoo typically shows logos fastest. Allow up to a week for full propagation across all supporting providers.",
    },
  ],
  sources: [
    { title: "BIMI Group Official Specification", url: "https://bimigroup.org/", date: "2026" },
    { title: "RFC 9495 - BIMI", url: "https://datatracker.ietf.org/doc/html/rfc9495", date: "2024" },
    { title: "Google BIMI Support Documentation", url: "https://support.google.com/a/answer/10911320", date: "2026" },
    { title: "Apple Mail BIMI Support (iOS 16+)", url: "https://support.apple.com/en-us/HT213155", date: "2022" },
    { title: "DigiCert VMC Certificate", url: "https://www.digicert.com/tls-ssl/verified-mark-certificates", date: "2026" },
    { title: "Entrust VMC Certificate", url: "https://www.entrust.com/digital-security/certificate-solutions/products/digital-signing/verified-mark-certificates", date: "2026" },
    { title: "Infrabox BIMI Checker Tool", url: "https://www.infrabox.software/resources/tools/bimi-checker", date: "2026" },
  ],
  screenshots: [
    { src: "/images/dashboard/domains.png", alt: "Infrabox BIMI checker tool", caption: "Infrabox's BIMI checker validates your BIMI record, SVG logo format, and VMC certificate status in a single check" },
  ],
  relatedSlugs: [
    "dmarc-setup-email",
    "dns-setup-guide",
    "email-deliverability-guide",
    "google-postmaster-tools-guide",
  ],
};
