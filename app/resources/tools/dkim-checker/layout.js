import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free DKIM Checker: Validate DKIM Signatures",
  description: "Free DKIM record checker. Validate DKIM DNS records, public key configuration, key sizes, and selector setup. Auto-detect Google, Microsoft, and SendGrid keys.",
  keywords: 'dkim checker, dkim validator, dkim record checker, domainkeys identified mail, dkim signature validation, email authentication, dns dkim check, dkim selector finder, dkim public key checker, dkim key size, dkim 2048 bit, google dkim, microsoft 365 dkim, sendgrid dkim, dkim troubleshooting, email deliverability, dkim auto detect',
  path: '/resources/tools/dkim-checker'
});

export default function DkimCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox DKIM Record Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to validate DKIM signatures, check public key configuration, analyze key sizes, and auto-detect selectors for email authentication verification."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a DKIM checker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A DKIM checker is a tool that validates the DomainKeys Identified Mail (DKIM) record for a specific domain and selector. It queries DNS for the public key published at selector._domainkey.yourdomain.com, verifies the record syntax, and confirms the key can be used to authenticate email signatures."
        }
      },
      {
        "@type": "Question",
        "name": "How do I find my DKIM selector?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The DKIM selector is usually provided by your email service provider (e.g., 'google' for Google Workspace, 'selector1' for Microsoft 365). You can also find it in the email headers of a message sent from your domain, looking for the 's=' tag in the DKIM-Signature header. Our auto-detect feature scans the most common selectors automatically."
        }
      },
      {
        "@type": "Question",
        "name": "Why is DKIM important for email deliverability?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DKIM adds a cryptographic digital signature to your emails, allowing receiving servers to verify that the message genuinely came from your domain and was not altered in transit. This directly improves inbox placement rates, protects your brand reputation from spoofing, and is required for DMARC alignment."
        }
      },
      {
        "@type": "Question",
        "name": "What if my DKIM check fails?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If the check fails, common causes include: the DKIM record is missing from DNS, the selector is incorrect, the record has syntax errors, the key has been revoked, or DNS propagation hasn't completed. Double-check the selector with your email provider, verify the DNS record, and allow 24-48 hours for propagation."
        }
      },
      {
        "@type": "Question",
        "name": "What key size should I use for DKIM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A 2048-bit RSA key is the recommended minimum for DKIM. While 1024-bit keys still work, they are considered less secure and some providers may flag them. Many email service providers now default to 2048-bit keys."
        }
      },
      {
        "@type": "Question",
        "name": "Can I have multiple DKIM records?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can have multiple DKIM records using different selectors. This is common when you use multiple email services (e.g., Google Workspace for business email and SendGrid for marketing). Each service gets its own selector, and all can coexist without conflict."
        }
      },
      {
        "@type": "Question",
        "name": "How does DKIM differ from SPF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SPF verifies that an email was sent from an authorized IP address, while DKIM verifies that the email content hasn't been tampered with using cryptographic signatures. Both are complementary and work together under DMARC."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if DKIM alignment fails with DMARC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DKIM alignment in DMARC checks that the domain in the DKIM signature (d= tag) matches the From header domain. If alignment fails for both DKIM and SPF, DMARC will apply its policy (none, quarantine, or reject). Relaxed alignment allows subdomain matching, while strict requires exact domain matching."
        }
      },
      {
        "@type": "Question",
        "name": "What is DKIM key rotation and why does it matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DKIM key rotation is the practice of periodically generating new DKIM key pairs and updating your DNS records. This limits the window of exposure if a private key is compromised. Best practice is to rotate keys every 6-12 months."
        }
      },
      {
        "@type": "Question",
        "name": "How long does DKIM DNS propagation take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After adding or updating a DKIM record in DNS, propagation typically takes 15 minutes to 48 hours depending on your DNS provider and the TTL settings. We recommend waiting at least 1 hour before testing, and up to 24 hours for full global propagation."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
