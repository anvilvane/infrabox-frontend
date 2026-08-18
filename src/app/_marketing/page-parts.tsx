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

export type HeroMetaItem = {
  /** Monospace key, e.g. "mailbox price". */
  label: string;
  /** The value. Numbers get `tabular` for free. */
  value: React.ReactNode;
};

/**
 * The hero's right-hand rail when a page has no bespoke aside: a spec sheet of
 * key/value rows. It is the same shape as the SMTP panel on /deliverability, so
 * a reader learns the pattern once — mono label on the left, fact on the right.
 */
export function HeroMeta({
  items,
  caption,
}: {
  items: HeroMetaItem[];
  /** Optional line under the sheet, for a caveat the facts need. */
  caption?: React.ReactNode;
}) {
  return (
    <div>
      <dl className="overflow-hidden rounded-md border border-border bg-card">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-baseline justify-between gap-5 border-b border-border px-5 py-3.5 last:border-b-0"
          >
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </dt>
            <dd className="tabular text-right text-sm font-medium leading-snug text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      {caption ? (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  children,
  aside,
  meta,
  metaCaption,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Optional right-hand column — a price card, a stat panel, a diagram. */
  aside?: React.ReactNode;
  /** Shorthand for the standard spec-sheet rail. Ignored when `aside` is set. */
  meta?: HeroMetaItem[];
  metaCaption?: React.ReactNode;
}) {
  const rail =
    aside ??
    (meta && meta.length ? <HeroMeta items={meta} caption={metaCaption} /> : null);

  return (
    <Section className="relative isolate overflow-hidden">
      {/* Faint brand texture so the first screen is a surface, not a blank page. */}
      <div
        aria-hidden
        className="dot-field-light pointer-events-none absolute inset-0 -z-10"
      />
      <Container
        className={cn(
          "py-16 lg:py-24",
          rail &&
            "grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-16",
        )}
      >
        <div className={cn(!rail && "max-w-3xl")}>
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
        {rail ? <div className="lg:pt-3">{rail}</div> : null}
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
  const isInk = tone === "ink";
  return (
    <Section
      tone={tone}
      divided
      aria-labelledby={headingId}
      className={cn(isInk && "ink-gradient relative isolate overflow-hidden")}
    >
      {isInk ? (
        <div
          aria-hidden
          className="dot-field pointer-events-none absolute inset-0 -z-10"
        />
      ) : null}
      <SectionShell index={index} label={label} tone={isInk ? "ink" : "default"}>
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          lede={lede}
          tone={isInk ? "ink" : "default"}
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

/* ------------------------------------------------------------------ steps */

export type StepItem = {
  /** Optional bold line. Omit for a sequence of plain clauses. */
  title?: React.ReactNode;
  body: React.ReactNode;
  /** Right-hand slot — a duration, a status, a measurement. */
  meta?: React.ReactNode;
};

/**
 * A numbered sequence with a drawn 1px connector running between the indices.
 * Three routes were each rendering their own flat list of numbered rows; this
 * is the one shape they share, so a step list looks the same everywhere on the
 * site and actually reads as a sequence rather than as a stack.
 */
export function Steps({
  items,
  tone = "default",
  className,
}: {
  items: StepItem[];
  /** `ink` recolours the rule and indices for a dark band. */
  tone?: "default" | "ink";
  className?: string;
}) {
  const isInk = tone === "ink";
  return (
    <ol className={cn("relative", className)}>
      {items.map((step, i) => {
        const last = i === items.length - 1;
        return (
          <li
            key={i}
            className={cn(
              "relative grid gap-x-6 gap-y-2 sm:grid-cols-[2.5rem_minmax(0,1fr)]",
              !last && "pb-9",
            )}
          >
            {/* The connector: from just under this index to the next one. */}
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[0.4375rem] top-6 hidden h-[calc(100%-1.25rem)] w-px sm:block",
                  isInk ? "bg-ink-border" : "bg-border",
                )}
              />
            ) : null}

            <span
              className={cn(
                "tabular relative z-10 font-mono text-[0.6875rem] uppercase tracking-[0.18em]",
                isInk ? "text-ink-accent" : "text-brand",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div
              className={cn(
                "grid gap-x-8 gap-y-2",
                step.meta && "lg:grid-cols-[minmax(0,1fr)_8rem]",
              )}
            >
              <div className="min-w-0">
                {step.title ? (
                  <h3
                    className={cn(
                      "text-[1.0625rem] font-semibold leading-snug",
                      isInk ? "text-ink-foreground" : "text-foreground",
                    )}
                  >
                    {step.title}
                  </h3>
                ) : null}
                <div
                  className={cn(
                    "max-w-2xl text-sm leading-relaxed",
                    step.title && "mt-2",
                    isInk ? "text-ink-foreground/75" : "text-muted-foreground",
                  )}
                >
                  {step.body}
                </div>
              </div>
              {step.meta ? (
                <div className="lg:pt-0.5 lg:text-right">{step.meta}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
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
 * Our column is the **full dark ground**, per DESIGN.md §0 — a tinted highlight
 * column is explicitly the thing we do not do. Every marker is paired with an
 * `sr-only` word, so the table reads correctly unseen, and the column carries
 * `on-ink` so a keyboard ring inside it stays visible.
 */
export function ComparisonTable({
  rows,
  theirsLabel,
  caption,
  footnote,
}: {
  rows: CompareRow[];
  theirsLabel: string;
  caption: string;
  /** The table's tail — a provenance line, so the figure has an edge and a foot. */
  footnote?: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <div className="-mx-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0">
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            <col className="w-[14rem]" />
            <col className="w-[36%]" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="pb-0 pr-6">
                <span className="sr-only">Criterion</span>
              </th>
              <th
                scope="col"
                className="on-ink rounded-t-md bg-ink px-5 pb-4 pt-5 align-bottom"
              >
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-accent">
                  ours
                </span>
                <span className="mt-1.5 block text-[0.9375rem] font-semibold text-ink-foreground">
                  Infrabox
                </span>
              </th>
              <th scope="col" className="px-5 pb-4 pt-5 align-bottom">
                <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                  the alternative
                </span>
                <span className="mt-1.5 block text-[0.9375rem] font-semibold text-foreground">
                  {theirsLabel}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.criterion} className="group align-top">
                <th
                  scope="row"
                  className="border-t border-border py-5 pr-6 text-left text-sm font-medium leading-snug text-foreground"
                >
                  {row.criterion}
                </th>
                <td
                  className={cn(
                    "on-ink border-t border-ink-border bg-ink px-5 py-5 leading-relaxed text-ink-foreground",
                    i === rows.length - 1 && "rounded-b-md",
                  )}
                >
                  <span className="flex items-start gap-2.5">
                    {row.verdict === "tradeoff" ? (
                      <>
                        <span
                          aria-hidden
                          className="mt-[0.6875rem] h-px w-3.5 shrink-0 bg-ink-muted"
                        />
                        <span className="sr-only">Trade-off:</span>
                      </>
                    ) : (
                      <>
                        <Check
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-ink-accent"
                        />
                        <span className="sr-only">Yes:</span>
                      </>
                    )}
                    <span>{row.ours}</span>
                  </span>
                </td>
                <td className="border-t border-border px-5 py-5 leading-relaxed text-muted-foreground transition-colors group-hover:bg-muted">
                  {row.theirs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote ? (
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {footnote}
        </p>
      ) : null}
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
  /*
   * Deliberately *not* `ink-gradient`: the site footer directly below this band
   * is flat ink, and a gradient that lightens toward its own bottom edge shows
   * a visible seam against it. The dot texture and the specular top rule carry
   * the band instead. Mid-page ink bands (`Band tone="ink"`) do get the
   * gradient, because white sits on both sides of them.
   */
  return (
    <Section
      tone="ink"
      divided
      aria-labelledby="cta-band-heading"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden
        className="dot-field pointer-events-none absolute inset-0 -z-10"
      />
      {/* The specular rule off the top face of the mark, closing the band. */}
      <div
        aria-hidden
        className="accent-edge pointer-events-none absolute inset-x-0 top-0 h-px"
      />
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
