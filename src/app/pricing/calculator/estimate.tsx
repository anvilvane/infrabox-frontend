"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui";
import {
  DOMAIN_MARKUP,
  MAILBOX_PRICE_USD,
  TLD_PRICES,
  usd,
} from "@/lib/product";
import { cn } from "@/lib/utils";

/*
 * Every number this component multiplies comes from `@/lib/product`, which in
 * turn cites the api-server config file it was read out of. There is no price
 * literal in this file and no rounding rule of its own: it does the same
 * arithmetic a person would do with the published price list, in public.
 *
 * It is deliberately not a quote. Registrar prices move and availability varies
 * per name, so the result panel says so rather than implying it is binding.
 */

const DOMAIN_RANGE = { min: 1, max: 250 } as const;
const PER_DOMAIN_RANGE = { min: 1, max: 100 } as const;

const FIELD =
  "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm transition-colors hover:border-brand/30 focus:border-brand/40";

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** A radio group drawn as a segmented control, still a real fieldset. */
function Choice<T extends string>({
  legend,
  hint,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  hint?: string;
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      {hint ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-center text-xs font-medium transition-colors",
                selected
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-brand/30 hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Line({
  label,
  detail,
  amount,
  strong,
}: {
  label: string;
  detail: string;
  amount: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 py-3.5",
        strong ? "border-t border-border" : "border-t border-border/60",
      )}
    >
      <div>
        <p
          className={cn(
            "text-sm text-foreground",
            strong ? "font-semibold" : "font-medium",
          )}
        >
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {detail}
        </p>
      </div>
      <p
        className={cn(
          "tabular shrink-0 font-display font-semibold text-foreground",
          strong ? "text-xl" : "text-base",
        )}
      >
        {amount}
      </p>
    </div>
  );
}

export function Estimate() {
  const [domains, setDomains] = React.useState(3);
  const [perDomain, setPerDomain] = React.useState(3);
  const [tld, setTld] = React.useState(TLD_PRICES[0].tld);
  const [condition, setCondition] = React.useState<"fresh" | "prewarmed">(
    "fresh",
  );
  const [age, setAge] = React.useState<"new" | "aged">("new");

  const row = TLD_PRICES.find((t) => t.tld === tld) ?? TLD_PRICES[0];

  const domainCount = clamp(domains, DOMAIN_RANGE.min, DOMAIN_RANGE.max);
  const perDomainCount = clamp(
    perDomain,
    PER_DOMAIN_RANGE.min,
    PER_DOMAIN_RANGE.max,
  );

  const prewarmAvailable = row.prewarmed !== null;
  const usingPrewarm = condition === "prewarmed" && prewarmAvailable;
  const registration = usingPrewarm ? (row.prewarmed as number) : row.base;
  const markup = age === "aged" ? DOMAIN_MARKUP.aged : DOMAIN_MARKUP.standard;

  const mailboxCount = domainCount * perDomainCount;
  const mailboxesMonthly = mailboxCount * MAILBOX_PRICE_USD;
  const domainsFirstYear = domainCount * (registration + markup);
  const firstMonth = mailboxesMonthly + domainsFirstYear;
  const firstYear = mailboxesMonthly * 12 + domainsFirstYear;

  /* The `.co` tables disagree in the source; surface it where it shows up. */
  const prewarmIsCheaper =
    prewarmAvailable && (row.prewarmed as number) < row.base;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-12">
      {/* ------------------------------------------------------- controls */}
      <form
        className="grid gap-6 self-start rounded-lg border border-border bg-card p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className="text-sm font-semibold text-foreground">Your setup</h3>

        <div className="grid gap-1.5">
          <label
            htmlFor="calc-domains"
            className="text-sm font-medium text-foreground"
          >
            Domains
          </label>
          <input
            id="calc-domains"
            name="domains"
            type="number"
            inputMode="numeric"
            min={DOMAIN_RANGE.min}
            max={DOMAIN_RANGE.max}
            value={domains}
            onChange={(e) => setDomains(Number(e.target.value))}
            onBlur={() =>
              setDomains(clamp(domains, DOMAIN_RANGE.min, DOMAIN_RANGE.max))
            }
            className={cn(FIELD, "tabular")}
            aria-describedby="calc-domains-hint"
          />
          <p id="calc-domains-hint" className="text-xs text-muted-foreground">
            How many sending domains you want to register.
          </p>
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="calc-per-domain"
            className="text-sm font-medium text-foreground"
          >
            Mailboxes per domain
          </label>
          <input
            id="calc-per-domain"
            name="perDomain"
            type="number"
            inputMode="numeric"
            min={PER_DOMAIN_RANGE.min}
            max={PER_DOMAIN_RANGE.max}
            value={perDomain}
            onChange={(e) => setPerDomain(Number(e.target.value))}
            onBlur={() =>
              setPerDomain(
                clamp(perDomain, PER_DOMAIN_RANGE.min, PER_DOMAIN_RANGE.max),
              )
            }
            className={cn(FIELD, "tabular")}
            aria-describedby="calc-per-domain-hint"
          />
          <p
            id="calc-per-domain-hint"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            The unit price does not change with volume.
          </p>
        </div>

        <div className="grid gap-1.5">
          <label
            htmlFor="calc-tld"
            className="text-sm font-medium text-foreground"
          >
            TLD
          </label>
          <select
            id="calc-tld"
            name="tld"
            value={tld}
            onChange={(e) => setTld(e.target.value)}
            className={FIELD}
          >
            {TLD_PRICES.map((t) => (
              <option key={t.tld} value={t.tld}>
                {t.tld} — {usd(t.base)}/year
              </option>
            ))}
          </select>
        </div>

        <Choice
          legend="Domain"
          hint="Pre-warmed domains carry their own registration price."
          name="condition"
          value={condition}
          onChange={setCondition}
          options={[
            { value: "fresh", label: "Newly registered" },
            { value: "prewarmed", label: "Pre-warmed" },
          ]}
        />

        <Choice
          legend="Age at purchase"
          hint={`Domains ${DOMAIN_MARKUP.agedThresholdYears * 12} months or older carry the higher platform markup.`}
          name="age"
          value={age}
          onChange={setAge}
          options={[
            {
              value: "new",
              label: `Under 12 mo · +$${DOMAIN_MARKUP.standard}`,
            },
            { value: "aged", label: `12 mo+ · +$${DOMAIN_MARKUP.aged}` },
          ]}
        />
      </form>

      {/* --------------------------------------------------------- result */}
      <div>
        <div
          className="rounded-lg border border-border bg-brand-tint p-6 sm:p-8"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">Estimate</h3>
            <p className="text-xs text-muted-foreground">
              <span className="tabular font-medium text-foreground">
                {mailboxCount}
              </span>{" "}
              {mailboxCount === 1 ? "mailbox" : "mailboxes"} across{" "}
              <span className="tabular font-medium text-foreground">
                {domainCount}
              </span>{" "}
              {domainCount === 1 ? "domain" : "domains"}
            </p>
          </div>

          <div className="mt-5">
            <Line
              label="Mailboxes"
              detail={`${mailboxCount} × ${usd(MAILBOX_PRICE_USD)} per mailbox per month`}
              amount={`${usd(mailboxesMonthly)}/mo`}
            />
            <Line
              label="Domains, first year"
              detail={`${domainCount} × (${usd(registration)} registration + $${markup} markup)`}
              amount={usd(domainsFirstYear)}
            />
            <Line
              label="First month"
              detail="Domains billed for the year, mailboxes monthly."
              amount={usd(firstMonth)}
              strong
            />
            <Line
              label="First twelve months"
              detail="Twelve monthly mailbox charges plus the domains."
              amount={usd(firstYear)}
              strong
            />
          </div>

          <ButtonLink href="/get-started" size="lg" className="mt-7 w-full">
            Get a real total
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>

        <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            This is arithmetic on the published price list, not a quote.
            Registrar prices move, and availability and recorded age vary per
            name, so the exact total for the specific domains you pick is shown
            at checkout before you commit to anything.
          </p>
          {condition === "prewarmed" && !prewarmAvailable ? (
            <p>
              There is no pre-warmed price listed for {row.tld}, so the estimate
              above uses its ordinary registration price.
            </p>
          ) : null}
          {usingPrewarm && prewarmIsCheaper ? (
            <p>
              Worth flagging: for {row.tld} the pre-warmed figure in our source
              tables is lower than the standard registration figure. The two
              tables disagree, our own source comments say so, and we would
              rather show you that than quietly pick whichever number flatters
              us. Checkout quotes the real one.
            </p>
          ) : null}
          <p>
            Need more than {DOMAIN_RANGE.max} domains, or a shape this does not
            cover?{" "}
            <a
              href="/get-started"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
            >
              Tell us what it looks like
            </a>{" "}
            and we will price it properly.
          </p>
        </div>
      </div>
    </div>
  );
}
