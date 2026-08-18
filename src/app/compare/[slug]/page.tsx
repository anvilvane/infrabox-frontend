import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Rails, Section } from "@/components/ui";
import {
  ArrowLink,
  Band,
  ComparisonTable,
  CtaBand,
  FaqList,
  InlineLink,
  Tile,
} from "@/app/_marketing/page-parts";
import { MAILBOX_PRICE_USD, SITE_URL, usd } from "@/lib/product";
import { COMPARISONS, getComparison } from "../comparisons";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getComparison(slug);
  if (!entry) return {};
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    alternates: { canonical: `/compare/${entry.slug}` },
    openGraph: {
      title: `${entry.metaTitle} · Infrabox`,
      description: entry.metaDescription,
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry = getComparison(slug);
  if (!entry) notFound();

  const others = COMPARISONS.filter((c) => c.slug !== entry.slug);
  const lowerApproach = entry.approach.toLowerCase();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Compare",
          item: `${SITE_URL}/compare`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: entry.metaTitle,
          item: `${SITE_URL}/compare/${entry.slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entry.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ------------------------------------------------------------ hero */}
      <Section>
        <Rails className="py-12 lg:py-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/compare" className="hover:text-brand">
                  Compare
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{entry.approach}</li>
            </ol>
          </nav>

          <h1 className="mt-6 max-w-3xl text-[clamp(2rem,5.5vw,3.25rem)] font-semibold leading-[1.06] text-foreground">
            {entry.headline}
          </h1>

          <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {entry.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Rails>
      </Section>

      {/* -------------------------------------------------- what it involves */}
      <Band
        id="involves" index="01" label="the approach"
        eyebrow="The other approach, fairly"
        title={`What ${lowerApproach} actually involves.`}
        lede="Described properly, not caricatured. If this list looks straightforward to you, that is a real signal about which column you belong in."
      >
        <ol className="mt-10 max-w-3xl grid gap-3">
          {entry.whatItInvolves.map((item, i) => (
            <li
              key={item}
              className="grid gap-x-5 gap-y-1.5 rounded-md border border-border bg-card p-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
            >
              <span className="tabular font-mono text-sm text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item}
              </p>
            </li>
          ))}
        </ol>
      </Band>

      {/* --------------------------------------------------------- the table */}
      <Band
        id="table" index="02" label="side by side"
        eyebrow="Side by side"
        title="The comparison itself."
        lede="A dash instead of a tick means the row is a trade-off rather than a win — the two approaches simply differ, and which side you want depends on you."
        tone="muted"
      >
        <ComparisonTable
          rows={entry.rows}
          theirsLabel={entry.approach}
          caption={`${entry.headline}: a criterion-by-criterion comparison`}
        />
      </Band>

      {/* ------------------------------------------------------- better when */}
      <Band
        id="better-when" index="03" label="where we lose"
        eyebrow="Where we lose"
        title={`When ${lowerApproach} is the right answer.`}
        lede="Every comparison page should have this section and almost none do. These are the cases where we would tell you not to buy from us."
      >
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {entry.betterWhen.map((item) => (
            <Tile key={item.title} title={item.title}>
              {item.body}
            </Tile>
          ))}
        </div>

        <div className="mt-8 max-w-2xl rounded-md border border-border bg-brand-tint p-5">
          <h3 className="text-sm font-semibold text-foreground">
            The bottom line
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {entry.bottomLine}
          </p>
        </div>
      </Band>

      {/* ---------------------------------------------------------- pricing */}
      <Section divided aria-labelledby="price-note-heading">
        <Rails className="py-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2
                id="price-note-heading"
                className="text-2xl font-semibold leading-[1.15] text-foreground"
              >
                Our side of it costs{" "}
                <span className="tabular">{usd(MAILBOX_PRICE_USD)}</span> per
                mailbox per month.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Plus the domain, priced per TLD per year. That is the entire
                price list — no provisioning fee, no onboarding fee, no volume
                tier to negotiate.{" "}
                <InlineLink href="/pricing/calculator">
                  Put your own numbers in
                </InlineLink>
                .
              </p>
            </div>
            <ArrowLink href="/pricing">See the full price list</ArrowLink>
          </div>
        </Rails>
      </Section>

      {/* --------------------------------------------------------------- faq */}
      <Band id="compare-faq" index="04" label="questions" eyebrow="Questions" title="On this comparison.">
        <FaqList items={entry.faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
      </Band>

      {/* ------------------------------------------------------ keep reading */}
      <Section divided aria-labelledby="more-heading">
        <Rails className="py-12">
          <h2 id="more-heading" className="text-lg font-semibold text-foreground">
            The other comparisons
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/compare/${c.slug}`}
                  className="group flex h-full flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-brand/25 hover:bg-muted"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-brand">
                    {c.cardTitle}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {c.cardBody}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                    Read it
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Rails>
      </Section>

      <CtaBand
        title="Think you are on our side of the table?"
        body="Tell us how many mailboxes across how many domains, and which tool you send with. If one of the other approaches suits you better, we will say that instead."
        secondary={{ href: "/how-it-works", label: "How it works" }}
      />
    </>
  );
}
