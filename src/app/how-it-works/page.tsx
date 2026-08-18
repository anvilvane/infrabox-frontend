import type { Metadata } from "next";

import {
  ArrowLink,
  Band,
  CtaBand,
  InlineLink,
  PageHero,
  Steps,
  Strip,
} from "@/app/_marketing/page-parts";
import { SITE_VERIFICATION_RETRY } from "@/app/_marketing/facts";
import { PIPELINE, SITE_URL } from "@/lib/product";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "The eight steps Infrabox runs to take a domain from purchase to a Google Workspace mailbox with working SMTP: order, admin account, activation, DNS, domain verification, DKIM, credential, renewal.",
  alternates: { canonical: "/how-it-works" },
};

const TOTAL_MINUTES = PIPELINE.reduce((n, s) => n + s.typicalMinutes, 0);
const LONGEST = PIPELINE.reduce((a, b) =>
  b.typicalMinutes > a.typicalMinutes ? b : a,
);
const LONGEST_SHARE = Math.round((LONGEST.typicalMinutes / TOTAL_MINUTES) * 100);

function humanDuration(minutes: number) {
  if (minutes < 60) return `~${minutes} min`;
  const hours = minutes / 60;
  return `~${Number.isInteger(hours) ? hours : hours.toFixed(2).replace(/0$/, "")} hr`;
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "How it works",
        item: `${SITE_URL}/how-it-works`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Infrabox provisions a Google Workspace mailbox",
    description:
      "The eight steps that take a domain from purchase to a Google Workspace mailbox with a working SMTP sending credential.",
    totalTime: `PT${TOTAL_MINUTES}M`,
    step: PIPELINE.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.label,
      text: step.short,
    })),
  },
];

/**
 * The duration bar. Proportional to the longest step, not to the total, so the
 * seven short steps stay visible instead of collapsing to nothing — and the one
 * step that dominates the run is legible at a glance rather than buried in a
 * column of numbers. It is `aria-hidden`; the duration beside it is the text.
 */
