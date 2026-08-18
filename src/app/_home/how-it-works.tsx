import {
  ArrowLink,
  Note,
  Section,
  SectionHeading,
  SectionShell,
} from "@/components/ui";
import { PIPELINE } from "@/lib/product";
import { cn } from "@/lib/utils";

/*
 * A ledger rather than a card grid: the steps are a sequence with durations,
 * and a sequence reads better as rows than as tiles.
 *
 * Each row carries a 2px bar whose width is that step's share of the slowest
 * step's estimate. It is drawn straight from `typicalMinutes` — the same
 * numbers the dashboard shows during a run — so it is a plot of data we hold,
 * not a decoration. It is what makes the "one step dominates" point visible
 * before the note below it says so in words.
 */

export function HowItWorks() {
  const longest = PIPELINE.reduce((a, b) =>
    a.typicalMinutes > b.typicalMinutes ? a : b,
  );

  return (
    <Section tone="muted" divided aria-labelledby="how-heading">
      <SectionShell index="02" label="how it works">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="how-heading"
            title="Eight steps, run in order, without you."
            lede="Each step has to finish before the next one starts, and the pipeline reports which step it is on the whole way through."
          />
          <ArrowLink href="/how-it-works" className="shrink-0">
            Read the detail
          </ArrowLink>
        </div>

        <div className="mt-12 flex items-baseline justify-between border-b border-foreground/15 pb-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Step</span>
          <span>Typical estimate</span>
        </div>

        <ol>
          {PIPELINE.map((step, i) => {
            const isLongest = step.key === longest.key;
            const share = Math.max(
              2,
              Math.round((step.typicalMinutes / longest.typicalMinutes) * 100),
            );

            return (
              <li
                key={step.key}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-border py-5 transition-colors hover:bg-background sm:grid-cols-[2.75rem_12rem_minmax(0,1fr)_8rem] sm:items-baseline sm:gap-x-7"
              >
                <span
                  className={cn(
                    "tabular font-mono text-xs",
                    isLongest ? "text-brand" : "text-muted-foreground",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="text-[0.9375rem] font-semibold leading-snug">
                  {step.label}
                  {isLongest ? (
                    <span className="ml-2 inline-block whitespace-nowrap rounded-sm border border-brand/40 px-1.5 py-px align-[0.1em] font-mono text-[0.5625rem] font-normal uppercase tracking-[0.12em] text-brand">
                      Long pole
                    </span>
                  ) : null}
                </h3>

                <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                  {step.short}
                </p>

                <div className="col-start-2 sm:col-start-4">
                  <span
                    className={cn(
                      "tabular block font-mono text-xs sm:text-right",
                      isLongest
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    ≈ {formatMinutes(step.typicalMinutes)}
                  </span>
                  <span
                    aria-hidden
                    className="mt-2.5 block h-0.5 w-full bg-border"
                  >
                    <span
                      className={cn(
                        "block h-0.5",
                        isLongest ? "bg-brand" : "bg-brand/45",
                      )}
                      style={{ width: `${share}%` }}
                    />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <Note className="mt-10 max-w-3xl">
          <strong className="font-semibold text-foreground">
            {longest.label} is the long pole.
          </strong>{" "}
          Google will not let a domain send until it has proved ownership of it,
          and nameserver and DNS propagation is genuinely slow. That step alone
          budgets{" "}
          <span className="tabular">
            {formatMinutes(longest.typicalMinutes)}
          </span>{" "}
          and retries for hours rather than failing a domain that is simply
          still propagating. The durations above are the same per-step estimates
          the dashboard shows during a run — estimates, not a service level. We
          do not quote a single headline setup time, because Google controls the
          slowest part of it.
        </Note>
      </SectionShell>
    </Section>
  );
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr`;
}
