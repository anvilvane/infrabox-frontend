import { Suspense } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import PartnerOnboardingForm from '@/components/partners/PartnerOnboardingForm';
import PartnerCalendarModal from '@/components/partners/PartnerCalendarModal';
import { generatePageMetadata } from '@/libs/metadata';
import { JsonLd, createBreadcrumbSchema } from '@/components/seo/json-ld';

const SITE_BASE = 'https://www.infrabox.software';

export const metadata = generatePageMetadata({
  title: 'Become an Infrabox Partner',
  description:
    'Apply to join the Infrabox Partner Network - inbound leads, partner-only pricing, and a dedicated team to help you ship email work that actually delivers.',
  path: '/partners/become-a-partner',
});

export default function BecomeAPartnerPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_BASE },
    { name: 'Partners', url: `${SITE_BASE}/partners` },
    { name: 'Become a partner', url: `${SITE_BASE}/partners/become-a-partner` },
  ]);

  return (
    <PageLayout>
      <JsonLd data={breadcrumbSchema} />
      <main className="bg-white text-black relative overflow-hidden">
        <section className="relative w-full">
          <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none"></div>
          <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 pt-8 pb-2">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400">
              <Link href="/" className="hover:text-[#1240cc] transition-colors">
                Home
              </Link>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Link href="/partners" className="hover:text-[#1240cc] transition-colors">
                Partners
              </Link>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-gray-500">Become a partner</span>
            </nav>
          </div>

          <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-5">
                Apply to the partner program
              </p>
              <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-tighter text-black leading-[0.95] mb-5">
                <span className="block">Become an Infrabox</span>
                <span className="block text-[#1240cc]">partner.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Tell us about your agency. Submissions are reviewed weekly by
                the partnerships team. Strong-fit teams get an intro call and a
                path to a listing in the partner directory.
              </p>
            </div>
          </div>
        </section>

        <section className="relative w-full">
          <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none"></div>
          <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-12">
            <PartnerOnboardingForm />
          </div>
        </section>

        {/* ?calendar=true opens a Calendly modal (read on the client) */}
        <Suspense fallback={null}>
          <PartnerCalendarModal />
        </Suspense>
      </main>
    </PageLayout>
  );
}
