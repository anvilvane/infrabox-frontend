import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free SPF Generator: Create SPF DNS Records",
  description: 'Free SPF record generator tool. Create Sender Policy Framework (SPF) DNS records to authorize mail servers and improve email deliverability.',
  keywords: 'spf generator, spf record generator, create spf record, sender policy framework, spf dns generator, email authentication setup, spf wizard',
  path: '/resources/tools/spf-generator'
});

export default function SpfGeneratorLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox SPF Record Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to generate valid SPF records for your domain to protect against email spoofing."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I create an SPF record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use our free SPF Generator tool. Simply list your authorized IP addresses, include any third-party email services (like Google or Outlook), and choose your policy. The tool will automatically generate the correct TXT record for you."
        }
      },
      {
        "@type": "Question",
        "name": "What should I include in my SPF record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You should include all IP addresses and mail servers that send email on behalf of your domain. This includes your own web servers, office IP addresses, and any third-party services like marketing platforms (Mailchimp, HubSpot) or helpdesk software."
        }
      },
      {
        "@type": "Question",
        "name": "Can I have multiple SPF records?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, a domain must have only one SPF record. If you have multiple sources, you must combine them into a single TXT record. Our generator helps you do this correctly."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between ~all and -all?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "~all (Soft Fail) tells receivers to accept unauthorized emails but mark them as suspicious. -all (Hard Fail) tells receivers to reject unauthorized emails completely. We recommend starting with ~all to avoid delivery issues."
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