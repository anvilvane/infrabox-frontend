'use client'

import React, { useEffect, useRef, useState } from 'react';
import { trackGoal } from '@/lib/datafast';
import { buildCalendlyUrl } from '@/lib/attribution';
import { getCalendlyUrl } from '@/lib/booking';
import BookingFallback from '@/components/BookingFallback';

const CALENDLY_BASE_URL = getCalendlyUrl('sales');

export default function BookCall() {
  // Calendly is ~2.5MB and drags in reCAPTCHA + Stripe. Mount it only when the
  // section is near the viewport so it never blocks the initial page load.
  const [showCalendar, setShowCalendar] = useState(false);
  // Calendly URL decorated with ad attribution (gclid/utm) so a booked call can
  // be attributed to the ad and the invitee email captured.
  const [calendlyUrl, setCalendlyUrl] = useState(CALENDLY_BASE_URL);
  // Gate the iframe on the decorated URL being ready, so it never mounts with the
  // undecorated base URL first (which would load the ~2.5MB Calendly twice and
  // could drop the gclid if the user books before the reload finishes).
  const [urlReady, setUrlReady] = useState(false);
  const sectionRef = useRef(null);

  // Decorate the Calendly URL with attribution once on the client.
  useEffect(() => {
    if (CALENDLY_BASE_URL) setCalendlyUrl(buildCalendlyUrl(CALENDLY_BASE_URL));
    setUrlReady(true);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShowCalendar(true);
      trackGoal('book_call_calendar_loaded');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowCalendar(true);
          trackGoal('book_call_calendar_loaded');
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-gray-200 border-dashed scroll-mt-24" id="book-call">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 pt-12 pb-12">
        {/* Header Section */}
        <div className="text-center mb-4">
          <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-4">
            SCHEDULE CONSULTATION
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-3">
            Book your strategy call
          </h2>
          <p className="text-sm text-black/70 max-w-2xl text-balance mx-auto">
            Get personalized insights on how Infrabox can transform your email infrastructure
            and achieve inbox placement rates of 95%+
          </p>
        </div>

        {/* Calendly Widget — mounted only when scrolled near (keeps it off the initial load) */}
        <div className={`mt-6 w-full ${CALENDLY_BASE_URL ? 'h-[700px]' : ''}`}>
          {!CALENDLY_BASE_URL && (
            <BookingFallback
              title="Talk to an infrastructure specialist"
              description="Tell us what you're sending and we'll map the setup to match — domains, mailboxes, warmup and DNS, configured for you."
            />
          )}
          {CALENDLY_BASE_URL && showCalendar && urlReady && (
            <iframe
              src={calendlyUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Book a Call - Calendly"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
}