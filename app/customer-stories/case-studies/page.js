import Link from "next/link";
import Image from "next/image";
import {
  JsonLd,
  createBreadcrumbSchema,
  createWebPageSchema,
  createItemListSchema,
} from "@/components/seo/json-ld";
import CustomerStoriesHero from "@/components/CustomerStoriesHero";
import { getAllCaseStudies } from "@/app/case-studies/[slug]/case-studies-data";

export const metadata = {
  title: "Case Studies - How Teams Scale Email on Infrabox",
  description:
    "Real-world case studies on how agencies and sales teams scale email infrastructure on Infrabox — the systems, the math, and the results behind reliable inbox placement.",
  keywords:
    "Infrabox case studies, email case study, agency email, email infrastructure results, email scaling",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Case Studies - How Teams Scale Email on Infrabox",
    description:
      "Real-world case studies on how agencies and sales teams scale email infrastructure on Infrabox.",
    url: "https://www.infrabox.software/customer-stories/case-studies",
    siteName: "Infrabox",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.infrabox.software/og-default.png",
        width: 1200,
        height: 630,
        alt: "Infrabox Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Infrabox",
    description:
      "Real-world case studies on how teams scale email infrastructure on Infrabox.",
    images: ["https://www.infrabox.software/og-default.png"],
  },
  alternates: {
    canonical: "https://www.infrabox.software/customer-stories/case-studies",
  },
};

export default function CaseStudiesPage() {
  const studies = getAllCaseStudies();

  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: "https://www.infrabox.software" },
    { name: "Customer Stories", url: "https://www.infrabox.software/customer-stories" },
    { name: "Case Studies", url: "https://www.infrabox.software/customer-stories/case-studies" },
  ]);

  const webPageData = createWebPageSchema({
    name: "Case Studies - How Teams Scale Email on Infrabox",
    description:
      "Real-world case studies on how agencies and sales teams scale email infrastructure on Infrabox.",
    url: "https://www.infrabox.software/customer-stories/case-studies",
  });

  const itemListData = createItemListSchema({
    name: "Infrabox Case Studies",
    description:
      "How agencies and sales teams scale email infrastructure on Infrabox",
    url: "https://www.infrabox.software/customer-stories/case-studies",
    items: studies.map((study, index) => ({
      position: index + 1,
      name: study.headline,
      description: study.metaDescription,
      url: `https://www.infrabox.software/case-studies/${study.slug}`,
    })),
  });

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={webPageData} />
      <JsonLd data={itemListData} />

      <main>
        <CustomerStoriesHero
          breadcrumb="Case Studies"
          eyebrow="In Depth"
          headlineLead="The systems, the math,"
          headlineAccent="and the results."
          subtext="How agencies and sales teams scale email infrastructure on Infrabox — the full story behind reliable inbox placement."
        />

        {/* Masonry wall */}
        <section className="px-6 pb-16 sm:pb-20 max-w-4xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {studies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group break-inside-avoid mb-5 flex flex-col rounded-lg border border-gray-200 bg-white hover:shadow-md hover:shadow-gray-200/60 hover:border-gray-300 transition-shadow duration-200 overflow-hidden"
              >
                {/* Clean cover image — the blog screenshot, nothing overlaid */}
                <div className="relative h-[170px] overflow-hidden bg-gray-50 border-b border-gray-100">
                  {study.coverImage ? (
                    <Image
                      src={study.coverImage}
                      alt={study.headline}
                      width={640}
                      height={340}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 400 200"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <filter id={`cs-${study.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                        </filter>
                      </defs>
                      <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#cs-${study.slug})`} />
                      <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#cs-${study.slug})`} />
                      <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#cs-${study.slug})`} />
                    </svg>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {study.client?.name && (
                    <div className="text-sm font-semibold text-gray-900 mb-2">
                      {study.client.name}
                    </div>
                  )}
                  <p className="text-[12px] text-gray-500 leading-relaxed flex-1">
                    {study.excerpt}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 truncate">
                      {study.readingTime}
                    </span>
                    <span className="text-[11px] font-semibold text-[#1240cc] group-hover:translate-x-0.5 transition-transform whitespace-nowrap flex items-center gap-1">
                      Read story
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl px-6 sm:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Ready to build your infrastructure?
              </h2>
              <p className="text-sm text-gray-500">
                Plans from $39/mo with 10 mailboxes included. No platform fee.
                Setup in under 10 minutes.
              </p>
            </div>
            <a
              href="https://app.infrabox.software/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-colors text-sm shrink-0"
            >
              Get Started
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
