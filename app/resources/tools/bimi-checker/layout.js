import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free BIMI Checker: Validate BIMI DNS & Logo",
  description: "Free BIMI record checker. Validate BIMI DNS records, your SVG logo and VMC certificate, and confirm whether your brand logo displays in Gmail, Yahoo, and Apple.",
  keywords: 'bimi checker, bimi validator, bimi record checker, brand indicators message identification, bimi dns validation, email branding, logo verification, bimi compliance, vmc certificate checker, bimi logo checker, gmail bimi, yahoo bimi, apple mail bimi, bimi svg checker, email logo display',
  path: '/resources/tools/bimi-checker'
});

export default function BimiCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox BIMI Record Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to validate BIMI records, check SVG logo configuration, verify VMC certificates, and ensure DMARC compliance for email branding."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is BIMI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Brand Indicators for Message Identification (BIMI) is an email specification that allows organizations to display their official brand logo next to authenticated messages in supporting email clients like Gmail, Yahoo Mail, and Apple Mail."
        }
      },
      {
        "@type": "Question",
        "name": "Does BIMI require DMARC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BIMI requires your domain to have a DMARC policy of either 'quarantine' or 'reject'. A DMARC policy of 'none' is not sufficient."
        }
      },
      {
        "@type": "Question",
        "name": "What is a VMC and do I need one?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Verified Mark Certificate (VMC) is a digital certificate that validates your right to use your logo. Gmail and Apple Mail require a VMC to display your BIMI logo. Yahoo Mail does not require a VMC."
        }
      },
      {
        "@type": "Question",
        "name": "Which email clients support BIMI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gmail (requires VMC), Yahoo Mail (no VMC required), Apple Mail on iOS 24+ and macOS Ventura+ (requires VMC), and Fastmail all support BIMI. Outlook is currently piloting."
        }
      },
      {
        "@type": "Question",
        "name": "What format does my BIMI logo need to be?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your BIMI logo must be in SVG Tiny Portable/Secure (SVG Tiny P/S) format. It must be a square image, no larger than 32KB, hosted on an HTTPS URL."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take for BIMI to appear?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After configuring your BIMI DNS record, it can take 24-72 hours for DNS propagation. Email providers may take additional time to cache and display your logo."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a VMC cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "VMC certificates typically cost between $1,000 and $1,500 per year, issued by Certificate Authorities like DigiCert and Entrust. You need a registered trademark to qualify."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use BIMI without a trademarked logo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yahoo Mail and Fastmail support BIMI without a VMC, so you can display your logo there without trademark registration. Gmail and Apple Mail require a VMC with a registered trademark."
        }
      },
      {
        "@type": "Question",
        "name": "What is the BIMI DNS record format?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A BIMI record is a DNS TXT record at default._bimi.yourdomain.com with the format: v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/cert.pem"
        }
      },
      {
        "@type": "Question",
        "name": "Why isn't my BIMI logo showing in Gmail?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common reasons include: missing VMC certificate, DMARC policy set to 'none', SVG logo not in Tiny P/S format, logo exceeding 32KB, DNS propagation delays, or insufficient sending reputation."
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
