'use client'

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearnToc from "@/components/learn/LearnToc";
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema, createToolFaqSchema } from '@/components/seo/json-ld';

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "current-situation", label: "What's Happening" },
  { id: "infrastructure", label: "Infrastructure Advantage" },
  { id: "precautions", label: "Precautionary Steps" },
  { id: "comparison", label: "Infrabox vs Others" },
  { id: "support", label: "Support" },
  { id: "faq", label: "FAQ" },
];

const currentSituation = [
  {
    type: "industry",
    title: "Industry impact",
    points: [
      "Google's aggressive policy enforcement now active",
      "Non-profit, legacy, and educational panels affected",
      "Widespread account blocks and warmup failures",
      "Expected duration: 24-48 hours minimum"
    ]
  },
  {
    type: "infrabox",
    title: "Your Infrabox status",
    points: [
      "All accounts fully operational",
      "No service interruptions expected",
      "Official licenses protect you",
      "24/7 support available if needed"
    ]
  }
];

const precautions = [
  {
    action: "Reduce warmup to <5 emails/day or turn off",
    reason: "Purely precautionary - your accounts remain safe"
  },
  {
    action: "Limit cold outreach to 5 emails/day max",
    reason: "Temporary measure while enforcement is active"
  },
  {
    action: "Monitor dashboard for any anomalies",
    reason: "Check account status for peace of mind"
  },
  {
    action: "Resume normal operations after 48 hours",
    reason: "Full capacity available once enforcement ends"
  }
];

const infrastructureData = [
  {
    title: "Official Google Partner",
    points: [
      "Direct relationship with Google",
      "Priority support channels",
      "Early policy notifications"
    ]
  },
  {
    title: "Fully Paid Google Workspace",
    points: [
      "No educational shortcuts",
      "No non-profit workarounds",
      "No legacy panel dependencies",
      "Enterprise-grade infrastructure"
    ]
  },
  {
    title: "Premium Features",
    points: [
      "Advanced warmup algorithms",
      "Real-time deliverability monitoring",
      "Automated reputation management",
      "24/7 priority support"
    ]
  }
];

const comparison = [
  { feature: "License Type", infrabox: "Official Google Workspace", others: "Non-profit/Legacy/Educational" },
  { feature: "Current Status", infrabox: "Fully Operational", others: "Experiencing Blocks" },
  { feature: "Google Partner", infrabox: "Yes", others: "No" },
  { feature: "Account Risk", infrabox: "Protected", others: "High Risk" },
  { feature: "Support Priority", infrabox: "Direct Google Support", others: "Limited Support" }
];

const faqs = [
  {
    question: "Are my Infrabox accounts at risk?",
    answer: "No, your accounts are completely safe. Infrabox uses official Google Workspace licenses that are unaffected by the current enforcement actions targeting non-profit, legacy, and educational panels."
  },
  {
    question: "How long should I reduce sending?",
    answer: "As a precautionary measure, we recommend reducing your email volume for 24-48 hours. This is purely preventative - your accounts remain fully operational."
  },
  {
    question: "Why are others affected but not Infrabox?",
    answer: "We've invested in premium infrastructure from day one. Our official Google Partner status and fully paid licenses mean we're not subject to the same restrictions affecting providers using workarounds."
  },
  {
    question: "Will this happen again?",
    answer: "Our Google partnership provides us with advance warnings about policy changes. We'll always keep you informed and protected from future disruptions."
  }
];

