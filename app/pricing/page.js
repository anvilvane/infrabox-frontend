import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Pricing = dynamic(() => import("@/components/Pricing"));
import { LearnFaq } from "@/components/learn";
import {
  JsonLd,
  createBreadcrumbSchema,
  createWebPageSchema,
  createToolFaqSchema,
} from "@/components/seo/json-ld";

export const metadata = {
  title: "Infrabox Pricing (2026) - Email Infrastructure",
  description:
    "Infrabox plans from $39/mo (10 mailboxes), down to $2.50/mailbox on Enterprise annual billing. Google Workspace and Microsoft 365 both at the same tier pricing.",
  keywords:
    "Infrabox pricing, Infrabox plans, email pricing, Google Workspace pricing, Microsoft 365 pricing, email infrastructure cost, Infrabox vs Mailforge pricing, Infrabox vs Instantly pricing, bulk email pricing",
  openGraph: {
    title: "Infrabox Pricing (2026) - Email Infrastructure Plans",
    description:
      "Plans from $39/mo (10 mailboxes) down to $2.50/mailbox on Enterprise annual billing. Google Workspace and Microsoft 365 both included, with automated DNS, admin access, 2FA, and 24+ integrations.",
    url: "https://www.infrabox.software/pricing",
    siteName: "Infrabox",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.infrabox.software/opengraph-image.png",
        width: 1920,
        height: 1080,
        alt: "Infrabox Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infrabox Pricing (2026) - Email Infrastructure Plans",
    description:
      "Plans from $39/mo, down to $2.50/mailbox on Enterprise annual. Google Workspace and Microsoft 365 at the same tier pricing. Volume discounts for agencies.",
    images: ["https://www.infrabox.software/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.infrabox.software/pricing",
  },
};

const pricingFaqs = [
  {
    question: "How much does Infrabox cost?",
    answer:
      "Infrabox plans start at $39/mo (Professional, 10 mailboxes included). Additional mailboxes are $3.50 on Professional, $3.25 on Agency, and $2.99 on Enterprise monthly billing. Annual billing drops these to $3.10, $2.70, and $2.50 per additional mailbox respectively. Both Google Workspace and Microsoft 365 use the same plan tiers — there is no Microsoft premium. Azure tenants are $30 per domain. All plans include automated DNS setup, official admin panel access with 2FA, app passwords, and 24+ sequencer integrations.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Infrabox does not offer a traditional free trial, but you can sign up and start with a small number of mailboxes to test the platform before scaling. The Professional plan includes 10 mailbox slots at $31/month (annual billing), so you can evaluate deliverability, DNS automation, and integrations with minimal commitment.",
  },
  {
    question: "What payment methods does Infrabox accept?",
    answer:
      "Infrabox accepts all major credit cards (Visa, Mastercard, American Express) for standard plans. For agencies and enterprises managing large mailbox volumes, we also offer volume invoicing with NET-30 terms. Contact our sales team for custom billing arrangements.",
  },
  {
    question: "Are there volume discounts?",
    answer:
      "Yes. Infrabox offers volume discounts for agencies and teams managing 500+ mailboxes. The Enterprise plan already provides the lowest per-mailbox rate at $2.50/mailbox/month on annual billing ($2.99 on monthly billing). For even larger deployments, contact our team for custom pricing with dedicated support and SLA guarantees.",
  },
  {
    question: "What's included in the price?",
    answer:
      "Every Infrabox plan includes automated DNS configuration (SPF, DKIM, DMARC), an official admin panel with 2FA for each domain, app password generation, full REST API access with webhooks, unlimited team members and workspaces, real-time monitoring and alerts, and integration with 24+ sequencers including Instantly, SmartLead, Apollo, and more.",
  },
  {
    question: "How does Infrabox pricing compare to competitors?",
    answer:
      "Infrabox is competitively priced among email infrastructure providers. Mailforge charges around $3/mailbox/month but uses shared infrastructure without admin access. Primeforge starts at $2.88/mailbox/month with limited integrations. Zapmail charges $2.67-3/mailbox/month. Infrabox offers official Google Workspace and Microsoft 365 accounts with full admin control, US-IP addresses, and 95% inbox placement at comparable or lower prices.",
  },
  {
    question: "Can I switch between billing periods?",
    answer:
      "Yes. You can upgrade or downgrade your billing period at any time. Switch from monthly to quarterly or annual billing to unlock lower per-mailbox rates and save up to 20%. Changes take effect at the start of your next billing cycle, and any credit from your current period is applied automatically.",
  },
];

const competitorPricing = [
  {
    name: "Infrabox",
    highlight: true,
    gwPrice: "From $2.50",
    msPrice: "From $2.50",
    adminAccess: true,
    dnsAutomation: true,
    warmup: "$3/mo add-on",
    integrations: "24+",
    usIp: true,
  },
  {
    name: "Mailforge",
    highlight: false,
    gwPrice: "~$3.00",
    msPrice: "N/A",
    adminAccess: false,
    dnsAutomation: true,
    warmup: "Built-in",
    integrations: "Limited",
    usIp: false,
  },
  {
    name: "Primeforge",
    highlight: false,
    gwPrice: "From $2.88",
    msPrice: "From $2.88",
    adminAccess: false,
    dnsAutomation: true,
    warmup: "Built-in",
    integrations: "Limited",
    usIp: false,
  },
  {
    name: "Zapmail",
    highlight: false,
    gwPrice: "~$2.67",
    msPrice: "~$3.00",
    adminAccess: false,
    dnsAutomation: true,
    warmup: "Built-in",
    integrations: "Limited",
    usIp: false,
  },
];

const includedFeatures = [
  {
    title: "Automated DNS Setup",
    description:
      "SPF, DKIM, and DMARC configured automatically for every domain in seconds.",
  },
  {
    title: "Official Admin Panel",
    description:
      "Full admin access to Google Workspace or Microsoft 365 with 2FA security per domain.",
  },
  {
    title: "App Passwords & 2FA",
    description:
      "Auto-generated app passwords for seamless integration with any SMTP-compatible sequencer.",
  },
  {
    title: "REST API & Webhooks",
    description:
      "Full API access for programmatic mailbox and domain management with real-time webhook events.",
  },
  {
    title: "24+ Integrations",
    description:
      "Connect to Instantly, SmartLead, Apollo, Reply, Lemlist, SalesForge, Plusvibe, and more.",
  },
  {
    title: "Real-Time Monitoring",
    description:
      "Live deliverability alerts, bounce tracking, and domain health monitoring across all mailboxes.",
  },
  {
    title: "Unlimited Team Members",
    description:
      "Add unlimited team members and organize mailboxes across multiple workspaces at no extra cost.",
  },
  {
    title: "US-IP Addresses",
    description:
      "All Google Workspace and Microsoft 365 accounts provisioned on premium US IP infrastructure.",
  },
];

function BooleanCell({ value }) {
  if (value === true) {
    return (
      <svg
        className="w-5 h-5 text-emerald-600 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  }
  if (value === false) {
    return (
      <svg
        className="w-5 h-5 text-red-400 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  }
  return <span>{value}</span>;
}

export default function PricingPage() {
  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: "https://www.infrabox.software" },
    { name: "Pricing", url: "https://www.infrabox.software/pricing" },
  ]);

  const webPageData = createWebPageSchema({
    name: "Infrabox Pricing (2026) - Email Infrastructure Plans",
    description:
      "Infrabox plans from $39/mo (10 mailboxes), down to $2.50/mailbox on Enterprise annual billing. Google Workspace and Microsoft 365 both at the same tier pricing.",
    url: "https://www.infrabox.software/pricing",
  });

  const faqSchema = createToolFaqSchema(pricingFaqs);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Infrabox Email Infrastructure",
    description:
      "Enterprise email infrastructure with US-IP Google Workspace and Microsoft 365 accounts, automated DNS, admin access, and 24+ sequencer integrations.",
    brand: {
      "@type": "Brand",
      name: "Infrabox",
    },
    url: "https://www.infrabox.software/pricing",
    offers: [
      {
        "@type": "Offer",
        name: "Google Workspace Mailbox (Annual)",
        price: "2.50",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "2.50",
          priceCurrency: "USD",
          unitText: "per mailbox per month",
          billingDuration: "P1Y",
        },
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
        url: "https://app.infrabox.software/signup",
      },
      {
        "@type": "Offer",
        name: "Microsoft 365 Mailbox (Enterprise, Annual)",
        price: "2.50",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "2.50",
          priceCurrency: "USD",
          unitText: "per mailbox per month",
          billingDuration: "P1Y",
        },
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
        url: "https://app.infrabox.software/signup",
      },
      {
        "@type": "Offer",
        name: "Azure Tenant",
        price: "30.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "30.00",
          priceCurrency: "USD",
          unitText: "per domain",
        },
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
        url: "https://app.infrabox.software/signup",
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={webPageData} />
      <JsonLd data={faqSchema} />
      <JsonLd data={productSchema} />
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-16 sm:py-20 max-w-5xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav
              className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-600">Pricing</span>
            </nav>

            {/* Section Label */}
            <p className="font-mono text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-5">
              Transparent Pricing
            </p>

            {/* Main Heading */}
            <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-5">
              Simple, scalable pricing for{" "}
              <span className="text-[#1240cc]">email infrastructure</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10"
              data-speakable
            >
              Google Workspace and Microsoft 365 mailboxes from $2.50/mo on Enterprise annual
              billing. No setup fees. Automated DNS, admin access, and 24+ integrations
              included in every plan.
            </p>

            {/* Stats Bar */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
              <span>
                <span className="font-semibold text-gray-900">$2.50</span>/mo
                GWS (annual)
              </span>
              <span className="border-l border-gray-300 pl-6">
                <span className="font-semibold text-gray-900">$2.50</span>/mo
                MS365 (annual)
              </span>
              <span className="border-l border-gray-300 pl-6">
                <span className="font-semibold text-gray-900">$30</span>/domain
                Azure
              </span>
            </div>

            {/* Cross-link to the interactive cost calculator */}
            <p className="mt-6 text-sm text-gray-600">
              Not sure how many mailboxes you need?{" "}
              <a
                href="/pricing-calculator"
                className="font-medium text-[#1240cc] underline underline-offset-2 hover:text-[#0b34b4]"
              >
                Use the email cost calculator
              </a>{" "}
              to size mailboxes, domains, and monthly cost from your send volume or meetings goal.
            </p>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <Pricing />
          </div>
        </section>

        {/* What's Included Feature Grid */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                Everything included in every plan
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
                No hidden fees or surprise charges. Every Infrabox plan comes
                with the full set of tools you need to run email
                infrastructure at scale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {includedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-[#1240cc] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing vs Competitors Table */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                How Infrabox pricing compares
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
                See how Infrabox stacks up against other email
                infrastructure providers on pricing, features, and
                infrastructure quality.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900">
                      Provider
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">
                      GWS Price
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">
                      MS365 Price
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">
                      Admin Access
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">
                      DNS Automation
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">
                      Warmup
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">
                      Integrations
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-900">
                      US IPs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competitorPricing.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 ${
                        row.highlight
                          ? "bg-emerald-50/50 font-medium"
                          : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-900">
                        {row.highlight ? (
                          <span className="font-semibold text-[#1240cc]">
                            {row.name}
                          </span>
                        ) : (
                          row.name
                        )}
                      </td>
                      <td className="text-center px-4 py-3 text-gray-700">
                        {row.gwPrice}
                      </td>
                      <td className="text-center px-4 py-3 text-gray-700">
                        {row.msPrice}
                      </td>
                      <td className="text-center px-4 py-3">
                        <BooleanCell value={row.adminAccess} />
                      </td>
                      <td className="text-center px-4 py-3">
                        <BooleanCell value={row.dnsAutomation} />
                      </td>
                      <td className="text-center px-4 py-3 text-gray-700">
                        {row.warmup}
                      </td>
                      <td className="text-center px-4 py-3 text-gray-700">
                        {row.integrations}
                      </td>
                      <td className="text-center px-4 py-3">
                        <BooleanCell value={row.usIp} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Pricing based on publicly available data as of 2026. Competitor
              prices may vary.
            </p>

            <div className="text-center mt-8">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1240cc] hover:underline"
              >
                See detailed comparisons
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                Pricing FAQ
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Common questions about Infrabox plans, billing, and what is
                included.
              </p>
            </div>

            <LearnFaq items={pricingFaqs} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-5">
              Ready to get started?
            </p>
            <h2 className="text-[28px] sm:text-[36px] font-semibold text-gray-900 leading-[1.2] mb-4">
              Launch your email infrastructure today
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
              Google Workspace from $2.50/mo. Automated DNS, InfraGuard
              monitoring, and 24+ sequencer integrations included. Set up your
              first mailboxes in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.infrabox.software/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-colors text-sm"
              >
                Get Started with Infrabox
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-800 font-medium rounded-full hover:bg-white hover:border-gray-400 transition-colors text-sm"
              >
                Compare Providers
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
