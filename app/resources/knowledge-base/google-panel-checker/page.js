'use client'

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearnToc from "@/components/learn/LearnToc";
import { getCalendlyUrl } from "@/lib/booking";
import { ArrowRight, CheckCircle, XCircle, ExternalLink, Phone } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema, createToolFaqSchema } from '@/components/seo/json-ld';

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "official-resources", label: "Official Google Resources" },
  { id: "warning-signs", label: "Warning Signs" },
  { id: "infrabox-difference", label: "The Infrabox Difference" },
  { id: "verify-panel", label: "Verify Your Panel" },
  { id: "comparison", label: "Comparison" },
  { id: "migration", label: "Migration Strategy" },
  { id: "faq", label: "FAQ" },
];

const officialResources = [
  { href: "https://www.google.com/nonprofits/workspace/compare/", label: "Google Nonprofits" },
  { href: "https://edu.google.com/intl/ALL_us/workspace-for-education/editions/compare-editions/", label: "Google Education" },
  { href: "https://support.google.com/a/contact/recovery_form", label: "Recovery Form" },
];

const warningSignsData = [
  { title: "No admin panel access", description: "Provider doesn't give you full admin control of your own domain" },
  { title: "Shared panels with multiple domains", description: "Your domain shares a panel with dozens of other businesses, creating cross-contamination risk" },
  { title: "Lifetime pricing", description: "One-time payments for 'lifetime' Google Workspace (Google doesn't offer this)" },
  { title: "Suspiciously cheap pricing", description: "Pricing significantly below Google's official rates" },
];

const infraboxBenefits = [
  { title: "1 Domain = 1 Admin Panel", description: "Each of your domains gets its own completely separate Google Workspace admin panel. No sharing, no cross-contamination, no risk from other domains." },
  { title: "100% Legitimate & Licensed", description: "Every account is properly licensed through Google's official partner program with official invoices." },
  { title: "Full Admin Control", description: "You get complete administrative access to your Google Workspace. Manage users, settings, security, and billing exactly as intended by Google." },
  { title: "24/7 Expert Support", description: "Dedicated support team available around the clock to help with any issues or questions." },
];

const pricingFeatures = [
  "Dedicated admin panel per domain",
  "Official Google invoices",
  "100% legitimate business accounts",
  "24/7 expert support",
];

const verificationSteps = [
  { step: "Visit Google Recovery Form", description: "Go to Google's official account recovery form", link: { href: "https://support.google.com/a/contact/recovery_form", label: "Open Recovery Form" } },
  { step: "Select Issue Type", description: "Choose 'My administrator account is suspended and I'm unable to recover it'" },
  { step: "Enter Domain Details", description: "Provide your domain name and registered email address" },
  { step: "Request Phone Call", description: "Select phone call option for fastest response (usually within 24 hours)" },
  { step: "Ask Direct Questions", description: "When Google calls, ask: 'Is my domain on a non-profit, education, or legacy panel?'" },
];

const illegitimateItems = [
  "Suspended overnight without warning",
  "No admin panel access",
  "Fake non-profit/edu credentials",
  "300+ inboxes in single admin panel",
  "Sold at $1-2 per user per month",
  "No official Google invoicing",
  "Zero customer support when suspended",
];

const legitimateItems = [
  "100% legitimate Google Cloud Partner",
  "Full admin panel access included",
  "Proper US-IP business accounts",
  "Standard 300 user limits (Google policy)",
  "Transparent monthly billing",
  "Official Google invoices and receipts",
  "24/7 expert support team",
];

const migrationReasons = [
  { title: "Recovery Rate: Less than 1%", description: "Once suspended, less than 1% of illegitimate panels are ever recovered. Your data is gone forever." },
  { title: "Business Impact", description: "Lost emails, missed opportunities, damaged reputation, and potential legal issues from license violations." },
];

const migrationSteps = [
  { step: "Setup Infrabox", description: "Get your new legitimate accounts ready in parallel" },
  { step: "Migrate Gradually", description: "Transfer data safely without business interruption" },
  { step: "Switch Safely", description: "Complete migration with minimal downtime" },
];

