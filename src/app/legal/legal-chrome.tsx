import Link from "next/link";
import * as React from "react";

import { Pending, RailLabel } from "@/components/content";

/**
 * Shared furniture for the legal documents.
 *
 * These pages were once published as drafts and said so at the top of every
 * document. They are documents now, so the banner that announced them as
 * unwritten is gone. What replaces it is smaller and factual: a date, and a
 * line saying to read the thing before you buy.
 *
 * Two components keep their old names (`NotDrafted`, and the `covers` prop it
 * takes) because pages outside this file still import them. Their behaviour has
 * changed — they render a document's scope, not an apology for its absence.
 */

/** The date every legal document on the site was last revised. */
export const LEGAL_LAST_UPDATED = "19 August 2026";

export const LEGAL_DOCS = [
  {
    href: "/legal/acceptable-use-policy",
    title: "Acceptable Use Policy",
    status: "published" as const,
    summary:
      "What may and may not be sent through infrastructure Infrabox provisions, the list-hygiene rules, and the enforcement ladder that follows a breach.",
  },
  {
    href: "/legal/service-level-agreement",
    title: "Deliverability SLA",
    status: "conditional" as const,
    summary:
      "The placement guarantee, the sender-hygiene conditions it depends on, how placement is measured, and the service-credit remedy. It applies to a Guaranteed Placement subscription, which is not on sale today.",
  },
  {
    href: "/legal/terms-of-service",
    title: "Terms of Service",
    status: "published" as const,
    summary:
      "The master agreement: what Infrabox provides, what you undertake, how the subscription runs and how either side ends it.",
  },
  {
    href: "/legal/privacy-policy",
    title: "Privacy Policy",
    status: "published" as const,
    summary:
      "How Infrabox handles your account data, what the relay records about a message you send, the administrative access that exists to your mailboxes, and who else processes any of it.",
  },
  {
    href: "/legal/refund-policy",
    title: "Refund Policy",
    status: "published" as const,
    summary:
      "Refunds, cancellation, and what happens to a prepaid mailbox and a registered domain when a subscription ends.",
  },
];

export const LEGAL_STATUS_LABEL = {
  published: "Published",
  conditional: "Conditional",
} as const;

/**
 * The one line at the head of a legal document. Calm on purpose — it dates the
 * text and tells you when to read it, and does nothing else.
 */
export function LegalNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
      Last updated {LEGAL_LAST_UPDATED}.{" "}
      {children ?? <>Please read it before you buy.</>}
    </p>
  );
}

/**
 * Explains the dashed blanks. They are not gaps in an unwritten page — they are
 * commercial figures that belong in a signed subscription, and printing a number
 * here that nobody has agreed to would be worse than showing the blank.
 */
export function PendingLegend() {
  return (
    <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
      A value shown as <Pending /> is a figure fixed in your subscription rather
      than published here. Infrabox would rather show you the shape of the blank
      than print a threshold nobody has agreed to.
    </p>
  );
}

/**
 * A document's scope, stated as a list, before the document itself.
 *
 * Exported under its historic name because pages this file does not own still
 * import `NotDrafted`. It no longer announces anything as missing.
 */
export function NotDrafted({
  covers,
}: {
  /** The ground this document covers, one clause per entry. */
  covers: string[];
}) {
  return (
    <>
      <h2 id="covers">What this document covers</h2>
      <ul>
        {covers.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

/**
 * The set of documents, in the rail beside a legal page, with the one you are
 * reading marked. Every legal page carries it, so that from inside any one
 * document you can see the other four and how they fit together.
 */
export function LegalDocRail({ current }: { current: string }) {
  return (
    <nav aria-label="Legal documents">
      <RailLabel>The set</RailLabel>
      <ul className="mt-4 border-t border-border">
        {LEGAL_DOCS.map((doc) => {
          const isCurrent = doc.href === current;
          return (
            <li key={doc.href}>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="flex gap-3 border-b border-border py-2.5 text-[0.8125rem] leading-snug font-medium text-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-[0.6em] h-px w-3 shrink-0 bg-brand"
                  />
                  <span className="min-w-0">{doc.title}</span>
                </span>
              ) : (
                <Link
                  href={doc.href}
                  className="group flex gap-3 border-b border-border py-2.5 text-[0.8125rem] leading-snug text-muted-foreground transition-colors hover:text-brand"
                >
                  <span
                    aria-hidden
                    className="mt-[0.6em] h-px w-3 shrink-0 bg-border transition-colors group-hover:bg-brand"
                  />
                  <span className="min-w-0">{doc.title}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
        All five, last updated {LEGAL_LAST_UPDATED}.{" "}
        <Link
          href="/legal"
          className="font-medium text-brand underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand"
        >
          How they fit together
        </Link>
      </p>
    </nav>
  );
}
