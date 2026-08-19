'use client'

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Check, MoveRight, Percent, Gift, Users, TrendingUp } from 'lucide-react';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { trackClick } from '@/lib/datafast';
import { getCalendlyUrl } from '@/lib/booking';

export default function Creators() {
  const CALENDLY_LINK = getCalendlyUrl("partner", { embed: false }) || "mailto:partners@infrabox.software?subject=Creator%20partnership";
  const TYPEFORM_LINK = "https://form.typeform.com/to/lfgVg2zk";

  const benefits = [
    {
      title: "10% Lifetime Commission",
      description: "Recurring revenue on all referrals forever"
    },
    {
      title: "Free Azure Inboxes",
      description: "Up to 100 test accounts included"
    },
    {
      title: "Free Pro Account",
      description: "Full InfraGuard access ($99/mo value)"
    },
    {
      title: "Priority Support",
      description: "Direct line to the Infrabox team"
    },
    {
      title: "Creator Community",
      description: "WhatsApp group with top GTMEs"
    },
    {
      title: "Ad Amplification",
      description: "LinkedIn spend on your best content"
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Apply",
      description: "Quick form about your GTM experience and audience."
    },
    {
      number: "02",
      title: "Get Onboarded",
      description: "Approved and set up within 24 hours."
    },
    {
      number: "03",
      title: "Join the Circle",
      description: "Access community, referral link, and partner assets."
    },
    {
      number: "04",
      title: "Publish & Earn",
      description: "Post content, drive referrals, earn lifetime commission."
    }
  ];

  const linkedinPosts = [
    {
      author: "Naufal Norazman",
      title: "Founder @ Understory Agency",
      image: "/creators/naufal.png",
      excerpt: "Nearly $1M in pipeline generated last week from email alone. Here's the exact infrastructure stack we use to make it happen consistently...",
      url: "https://www.linkedin.com/posts/naufaln1_nearly-a-1m-in-pipeline-generated-last-week-activity-7403834251290583040-dXel"
    },
    {
      author: "Can Timagur",
      title: "Founder @ GrowthPal",
      image: "/creators/can.jpeg",
      excerpt: "Here are the 6 sales tools I use at my lead gen agency to book 50+ meetings per month for our clients...",
      url: "https://www.linkedin.com/posts/cantimagur_here-are-the-6-sales-tools-i-use-at-my-lead-activity-7400149060982132736-VsbJ"
    },
    {
      author: "Abbas Somji",
      title: "CEO @ Playbook Agency",
      image: "/creators/abbas.jpeg",
      excerpt: "We just analysed over 400,000 active mailboxes across our client accounts. The results? 94% inbox placement...",
      url: "https://www.linkedin.com/posts/abbas-somji_we-just-analysed-over-400000-active-mailboxes-activity-7407344124791701504-oj3I"
    }
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="bg-white text-black relative overflow-hidden">
        {/* Animated Gradient Blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-sky-50/70 to-blue-50/70 rounded-full opacity-12 blur-3xl"
               style={{ animation: 'continuous-drift 60s linear infinite' }}></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-bl from-purple-50/70 to-violet-50/70 rounded-full opacity-10 blur-3xl"
               style={{ animation: 'continuous-drift 80s linear infinite reverse', animationDelay: '5s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-slate-50/60 to-gray-50/60 rounded-full opacity-11 blur-3xl"
               style={{ animation: 'continuous-drift 70s linear infinite', animationDelay: '10s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-64 h-64 bg-gradient-to-tl from-violet-50/60 to-purple-50/60 rounded-full opacity-13 blur-3xl"
               style={{ animation: 'continuous-drift 90s linear infinite reverse', animationDelay: '15s' }}></div>
        </div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 z-5 backdrop-blur-[1px] bg-white/10"
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
               backdropFilter: 'blur(1px)',
               WebkitBackdropFilter: 'blur(1px)'
             }}></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 z-6"
          style={{
            backgroundImage: `linear-gradient(#1240cc 1px, transparent 1px), linear-gradient(90deg, #1240cc 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.02,
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
          }}
        />

        <section className="relative w-full z-10">
          <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none"></div>
          <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 pb-8 pt-24">

            {/* Hero Content */}
            <div className="text-center mt-16 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-black leading-[0.95] mb-6 sm:mb-8">
                Become an <br />
                <span className="text-[#1240cc]">
                 Infrabox Creator
                </span>
              </h1>
              <p className="text-base sm:max-w-2xl mx-auto text-gray-600 px-4 sm:px-0">
                Join fellow GTM experts, growth hackers, and email specialists. <br />
                Get 10% recurring commission on every referral, forever.
              </p>
            </div>

            {/* Trust Elements - Premium Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-12 max-w-5xl mx-auto">
              {[
                { icon: Percent, text: "10% lifetime commission" },
                { icon: Gift, text: "Free Pro account" },
                { icon: Users, text: "Creator community" },
                { icon: TrendingUp, text: "Ad amplification" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1240cc]/20 transition-all duration-200">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#1240cc]/5">
                      <Icon className="w-2.5 h-2.5 text-[#1240cc]" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mb-8 sm:mb-12">
              <a
                href={TYPEFORM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('creator_hero_cta', { action: 'apply_now' })}
                className="flex transition text-center rounded-full items-center duration-300 justify-center text-white bg-[#1240cc] hover:bg-[#0b34b4] h-10 sm:h-11 px-6 sm:px-8 text-sm sm:text-base font-medium gap-2"
              >
                Apply Now
                <MoveRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a
                href={CALENDLY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('creator_hero_cta', { action: 'book_call' })}
                className="flex transition text-center rounded-full items-center duration-300 justify-center text-gray-700 bg-white border border-gray-300 hover:border-gray-400 h-10 sm:h-11 px-6 sm:px-8 text-sm sm:text-base font-medium"
              >
                Book a Call
              </a>
            </div>

          </div>
        </section>
      </div>

      {/* Benefits Section */}
      <section>
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black mb-2">
            What you get
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Everything you need to succeed as a creator partner.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <h3 className="text-sm font-medium text-black mb-1">{benefit.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Potential - New Design */}
      <section>
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16 border-t">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black mb-4">
                Revenue potential
              </h2>
              <p className="text-base text-gray-600 mb-6">
                Earn 10% recurring commission on every customer you refer. No caps, no expiration. Your commission continues for the lifetime of the customer.
              </p>
              <div className="flex mt-4">
                <a
                  href={TYPEFORM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex transition text-center rounded-full items-center duration-300 justify-center text-white bg-[#1240cc] hover:bg-[#0b34b4] h-9 px-4 py-2 text-sm"
                >
                  Start earning
                </a>
              </div>
            </div>

            <div className="p-8 pb-0 pr-0 overflow-hidden bg-gray-100 rounded-xl">
              <div className="max-w-md p-6 mx-auto -mb-1 -mr-1 bg-white rounded-tl-xl shadow-sm outline outline-gray-300">
                <p className="text-sm text-gray-500 mb-1">Your Commission</p>
                <p className="text-base font-medium text-black mb-6">10% Lifetime Revenue Share</p>

                <div className="pt-4 border-t grid grid-cols-2 border-gray-100 gap-y-6">
                  <div>
                    <p className="text-sm text-gray-500">10 Small Referrals</p>
                    <p className="text-2xl font-bold text-black">$175<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">1 Enterprise Deal</p>
                    <p className="text-2xl font-bold text-black">$1,250<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Annual (10 small)</p>
                    <p className="text-base font-medium text-black">$2,100/year</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Annual (1 enterprise)</p>
                    <p className="text-base font-medium text-[#1240cc]">$15,000/year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section>
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16 border-t">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black mb-2">
            Who we're looking for
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-2xl">
            This program is for content creators who fit one of these profiles.
          </p>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <p className="text-base font-medium text-black mb-1">GTM Engineers</p>
              <p className="text-sm text-gray-600">Build systems that drive pipeline. Automating outbound, data enrichment, and email infrastructure.</p>
            </div>
            <div>
              <p className="text-base font-medium text-black mb-1">RevOps Leaders</p>
              <p className="text-sm text-gray-600">Optimize revenue operations and understand the tech stack powering modern sales teams.</p>
            </div>
            <div>
              <p className="text-base font-medium text-black mb-1">Sales & Marketing Pros</p>
              <p className="text-sm text-gray-600">In the trenches running campaigns, closing deals, and know what moves the needle in B2B growth.</p>
            </div>
            <div>
              <p className="text-base font-medium text-black mb-1">Outbound Experts</p>
              <p className="text-sm text-gray-600">Email is your craft. You understand deliverability, infrastructure, and getting replies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Creators Do */}
      <section>
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16 border-t">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black mb-2">
            What you'll do
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Your commitment to the program.
          </p>

          <div className="max-w-2xl space-y-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#1240cc] mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-700">1-2 LinkedIn posts per month about GTM, email, or infrastructure</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#1240cc] mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-700">Case studies, framework posts, video content, or tool breakdowns</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#1240cc] mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-700">Share workflows, sequences, or setups for the community</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[#1240cc] mt-0.5 flex-shrink-0" />
              <p className="text-base text-gray-700">Tactical, authentic content only. No AI-generated fluff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section>
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16 border-t">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black mb-2">
            Featured creators
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Join the community of GTM leaders already building with Infrabox.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {linkedinPosts.map((post, index) => (
              <a
                key={index}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('creator_testimonial', { author: post.author })}
                className="group border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.image}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.title}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-grow">"{post.excerpt}"</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-[#1240cc] group-hover:underline">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <span>View on LinkedIn</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16 border-t">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black mb-8">
            How it works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index}>
                <p className="text-sm font-medium text-[#1240cc] mb-2">{step.number}</p>
                <p className="text-base font-medium text-black mb-1">{step.title}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8 py-24 text-center rounded-xl bg-[#1240cc]">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Ready to join?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Join our curated community of GTM thought leaders.<br/> Limited spots only
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={TYPEFORM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('creator_bottom_cta', { action: 'apply_now' })}
                className="flex transition text-center rounded-full items-center duration-300 justify-center text-[#1240cc] bg-white hover:bg-gray-100 h-11 px-8 text-sm font-semibold gap-2"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={CALENDLY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('creator_bottom_cta', { action: 'book_call' })}
                className="flex transition text-center rounded-full items-center duration-300 justify-center text-white border border-white/30 hover:bg-white/10 h-11 px-8 text-sm font-medium"
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
