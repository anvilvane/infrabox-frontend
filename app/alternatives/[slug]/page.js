import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorByName } from "@/lib/authors";
import { outboundRel, PRICING_VERIFIED } from "@/lib/outbound-links";
import LearnToc from "@/components/learn/LearnToc";
import LearnFaq from "@/components/learn/LearnFaq";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  JsonLd,
  createWebPageSchema,
  createBreadcrumbSchema,
  createItemListSchema,
  createToolFaqSchema,
} from "@/components/seo/json-ld";
import {
  getAlternativesEntry,
  getAllAlternativesSlugs,
  alternativesEntries,
} from "./alternatives-data";
import { getAllComparisonSlugs } from "../../compare/[slug]/compare-data";

// Slugs that have a live /compare/[slug] page. Used to guard compare links so
// alternatives without a comparison page link to the provider's site instead of 404ing.
const COMPARE_SLUGS = new Set(getAllComparisonSlugs());

/** Derive the default comparison/image slug from a provider domain. */
function deriveSlug(domain) {
  return domain.replace(/\.(com|ai|io|co)$/, "").replace(/\./g, "");
}

export async function generateStaticParams() {
  const slugs = getAllAlternativesSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getAlternativesEntry(slug);
  if (!entry) return { title: "Not Found | Infrabox" };

  return {
    title: entry.title,
    description: entry.metaDescription,
    keywords: [
      `${entry.toolName} alternatives`,
      `${entry.toolName} competitors`,
      `best ${entry.toolName} alternative`,
      "email infrastructure",
      "email deliverability",
      "Infrabox",
    ],
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `https://www.infrabox.software/alternatives/${slug}`,
      siteName: "Infrabox",
      type: "article",
      locale: "en_US",
      images: [{ url: `https://www.infrabox.software/images/compare/${slug}-homepage.png`, width: 1280, height: 800 }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.metaDescription,
    },
    alternates: {
      canonical: `https://www.infrabox.software/alternatives/${slug}`,
    },
    other: {
      "article:modified_time": new Date().toISOString().split("T")[0],
    },
  };
}

