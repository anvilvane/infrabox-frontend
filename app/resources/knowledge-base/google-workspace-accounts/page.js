'use client'

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearnToc from "@/components/learn/LearnToc";
import { CheckCircle, ArrowRight } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema, createToolFaqSchema } from '@/components/seo/json-ld';

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "problems", label: "Problems with Manual Setup" },
  { id: "benefits", label: "Why Choose Infrabox" },
  { id: "comparison", label: "Infrabox vs Manual Setup" },
  { id: "process", label: "How to Get Started" },
  { id: "use-cases", label: "Use Cases" },
  { id: "faq", label: "FAQ" },
];

const benefits = [
  { title: "US-Based IP Addresses", description: "All accounts come with premium US IP addresses for maximum deliverability", stat: "3x better inbox rates" },
  { title: "Instant Provisioning", description: "Accounts ready in seconds, not days. No manual setup required", stat: "< 60 second setup" },
  { title: "Enterprise Security", description: "2FA enabled, secure API access, and enterprise-grade protection", stat: "SOC 2 compliant" },
  { title: "Bulk Management", description: "Create and manage 500+ accounts from one dashboard", stat: "500+ accounts" },
  { title: "Automated DNS Setup", description: "DKIM, SPF, and DMARC configured automatically", stat: "Fully authenticated" },
  { title: "24/7 Support", description: "Direct support from Google Workspace experts", stat: "< 1 hour response" },
];

const comparisonData = [
  { feature: "Setup Time", infrabox: "60 seconds", manual: "24-48 hours" },
  { feature: "IP Location", infrabox: "US-based IP addresses", manual: "Random/International" },
  { feature: "DNS Configuration", infrabox: "Automatic", manual: "Manual (45+ min)" },
  { feature: "Bulk Creation", infrabox: "500+ at once", manual: "One by one" },
  { feature: "Cost per Account", infrabox: "From $2.50/mo", manual: "$6 + setup fees" },
  { feature: "Warmup Included", infrabox: "Isolated ($3/mo)", manual: "Manual required" },
  { feature: "Deliverability", infrabox: "95% inbox", manual: "60-80% inbox" },
];

const process = [
  { step: "Choose your plan", description: "Select Professional ($39/mo, 10 mailboxes), Agency ($99/mo, 30), or Enterprise ($299/mo, 100)" },
  { step: "Domain setup", description: "Connect your domain or use our premium domains. DNS configured automatically in seconds." },
  { step: "Instant creation", description: "Accounts created with US IPs in under 60 seconds. Full admin access immediately." },
  { step: "Start sending", description: "Begin warmup immediately with our isolated warmup network. 14-day protocol to 95%+ inbox." },
];

const useCases = [
  { title: "Email Outreach", description: "Scale your outreach with hundreds of warmed accounts", users: "Sales Teams" },
  { title: "Lead Generation", description: "Reach more prospects with guaranteed inbox placement", users: "Agencies" },
  { title: "Marketing Campaigns", description: "Run high-volume email campaigns without deliverability issues", users: "Marketers" },
  { title: "Client Management", description: "Manage email infrastructure for multiple clients from one dashboard", users: "Consultants" },
];

const faqs = [
  { question: "Are these legitimate Google Workspace accounts?", answer: "Yes, every account is a genuine Google Workspace Business Starter subscription created through our official Google Partner program. Each account includes the complete Google Workspace suite with Gmail (30GB storage), Drive, Calendar, Meet, and all productivity apps. You receive full admin control with enterprise-grade security and 99.9% uptime SLA." },
  { question: "How do you provide US IP addresses?", answer: "We provision all Google Workspace accounts exclusively through US-based data centers. Each account receives a dedicated static US IP address from tier-1 US providers with established sender reputations. These IPs are geographically distributed across major US regions and remain permanently assigned to your account for consistent reputation." },
  { question: "Can I use my own domain?", answer: "Absolutely! Use your existing domain, purchase a new one through our marketplace, or select from our premium aged domains. Our automated system handles all technical configuration including MX records, SPF, DKIM (2048-bit), and DMARC policies. The entire process completes within 60 seconds of domain verification." },
  { question: "What's included in the warmup process?", answer: "Our 14-day warmup protocol includes gradual volume increases (20 to 500+ emails/day), engagement simulation with real Gmail accounts, automated conversation threads, folder movement simulation, and real-time deliverability monitoring. Isolated warmup is $3/mailbox/month add-on and typically achieves 95%+ inbox placement rates." },
];