const faqs = [
  { question: "How do I know if my Google Workspace panel is illegitimate?", answer: "Key warning signs include: no admin panel access, shared panels with other domains, lifetime pricing offers, and pricing significantly below Google's official rates. Use Google's official recovery form to verify your panel status directly with Google support." },
  { question: "What happens if my illegitimate panel gets suspended?", answer: "Once suspended, recovery is nearly impossible -- less than 1% of illegitimate panels are ever recovered. You lose all emails, contacts, Drive files, and calendar data permanently. Google provides no data recovery for accounts associated with illegally obtained subscriptions." },
  { question: "How is Infrabox different from other providers?", answer: "Infrabox provides 1 domain = 1 admin panel isolation, unlike other providers who stuff hundreds of domains into shared panels. Every account is properly licensed through Google's official partner program with official invoices, full admin control, and 24/7 expert support." },
  { question: "How much does it cost to switch to Infrabox?", answer: "Infrabox legitimate Google Workspace accounts start at just $3.00/user/month. This includes a dedicated admin panel per domain, official Google invoices, 100% legitimate business accounts, and 24/7 expert support." },
  { question: "Can I migrate my existing data to Infrabox?", answer: "Yes, Infrabox offers a smart migration strategy: set up your new legitimate accounts in parallel, gradually transfer data without business interruption, and complete the switch with minimal downtime. Emergency migration support is available 24/7." },
];

const AUDIT_CTA_URL =
  getCalendlyUrl("audit", { embed: false }) ||
  "mailto:hey@infrabox.software?subject=Fix%20my%20email%20infrastructure";

