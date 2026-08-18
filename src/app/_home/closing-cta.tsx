import { ArrowRight } from "lucide-react";

import { ButtonLink, Container, Eyebrow, Section } from "@/components/ui";
import { MAILBOX_PRICE_USD, usd } from "@/lib/product";

/*
 * The closing band bookends the hero: the same dark ground and the same
 * hairline panel on the right, but lit from the top left rather than the
 * bottom right so the two are not the same picture twice, and closed with a
 * hairline so it does not melt into the footer, which is also ink.
 *
 * The panel is the three things we actually need from you — the same three the
 * lede names — set as a list you can answer rather than a sentence you skim.
 */

const ASK = [
  { label: "Mailboxes", value: "How many you need" },
  { label: "Domains", value: "How many they sit on" },
  { label: "Sending tool", value: "What you send with today" },
];

export function ClosingCta() {
  return (
    <Section
      tone="ink"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-b border-ink-border bg-[radial-gradient(120%_110%_at_18%_0%,var(--brand-700)_0%,var(--brand-800)_42%,var(--brand-900)_76%)]"
    >
      <div aria-hidden className="dot-field absolute inset-0" />
      <div aria-hidden className="accent-edge absolute inset-x-0 top-0 h-px" />

      <Container className="relative grid gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:gap-16 lg:pb-20 lg:pt-24">
        <div className="max-w-xl">
          <Eyebrow tone="ink" className="flex items-center gap-3">
            <span aria-hidden className="h-px w-6 shrink-0 bg-ink-accent" />
            Get started
          </Eyebrow>

          <h2
            id="cta-heading"
            className="mt-6 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink-foreground"
          >
            Tell us what you need to send.
          </h2>

          <p className="mt-6 text-base leading-relaxed text-ink-foreground/65">
            We will tell you what it costs, what the pipeline will do with it,
            and which part of it Google, rather than us, sets the pace on.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/get-started" variant="inverse" size="lg">
              Get started
              <ArrowRight aria-hidden />
            </ButtonLink>
            <ButtonLink href="/pricing" variant="outlineInverse" size="lg">
              See pricing
            </ButtonLink>
          </div>

          <p className="tabular mt-7 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
            {usd(MAILBOX_PRICE_USD)} / mailbox / month · domain priced per TLD
          </p>
        </div>

        <div className="relative self-start overflow-hidden rounded-md border border-ink-border bg-ink-raised/35 lg:mt-2">
          <p className="border-b border-ink-border px-5 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
            What to tell us
          </p>
          <dl>
            {ASK.map((item, i) => (
              <div
                key={item.label}
                className={
                  i > 0 ? "border-t border-ink-border px-5 py-4" : "px-5 py-4"
                }
              >
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-accent">
                  {item.label}
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-snug text-ink-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
