import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free Domain Health Scanner: Full Analysis",
  description: 'Free domain health scanning tool. Comprehensive analysis of your domain for email deliverability, security, and configuration issues.',
  keywords: 'domain scanner, domain health check, domain analysis tool, email deliverability scanner, domain security scan, dns health check, domain audit',
  path: '/resources/tools/domain-scanner'
});

export default function DomainScannerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox Domain Scanner",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to scan and analyze domain health, security, and email deliverability configuration."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does the Domain Scanner check?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Domain Scanner performs a comprehensive analysis of your domain's email authentication records (SPF, DKIM, DMARC, BIMI), MTA-STS configuration, and other security settings to identify potential issues."
        }
      },
      {
        "@type": "Question",
        "name": "Why is domain health important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A healthy domain configuration is crucial for email deliverability. It ensures your emails are trusted by receiving servers, prevents spoofing, and maintains a good sender reputation."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I scan my domain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It's recommended to scan your domain whenever you make changes to your DNS records or email infrastructure. Regular periodic scans (e.g., monthly) can also help detect any unauthorized changes or issues."
        }
      },
      {
        "@type": "Question",
        "name": "What is a good security score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A score of 8 or higher is considered excellent. Scores below 6 indicate potential security vulnerabilities or misconfigurations that should be addressed to improve deliverability and protection."
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