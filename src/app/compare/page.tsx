import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Rails, Section } from "@/components/ui";
import {
  Band,
  CtaBand,
  InlineLink,
  PageHero,
} from "@/app/_marketing/page-parts";
import { SITE_URL } from "@/lib/product";
import { COMPARISONS } from "./comparisons";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "How Infrabox compares to doing it by hand, to a generic SMTP relay, and to buying Google Workspace seats directly — including the cases where the other approach wins.",
  alternates: { canonical: "/compare" },
};

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
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Infrabox comparisons",
    itemListElement: COMPARISONS.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.cardTitle,
      url: `${SITE_URL}/compare/${c.slug}`,
    })),
  },
];

export default function ComparePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero eyebrow="Compare" title="Compared with what, exactly?">
        <p>
          There are three real ways to get cold-email sending infrastructure:
          build it by hand, push messages through a relay, or buy Workspace
          seats and configure them yourself. Each page below takes one of those
          seriously — including the part where it beats us.
        </p>
      </PageHero>

      <Band
        id="comparisons" index="01" label="comparisons"
        title="The three comparisons."
        lede="Approaches rather than brands, for a reason we would rather state than leave you to infer."
      >
        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {COMPARISONS.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/compare/${c.slug}`}
                className="group flex h-full flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-brand/25 hover:bg-muted"
              >
                <span className="tabular font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-brand">
                  {c.cardTitle}
                </h3>
                <p className="mt-2.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {c.cardBody}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                  Read the comparison
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <Band
        id="why-no-names" index="02" label="editorial note"
        eyebrow="Editorial note"
        title="Why there are no competitor names on these pages."
        tone="muted"
      >
        <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-muted-foreground">
          <p>
            Because we would have to make things up. We know exactly what our
            own product does — we wrote it, and every number on this site cites
            the file it came from. We do not know what a competitor shipped last
            week, what their price is after a negotiation, or which of the boxes
            in their feature list are ticked today.
          </p>
          <p>
            A comparison table where one column is verified and the other is
            guesswork is not a comparison. So the other column here describes a
            method; every claim in it is either definitional or a statement
            about our own product, and none of it asserts anything about
            somebody else&rsquo;s software.
          </p>
          <p>
            The trade-off is that these pages are less satisfying than a
            scoreboard. We think that is the correct trade-off.
          </p>
        </div>
      </Band>

      <Section divided aria-labelledby="elsewhere-heading">
        <Rails className="py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <h2
              id="elsewhere-heading"
              className="text-lg font-semibold text-foreground"
            >
              Rather see the product?
            </h2>
            <p className="leading-relaxed text-muted-foreground md:col-span-2">
              The <InlineLink href="/how-it-works">eight steps</InlineLink> are
              the whole mechanism, with the typical duration of each.{" "}
              <InlineLink href="/deliverability">
                Authentication and deliverability
              </InlineLink>{" "}
              covers what the DNS records do and where we stop making claims.{" "}
              <InlineLink href="/pricing">Pricing</InlineLink> is two line
              items, and the{" "}
              <InlineLink href="/pricing/calculator">calculator</InlineLink>{" "}
              will put your numbers into them.
            </p>
          </div>
        </Rails>
      </Section>

      <CtaBand
        title="Still not sure which of these you are?"
        body="Tell us what you are sending, how much of it, and what you have already tried. If the answer is one of the other three approaches, we will say so."
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
