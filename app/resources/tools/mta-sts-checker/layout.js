import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free MTA-STS Checker | Validate MTA-STS Policy",
  description: 'Free MTA-STS policy validation tool. Check your Mail Transfer Agent Strict Transport Security (MTA-STS) configuration for secure email delivery.',
  keywords: 'mta-sts checker, mta-sts validator, mail transfer agent security, mta-sts policy checker, email security validation, smtp transport security',
  path: '/resources/tools/mta-sts-checker'
});

export default function MtaStsCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox MTA-STS Checker",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to validate MTA-STS configuration and ensure proper TLS enforcement for email delivery."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is MTA-STS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MTA-STS (Mail Transfer Agent Strict Transport Security) is a security standard that allows domain owners to declare their ability to receive Transport Layer Security (TLS) secure SMTP connections and to specify whether sending SMTP servers should refuse to deliver to MX hosts that do not offer TLS with a trusted server certificate."
        }
      },
      {
        "@type": "Question",
        "name": "Why is MTA-STS important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It prevents downgrade attacks and man-in-the-middle attacks by enforcing TLS encryption for email transmission. This ensures that emails are not intercepted or read by unauthorized parties during transit."
        }
      },
      {
        "@type": "Question",
        "name": "How do I implement MTA-STS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Implementation involves publishing a DNS TXT record at _mta-sts.yourdomain.com and hosting a policy file at https://mta-sts.yourdomain.com/.well-known/mta-sts.txt. The policy file specifies the enforcement mode and allowed MX hosts."
        }
      },
      {
        "@type": "Question",
        "name": "What are the MTA-STS modes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "There are three modes: 'none' (MTA-STS is disabled), 'testing' (reports are generated but delivery is not blocked on failure), and 'enforce' (TLS is required, and delivery fails if validation fails)."
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