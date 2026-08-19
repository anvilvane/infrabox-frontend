'use client'

import React, { useState, useMemo } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema, createItemListSchema } from '@/components/seo/json-ld';

const categoryOrder = [
  "DNS & Authentication",
  "Deliverability",
  "Domain & Security",
  "Email",
];

const TAG_STYLE = {
  "DNS & Authentication": "bg-[#1240cc]/10 text-[#1240cc]",
  "Deliverability":       "bg-emerald-100 text-emerald-700",
  "Domain & Security":    "bg-amber-100 text-amber-700",
  "Email":                "bg-violet-100 text-violet-700",
};

const tools = [
  {
    title: "SPF Record Checker",
    description: "Validate your SPF records and check authorized mail servers for your domain.",
    href: "/resources/tools/spf-checker",
    category: "DNS & Authentication",
    features: ["SPF Validation", "Lookup Count", "Syntax Check"],
  },
  {
    title: "SPF Record Generator",
    description: "Create valid SPF records with proper syntax and mechanisms for your domain.",
    href: "/resources/tools/spf-generator",
    category: "DNS & Authentication",
    features: ["Record Builder", "Mechanism Guide", "Copy-Ready"],
  },
  {
    title: "SPF Raw Checker",
    description: "Analyze SPF record syntax and mechanisms with detailed validation and lookups.",
    href: "/resources/tools/spf-raw-checker",
    category: "DNS & Authentication",
    features: ["Raw Analysis", "Mechanism Breakdown", "Lookup Trace"],
  },
  {
    title: "DKIM Record Checker",
    description: "Verify DKIM signatures and public key configuration for email signing.",
    href: "/resources/tools/dkim-checker",
    category: "DNS & Authentication",
    features: ["Key Validation", "Selector Check", "Signature Verify"],
  },
  {
    title: "DKIM Record Generator",
    description: "Generate DKIM keys and DNS records for proper email authentication.",
    href: "/resources/tools/dkim-generator",
    category: "DNS & Authentication",
    features: ["Key Generation", "DNS Format", "Copy-Ready"],
  },
  {
    title: "DMARC Record Checker",
    description: "Validate DMARC policies and email authentication alignment for your domain.",
    href: "/resources/tools/dmarc-checker",
    category: "DNS & Authentication",
    features: ["Policy Check", "Alignment", "Reporting"],
  },
  {
    title: "DMARC Record Generator",
    description: "Build DMARC policies with guided configuration and reporting setup.",
    href: "/resources/tools/dmarc-generator",
    category: "DNS & Authentication",
    features: ["Policy Builder", "RUA / RUF", "Guided Setup"],
  },
  {
    title: "Deliverability Score Checker",
    description: "Analyze your domain's deliverability score and get actionable insights to improve inbox placement.",
    href: "/resources/tools/deliverability-score",
    category: "Deliverability",
    features: ["Score Analysis", "Actionable Tips", "DNS Check"],
  },
  {
    title: "Mailbox Calculator",
    description: "Calculate how many mailboxes you need based on your outreach volume and campaign goals.",
    href: "/resources/tools/mailbox-calculator",
    category: "Deliverability",
    features: ["Volume Planner", "Cost Estimate", "Scaling Guide"],
  },
  {
    title: "Reputation Check",
    description: "Check domain and IP reputation across major email blacklists and databases.",
    href: "/resources/tools/reputation-check",
    category: "Deliverability",
    features: ["Multi-Source", "IP & Domain", "Trust Score"],
  },
  {
    title: "Blacklist Checker",
    description: "Check if your domain or IP is listed on 50+ major email blacklists.",
    href: "/resources/tools/blacklist-checker",
    category: "Deliverability",
    features: ["50+ Lists", "IP & Domain", "Delist Guide"],
  },
  {
    title: "DNS Record Checker",
    description: "Comprehensive DNS record lookup and analysis for all email-related records.",
    href: "/resources/tools/dns-checker",
    category: "Domain & Security",
    features: ["All Records", "MX / TXT / A", "Full Lookup"],
  },
  {
    title: "DNS Validator",
    description: "Check if your SPF, DKIM, and DMARC records are configured correctly in one scan.",
    href: "/resources/tools/dns-validator",
    category: "Domain & Security",
    features: ["One-Click Scan", "Multi-Record", "Status Report"],
  },
  {
    title: "Domain Scanner",
    description: "Comprehensive analysis of all email authentication records for your domain.",
    href: "/resources/tools/domain-scanner",
    category: "Domain & Security",
    features: ["Full Audit", "Auth Records", "Risk Score"],
  },
  {
    title: "BIMI Record Checker",
    description: "Validate brand logo display configuration for Gmail, Yahoo, and Apple Mail.",
    href: "/resources/tools/bimi-checker",
    category: "Domain & Security",
    features: ["Logo Check", "VMC Verify", "DMARC Align"],
  },
  {
    title: "BIMI Record Generator",
    description: "Create BIMI records for brand logo display in email clients.",
    href: "/resources/tools/bimi-generator",
    category: "Domain & Security",
    features: ["Record Builder", "SVG Guide", "Copy-Ready"],
  },
  {
    title: "MTA-STS Checker",
    description: "Validate TLS encryption enforcement policy for secure email delivery.",
    href: "/resources/tools/mta-sts-checker",
    category: "Domain & Security",
    features: ["TLS Check", "Policy Mode", "Certificate"],
  },
  {
    title: "Email Header Analyzer",
    description: "Analyze email headers for authentication results and routing information.",
    href: "/resources/tools/email-header-analyzer",
    category: "Email",
    features: ["Header Parse", "Auth Results", "Route Trace"],
  },
  {
    title: "Spam Words Checker",
    description: "Scan your email content for spam trigger words and phrases that hurt deliverability.",
    href: "/resources/tools/spam-checker",
    category: "Email",
    features: ["Word Scan", "Score Check", "Suggestions"],
  },
  {
    title: "Email Permutator",
    description: "Generate common email address formats for any prospect using their name and domain.",
    href: "/resources/tools/email-permutator",
    category: "Email",
    features: ["Format Gen", "Name + Domain", "Bulk Export"],
  },
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categoryNames = ["All", ...categoryOrder];

  const filteredTools = useMemo(() => {
    let filtered = tools;

    if (activeCategory !== "All") {
      filtered = filtered.filter(t => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Email Deliverability Tools",
        description: "DNS validators, DKIM checkers, SPF generators, DMARC tools, and more for email authentication.",
        url: "https://www.infrabox.software/resources/tools",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Resources", url: "https://www.infrabox.software/resources" },
        { name: "Tools", url: "https://www.infrabox.software/resources/tools" },
      ])} />
      <JsonLd data={createItemListSchema({
        name: "Infrabox Email Tools",
        description: "Collection of email deliverability and DNS tools",
        url: "https://www.infrabox.software/resources/tools",
        items: tools.map((tool, index) => ({
          position: index + 1,
          name: tool.title,
          description: tool.description,
          url: tool.href.startsWith('http') ? tool.href : `https://www.infrabox.software${tool.href}`,
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
              <span className="text-gray-600">Tools</span>
            </nav>

            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 leading-[1.15] mb-5 max-w-2xl">
              Email Deliverability Tools
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-xl mb-8">
              Check DNS records, validate SPF/DKIM/DMARC, and test deliverability. No signup required.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span><span className="font-semibold text-gray-900">{tools.length}+</span> free tools</span>
              <span className="border-l border-gray-200 pl-6"><span className="font-semibold text-gray-900">{categoryOrder.length}</span> categories</span>
              <span className="border-l border-gray-200 pl-6"><span className="font-semibold text-gray-900">Instant</span> results</span>
            </div>
          </div>
        </section>

        {/* Search + Filters */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-6 max-w-5xl mx-auto">
            <div className="max-w-xl mx-auto mb-6">
              <form role="search" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 h-11 text-sm border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              </form>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categoryNames.map((cat) => {
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                      activeCategory === cat
                        ? 'bg-[#1240cc] text-white'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                    {cat !== "All" && (
                      <span className="ml-1.5 opacity-60">
                        {tools.filter(t => t.category === cat).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="px-6 py-12 lg:py-16 max-w-5xl mx-auto">
            {filteredTools.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-semibold text-black mb-2">No tools found</p>
                <p className="text-sm text-gray-500">Try a different search term or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, index) => {
                  const tag = TAG_STYLE[tool.category] || TAG_STYLE["DNS & Authentication"];
                  return (
                    <Link
                      key={index}
                      href={tool.href}
                      onClick={() => trackClick('tool_click', { tool: tool.title })}
                      className="group flex flex-col rounded-xl border border-gray-200/80 overflow-hidden hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {/* Pastel green mesh thumbnail */}
                      <div className="relative h-[130px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8f0fe]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <filter id={`t-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                              </filter>
                            </defs>
                            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#t-${index})`} />
                            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#t-${index})`} />
                            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#t-${index})`} />
                          </svg>
                        </div>
                        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <img src="/logo.png" alt="Infrabox" className="h-5 w-auto opacity-30" />
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${tag}`}>
                              {tool.category}
                            </span>
                          </div>
                          <h3 className="text-[14px] font-semibold text-[#1240cc] leading-snug line-clamp-2">
                            {tool.title}
                          </h3>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex-1 flex flex-col bg-white">
                        <p className="text-[12px] text-gray-500 leading-relaxed mb-3 flex-1">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {tool.features.slice(0, 2).map((feature) => (
                              <span key={feature} className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <span className="text-[11px] font-semibold text-[#1240cc] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Try it
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border-t border-gray-200">
          <div className="px-6 py-14 lg:py-20 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              More than just tools
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Infrabox provides complete email infrastructure with guaranteed
              deliverability, automated DNS setup, and managed warmup.
            </p>
            <a
              href="https://app.infrabox.software/signup"
              onClick={() => trackClick('tools_cta', { action: 'signup' })}
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-colors text-sm shadow-lg shadow-[#1240cc]/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
