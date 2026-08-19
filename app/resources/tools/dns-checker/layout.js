import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free DNS Record Checker | Validate DNS Records",
  description: 'Free DNS record checking tool. Validate and lookup DNS records including A, MX, TXT, CNAME, and more for domain configuration verification.',
  keywords: 'dns checker, dns record checker, dns lookup tool, domain name system, dns validation, mx record checker, txt record lookup, dns configuration',
  path: '/resources/tools/dns-checker'
});

export default function DnsCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox DNS Record Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to lookup and validate DNS records including A, MX, TXT, CNAME, and email authentication records."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are DNS records?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DNS (Domain Name System) records are instructions that live in authoritative DNS servers and provide information about a domain, such as its IP address or mail servers."
        }
      },
      {
        "@type": "Question",
        "name": "What is an A record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An A (Address) record points a domain or subdomain to an IPv4 address. It's the most common type of DNS record, used to map domain names to the server hosting the website."
        }
      },
      {
        "@type": "Question",
        "name": "What is an MX record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MX (Mail Exchange) records specify the mail servers responsible for accepting email on behalf of your domain. They include a priority value to determine the order in which servers should be tried."
        }
      },
      {
        "@type": "Question",
        "name": "How long does DNS propagation take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DNS propagation typically takes 24-48 hours, although many changes are visible much sooner. The time depends on the TTL (Time to Live) value set on your records and ISP caching."
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