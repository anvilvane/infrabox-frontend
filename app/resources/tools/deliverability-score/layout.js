import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free Domain Deliverability Score Checker",
  description: 'Professional domain analysis tool to check SPF, DKIM, DMARC, and MX records. Get instant email deliverability score and infrastructure health report.',
  keywords: 'domain analysis, email deliverability, SPF checker, DKIM validator, DMARC analyzer, MX records, email infrastructure, Infrabox',
  path: '/resources/tools/deliverability-score'
});

export default function Layout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox Deliverability Score Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to analyze domain email deliverability, check DNS records, and provide actionable recommendations."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an email deliverability score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An email deliverability score is a metric that indicates the likelihood of your emails reaching the recipient's inbox. It's based on factors like DNS configuration, authentication protocols (SPF, DKIM, DMARC), and domain reputation."
        }
      },
      {
        "@type": "Question",
        "name": "How can I improve my deliverability score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To improve your score, ensure you have valid SPF, DKIM, and DMARC records configured. Also, monitor your domain's reputation, avoid sending spam, and maintain a clean email list."
        }
      },
      {
        "@type": "Question",
        "name": "What is a good deliverability score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A score above 90 is considered excellent. Scores between 80-90 are good but may have room for improvement. Scores below 80 indicate potential issues that could lead to emails landing in spam folders."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool check for blacklists?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this tool checks your domain and IP address against major email blacklists to see if you've been flagged for spamming."
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