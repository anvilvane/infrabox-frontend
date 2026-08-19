'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Shield, Check, Clock, MoveRight, Star } from 'lucide-react';

// Real customer one-liners (same set used on the home-page hero).
const ROTATING_QUOTES = [
  { text: "No more domain burning", author: "Luka", company: "Manyreach" },
  { text: "Reply rate jumped from 2% to 11%", author: "Dimitar", company: "Leadhaste" },
  { text: "Consolidated our entire stack", author: "Abbas", company: "The Playbook Agency" },
  { text: "No more suspended Google accounts", author: "Jesse", company: "Leadmagic" },
  { text: "Unified inbox saved our sanity", author: "Jayson", company: "EmailAnalytics" },
];

// Home-page-style hero for the Zapmail switch campaign: light theme, animated
// gradient blobs, trust pills, and a
// rotating social-proof row — but with switch & save messaging.
export default function HeroSwitch() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % ROTATING_QUOTES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const current = ROTATING_QUOTES[quoteIdx];

  return (
    <div className="bg-white text-black relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-sky-50/70 to-blue-50/70 rounded-full opacity-12 blur-3xl" style={{ animation: 'continuous-drift 60s linear infinite', animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-bl from-purple-50/70 to-violet-50/70 rounded-full opacity-10 blur-3xl" style={{ animation: 'continuous-drift 80s linear infinite reverse', animationDelay: '5s' }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-slate-50/60 to-gray-50/60 rounded-full opacity-11 blur-3xl" style={{ animation: 'continuous-drift 70s linear infinite', animationDelay: '10s' }} />
        <div className="absolute bottom-32 right-1/3 w-64 h-64 bg-gradient-to-tl from-violet-50/60 to-purple-50/60 rounded-full opacity-13 blur-3xl" style={{ animation: 'continuous-drift 90s linear infinite reverse', animationDelay: '15s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-br from-blue-50/50 to-sky-50/50 rounded-full opacity-10 blur-3xl" style={{ animation: 'continuous-drift 65s linear infinite', animationDelay: '20s' }} />
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-bl from-gray-50/55 to-slate-50/55 rounded-full opacity-11 blur-3xl" style={{ animation: 'continuous-drift 75s linear infinite reverse', animationDelay: '25s' }} />
        <div className="absolute top-1/3 left-8 w-60 h-60 bg-gradient-to-tr from-purple-50/55 to-violet-50/55 rounded-full opacity-12 blur-3xl" style={{ animation: 'continuous-drift 85s linear infinite', animationDelay: '30s' }} />
        <div className="absolute top-2/3 right-12 w-52 h-52 bg-gradient-to-tl from-sky-50/55 to-blue-50/55 rounded-full opacity-10 blur-3xl" style={{ animation: 'continuous-drift 95s linear infinite reverse', animationDelay: '35s' }} />
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 z-5 backdrop-blur-[1px] bg-white/10" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)' }} />

      {/* Background grid pattern */}
      <div
        className="absolute inset-0 z-6"
        style={{
          backgroundImage: `linear-gradient(#1240cc 1px, transparent 1px), linear-gradient(90deg, #1240cc 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.02,
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        }}
      />

      <section className="relative w-full z-10 flex flex-col">
        <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
        <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12">

          {/* Eyebrow */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1240cc]/5 border border-[#1240cc]/10 text-xs font-medium text-[#1240cc]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Switching from Zapmail
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-[clamp(1.5rem,9vw,4.5rem)] font-bold tracking-tighter text-black leading-[0.95] mb-5 sm:mb-6">
              <span className="block whitespace-nowrap">Switch from Zapmail.</span>{' '}
              <span className="block whitespace-nowrap text-[#1240cc]">Save up to 28%.</span>
            </h1>
            <p className="text-[clamp(0.85rem,3.5vw,1.25rem)] sm:max-w-2xl mx-auto text-gray-600 leading-snug">
              <span className="block">Migrate your email infrastructure in an afternoon.</span>{' '}
              <span className="block">Google, Microsoft 365 &amp; Azure mailboxes — cheaper, with monitoring &amp; warmup built in.</span>
            </p>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10 max-w-5xl mx-auto">
            {[
              { icon: Check, text: "95% inbox delivery" },
              { icon: Clock, text: "Migrate in an afternoon" },
              { icon: Shield, text: "Google · MS 365 · Azure" },
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

          {/* CTA */}
          <div className="flex items-center justify-center w-full mb-10">
            <button className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#1240cc] via-emerald-500 to-[#1240cc] rounded-full opacity-75 group-hover:opacity-100 animate-gradient-x pointer-events-none" />
              <div className="absolute -inset-[1px] rounded-full pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} />
              <a
                href="https://app.infrabox.software/signup?utm_source=switch_zapmail&utm_medium=hero_cta&utm_campaign=switch_zapmail"
                className="relative flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-12 sm:h-14 px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium shadow-lg shadow-[#1240cc]/25 gap-2 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Start switching free
                <MoveRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "/image-assets/avatars/luka.jpeg",
                  "/image-assets/avatars/benjamin-douablin.jpeg",
                  "/image-assets/avatars/walter-winn.jpeg",
                  "/image-assets/avatars/dimitar-petkov.png",
                  "/image-assets/avatars/jesse-oulette.jpeg",
                ].map((src, i) => (
                  <Image key={i} src={src} alt="" role="presentation" width={28} height={28} className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm" />
                ))}
              </div>
              <div className="overflow-hidden h-[34px] min-w-[200px] sm:min-w-[240px]">
                <div key={quoteIdx} className="flex flex-col leading-tight animate-slide-up">
                  <p className="text-xs italic text-gray-800 whitespace-nowrap">&ldquo;{current.text}&rdquo;</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">{current.author}, {current.company}</p>
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-4">
              <a href="https://www.g2.com/products/infrabox" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 group">
                <img src="https://cdn.brandfetch.io/idN7c_7lEQ/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667574008404" alt="G2" width={40} height={16} className="h-4 w-auto" />
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-[#1240cc]"><span className="font-semibold">4.9</span></span>
              </a>
              <div className="flex items-center gap-1.5">
                <img src="https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1755835725776" alt="Google" width={16} height={16} className="h-4 w-auto" />
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700"><span className="font-semibold">4.8</span></span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
