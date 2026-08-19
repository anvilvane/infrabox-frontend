'use client'

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearnToc from "@/components/learn/LearnToc";
import { AlertTriangle, CheckCircle, XCircle, Clock, ArrowRight, Calendar } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema, createToolFaqSchema } from '@/components/seo/json-ld';

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "emergency-steps", label: "Emergency Steps" },
  { id: "suspension-stages", label: "Suspension Stages" },
  { id: "whats-happening", label: "What's Happening" },
  { id: "recovery", label: "Recovery & Long-Term Fixes" },
  { id: "verify-provider", label: "Verify Your Provider" },
  { id: "why-infrabox-safe", label: "Why Infrabox Is Safe" },
  { id: "comparison", label: "Infrabox vs Others" },
  { id: "faq", label: "FAQ" },
];

const emergencySteps = [
  {
    title: "Check your license type NOW",
    details: [
      "Click support icon in admin.google.com and ask support directly",
      "OR check Settings \u2192 Account \u2192 Subscriptions",
      "If it's not official 'Google Workspace Business' = you're at risk"
    ]
  },
  {
    title: "Emergency protocol",
    details: [
      "Warmups: OFF completely or max 3-5/day",
      "Emails: 5/day absolute maximum",
      "Pause all sequences/automation",
      "Manual sends only if critical"
    ]
  },
  {
    title: "Monitor these metrics",
    details: [
      "Bounce rate (if >5% = stop immediately)",
      "550 errors (daily limit flags)",
      "Account warnings in Google Admin"
    ]
  }
];

const suspensionStages = [
  { stage: "1", title: "Initial Warning Signs", desc: "Warmup emails bounce with 550 errors. Daily sending limits suddenly restricted." },
  { stage: "2", title: "Severe Restrictions", desc: "Daily limits drop to 20-50 emails. Automation tools fail. Manual sends required." },
  { stage: "3", title: "Account Suspended", desc: "Complete suspension. No sending or receiving. Admin access may be limited." },
  { stage: "4", title: "Full Termination", desc: "Account terminated. Data loss. Unrecoverable. Must start fresh with new provider." }
];

const comparison = [
  { aspect: "License Type", infrabox: "Paid Business", others: "Edu/Non-profit" },
  { aspect: "Google Compliance", infrabox: "100% Compliant", others: "Terms Violation" },
  { aspect: "Account Status", infrabox: "Active & Protected", others: "Suspended" },
  { aspect: "Business Risk", infrabox: "Zero Risk", others: "Total Loss" },
  { aspect: "Support", infrabox: "Direct Google Support", others: "No Recourse" }
];

const faqs = [
  {
    question: "What happened to non-profit and educational Google Workspace panels?",
    answer: "Google has suspended thousands of Google Workspace accounts that were operating under non-profit and educational licenses but being used for commercial purposes. These panels, originally intended for schools and charitable organizations, were being resold and used for business email campaigns, violating Google's terms of service."
  },
  {
    question: "How do I check if my license type is at risk?",
    answer: "The fastest way is to click the support icon in admin.google.com and ask Google support directly about your license type. Alternatively, check Settings \u2192 Account \u2192 Subscriptions. If it's not an official 'Google Workspace Business' license, you're at risk."
  },
  {
    question: "What should I do in the first 48 hours if I'm affected?",
    answer: "Immediately: 1) Turn OFF all warmup tools or reduce to 3-5/day max, 2) Limit emails to 5/day absolute maximum, 3) Pause all sequences and automation, 4) Only send critical emails manually, 5) Monitor bounce rates closely - if over 5%, stop all sending immediately."
  },
  {
    question: "Why is Infrabox not affected?",
    answer: "Infrabox exclusively uses fully paid, official Google Workspace Business licenses. We have never relied on non-profit, educational, or legacy panels. Our infrastructure is built on legitimate, commercial licenses directly from Google."
  },
  {
    question: "Can I recover my suspended accounts?",
    answer: "Unfortunately, accounts suspended for terms violations are rarely recoverable. The best path forward is to migrate to a legitimate provider with proper licensing. We can help you set up new, compliant accounts and rebuild your email infrastructure the right way."
  }
];

const redFlags = [
  "Prices under $2/month per inbox",
  "\"Lifetime deals\" or \"one-time payment\"",
  "Can't provide Google Partner ID",
  "Mentions \"special pricing\" or suspicious discounts",
  "Uses \"educational\" or \"non-profit\" for business use"
];

const greenFlags = [
  "Official Google Partner badge (verify at partners.google.com)",
  "Transparent about license types",
  "Direct billing relationship with Google",
  "Provides full admin access to Google Workspace",
  "Clear documentation and support"
];

const whyInfraboxSafe = [
  { title: "Official Business Licenses", description: "Every account runs on fully paid Google Workspace Business licenses, purchased directly from Google." },
  { title: "No Policy Violations", description: "We've never used educational or non-profit panels. 100% compliant with Google's terms of service." },
  { title: "Google Partner Status", description: "Official Google partner with direct support channels and advance policy notifications." },
  { title: "Transparent Operations", description: "Full admin access and proper billing documentation. Complete transparency about our licensing." },
];

const recoveryTimeline = [
  { period: "Now-48hrs", action: "Emergency mode - minimal sending" },
  { period: "48-72hrs", action: "Gradual testing with monitoring" },
  { period: "1 week", action: "Slow scale to 50% volume" },
  { period: "2 weeks", action: "Return to normal IF no issues" },
];

