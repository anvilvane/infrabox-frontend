import React from 'react';
import { Shield, Check, Clock, MoveRight } from 'lucide-react';
import { trackClick } from '@/lib/datafast';
import { trackEvent, EVENTS } from '@/libs/posthog';

// Platform stats shown under the hero. Every figure below already appears
// elsewhere in this codebase — no new claims are introduced here:
//   18M+ emails sent / 5,039 domains / 16,754 mailboxes
//     -> components/compare/SideBySideScreenshots.js (lines 17, 23)
//     -> app/compare/[slug]/page.js (lines 255, 257)
//     -> app/learn/[slug]/articles/infrabox-review.js (line 96)
//   24+ sequencer integrations
//     -> app/alternatives/page.js (line 252)
//     -> app/alternatives/[slug]/page.js (line 289)
//     -> app/llms-full.txt/route.js (line 101)
const PLATFORM_STATS = [
  { value: '18M+', label: 'Emails sent' },
  { value: '5,039', label: 'Domains managed' },
  { value: '16,754', label: 'Mailboxes live' },
  { value: '24+', label: 'Sequencer integrations' },
];


export default function EmailDeliveryHero() {

  return (
    <div className="bg-white text-black relative overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 z-0">
        {/* Blob 1 - Light Blue */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-sky-50/70 to-blue-50/70 rounded-full opacity-12 blur-3xl"
             style={{
               animation: 'continuous-drift 60s linear infinite',
               animationDelay: '0s'
             }}>
        </div>

        {/* Blob 2 - Light Pastel Purple */}
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-bl from-purple-50/70 to-violet-50/70 rounded-full opacity-10 blur-3xl"
             style={{
               animation: 'continuous-drift 80s linear infinite reverse',
               animationDelay: '5s'
             }}>
        </div>

        {/* Blob 3 - Soft Gray-Blue */}
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-slate-50/60 to-gray-50/60 rounded-full opacity-11 blur-3xl"
             style={{
               animation: 'continuous-drift 70s linear infinite',
               animationDelay: '10s'
             }}>
        </div>

        {/* Blob 4 - Light Purple Mix */}
        <div className="absolute bottom-32 right-1/3 w-64 h-64 bg-gradient-to-tl from-violet-50/60 to-purple-50/60 rounded-full opacity-13 blur-3xl"
             style={{
               animation: 'continuous-drift 90s linear infinite reverse',
               animationDelay: '15s'
             }}>
        </div>

        {/* Blob 5 - Soft Blue Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-br from-blue-50/50 to-sky-50/50 rounded-full opacity-10 blur-3xl"
             style={{
               animation: 'continuous-drift 65s linear infinite',
               animationDelay: '20s'
             }}>
        </div>

        {/* Blob 6 - Light Gray Top Center */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-bl from-gray-50/55 to-slate-50/55 rounded-full opacity-11 blur-3xl"
             style={{
               animation: 'continuous-drift 75s linear infinite reverse',
               animationDelay: '25s'
             }}>
        </div>

        {/* Blob 7 - Soft Purple Left Center */}
        <div className="absolute top-1/3 left-8 w-60 h-60 bg-gradient-to-tr from-purple-50/55 to-violet-50/55 rounded-full opacity-12 blur-3xl"
             style={{
               animation: 'continuous-drift 85s linear infinite',
               animationDelay: '30s'
             }}>
        </div>

        {/* Blob 8 - Light Blue Right Center */}
        <div className="absolute top-2/3 right-12 w-52 h-52 bg-gradient-to-tl from-sky-50/55 to-blue-50/55 rounded-full opacity-10 blur-3xl"
             style={{
               animation: 'continuous-drift 95s linear infinite reverse',
               animationDelay: '35s'
             }}>
        </div>
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 z-5 backdrop-blur-[1px] bg-white/10"
           style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
             backdropFilter: 'blur(1px)',
             WebkitBackdropFilter: 'blur(1px)'
           }}>
      </div>

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

      <section className="relative w-full z-10 flex flex-col">
        <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none"></div>
        <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12">

          {/* Hero Content */}
          <div className="text-center mb-10">
            <h1
              aria-label="Email infrastructure that runs itself"
              className="text-[clamp(1.5rem,8.6vw,4.5rem)] font-bold tracking-tighter text-black leading-[0.95] mb-5 sm:mb-6"
            >
              <span className="block whitespace-nowrap">Email infrastructure</span>{' '}
              <span className="block whitespace-nowrap text-[#1240cc]">that runs itself</span>
            </h1>
            <p
              aria-label="Google, Microsoft 365 and Azure mailboxes, provisioned, authenticated and warmed up."
              className="text-[clamp(0.85rem,3.5vw,1.25rem)] sm:max-w-2xl mx-auto text-gray-600 leading-snug"
            >
              <span className="block whitespace-nowrap">Google, Microsoft 365 &amp; Azure mailboxes</span>{' '}
              <span className="block whitespace-nowrap">provisioned, authenticated &amp; warmed up</span>
            </p>
          </div>

          {/* Trust Elements - Premium Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10 max-w-5xl mx-auto">
            {[
              { icon: Check, text: "95% inbox delivery" },
              { icon: Clock, text: "Ready in 10 min" },
              { icon: Shield, text: "Zero manual work" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1240cc]/20 transition-all duration-200">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#1240cc]/5">
                    <Icon className="w-2.5 h-2.5 text-[#1240cc]" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-center w-full mb-10">
            <button className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#1240cc] via-emerald-500 to-[#1240cc] rounded-full opacity-75 group-hover:opacity-100 animate-gradient-x pointer-events-none"></div>
              <div className="absolute -inset-[1px] rounded-full pointer-events-none"
                   style={{
                     background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                     backgroundSize: '200% 100%',
                     animation: 'shimmer 2s infinite'
                   }}></div>
              <a
                href="https://app.infrabox.software/signup?utm_source=hero_cta&utm_medium=button&utm_campaign=landing"
                onClick={() => {
                  trackClick('hero_cta', { location: 'hero_section', text: 'Get Started Now', destination: 'signup' });
                  trackEvent(EVENTS.CTA_CLICKED, { location: 'hero', button: 'get_started', destination: 'signup' });
                }}
                className="relative flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-12 sm:h-14 px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium shadow-lg shadow-[#1240cc]/25 gap-2 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Get Started Now
                <MoveRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>
            </button>
          </div>

          {/* Platform Stats */}
          <div className="mt-16">
            <div className="text-center mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Running on Infrabox today</p>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 max-w-3xl mx-auto">
              {PLATFORM_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <dt className="order-2 mt-1.5 text-xs sm:text-sm text-gray-600">{stat.label}</dt>
                  <dd className="order-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#1240cc] leading-none">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

        </div>
      </section>
    </div>
  );
}