'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema } from '@/components/seo/json-ld';

export default function EmailDeliverabilityPage() {
  const stats = [
    { number: "95%", label: "Inbox placement rate" },
    { number: "500K+", label: "Emails delivered daily" },
    { number: "14", label: "Days to full reputation" },
    { number: "<0.1%", label: "Bounce rate" }
  ];

  const deliverabilityFactors = [
    "Premium US-based IP addresses",
    "Automated SPF, DKIM, DMARC setup",
    "Smart warmup process (14 days)",
    "Real-time reputation monitoring",
    "Content optimization suggestions"
  ];

  const commonProblems = [
    "Emails landing in spam folders",
    "Poor sender reputation scores",
    "Complex DNS configuration errors",
    "Long warmup periods (30+ days)",
    "High bounce and complaint rates"
  ];

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Email Deliverability",
        description: "Achieve 95% inbox placement with premium US IPs, automated DNS setup, smart warmup, and real-time deliverability monitoring from Infrabox.",
        url: "https://www.infrabox.software/email-deliverability",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Email Deliverability", url: "https://www.infrabox.software/email-deliverability" },
      ])} />
      <Header />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-24 pb-16 max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-6">EMAIL DELIVERABILITY</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black leading-[0.95] mb-6">
              Reach the inbox
              <br />
              <span className="text-[#1240cc]">every time</span>
            </h1>
            <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto mb-8">
              Stop losing emails to spam folders. Our comprehensive deliverability solution 
              ensures 95% inbox placement with premium US IPs and automated setup.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="https://app.infrabox.software/signup" 
                onClick={() => trackClick('deliverability_hero_cta', { action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-semibold"
              >
                Improve Deliverability
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/learn/email-deliverability-guide"
                onClick={() => trackClick('deliverability_hero_cta', { action: 'guide' })}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black hover:bg-gray-50 rounded-full transition-all text-sm font-semibold"
              >
                Read Deliverability Guide
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl md:text-3xl font-bold text-[#1240cc] mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-black/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Affects Deliverability */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">WHAT AFFECTS DELIVERABILITY</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                Multiple factors determine inbox placement
              </h2>
              <p className="text-base text-black/70 leading-relaxed max-w-2xl mx-auto">
                Email deliverability depends on sender reputation, authentication records, 
                content quality, engagement rates, and IP reputation. Poor deliverability 
                can result in 50-90% of emails never reaching recipients.
              </p>
            </div>

            <div className="grid justify-center md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Common problems:</h3>
                <ul className="space-y-3 text-sm text-black/80">
                  {commonProblems.map((problem, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {problem}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Infrabox solution:</h3>
                <ul className="space-y-3 text-sm text-black/80">
                  {deliverabilityFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Achieve 95% */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">OUR APPROACH</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                How we achieve 95% inbox placement
              </h2>
            </div>

            <div className="text-center">
              <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-2xl font-bold text-[#1240cc] mb-2">Setup</div>
                  <p className="text-sm text-black/70">Automated DNS configuration and premium US IP assignment</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#1240cc] mb-2">Warmup</div>
                  <p className="text-sm text-black/70">Smart 14-day reputation building process</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#1240cc] mb-2">Monitor</div>
                  <p className="text-sm text-black/70">Real-time tracking and optimization</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[#1240cc] rounded-lg text-center">
              <p className="text-white text-sm">
                <Clock className="w-4 h-4 inline mr-2" />
                <span className="font-semibold">Results in 14 days</span>
                <span className="text-white/70 ml-2">95% inbox placement guaranteed</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 py-16">
          <div className="p-12 text-center rounded-xl bg-[#1240cc]">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Ready to reach the inbox?
            </h2>
            <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
              Stop losing opportunities to spam folders. Get 95% inbox placement with Infrabox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://app.infrabox.software/signup" 
                onClick={() => trackClick('deliverability_cta', { location: 'bottom' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Improve Deliverability
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
              >
                Read Complete Guide
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}