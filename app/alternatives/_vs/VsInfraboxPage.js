import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "./Reveal";
import ScaleOnScroll from "./ScaleOnScroll";
import TestimonialMarquee from "./TestimonialMarquee";
import { TESTIMONIALS } from "./testimonials";
import {
  JsonLd,
  createWebPageSchema,
  createBreadcrumbSchema,
  createToolFaqSchema,
} from "@/components/seo/json-ld";
import { PRICING_VERIFIED } from "@/lib/outbound-links";

const BASE_URL = "https://www.infrabox.software";

/** Build Next.js metadata for a *-vs-infrabox page from its data object. */
export function buildVsMetadata(data) {
  const url = `${BASE_URL}/alternatives/${data.slug}`;
  // data.pageTitle already ends with "| Infrabox", so use `absolute` to stop the
  // root "%s | Infrabox" template from appending a second suffix.
  // Where a /compare/<competitor> page exists, canonicalize this head-to-head
  // conversion page to it so the two don't cannibalize the same query (SEO audit).
  const canonical =
    data.compareHref && data.compareHref.startsWith("/compare/")
      ? `${BASE_URL}${data.compareHref}`
      : url;
  return {
    title: { absolute: data.pageTitle },
    description: data.pageDescription,
    keywords: [
      `${data.competitor} alternative`,
      `best ${data.competitor} alternative`,
      `${data.competitor} vs Infrabox`,
      "email infrastructure",
      "email deliverability",
      "Infrabox",
    ],
    alternates: { canonical },
    openGraph: {
      title: data.pageTitle,
      description: data.pageDescription,
      url,
      siteName: "Infrabox",
      type: "website",
      locale: "en_US",
      images: [{ url: `${BASE_URL}/opengraph-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.pageTitle,
      description: data.pageDescription,
    },
  };
}

function Check({ className = "w-5 h-5 text-emerald-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cross({ className = "w-5 h-5 text-red-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function FeatureCell({ value }) {
  if (value === true) return <div className="flex justify-center"><Check /></div>;
  if (value === false) return <div className="flex justify-center"><Cross /></div>;
  return <div className="text-sm text-gray-700 text-center">{value}</div>;
}

/** Render an internal Next.js Link or an external anchor based on the href. */
function CompareLink({ href, className, style, children }) {
  if (!href) return null;
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  );
}

/**
 * Shared head-to-head landing page for every /alternatives/<competitor>-vs-infrabox route.
 * Driven entirely by the `data` object defined in vs-data.js — the layout mirrors the
 * original zapmail-vs-infrabox page.
 */
export default function VsInfraboxPage({ data }) {
  const {
    competitor,
    slug,
    pageTitle,
    pageDescription,
    heroSubheadline,
    featureGroups,
    reasons,
    faqs,
    compareHref,
    socialProofNote,
  } = data;

  const pageUrl = `${BASE_URL}/alternatives/${slug}`;

  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Alternatives", url: `${BASE_URL}/alternatives` },
    { name: `${competitor} vs Infrabox`, url: pageUrl },
  ]);

  const webPageData = createWebPageSchema({
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
  });

  const faqData = createToolFaqSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={webPageData} />
      <JsonLd data={faqData} />
      <Header />

      <main className="bg-white">
        {/* HERO — inset rounded card with breathing room on all sides */}
        <section className="bg-white">
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001a68] via-[#1240cc] to-[#0b34b4] text-white min-h-[72vh] md:min-h-[80vh] flex items-center justify-center">
              {/* Top radial highlight */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 0%, rgba(78, 173, 167, 0.35) 0%, rgba(18, 64, 204, 0) 70%)",
                }}
              />

              <div className="relative w-full max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center">
                {compareHref && (
                  <div className="mb-7">
                    <CompareLink
                      href={compareHref}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/85 hover:bg-white/15 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Compare Infrabox vs. {competitor}
                    </CompareLink>
                  </div>
                )}

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-4xl mx-auto mb-6">
                  Meet the #1 {competitor} Alternative
                </h1>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
                  {heroSubheadline}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1240cc] text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Switch to Infrabox
                    <span aria-hidden="true">→</span>
                  </a>
                  <a
                    href="/#book-call"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                  >
                    Book a demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF — homepage marquee with custom header */}
        {/* FEATURE COMPARISON TABLE */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                Feature Overview
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                How does {competitor} compare with Infrabox?
              </h2>
            </div>

            <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
              <div className="border border-gray-200 rounded-2xl overflow-hidden min-w-[640px] bg-white">
                {/* Sticky-feeling header */}
                <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-white border-b border-gray-200">
                  <div className="px-6 py-5" />
                  <div className="px-6 py-5 text-center border-l border-gray-100">
                    <div className="inline-flex items-center gap-2">
                      <img src="/logo.png" alt="Infrabox" className="h-6 w-auto" />
                      <span className="text-sm font-semibold text-[#1240cc]">Infrabox</span>
                    </div>
                  </div>
                  <div className="px-6 py-5 text-center border-l border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">{competitor}</span>
                  </div>
                </div>

                {featureGroups.map((group) => (
                  <div key={group.title}>
                    <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-gray-50 border-b border-gray-200">
                      <div className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {group.title}
                      </div>
                      <div className="border-l border-gray-100" />
                      <div className="border-l border-gray-100" />
                    </div>
                    {group.rows.map((row, idx) => (
                      <div
                        key={row.label}
                        className={`grid grid-cols-[1.6fr_1fr_1fr] border-b border-gray-100 ${
                          idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"
                        }`}
                      >
                        <div className="px-6 py-4 text-sm text-gray-700">{row.label}</div>
                        <div className="px-6 py-4 border-l border-gray-100 bg-[#1240cc]/[0.03]">
                          <FeatureCell value={row.infrabox} />
                        </div>
                        <div className="px-6 py-4 border-l border-gray-100">
                          <FeatureCell value={row.competitor} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500 text-center leading-relaxed">
              {competitor} pricing and features verified {PRICING_VERIFIED}. Pricing changes often — confirm current rates on {competitor}&apos;s official website.
            </p>
          </div>
        </section>

        {/* WHY CHOOSE — 3 ALTERNATING BLOCKS */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                Comparison
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">
                Why choose Infrabox over {competitor}?
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {socialProofNote}
              </p>
            </div>

            <div className="space-y-24">
              {reasons.map((reason, idx) => {
                const reverse = idx % 2 === 1;
                const bulletBase = 450;
                const bulletStep = 100;
                const buttonDelay = bulletBase + reason.bullets.length * bulletStep + 100;
                return (
                  <ScaleOnScroll
                    key={reason.title}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 md:p-16 ${
                      reverse ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#1240cc]/70 mb-3">
                        {reason.eyebrow}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight mb-4">
                        {reason.title}
                      </h3>
                      <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
                        {reason.body}
                      </p>
                      <ul className="space-y-2.5 mb-6">
                        {reason.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2.5 text-sm text-gray-700"
                          >
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      {compareHref && (
                        <Reveal as="div" direction="down" delay={buttonDelay}>
                          <CompareLink
                            href={compareHref}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            style={{
                              background:
                                "radial-gradient(85% 100% at 50% 0%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%), linear-gradient(135deg, #001a68 0%, #1240cc 50%, #0b34b4 100%)",
                            }}
                          >
                            Learn more
                            <span aria-hidden="true">→</span>
                          </CompareLink>
                        </Reveal>
                      )}
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                      <Image
                        src={reason.image}
                        alt={reason.imageAlt}
                        width={800}
                        height={500}
                        className="w-full h-auto"
                      />
                    </div>
                  </ScaleOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">
                Don&apos;t take our word for it. Take theirs.
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mb-3">
                See why our users love Infrabox. Real stories, real success, real impact.
              </p>
              <div className="flex items-center justify-center gap-1 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.366 2.446c-.785.57-1.84-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.65 8.384c-.784-.57-.381-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                ))}
              </div>
            </div>

            <TestimonialMarquee testimonials={TESTIMONIALS} />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-gray-600">
                Have additional questions on why Infrabox is an excellent alternative to {competitor}?
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white open:shadow-sm transition-shadow"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <span className="text-[15px] font-semibold text-gray-900">{faq.question}</span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center transition-transform group-open:rotate-45">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL DARK CTA */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001a68] via-[#1240cc] to-[#0b34b4] px-8 py-14 sm:px-12 sm:py-16 text-white">
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(50% 60% at 80% 0%, rgba(78, 173, 167, 0.35) 0%, rgba(18, 64, 204, 0) 70%)",
                }}
              />

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
                  Get started now
                </h2>
                <p className="text-base text-white/70 max-w-lg mb-7">
                  You&apos;re just one click away from a top-notch email infrastructure with Infrabox.
                </p>
                <div>
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1240cc] text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
