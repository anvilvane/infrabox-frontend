import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free DNS Validator | Test DNS Configuration",
  description: 'Free DNS validation and testing tool. Comprehensive DNS record analysis and configuration testing for domains and email infrastructure.',
  keywords: 'dns validator, dns testing tool, dns configuration test, domain name system validation, dns record analysis, dns troubleshooting, dns verification',
  path: '/resources/tools/dns-validator'
});

export default function DnsValidatorLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox DNS Validator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to validate and test DNS configuration including SPF, DKIM, and DMARC records."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why is DNS validation important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DNS validation ensures your email authentication records (SPF, DKIM, DMARC) are correctly configured, which is crucial for email deliverability and preventing domain spoofing."
        }
      },
      {
        "@type": "Question",
        "name": "What records does this tool check?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This tool validates SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), DMARC (Domain-based Message Authentication, Reporting, and Conformance), and MX (Mail Exchange) records."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I validate my DNS records?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It's recommended to validate your DNS records whenever you make changes to your email infrastructure or DNS configuration. Regular checks help ensure continuous email deliverability."
        }
      },
      {
        "@type": "Question",
        "name": "Can this tool fix my DNS issues?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While this tool identifies issues and provides recommendations, you'll need to log in to your DNS provider's dashboard (e.g., GoDaddy, Cloudflare, AWS Route53) to make the actual changes."
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