function CheckIcon({ className }) {
  return (
    <svg className={className || "w-4 h-4 text-emerald-500"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className || "w-4 h-4 text-gray-400"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const KNOWN_LOGOS = new Set([
  "aerosend", "cheapinboxes", "hypergen", "hypertide", "infrabox",
  "infraforge", "inframail", "instantly", "maildoso", "mailforge",
  "mailreef", "primeforge", "scaledmail", "smartlead", "zapmail",
]);

/** Get logo path — returns null if the logo file is not in the known set so the
 *  caller falls back to a Google favicon instead of serving a 400 from the
 *  Next.js image optimizer. */
function getLogoPath(alt) {
  if (alt.isInfrabox) return null;
  const slug = alt.domain.replace(/\.(com|ai|io|co)$/, "").replace(/\./g, "");
  return KNOWN_LOGOS.has(slug) ? `/images/compare/logos/${slug}.png` : null;
}

const RELATED_LEARN_ARTICLES = [
  { slug: "best-email-infrastructure-2026", title: "Best Email Infrastructure in 2026" },
  { slug: "email-infrastructure-setup-guide", title: "Email Infrastructure Setup Guide" },
  { slug: "domain-warmup-best-practices", title: "Domain Warmup Best Practices" },
];

export default async function AlternativesDetailPage({ params }) {
  const { slug } = await params;
  const entry = getAlternativesEntry(slug);
  if (!entry) notFound();

  // Use each entry's own author (falls back to a default) so the visible byline
  // matches the data and the author's real role comes from lib/authors.js.
  const authorData = getAuthorByName(entry.author) || getAuthorByName("Saksham Jain");
  const formattedMonthYear = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" });

  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: "https://www.infrabox.software" },
    { name: "Alternatives", url: "https://www.infrabox.software/alternatives" },
    { name: `${entry.toolName} Alternatives`, url: `https://www.infrabox.software/alternatives/${slug}` },
  ]);

  const webPageData = createWebPageSchema({
    name: entry.title,
    description: entry.metaDescription,
    url: `https://www.infrabox.software/alternatives/${slug}`,
  });

  const faqData = createToolFaqSchema(entry.faqs);

  const itemListData = createItemListSchema({
    name: `Best ${entry.toolName} Alternatives`,
    description: entry.metaDescription,
    url: `https://www.infrabox.software/alternatives/${slug}`,
    items: entry.alternatives.map((alt, index) => ({
      position: index + 1,
      name: alt.name,
      description: alt.description,
      url: alt.isInfrabox ? "https://www.infrabox.software" : `https://${alt.domain}`,
    })),
  });

  const readTime = Math.max(
    5,
    Math.ceil(
      (entry.intro.length +
        entry.alternatives.reduce((acc, alt) => acc + alt.description.length + alt.pros.join("").length + alt.cons.join("").length, 0) +
        entry.faqs.reduce((acc, faq) => acc + faq.question.length + faq.answer.length, 0)) / 900
    )
  );

  const otherAlternatives = alternativesEntries.filter((e) => e.slug !== slug);

  // Keep-reading "Infrabox vs X" card: honor an explicit entry.compareSlug
  // (e.g. smartlead-mailboxes -> smartlead), fall back to the entry slug, and
  // only render when a real /compare page exists for it.
  const keepReadingCompareSlug =
    entry.compareSlug !== undefined ? entry.compareSlug : slug;

  const tocItems = [
    { id: "methodology", label: "Methodology" },
    { id: "why-switch", label: `Why Switch from ${entry.toolName}` },
    { id: "quick-comparison", label: "Quick Comparison" },
    ...entry.alternatives.map((alt, index) => ({
      id: `alt-${index + 1}`,
      label: alt.name,
    })),
    { id: "verdict", label: "Our Verdict" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={webPageData} />
      <JsonLd data={faqData} />
      <JsonLd data={itemListData} />
      <Header />

      <main className="bg-gray-50 min-h-screen">
        <div className="flex max-w-6xl mx-auto">
          {/* Sidebar - TOC */}
          <div className="hidden lg:block w-[280px] shrink-0 border-r border-gray-200 bg-white relative">
            <div className="sticky top-0 h-screen overflow-y-auto cs-scrollbar">
              <div className="p-6">
                <LearnToc items={tocItems} />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <section className="bg-white border-b border-gray-200">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                  <Link href="/" className="hover:text-[#1240cc] transition-colors">Home</Link>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <Link href="/alternatives" className="hover:text-[#1240cc] transition-colors">Alternatives</Link>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-gray-500">{entry.toolName} Alternatives</span>
                </div>

                <p className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-4">
                  {entry.toolName} alternatives
                </p>

                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-4 max-w-3xl">
                  {entry.headline}
                </h1>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mb-5">
                  {entry.subheadline}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    {authorData ? (
                      <Image src={authorData.avatar} alt={authorData.name} width={36} height={36} sizes="36px" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#1240cc]/10 flex items-center justify-center border border-gray-200">
                        <img src="/logo.png" alt="Infrabox" className="h-5 w-auto" />
                      </div>
                    )}
                    <div>
                      {authorData ? (
                        <Link href={authorData.linkedin || `/author/${authorData.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1240cc] hover:underline block leading-none">
                          By {authorData.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-[#1240cc] block leading-none">By Infrabox Team</span>
                      )}
                      <span className="text-xs text-gray-400">{authorData?.role ? authorData.role + " · " : ""}{readTime} min read &middot; Updated {formattedMonthYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tool Screenshot */}
            <section className="bg-gray-50 border-b border-gray-200">
              <div className="px-6 lg:px-12 py-8 max-w-3xl">
                <figure>
                  <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                    <Image
                      src={`/images/compare/${entry.slug}-homepage.png`}
                      alt={`${entry.toolName} homepage`}
                      width={1280}
                      height={800}
                      priority
                      fetchPriority="high"
                      sizes="(min-width: 1024px) 672px, 100vw"
                      className="w-full h-auto"
                    />
                  </div>
                  <figcaption className="mt-2 text-xs text-gray-500 italic">
                    {entry.toolName} homepage ({entry.toolDomain}) as of {formattedMonthYear}
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* Infrabox Dashboard - why switch */}
            <section className="bg-white border-b border-gray-200">
              <div className="px-6 lg:px-12 py-8 max-w-3xl">
                <p className="text-xs font-semibold text-[#1240cc] uppercase tracking-wider mb-3">The Infrabox Alternative</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <figure>
                    <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                      <Image src="/images/dashboard/dashboard-home.png" alt="Infrabox dashboard managing 18M+ emails" width={640} height={400} sizes="(min-width: 640px) 336px, 100vw" className="w-full h-auto" />
                    </div>
                    <figcaption className="mt-2 text-[10px] text-gray-400">Infrabox dashboard - 18M+ emails, 5K domains, 16K mailboxes</figcaption>
                  </figure>
                  <figure>
                    <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                      <Image src="/images/dashboard/sequencers.png" alt="Infrabox 24+ sequencer integrations" width={640} height={400} sizes="(min-width: 640px) 336px, 100vw" className="w-full h-auto" />
                    </div>
                    <figcaption className="mt-2 text-[10px] text-gray-400">24+ sequencer integrations - Instantly, SmartLead, Apollo, and more</figcaption>
                  </figure>
                </div>
              </div>
            </section>

            {/* TL;DR */}
            <section className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <div className="bg-[#1240cc]/5 border border-[#1240cc]/10 rounded-lg p-5">
                  <p className="text-xs font-semibold text-[#1240cc] uppercase tracking-wider mb-2">TL;DR</p>
                  <p className="text-[15px] text-gray-700 leading-relaxed">{entry.intro}</p>
                </div>
              </div>
            </section>

            {/* Methodology */}
            <section id="methodology" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-5">
                  How We Selected These Alternatives
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <ul className="space-y-3">
                    {[
                      "Infrastructure quality: real Google/Microsoft accounts vs shared IPs, US IP verification, dedicated vs pooled resources",
                      "Deliverability tools: warmup isolation, inbox placement testing, blacklist monitoring, DNS automation",
                      "Pricing transparency: no hidden costs, clear per-mailbox rates, honest total cost of ownership",
                      "Feature completeness: sequencer integrations, API access, bulk management, admin controls",
                      "User reputation: G2 and TrustPilot reviews, community feedback, support responsiveness",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <svg className="w-5 h-5 text-[#1240cc] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  Competitor pricing and feature details were verified in {PRICING_VERIFIED}. Pricing changes
                  frequently — always confirm current rates on each provider&apos;s official website (linked below).
                </p>
              </div>
            </section>

            {/* Why People Switch */}
            <section id="why-switch" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Why people switch from {entry.toolName}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {entry.whyLook.map((reason, index) => {
                    const firstSentenceEnd = reason.indexOf(". ");
                    const heading = firstSentenceEnd > 0 && firstSentenceEnd < 80 ? reason.substring(0, firstSentenceEnd) : null;
                    const body = heading ? reason.substring(firstSentenceEnd + 2) : reason;
                    return (
                      <div key={index} className="border border-gray-200 bg-white rounded-xl p-5">
                        {heading ? (
                          <>
                            <p className="text-sm font-semibold text-gray-900 mb-2">{heading}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600 leading-relaxed">{reason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Quick Comparison Table */}
            <section id="quick-comparison" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6 max-w-3xl">
                  Quick Comparison
                </h2>
                <div className="overflow-x-auto -mx-6 lg:-mx-12 px-6 lg:px-12">
                  <div className="border border-gray-200 rounded-xl overflow-hidden min-w-[700px]">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-[180px]">Platform</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Best For</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-[200px]">Pricing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.alternatives.map((alt, index) => {
                          const logoPath = getLogoPath(alt);
                          return (
                            <tr
                              key={index}
                              className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                                alt.isInfrabox ? "bg-[#1240cc]/[0.03]" : "hover:bg-gray-50"
                              }`}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  {alt.isInfrabox ? (
                                    <img src="/logo.png" alt="Infrabox" className="h-7 w-auto rounded-md" />
                                  ) : logoPath ? (
                                    <Image src={logoPath} alt={alt.name} width={28} height={28} sizes="28px" className="w-7 h-7 rounded-md border border-gray-100" />
                                  ) : (
                                    <img src={`https://www.google.com/s2/favicons?domain=${alt.domain}&sz=32`} alt="" className="w-7 h-7 rounded-md" />
                                  )}
                                  <div>
                                    <span className="text-sm font-semibold text-gray-900">{alt.name}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 leading-relaxed">{alt.bestFor}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs leading-snug ${alt.isInfrabox ? "text-[#1240cc] font-semibold" : "text-gray-600"}`}>
                                  {alt.pricing.length > 40 ? alt.pricing.split('.')[0] : alt.pricing}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Mid-page CTA */}
            {slug !== "infrabox" && (
              <section className="bg-gray-50 border-b border-gray-200">
                <div className="px-6 lg:px-12 py-6 max-w-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Switch to Infrabox</h3>
                      <p className="text-sm text-gray-600">
                        Plans from $39/mo with 10 mailboxes included. InfraGuard monitoring and 24+ sequencer integrations.
                      </p>
                    </div>
                    <a
                      href="https://app.infrabox.software/signup"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] text-white text-sm font-semibold rounded-lg hover:bg-[#0b34b4] transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      Get Started
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* The Alternatives List */}
            <section id="alternatives" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-4xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-8">
                  The {entry.alternatives.length} Best {entry.toolName} Alternatives
                </h2>

                <div className="space-y-8">
                  {entry.alternatives.map((alt, index) => {
                    const logoPath = getLogoPath(alt);
                    const comparisonSlug = alt.compareSlug || deriveSlug(alt.domain);
                    const imageSlug = alt.imageSlug || deriveSlug(alt.domain);
                    const hasCompare = !alt.isInfrabox && COMPARE_SLUGS.has(comparisonSlug);

                    return (
                      <div key={index} className="space-y-8">
                        {/* Second mid-page CTA after 4th alternative */}
                        {index === 4 && slug !== "infrabox" && (
                          <div className="bg-[#1240cc] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">Switch to Infrabox</h3>
                              <p className="text-sm text-white/70">
                                Plans from $39/mo with 10 mailboxes included. InfraGuard monitoring and 24+ integrations.
                              </p>
                            </div>
                            <a
                              href="https://app.infrabox.software/signup"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1240cc] text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap flex-shrink-0"
                            >
                              Get Started
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        )}

                        {/* Alternative Card */}
                        <div
                          id={`alt-${index + 1}`}
                          className={`border rounded-xl scroll-mt-4 ${
                            alt.isInfrabox ? "border-[#1240cc]/30 bg-[#1240cc]/[0.02]" : "border-gray-200 bg-white"
                          }`}
                        >
                          {/* Header */}
                          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                              {alt.isInfrabox ? (
                                <img src="/logo.png" alt="Infrabox" className="h-7 w-auto" />
                              ) : logoPath ? (
                                <Image src={logoPath} alt={alt.name} width={28} height={28} sizes="28px" className="w-7 h-7 rounded-md border border-gray-100" />
                              ) : (
                                <img src={`https://www.google.com/s2/favicons?domain=${alt.domain}&sz=32`} alt="" className="w-7 h-7 rounded-md" />
                              )}
                              <h3 className="text-lg font-semibold text-gray-900">{alt.name}</h3>
                              <span className="text-xs text-gray-400">{alt.domain}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-700">Best for:</span>{" "}
                              {alt.bestFor}
                            </p>
                          </div>

                          {/* Body */}
                          <div className="px-6 py-5">
                            {/* Description */}
                            <div className="mb-5">
                              {alt.description.split("\n\n").length > 1 ? (
                                alt.description.split("\n\n").map((para, i) => (
                                  <p key={i} className="text-[14px] text-gray-600 leading-relaxed mb-2 last:mb-0">{para}</p>
                                ))
                              ) : (
                                <p className="text-[14px] text-gray-600 leading-relaxed">{alt.description}</p>
                              )}
                            </div>

                            {/* Platform screenshot */}
                            <div className="mb-5 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                              <Image
                                src={alt.isInfrabox ? "/images/dashboard/dashboard-home.png" : `/images/compare/${imageSlug}-homepage.png`}
                                alt={`${alt.name} ${alt.isInfrabox ? "dashboard" : "homepage"}`}
                                width={800}
                                height={450}
                                loading="lazy"
                                sizes="(min-width: 1024px) 760px, 100vw"
                                className="w-full h-auto"
                              />
                            </div>

                            {/* Strengths & Limitations */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                              <div>
                                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Strengths</p>
                                <ul className="space-y-1.5">
                                  {alt.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                      <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                      {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Limitations</p>
                                <ul className="space-y-1.5">
                                  {alt.cons.map((con, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                                      <span className="flex-shrink-0 leading-5">&ndash;</span>
                                      {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Pricing + CTA row */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Pricing</span>
                                <p className={`text-sm font-medium ${alt.isInfrabox ? "text-[#1240cc]" : "text-gray-900"}`}>
                                  {alt.pricing.length > 60 ? alt.pricing.split('.')[0] : alt.pricing}
                                </p>
                              </div>
                              {alt.isInfrabox ? (
                                <a
                                  href="https://app.infrabox.software/signup"
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1240cc] hover:underline"
                                >
                                  Get Started
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                  </svg>
                                </a>
                              ) : hasCompare ? (
                                <Link
                                  href={`/compare/${comparisonSlug}`}
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1240cc] hover:underline whitespace-nowrap"
                                >
                                  Full comparison
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                  </svg>
                                </Link>
                              ) : (
                                <a
                                  href={`https://${alt.domain}`}
                                  target="_blank"
                                  rel={outboundRel(`https://${alt.domain}`)}
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1240cc] hover:underline whitespace-nowrap"
                                >
                                  Visit site
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Verdict */}
            <section id="verdict" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Our Verdict
                </h2>
                <div className="bg-[#1240cc]/5 border border-[#1240cc]/10 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-[#1240cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-[#1240cc] uppercase tracking-wider">Bottom Line</p>
                  </div>
                  <p className="text-[15px] text-gray-700 leading-relaxed">{entry.verdict}</p>
                </div>
              </div>
            </section>

            {/* Keep Reading */}
            <section className="bg-gray-50 border-b border-gray-200">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Keep Reading
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Compare page */}
                  {keepReadingCompareSlug && COMPARE_SLUGS.has(keepReadingCompareSlug) && (
                    <Link
                      href={`/compare/${keepReadingCompareSlug}`}
                      className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-[120px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8f0fe]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <filter id={`kr-comp-${slug}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                              </filter>
                            </defs>
                            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#kr-comp-${slug})`} />
                            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#kr-comp-${slug})`} />
                            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#kr-comp-${slug})`} />
                          </svg>
                        </div>
                        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <img src="/logo.png" alt="" aria-hidden="true" className="h-4 w-auto opacity-25" />
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700">Comparison</span>
                          </div>
                          <p className="text-[13px] font-semibold text-[#1240cc] leading-snug line-clamp-2">Infrabox vs {entry.toolName}</p>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Learn articles */}
                  {RELATED_LEARN_ARTICLES.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/learn/${article.slug}`}
                      className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-[120px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8f0fe]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <filter id={`kr-learn-${article.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                              </filter>
                            </defs>
                            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#kr-learn-${article.slug})`} />
                            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#kr-learn-${article.slug})`} />
                            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#kr-learn-${article.slug})`} />
                          </svg>
                        </div>
                        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <img src="/logo.png" alt="" aria-hidden="true" className="h-4 w-auto opacity-25" />
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700">Guide</span>
                          </div>
                          <p className="text-[13px] font-semibold text-[#1240cc] leading-snug line-clamp-2">{article.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Other alternatives */}
                  {otherAlternatives.slice(0, 3).map((other) => (
                    <Link
                      key={other.slug}
                      href={`/alternatives/${other.slug}`}
                      className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-[120px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8f0fe]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <filter id={`kr-alt-${other.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                              </filter>
                            </defs>
                            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#kr-alt-${other.slug})`} />
                            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#kr-alt-${other.slug})`} />
                            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#kr-alt-${other.slug})`} />
                          </svg>
                        </div>
                        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <img src="/logo.png" alt="" aria-hidden="true" className="h-4 w-auto opacity-25" />
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700">Alternatives</span>
                          </div>
                          <p className="text-[13px] font-semibold text-[#1240cc] leading-snug line-clamp-2">{other.toolName} Alternatives</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Frequently Asked Questions
                </h2>
                <LearnFaq items={entry.faqs} />
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-white border-t border-gray-200">
              <div className="px-6 lg:px-12 py-12 max-w-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                    Ready to switch?
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Plans from $39/mo with 10 mailboxes included.
                  </p>
                </div>
                <a
                  href="https://app.infrabox.software/signup"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1240cc] text-white text-sm font-semibold rounded-lg hover:bg-[#0b34b4] transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Get Started
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
