import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free Email Header Analyzer | Parse Email Headers",
  description: 'Free email header analysis tool. Parse and analyze email headers to troubleshoot delivery issues, verify authentication, and track email routing.',
  keywords: 'email header analyzer, email header parser, email troubleshooting tool, email delivery analysis, smtp header analysis, email routing tracker',
  path: '/resources/tools/email-header-analyzer'
});

export default function EmailHeaderAnalyzerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox Email Header Analyzer",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to parse and analyze email headers for authentication, routing, and security verification."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What information is in email headers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Email headers contain technical details about an email's journey, including sender and recipient information, timestamps, authentication results (SPF, DKIM, DMARC), and the path taken through various mail servers."
        }
      },
      {
        "@type": "Question",
        "name": "How do I find email headers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The process varies by email client. In Gmail, open the email, click the three dots, and select 'Show original'. In Outlook, open the email, go to File > Properties. In Apple Mail, press Command+Shift+H."
        }
      },
      {
        "@type": "Question",
        "name": "Why should I analyze email headers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Analyzing headers helps troubleshoot delivery delays, verify if an email is legitimate or spoofed, identify the source of spam, and check if your own emails are passing authentication checks."
        }
      },
      {
        "@type": "Question",
        "name": "Is this tool secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we process the headers locally or securely on our servers to provide the analysis. We do not store the content of your email headers after the analysis is complete."
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