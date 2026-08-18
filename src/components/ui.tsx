import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * ============================================================================
 * Shared primitives
 * ============================================================================
 *
 * Every route on this site is built out of these. They encode the decisions
 * documented in DESIGN.md — square corners, hairline flush cells, a monospace
 * index in the left gutter, one brand hue — so a page author never re-invents
 * them and the pages cannot drift apart. A new visual idea belongs here, not
 * in a page file.
 *
 * No radix, no client components: the marketing site has no dialogs, menus or
 * comboboxes, and its one interactive widget (the FAQ) is a <details>.
 * ============================================================================
 */

/* -------------------------------------------------------------- structure */

/**
 * The content column. One max width for the entire site, so the header,
 * sections and footer all line up on the same two edges.
 */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-7 lg:px-10", className)}
      {...props}
    />
  );
}

/**
 * @deprecated Kept only so older imports keep compiling. It is now a plain
 * `Container`; the site no longer draws vertical rails. Use `Container`.
 */
export const Rails = Container;

/**
 * A full-bleed band.
 *
 * - `default` — white
 * - `muted`   — the pale neutral, for alternating a section out of the flow
 * - `ink`     — the dark brand ground; also adds `on-ink`, which flips the
 *               keyboard focus ring to a light colour
 *
 * Sections are separated by a single hairline at the top, drawn edge to edge.
 */
export function Section({
  tone = "default",
  divided = false,
  className,
  ...props
}: React.ComponentProps<"section"> & {
  tone?: "default" | "muted" | "ink";
  /** Draw the hairline that separates this band from the one above. */
  divided?: boolean;
}) {
  return (
    <section
      className={cn(
        tone === "ink" && "on-ink bg-ink text-ink-foreground",
        tone === "muted" && "bg-muted",
        divided && (tone === "ink" ? "border-t border-ink-border" : "border-t border-border"),
        className,
      )}
      {...props}
    />
  );
}

/**
 * The standard section shell: a two-column frame whose narrow left gutter
 * carries a monospace index (`01`, `02`, …) and the section's short name,
 * turned on its side on wide screens. It is the site's structural signature —
 * a spec sheet rather than a stack of centred bands.
 *
 * On narrow screens the index collapses to a single inline line above the
 * content, so nothing is lost and nothing overflows.
 */
export function SectionShell({
  index,
  label,
  tone = "default",
  className,
  children,
}: {
  /** Two-digit section number, e.g. "02". */
  index: string;
  /** Short lowercase name for the gutter, e.g. "how it works". */
  label: string;
  tone?: "default" | "ink";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Container
      className={cn(
        "grid gap-6 py-16 lg:grid-cols-[7rem_minmax(0,1fr)] lg:gap-10 lg:py-24",
        className,
      )}
    >
      <p
        className={cn(
          "flex items-baseline gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:items-start lg:gap-2",
          tone === "ink" ? "text-ink-muted" : "text-muted-foreground",
        )}
      >
        <span className={tone === "ink" ? "text-ink-foreground" : "text-brand"}>
          {index}
        </span>
        <span aria-hidden className={cn("h-px w-6", tone === "ink" ? "bg-ink-border" : "bg-border")} />
        <span>{label}</span>
      </p>
      <div className="min-w-0">{children}</div>
    </Container>
  );
}

/* ------------------------------------------------------------------- type */

/**
 * Small monospace kicker. Distinct from the heading face on purpose — every
 * label, index and measurement on this site is mono, every sentence is not.
 */
