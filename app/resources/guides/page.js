import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuthorByName } from '@/lib/authors';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema } from '@/components/seo/json-ld';
import { getLearnArticle } from '@/app/learn/[slug]/learn-data';

const categoryLabels = {
  "email-deliverability-guide": "DELIVERABILITY",
  "email-warmup-guide": "WARMUP",
  "dns-setup-guide": "TECHNICAL",
  "us-ip-benefits-guide": "STRATEGY",
  "agency-workflows-guide": "WORKFLOWS",
};

const categoryColors = {
  DELIVERABILITY: "text-blue-600",
  WARMUP: "text-emerald-600",
  TECHNICAL: "text-amber-600",
  STRATEGY: "text-violet-600",
  WORKFLOWS: "text-rose-600",
};

const guideSlugs = [
  "email-deliverability-guide",
  "email-warmup-guide",
  "dns-setup-guide",
  "us-ip-benefits-guide",
  "agency-workflows-guide",
];

const guideTopics = {
  "email-deliverability-guide": ["SPF / DKIM / DMARC", "Sender Reputation", "Inbox Placement"],
  "email-warmup-guide": ["Gradual Scaling", "Engagement Tactics", "Warmup Schedule"],
  "dns-setup-guide": ["DNS Configuration", "Authentication", "Record Validation"],
  "us-ip-benefits-guide": ["Geographic Trust", "ISP Preferences", "IP Reputation"],
  "agency-workflows-guide": ["Multi-client Setup", "Bulk Management", "Scaling"],
};

export default function GuidesPage() {
  const guides = guideSlugs
    .map((slug) => getLearnArticle(slug))
    .filter(Boolean);

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Email Infrastructure Guides",
        description: "Expert guides on DNS setup, email warmup, email deliverability, and agency workflows.",
        url: "https://www.infrabox.software/resources/guides",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Resources", url: "https://www.infrabox.software/resources" },
        { name: "Guides", url: "https://www.infrabox.software/resources/guides" },
      ])} />
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-16 sm:py-20 max-w-5xl mx-auto text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/resources" className="hover:text-gray-900 transition-colors">Resources</Link>
              <span>/</span>
              <span className="text-gray-600">Guides</span>
            </nav>

            <span className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] block mb-4">
              Guides & Tutorials
            </span>
            <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-4">
              Master email deliverability
            </h1>
            <p className="text-[#1240cc] text-lg sm:text-xl font-medium">
              Expert guides built on real-world experience
            </p>
            <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4 leading-relaxed mb-10">
              From DNS configuration to agency-scale workflows — in-depth guides
              built from sending millions of emails.
            </p>

            {/* Stats bar */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span>
                <span className="font-semibold text-gray-900">{guides.length}</span>{" "}
                in-depth guides
              </span>
              <span className="border-l border-gray-300 pl-6">
                Expert-written
              </span>
              <span className="border-l border-gray-300 pl-6">
                Updated regularly
              </span>
            </div>
          </div>
        </section>

        {/* Card Grid */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, index) => {
                const authorData = getAuthorByName(guide.author);
                const category = categoryLabels[guide.slug] || "GUIDE";
                const catColor = categoryColors[category] || "text-[#1240cc]";
                const topics = guideTopics[guide.slug] || [];
                const link = `/learn/${guide.slug}`;
                return (
                  <Link
                    key={guide.slug}
                    href={link}
                    className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    {/* Pastel green mesh thumbnail */}
                    <div className="relative h-[150px] overflow-hidden">
                      <div className="absolute inset-0 bg-[#e8f0fe]">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <filter id={`m-${guide.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                            </filter>
                          </defs>
                          <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#m-${guide.slug})`} />
                          <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#m-${guide.slug})`} />
                          <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#m-${guide.slug})`} />
                        </svg>
                      </div>
                      <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <img src="/logo.png" alt="Infrabox" className="h-5 w-auto opacity-30" />
                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#1240cc]/50">
                            {guide.readingTime}
                          </span>
                        </div>
                        <h2 className="text-[#1240cc] font-semibold text-[15px] leading-snug">
                          {guide.headline}
                        </h2>
                      </div>
                    </div>

                    {/* Content below */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${catColor}`}>
                          {category}
                        </span>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1240cc] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="text-[16px] font-semibold text-gray-900 group-hover:text-[#1240cc] transition-colors leading-snug mb-2">
                        {guide.headline}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                        {guide.excerpt}
                      </p>

                      {/* Topic tags */}
                      {topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {topics.map((topic) => (
                            <span
                              key={topic}
                              className="text-[9px] font-medium uppercase tracking-[0.48px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Author row */}
                      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
                        {authorData ? (
                          <Image
                            src={authorData.avatar}
                            alt={authorData.name}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#1240cc]/10 flex items-center justify-center">
                            <Image
                              src="/logo.png"
                              alt="Infrabox"
                              width={16}
                              height={16}
                              className="w-4 h-4"
                            />
                          </div>
                        )}
                        <div>
                          {authorData ? (
                            <Link
                              href={`/author/${authorData.slug}`}
                              className="text-xs font-medium text-gray-700 block leading-none hover:underline"
                            >
                              {guide.author}
                            </Link>
                          ) : (
                            <span className="text-xs font-medium text-gray-700 block leading-none">
                              {guide.author}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400">
                            {guide.readingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-white">
          <div className="px-6 py-14 lg:py-20 flex flex-col items-center text-center">
            <span className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] block mb-4">
              Ready to implement?
            </span>
            <h2 className="text-[24px] sm:text-[32px] font-semibold text-gray-900 leading-[1.2] mb-3">
              Put these strategies into action
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
