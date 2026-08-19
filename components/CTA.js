import React from 'react';
import { ArrowRight } from 'lucide-react';
import { trackClick } from '@/lib/datafast';
import { trackEvent, EVENTS } from '@/libs/posthog';

export default function CTASection() {
  return (
    <section className=" border-gray-200 border-dashed">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 py-12 lg:border-x lg:border-gray-200">
        <div className="p-8 py-24 text-center rounded-xl bg-[#1240cc]">
          <div className="text-balance">
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold tracking-tight text-white">
             Make your email infrastructure count
            </h2>
            <p className="text-base sm:text-lg tracking-tight md:text-xl mt-2 text-white/80">
              No DNS setup. No deliverability headaches. Just emails that land in the inbox. Get started in minutes.
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <a 
              href="https://app.infrabox.software/signup?utm_source=cta_bottom&utm_medium=button&utm_campaign=landing" 
              onClick={() => {
                trackClick('cta_bottom', { location: 'cta_section', text: 'Get started', destination: 'signup' });
                trackEvent(EVENTS.CTA_CLICKED, { location: 'cta_bottom', button: 'get_started', destination: 'signup' });
              }}
              className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-emerald-950 bg-white focus:ring-white h-10 px-6 py-3 text-base gap-4 font-semibold"
              aria-label="Get started with Infrabox - Sign up now"
            >
              Get started
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}