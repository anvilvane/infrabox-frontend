import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free Domain & IP Reputation Checker",
  description: 'Free domain reputation checking tool. Monitor your domain and IP reputation across major blacklists and reputation services for email deliverability.',
  keywords: 'reputation checker, domain reputation check, ip reputation checker, blacklist checker, email reputation monitor, deliverability reputation',
  path: '/resources/tools/reputation-check'
});

export default function ReputationCheckLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox Reputation Checker",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to check domain and IP reputation across major blacklists and analyze email sender reputation."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is sender reputation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sender reputation is a score assigned by Internet Service Providers (ISPs) to an organization's sending IP address and domain. It determines whether your emails are delivered to the inbox, sent to the spam folder, or rejected entirely."
        }
      },
      {
        "@type": "Question",
        "name": "How do I improve my sender reputation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Improve reputation by sending relevant content to engaged users, removing inactive subscribers, authenticating your emails (SPF, DKIM, DMARC), and avoiding spam triggers in your content."
        }
      },
      {
        "@type": "Question",
        "name": "What are blacklists?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Blacklists (or blocklists) are databases of IP addresses and domains known to send spam. ISPs use these lists to filter incoming email. Being listed can severely impact your email deliverability."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I check my reputation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It's recommended to monitor your reputation continuously, especially if you send large volumes of email. Regular checks help you catch and resolve issues before they cause significant delivery failures."
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