const longTermFixes = [
  "Migrate to official licenses (only real solution)",
  "Implement proper authentication (SPF, DKIM, DMARC)",
  "Build real engagement before scaling",
  "Consider alternative platforms for bulk sending",
];

export default function GoogleSuspensionPage() {
  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Google Cracking Down on Educational & Non-Profit Panels",
        description: "Thousands of email accounts suspended. Google enforcing strict policies against commercial use of educational and non-profit licenses. Learn what to do now.",
        url: "https://www.infrabox.software/resources/knowledge-base/google-suspension",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Knowledge Base", url: "https://www.infrabox.software/resources/knowledge-base" },
        { name: "Google Suspension", url: "https://www.infrabox.software/resources/knowledge-base/google-suspension" },
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
                  <span className="text-gray-500">Google Suspension</span>
                </nav>

                <p className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-4">
                  Google Workspace Suspensions
                </p>

                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-4">
                  Google cracking down on educational & non-profit panels
                </h1>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-5">
                  Thousands of email accounts suspended. Google enforcing strict policies
                  against commercial use of educational and non-profit licenses.
                </p>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Industry Alert</span>
                  </div>
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
                    Google has initiated widespread enforcement actions against Google Workspace accounts operating
                    under educational (.edu) and non-profit organization licenses used for commercial email operations.
                    If you&apos;re using non-official licenses, reduce sending immediately, check your license type, and
                    plan migration to legitimate Google Workspace Business licenses. Infrabox clients are not affected.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Calendar className="w-5 h-5 text-[#1240cc] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Breaking: August 21, 2025</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Google has initiated widespread enforcement actions against Google Workspace accounts operating
                      under educational (.edu) and non-profit organization licenses that were being used for commercial
                      email operations. This action affects thousands of accounts across multiple providers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Emergency Steps */}
            <section id="emergency-steps" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  Immediate Damage Control
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Critical steps for the next 48-72 hours
                </p>

                <div className="space-y-8">
                  {emergencySteps.map((step, index) => (
                    <div key={index}>
                      <div className="flex gap-4 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#1240cc] text-white text-sm font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{step.title}</p>
                        </div>
                      </div>
                      <div className="ml-12 space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Suspension Stages */}
            <section id="suspension-stages" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  Suspension Stages
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  What to expect as accounts are suspended
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suspensionStages.map((stage, index) => (
                    <div key={index} className="border border-gray-200 bg-white rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-orange-500' :
                          index === 2 ? 'bg-red-500' :
                          'bg-gray-900'
                        }`}>
                          {stage.stage}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{stage.title}</p>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{stage.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-900">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    <span className="font-semibold">Most accounts are currently at Stage 1-2.</span> Act fast to prevent progression.
                  </p>
                </div>
              </div>
            </section>

            {/* What's Happening */}
            <section id="whats-happening" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  What&apos;s Happening
                </h2>

                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Current Situation</p>
                    <p className="text-sm font-semibold text-gray-900 mb-3">Industry impact</p>
                    <div className="space-y-3">
                      {[
                        "Mass suspensions of educational & non-profit accounts",
                        "Providers caught reselling discounted licenses",
                        "Immediate account termination with no warning",
                        "Complete loss of email access and data"
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Who&apos;s Affected</p>
                    <p className="text-sm font-semibold text-gray-900 mb-3">At-risk accounts</p>
                    <div className="space-y-3">
                      {[
                        "Users of \"budget\" email providers",
                        "Accounts on .edu domain resellers",
                        "Non-profit panel users doing commercial outreach",
                        "Anyone using unofficial Google Workspace channels"
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recovery & Long-Term Fixes */}
            <section id="recovery" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Recovery Timeline & Long-Term Fixes
                </h2>

                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Recovery Timeline</p>
                    <div className="space-y-4">
                      {recoveryTimeline.map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="text-sm font-mono text-[#1240cc] min-w-[80px]">{item.period}</span>
                          <p className="text-sm text-gray-600">{item.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Long-Term Fixes</p>
                    <div className="space-y-4">
                      {longTermFixes.map((fix, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="text-sm font-bold text-[#1240cc]">{i + 1}.</span>
                          <p className="text-sm text-gray-600">{fix}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Verify Your Provider */}
            <section id="verify-provider" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  How to Verify Your Provider
                </h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <p className="text-sm font-semibold text-gray-900">Red flags - Avoid these</p>
                    </div>
                    <div className="space-y-2">
                      {redFlags.map((flag, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-600">{flag}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                      <p className="text-sm font-semibold text-gray-900">Green flags - Look for these</p>
                    </div>
                    <div className="space-y-2">
                      {greenFlags.map((flag, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-3.5 h-3.5 text-[#1240cc] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{flag}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Infrabox Is Safe */}
            <section id="why-infrabox-safe" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Why Infrabox Clients Are Safe
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whyInfraboxSafe.map((item, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{item.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Comparison Table: Infrabox vs Others */}
            <section id="comparison" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  The Difference Is Clear
                </h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Aspect</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#1240cc]">Infrabox</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 py-3 text-sm text-gray-600">{row.aspect}</td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1240cc]">{row.infrabox}</td>
                          <td className="px-4 py-3 text-sm text-gray-400">{row.others}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  Need immediate help?
                </h2>
                <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed">
                  If your accounts were suspended or you&apos;re at risk, we can help you migrate to
                  legitimate Google Workspace infrastructure immediately.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="/#book-call"
                    onClick={() => trackClick('suspension_bottom_cta', { action: 'book_migration' })}
                    className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Book Migration Call
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Start with Legitimate Licenses
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
