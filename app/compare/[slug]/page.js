import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PRICING_VERIFIED } from "@/lib/outbound-links";
import LearnToc from "@/components/learn/LearnToc";
import { LearnFaq } from "@/components/learn";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  JsonLd,
  createBreadcrumbSchema,
  createWebPageSchema,
  createToolFaqSchema,
  createProductComparisonSchema,
} from "@/components/seo/json-ld";
import {
  CategorizedFeatureTable,
  PricingCalculator,
  ProsCons,
  TrustSignals,
} from "@/components/compare";
import {
  getComparisonEntry,
  getAllComparisonSlugs,
} from "./compare-data";
import { getAllAlternativesSlugs } from "../../alternatives/[slug]/alternatives-data";

// Slugs that have a live /alternatives/[slug] page. Used to guard the keep-reading
// "Alternatives" card so compare pages without a matching alternatives page don't 404.
const ALTERNATIVES_SLUGS = new Set(getAllAlternativesSlugs());

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getComparisonEntry(slug);
  if (!entry) return {};

  return {
    // metaTitle, when set, is the exact final <title> — bypasses the root
    // layout's "%s | Infrabox" template (used to keep long titles under length).
    title: entry.metaTitle ? { absolute: entry.metaTitle } : entry.title,
    description: entry.metaDescription,
    keywords: entry.keywords || [],
    openGraph: {
      title: entry.metaTitle || entry.title,
      description: entry.metaDescription,
      url: `https://www.infrabox.software/compare/${entry.slug}`,
      siteName: "Infrabox",
      locale: "en_US",
      type: "article",
      images: [{ url: `https://www.infrabox.software/images/compare/${entry.slug}-homepage.png`, width: 1280, height: 800 }],
    },
    twitter: { card: "summary_large_image", title: entry.metaTitle || entry.title, description: entry.metaDescription },
    alternates: { canonical: `https://www.infrabox.software/compare/${entry.slug}` },
    other: { "article:modified_time": entry.lastVerified || new Date().toISOString().split("T")[0] },
  };
}