export default function GooglePanelCheckerPage() {

  const handleCTAClick = (location) => {
    trackClick('emergency_switch_cta', {
      location: location,
      page: 'google_panel_checker'
    });
  };

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Google Panel Checker - Is Your Google Workspace Legitimate?",
        description: "Verify if your Google Workspace panel is legitimate. Thousands of businesses unknowingly use illegal panels that can be suspended overnight, causing permanent data loss.",
        url: "https://www.infrabox.software/resources/knowledge-base/google-panel-checker",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Knowledge Base", url: "https://www.infrabox.software/resources/knowledge-base" },
        { name: "Google Panel Checker", url: "https://www.infrabox.software/resources/knowledge-base/google-panel-checker" },
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
                  <Link href="/" className="hover:text-[#1240cc] transition-colors">Home</Link>
                  <span>/</span>
                  <Link href="/resources/knowledge-base" className="hover:text-[#1240cc] transition-colors">Knowledge Base</Link>
                  <span>/</span>
                  <span className="text-gray-500">Google Panel Checker</span>
                </nav>

                <p className="text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-4">
                  Verification Tool
                </p>

                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-4">
                  Is Your Google Workspace <span className="text-[#1240cc]">Legitimate?</span>
                </h1>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-5">
                  Thousands of businesses unknowingly use illegal Google Workspace panels
                  that can be suspended overnight, causing permanent data loss.
                </p>

                {/* Stats bar */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span><span className="font-semibold text-gray-900">&lt;1%</span> recovery rate</span>
                  <span className="border-l border-gray-300 pl-6"><span className="font-semibold text-gray-900">$3.00</span>/user/mo</span>
                  <span className="border-l border-gray-300 pl-6"><span className="font-semibold text-gray-900">24/7</span> migration support</span>
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
                    Illegitimate resellers obtain nonprofit/education Google Workspace panels for free, then illegally resell them to businesses for $500-1000 lifetime fees. These panels can be suspended without warning, with less than 1% ever recovered. Use Google&apos;s official recovery form to verify your panel, and switch to Infrabox&apos;s legitimate 1-domain-per-panel infrastructure at $3.00/user/month.
                  </p>
                </div>

                {/* Video */}
                <div className="bg-gray-100 rounded-xl p-5 mb-6">
                  <div className="mb-4 text-center">
                    <h3 className="text-sm font-semibold text-gray-900">How to Identify Illegal Panels</h3>
                    <p className="text-xs text-gray-500">Infrabox team explains the verification process</p>
                  </div>
                  <div style={{position: 'relative', paddingBottom: '65%', height: 0}}>
                    <iframe
                      src="https://www.youtube.com/embed/0Vk8NzIt_RM?rel=0&modestbranding=1&showinfo=0"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    />
                  </div>
                </div>

                {/* Case Study */}
                <div className="bg-gray-100 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Real Case Study - Martin</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    &quot;Domain investigated and suspended - associated with illegally obtained
                    <strong> Google non-profit subscription</strong>. Recovery is nearly impossible.&quot;
                  </p>
                  <p className="text-xs text-gray-400 mt-2">- Google Customer Support, Aug 2024</p>
                </div>
              </div>
            </section>

            {/* Official Google Resources */}
            <section id="official-resources" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  Official Google Resources
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Verify legitimate pricing and policies directly from Google&apos;s official pages
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {officialResources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      {resource.label}
                    </a>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Key Insight:</strong> Illegitimate resellers obtain nonprofit/education panels for free,
                  then illegally resell them to businesses for $500-1000 lifetime fees, leading to suspensions.
                </p>
              </div>
            </section>

            {/* Warning Signs */}
            <section id="warning-signs" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  Warning Signs of Illegitimate Panels
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {warningSignsData.map((item, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{item.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* The Infrabox Difference */}
            <section id="infrabox-difference" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  The Infrabox Difference
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Unlike other providers who stuff hundreds of domains into shared panels, Infrabox provides true isolation
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {infraboxBenefits.map((benefit, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{benefit.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Switch to Infrabox at just</div>
                      <div className="text-2xl font-bold text-gray-900">$3.00<span className="text-sm font-normal">/user/month</span></div>
                    </div>
                    <a
                      href={AUDIT_CTA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1240cc] hover:bg-[#0b34b4] text-white px-6 py-3 rounded-lg font-semibold transition text-xs whitespace-nowrap"
                      onClick={() => handleCTAClick('isolation_section')}
                    >
                      Schedule Call
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mt-4">
                    {pricingFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1240cc]" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Verify Your Panel */}
            <section id="verify-panel" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  Verify Your Panel Status
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Use Google&apos;s official recovery form to verify if your Google Workspace is legitimate
                </p>

                <div className="space-y-5">
                  {verificationSteps.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#1240cc] text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{item.step}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                        {item.link && (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1240cc] text-white rounded-lg text-sm font-medium hover:bg-[#0b34b4] transition mt-3"
                          >
                            {item.link.label}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
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
                  Illegitimate Panels vs Infrabox
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Illegitimate Panels</h3>
                    <div className="space-y-3">
                      {illegitimateItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Infrabox (Legitimate)</h3>
                    <div className="space-y-3">
                      {legitimateItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Migration Strategy */}
            <section id="migration" className="bg-white border-b border-gray-200 scroll-mt-4">
              <div className="px-6 lg:px-12 py-8 lg:py-10 max-w-3xl">
                <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-2">
                  Don&apos;t Wait Until It&apos;s Too Late
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Every day you delay increases the risk of permanent data loss
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {migrationReasons.map((item, i) => (
                    <div key={i} className="border border-gray-200 bg-white rounded-xl p-5">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{item.title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-5 text-center">
                    Smart Migration Strategy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {migrationSteps.map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="w-10 h-10 bg-[#1240cc] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                          {i + 1}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.step}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    ))}
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
                  Emergency migration available 24/7
                </h2>
                <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed">
                  Don&apos;t risk losing your business emails. Switch to legitimate Infrabox infrastructure today.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={AUDIT_CTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleCTAClick('final_emergency')}
                    className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Book Migration Call
                  </a>
                  <a
                    href="https://app.infrabox.software/signup?utm_source=panel_checker&utm_medium=cta&utm_campaign=emergency_migration"
                    onClick={() => handleCTAClick('final_signup')}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Start Setup Now
                    <ArrowRight className="w-4 h-4" />
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
