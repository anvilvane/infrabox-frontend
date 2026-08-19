export const metadata = {
  title: "Email Cost Calculator: How Many Mailboxes Do You Need? | Infrabox",
  description:
    "Estimate your email infrastructure cost. Size mailboxes and domains from a daily send volume, or work backwards from the meetings you want to book, across Google Workspace, Microsoft 365, and Azure.",
  keywords: [
    "email calculator",
    "mailbox pricing calculator",
    "how many mailboxes do I need",
    "email cost calculator",
    "email infrastructure cost",
    "meetings to mailboxes",
  ],
  alternates: {
    canonical: "https://www.infrabox.software/pricing-calculator",
  },
  openGraph: {
    title: "Email Cost Calculator | Infrabox",
    description:
      "Size your email infrastructure by send volume or by a meetings-booked goal. See mailboxes, domains, monthly cost, and first-year total across Google, Microsoft, and Azure.",
    url: "https://www.infrabox.software/pricing-calculator",
    type: "website",
    images: [
      {
        url: "https://www.infrabox.software/og-default.png",
        width: 1200,
        height: 630,
        alt: "Infrabox Email Cost Calculator",
      },
    ],
  },
};

export default function PricingCalculatorLayout({ children }) {
  return children;
}
