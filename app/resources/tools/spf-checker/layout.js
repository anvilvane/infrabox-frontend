import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free SPF Checker: Validate DNS Records",
  description: "Free SPF record checker. Validate SPF DNS records, count DNS lookups, analyze authorized mechanisms, and detect issues like exceeding the 10-lookup limit.",
  keywords: 'spf checker, spf validator, spf record checker, sender policy framework, spf dns validation, email authentication, spf record test, spf lookup counter, spf 10 dns lookup limit, spf soft fail, spf hard fail, spf include, spf mechanism, email deliverability, spf permerror, spf generator, domain spf check, spf policy analyzer',
  path: '/resources/tools/spf-checker'
});

export default function SpfCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox SPF Record Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to validate SPF records, count DNS lookups, analyze authorized mechanisms, and check policy configuration for email authentication."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an SPF record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An SPF (Sender Policy Framework) record is a DNS TXT record that lists all the IP addresses and mail servers authorized to send email on behalf of your domain. It helps prevent email spoofing and improves deliverability."
        }
      },
      {
        "@type": "Question",
        "name": "How do I check my SPF record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply enter your domain name (e.g., company.com) into the Infrabox SPF Checker tool and click 'Check SPF Record'. We will analyze your DNS records and report on your SPF configuration validity."
        }
      },
      {
        "@type": "Question",
        "name": "What does an SPF soft fail (~all) mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A soft fail (~all) tells receiving servers to accept emails from unauthorized IPs but mark them as suspicious or potential spam. This is the recommended setting for most domains as it prevents legitimate emails from being rejected outright while still offering protection."
        }
      },
      {
        "@type": "Question",
        "name": "Why is my SPF record invalid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common reasons for invalid SPF records include: exceeding the 10 DNS lookup limit, syntax errors, multiple SPF records (you can only have one), or missing required mechanisms. Our tool provides detailed error messages to help you fix these issues."
        }
      },
      {
        "@type": "Question",
        "name": "What is the 10 DNS lookup limit in SPF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The SPF specification (RFC 7208) limits the number of DNS-querying mechanisms to 10 per SPF evaluation. Mechanisms that trigger lookups include: 'include', 'a', 'mx', 'redirect', and 'exists'. Exceeding this limit causes a 'permerror' result, effectively breaking your SPF."
        }
      },
      {
        "@type": "Question",
        "name": "Can I have multiple SPF records?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, you can only have one SPF TXT record per domain. Having multiple SPF records will cause a 'permerror' and your SPF will fail validation entirely. Combine all authorized senders into a single record using 'include' mechanisms."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between -all, ~all, and ?all?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "'-all' (hard fail) instructs receivers to reject unauthorized emails. '~all' (soft fail) marks them as suspicious but still delivers them. '?all' (neutral) takes no stance. Most organizations should use ~all during testing and -all in production."
        }
      },
      {
        "@type": "Question",
        "name": "How does SPF work with DMARC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DMARC uses SPF as one of its two authentication mechanisms (the other being DKIM). For DMARC to pass via SPF, the SPF check must pass and the SPF domain must align with the From header domain. Even if SPF fails, DMARC can still pass if DKIM succeeds."
        }
      },
      {
        "@type": "Question",
        "name": "How do I add third-party senders to my SPF record?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Add their SPF include mechanism to your existing record. For example, to add SendGrid: v=spf1 include:_spf.google.com include:sendgrid.net ~all. Be mindful of the 10 DNS lookup limit when adding multiple includes."
        }
      },
      {
        "@type": "Question",
        "name": "What happens when SPF authentication fails?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When SPF fails, the result depends on your qualifier. With '-all', email may be rejected. With '~all', it typically goes to spam. The SPF result feeds into DMARC evaluation -- if both SPF and DKIM fail, DMARC policy determines the outcome."
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