export default function GoogleDisruptionPage() {
  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Google Disruption Update - Your Infrabox Accounts Remain Protected",
        description: "While others face account blocks from Google's new policy enforcement, Infrabox's official Google Workspace licenses keep your accounts fully operational.",
        url: "https://www.infrabox.software/resources/knowledge-base/google-disruption",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Knowledge Base", url: "https://www.infrabox.software/resources/knowledge-base" },
        { name: "Google Disruption", url: "https://www.infrabox.software/resources/knowledge-base/google-disruption" },
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
                  <span className="text-gray-500">Google Disruption</span>
                </nav>

                <p className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-4">
                  Google Disruption Update
                </p>

                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-4">
                  Your Infrabox accounts remain fully protected
                </h1>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-5">
                  While others face account blocks from Google&apos;s new policy enforcement,
                  our official Google Workspace licenses keep you operational.
                </p>

                {/* Status badge */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">All Systems Operational</span>
                  </span>
                  <span className="border-l border-gray-300 pl-6">
                    <span className="font-semibold text-gray-900">Official</span> Google Partner
                  </span>
                  <span className="border-l border-gray-300 pl-6">
                    <span className="font-semibold text-gray-900">24/7</span> support
                  </span>
                </div>
              </div>
            </section>

            {/* Overview / TL;DR */}
            <section id="overview" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-5">
                  Overview
                </h2>
                <div className="bg-[#1240cc]/5 border border-[#1240cc]/10 rounded-lg p-5 mb-6">
                  <p className="text-xs font-semibold text-[#1240cc] uppercase tracking-wider mb-2">TL;DR</p>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    Google is aggressively enforcing policies on non-profit, legacy, and educational panels, causing widespread account blocks and warmup failures across the industry. Infrabox users are unaffected because we use official, fully paid Google Workspace licenses. As a precaution, we recommend temporarily reducing warmup and outreach volume for 24-48 hours.
                  </p>
                </div>

                {/* Alert Banner */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Industry Alert</p>
                    <p className="text-sm text-amber-800 mt-1">
                      Google enforcing aggressive policies on non-profit and legacy panels.
                      Infrabox uses official licenses - your accounts are safe.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Current Situation */}
            <section id="current-situation" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  What&apos;s Happening
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {currentSituation.map((section, index) => (
                    <div key={index} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                        {section.type === 'industry' ? 'INDUSTRY IMPACT' : 'YOUR STATUS'}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mb-3">
                        {section.title}
                      </p>
                      <div className="space-y-2">
                        {section.points.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            {section.type === 'industry' ? (
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            ) : (
                              <CheckCircle className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                            )}
                            <p className="text-sm text-gray-600">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Infrastructure Advantage */}
            <section id="infrastructure" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  Your Premium Infrastructure Advantage
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  While others scramble to recover, your operations continue uninterrupted
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {infrastructureData.map((item, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-3">{item.title}</p>
                      <ul className="space-y-2">
                        {item.points.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-600 leading-relaxed">{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Precautionary Measures */}
            <section id="precautions" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  Temporary Precautionary Measures
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  While your accounts are safe, we recommend these precautions for 24-48 hours
                </p>
                <div className="space-y-5">
                  {precautions.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#1240cc] text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{item.action}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Comparison */}
            <section id="comparison" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Infrabox vs Affected Providers
                </h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Feature</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#1240cc]">Infrabox</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 py-3 text-sm text-gray-600">{row.feature}</td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1240cc]">{row.infrabox}</td>
                          <td className="px-4 py-3 text-sm text-gray-400">{row.others}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Support */}
            <section id="support" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  We&apos;re Here to Help
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Our support team is standing by 24/7 to assist with any concerns
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 bg-white rounded-xl p-5">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Live Chat</p>
                    <p className="text-sm text-gray-600 leading-relaxed">Instant support available in your dashboard</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded-xl p-5">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Email Support</p>
                    <p className="text-sm text-gray-600 leading-relaxed">support@infrabox.software</p>
                  </div>
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
                  Don&apos;t risk your email operations
                </h2>
                <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed">
                  Join companies that chose premium infrastructure from day one
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="https://app.infrabox.software/signup"
                    onClick={() => trackClick('disruption_bottom_cta', { action: 'signup' })}
                    className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Get Protected Now
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/#book-call"
                    className="inline-flex items-center px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Schedule Infrastructure Audit
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
