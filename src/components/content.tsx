import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Eyebrow, Pill, Rails, Section } from "@/components/ui";

/*
 * The long-form layer: guides, the FAQ and the legal documents.
 *
 * These pages have a different job from the product pages — someone is reading
 * a thousand words rather than scanning a band — so they get their own layout:
 * a narrow reading measure with a sticky contents rail beside it. Everything
 * else is the site's own language as set out in DESIGN.md: the dashed rails,
 * 1px hairlines with no shadows, `rounded-xl` cards, fully-rounded pills, and
 * no colour that is not a token.
 */

/* ------------------------------------------------------------------ header */

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
    <Section>
      <Rails className="py-12 lg:py-16">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06]">
            {title}
          </h1>
          {lede ? (
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {lede}
            </p>
          ) : null}
          {pills ? (
            <div className="mt-6 flex flex-wrap items-center gap-2">{pills}</div>
          ) : null}
        </div>
      </Rails>
    </Section>
  );
}

export { Pill };

/* ----------------------------------------------------------- article shell */

export type TocEntry = { id: string; label: string };

/**
 * The reading layout. The body is capped at a measure rather than at the full
 * content column, and the contents list sits in the space that leaves — sticky
 * on wide screens, a collapsed `<details>` on narrow ones so it costs one line
 * instead of a screenful.
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
      <Rails
        className={cn(
          "border-t border-dashed border-border py-12 lg:py-16",
          hasRail &&
            "lg:grid lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:gap-12 xl:gap-16",
        )}
      >
        <div className="max-w-[42rem] min-w-0">{children}</div>

        {hasRail ? (
          <div className="mt-12 lg:order-first lg:mt-0 lg:col-start-2 lg:row-start-1">
            <div className="lg:sticky lg:top-24">
              {toc?.length ? <Toc entries={toc} /> : null}
              {aside ? <div className="mt-6">{aside}</div> : null}
            </div>
          </div>
        ) : null}
      </Rails>
    </Section>
  );
}

function TocList({ entries }: { entries: TocEntry[] }) {
  return (
    <ul className="space-y-2.5 border-l border-dashed border-border pl-4">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            className="block text-xs leading-snug text-muted-foreground transition-colors hover:text-brand"
          >
            {entry.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Toc({ entries }: { entries: TocEntry[] }) {
  return (
    <nav aria-label="On this page">
      {/* Narrow screens: collapsed, and it works without JavaScript. */}
      <details className="rounded-xl border border-border bg-muted/50 p-4 lg:hidden">
        <summary className="font-display cursor-pointer text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          On this page
        </summary>
        <div className="mt-4">
          <TocList entries={entries} />
        </div>
      </details>

      <div className="hidden lg:block">
        <h2 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          On this page
        </h2>
        <div className="mt-4">
          <TocList entries={entries} />
        </div>
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
 * List markers are short brand hairlines rather than dots, to match the site's
 * rule-and-hairline language instead of introducing a second kind of mark.
 */
export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-none text-base leading-[1.75] text-muted-foreground",
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
        "[&>h2]:mt-12 [&>h2]:scroll-mt-28 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-foreground",
        "[&>h3]:mt-9 [&>h3]:scroll-mt-28 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-foreground",
        "[&>h2+p]:mt-3 [&>h3+p]:mt-2",
        // Flow.
        "[&>p]:mt-5 [&>ul]:mt-5 [&>ol]:mt-5 [&>ul]:space-y-3 [&>ol]:space-y-3",
        // Unordered: a short brand rule instead of a bullet.
        "[&>ul>li]:relative [&>ul>li]:pl-6",
        "[&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[0.85em] [&>ul>li]:before:h-px [&>ul>li]:before:w-3 [&>ul>li]:before:bg-brand/45",
        // Ordered: real numbers, in the display face.
        "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:pl-1.5 [&>ol>li]:marker:font-display [&>ol>li]:marker:text-sm [&>ol>li]:marker:font-semibold [&>ol>li]:marker:text-brand/70",
        // Emphasis and links.
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/30 [&_a]:underline-offset-[3px] hover:[&_a]:decoration-brand",
        // Inline code.
        "[&_code]:rounded-md [&_code]:border [&_code]:border-border [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground",
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
 * An aside inside prose. The left brand rule is the whole treatment — no fill
 * change, no icon, no second border colour. A page with five of these should
 * still read as one page.
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
        "mt-8 rounded-xl border border-border bg-muted/50 p-5 text-sm leading-relaxed",
        "border-l-2",
        tone === "warn" ? "border-l-warning-foreground/50" : "border-l-brand",
      )}
    >
      {title ? (
        <p className="font-display text-sm font-semibold text-foreground">
          {title}
        </p>
      ) : null}
      <div className={cn("space-y-3 text-muted-foreground", title && "mt-2")}>
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
 * the business still have to fill in.
 */
export function Pending({ children }: { children?: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-baseline rounded-full border border-dashed border-warning-foreground/45 bg-warning/60 px-2 py-px font-mono text-[0.78em] font-medium text-warning-foreground">
      {children ?? "pending"}
    </span>
  );
}

/* -------------------------------------------------------------- code block */

/**
 * Fixed-width block for DNS records, SMTP transcripts and settings. No syntax
 * highlighting: none of what goes in here is a programming language, and
 * colouring it would imply a structure that is not there.
 */
export function CodeBlock({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <figure className="mt-6">
      {label ? (
        <figcaption className="font-display mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto rounded-xl border border-border bg-muted/60 px-5 py-4 text-[0.8125rem] leading-relaxed text-foreground">
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
    <div className="mt-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
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
        "font-display border-b border-border bg-muted/50 px-4 py-3 align-bottom text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground",
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
        "border-b border-dashed border-border px-4 py-3 align-top leading-relaxed text-muted-foreground last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------- cards */

/** Card matching the site's FeatureCard rhythm, but as a whole-card link. */
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
  // Not a <Card> wrapping a <Link>: the whole card is the hit target, so the
  // link *is* the card, and it carries Card's own classes.
  return (
    <Link
      href={href}
      className="group flex w-full flex-col rounded-xl border border-border bg-card p-5 text-card-foreground transition-colors hover:border-brand/25"
    >
      {kicker ? (
        <span className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {kicker}
        </span>
      ) : null}
      <h3
        className={cn(
          "text-sm font-semibold text-foreground transition-colors group-hover:text-brand",
          kicker && "mt-2",
        )}
      >
        {title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {children}
      </p>
    </Link>
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
        className="group flex flex-col gap-1.5 border-b border-dashed border-border py-5"
      >
        <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-display text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
            {title}
          </span>
          {badge ? (
            <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
              {badge}
            </span>
          ) : null}
        </span>
        {children ? (
          <span className="text-xs leading-relaxed text-muted-foreground">
            {children}
          </span>
        ) : null}
      </Link>
    </li>
  );
}
