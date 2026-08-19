import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from '@/libs/metadata';
import { PROFILE_CONTENT, TIER_META } from '../data';
import { getAllSlugs, getPartnerBySlug, getPartners } from '@/lib/partner-directory';
import { TierBadge, TIER_TOKENS } from '@/components/partners/TierBadge';
import PartnerContactForm from '@/components/partners/PartnerContactForm';
import PartnerCalendarModal from '@/components/partners/PartnerCalendarModal';
import { JsonLd, createBreadcrumbSchema } from '@/components/seo/json-ld';

const SITE_BASE = 'https://www.infrabox.software';

// Build an Organization schema describing the partner agency itself.
// This is the structured-data hook that surfaces them in rich search results.
function buildPartnerOrganizationSchema(partner) {
  const url = `${SITE_BASE}/partners/${partner.slug}`;
  const sameAs = [];
  if (partner.website_url) sameAs.push(partner.website_url);
  if (partner.booking_url) sameAs.push(partner.booking_url);

  const aggregate = Array.isArray(partner.testimonials) && partner.testimonials.length > 0
    ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          reviewCount: partner.testimonials.length,
          bestRating: '5',
          worstRating: '1',
        },
        review: partner.testimonials.slice(0, 3).map((t) => ({
          '@type': 'Review',
          reviewBody: t.quote,
          author: { '@type': 'Person', name: t.name },
          itemReviewed: { '@type': 'Organization', name: partner.name },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
            worstRating: '1',
          },
        })),
      }
    : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name: partner.name,
    description: partner.description || partner.tagline,
    url: partner.website_url || url,
    mainEntityOfPage: url,
    ...(partner.logo_url && { logo: partner.logo_url }),
    ...(partner.location && {
      address: { '@type': 'PostalAddress', addressLocality: partner.location },
    }),
    ...(partner.year_founded && { foundingDate: String(partner.year_founded) }),
    ...(Array.isArray(partner.industries) && partner.industries.length && {
      knowsAbout: partner.industries,
    }),
    ...(sameAs.length && { sameAs }),
    ...aggregate,
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) return {};
  const tierLabel = TIER_TOKENS[partner.tier]?.label || '';
  // Keep meta description in the 120-170 char SEO sweet spot. Short taglines
  // get a keyword-rich suffix; long ones use the base sentence so we stay
  // under 170.
  const base = `${partner.tagline} Book a meeting with ${partner.name}, a certified Infrabox partner in ${partner.location}.`;
  const description = base.length < 120
    ? `${base} Email infrastructure powered by Infrabox.`
    : base;
  return generatePageMetadata({
    title: `${partner.name}: ${tierLabel} Infrabox Partner`,
    description,
    path: `/partners/${slug}`,
  });
}

const BRAND_DARK = '#001040';
const BRAND_TEAL = '#1240cc';
const BRAND_ACCENT = '#d9fad3';

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Monogram({ partner, content, size = 88 }) {
  const monoText = content?.heroMonogramText || partner.monogram || partner.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  // Show real logo if available; fall back to monogram tile.
  if (partner.logo_url) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center overflow-hidden flex-shrink-0"
        aria-hidden="true"
      >
        <img
          src={partner.logo_url}
          alt={`${partner.name} logo`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.2,
        background: partner.color || partner.brand_color || '#1f2937',
        color: '#fff',
        fontSize: size * 0.36,
        fontWeight: 700,
        letterSpacing: '-0.04em',
      }}
      className="flex items-center justify-center flex-shrink-0"
      aria-hidden="true"
    >
      {monoText}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="text-[11px] text-gray-400 tracking-[0.1em] uppercase font-semibold mb-3.5">
      {children}
    </h2>
  );
}

