'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, ArrowRight, Clock, Mail, Server, Zap, Copy, Gift } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { useState } from 'react';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema } from '@/components/seo/json-ld';

export default function AzureMailboxesPage() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('AZURE100FREE');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setupOptions = [
    {
      title: "Quick Setup",
      description: "Guided process, automatic configuration",
      recommended: true
    },
    {
      title: "Mailbox Flow",
      description: "Manual control, custom configuration",
      recommended: false
    }
  ];

  const faqs = [
    {
      question: "What are Azure Mailboxes?",
      answer: "Email accounts built on Microsoft Azure infrastructure, optimized for email outreach with high deliverability."
    },
    {
      question: "How does pricing work?",
      answer: "$30 per domain for up to 100 mailboxes. Same price whether you create 25, 50, or 100 mailboxes."
    },
    {
      question: "How do I get the free offer?",
      answer: "Use Quick Setup, click 'Apply Coupon Code' at checkout, and enter AZURE100FREE. Limited to first 100 customers."
    },
    {
      question: "Can I use my own domain?",
      answer: "Yes, bring your own domain or purchase one through our platform."
    }
  ];

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Azure Mailboxes",
        description: "Microsoft Azure mailboxes optimized for email. Up to 100 mailboxes per domain with high deliverability and enterprise Azure infrastructure.",
        url: "https://www.infrabox.software/azure-mailboxes",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Azure Mailboxes", url: "https://www.infrabox.software/azure-mailboxes" },
      ])} />
      <Header />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-32 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1240cc]/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs uppercase tracking-wider text-[#1240cc] font-semibold">
                AZURE LAUNCH OFFER
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black leading-[0.95] mb-8">
              Microsoft Azure Mailboxes
              <br />
              <span className="text-[#1240cc]">100 FREE for first 100 customers</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.infrabox.software/signup?utm_source=azure_page&utm_medium=hero_cta&utm_campaign=azure_launch"
                onClick={() => trackClick('azure_hero_cta', { action: 'signup' })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-medium"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-to-redeem"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-black hover:bg-gray-50 rounded-full transition-all text-sm font-medium"
              >
                How to Redeem
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl py-16 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative group p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[#1240cc] mb-1">$30</p>
                <p className="text-sm text-black/70 font-medium">Per Domain</p>
              </div>
              <div className="relative group p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[#1240cc] mb-1">100</p>
                <p className="text-sm text-black/70 font-medium">Mailboxes</p>
              </div>
              <div className="relative group p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[#1240cc] mb-1">1-2 hrs</p>
                <p className="text-sm text-black/70 font-medium">Setup Time</p>
              </div>
              <div className="relative group p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[#1240cc] mb-1">Instant</p>
                <p className="text-sm text-black/70 font-medium">Platform Connect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Offer Section */}
      <section id="how-to-redeem" className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl py-16 mx-auto">
            <div className="bg-gradient-to-br from-[#1240cc] to-[#0b34b4] rounded-2xl p-8 md:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5 text-yellow-400" />
                    <p className="text-xs uppercase tracking-wider text-yellow-400 font-medium">
                      AZURE LAUNCH OFFER · FIRST 100 CUSTOMERS
                    </p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                    Get 100 Mailboxes FREE
                  </h2>

                  {/* Coupon Code Display */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6 inline-block">
                    <div className="flex items-center gap-3">
                      <code className="text-2xl font-mono font-bold text-yellow-400">
                        AZURE100FREE
                      </code>
                      <button
                        onClick={copyCode}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-green-400 mt-1">Copied!</p>
                    )}
                  </div>

                  <a
                    href="https://app.infrabox.software/signup?utm_source=azure_page&utm_medium=offer_cta&utm_campaign=azure_launch"
                    onClick={() => trackClick('azure_offer_cta', { action: 'signup' })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
                  >
                    Claim Free Mailboxes
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Redemption Steps */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-white/90 mb-4">How to redeem:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-[#1240cc] rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <p className="text-sm text-white/80">Start Quick Setup</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-[#1240cc] rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <p className="text-sm text-white/80">Click "Apply Coupon Code" at checkout</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-[#1240cc] rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <p className="text-sm text-white/80">Enter <span className="font-mono font-bold text-yellow-400">AZURE100FREE</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Options */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl py-16 mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Two setup options
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {setupOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border ${option.recommended ? 'border-[#1240cc] bg-[#1240cc]/5' : 'border-gray-200'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-black">{option.title}</h3>
                    {option.recommended && (
                      <span className="px-2 py-0.5 bg-[#1240cc] text-white text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black/70">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl py-16 mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Why Azure Mailboxes?
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">Powered by Microsoft Azure servers</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">Higher deliverability than traditional providers</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">Optimized for email outreach</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">Better sender reputation from Azure IPs</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">25, 50, or 100 mailboxes per domain</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">Connect to any email sending platform</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">Use your own domain or buy one</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-[#1240cc]/30 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#1240cc]" />
                </div>
                <p className="text-sm font-medium text-black/80">Enterprise-grade Microsoft infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl py-16 mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              FAQ
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-black mb-2">{faq.question}</h3>
                  <p className="text-sm text-black/70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white pb-16">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="p-12 text-center rounded-xl bg-[#1240cc]">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Get 100 mailboxes free
            </h2>
            <p className="text-sm text-yellow-400 mb-8">
              Azure Launch Offer · Use code AZURE100FREE · First 100 customers only
            </p>
            <a
              href="https://app.infrabox.software/signup?utm_source=azure_page&utm_medium=bottom_cta&utm_campaign=azure_launch"
              onClick={() => trackClick('azure_bottom_cta', { action: 'signup' })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
