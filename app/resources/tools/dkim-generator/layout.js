import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free DKIM Record Generator | Create DKIM Keys",
  description: 'Free DKIM record generator tool. Create DomainKeys Identified Mail (DKIM) public/private key pairs and DNS records for email authentication.',
  keywords: 'dkim generator, dkim record generator, create dkim keys, domainkeys identified mail, dkim key pair generator, email authentication setup, dkim dns',
  path: '/resources/tools/dkim-generator'
});

export default function DkimGeneratorLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox DKIM Record Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to generate DKIM keys and DNS records for email authentication."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a DKIM generator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A DKIM generator is a tool that creates the public and private key pairs needed for DomainKeys Identified Mail (DKIM) authentication. It also generates the corresponding DNS TXT record that you need to publish."
        }
      },
      {
        "@type": "Question",
        "name": "What key size should I use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We recommend using 2048-bit keys for a good balance of security and compatibility. 1024-bit keys are considered weak and should be avoided if possible. 4096-bit keys offer higher security but may not be supported by all DNS providers due to record length limits."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use the generated keys?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The private key must be configured on your mail server or email service provider (keep it secret!). The public key (TXT record) must be added to your domain's DNS settings so receiving servers can verify your emails."
        }
      },
      {
        "@type": "Question",
        "name": "What is a DKIM selector?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A selector is a unique identifier that allows you to have multiple DKIM keys for the same domain (e.g., for different departments or services). Common selectors include 'default', 'google', or 'mail'."
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