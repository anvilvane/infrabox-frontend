import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd, createWebPageSchema, createBreadcrumbSchema, createItemListSchema } from '@/components/seo/json-ld';

const TAG_STYLE = {
  "DNS":      "bg-[#1240cc]/10 text-[#1240cc]",
  "Google":   "bg-amber-100 text-amber-700",
  "Recovery": "bg-rose-100 text-rose-700",
};

const articles = [
  {
    slug: "dns-management",
    href: "/dns-management",
    title: "DNS Management for Email Infrastructure",
    headline: "Complete DNS Management Guide",
    description: "Learn how to configure and manage SPF, DKIM, and DMARC records for maximum email deliverability.",
    category: "DNS",
    readingTime: "8 min read",
    topics: ["SPF Records", "DKIM Setup", "DMARC Policy"],
  },
  {
    slug: "google-workspace-accounts",
    href: "/google-workspace-accounts",
    title: "Google Workspace for Email",
    headline: "Google Workspace Setup & Optimization",
    description: "Optimize your Google Workspace accounts for email outreach. Configuration best practices and deliverability tips.",
    category: "Google",
    readingTime: "10 min read",
    topics: ["Account Setup", "Deliverability", "Best Practices"],
  },
  {
    slug: "google-panel-checker",
    href: "/resources/knowledge-base/google-panel-checker",
    title: "Google Workspace Admin Panel Checker",
    headline: "Verify Your Google Admin Panel Health",
    description: "Check your Google Workspace admin panel status, detect suspension risks, and monitor workspace health metrics.",
    category: "Google",
    readingTime: "6 min read",
    topics: ["Panel Diagnostics", "Health Monitor", "Risk Detection"],
  },
  {
    slug: "google-disruption",
    href: "/resources/knowledge-base/google-disruption",
    title: "Google Email Disruption Guide",
    headline: "Navigate Google Email Changes",
    description: "Stay ahead of Google's email policy changes and service disruptions. Understand impacts on email infrastructure.",
    category: "Google",
    readingTime: "7 min read",
    topics: ["Policy Changes", "Service Status", "Mitigation"],
  },
  {
    slug: "google-suspension",
    href: "/resources/knowledge-base/google-suspension",
    title: "Google Account Suspension Recovery",
    headline: "Recover from Google Suspensions",
    description: "Step-by-step guide to recovering suspended Google Workspace accounts. Prevention strategies and appeal processes.",
    category: "Recovery",
    readingTime: "12 min read",
    topics: ["Suspension Appeals", "Prevention", "Backup Strategy"],
  },
];

export default function KnowledgeBasePage() {
  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Knowledge Base - Email Infrastructure & Google Workspace",
        description: "Comprehensive guides on DNS management, Google Workspace configuration, and email infrastructure troubleshooting.",
        url: "https://www.infrabox.software/resources/knowledge-base",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Resources", url: "https://www.infrabox.software/resources" },
        { name: "Knowledge Base", url: "https://www.infrabox.software/resources/knowledge-base" },
      ])} />
      <JsonLd data={createItemListSchema({
        name: "Infrabox Knowledge Base",
        description: "Email infrastructure knowledge base articles",
        url: "https://www.infrabox.software/resources/knowledge-base",
        items: articles.map((article, index) => ({
          position: index + 1,
          name: article.title,
          description: article.description,
          url: `https://www.infrabox.software${article.href}`,
        })),
      })} />

      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-12 sm:py-16 max-w-5xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
              <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-600">Knowledge Base</span>
            </nav>

            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 leading-[1.15] mb-5 max-w-2xl">
              Email Infrastructure Knowledge Base
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-8">
              DNS configuration, Google Workspace optimization, and troubleshooting guides for email infrastructure.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span><span className="font-semibold text-gray-900">{articles.length}</span> articles</span>
              <span className="border-l border-gray-200 pl-6"><span className="font-semibold text-gray-900">3</span> categories</span>
            </div>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="bg-gray-50/50 border-b border-gray-200">
          <div className="px-6 py-10 lg:py-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => {
              const tag = TAG_STYLE[article.category] || TAG_STYLE.DNS;
              return (
                <Link
                  key={article.slug}
                  href={article.href}
                  className="group flex flex-col rounded-xl border border-gray-200/80 overflow-hidden hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Pastel green mesh thumbnail */}
                  <div className="relative h-[130px] overflow-hidden">
                    <div className="absolute inset-0 bg-[#e8f0fe]">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <filter id={`kb-${article.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                          </filter>
                        </defs>
                        <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#kb-${article.slug})`} />
                        <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#kb-${article.slug})`} />
                        <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#kb-${article.slug})`} />
                      </svg>
                    </div>
                    <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <img src="/logo.png" alt="Infrabox" className="h-5 w-auto opacity-30" />
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${tag}`}>
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-[14px] font-semibold text-[#1240cc] leading-snug line-clamp-2">
                        {article.headline}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col bg-white">
                    <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                      {article.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400">{article.readingTime}</span>
                      <span className="text-[11px] font-semibold text-[#1240cc] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read article
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Clean CTA */}
        <section className="bg-white border-t border-gray-200">
          <div className="px-6 py-12 max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Need automated infrastructure?
              </h2>
              <p className="text-sm text-gray-500">
                Infrabox handles DNS, warmup, and monitoring automatically. Plans from $39/mo.
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
