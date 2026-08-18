import Link from "next/link";
import * as React from "react";

import { Callout, Pending, RailLabel } from "@/components/content";

/**
 * Shared furniture for the legal documents.
 *
 * Every page under /legal is a draft. That is not a hedge — the source material
 * these pages were built from is explicitly marked as pending counsel review,
 * and none of it has been executed against a customer. Saying so at the top of
 * each document is the only honest way to publish it, so the banner is part of
 * the shared chrome rather than something each page remembers to include.
 */

export const LEGAL_DOCS = [
  {
    href: "/legal/acceptable-use-policy",
    title: "Acceptable Use Policy",
    status: "drafted" as const,
    summary:
      "What may and may not be sent through infrastructure Infrabox provisions, the list-hygiene rules, and the enforcement ladder that follows a breach.",
  },
  {
    href: "/legal/service-level-agreement",
    title: "Deliverability SLA",
    status: "drafted" as const,
    summary:
      "The placement guarantee, the sender-hygiene conditions it depends on, how placement is measured, and the service-credit remedy. Written for a tier Infrabox does not currently sell.",
  },
  {
    href: "/legal/terms-of-service",
    title: "Terms of Service",
    status: "not-drafted" as const,
    summary:
      "The master agreement. Not yet written — the page lists what it has to cover rather than pretending to be it.",
  },
  {
    href: "/legal/privacy-policy",
    title: "Privacy Policy",
    status: "not-drafted" as const,
    summary:
      "How Infrabox handles your account data and the recipient data you process through it. Not yet written.",
  },
  {
    href: "/legal/refund-policy",
    title: "Refund Policy",
    status: "not-drafted" as const,
    summary:
      "Refunds, cancellation and what happens to a prepaid mailbox. Not yet written.",
  },
];

export const LEGAL_STATUS_LABEL = {
  drafted: "Draft",
  "not-drafted": "Not written",
} as const;

export function DraftBanner({ children }: { children?: React.ReactNode }) {
  return (
    <Callout tone="warn" title="Draft — not a binding agreement">
      {children ?? (
        <p>
          This document has not been reviewed by counsel and is not in force. It
          is published so it can be read and argued with before it becomes
          binding. Nothing here creates an obligation on Infrabox or on you.
        </p>
      )}
    </Callout>
  );
}

export function PendingLegend() {
  return (
    <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
      Values shown as <Pending /> are genuine gaps. The source draft left each
      one as an open decision, and we would rather show the gap than print a
      number nobody has agreed to.
    </p>
  );
}

export function NotDrafted({
  covers,
}: {
  /** The sections this document will contain once it is written. */
  covers: string[];
}) {
  return (
    <>
      <Callout tone="warn" title="This document has not been written yet">
        <p>
          There is no draft of this policy. Rather than publish generated legal
          text that looks authoritative and binds nobody, this page states the
          gap and lists what the finished document has to cover.
        </p>
        <p>
          If you need this settled before you can buy, say so on the{" "}
          <Link
            href="/get-started"
            className="font-medium text-brand underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand"
          >
            get started
          </Link>{" "}
          form and we will deal with it directly rather than pointing you at a
          page.
        </p>
      </Callout>

      <h2 id="covers">What it will have to cover</h2>
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
 * reading marked. Every legal page carries it: the honest thing about this set
 * is that it is incomplete, and the fastest way to see that is to see all five
 * at once from inside any one of them.
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
        None of these is in force.{" "}
        <Link
          href="/legal"
          className="font-medium text-brand underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand"
        >
          Where this stands
        </Link>
      </p>
    </nav>
  );
}