function AsideRow({ label, value, last }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-2 ${last ? '' : 'border-b border-gray-100'}`}
    >
      <span className="text-[12px] text-gray-500">{label}</span>
      <span className="text-[12.5px] font-medium text-right" style={{ color: BRAND_DARK }}>
        {value}
      </span>
    </div>
  );
}

// ─── Sticky top nav ───────────────────────────────────────────────────────────

function ProfileBreadcrumbs({ partner }) {
  return (
    <nav aria-label="Breadcrumb" className="relative bg-white">
      <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
      <div className="relative max-w-[1120px] mx-auto px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-xs text-gray-400">
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
          <span className="text-gray-500">{partner.name}</span>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function ProfileHero({ partner, content }) {
  const brand = partner.color || partner.brand_color || '#1f2937';
  const bookUrl = partner.book || partner.booking_url;
  const websiteUrl = partner.href || partner.website_url;
  const oneLiner = content?.heroTagline || partner.tagline;
  const founded = partner.year_founded || content?.partnerSince;
  const clients = partner.companies_supported || content?.clients;
  const languages = (partner.languages || []).join(', ');
  const pricing = content?.pricing || partner.pricing;
  const featured = !!partner.featured;
  const facts = [
    { label: 'Headquarters', value: partner.location },
    { label: 'Founded',      value: founded },
    { label: 'Clients',      value: clients },
    { label: 'Languages',    value: languages },
    { label: 'Pricing',      value: pricing },
  ].filter((f) => f.value);
  return (
    <header className="relative bg-white">
      <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
      <div className="relative max-w-[1120px] mx-auto px-6 lg:px-8 pt-11">
        {/* Tier + featured + co-marketing row */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <TierBadge tier={partner.tier} />
          {featured && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] font-semibold"
              style={{ color: brand, border: `1px solid ${brand}33`, background: 'transparent' }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill={brand} aria-hidden="true">
                <polygon points="6,0 7.6,4 12,4.4 8.6,7.4 9.7,12 6,9.5 2.3,12 3.4,7.4 0,4.4 4.4,4" />
              </svg>
              Featured partner
            </span>
          )}
          {partner.tier === 'platinum' && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-500">
              <span className="text-gray-300">·</span>
              Co-marketing partner
            </span>
          )}
        </div>

        {/* Big monogram + name + CTA */}
        <div className="grid gap-6 items-center" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
          <Monogram partner={partner} content={content} size={88} />
          <div className="min-w-0">
            <h1
              className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.025em] leading-[1.05] m-0"
              style={{ color: BRAND_DARK }}
            >
              {partner.name}
            </h1>
            <p className="text-[16px] sm:text-[17px] text-gray-600 leading-[1.45] mt-2.5 max-w-[620px]">
              {oneLiner}
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-2 min-w-[200px] items-stretch">
            {bookUrl && (
              <a
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-3 rounded-lg text-[14px] font-medium text-white"
                style={{ background: BRAND_TEAL }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Book a call
              </a>
            )}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-[11px] rounded-lg text-[14px] font-medium bg-white border border-gray-200"
                style={{ color: BRAND_DARK }}
              >
                Visit website <span className="text-[12px]">↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Quick facts strip, only renders fields we actually have */}
        {facts.length > 0 && (
          <div className="mt-9 pt-6 border-t border-gray-100 flex flex-wrap gap-x-12 gap-y-5">
            {facts.map((f) => (
              <Fact key={f.label} label={f.label} value={f.value} />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div className="text-[10px] text-gray-400 tracking-[0.08em] uppercase font-semibold mb-1.5">
        {label}
      </div>
      <div className="text-[14px] font-medium" style={{ color: BRAND_DARK }}>
        {value}
      </div>
    </div>
  );
}

// ─── Body sections ────────────────────────────────────────────────────────────

function AboutSection({ partner, content }) {
  const desc = content?.aboutBody || partner.description || partner.tagline;
  return (
    <section id="about" className="mb-10 scroll-mt-20">
      <SectionLabel>About</SectionLabel>
      <p className="text-[16px] text-gray-700 leading-[1.65] m-0">{desc}</p>
    </section>
  );
}

function ServicesSection({ partner }) {
  const services = partner.services || [];
  if (!services.length) return null;
  const brand = partner.color || partner.brand_color || BRAND_TEAL;
  return (
    <section id="services" className="mb-10 scroll-mt-20">
      <SectionLabel>Services</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {services.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium bg-white border border-gray-200"
            style={{ color: BRAND_DARK }}
          >
            <span className="w-[5px] h-[5px] rounded-full" style={{ background: brand }} aria-hidden="true" />
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

function ToolStackSection({ partner }) {
  const stack = partner.tool_stack || [];
  if (!stack.length) return null;
  return (
    <section id="stack" className="mb-10 scroll-mt-20">
      <SectionLabel>Tool stack</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {stack.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-gray-100 text-gray-700"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function WebsiteScreenshotSection({ partner }) {
  // Prefer the real captured screenshot from Spaces; fall back to a brand-colored mock.
  const hasScreenshot = !!partner.screenshot_url;
  const websiteUrl = partner.href || partner.website_url || '';
  const displayHost = websiteUrl ? websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
  const brand = partner.color || partner.brand_color || BRAND_TEAL;
  return (
    <section id="website" className="mb-10 scroll-mt-20">
      <SectionLabel>Their website</SectionLabel>
      <div className="rounded-xl overflow-hidden border border-gray-200">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-gray-200" style={{ background: '#F3F0EB' }}>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28C840' }} />
          </span>
          <span
            className="flex-1 bg-white rounded-md px-3 py-[5px] text-[11px] text-gray-500 text-center"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            {displayHost || partner.name.toLowerCase()}
          </span>
        </div>
        {/* Screenshot or brand-color mock */}
        {hasScreenshot ? (
          <img
            src={partner.screenshot_url}
            alt={`${partner.name} homepage`}
            className="w-full block"
            style={{ minHeight: 360, objectFit: 'cover', objectPosition: 'top' }}
            loading="lazy"
          />
        ) : (
          <div
            className="relative overflow-hidden px-10 py-14"
            style={{ background: brand, color: '#fff', minHeight: 360 }}
          >
            <div className="text-center max-w-[540px] mx-auto">
              <h3 className="text-[32px] font-semibold tracking-tight leading-[1.05] m-0">{partner.name}</h3>
              <p className="text-[14px] opacity-75 leading-[1.55] mt-3">{partner.tagline}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialsSection({ partner, content }) {
  // Server testimonials come from Mongo (mapped to {quote, name, title, company}).
  // PROFILE_CONTENT (data.js) still has the legacy {q, n, r} format for some partners, fall back to that if present.
  const list =
    Array.isArray(partner.testimonials) && partner.testimonials.length
      ? partner.testimonials
      : Array.isArray(content?.testimonials)
        ? content.testimonials.map((t) => ({ quote: t.q || t.quote, name: t.n || t.name, title: t.r || t.title || t.role }))
        : [];
  if (!list.length) return null;
  const brand = partner.color || partner.brand_color || BRAND_TEAL;
  const [hero, ...rest] = list;
  return (
    <section id="testimonials" className="mb-10 scroll-mt-20">
      <SectionLabel>What clients say</SectionLabel>
      <figure className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl px-8 sm:px-10 py-8 mb-3.5">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill={brand}
          className="absolute top-6 left-7 opacity-[0.18]"
          aria-hidden="true"
        >
          <path d="M14 10 C 8 10, 4 14, 4 20 L 4 34 L 18 34 L 18 20 L 11 20 C 11 16, 13 14, 16 13 Z M 34 10 C 28 10, 24 14, 24 20 L 24 34 L 38 34 L 38 20 L 31 20 C 31 16, 33 14, 36 13 Z" />
        </svg>
        <blockquote
          className="m-0 pl-14 text-[18px] sm:text-[19px] leading-[1.5] font-normal tracking-[-0.005em]"
          style={{ color: BRAND_DARK }}
        >
          “{hero.quote}”
        </blockquote>
        <figcaption className="mt-5 pl-14 flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold text-white"
            style={{ background: brand }}
          >
            {(hero.name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </span>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: BRAND_DARK }}>{hero.name}</div>
            {hero.title && <div className="text-[12px] text-gray-500">{hero.title}</div>}
          </div>
        </figcaption>
      </figure>
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {rest.slice(0, 2).map((t) => (
            <figure key={t.name} className="bg-white border border-gray-200 rounded-2xl px-6 py-5 m-0">
              <span
                className="block text-[28px] leading-none mb-1"
                style={{ color: brand, fontFamily: 'Georgia, serif' }}
                aria-hidden="true"
              >
                “
              </span>
              <blockquote className="m-0 text-[13.5px] leading-[1.55] text-gray-700">{t.quote}</blockquote>
              <figcaption className="mt-4 pt-3.5 border-t border-gray-100 text-[12px] text-gray-500">
                <span className="font-semibold" style={{ color: BRAND_DARK }}>{t.name}</span>
                {t.title && <> · {t.title}</>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function InfraboxVerifiedSection() {
  const points = [
    'Sends, client count, and reviews are pulled directly from the Infrabox platform.',
    'Background-checked operators.',
    'Quarterly performance review.',
    'Direct CSM escalation path.',
  ];
  return (
    <section className="mb-10">
      <div className="rounded-2xl border border-gray-200 bg-white px-6 sm:px-8 py-7">
        <div className="flex items-center gap-2 mb-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={BRAND_TEAL}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 12l2 2 4-4" />
            <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" />
          </svg>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] m-0" style={{ color: BRAND_DARK }}>
            Infrabox Verified
          </h3>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 m-0 p-0 list-none">
          {points.map((text) => (
            <li
              key={text}
              className="flex items-start gap-2 text-[13.5px] leading-[1.55] text-gray-700"
            >
              <svg
                className="mt-[3px] shrink-0"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={BRAND_TEAL}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Inline contact form (fallback when partner has no booking URL)
function InlineContactSection({ partner }) {
  if (partner.book || partner.booking_url) return null;
  return (
    <section id="contact" className="mb-10 scroll-mt-20">
      <SectionLabel>Get in touch</SectionLabel>
      <PartnerContactForm partner={partner} />
    </section>
  );
}

// ─── Sticky right rail ────────────────────────────────────────────────────────

function ProfileAside({ partner, content }) {
  const bookUrl = partner.book || partner.booking_url;
  const websiteUrl = partner.href || partner.website_url;
  const industries = (partner.industries || []).join(', ');
  const founded = partner.year_founded || content?.partnerSince;
  const clients = partner.companies_supported || content?.clients;
  const languages = (partner.languages || []).join(', ');
  const pricing = content?.pricing || partner.pricing;
  const rows = [
    industries && { label: 'Industries', value: industries },
    { label: 'Tier', value: <TierBadge tier={partner.tier} size="sm" /> },
    partner.location && { label: 'HQ', value: partner.location },
    languages && { label: 'Languages', value: languages },
    founded && { label: 'Founded', value: founded },
    clients && { label: 'Clients', value: clients },
    pricing && { label: 'Pricing', value: pricing },
  ].filter(Boolean);
  return (
    <aside className="sticky" style={{ top: 80 }}>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-3.5">
        <div className="text-[11px] text-gray-400 tracking-[0.1em] uppercase font-semibold mb-2.5">
          Get in touch
        </div>
        {bookUrl ? (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-4 py-2.5 rounded-lg text-[13.5px] font-medium text-white mb-2"
            style={{ background: BRAND_TEAL }}
          >
            Book a call
          </a>
        ) : (
          <a
            href="#contact"
            className="block text-center px-4 py-2.5 rounded-lg text-[13.5px] font-medium text-white mb-2"
            style={{ background: BRAND_TEAL }}
          >
            Message {partner.name.split(' ')[0]}
          </a>
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-4 py-2.5 rounded-lg text-[13.5px] font-medium bg-white border border-gray-200"
            style={{ color: BRAND_DARK }}
          >
            Visit website ↗
          </a>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="text-[11px] text-gray-400 tracking-[0.1em] uppercase font-semibold mb-3.5">
          Specialties
        </div>
        {rows.map((row, idx) => (
          <AsideRow key={row.label} label={row.label} value={row.value} last={idx === rows.length - 1} />
        ))}
        <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center gap-2 text-[12px] text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 12l2 2 4-4M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" />
          </svg>
          Verified by Infrabox
        </div>
      </div>
    </aside>
  );
}

// ─── Related partners ─────────────────────────────────────────────────────────

async function ProfileRelated({ partner }) {
  const grouped = await getPartners();
  const sameTier = (grouped[partner.tier] || []).filter((p) => p.slug !== partner.slug).slice(0, 4);
  const totalInTier = (grouped[partner.tier] || []).length;
  if (!sameTier.length) return null;
  const tierLabel = TIER_TOKENS[partner.tier]?.label || '';
  return (
    <section className="relative bg-white border-t border-gray-200 py-12">
      <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
      <div className="relative max-w-[1120px] mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-gray-900 m-0">
              More from {tierLabel}
            </h2>
            <p className="text-[13px] text-gray-500 mt-1">
              {totalInTier - 1} more partner{totalInTier - 1 === 1 ? '' : 's'} in this tier.
            </p>
          </div>
          <Link
            href="/partners"
            className="text-[13px] font-medium"
            style={{ color: BRAND_TEAL }}
          >
            Browse all {totalInTier} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {sameTier.map((r) => (
            <Link
              key={r.slug}
              href={`/partners/${r.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 min-h-[150px] hover:border-[#1240cc]/20 transition-colors"
              style={{ color: BRAND_DARK }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="w-8 h-8 flex items-center justify-center text-[12px] font-semibold overflow-hidden" aria-hidden="true" style={{ color: BRAND_DARK }}>
                  {r.logo_url ? (
                    <img src={r.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                  ) : (
                    (r.monogram || r.name.split(' ').map((w) => w[0]).slice(0, 2).join(''))
                  )}
                </div>
                <TierBadge tier={r.tier || partner.tier} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-semibold m-0 mb-1 truncate" style={{ color: BRAND_TEAL }}>
                  {r.name}
                </h4>
                <p className="text-[12px] text-gray-500 leading-[1.5] m-0 line-clamp-2">{r.tagline}</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="truncate">{r.location || 'Global'}</span>
                <span style={{ color: BRAND_TEAL }} className="group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bottom matchmaking CTA ───────────────────────────────────────────────────

function MatchmakingFooter() {
  return (
    <footer className="relative bg-white border-t border-gray-200 py-12">
      <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
      <div className="relative max-w-[1120px] mx-auto px-6 lg:px-8 text-center">
        <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-gray-900 m-0">
          Not sure who to pick?
        </h3>
        <p className="text-[14px] text-gray-500 max-w-[480px] mx-auto mt-2 mb-5 leading-relaxed">
          Tell us about your stage and goals. We&rsquo;ll match you with 2-3 partners who fit.
        </p>
        <Link
          href="/partners"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium text-white"
          style={{ background: BRAND_TEAL }}
        >
          Get matched <span aria-hidden="true">→</span>
        </Link>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PartnerProfilePage({ params }) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);
  if (!partner) notFound();
  const content = PROFILE_CONTENT[slug];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_BASE },
    { name: 'Partners', url: `${SITE_BASE}/partners` },
    { name: partner.name, url: `${SITE_BASE}/partners/${partner.slug}` },
  ]);

  const orgSchema = buildPartnerOrganizationSchema(partner);

  return (
    <PageLayout>
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbSchema} />
      <main className="bg-white min-h-screen">
        <ProfileBreadcrumbs partner={partner} />
        <ProfileHero partner={partner} content={content} />

        {/* Body: main column + sticky aside (white bg + dashed inner column borders continue from hero) */}
        <section className="relative bg-white">
          <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none" />
          <div className="relative max-w-[1120px] mx-auto px-6 lg:px-8 pt-10 pb-12 grid gap-12 items-start" style={{ gridTemplateColumns: 'minmax(0, 1fr) 320px' }}>
            <main className="min-w-0">
              <AboutSection partner={partner} content={content} />
              <ServicesSection partner={partner} />
              <ToolStackSection partner={partner} />
              <WebsiteScreenshotSection partner={partner} />
              <TestimonialsSection partner={partner} content={content} />
              <InlineContactSection partner={partner} />
              <InfraboxVerifiedSection />
            </main>
            <ProfileAside partner={partner} content={content} />
          </div>
        </section>

        {/* @ts-expect-error Async Server Component */}
        <ProfileRelated partner={partner} />
        <MatchmakingFooter />

        {/* ?calendar=true opens the Calendly modal */}
        <Suspense fallback={null}>
          <PartnerCalendarModal />
        </Suspense>
      </main>
    </PageLayout>
  );
}
