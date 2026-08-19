'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema } from '@/components/seo/json-ld';

export default function AgencyEmailSolutionPage() {
  const workflowSteps = [
    "Onboard client domain in under 2 minutes",
    "Bulk create Google Workspace accounts",
    "Auto-configure SPF, DKIM, DMARC records",
    "Start automated warmup process",
    "Launch campaigns in 14 days"
  ];

  const agencyStats = [
    { number: "500+", label: "Agencies trust Infrabox" },
    { number: "50K+", label: "Client mailboxes managed" },
    { number: "10M+", label: "Emails delivered daily" },
    { number: "95%", label: "Average inbox placement" }
  ];

  const painPoints = [
    "Managing hundreds of client mailboxes across platforms",
    "Complex DNS setup eating into billable hours", 
    "Deliverability issues hurting client results",
    "Manual processes that don't scale",
    "Client churn due to poor email performance"
  ];

  const benefits = [
    "Centralized dashboard for all client accounts",
    "One-click DNS configuration saves hours",
    "95% inbox placement with real-time monitoring", 
    "Bulk operations for instant scaling",
    "Happy clients with consistent results"
  ];

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Agency Email Solution",
        description: "Manage hundreds of client mailboxes from one dashboard. Bulk operations, automated DNS, and 95% inbox placement built for agencies.",
        url: "https://www.infrabox.software/agency-email-solution",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Agency Email Solution", url: "https://www.infrabox.software/agency-email-solution" },
      ])} />
      <Header />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-24 pb-16 max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-6">AGENCY EMAIL INFRASTRUCTURE</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black leading-[0.95] mb-6">
              Scale your agency with
              <br />
              <span className="text-[#1240cc]">enterprise-grade</span> deliverability
            </h1>
            <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto mb-8">
              Manage hundreds of client mailboxes, automate complex workflows, and deliver 
              95% inbox placement rates without the technical overhead.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="https://app.infrabox.software/signup" 
                onClick={() => trackClick('agency_hero_cta', { action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-semibold"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/#book-call"
                onClick={() => trackClick('agency_hero_cta', { action: 'demo' })}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black hover:bg-gray-50 rounded-full transition-all text-sm font-semibold"
              >
                Book Agency Demo
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {agencyStats.map((stat, index) => (
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

      {/* Problems & Solutions */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">THE CHALLENGE</p>
                <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                  Agency email challenges
                </h2>
                <div className="space-y-4">
                  {painPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-black/80 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">THE SOLUTION</p>
                <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                  Infrabox handles everything
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-black/80 leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">AGENCY WORKFLOW</p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                From client onboarding to campaign launch
              </h2>
              <p className="text-sm text-black/70">
                Complete setup in under 10 minutes per client
              </p>
            </div>

            <div className="space-y-6">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-[#1240cc] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-black font-medium">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg text-center">
              <p className="text-black text-sm">
                <Clock className="w-4 h-4 inline mr-2" />
                <span className="font-semibold">Total time: Under 10 minutes</span>
                <span className="text-black/70 ml-2">(vs 2-3 hours manually)</span>
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
              Ready to scale your agency?
            </h2>
            <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
              Join 500+ agencies delivering exceptional results with Infrabox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://app.infrabox.software/signup" 
                onClick={() => trackClick('agency_cta', { location: 'bottom' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/#book-call" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
              >
                Book Agency Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}