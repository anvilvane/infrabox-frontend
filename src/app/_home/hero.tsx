import { ArrowRight } from "lucide-react";

import { ButtonLink, Container, Eyebrow, Section } from "@/components/ui";
import { MAILBOX_PRICE_USD, PIPELINE, usd } from "@/lib/product";
import { cn } from "@/lib/utils";

/*
 * The hero is composed as three registers rather than two columns of text:
 *
 *   1. the statement          (left, wide)
 *   2. the provisioning panel (right, a bordered instrument, not a bare list)
 *   3. a fact strip           (full width, closing the band on one hairline)
 *
 * The strip is what stops the band bottoming out in empty ink and gives the
 * two unequal columns a shared bottom edge. Every value in it is read from
 * src/lib/product.ts — none of them is a metric, a count or a claim.
 */

const HERO_FACTS: { label: string; value: string; tabular?: boolean }[] = [
  {
    label: "Price",
    value: `${usd(MAILBOX_PRICE_USD)} / mailbox / month`,
    tabular: true,
  },
  {
    label: "Pipeline",
    value: `${PIPELINE.length} steps, run in order`,
    tabular: true,
  },
  { label: "Provider", value: "Google Workspace" },
  { label: "Hand-off", value: "Plain SMTP, your own tool" },
];

export function Hero() {
  return (
    <Section tone="ink" className="ink-gradient relative overflow-hidden">
      <div aria-hidden className="dot-field absolute inset-0" />
      <div aria-hidden className="accent-edge absolute inset-x-0 bottom-0 h-px" />

      <Container className="relative pb-12 pt-20 lg:pb-14 lg:pt-24">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:gap-16">
          <div className="max-w-2xl">
            <Eyebrow tone="ink" className="flex items-center gap-3">
              <span aria-hidden className="h-px w-6 shrink-0 bg-ink-accent" />
              Cold-email infrastructure
            </Eyebrow>

            <h1 className="mt-7 text-[clamp(2.375rem,5.6vw,3.875rem)] font-semibold leading-[1.02] tracking-[-0.042em] text-ink-foreground">
              A domain that can send,
              <br className="hidden sm:block" />{" "}
              <span className="text-ink-foreground/60">
                handed over finished.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[1.0625rem] leading-[1.65] text-ink-foreground/65">
              Buy a domain and Infrabox does the rest — registers it, connects
              DNS, provisions{" "}
              <strong className="font-medium text-ink-foreground">
                Google Workspace
              </strong>{" "}
              mailboxes on it, publishes{" "}
              <strong className="font-medium text-ink-foreground">
                MX, SPF, DMARC and DKIM
              </strong>
              , gets the domain verified with Google, and hands you a sending
              credential that has already been tested.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/get-started" variant="inverse" size="lg">
                Get started
                <ArrowRight aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/how-it-works"
                variant="outlineInverse"
                size="lg"
              >
                See the eight steps
              </ButtonLink>
            </div>
          </div>

          <PipelinePanel />
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-ink-border pt-7 sm:grid-cols-4 sm:gap-0 sm:pt-0 lg:mt-16">
          {HERO_FACTS.map((fact, i) => (
            <div
              key={fact.label}
              className={cn(
                "sm:py-7",
                i > 0 && "sm:border-l sm:border-ink-border sm:pl-7",
              )}
            >
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted">
                {fact.label}
              </dt>
              <dd
                className={cn(
                  "mt-2.5 text-[0.9375rem] leading-snug text-ink-foreground",
                  fact.tabular && "tabular",
                )}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

/**
 * The eight steps drawn as a spine inside a hairline panel: a header strip
 * naming the run, one vertical rule with a node per step, and a footer strip.
 *
 * Static and deliberately undressed — it is a diagram of what the pipeline
 * does, not a fabricated live log with fake timestamps ticking over.
 */
function PipelinePanel() {
  return (
    <figure className="relative overflow-hidden rounded-md border border-ink-border bg-ink-raised/35 lg:mt-1">
      <div aria-hidden className="accent-edge absolute inset-x-0 top-0 h-px" />

      <figcaption className="flex items-baseline justify-between gap-4 border-b border-ink-border px-5 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
        <span>Provisioning run</span>
        <span className="tabular text-ink-foreground">
          {PIPELINE.length} steps
        </span>
      </figcaption>

      <ol className="relative px-5 py-4">
        <span
          aria-hidden
          className="absolute bottom-[2.125rem] left-[1.6875rem] top-[2.125rem] w-px bg-ink-border"
        />
        {PIPELINE.map((step, i) => (
          <li
            key={step.key}
            className="relative flex h-9 items-center gap-3.5 pl-6"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1/2 flex size-[0.875rem] -translate-y-1/2 items-center justify-center rounded-full border border-ink-border bg-ink"
            >
              <span className="size-[0.3125rem] rounded-full bg-ink-accent" />
            </span>
            <span className="tabular font-mono text-[0.6875rem] text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.875rem] font-medium text-ink-foreground">
              {step.label}
            </span>
          </li>
        ))}
      </ol>

      <p className="border-t border-ink-border px-5 py-4 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
        No console · no app password · no clicking
      </p>
    </figure>
  );
}
