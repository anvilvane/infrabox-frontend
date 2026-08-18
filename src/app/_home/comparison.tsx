import { Check, X } from "lucide-react";

import {
  ArrowLink,
  Section,
  SectionHeading,
  SectionShell,
} from "@/components/ui";

/*
 * Deliberately not a competitor table. We have no verified data about any
 * other vendor's product, so the honest comparison is against the thing every
 * customer is actually doing today: setting this up by hand.
 *
 * The Infrabox column is the full dark ground rather than a tinted highlight,
 * and every one of its cells carries a sentence beside the tick. A column of
 * eight bare ticks on a large dark field looked empty; a column of eight short
 * statements reads as the answer to the row.
 */

type Row = {
  feature: string;
  detail: string;
  /** `false` renders a cross. */
  manual: string | false;
  infrabox: string;
};

const COMPARISON: Row[] = [
  {
    feature: "Domain and DNS",
    detail: "Registration, nameservers and the records mail needs",
    manual: "Two vendors, copied across by hand",
    infrabox: "Registered and wired in one pass",
  },
  {
    feature: "Workspace account",
    detail: "Creating the Workspace and the admin that owns the mailboxes",
    manual: "Signup wizard, once per domain",
    infrabox: "Created with your domain already attached",
  },
  {
    feature: "MX, SPF, DMARC",
    detail: "The records that decide inbox versus spam",
    manual: "Hand-edited, easy to get subtly wrong",
    infrabox: "Written with the values Google expects",
  },
  {
    feature: "Domain verification",
    detail: "Google's ownership proof before a domain may send",
    manual: "Publish, wait, re-check, repeat",
    infrabox: "Retried automatically for hours",
  },
  {
    feature: "DKIM signing",
    detail: "Only exposed through the Google Admin Console",
    manual: false,
    infrabox: "Generated, published and switched on",
  },
  {
    feature: "Sending credential",
    detail: "A credential your tool can actually authenticate with",
    manual: "An app password per mailbox",
    infrabox: "Minted and verified against Google",
  },
  {
    feature: "The hundredth mailbox",
    detail: "What the work looks like at scale",
    manual: "The same session, a hundred times",
    infrabox: "The same pipeline, a hundred times",
  },
  {
    feature: "Seeing progress",
    detail: "Knowing which part is done and which is waiting",
    manual: "Nowhere in particular",
    infrabox: "Per-step status in the dashboard",
  },
];

export function Comparison() {
  return (
    <Section divided aria-labelledby="comparison-heading">
      <SectionShell index="03" label="by hand vs infrabox">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="comparison-heading"
            title="The same eight things happen either way."
            lede="This is not a competitor table — we have no verified data about anyone else's product. It is the job itself, done the way most teams do it today and the way Infrabox does it."
          />
          <ArrowLink href="/compare" className="shrink-0">
            Compare approaches
          </ArrowLink>
        </div>

        {/* Mobile: one block per row, the Infrabox half on ink. */}
        <div className="mt-12 divide-y divide-border border-y border-border lg:hidden">
          {COMPARISON.map((row) => (
            <div key={row.feature} className="py-5">
              <h3 className="text-[0.9375rem] font-semibold">{row.feature}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{row.detail}</p>
              <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-md border border-border text-xs">
                <div className="p-3.5">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                    By hand
                  </p>
                  <p className="mt-2.5 text-muted-foreground">
                    {row.manual === false ? <Cross ground="light" /> : row.manual}
                  </p>
                </div>
                <div className="on-ink bg-ink p-3.5 text-ink-foreground">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted">
                    Infrabox
                  </p>
                  <p className="mt-2.5">{row.infrabox}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: a real <table>. The Infrabox column is the ink ground —
            the whole column, not a tinted highlight. */}
        <div className="mt-12 hidden overflow-hidden rounded-md border border-border lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Setting up sending infrastructure by hand compared with Infrabox,
              step by step.
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-[38%] border-b border-border bg-muted/60 px-6 py-4 font-mono text-[0.6875rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                >
                  What has to happen
                </th>
                <th
                  scope="col"
                  className="w-[30%] border-b border-border bg-muted/60 px-6 py-4 font-mono text-[0.6875rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                >
                  By hand
                </th>
                <th
                  scope="col"
                  className="on-ink relative bg-ink px-6 py-4 font-mono text-[0.6875rem] font-normal uppercase tracking-[0.16em] text-ink-foreground"
                >
                  <span
                    aria-hidden
                    className="accent-edge absolute inset-x-0 top-0 h-px"
                  />
                  Infrabox
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="group">
                  <th
                    scope="row"
                    className="border-b border-border px-6 py-4 align-top font-normal transition-colors group-hover:bg-muted/50"
                  >
                    <span className="block text-sm font-semibold">
                      {row.feature}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {row.detail}
                    </span>
                  </th>
                  <td className="border-b border-border px-6 py-4 align-top text-sm leading-relaxed text-muted-foreground transition-colors group-hover:bg-muted/50">
                    {row.manual === false ? <Cross ground="light" /> : row.manual}
                  </td>
                  <td className="on-ink border-b border-ink-border bg-ink px-6 py-4 align-top text-sm leading-relaxed text-ink-foreground">
                    <span className="flex gap-2.5">
                      <Check
                        aria-hidden
                        className="mt-[0.1875rem] size-3.5 shrink-0 text-ink-accent"
                      />
                      <span className="sr-only">Yes</span>
                      <span>{row.infrabox}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>
    </Section>
  );
}

function Cross({ ground }: { ground: "light" | "ink" }) {
  return (
    <>
      <X
        aria-hidden
        className={`inline size-4 ${ground === "ink" ? "text-ink-muted" : "text-muted-foreground"}`}
      />
      <span className="sr-only">No</span>
    </>
  );
}
