import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
    title: "Free Email Verifier: Validate Email Addresses",
    description: 'Free email verification tool. Check if an email address is valid, detect disposable emails, and verify mail server configuration instantly.',
    keywords: 'email verifier, verify email address, email validation tool, check email validity, disposable email detector, mx record checker, email list cleaning',
    path: '/resources/tools/email-verifier'
});

export default function EmailVerifierLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Infrabox Email Verifier",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Free tool to verify email addresses, detect disposable domains, and check mail server configuration."
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How accurate is this email verifier?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our verifier performs multiple checks including syntax validation, domain existence, MX record lookup, and disposable email detection. It provides a high level of accuracy (95%+) without sending an actual email to the recipient."
                }
            },
            {
                "@type": "Question",
                "name": "What is a disposable email address?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Disposable email addresses (also known as burner emails) are temporary accounts used to avoid spam. They are often valid for only a short time (e.g., 10 minutes). We detect and flag these as 'Risky' because they hold no long-term value for your list."
                }
            },
            {
                "@type": "Question",
                "name": "What are role-based emails?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Role-based emails (like admin@, support@, sales@) are associated with a function or department rather than a specific person. They are often managed by multiple people and may have stricter spam filters."
                }
            },
            {
                "@type": "Question",
                "name": "Does this tool check if the email actually exists?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We verify that the domain exists and has valid mail servers (MX records) capable of receiving email. We do not perform a full SMTP handshake (sending a test packet) to avoid being blocked by mail servers, but our multi-step validation is highly reliable."
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
