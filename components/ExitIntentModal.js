'use client'

import React, { useEffect, useRef, useState } from 'react';
import { X, Check, Star } from 'lucide-react';
import { buildCalendlyUrl } from '@/lib/attribution';
import { getCalendlyUrl } from '@/lib/booking';
import BookingFallback from '@/components/BookingFallback';

const STORAGE_KEY = 'infrabox_exit_intent_shown_v1';
const MOBILE_DELAY_MS = 30000;
const MOBILE_SCROLL_THRESHOLD = 0.5;
const MOBILE_SCROLL_UP_VELOCITY = -1.5;
const MOBILE_SCROLL_MIN_Y = 200;
const MOUSEOUT_MIN_TIME_MS = 2000;
const MOUSEOUT_MIN_SCROLL_Y = 150;
const MOUSEOUT_DEBOUNCE_MS = 400;
const TAB_SWITCH_DEBOUNCE_MS = 2000;

const CALENDLY_SRC = getCalendlyUrl('sales');
const IFRAME_MARKER_ATTR = 'data-exit-intent-iframe';

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  // Calendly URL decorated with ad attribution (gclid/utm).
  const [calendlyUrl, setCalendlyUrl] = useState(CALENDLY_SRC);
  const firedRef = useRef(false);
  const openRef = useRef(false);

  useEffect(() => { openRef.current = open; }, [open]);

  // Mount the Calendly iframe only when the modal actually opens. Preloading it on
  // every page added ~2.5MB + ~1.4s of main-thread work site-wide. Once mounted it
  // stays in the DOM, so re-opening within the session is instant.
  useEffect(() => {
    if (open) {
      if (CALENDLY_SRC) setCalendlyUrl(buildCalendlyUrl(CALENDLY_SRC));
      setIframeReady(true);
    }
  }, [open]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const forceOpen =
      new URLSearchParams(window.location.search).get('exitIntent') === 'force';

    if (!forceOpen && sessionStorage.getItem(STORAGE_KEY)) {
      firedRef.current = true;
      return;
    }

    setShouldRender(true);

    window.__openExitIntent = () => {
      firedRef.current = false;
      setOpen(true);
    };

    if (forceOpen) {
      setOpen(true);
    }

    const trigger = (source) => {
      if (firedRef.current) return;
      if (openRef.current) return;
      firedRef.current = true;
      sessionStorage.setItem(STORAGE_KEY, '1');
      setOpen(true);
      if (window.datafast) {
        try { window.datafast('exit_intent_shown', { location: source }); } catch (_) {}
      }
    };

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const mountedAt = Date.now();

    const hasVisibleIframe = () => {
      const iframes = document.querySelectorAll('iframe');
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        if (iframe.hasAttribute(IFRAME_MARKER_ATTR)) continue;
        const rect = iframe.getBoundingClientRect();
        if (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        ) {
          return true;
        }
      }
      // Google One Tap lives in a shadow DOM and isn't caught by the iframe query
      const gsi = document.getElementById('credential_picker_container');
      if (gsi) {
        const r = gsi.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return true;
      }
      return false;
    };

    let delayTimer;
    let mouseoutTimer = null;
    let maxScrollY = window.scrollY;
    let onMouseOut;
    let onMouseOver;
    let onScroll;
    let onTrackScroll;

    if (isTouch) {
      delayTimer = setTimeout(() => trigger('mobile_timer'), MOBILE_DELAY_MS);
      let lastScrollY = window.scrollY;
      let lastScrollTime = Date.now();
      onScroll = () => {
        const doc = document.documentElement;
        const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
        if (scrolled >= MOBILE_SCROLL_THRESHOLD) {
          trigger('mobile_scroll');
          return;
        }
        const now = Date.now();
        const dy = window.scrollY - lastScrollY;
        const dt = now - lastScrollTime;
        if (dt > 0 && dy < 0 && window.scrollY > MOBILE_SCROLL_MIN_Y) {
          const velocity = dy / dt;
          if (velocity < MOBILE_SCROLL_UP_VELOCITY) {
            trigger('mobile_fast_scroll_up');
            return;
          }
        }
        lastScrollY = window.scrollY;
        lastScrollTime = now;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      onTrackScroll = () => {
        if (window.scrollY > maxScrollY) maxScrollY = window.scrollY;
      };
      window.addEventListener('scroll', onTrackScroll, { passive: true });
      onMouseOut = (e) => {
        if (e.relatedTarget || e.toElement) return;
        if (e.clientY > 20) return;
        if (Date.now() - mountedAt < MOUSEOUT_MIN_TIME_MS) return;
        if (maxScrollY < MOUSEOUT_MIN_SCROLL_Y) return;
        if (hasVisibleIframe()) return;
        if (mouseoutTimer) return;
        mouseoutTimer = setTimeout(() => {
          mouseoutTimer = null;
          if (hasVisibleIframe()) return;
          trigger('desktop_mouseout');
        }, MOUSEOUT_DEBOUNCE_MS);
      };
      onMouseOver = () => {
        if (mouseoutTimer) {
          clearTimeout(mouseoutTimer);
          mouseoutTimer = null;
        }
      };
      document.addEventListener('mouseout', onMouseOut);
      document.addEventListener('mouseover', onMouseOver);
    }

    let tabSwitchTimer = null;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        tabSwitchTimer = setTimeout(() => {
          trigger('tab_switch');
          tabSwitchTimer = null;
        }, TAB_SWITCH_DEBOUNCE_MS);
      } else if (tabSwitchTimer) {
        clearTimeout(tabSwitchTimer);
        tabSwitchTimer = null;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (tabSwitchTimer) clearTimeout(tabSwitchTimer);
      if (mouseoutTimer) clearTimeout(mouseoutTimer);
      if (onMouseOut) document.removeEventListener('mouseout', onMouseOut);
      if (onMouseOver) document.removeEventListener('mouseover', onMouseOver);
      if (onScroll) window.removeEventListener('scroll', onScroll);
      if (onTrackScroll) window.removeEventListener('scroll', onTrackScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center pt-3 pb-14 px-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        aria-hidden={!open}
      >
        <div
          className={`relative w-full max-w-5xl h-[90vh] lg:h-auto lg:max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-transform duration-300 ${
            open ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center shadow-sm transition-colors"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>

          {/* Left: copy on light gradient. On mobile this is a compact header so the
              calendar (the actual conversion action) stays above the fold. */}
          <div className="shrink-0 lg:flex-1 px-6 py-6 sm:p-8 lg:p-9 flex flex-col justify-center bg-gradient-to-br from-[#f5f8ff] via-white to-[#f5f8ff] lg:max-w-[480px]">
            <img
              src="/logo-horizontal.png"
              alt="Infrabox"
              width={132}
              height={40}
              className="h-9 sm:h-10 mb-5 sm:mb-10 object-contain self-start"
              style={{ width: 'auto' }}
            />
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#1240cc] font-semibold mb-4">
              Wait, before you go
            </p>
            <h2
              id="exit-intent-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black leading-[1.1] mb-6"
            >
              Get a free 30-min <span className="text-[#1240cc]">infrastructure audit</span>
            </h2>
            <p className="hidden sm:block text-sm sm:text-base text-gray-700 mb-8 leading-relaxed">
              Pick a time that works. We&rsquo;ll walk through your current setup and show you exactly
              where emails are leaking to spam. No pitch, no obligation.
            </p>

            <ul className="hidden sm:block space-y-3.5 mb-8">
              {[
                'Live audit of your SPF, DKIM & DMARC',
                'Tailored warmup plan for your volume',
                'Clear fix list you can action same-day',
              ].map((item, i) => (
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
                <img
                  src="https://cdn.brandfetch.io/idN7c_7lEQ/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667574008404"
                  alt="G2"
                  className="h-4 w-auto"
                />
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
                <img
                  src="https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1755835725776"
                  alt="Google"
                  className="h-4 w-auto"
                />
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

          {/* Right: Calendly — iframe mounts once after idle and stays loaded so the modal opens instantly.
              On mobile it flexes to fill the remaining sheet height so the calendar renders with a single
              (internal) scroll instead of being buried under the copy with a double scrollbar. */}
          <div className="flex-1 min-h-0 lg:w-[540px] lg:flex-none bg-white border-t lg:border-t-0 lg:border-l border-gray-100">
            {!CALENDLY_SRC && (
              <BookingFallback compact className="h-full rounded-none border-0" />
            )}
            {CALENDLY_SRC && iframeReady && (
              <iframe
                {...{ [IFRAME_MARKER_ATTR]: '' }}
                src={calendlyUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Book a call with Infrabox"
                className="block w-full h-full lg:h-[560px]"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
