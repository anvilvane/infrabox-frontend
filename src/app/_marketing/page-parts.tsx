/**
 * Page parts for the product, pricing and comparison routes.
 *
 * DESIGN.md owns the look and `@/components/ui` owns the primitives. This file
 * only composes them into the three shapes those two do not already provide —
 * a page hero, the comparison table and the closing CTA band — plus two list
 * shapes and an inline link.
 *
 * Nothing here declares a colour, a font or a radius; everything resolves to
 * tokens. It sits under `src/app/_marketing/` because the leading underscore
 * stops the App Router treating it as a route.
 */

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import * as React from "react";

import {
  ButtonLink,
  Cell,
  CellGrid,
  Container,
  Disclosure,
  Eyebrow,
  Section,
  SectionHeading,
  SectionShell,
} from "@/components/ui";

/** Re-exported so a page imports its links from one place. */
export { ArrowLink } from "@/components/ui";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------- hero */

export function PageHero({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Optional right-hand column — a price card, a stat panel, a diagram. */
  aside?: React.ReactNode;
}) {
  return (
    <Section>
      <Container
        className={cn(
          "py-16 lg:py-24",
          aside && "grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16",
        )}
      >
        <div className={cn(!aside && "max-w-3xl")}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.04]">
            {title}
          </h1>
          {children ? (
            <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
              {children}
            </div>
          ) : null}
        </div>
        {aside ? <div className="lg:pt-3">{aside}</div> : null}
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------------- band */

/**
 * A standard content band: a hairline rule above it, the numbered gutter from
 * `SectionShell`, and a `SectionHeading` wired to the section's own label.
 */
export function Band({
  id,
  index,
  label,
  eyebrow,
  title,
  lede,
  tone = "default",
  children,
}: {
  id: string;
  /** Two-digit gutter index, e.g. "02". */
  index: string;
  /** Short lowercase gutter label, e.g. "pricing". */
  label: string;
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: "default" | "muted" | "ink";
  children?: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <Section tone={tone} divided aria-labelledby={headingId}>
      <SectionShell
        index={index}
        label={label}
        tone={tone === "ink" ? "ink" : "default"}
      >
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          lede={lede}
          tone={tone === "ink" ? "ink" : "default"}
        />
        {children}
      </SectionShell>
    </Section>
  );
}

/* ------------------------------------------------------------------ cells */

/**
 * Thin aliases over the shared cell grid, so these routes use the same flush
 * hairline sheet as the homepage without every page importing three names.
 */
export function TileGrid({
  columns = 3,
  className,
  children,
}: {
  columns?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <CellGrid columns={columns} className={className}>
      {children}
    </CellGrid>
  );
}

export function Tile({
  title,
  index,
  children,
  className,
}: {
  title: React.ReactNode;
  /** Optional zero-based position, rendered as a mono ordinal. */
  index?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Cell className={cn("flex flex-col", className)}>
      {typeof index === "number" ? (
        <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-brand">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
      <h3
        className={cn(
          "text-[0.9375rem] font-semibold leading-snug",
          typeof index === "number" && "mt-3",
        )}
      >
        {title}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </Cell>
  );
}

/* ------------------------------------------------------------------ strip */

/**
 * A short two-column cross-link row: a heading on the left, a sentence or a
 * link on the right. Lighter than a full `Band`, for pointing somewhere else.
 */
export function Strip({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <Section divided aria-labelledby={headingId}>
      <Container className="grid gap-6 py-12 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-12">
        <h2 id={headingId} className="text-lg font-semibold">
          {heading}
        </h2>
        <div className="leading-relaxed text-muted-foreground">{children}</div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------- checklist */

export function CheckList({
  items,
  columns = 1,
  className,
}: {
  items: React.ReactNode[];
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2 sm:gap-x-8",
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
          <span className="leading-relaxed text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** The same shape for a column of failure modes — no tick, no implied verdict. */
export function DotList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <span
            aria-hidden
            className="mt-[0.4375rem] size-1.5 shrink-0 rounded-full bg-muted-foreground/50"
          />
          <span className="leading-relaxed text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------- comparison table */

export type CompareRow = {
  criterion: string;
  /** What Infrabox does. A statement about our own product. */
  ours: string;
  /** What the other approach involves. Never a claim about a named vendor. */
  theirs: string;
  /**
   * `tradeoff` means the row is a genuine difference rather than a win. It
   * changes the marker *and* the screen-reader text, never colour alone.
   */
  verdict?: "advantage" | "tradeoff";
};

/**
 * Our column is tinted with `brand-tint`, per DESIGN.md. Every marker is
 * paired with an `sr-only` word, so the table reads correctly unseen.
 */
export function ComparisonTable({
  rows,
  theirsLabel,
  caption,
}: {
  rows: CompareRow[];
  theirsLabel: string;
  caption: string;
}) {
  return (
    <div className="-mx-5 mt-10 overflow-x-auto px-5 sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0">
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="w-[15rem]" />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="pb-3 pr-6">
              <span className="sr-only">Criterion</span>
            </th>
            <th
              scope="col"
              className="rounded-t-md bg-brand-tint px-5 pb-3 pt-4 text-sm font-semibold text-foreground"
            >
              Infrabox
            </th>
            <th
              scope="col"
              className="px-5 pb-3 pt-4 text-sm font-semibold text-muted-foreground"
            >
              {theirsLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.criterion} className="align-top">
              <th
                scope="row"
                className="border-t border-border py-4 pr-6 text-left text-sm font-medium text-foreground"
              >
                {row.criterion}
              </th>
              <td
                className={cn(
                  "border-t border-border/50 bg-brand-tint px-5 py-4 leading-relaxed text-foreground",
                  i === rows.length - 1 && "rounded-b-md",
                )}
              >
                <span className="flex items-start gap-2.5">
                  {row.verdict === "tradeoff" ? (
                    <>
                      <span
                        aria-hidden
                        className="mt-2 h-px w-3.5 shrink-0 bg-muted-foreground"
                      />
                      <span className="sr-only">Trade-off:</span>
                    </>
                  ) : (
                    <>
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-brand"
                      />
                      <span className="sr-only">Yes:</span>
                    </>
                  )}
                  <span>{row.ours}</span>
                </span>
              </td>
              <td className="border-t border-border px-5 py-4 leading-relaxed text-muted-foreground">
                {row.theirs}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------- FAQ */

export type FaqItem = { q: string; a: React.ReactNode };

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-10 border-t border-border">
      {items.map((item) => (
        <Disclosure key={item.q} question={item.q}>
          <div className="space-y-3">{item.a}</div>
        </Disclosure>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- CTA band */

export function CtaBand({
  title,
  body,
  href = "/get-started",
  label = "Get started",
  secondary,
}: {
  title: string;
  body: string;
  href?: string;
  label?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <Section tone="ink" divided aria-labelledby="cta-band-heading">
      <Container className="py-16 lg:py-24">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2
              id="cta-band-heading"
              className="text-3xl font-semibold leading-[1.08] text-ink-foreground sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              {body}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={href} variant="inverse" size="lg">
              {label}
              <ArrowRight aria-hidden />
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="outlineInverse" size="lg">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ------------------------------------------------------------ inline link */

export function InlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand"
    >
      {children}
    </Link>
  );
}
