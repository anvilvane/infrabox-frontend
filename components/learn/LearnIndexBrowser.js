'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TAG_STYLE = {
  Guides:       'bg-[#1240cc]/10 text-[#1240cc]',
  Comparisons:  'bg-amber-100 text-amber-700',
  Reviews:      'bg-violet-100 text-violet-700',
  Alternatives: 'bg-emerald-100 text-emerald-700',
  Pricing:      'bg-orange-100 text-orange-700',
  Educational:  'bg-sky-100 text-sky-700',
  Solutions:    'bg-rose-100 text-rose-700',
};

const CTA_LABEL = {
  Guides: 'Read guide',
  Comparisons: 'View comparison',
  Reviews: 'Read review',
  Alternatives: 'Explore options',
  Pricing: 'See breakdown',
  Educational: 'Learn more',
  Solutions: 'Read solution',
};

export default function LearnIndexBrowser({ articles, totalCount }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => {
      return (
        a.headline?.toLowerCase().includes(q) ||
        a.excerpt?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.author?.toLowerCase().includes(q) ||
        a.slug?.toLowerCase().includes(q)
      );
    });
  }, [articles, query]);

  return (
    <>
      {/* Stats + Search row (sits inside the hero white block) */}
      <section className="bg-white border-b border-gray-200">
        <div className="px-6 pb-10 sm:pb-12 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>
                <span className="font-semibold text-gray-900">{totalCount}+</span> articles
              </span>
              <span className="border-l border-gray-200 pl-6">
                <span className="font-semibold text-gray-900">7</span> categories
              </span>
              <span className="border-l border-gray-200 pl-6">
                <span className="font-semibold text-gray-900">3</span> authors
              </span>
            </div>

            {/* Premium search bar */}
            <div className="relative w-full sm:w-[300px] group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400 group-focus-within:text-[#1240cc] transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-3.8-3.8" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides, reviews…"
                aria-label="Search articles"
                className="w-full pl-10 pr-9 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-white border border-gray-200 rounded-full shadow-[0_1px_2px_rgba(18, 64, 204,0.04)] outline-none focus:outline-none focus-visible:outline-none focus:border-[#1240cc]/40 hover:border-gray-300 transition-all duration-200"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#1240cc] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="bg-gray-50/50 border-b border-gray-200">
        <div className="px-6 py-10 lg:py-14 max-w-5xl mx-auto">
          {filtered.length > 0 ? (
            <>
              {query && (
                <p className="text-xs text-gray-500 mb-5">
                  Showing <span className="font-semibold text-gray-900">{filtered.length}</span> of {articles.length} articles
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((article) => {
                  const tag = TAG_STYLE[article.category] || TAG_STYLE.Guides;
                  const cta = CTA_LABEL[article.category] || 'Read more';
                  const authorData = article.authorData;
                  return (
                    <Link
                      key={article.slug}
                      href={`/learn/${article.slug}`}
                      className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      <div className="relative h-[150px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8f0fe]">
                          <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 400 200"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <defs>
                              <filter id={`m-${article.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                              </filter>
                            </defs>
                            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#m-${article.slug})`} />
                            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#m-${article.slug})`} />
                            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#m-${article.slug})`} />
                          </svg>
                        </div>
                        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <img src="/logo.png" alt="Infrabox" className="h-5 w-auto opacity-30" />
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${tag}`}>
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-[14px] font-semibold text-[#1240cc] leading-snug line-clamp-3">
                            {article.headline}
                          </h3>
                        </div>
                      </div>

                      <div className="px-4 pt-3 pb-0 flex-1 flex flex-col">
                        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {authorData ? (
                            <Image
                              src={authorData.avatar}
                              alt={authorData.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[#1240cc]/10 flex items-center justify-center shrink-0">
                              <Image src="/logo.png" alt="Infrabox" width={12} height={12} className="w-3 h-3" />
                            </div>
                          )}
                          <span className="text-[11px] text-gray-500 truncate">{article.author || "Infrabox"}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#1240cc] group-hover:translate-x-0.5 transition-transform whitespace-nowrap flex items-center gap-1">
                          {cta}
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-[#1240cc]/5 mb-4">
                <svg className="w-5 h-5 text-[#1240cc]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-3.8-3.8" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">No articles match &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-500 mb-4">Try a different keyword or browse all guides.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs font-semibold text-[#1240cc] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
