import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  JsonLd,
  createBreadcrumbSchema,
  createWebPageSchema,
  createItemListSchema,
} from "@/components/seo/json-ld";
import { comparisonEntries, getComparisonEntry } from "./[slug]/compare-data";
import { CompareMatrix } from "@/components/compare";

export const metadata = {
  title: "Infrabox vs Competitors - Email Infrastructure Comparisons",
  description:
    "Compare Infrabox with Mailforge, Primeforge, Zapmail, Maildoso, Instantly, and SmartLead. US-IP Google Workspace & Microsoft 365 accounts, side by side.",
  keywords:
    "Infrabox comparison, Infrabox vs Mailforge, Infrabox vs Instantly, Infrabox vs SmartLead, Infrabox vs Zapmail, Infrabox vs Maildoso, Infrabox vs Primeforge, email infrastructure comparison, email mailbox provider comparison",
  openGraph: {
    title: "Infrabox vs Competitors - Email Infrastructure Comparisons",
    description:
      "Compare Infrabox with top email infrastructure providers. Pricing, features, and deliverability compared side by side.",
    url: "https://www.infrabox.software/compare",
    siteName: "Infrabox",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.infrabox.software/og-default.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.infrabox.software/compare",
  },
};

export default function ComparePage() {
  const slugs = Object.keys(comparisonEntries);
  const entries = slugs.map((s) => getComparisonEntry(s));

  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: "https://www.infrabox.software" },
    { name: "Compare", url: "https://www.infrabox.software/compare" },
  ]);

  const webPageData = createWebPageSchema({
    name: "Infrabox vs Competitors - Email Infrastructure Comparisons",
    description:
      "Compare Infrabox with top email infrastructure providers. See pricing, features, and deliverability side by side.",
    url: "https://www.infrabox.software/compare",
  });

  const itemListData = createItemListSchema({
    name: "Infrabox Competitor Comparisons",
    description:
      "Head-to-head comparisons of Infrabox with popular email infrastructure providers",
    url: "https://www.infrabox.software/compare",
    items: entries.map((entry, index) => ({
      position: index + 1,
      name: `Infrabox vs ${entry.competitorName}`,
      description: entry.subheadline,
      url: `https://www.infrabox.software/compare/${entry.slug}`,
    })),
  });

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={webPageData} />
      <JsonLd data={itemListData} />
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-12 sm:py-16 max-w-5xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
              <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-600">Compare</span>
            </nav>

            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 leading-[1.15] mb-5 max-w-2xl">
              How Infrabox compares to other email platforms
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-8">
              Honest, side-by-side breakdowns of pricing, infrastructure, and features. Every comparison uses publicly available data from each platform.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span><span className="font-semibold text-gray-900">{entries.length}</span> vs Infrabox</span>
              <span className="border-l border-gray-200 pl-6"><span className="font-semibold text-gray-900">{entries.length}</span> head-to-head</span>
              <span className="border-l border-gray-200 pl-6"><span className="font-semibold text-gray-900">24+</span> integrations</span>
            </div>
          </div>
        </section>

        {/* Head-to-Head Comparisons */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
              Head-to-Head Comparisons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/compare/${entry.slug}`}
                  className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Competitor screenshot */}
                  <div className="relative bg-gray-50 h-48 overflow-hidden border-b border-gray-100">
                    <Image
                      src={`/images/compare/${entry.slug}-homepage.png`}
                      alt={`${entry.competitorName} homepage`}
                      fill
                      className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-4">
                    {/* Infrabox logo vs competitor icon */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <Image src="/logo.png" alt="Infrabox" width={48} height={48} className="h-5 w-auto" />
                      <span className="text-xs text-gray-300 font-medium">vs</span>
                      <img src={`https://www.google.com/s2/favicons?domain=${entry.competitorDomain}&sz=64`} alt={entry.competitorName} className="w-6 h-6 rounded-md" />
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[#1240cc] transition-colors mb-1.5">
                      Infrabox vs {entry.competitorName}
                    </h3>

                    {/* Description */}
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {entry.subheadline}
                    </p>

                    {/* Read link */}
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1240cc] group-hover:gap-2.5 transition-all">
                      Read comparison
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Alternatives CTA Section */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Want alternatives instead?
                </h2>
                <p className="text-sm text-gray-600 max-w-lg leading-relaxed">
                  Explore curated alternatives for each provider with honest
                  pros, cons, and pricing breakdowns.
                </p>
              </div>
              <Link
                href="/alternatives"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-sm flex-shrink-0"
              >
                Browse alternatives
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Clean CTA */}
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Ready to upgrade your infrastructure?
              </h2>
              <p className="text-sm text-gray-500">
                Plans from $39/mo with 10 mailboxes included. No platform fee. Setup in under 10 minutes.
              </p>
            </div>
            <a
              href="https://app.infrabox.software/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] text-white font-semibold rounded-lg hover:bg-[#0b34b4] transition-colors text-sm shrink-0"
            >
              Get Started
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
