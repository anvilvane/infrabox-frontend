import React from 'react';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd, createWebPageSchema, createBreadcrumbSchema } from '@/components/seo/json-ld';

const categoryColors = {
  tools: "text-emerald-600",
  guides: "text-blue-600",
  blog: "text-violet-600",
  compare: "text-amber-600",
  alternatives: "text-rose-600",
};

const resourceSections = [
  {
    key: "tools",
    label: "Tools",
    title: "20+ Email Tools",
    description: "Professional-grade checkers, generators, and validators for SPF, DKIM, DMARC, BIMI, blacklists, and more. No signup required.",
    count: "20+ tools",
    link: "/resources/tools",
    highlights: ["SPF / DKIM / DMARC Checkers", "DNS Validator", "Deliverability Score", "Blacklist Checker"],
  },
  {
    key: "guides",
    label: "In-Depth Guides",
    title: "5 Expert Guides",
    description: "Comprehensive, long-form guides covering email deliverability, DNS setup, warmup processes, US IP advantages, and agency workflows.",
    count: "5 guides",
    link: "/resources/guides",
    highlights: ["Email Deliverability", "Email Warmup", "DNS Records Setup", "Agency Workflows"],
  },
  {
    key: "blog",
    label: "Blog & Learn",
    title: "52+ Articles",
    description: "Expert articles on email strategy, inbox placement, email infrastructure, and deliverability best practices.",
    count: "52+ articles",
    link: "/learn",
    highlights: ["Email Strategy", "Inbox Placement", "Infrastructure Tips", "Industry Comparisons"],
  },
  {
    key: "compare",
    label: "Comparisons",
    title: "11 Head-to-Head Comparisons",
    description: "Detailed side-by-side comparisons of Infrabox with other email infrastructure providers on features, pricing, and deliverability.",
    count: "11 comparisons",
    link: "/compare",
    highlights: ["Feature Breakdowns", "Pricing Analysis", "Deliverability Data", "Migration Guides"],
  },
  {
    key: "alternatives",
    label: "Alternatives",
    title: "11 Alternative Analyses",
    description: "Explore the best alternatives to popular email infrastructure platforms and find the right fit for your outreach needs.",
    count: "11 alternatives",
    link: "/alternatives",
    highlights: ["Platform Reviews", "Feature Comparisons", "Pricing Overviews", "Migration Support"],
  },
];

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Infrabox Resources",
        description: "Email deliverability tools, guides, and blog posts for email infrastructure.",
        url: "https://www.infrabox.software/resources",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Resources", url: "https://www.infrabox.software/resources" },
      ])} />
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-16 sm:py-20 max-w-5xl mx-auto text-center">
            <span className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] block mb-4">
              Resource Center
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-4">
              Master email deliverability
            </h1>
            <p className="text-[#1240cc] text-lg sm:text-xl font-medium">
              Tools, guides, and insights for email success
            </p>
            <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4 leading-relaxed">
              Everything you need to reach the inbox. From beginner guides to advanced
              strategies, learn from the experts who power 5,000+ businesses.
            </p>
          </div>
        </section>

        {/* Resource Sections Grid */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="px-6 py-12 lg:py-16 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceSections.map((section) => {
                const color = categoryColors[section.key];
                return (
                  <Link
                    key={section.key}
                    href={section.link}
                    className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    {/* Pastel green mesh thumbnail */}
                    <div className="relative h-[150px] overflow-hidden">
                      <div className="absolute inset-0 bg-[#e8f0fe]">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <filter id={`m-${section.key}`} x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                            </filter>
                          </defs>
                          <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#m-${section.key})`} />
                          <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#m-${section.key})`} />
                          <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#m-${section.key})`} />
                        </svg>
                      </div>
                      <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <img src="/logo.png" alt="Infrabox" className="h-5 w-auto opacity-30" />
                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#1240cc]/50">
                            {section.count}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <h2 className="text-[#1240cc] font-semibold text-[15px] leading-snug">
                            {section.title}
                          </h2>
                          <svg className="w-4 h-4 text-[#1240cc]/30 group-hover:text-[#1240cc]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Content below */}
                    <div className="p-5 flex-1 flex flex-col">
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${color} mb-2`}>
                        {section.label}
                      </span>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">
                        {section.description}
                      </p>

                      {/* Highlight tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {section.highlights.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-medium uppercase tracking-[0.48px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center pt-3 border-t border-gray-100">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1240cc] group-hover:gap-2.5 transition-all">
                          Explore
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Access Stats */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-12 lg:py-16 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] block mb-3">
                By the numbers
              </span>
              <h2 className="text-[24px] sm:text-[32px] font-semibold text-gray-900 leading-[1.2]">
                Everything in one place
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { number: "20+", label: "Tools", link: "/resources/tools" },
                { number: "5", label: "Expert Guides", link: "/resources/guides" },
                { number: "52+", label: "Blog Articles", link: "/learn" },
                { number: "11", label: "Comparisons", link: "/compare" },
                { number: "11", label: "Alternatives", link: "/alternatives" },
              ].map((stat) => (
                <Link
                  key={stat.label}
                  href={stat.link}
                  className="group text-center p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <p className="text-[28px] font-semibold text-[#1240cc] mb-1 group-hover:scale-105 transition-transform">
                    {stat.number}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50">
          <div className="px-6 py-14 lg:py-20 flex flex-col items-center text-center">
            <span className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] block mb-4">
              Ready to implement?
            </span>
            <h2 className="text-[24px] sm:text-[32px] font-semibold text-gray-900 leading-[1.2] mb-3">
              Start reaching the inbox today
            </h2>
            <p className="text-gray-500 text-base max-w-md mb-8 leading-relaxed">
              Plans from $39/mo with 10 mailboxes included. Set up in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://app.infrabox.software/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <Link
                href="/resources/tools"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-800 text-sm font-semibold rounded-full hover:border-gray-400 hover:bg-white transition-colors"
              >
                Explore tools
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
