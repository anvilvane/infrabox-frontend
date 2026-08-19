import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Free Spam Score Checker | Test Email Spam Score",
  description: 'Free spam score testing tool. Analyze your emails for spam indicators and get recommendations to improve deliverability and avoid spam filters.',
  keywords: 'spam checker, spam score test, email spam analysis, spam filter test, deliverability test, email quality checker, anti-spam validation',
  path: '/resources/tools/spam-checker'
});

export default function SpamCheckerLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Infrabox Spam Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free tool to analyze email content for spam triggers and improve deliverability."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the spam checker work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our spam checker analyzes your email subject line and body content against known spam triggers, keyword lists, and formatting rules used by major email providers to identify spam."
        }
      },
      {
        "@type": "Question",
        "name": "What is a good spam score?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A lower spam score is better. Ideally, you want a score of 0. Scores below 2.5 are generally considered safe, while scores above 5.0 are likely to be marked as spam."
        }
      },
      {
        "@type": "Question",
        "name": "Can I check HTML emails?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can paste your HTML code into the tool to analyze both the content and the HTML structure for potential issues."
        }
      },
      {
        "@type": "Question",
        "name": "Is this tool free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this spam checker is completely free to use for analyzing your email content."
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