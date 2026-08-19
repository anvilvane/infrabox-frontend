import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free DMARC Generator: Create DMARC Records",
  description: 'Free DMARC policy generator tool. Create Domain-based Message Authentication (DMARC) DNS records and configure email security policies.',
  keywords: 'dmarc generator, dmarc policy generator, create dmarc record, domain message authentication, dmarc dns generator, email security policy, dmarc setup',
  path: '/resources/tools/dmarc-generator'
});

export default function DmarcGeneratorLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox DMARC Record Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to generate DMARC DNS records and configure email authentication policies."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a DMARC record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A DMARC record is a DNS TXT record that tells email receivers what to do if an email fails SPF or DKIM authentication. It also specifies where to send reports about authentication results."
        }
      },
      {
        "@type": "Question",
        "name": "Which policy should I choose?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start with 'p=none' (monitoring mode) to collect data without affecting email delivery. Once you've verified your legitimate email sources, move to 'p=quarantine' (send failures to spam), and finally 'p=reject' (block failures) for maximum security."
        }
      },
      {
        "@type": "Question",
        "name": "What are RUA and RUF reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RUA (Aggregate) reports provide a daily summary of email traffic and authentication results. RUF (Forensic) reports provide detailed information about individual authentication failures. We recommend always setting up RUA reports."
        }
      },
      {
        "@type": "Question",
        "name": "How do I publish the generated record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the generated TXT record and add it to your domain's DNS settings. The host/name should be '_dmarc' (or '_dmarc.yourdomain.com' depending on your provider) and the value is the record starting with 'v=DMARC1'."
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