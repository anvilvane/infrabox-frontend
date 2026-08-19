import Link from "next/link";
import {
  JsonLd,
  createBreadcrumbSchema,
  createWebPageSchema,
  createItemListSchema,
} from "@/components/seo/json-ld";
import {
  getAllLearnArticles,
} from "./[slug]/learn-data";
import { getAuthorByName } from "@/lib/authors";
import LearnIndexBrowser from "@/components/learn/LearnIndexBrowser";

export const metadata = {
  title: "Learn - Email Infrastructure Guides & Comparisons",
  description:
    "In-depth guides, comparisons, reviews, and pricing breakdowns for email infrastructure. Set up domains, mailboxes, DNS, warmup, and monitoring.",
  keywords:
    "email guides, email infrastructure guides, email comparison, email warmup guide, SPF DKIM DMARC, Infrabox guides, email pricing, email deliverability",
  openGraph: {
    title: "Learn - Email Infrastructure Guides & Comparisons",
    description:
      "In-depth guides, comparisons, reviews, and pricing breakdowns for email infrastructure.",
    url: "https://www.infrabox.software/learn",
    siteName: "Infrabox",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.infrabox.software/og-default.png",
        width: 1200,
        height: 630,
        alt: "Infrabox - Email Infrastructure Guides & Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Infrastructure Guides & Resources | Infrabox",
    description:
      "In-depth guides, comparisons, reviews, and pricing breakdowns for email infrastructure.",
    images: ["https://www.infrabox.software/og-default.png"],
  },
  alternates: {
    canonical: "https://www.infrabox.software/learn",
  },
};

export default function LearnPage() {
  const articles = getAllLearnArticles();
  const articlesWithAuthor = articles.map((a) => ({
    ...a,
    authorData: getAuthorByName(a.author) || null,
  }));

  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: "https://www.infrabox.software" },
    { name: "Learn", url: "https://www.infrabox.software/learn" },
  ]);

  const webPageData = createWebPageSchema({
    name: "Learn - Email Infrastructure Guides & Comparisons",
    description:
      "In-depth guides, comparisons, reviews, and pricing breakdowns for email infrastructure.",
    url: "https://www.infrabox.software/learn",
  });

  const itemListData = createItemListSchema({
    name: "Infrabox Learning Center",
    description:
      "Guides, comparisons, reviews, and pricing breakdowns for email infrastructure",
    url: "https://www.infrabox.software/learn",
    items: articles.map((article, index) => ({
      position: index + 1,
      name: article.headline,
      description: article.metaDescription,
      url: `https://www.infrabox.software/learn/${article.slug}`,
    })),
  });

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={webPageData} />
      <JsonLd data={itemListData} />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white">
          <div className="px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 max-w-5xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
              <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-600">Learn</span>
            </nav>

            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 leading-[1.15] mb-5 max-w-2xl">
              Email Infrastructure Guides & Resources
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-xl" data-speakable="true">
              Expert guides on deliverability, DNS setup, warmup, and scaling outreach. Written by engineers managing thousands of mailboxes.
            </p>
          </div>
        </section>

        {/* Stats + Search + Grid (client) */}
        <LearnIndexBrowser articles={articlesWithAuthor} totalCount={articles.length} />

        {/* Clean CTA */}
        <section className="bg-white border-t border-gray-200">
          <div className="px-6 py-12 max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Ready to build your infrastructure?
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
    </>
  );
}
