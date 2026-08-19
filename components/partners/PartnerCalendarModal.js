'use client';

import { useEffect, useState } from 'react';
import { X, Check, Star } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getCalendlyUrl } from '@/lib/booking';
import BookingFallback from '@/components/BookingFallback';

// Same params as components/BookCall.js + ExitIntentModal so the inline
// embed lays out without a grey buffer.
const CALENDLY_SRC = getCalendlyUrl('partner');

const INFRABOX_LOGO = '/logo-horizontal.png';
const G2_LOGO =
  'https://cdn.brandfetch.io/idN7c_7lEQ/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667574008404';
const GOOGLE_LOGO =
  'https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1755835725776';

const BULLETS = [
  'Partner-only pricing for your clients',
  'Inbound leads from the partner directory',
  'Co-marketing + early-feature access',
];

export default function PartnerCalendarModal() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const open = params.get('calendar') === 'true';
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    const p = new URLSearchParams(params.toString());
    p.delete('calendar');
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  if (!mounted || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-calendar-title"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center shadow-sm transition-colors"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        {/* Left: copy on light gradient */}
        <div className="flex-1 p-6 sm:p-8 lg:p-9 flex flex-col justify-center bg-gradient-to-br from-[#f5f8ff] via-white to-[#f5f8ff] lg:max-w-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={INFRABOX_LOGO}
            alt="Infrabox"
            width={132}
            height={32}
            className="h-10 sm:h-11 mb-10 object-contain self-start"
            style={{ width: 'auto' }}
          />
          <h2
            id="partner-calendar-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black leading-[1.1] mb-6"
          >
            Talk to our <span className="text-[#1240cc]">partnerships team</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-8 leading-relaxed">
            30 minutes with an Infrabox partnerships lead. We&rsquo;ll walk through
            the program, your stage, and where your agency fits. No pitch, no obligation.
          </p>

          <ul className="space-y-3.5 mb-8">
            {BULLETS.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
                <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#1240cc]/10">
                  <Check className="w-2.5 h-2.5 text-[#1240cc]" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 border-t border-gray-100">
            <a
              href="https://www.g2.com/products/infrabox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={G2_LOGO} alt="G2" className="h-4 w-auto" />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-[#1240cc]">
                <span className="font-semibold">4.9</span>
              </span>
            </a>
            <div className="flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GOOGLE_LOGO} alt="Google" className="h-4 w-auto" />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700">
                <span className="font-semibold">4.8</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Calendly */}
        <div className="flex-1 lg:w-[540px] lg:flex-none bg-white border-t lg:border-t-0 lg:border-l border-gray-100">
          {!CALENDLY_SRC && (
            <BookingFallback compact className="h-[380px] sm:h-[460px] lg:h-[560px] rounded-none border-0"
              title="Talk to the partner team"
              description="Partner-only pricing, inbound leads from the directory, and a dedicated onboarding contact."
              email="partners@infrabox.software" subject="Partner program" />

          )}

          {CALENDLY_SRC && (

          <iframe
            src={CALENDLY_SRC}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Book a call with the Infrabox partner team"
            className="block w-full h-[380px] sm:h-[460px] lg:h-[560px]"
          />

          )}
        </div>
      </div>
    </div>
  );
}
