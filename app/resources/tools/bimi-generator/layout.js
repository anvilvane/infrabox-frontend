import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free BIMI Generator: Create BIMI DNS Records",
  description: 'Free BIMI record generator tool. Create Brand Indicators for Message Identification (BIMI) DNS records to display your logo in email clients.',
  keywords: 'bimi generator, bimi record generator, create bimi record, brand indicators message identification, bimi dns generator, email logo display, bimi setup',
  path: '/resources/tools/bimi-generator'
});

export default function BimiGeneratorLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox BIMI Record Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to generate BIMI DNS records and configure email branding settings."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a BIMI record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A BIMI record is a DNS TXT record that points to your logo file and optional VMC certificate, allowing email clients to display your brand logo next to authenticated messages."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a VMC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Verified Mark Certificate (VMC) is required for Gmail and Apple Mail to display your logo. Other providers like Yahoo Mail may display BIMI logos without a VMC, but having one ensures the broadest support."
        }
      },
      {
        "@type": "Question",
        "name": "What are the logo requirements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your logo must be in SVG Tiny Portable/Secure (P/S) format, square aspect ratio (1:1), have a solid background, and be hosted on HTTPS. The file size should not exceed 32KB."
        }
      },
      {
        "@type": "Question",
        "name": "How do I publish the generated record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the generated TXT record and add it to your domain's DNS settings. The host/name should be 'default._bimi' (or 'selector._bimi' if you chose a custom selector) and the value is the generated record string."
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