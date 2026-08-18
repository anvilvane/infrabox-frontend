import { ArrowRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Pill,
  Section,
} from "@/components/ui";

/*
 * The long-form layer: guides, the FAQ and the legal documents.
 *
 * These pages have a different job from the product pages — someone is reading
 * a thousand words rather than scanning a band — so they get their own layout:
 * a capped reading measure with a numbered contents rail beside it.
 *
 * The vocabulary is the site's own, as set out in DESIGN.md: 4px radius, 1px
 * hairlines and never a shadow, flush rows rather than floating cards, every
 * label and index in monospace, and no colour that is not a token. There are
 * no dashed rules and no pills here — both belong to the reference site's
 * language, not ours.
 */

/* ------------------------------------------------------------------ header */

/**
 * The masthead of a long-form page: mono kicker, the title at display size, a
 * lede at a slightly larger measure than body copy, and a meta strip closed by
 * a hairline so the header has a floor rather than dissolving into the body.
 */
export function ArticleHeader({
  eyebrow,
  title,
  lede,
  pills,
}: {
  eyebrow: string;
  title: string;
  lede?: React.ReactNode;
  /** Short factual labels — topic, reading time, document status. */
  pills?: React.ReactNode;
}) {
  return (
    <Section className="relative overflow-hidden">
      <div aria-hidden className="dot-field-light absolute inset-0" />
      <Container className="relative pt-14 pb-11 lg:pt-20 lg:pb-14">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-[clamp(2.125rem,4.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            {title}
          </h1>
          {lede ? (
            <p className="mt-5 max-w-[38rem] text-[1.0625rem] leading-[1.65] text-muted-foreground">
              {lede}
            </p>
          ) : null}
        </div>
        {pills ? (
          <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5">
            {pills}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

export { Pill };

/* ----------------------------------------------------------- article shell */

export type TocEntry = { id: string; label: string };

/**
 * The reading layout.
 *
 * The body is capped at a measure (~68 characters) rather than at the full
 * content column, and the rail takes a fixed width and is pushed to the right
 * edge of the column — so the slack lands in the gutter between the two, where
 * it reads as a gutter, instead of trailing off the right-hand side.
 *
 * The contents are passed in rather than derived: nothing here parses the
 * children looking for headings, because a layout that silently drops an entry
 * when a heading is nested one level deeper is worse than one you have to keep
 * in step by hand.
 */
export function Article({
  toc,
  children,
  aside,
}: {
  toc?: TocEntry[];
  children: React.ReactNode;
  /** Optional extra block under the contents list. */
  aside?: React.ReactNode;
}) {
  const hasRail = Boolean(toc?.length || aside);

  return (
    <Section>
      <Container
        className={cn(
          "border-t border-border py-12 lg:py-16",
          hasRail &&
            "lg:grid lg:grid-cols-[minmax(0,40rem)_14rem] lg:justify-between lg:gap-12",
        )}
      >
        <div className="max-w-[40rem] min-w-0">{children}</div>

        {hasRail ? (
          <div className="mt-14 lg:order-first lg:col-start-2 lg:row-start-1 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              {toc?.length ? <Toc entries={toc} /> : null}
              {aside ? (
                <div className={cn(toc?.length && "mt-10")}>{aside}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

/** Legal sections arrive already numbered ("3. Measurement"); the rail draws
 *  its own index, so the one in the label would be printed twice. */
const LEADING_INDEX = /^\s*\d+[.)]\s+/;

/** The mono label that heads a rail block. */
export function RailLabel({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TocList({ entries }: { entries: TocEntry[] }) {
  return (
    <ol className="mt-4 border-t border-border">
      {entries.map((entry, i) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            className="group flex gap-3 border-b border-border py-2.5 text-[0.8125rem] leading-snug text-muted-foreground transition-colors hover:text-brand"
          >
            <span
              aria-hidden
              className="tabular mt-px shrink-0 font-mono text-[0.6875rem] text-brand/60 transition-colors group-hover:text-brand"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              {entry.label.replace(LEADING_INDEX, "")}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function Toc({ entries }: { entries: TocEntry[] }) {
  return (
    <nav aria-label="On this page">
      {/* Narrow screens: collapsed, and it works without JavaScript. */}
      <details className="disclosure group rounded-md border border-border bg-muted/60 px-4 py-3 lg:hidden">
        <summary className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
          <span
            aria-hidden
            className="disclosure-caret text-brand transition-transform duration-200"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3l5 5-5 5" />
            </svg>
          </span>
          On this page
        </summary>
        <div className="pb-1">
          <TocList entries={entries} />
        </div>
      </details>

      <div className="hidden lg:block">
        <RailLabel>On this page</RailLabel>
        <TocList entries={entries} />
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------- prose */

/**
 * Body copy for long-form pages. Tailwind here has no typography plugin, so
 * the element rules are declared once, in one place, with child selectors —
 * which keeps every guide and every legal clause on the same scale without
 * adding a dependency.
 *
 * Two decisions carry the readability of the whole layer. Body copy is set in
 * near-black rather than the muted grey used for one-line ledes: a thousand
 * words of #4f6570 reads washed out, and DESIGN.md §1 asks for a near-black
 * slate on white. And every `h2` opens with a full-measure hairline, so a long
 * document reads as a run of banded sections rather than one grey column.
 *
 * List markers are short brand hairlines rather than dots, to match the site's
 * rule-and-hairline language instead of introducing a second kind of mark.
 */
export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-none text-[1.0625rem] leading-[1.75] text-foreground/85",
        // The first block in a Prose never carries a top margin — the layout
        // above it already set the gap. `!` because it has to beat the flow
        // rules below, which match at the same specificity.
        "[&>*:first-child]:mt-0!",
        //
        // Flow rules are DIRECT-CHILD selectors (`[&>h2]`, not `[&_h2]`) on
        // purpose. A descendant selector would also restyle the heading inside
        // a Callout or a footer nav, and those bring their own spacing — which
        // is how a "why is there a huge gap in my aside" bug happens.
        //
        // Headings pick up font-display and tracking from globals.css.
        "[&>h2]:mt-14 [&>h2]:border-t [&>h2]:border-border [&>h2]:pt-8 [&>h2]:scroll-mt-28 [&>h2]:text-[1.5rem] [&>h2]:font-semibold [&>h2]:leading-[1.2] [&>h2]:text-foreground",
        // …but the rule is a separator, so the first heading on the page does
        // not get one — there is nothing above it to separate from.
        "[&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0",
        "[&>h3]:mt-10 [&>h3]:scroll-mt-28 [&>h3]:text-[1.125rem] [&>h3]:font-semibold [&>h3]:text-foreground",
        "[&>h2+p]:mt-4 [&>h3+p]:mt-3 [&>h2+ol]:mt-5 [&>h2+ul]:mt-5",
        // Flow.
        "[&>p]:mt-5 [&>ul]:mt-6 [&>ol]:mt-6 [&>ul]:space-y-3.5 [&>ol]:space-y-3.5",
        // Unordered: a short brand rule instead of a bullet.
        "[&>ul>li]:relative [&>ul>li]:pl-6",
        "[&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[0.85em] [&>ul>li]:before:h-px [&>ul>li]:before:w-3 [&>ul>li]:before:bg-brand/60",
        // Ordered: real numbers, in the display face.
        "[&>ol]:list-decimal [&>ol]:pl-7 [&>ol>li]:pl-2 [&>ol>li]:marker:font-mono [&>ol>li]:marker:text-[0.8125rem] [&>ol>li]:marker:font-medium [&>ol>li]:marker:text-brand/70",
        // Emphasis and links.
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/30 [&_a]:underline-offset-[3px] hover:[&_a]:decoration-brand",
        // Inline code.
        "[&_code]:rounded-sm [&_code]:border [&_code]:border-border [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.82em] [&_code]:text-foreground",
        // ...but a <code> inside a <pre> is the block itself, not a chip.
        "[&_pre_code]:rounded-none [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
        className,
      )}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- notices */

/**
 * An aside inside prose. A hairline box with a 2px edge on the left, and that
 * edge is the whole treatment — no fill change between tones, no icon, no
 * label, no second border colour. Two of these stacked should read as two
 * asides, not as a page shouting twice.
 */
export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: "note" | "warn";
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-8 rounded-md border border-l-2 border-border bg-muted/60 px-5 py-4 text-[0.9375rem] leading-relaxed",
        tone === "warn" ? "border-l-warning-foreground/60" : "border-l-brand",
      )}
    >
      {title ? (
        <p className="font-display text-[0.9375rem] font-semibold text-foreground">
          {title}
        </p>
      ) : null}
      <div
        className={cn("space-y-3 text-foreground/80", title && "mt-2")}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A value the source draft left as an open decision.
 *
 * We render the gap rather than the draft's suggested number: printing a
 * placeholder threshold as though it were policy would be publishing a
 * commitment nobody has made. Every one of these is a blank that counsel and
 * the business still have to fill in — which is why it is drawn as a dashed
 * blank. It is the one dashed rule on the site, and it means something.
 */
export function Pending({ children }: { children?: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-baseline rounded-sm border border-dashed border-warning-foreground/50 bg-warning/70 px-1.5 py-px font-mono text-[0.72em] uppercase tracking-[0.06em] text-warning-foreground">
      {children ?? "pending"}
    </span>
  );
}

/* -------------------------------------------------------------- code block */

/**
 * Fixed-width block for DNS records, SMTP transcripts and settings. No syntax
 * highlighting: none of what goes in here is a programming language, and
 * colouring it would imply a structure that is not there.
 *
 * The label sits inside the frame, on a muted bar above the record, so a page
 * of DNS records reads as a set of labelled specimens rather than as grey
 * boxes with captions floating above them.
 */
export function CodeBlock({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <figure className="mt-7 overflow-hidden rounded-md border border-border">
      {label ? (
        <figcaption className="border-b border-border bg-muted px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto bg-card px-4 py-3.5 text-[0.8125rem] leading-[1.7] text-foreground">
        <code className="font-mono">{children}</code>
      </pre>
    </figure>
  );
}

/* ------------------------------------------------------------------ tables */

/** Wide tables scroll inside themselves. The page body never scrolls sideways. */
export function TableScroll({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7 overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[30rem] border-collapse text-left text-[0.875rem] [&>tbody>tr:last-child>td]:border-b-0">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-border bg-muted px-4 py-2.5 align-bottom font-mono text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "border-b border-border px-4 py-3 align-top leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------- cells */

/**
 * A flush sheet of link cells: one 1px grid, cells sitting on it, no gaps and
 * no floating cards. `LinkCard`s go inside it.
 */
export function CardGrid({
  columns = 2,
  className,
  ...props
}: React.ComponentProps<"ul"> & { columns?: 2 | 3 }) {
  return (
    <ul
      className={cn(
        "cell-grid rounded-md",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      {...props}
    />
  );
}

/**
 * One cell in a `CardGrid`, linked whole. Not a `<Card>` wrapping a `<Link>`:
 * the entire cell is the hit target, so the link *is* the cell.
 */
export function LinkCard({
  href,
  title,
  kicker,
  children,
}: {
  href: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex">
      <Link
        href={href}
        className="group flex w-full flex-col bg-card p-6 text-card-foreground transition-colors hover:bg-brand-tint"
      >
        {kicker ? (
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            {kicker}
          </span>
        ) : null}
        <h3
          className={cn(
            "text-[0.9375rem] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand",
            kicker && "mt-3",
          )}
        >
          {title}
        </h3>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {children}
        </p>
        <span
          aria-hidden
          className="mt-5 h-px w-6 bg-brand/40 transition-all duration-200 group-hover:w-12 group-hover:bg-brand"
        />
      </Link>
    </li>
  );
}

/** A row in a plain hairline list of links — used for the legal index. */
export function LinkRow({
  href,
  title,
  badge,
  children,
}: {
  href: string;
  title: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex flex-col gap-1.5 border-b border-border py-5 transition-colors"
      >
        <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-display text-[0.9375rem] font-semibold text-foreground transition-colors group-hover:text-brand">
            {title}
          </span>
          {badge ? (
            <span className="inline-flex items-center rounded-sm border border-border px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
              {badge}
            </span>
          ) : null}
          <span
            aria-hidden
            className="ml-auto h-px w-6 bg-border transition-all duration-200 group-hover:w-10 group-hover:bg-brand"
          />
        </span>
        {children ? (
          <span className="max-w-[46rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
            {children}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/* --------------------------------------------------------------- closing */

/**
 * The band that closes a content page. The same dark ground and specular edge
 * as the homepage's closing band, at two-thirds the height — a content page
 * should end somewhere rather than trailing into the footer, but it is not the
 * place to shout.
 */
export function ContentCta({
  title = "Tell us what you need to send.",
  children,
  id = "content-cta",
}: {
  title?: string;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <Section
      tone="ink"
      aria-labelledby={id}
      className="ink-gradient relative overflow-hidden"
    >
      <div aria-hidden className="dot-field absolute inset-0" />
      <div aria-hidden className="accent-edge absolute inset-x-0 top-0 h-px" />
      <Container className="relative flex flex-col gap-8 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-16">
        <div className="max-w-xl">
          <Eyebrow tone="ink">Next</Eyebrow>
          <h2
            id={id}
            className="mt-4 text-[1.75rem] font-semibold leading-[1.1] text-ink-foreground sm:text-[2.125rem]"
          >
            {title}
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-foreground/70">
            {children ??
              "How many mailboxes, on how many domains, and which tool you send with. We will tell you what it costs and what the pipeline will do with it."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <ButtonLink href="/get-started" variant="inverse">
            Get started
            <ArrowRight aria-hidden />
          </ButtonLink>
          <ButtonLink href="/pricing" variant="outlineInverse">
            See pricing
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