export function Eyebrow({
  tone = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"p"> & { tone?: "default" | "ink" }) {
  return (
    <p
      className={cn(
        "font-mono text-[0.6875rem] uppercase tracking-[0.18em]",
        tone === "ink" ? "text-ink-muted" : "text-brand",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * The standard section header. Left aligned by design — this site does not
 * centre its headings.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
  tone = "default",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  id?: string;
  tone?: "default" | "ink";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className={cn(
          "text-[1.75rem] font-semibold leading-[1.12] sm:text-[2.125rem]",
          eyebrow && "mt-3",
          tone === "ink" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "mt-4 text-[0.9375rem] leading-relaxed",
            tone === "ink" ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- buttons */

export type ButtonVariant =
  /** Brand-filled. The primary action anywhere on the light ground. */
  | "default"
  /** Hairline box on the light ground. */
  | "outline"
  /** No chrome until hover. Nav links, tertiary actions. */
  | "ghost"
  /** Light fill on the dark ground — the primary action inside an ink band. */
  | "inverse"
  /** Hairline box on the dark ground. */
  | "outlineInverse";

export type ButtonSize = "sm" | "default" | "lg";

/* Square-ish, not pills: 4px radius, mono-ish tight label, no shadow. */
const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium tracking-[-0.01em] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: "bg-brand text-brand-foreground hover:bg-brand-hover",
  outline:
    "border border-input bg-background text-foreground hover:border-brand hover:text-brand",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  inverse: "bg-ink-foreground text-brand hover:bg-white",
  outlineInverse:
    "border border-ink-border bg-transparent text-ink-foreground hover:border-ink-foreground/60 hover:bg-white/5",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  default: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
};

export function buttonClass({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button className={buttonClass({ variant, size, className })} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}

/** Text link with a trailing rule that extends on hover. */
export function ArrowLink({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-brand",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="h-px w-6 bg-brand transition-all duration-200 group-hover:w-10"
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ cards */

/**
 * Hairline box. Square corners, 1px border, never a shadow. Prefer `CellGrid`
 * when you have several of these in a row — flush cells, not floating cards,
 * are the house style.
 */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A group of flush cells sharing one hairline sheet. `columns` is the widest
 * column count; it steps down to 2 on small screens and 1 on the narrowest.
 */
export function CellGrid({
  columns = 4,
  className,
  ...props
}: React.ComponentProps<"div"> & { columns?: 2 | 3 | 4 }) {
  return (
    <div
      className={cn(
        "cell-grid rounded-md",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

/** One cell inside a `CellGrid`. Supplies its own background, so the sheet
 *  behind it only shows through as 1px lines. */
export function Cell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-background p-6 transition-colors", className)}
      {...props}
    />
  );
}

/**
 * The icon-and-label cell used for feature grids. Pass a lucide icon
 * component (not an element) as `icon`.
 */
export function FeatureCell({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Cell className={cn("group hover:bg-brand-tint", className)}>
      {Icon ? (
        <Icon aria-hidden className="size-[1.125rem] text-brand" />
      ) : null}
      <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">
        {title}
      </h3>
      {children ? (
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {children}
        </p>
      ) : null}
    </Cell>
  );
}

/**
 * @deprecated Use `FeatureCell` inside a `CellGrid`. Kept so older imports
 * keep compiling; renders a standalone bordered box.
 */
export function FeatureCard(
  props: React.ComponentProps<typeof FeatureCell>,
) {
  return (
    <Card className="p-6">
      <FeatureCell {...props} className="p-0 hover:bg-transparent" />
    </Card>
  );
}

/* ------------------------------------------------------------------- bits */

/** Squared-off hairline tag for short factual labels. Mono, never a pill. */
export function Tag({
  tone = "default",
  className,
  children,
}: {
  tone?: "default" | "ink";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em]",
        tone === "ink"
          ? "border-ink-border text-ink-muted"
          : "border-border text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** @deprecated Use `Tag`. Kept so older imports keep compiling. */
export const Pill = Tag;

/**
 * A left-ruled aside for a caveat that deserves to be read rather than
 * buried in a footnote.
 */
export function Note({
  tone = "default",
  className,
  children,
}: {
  tone?: "default" | "ink";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-l-2 pl-5 text-sm leading-relaxed",
        tone === "ink"
          ? "border-ink-foreground/40 text-ink-foreground/75"
          : "border-brand text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One FAQ row: a flush, full-width hairline row with a caret that rotates.
 * Uses <details>, so it works with JavaScript disabled and is announced
 * correctly by screen readers without any ARIA of our own.
 */
export function Disclosure({
  question,
  children,
  defaultOpen = false,
}: {
  question: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="disclosure group border-b border-border last:border-b-0"
      open={defaultOpen}
    >
      <summary className="flex items-start gap-4 py-5 transition-colors hover:text-brand">
        <span
          aria-hidden
          className="disclosure-caret mt-0.5 shrink-0 text-brand transition-transform duration-200"
        >
          <svg
            viewBox="0 0 16 16"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3l5 5-5 5" />
          </svg>
        </span>
        <h3 className="flex-1 text-[0.9375rem] font-medium leading-snug">
          {question}
        </h3>
      </summary>
      <div className="pb-6 pl-[1.875rem] pr-0 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
