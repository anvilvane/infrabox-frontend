import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free DMARC Checker: Validate Policy & Alignment",
  description: "Free DMARC record checker. Validate your DMARC DNS, analyze policy (none/quarantine/reject), check SPF and DKIM alignment, and verify reporting setup.",
  keywords: 'dmarc checker, dmarc validator, dmarc record checker, domain message authentication, dmarc policy validation, email security, dns dmarc check, dmarc alignment, dmarc aggregate reports, dmarc forensic reports, dmarc p=none, dmarc p=reject, dmarc p=quarantine, dmarc rua, dmarc ruf, email authentication, dmarc implementation, dmarc reporting, spf dkim dmarc',
  path: '/resources/tools/dmarc-checker'
});

export default function DmarcCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox DMARC Record Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to validate DMARC records, analyze email authentication policies, check SPF/DKIM alignment, and verify reporting configuration for domain protection."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a DMARC checker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A DMARC checker is a tool that looks up the DMARC DNS TXT record at _dmarc.yourdomain.com, validates its syntax, and analyzes the policy configuration. It verifies that your domain has proper protection against email spoofing and helps identify misconfigurations."
        }
      },
      {
        "@type": "Question",
        "name": "What do the DMARC policies mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DMARC has three main policies: 'p=none' (monitoring only, no action taken), 'p=quarantine' (suspicious emails are sent to spam), and 'p=reject' (suspicious emails are blocked completely). Most organizations start with p=none and gradually move to reject."
        }
      },
      {
        "@type": "Question",
        "name": "Why is DMARC important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DMARC is crucial for email security because it allows domain owners to specify how receivers should handle emails that fail authentication (SPF/DKIM). It prevents attackers from impersonating your domain and is required for BIMI logo display in Gmail and Apple Mail."
        }
      },
      {
        "@type": "Question",
        "name": "How do I fix a 'DMARC record not found' error?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Create a DMARC TXT record and add it to your DNS at the hostname '_dmarc'. A simple starting record: v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com. Use our DMARC Generator tool for a properly formatted record."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between p= and sp= in DMARC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 'p=' tag sets the policy for your main domain, while 'sp=' sets a separate policy for subdomains. If sp= is not specified, subdomains inherit the main domain policy."
        }
      },
      {
        "@type": "Question",
        "name": "What are DMARC aggregate reports (rua)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Aggregate reports are XML reports sent by receiving servers summarizing DMARC authentication results. They show which IPs sent email as your domain and whether SPF/DKIM passed or failed. Configure with rua=mailto:reports@yourdomain.com."
        }
      },
      {
        "@type": "Question",
        "name": "What is DMARC alignment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DMARC alignment verifies that the domain authenticated by SPF or DKIM matches the From header domain. Relaxed alignment allows subdomain matching; strict requires exact domain match. Alignment makes DMARC more effective than SPF or DKIM alone."
        }
      },
      {
        "@type": "Question",
        "name": "How long should I stay on p=none before enforcing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most experts recommend 2-4 weeks minimum on p=none while reviewing aggregate reports. Identify all legitimate senders, ensure they pass authentication, then gradually move to quarantine with pct=25 and increase to pct=100 before switching to reject."
        }
      },
      {
        "@type": "Question",
        "name": "Can DMARC break my legitimate email delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, if implemented incorrectly. Moving to quarantine or reject before ensuring all legitimate senders pass authentication will cause those emails to go to spam or be rejected. Start with p=none and use gradual enforcement."
        }
      },
      {
        "@type": "Question",
        "name": "What are DMARC forensic reports (ruf)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Forensic reports provide detailed information about individual messages that failed DMARC. Unlike aggregate summaries, they contain message headers or full email content. Many providers don't send them due to privacy concerns."
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