export default async function CompareDetailPage({ params }) {
  const { slug } = await params;
  const entry = getComparisonEntry(slug);
  if (!entry) notFound();

  const allSlugs = getAllComparisonSlugs();
  const otherComparisons = allSlugs
    .filter((s) => s !== slug)
    .slice(0, 3)
    .map((s) => getComparisonEntry(s));

  const readTime = Math.max(
    5,
    Math.ceil(
      (entry.summary.length + entry.competitorOverview.length +
        entry.faqs.reduce((acc, f) => acc + f.answer.length, 0)) / 900
    )
  );

  const updatedDate = entry.lastVerified
    ? new Date(entry.lastVerified).toLocaleDateString("en-US", { year: "numeric", month: "short" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" });

  const tocItems = [
    { id: "summary", label: "Our Summary" },
    { id: "features", label: "Feature Comparison" },
    { id: "pricing", label: "Pricing" },
    { id: "infrastructure", label: "Infrastructure & Deliverability" },
    ...(entry.prosCons ? [{ id: "pros-cons", label: "Pros & Cons" }] : []),
    ...(entry.bottomLine ? [{ id: "bottom-line", label: "Who Should Choose What" }] : []),
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Compare", url: "https://www.infrabox.software/compare" },
        { name: `Infrabox vs ${entry.competitorName}`, url: `https://www.infrabox.software/compare/${entry.slug}` },
      ])} />
      <JsonLd data={createWebPageSchema({ name: entry.title, description: entry.metaDescription, url: `https://www.infrabox.software/compare/${entry.slug}` })} />
      <JsonLd data={createToolFaqSchema(entry.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })))} />
      <JsonLd data={createProductComparisonSchema({
        product1Name: "Infrabox", product1Url: "https://www.infrabox.software", product1Price: "2.50", product1Rating: null,
        product2Name: entry.competitorName, product2Url: `https://${entry.competitorDomain}`,
        product2Price: entry.competitorPricing?.[0]?.price?.match(/[\d.]+/)?.[0] || "0",
        product2Rating: entry.ratings?.g2 || null,
        comparisonUrl: `https://www.infrabox.software/compare/${entry.slug}`,
        lastReviewed: entry.lastVerified || new Date().toISOString().split("T")[0],
      })} />

      <Header />

      <main className="bg-white min-h-screen">
        <div className="flex max-w-6xl mx-auto">
          {/* Sidebar TOC */}
          <div className="hidden lg:block w-[280px] shrink-0 border-r border-gray-200 relative">
            <div className="sticky top-0 h-screen overflow-y-auto cs-scrollbar">
              <div className="p-6">
                <LearnToc items={tocItems} />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 px-6 lg:px-12">
          {/* ── Hero ── */}
          <div className="pt-8 pb-6 max-w-3xl">
            <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/compare" className="hover:text-gray-600 transition-colors">Compare</Link>
              <span>/</span>
              <span className="text-gray-600">vs {entry.competitorName}</span>
            </nav>

            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="Infrabox" width={48} height={48} className="h-7 w-auto" />
              <span className="text-gray-300 text-sm font-medium">vs</span>
              <img
                src={`https://www.google.com/s2/favicons?domain=${entry.competitorDomain}&sz=64`}
                alt={entry.competitorName}
                className="w-7 h-7 rounded-md"
              />
            </div>

            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 leading-[1.12] tracking-tight mb-5">
              {entry.headline}
            </h1>

            <p className="text-base text-gray-500 leading-relaxed mb-6 max-w-2xl">
              {entry.summary}
            </p>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{readTime} min read</span>
              <span>|</span>
              <span>Updated {updatedDate}</span>
            </div>
          </div>

          {/* ── Competitor Screenshot (full-width) ── */}
          <div className="mb-12">
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={`/images/compare/${entry.slug}-homepage.png`}
                alt={`${entry.competitorName} homepage`}
                width={1280}
                height={800}
                className="w-full h-auto"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400 italic">
              {entry.competitorName} homepage as of {updatedDate}
            </p>
          </div>

          {/* ── Content sections ── */}
          <div className="max-w-3xl">

              {/* Our Summary */}
              <section id="summary" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Summary</h2>
                <div className="space-y-4">
                  {entry.competitorOverview.split("\n\n").map((para, i) => (
                    <p key={i} className="text-[15px] text-gray-600 leading-[1.75]">{para}</p>
                  ))}
                </div>
                {entry.ratings && (
                  <div className="mt-6">
                    <TrustSignals ratings={entry.ratings} companySignals={entry.companySignals} competitorName={entry.competitorName} />
                  </div>
                )}
              </section>

              {/* Feature Comparison */}
              <section id="features" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
                <CategorizedFeatureTable
                  categorizedFeatures={entry.categorizedFeatures}
                  features={entry.features}
                  competitorName={entry.competitorName}
                  competitorDomain={entry.competitorDomain}
                />
              </section>

              {/* Mid-page CTA banner */}
              <section className="mb-12">
                <div className="bg-[#1240cc] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold text-lg">Switch to Infrabox</p>
                    <p className="text-white/60 text-sm">Dedicated IPs. Isolated infrastructure. From $2.50/mo.</p>
                  </div>
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    Get Started
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </a>
                </div>
              </section>

              {/* Pricing Comparison */}
              <section id="pricing" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing Comparison</h2>
                <PricingCalculator
                  pricingTiers={entry.pricingTiers}
                  competitorName={entry.competitorName}
                  competitorDomain={entry.competitorDomain}
                  infraboxPricing={entry.infraboxPricing}
                  competitorPricing={entry.competitorPricing}
                  pricingVerdict={entry.pricingVerdict}
                />
              </section>

              {/* Infrastructure and Deliverability */}
              <section id="infrastructure" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Infrastructure and Deliverability</h2>
                <div className="space-y-4">
                  {entry.infraboxAdvantages.map((advantage, i) => (
                    <div key={i}>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{advantage.title}</h3>
                      <p className="text-[15px] text-gray-600 leading-[1.75]">{advantage.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <Image src="/images/compare/infrabox-dashboard.png" alt="Infrabox dashboard managing 18M+ emails sent, 5,039 domains, and 16,754 mailboxes across Google, Microsoft, and Azure" width={640} height={400} className="w-full h-auto" />
                    </div>
                    <p className="mt-2 text-xs text-gray-400 italic">Infrabox dashboard — 18M+ emails, 5,039 domains, 16,754 mailboxes for a single client</p>
                  </div>
                  <div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <Image src={`/images/compare/${entry.slug}-homepage.png`} alt={`${entry.competitorName} homepage`} width={640} height={400} className="w-full h-auto" />
                    </div>
                    <p className="mt-2 text-xs text-gray-400 italic">{entry.competitorName} homepage</p>
                  </div>
                </div>
              </section>

              {/* Pros & Cons */}
              {entry.prosCons && (
                <section id="pros-cons" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pros & Cons</h2>
                  <ProsCons prosCons={entry.prosCons} competitorName={entry.competitorName} competitorDomain={entry.competitorDomain} />
                </section>
              )}

              {/* Who Should Choose What */}
              {entry.bottomLine && (
                <section id="bottom-line" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Should Choose What</h2>
                  <p className="text-[15px] text-gray-600 leading-[1.75]">{entry.bottomLine}</p>
                </section>
              )}

              {/* FAQ */}
              <section id="faq" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Got questions? We've got answers.</h2>
                <LearnFaq items={entry.faqs} />
              </section>

              {/* Keep Reading */}
              <section className="mb-16">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Keep Reading</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Alternatives card — only when a matching /alternatives page exists */}
                  {ALTERNATIVES_SLUGS.has(entry.slug) && (
                  <Link
                    href={`/alternatives/${entry.slug}`}
                    className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                  >
                    <div className="relative h-[120px] overflow-hidden">
                      <div className="absolute inset-0 bg-[#e8f0fe]">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <filter id={`kr-alt-${entry.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                            </filter>
                          </defs>
                          <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#kr-alt-${entry.slug})`} />
                          <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#kr-alt-${entry.slug})`} />
                          <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#kr-alt-${entry.slug})`} />
                        </svg>
                      </div>
                      <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <img src="/logo.png" alt="" aria-hidden="true" className="h-4 w-auto opacity-25" />
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700">Alternatives</span>
                        </div>
                        <p className="text-[13px] font-semibold text-[#1240cc] leading-snug line-clamp-2">{entry.competitorName} Alternatives</p>
                      </div>
                    </div>
                  </Link>
                  )}

                  {/* Comparison cards */}
                  {otherComparisons.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/compare/${comp.slug}`}
                      className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-[120px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8f0fe]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <filter id={`kr-comp-${comp.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                              </filter>
                            </defs>
                            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#kr-comp-${comp.slug})`} />
                            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#kr-comp-${comp.slug})`} />
                            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#kr-comp-${comp.slug})`} />
                          </svg>
                        </div>
                        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <img src="/logo.png" alt="" aria-hidden="true" className="h-4 w-auto opacity-25" />
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700">Comparison</span>
                          </div>
                          <p className="text-[13px] font-semibold text-[#1240cc] leading-snug line-clamp-2">Infrabox vs {comp.competitorName}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        <p className="max-w-3xl mx-auto px-6 mt-2 text-xs text-gray-500 text-center leading-relaxed">
          Competitor pricing and feature details were verified in {PRICING_VERIFIED}. Pricing changes often —
          always confirm current rates on the provider&apos;s official website.
        </p>

        {/* Bottom CTA */}
        <section className="bg-[#1240cc] mt-12">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-white leading-tight mb-3">
              Ready to try Infrabox?
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Dedicated US IPs. Isolated infrastructure. Real Google & Microsoft accounts from $2.50/mo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://app.infrabox.software/signup" className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Link href="/compare" className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm">
                Browse all comparisons
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