export default function GoogleWorkspaceAccountsPage() {
  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "US-IP Google Workspace Accounts for Email",
        description: "Get Google Workspace accounts with premium US IP addresses. Instant provisioning, automated DNS setup, and 95% inbox deliverability.",
        url: "https://www.infrabox.software/resources/knowledge-base/google-workspace-accounts",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Knowledge Base", url: "https://www.infrabox.software/resources/knowledge-base" },
        { name: "Google Workspace Accounts", url: "https://www.infrabox.software/resources/knowledge-base/google-workspace-accounts" },
      ])} />
      <JsonLd data={createToolFaqSchema(faqs)} />
      <Header />

      <main className="bg-gray-50 min-h-screen">
        <div className="flex max-w-6xl mx-auto">
          {/* Sidebar - TOC */}
          <aside className="hidden lg:block w-[280px] shrink-0 border-r border-gray-200 bg-white relative">
            <div className="sticky top-0 h-screen overflow-y-auto">
              <div className="p-6">
                <LearnToc items={tocItems} />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <section className="bg-white border-b border-gray-200">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <nav className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                  <a href="/" className="hover:text-[#1240cc] transition-colors">Home</a>
                  <span>/</span>
                  <a href="/resources/knowledge-base" className="hover:text-[#1240cc] transition-colors">Knowledge Base</a>
                  <span>/</span>
                  <span className="text-gray-500">Google Workspace</span>
                </nav>

                <p className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-4">
                  Google Workspace
                </p>

                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-4">
                  US-IP Google Workspace Accounts for Email
                </h1>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-5">
                  Get instant access to Google Workspace accounts with US IP addresses. Plans from $39/mo with automated DNS, isolated warmup, and 95% inbox deliverability.
                </p>

                {/* Stats bar */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span><span className="font-semibold text-gray-900">100K+</span> accounts created</span>
                  <span className="border-l border-gray-300 pl-6"><span className="font-semibold text-gray-900">95%</span> inbox rate</span>
                  <span className="border-l border-gray-300 pl-6"><span className="font-semibold text-gray-900">60s</span> setup</span>
                </div>
              </div>
            </section>

            {/* Overview */}
            <section id="overview" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-5">
                  Overview
                </h2>
                <div className="bg-[#1240cc]/5 border border-[#1240cc]/10 rounded-lg p-5 mb-6">
                  <p className="text-xs font-semibold text-[#1240cc] uppercase tracking-wider mb-2">TL;DR</p>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    Infrabox provides genuine Google Workspace Business Starter accounts with US-based IP addresses, automated DNS configuration (SPF, DKIM, DMARC), and isolated warmup. Accounts are provisioned in under 60 seconds with full admin access. Plans start at $39/mo (Professional, 10 mailboxes included).
                  </p>
                </div>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  As an official Google Workspace partner, every account includes the complete Google Workspace suite — Gmail (30GB storage), Drive, Calendar, Meet, and all productivity apps. Accounts are backed by Google&apos;s infrastructure with 99.9% uptime SLA, enterprise-grade security, and 2FA enabled by default.
                </p>
              </div>
            </section>

            {/* Problems with Manual Setup */}
            <section id="problems" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Problems with Manual Setup
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: "24-48 hour wait", body: "Manual verification and setup process takes days, delaying your campaigns" },
                    { title: "Random IP locations", body: "Non-US IPs get flagged as suspicious, hurting deliverability from day one" },
                    { title: "Complex DNS setup", body: "Manual DNS configuration takes hours and one mistake ruins deliverability" },
                  ].map((item, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{item.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Why Choose Infrabox */}
            <section id="benefits" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Why Choose Infrabox
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{benefit.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">{benefit.description}</p>
                      <p className="text-xs font-medium text-[#1240cc]">{benefit.stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Infrabox vs Manual Setup */}
            <section id="comparison" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Infrabox vs Manual Setup
                </h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Feature</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#1240cc]">Infrabox</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Manual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 py-3 text-sm text-gray-600">{row.feature}</td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1240cc]">{row.infrabox}</td>
                          <td className="px-4 py-3 text-sm text-gray-400">{row.manual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* How to Get Started */}
            <section id="process" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Get Started in 4 Steps
                </h2>
                <div className="space-y-5">
                  {process.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#1240cc] text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{step.step}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Use Cases */}
            <section id="use-cases" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Use Cases
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {useCases.map((uc, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{uc.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">{uc.description}</p>
                      <p className="text-xs font-medium text-[#1240cc]">Popular with: {uc.users}</p>
                    </div>
                  ))}
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {["Google Certified", "SOC 2 Compliant", "GDPR Compliant", "24/7 Support"].map((signal) => (
                    <div key={signal} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1240cc]" />
                      <span className="text-sm text-gray-600">{signal}</span>
                    </div>
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
                <div className="space-y-6">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-[#1240cc]">
              <div className="px-6 lg:px-12 py-14 lg:py-20 flex flex-col items-center text-center">
                <h2 className="text-[24px] sm:text-[32px] font-bold text-white leading-tight mb-3">
                  Start sending from US IPs today
                </h2>
                <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed">
                  Plans from $39/mo with 10 mailboxes included. Setup in under 60 seconds.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="https://app.infrabox.software/signup"
                    onClick={() => trackClick('workspace_bottom_cta', { action: 'signup' })}
                    className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/#book-call"
                    className="inline-flex items-center px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Book a Demo
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
