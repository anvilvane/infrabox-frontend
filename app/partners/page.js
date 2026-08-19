import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { generatePageMetadata } from '@/libs/metadata';
import { getPartners } from '@/lib/partner-directory';
import { TIER_META } from './data';
import PageLayout from '@/components/PageLayout';
import PartnerCalendarModal from '@/components/partners/PartnerCalendarModal';

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: 'Infrabox Partner Network: Find a Email Expert',
  description:
    'Browse hand-picked agencies and operators who build, run, or rescue email infrastructure. Platinum Elite, Gold, Growth, and Certified partners worldwide.',
  path: '/partners',
});

import { TierBadge, TierGlyph, TIER_TOKENS, TIER_ORDER } from '@/components/partners/TierBadge';
import PartnerSearch from '@/components/partners/PartnerSearch';
import { JsonLd, createBreadcrumbSchema, createItemListSchema } from '@/components/seo/json-ld';

const SITE_BASE = 'https://www.infrabox.software';

const BRAND_DARK = '#001040';
const BRAND_TEAL = '#1240cc';
const BRAND_ACCENT = '#d9fad3';

function PartnerCard({ p }) {
  const tier = TIER_META[p.tier];
  const meshSeed = p.slug || p.name || 'x';
  const searchHay = [
    p.name,
    p.tagline,
    p.location,
    ...(p.services || []),
    ...(p.industries || []),
    ...(p.tool_stack || []),
  ].filter(Boolean).join(' ');
  return (
    <Link
      data-partner-search={searchHay}
      href={`/partners/${p.slug}`}
      className="group flex flex-col rounded-xl border border-gray-200/80 bg-white hover:border-[#1240cc]/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Screenshot thumbnail (or pastel mesh fallback) */}
      <div className="relative h-[160px] overflow-hidden bg-[#e8f0fe]">
        {p.screenshot_url ? (
          <img
            src={p.screenshot_url}
            alt={`${p.name} homepage`}
            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <filter id={`m-${meshSeed}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
              </filter>
            </defs>
            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#m-${meshSeed})`} />
            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#m-${meshSeed})`} />
            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#m-${meshSeed})`} />
          </svg>
        )}
        {/* No overlay, screenshot renders undisturbed (V2 spec) */}
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 pb-0 flex-1 flex flex-col">
        {/* Title row: partner name on left, tier glyph badge on right */}
        <div className="flex items-center justify-between gap-2.5 mb-1.5">
          <h3 className="text-[15px] font-semibold text-[#1240cc] tracking-[-0.01em] min-w-0 truncate">
            {p.name}
          </h3>
          <TierBadge tier={p.tier} size="sm" />
        </div>
        <p className="text-[12px] text-gray-500 leading-[1.55] line-clamp-3 flex-1">
          {p.tagline}
        </p>
        {(p.services?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {p.services.slice(0, 3).map((s) => (
              <span key={s} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: location · clients · view profile */}
      <div className="px-4 py-2.5 mt-3.5 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-500 truncate inline-flex items-center gap-1.5">
          <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {p.location || 'Global'}
        </span>
        <span className="text-[12px] font-medium text-[#1240cc] group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
          View profile →
        </span>
      </div>
    </Link>
  );
}

function TierSection({ tierKey, partners, prominent }) {
  if (!partners?.length) return null;
  const meta = TIER_META[tierKey];
  return (
    <section data-tier-section={tierKey} id={`tier-${tierKey}`} className="mb-9 last:mb-0 scroll-mt-24">
      <div className="flex items-end justify-between gap-6 pb-3.5 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <TierGlyph tier={tierKey} color={TIER_TOKENS[tierKey]?.deep} size={16} />
          <h2
            className={`font-semibold text-gray-900 tracking-[-0.02em] ${prominent ? 'text-[22px] sm:text-[24px]' : 'text-[20px] sm:text-[22px]'}`}
          >
            {meta.label}
            <span className="text-gray-400 font-medium"> · {partners.length}</span>
          </h2>
        </div>
        <p className="text-[13px] text-gray-500 leading-[1.6] text-right max-w-[380px] hidden sm:block">
          {meta.blurb}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <PartnerCard key={p.slug} p={{ ...p, tier: tierKey }} />
        ))}
      </div>
    </section>
  );
}

function TierNavStrip({ grouped, total }) {
  const tiers = TIER_ORDER.filter((t) => grouped[t]?.length);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-1.5 flex items-center gap-0 mb-8 overflow-x-auto">
      {tiers.map((tk) => {
        const meta = TIER_META[tk];
        return (
          <a
            key={tk}
            href={`#tier-${tk}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium text-[#001040] hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <TierGlyph tier={tk} color={TIER_TOKENS[tk]?.deep} size={12} />
            {meta.label}
            <span className="text-gray-400 font-medium">{grouped[tk].length}</span>
          </a>
        );
      })}
      <div className="flex-1" />
      <span className="text-[12px] text-gray-500 px-3.5 whitespace-nowrap">{total} partners total</span>
    </div>
  );
}

export default async function PartnersPage() {
  const grouped = await getPartners();
  const total = TIER_ORDER.reduce((n, t) => n + (grouped[t]?.length || 0), 0);
  const tiers = TIER_ORDER.filter((t) => grouped[t]?.length);

  // Flat list of all partners for ItemList structured data
  const allPartners = TIER_ORDER.flatMap((t) => grouped[t] || []);

  const itemListSchema = createItemListSchema({
    name: 'Infrabox Partner Network',
    description:
      'Hand-picked agencies and operators worldwide who build, run, or rescue email infrastructure.',
    url: `${SITE_BASE}/partners`,
    items: allPartners.map((p, idx) => ({
      position: idx + 1,
      name: p.name,
      description: p.tagline,
      url: `${SITE_BASE}/partners/${p.slug}`,
    })),
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_BASE },
    { name: 'Partners', url: `${SITE_BASE}/partners` },
  ]);

  return (
    <PageLayout>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative bg-white border-b border-gray-100 pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden">
          {/* Grid pattern background, same as landing hero */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#1240cc 1px, transparent 1px), linear-gradient(90deg, #1240cc 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.02,
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            }}
          />
          {/* Dashed inner column borders, same as landing hero */}
          <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h1
              className="font-semibold tracking-tight text-[clamp(2rem,6.5vw,4rem)] leading-[1.04]"
              style={{ color: BRAND_DARK }}
            >
              Find an Infrabox<br className="hidden sm:block" />{' '}
              <span style={{ color: BRAND_TEAL }}>expert partner</span>
            </h1>
            <p className="mt-5 text-[15px] sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Hand-picked agencies and operators who&rsquo;ll build, run, or rescue your email infrastructure. Every partner is Infrabox-certified.
            </p>

            <PartnerSearch />

            <p className="mt-4 text-[13.5px] text-gray-500">
              Are you an agency?{' '}
              <Link
                href="/partners/become-a-partner"
                className="font-semibold inline-flex items-center gap-1"
                style={{ color: BRAND_TEAL }}
              >
                Apply to become a partner
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-6">
              {[
                { n: total,        l: 'Certified partners' },
                { n: '18+',        l: 'Countries served' },
                { n: '500,000+',   l: 'Mailboxes deployed' },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-[28px] font-semibold tracking-tight" style={{ color: BRAND_DARK }}>{s.n}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Directory grid with V5 tier-nav strip */}
        <section className="relative bg-white border-b border-gray-200">
          <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
          <div className="relative px-6 py-10 lg:py-12 max-w-5xl mx-auto">
            <TierNavStrip grouped={grouped} total={total} />
            {tiers.map((tk, idx) => (
              <TierSection
                key={tk}
                tierKey={tk}
                partners={grouped[tk]}
                prominent={idx === 0}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-white border-t border-gray-200">
          <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
          <div className="relative px-6 py-12 max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Run an email agency? Join the network.
              </h2>
              <p className="text-sm text-gray-500">
                Partner-only pricing, inbound leads from this directory, and a dedicated team to ship email work that actually delivers.
              </p>
            </div>
            <Link
              href="/partners/become-a-partner"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] text-white font-semibold rounded-lg hover:bg-[#0b34b4] transition-colors text-sm shrink-0"
            >
              Apply to become a partner
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ?calendar=true opens the Calendly modal */}
        <Suspense fallback={null}>
          <PartnerCalendarModal />
        </Suspense>
      </main>
    </PageLayout>
  );
}
