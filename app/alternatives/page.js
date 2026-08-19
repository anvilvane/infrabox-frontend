import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  JsonLd,
  createWebPageSchema,
  createBreadcrumbSchema,
  createItemListSchema,
} from "@/components/seo/json-ld";
import { alternativesEntries } from "./[slug]/alternatives-data";
import { vsEntries } from "./_vs/vs-data";

export const metadata = {
  title: "Best Email Infrastructure Alternatives (2026)",
  description:
    "Compare the best alternatives to popular email infrastructure tools. Side-by-side pricing, features, and honest pros and cons across 15+ providers.",
  keywords: [
    "email infrastructure alternatives",
    "Mailforge alternatives",
    "Zapmail alternatives",
    "Instantly alternatives",
    "SmartLead alternatives",
    "Hypergen alternatives",
    "email tools comparison",
    "email infrastructure comparison",
    "best email platforms 2026",
    "Infrabox vs competitors",
  ],
  openGraph: {
    title: "Best Email Infrastructure Alternatives (2026)",
    description:
      "Compare the best alternatives to popular email infrastructure tools. Pricing, features, and honest pros and cons.",
    url: "https://www.infrabox.software/alternatives",
    siteName: "Infrabox",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.infrabox.software/og-default.png",
        width: 1200,
        height: 630,
        alt: "Infrabox - Email Infrastructure Alternatives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Email Infrastructure Alternatives (2026)",
    description:
      "Compare the best alternatives to popular email infrastructure tools. Pricing, features, and honest pros and cons.",
  },
  alternates: {
    canonical: "https://www.infrabox.software/alternatives",
  },
};

export default function AlternativesPage() {
  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: "https://www.infrabox.software" },
    { name: "Alternatives", url: "https://www.infrabox.software/alternatives" },
  ]);

  const webPageData = createWebPageSchema({
    name: "Best Email Infrastructure Alternatives (2026)",
    description:
      "Compare the best alternatives to popular email infrastructure tools with pricing, features, and honest pros and cons.",
    url: "https://www.infrabox.software/alternatives",
  });

  const itemListData = createItemListSchema({
    name: "Email Infrastructure Alternatives",
    description:
      "Comparison pages for the most popular email infrastructure tools",
    url: "https://www.infrabox.software/alternatives",
    items: alternativesEntries.map((entry, index) => ({
      position: index + 1,
      name: entry.title,
      description: entry.metaDescription,
      url: `https://www.infrabox.software/alternatives/${entry.slug}`,
    })),
  });

  const totalGuides = alternativesEntries.length;
  const uniqueTools = new Set();
  alternativesEntries.forEach((entry) => {
    uniqueTools.add(entry.toolName);
    entry.alternatives.forEach((alt) => uniqueTools.add(alt.name));
  });
  const totalToolsReviewed = uniqueTools.size;

  // Head-to-head "<competitor> vs Infrabox" pages. The dedicated zapmail page
  // lives outside vs-data, so it's appended manually. Linking them here gives
  // these otherwise-orphaned pages an internal entry point.
  const headToHead = [
    ...Object.values(vsEntries).map((e) => ({
      slug: e.slug,
      competitor: e.competitor,
      domain: e.competitorDomain,
    })),
    { slug: "zapmail-vs-infrabox", competitor: "Zapmail", domain: "zapmail.ai" },
  ].sort((a, b) => a.competitor.localeCompare(b.competitor));

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
              <span className="text-gray-600">Alternatives</span>
            </nav>

            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 leading-[1.15] mb-5 max-w-2xl">
              Email Infrastructure Alternatives
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-8">
              Looking to switch? Each guide compares top alternatives with honest pricing, feature breakdowns, and infrastructure details.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span><span className="font-semibold text-gray-900">{totalGuides}</span> guides</span>
              <span className="border-l border-gray-200 pl-6"><span className="font-semibold text-gray-900">{totalToolsReviewed}</span> tools reviewed</span>
            </div>
          </div>
        </section>

        {/* Card Grid */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternativesEntries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/alternatives/${entry.slug}`}
                  className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Competitor screenshot */}
                  <div className="relative bg-gray-50 h-48 overflow-hidden border-b border-gray-100">
                    <Image
                      src={`/images/compare/${entry.slug}-homepage.png`}
                      alt={`${entry.toolName} homepage`}
                      fill
                      className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-4">
                    {/* Brand row */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <img src={`https://www.google.com/s2/favicons?domain=${entry.toolDomain}&sz=64`} alt={entry.toolName} className="w-6 h-6 rounded-md" />
                      <span className="text-[13px] font-semibold text-gray-900">{entry.toolName}</span>
                      <span className="text-[11px] text-gray-400">Alternatives</span>
                    </div>

                    {/* Description */}
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {entry.subheadline}
                    </p>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1240cc] group-hover:gap-2.5 transition-all">
                      Explore options
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

        {/* Head-to-head: <competitor> vs Infrabox */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Infrabox head-to-head comparisons
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl mb-8">
              Direct, side-by-side breakdowns of Infrabox against each provider — pricing, mailbox types, IPs, and deliverability.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {headToHead.map((item) => (
                <Link
                  key={item.slug}
                  href={`/alternatives/${item.slug}`}
                  className="group flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200/80 px-4 py-3 hover:border-gray-300 hover:bg-white hover:shadow-sm transition-all"
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5 rounded shrink-0"
                  />
                  <span className="text-[13px] font-medium text-gray-900">
                    {item.competitor} vs Infrabox
                  </span>
                  <svg className="w-3.5 h-3.5 ml-auto text-[#1240cc] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-link to Compare */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Want head-to-head comparisons?
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                  See how tools stack up side by side with detailed feature,
                  pricing, and deliverability breakdowns.
                </p>
              </div>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 shrink-0 text-sm font-medium text-[#1240cc] hover:text-[#2060f0] transition-colors"
              >
                Browse comparisons
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Clean CTA */}
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Switch to better infrastructure
              </h2>
              <p className="text-sm text-gray-500">
                Plans from $39/mo with 10 mailboxes included. No platform fee. 24+ sequencer integrations.
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
