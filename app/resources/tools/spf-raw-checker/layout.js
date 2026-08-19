import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free SPF Raw Syntax Checker: Validate SPF",
  description: 'Free SPF raw syntax checker tool. Validate the syntax and structure of your SPF record text before publishing to DNS for email authentication.',
  keywords: 'spf raw checker, spf syntax validator, spf record syntax check, sender policy framework validation, spf text validator, spf syntax analysis',
  path: '/resources/tools/spf-raw-checker'
});

export default function SpfRawCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox SPF Raw Syntax Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to validate the syntax and structure of your SPF record text before publishing to DNS."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an SPF raw checker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An SPF raw checker allows you to validate the syntax of an SPF record string without needing to publish it to DNS first. This is useful for testing new configurations or debugging complex records before they go live."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply paste your SPF record string (starting with v=spf1) into the text area and click 'Analyze SPF Record'. We will check the syntax, count the number of DNS lookups, and identify any potential errors or warnings."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool check my live DNS record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, this tool analyzes the text you provide. If you want to check the live SPF record published on your domain, please use our standard SPF Checker tool."
        }
      },
      {
        "@type": "Question",
        "name": "Why is syntax validation important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Even a small syntax error in your SPF record can cause email delivery failures. Validating the syntax before publishing ensures that your record is correctly formatted and will be interpreted correctly by receiving mail servers."
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