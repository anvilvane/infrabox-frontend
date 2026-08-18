import { Check } from "lucide-react";

import {
  ArrowLink,
  ButtonLink,
  Cell,
  CellGrid,
  Eyebrow,
  Section,
  SectionHeading,
  SectionShell,
} from "@/components/ui";
import {
  DOMAIN_MARKUP,
  MAILBOX_PRICE_USD,
  PIPELINE,
  TLD_PRICES,
  usd,
} from "@/lib/product";

/*
 * Two facts, set as two facts: what a mailbox costs, and what a domain costs.
 *
 * The price used to float unanchored on the pale ground; it now sits opposite
 * the heading as the section's right-hand terminal, and the two supporting
 * blocks below share one hairline sheet so they end on the same line instead
 * of leaving a hole in the band. Every number is imported.
 */

const INCLUDED = [
  `All ${PIPELINE.length} provisioning steps. There is no separate setup fee.`,
  "The Google Workspace seat the mailbox lives on.",
  "Domain verification, DKIM and the verified sending credential.",
  "Per-step status in the dashboard while the pipeline runs.",
];

export function PricingTeaser() {
  return (
    <Section tone="muted" divided aria-labelledby="pricing-heading">
      <SectionShell index="04" label="pricing">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="pricing-heading"
            title="Plus the domain. Nothing for the provisioning itself."
            lede="The eight steps are the product, so they are not a separate line item. Domains are priced per TLD on top of the mailbox price."
          />
          <ArrowLink href="/pricing/calculator" className="shrink-0">
            Price it out
          </ArrowLink>
        </div>

        <CellGrid columns={2} className="mt-12">
          <Cell className="p-7">
            <Eyebrow>Per mailbox, per month</Eyebrow>
            <p className="mt-4 flex items-baseline gap-2.5">
              <span className="tabular font-display text-[3.25rem] font-semibold leading-none tracking-[-0.045em]">
                {usd(MAILBOX_PRICE_USD)}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                / mailbox / mo
              </span>
            </p>

            <p className="mt-7 border-t border-border pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
              What it covers
            </p>
            <ul className="mt-5 space-y-3.5">
              {INCLUDED.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <Check
                    aria-hidden
                    className="mt-[0.1875rem] size-3.5 shrink-0 text-brand"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Cell>

          <Cell className="p-7">
            <Eyebrow>Domain, per year</Eyebrow>
            <table className="mt-5 w-full border-t border-border text-sm">
              <caption className="sr-only">
                Base domain price per year by top-level domain, and the
                pre-warmed price where one is listed.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th
                    scope="col"
                    className="py-2.5 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    TLD
                  </th>
                  <th
                    scope="col"
                    className="py-2.5 text-right font-mono text-[0.625rem] font-normal uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Base
                  </th>
                  <th
                    scope="col"
                    className="py-2.5 text-right font-mono text-[0.625rem] font-normal uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Pre-warmed
                  </th>
                </tr>
              </thead>
              <tbody>
                {TLD_PRICES.map((row) => (
                  <tr key={row.tld} className="border-b border-border">
                    <th
                      scope="row"
                      className="py-2.5 text-left font-mono text-sm font-medium"
                    >
                      {row.tld}
                    </th>
                    <td className="tabular py-2.5 text-right">
                      {usd(row.base)}
                    </td>
                    <td className="tabular py-2.5 text-right text-muted-foreground">
                      {row.prewarmed === null ? "—" : usd(row.prewarmed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Base prices, before a{" "}
              <span className="tabular">${DOMAIN_MARKUP.standard}</span> markup —
              or <span className="tabular">${DOMAIN_MARKUP.aged}</span> once a
              domain is {DOMAIN_MARKUP.agedThresholdYears}+ year old. Pre-warmed
              domains are listed at their own price, and checkout quotes the
              final price for the exact domain you pick.
            </p>
          </Cell>
        </CellGrid>

        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/pricing">See full pricing</ButtonLink>
          <ButtonLink href="/get-started" variant="outline">
            Talk to us
          </ButtonLink>
        </div>
      </SectionShell>
    </Section>
  );
}