function Duration({ minutes }: { minutes: number }) {
  const share = (minutes / LONGEST.typicalMinutes) * 100;
  return (
    <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-2">
      <span
        aria-hidden
        className="block h-1.5 w-24 shrink-0 rounded-sm bg-muted ring-1 ring-inset ring-border lg:w-full"
      >
        <span
          className="block h-full rounded-sm bg-brand"
          style={{ width: `${Math.max(share, 4)}%` }}
        />
      </span>
      <span className="tabular font-mono text-xs text-muted-foreground">
        {humanDuration(minutes)}
      </span>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="How it works"
        title="From a domain you just bought to a mailbox that sends."
        meta={[
          { label: "steps", value: PIPELINE.length },
          { label: "run", value: "Unattended, in order" },
          { label: "typical total", value: `~${Math.round(TOTAL_MINUTES / 60)} hours` },
          { label: "longest step", value: LONGEST.label },
          { label: "google logins", value: "None" },
        ]}
        metaCaption="Durations are the dashboard's own per-step estimates, not a service level."
      >
        <p>
          Infrabox runs the same eight steps for every Google Workspace mailbox
          it provisions. They run in order, unattended, and each has to finish
          before the next begins. Nothing here needs you to log into Google,
          open the Admin Console, or copy a DNS record by hand.
        </p>
        <p>
          The times below are the same typical durations the dashboard shows
          while a mailbox is provisioning. They are estimates, not promises —
          and most of the total is one step waiting on Google.
        </p>
      </PageHero>

      {/* ------------------------------------------------------- the 8 steps */}
      <Band
        id="steps"
        index="01"
        label="the pipeline"
        eyebrow="The pipeline"
        title="The eight steps."
        lede={
          <>
            Each bar is drawn against the longest step, so the shape of the run
            is visible rather than buried in a column of numbers. One step is
            roughly {LONGEST_SHARE}% of the typical total.
          </>
        }
      >
        <div className="mt-10 border-t border-border pt-9">
          <Steps
            items={PIPELINE.map((step) => ({
              title: step.label,
              body: step.long,
              meta: <Duration minutes={step.typicalMinutes} />,
            }))}
          />
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            {
              term: LONGEST.label,
              detail: `${LONGEST.typicalMinutes} min · ${LONGEST_SHARE}%`,
            },
            {
              term: `The other ${PIPELINE.length - 1} steps`,
              detail: `${TOTAL_MINUTES - LONGEST.typicalMinutes} min · ${100 - LONGEST_SHARE}%`,
            },
            {
              term: "Typical total",
              detail: `${TOTAL_MINUTES.toLocaleString("en-US")} min`,
            },
          ].map((item) => (
            <div key={item.term} className="bg-background px-5 py-4">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                {item.term}
              </dt>
              <dd className="tabular mt-1.5 text-[0.9375rem] font-semibold text-foreground">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </Band>

      {/* ----------------------------------------------------- the long pole */}
      <Band
        id="long-pole"
        index="02"
        label="the long pole"
        eyebrow="Worth being clear about"
        title="Domain verification sets the pace, not us."
        tone="ink"
      >
        <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-ink-foreground/75">
          <p>
            Seven of the eight steps are quick. The fifth — proving to Google
            that you own the domain — depends on nameserver delegation and DNS
            propagation, which routinely take hours and are entirely outside our
            control and yours. So Infrabox treats a slow verification as a wait
            rather than a failure: up to {SITE_VERIFICATION_RETRY.maxAttempts}{" "}
            attempts, backing off from{" "}
            {SITE_VERIFICATION_RETRY.initialDelaySeconds} seconds to a{" "}
            {SITE_VERIFICATION_RETRY.maxDelayMinutes}-minute ceiling, before it
            gives up.
          </p>
          <p>
            That is why we quote a typical time per step rather than one
            headline number for the whole thing. Of the {TOTAL_MINUTES} typical
            minutes across all eight steps, {LONGEST.typicalMinutes} of them are{" "}
            {LONGEST.label.toLowerCase()} alone. A domain whose nameservers are
            already pointed correctly moves fast; one bought five minutes ago
            waits on the internet, like everyone else.
          </p>
          <p>
            While it waits, you can watch it. The dashboard shows which step
            each mailbox is on, so a mailbox that is taking a while is legible
            instead of mysterious.
          </p>
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-md border border-ink-border bg-ink-border sm:grid-cols-3">
          {[
            {
              term: "Retry attempts",
              detail: String(SITE_VERIFICATION_RETRY.maxAttempts),
            },
            {
              term: "First backoff",
              detail: `${SITE_VERIFICATION_RETRY.initialDelaySeconds} sec`,
            },
            {
              term: "Backoff ceiling",
              detail: `${SITE_VERIFICATION_RETRY.maxDelayMinutes} min`,
            },
          ].map((item) => (
            <div key={item.term} className="bg-ink px-5 py-4">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                {item.term}
              </dt>
              <dd className="tabular mt-1.5 text-[0.9375rem] font-semibold text-ink-foreground">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          Read out of the <code className="font-mono">site_verification</code>{" "}
          step&rsquo;s own retry policy. Every other step uses the shared
          default instead.
        </p>
      </Band>

      <Strip id="hiw-next" heading="What this gets you">
        <p>
          <InlineLink href="/deliverability">
            Authentication and deliverability
          </InlineLink>{" "}
          covers what the records published in steps four to six actually do,
          and where we stop making claims.{" "}
          <InlineLink href="/pricing">Pricing</InlineLink> is two line items,
          and the{" "}
          <InlineLink href="/pricing/calculator">calculator</InlineLink> will
          total up your setup.
        </p>
        <div className="mt-4">
          <ArrowLink href="/compare/doing-it-by-hand">
            Or compare this against doing it by hand
          </ArrowLink>
        </div>
      </Strip>

      <CtaBand
        title="Ready to stand up sending infrastructure?"
        body="Tell us the shape of it — mailboxes, domains, and the tool you send with."
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
