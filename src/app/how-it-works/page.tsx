import type { Metadata } from "next";

import { Container, Section, Tag } from "@/components/ui";
import {
  ArrowLink,
  Band,
  CtaBand,
  InlineLink,
  PageHero,
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
      <Section divided aria-labelledby="steps-heading">
        <Container className="py-16 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="steps-heading" className="text-3xl font-semibold sm:text-4xl">
              The eight steps.
            </h2>
            <Tag>{PIPELINE.length} steps · unattended</Tag>
          </div>

          <ol className="mt-12 border-t border-border">
            {PIPELINE.map((step, i) => (
              <li
                key={step.key}
                className="grid gap-x-10 gap-y-3 border-b border-border py-8 lg:grid-cols-[4rem_minmax(0,1fr)_7rem] lg:py-10"
              >
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="text-lg font-semibold leading-snug">
                    {step.label}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {step.long}
                  </p>
                </div>

                <div className="lg:text-right">
                  <span className="tabular font-mono text-xs text-muted-foreground">
                    {humanDuration(step.typicalMinutes)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

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
      </Band>


      <CtaBand
        title="Ready to stand up sending infrastructure?"
        body="Tell us the shape of it — mailboxes, domains, and the tool you send with."
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
