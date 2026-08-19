import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
    title: "Free Email Permutator: Find Any Email",
    description: "Generate common email address formats for any prospect using their name and domain. The best free email permutator tool for email outreach and lead generation.",
    keywords: "email permutator, email finder, find email address, email format generator, email tools, sales prospecting, lead generation, email verification",
    canonicalUrlRelative: "/resources/tools/email-permutator",
    openGraph: {
        title: "Free Email Permutator - Find Any Email Address",
        description: "Generate common email address formats for any prospect using their name and domain. Free tool for sales and marketing teams.",
    }
});

export default function Layout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "Infrabox Email Permutator",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "description": "A free tool to generate common email address permutations for sales prospecting and lead generation."
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is an email permutator?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "An email permutator is a tool that generates multiple potential email address variations based on a person's first name, last name, and company domain. It helps sales professionals guess the correct email format for a prospect."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is this email permutator free?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, the Infrabox Email Permutator is 100% free to use with no limits on the number of searches you can perform."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How do I verify the generated emails?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "After generating the list of potential emails, we recommend using a tool like the Infrabox Deliverability Score or an external email verifier to check which address is valid before sending."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Why do I need to find the right email format?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Sending emails to invalid addresses increases your bounce rate, which harms your sender reputation and can cause your emails to land in spam. Finding the correct format ensures your message reaches the inbox."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
