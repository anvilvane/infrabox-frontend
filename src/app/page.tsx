import {
  ArrowRight,
  Check,
  Fingerprint,
  Globe,
  KeyRound,
  Layers,
  Plug,
  Repeat,
  ScrollText,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  ArrowLink,
  ButtonLink,
  CellGrid,
  Container,
  Disclosure,
  Eyebrow,
  FeatureCell,
  Note,
  Section,
  SectionHeading,
  SectionShell,
  Tag,
} from "@/components/ui";
import {
  DOMAIN_MARKUP,
  MAILBOX_PRICE_USD,
  PIPELINE,
  TLD_PRICES,
  usd,
} from "@/lib/product";

/*
 * The homepage. Section rhythm, top to bottom:
 *   hero → features → how it works → comparison → pricing → FAQ → CTA
 *
 * Every number on this page is imported from src/lib/product.ts, which cites
 * the api-server / dashboard file each value was read out of. Nothing here is
 * a metric, a customer count, a logo wall or an uptime claim, because none of
 * those exist as facts in this repository.
 */

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Comparison />
      <PricingTeaser />
      <Faq />
      <ClosingCta />
    </>
  );
}

/* ==================================================================== hero */

const HERO_TAGS = [
  "Google Workspace",
  "8-step pipeline",
  "SMTP to your own tool",
];

function Hero() {
  return (
    <Section tone="ink" className="ink-gradient relative overflow-hidden">
      <div aria-hidden className="dot-field absolute inset-0" />
      <div aria-hidden className="accent-edge absolute inset-x-0 bottom-0 h-px" />
      <Container className="relative grid gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 lg:py-28">
        <div className="max-w-2xl">
          <Eyebrow tone="ink">Cold-email infrastructure</Eyebrow>

          <h1 className="mt-6 text-[clamp(2.375rem,6vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-foreground">
            A domain that can send,
            <br className="hidden sm:block" /> handed over finished.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/70 sm:text-lg">
            Buy a domain and Infrabox does the rest — registers it, connects
            DNS, provisions Google Workspace mailboxes on it, publishes MX, SPF,
            DMARC and DKIM, gets the domain verified with Google, and hands you
            a sending credential that has already been tested.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/get-started" variant="inverse" size="lg">
              Get started
              <ArrowRight aria-hidden />
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="outlineInverse" size="lg">
              See the eight steps
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-ink-border pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              <span className="tabular text-ink-foreground">
                {usd(MAILBOX_PRICE_USD)}
              </span>{" "}
              / mailbox / month
            </p>
            <ul className="flex flex-wrap gap-2">
              {HERO_TAGS.map((tag) => (
                <li key={tag}>
                  <Tag tone="ink">{tag}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PipelineSpine />
      </Container>
    </Section>
  );
}

/**
 * The eight steps drawn as a spine: one vertical rule with a node per step.
 * Static and deliberately undressed — it is a diagram of what the pipeline
 * does, not a fabricated live log with fake timestamps ticking over.
 */
function PipelineSpine() {
  return (
    <figure className="lg:pt-2">
      <figcaption className="flex items-baseline justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
        <span>Provisioning run</span>
        <span className="tabular">{PIPELINE.length} steps</span>
      </figcaption>
      <ol className="relative mt-5 border-l border-ink-border pl-6">
        {PIPELINE.map((step, i) => (
          <li key={step.key} className="relative pb-5 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[1.8125rem] top-1 flex size-3.5 items-center justify-center rounded-full border border-ink-border bg-ink"
            >
              <span className="size-1.5 rounded-full bg-ink-accent" />
            </span>
            <p className="flex items-baseline gap-3">
              <span className="tabular font-mono text-[0.6875rem] text-ink-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-ink-foreground">
                {step.label}
              </span>
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-ink-border pt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">
        No console · no app password · no clicking
      </p>
    </figure>
  );
}

/* ================================================================ features */

const FEATURES = [
  {
    icon: Globe,
    title: "Domain registered for you",
    body: "Bought in your account and pointed at DNS we manage, so the records the mailboxes need can actually be written.",
  },
  {
    icon: Layers,
    title: "Workspace, no signup form",
    body: "Your domain is attached as a secondary domain and its admin account is created for you. You never see the wizard.",
  },
  {
    icon: ScrollText,
    title: "MX, SPF and DMARC",
    body: "Published at provisioning time with the values Google expects — not left as a support article for you to follow.",
  },
  {
    icon: ShieldCheck,
    title: "Domain verification",
    body: "The ownership proof Google demands before a domain may send is published and confirmed on your behalf.",
  },
  {
    icon: Fingerprint,
    title: "DKIM, actually switched on",
    body: "Key generated, published to DNS and signing enabled for the domain. Not a checklist item you inherit.",
  },
  {
    icon: KeyRound,
    title: "A verified credential",
    body: "The sending credential is checked against Google before hand-off. No app passwords, no per-mailbox secrets to store.",
  },
  {
    icon: Plug,
    title: "Plain SMTP",
    body: "Point the sequencer you already use at the mailboxes. Infrabox sits underneath your sending tool, not in place of it.",
  },
  {
    icon: Repeat,
    title: "Retries, not failures",
    body: "A step that is merely slow is retried on its own schedule. Verification alone gets 40 attempts before anyone calls it broken.",
  },
];

function Features() {
  return (
    <Section aria-labelledby="features-heading">
      <SectionShell index="01" label="what you get">
        <SectionHeading
          id="features-heading"
          title="A mailbox that is finished, not one that is started."
          lede="Everything below is done before the mailbox is handed over. There is no post-purchase checklist and no Admin Console session waiting for you."
        />

        <CellGrid columns={4} className="mt-12">
          {FEATURES.map((f) => (
            <FeatureCell key={f.title} icon={f.icon} title={f.title}>
              {f.body}
            </FeatureCell>
          ))}
        </CellGrid>
      </SectionShell>
    </Section>
  );
}

/* ============================================================ how it works */

function HowItWorks() {
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

        {/* A ledger rather than a card grid: the steps are a sequence with
            durations, and a sequence reads better as rows than as tiles. */}
        <ol className="mt-12 border-t border-border">
          {PIPELINE.map((step, i) => (
            <li
              key={step.key}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-1 border-b border-border py-5 sm:grid-cols-[3rem_11rem_minmax(0,1fr)_5rem] sm:items-baseline sm:gap-x-6"
            >
              <span className="tabular font-mono text-xs text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[0.9375rem] font-semibold leading-snug">
                {step.label}
              </h3>
              <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:col-start-3">
                {step.short}
              </p>
              <span className="tabular col-start-2 font-mono text-xs text-muted-foreground sm:col-start-4 sm:text-right">
                ≈ {formatMinutes(step.typicalMinutes)}
              </span>
            </li>
          ))}
        </ol>

        <Note className="mt-10">
          <strong className="font-semibold text-foreground">
            {longest.label} is the long pole.
          </strong>{" "}
          Google will not let a domain send until it has proved ownership of it,
          and nameserver and DNS propagation is genuinely slow. That step alone
          budgets <span className="tabular">{formatMinutes(longest.typicalMinutes)}</span>{" "}
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

/* ============================================================== comparison */

type Row = {
  feature: string;
  detail: string;
  manual: string | false;
  infrabox: string | true;
};

/**
 * Deliberately not a competitor table. We have no verified data about any
 * other vendor's product, so the honest comparison is against the thing every
 * customer is actually doing today: setting this up by hand.
 */
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
    infrabox: true,
  },
  {
    feature: "MX, SPF, DMARC",
    detail: "The records that decide inbox versus spam",
    manual: "Hand-edited, easy to get subtly wrong",
    infrabox: true,
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
    infrabox: true,
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

function Comparison() {
  return (
    <Section divided aria-labelledby="comparison-heading">
      <SectionShell index="03" label="by hand vs infrabox">
        <SectionHeading
          id="comparison-heading"
          title="The same eight things happen either way."
          lede="This is not a competitor table — we have no verified data about anyone else's product. It is the job itself, done the way most teams do it today and the way Infrabox does it."
        />

        {/* Mobile: one block per row, the Infrabox half on ink. */}
        <div className="mt-12 divide-y divide-border border-y border-border lg:hidden">
          {COMPARISON.map((row) => (
            <div key={row.feature} className="py-5">
              <h3 className="text-[0.9375rem] font-semibold">{row.feature}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{row.detail}</p>
              <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-md border border-border text-xs">
                <div className="p-3">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                    By hand
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {renderCell(row.manual, "light")}
                  </p>
                </div>
                <div className="on-ink bg-ink p-3 text-ink-foreground">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-muted">
                    Infrabox
                  </p>
                  <p className="mt-2">{renderCell(row.infrabox, "ink")}</p>
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
                  className="w-[38%] border-b border-border px-6 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] font-normal text-muted-foreground"
                >
                  What has to happen
                </th>
                <th
                  scope="col"
                  className="border-b border-border px-6 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] font-normal text-muted-foreground"
                >
                  By hand
                </th>
                <th
                  scope="col"
                  className="on-ink bg-ink px-6 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] font-normal text-ink-foreground"
                >
                  Infrabox
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <th
                    scope="row"
                    className="border-b border-border px-6 py-4 font-normal align-top"
                  >
                    <span className="block text-sm font-semibold">
                      {row.feature}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {row.detail}
                    </span>
                  </th>
                  <td className="border-b border-border px-6 py-4 align-top text-sm text-muted-foreground">
                    {renderCell(row.manual, "light")}
                  </td>
                  <td className="on-ink border-b border-ink-border bg-ink px-6 py-4 align-top text-sm text-ink-foreground">
                    {renderCell(row.infrabox, "ink")}
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

function renderCell(value: string | boolean, ground: "light" | "ink") {
  if (value === true) {
    return (
      <>
        <Check
          aria-hidden
          className={`inline size-4 ${ground === "ink" ? "text-ink-foreground" : "text-brand"}`}
        />
        <span className="sr-only">Yes</span>
      </>
    );
  }
  if (value === false) {
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
  return value;
}

/* ================================================================= pricing */

function PricingTeaser() {
  return (
    <Section tone="muted" divided aria-labelledby="pricing-heading">
      <SectionShell index="04" label="pricing">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div>
            <Eyebrow>Per mailbox, per month</Eyebrow>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="tabular font-display text-[3.5rem] font-semibold leading-none tracking-[-0.045em]">
                {usd(MAILBOX_PRICE_USD)}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                / mailbox / mo
              </span>
            </p>
            <h2
              id="pricing-heading"
              className="mt-8 text-[1.75rem] font-semibold leading-[1.12] sm:text-[2.125rem]"
            >
              Plus the domain. Nothing for the provisioning itself.
            </h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              The eight steps are the product, so they are not a separate line
              item. Domains are priced per TLD on top of the mailbox price.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                `Domains carry a $${DOMAIN_MARKUP.standard} markup over the registrar's price, or $${DOMAIN_MARKUP.aged} once a domain is ${DOMAIN_MARKUP.agedThresholdYears}+ year old.`,
                "Pre-warmed domains are listed separately, at their own price.",
                "Checkout quotes the final price for the exact domain you pick.",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-sm text-muted-foreground">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/pricing">See full pricing</ButtonLink>
              <ButtonLink href="/get-started" variant="outline">
                Talk to us
              </ButtonLink>
            </div>
          </div>

          <div>
            <Eyebrow>Domain, per year</Eyebrow>
            <table className="mt-4 w-full border-t border-border text-sm">
              <caption className="sr-only">
                Base domain price per year by top-level domain, and the
                pre-warmed price where one is listed.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th
                    scope="col"
                    className="py-2.5 text-left font-mono text-[0.625rem] uppercase tracking-[0.14em] font-normal text-muted-foreground"
                  >
                    TLD
                  </th>
                  <th
                    scope="col"
                    className="py-2.5 text-right font-mono text-[0.625rem] uppercase tracking-[0.14em] font-normal text-muted-foreground"
                  >
                    Base
                  </th>
                  <th
                    scope="col"
                    className="py-2.5 text-right font-mono text-[0.625rem] uppercase tracking-[0.14em] font-normal text-muted-foreground"
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
                      className="py-3 text-left font-mono text-sm font-medium"
                    >
                      {row.tld}
                    </th>
                    <td className="tabular py-3 text-right">{usd(row.base)}</td>
                    <td className="tabular py-3 text-right text-muted-foreground">
                      {row.prewarmed === null ? "—" : usd(row.prewarmed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 font-mono text-[0.6875rem] leading-relaxed text-muted-foreground">
              Base prices before the markup above.
            </p>
          </div>
        </div>
      </SectionShell>
    </Section>
  );
}

/* ===================================================================== faq */

const FAQS: { q: string; a: string }[] = [
  {
    q: "What exactly does Infrabox provision?",
    a: "A domain and Google Workspace mailboxes on it, set up end to end: the domain is registered and pointed at DNS we manage, the Workspace and its admin account are created, MX, SPF and DMARC are published, Google's domain verification is completed, DKIM is generated and switched on, and a sending credential is minted and verified before it is handed to you.",
  },
  {
    q: "Do I need a Google login or an admin password?",
    a: "No. The platform holds the admin credential for the Workspace so the rest of the pipeline can run without you. You never see a Workspace signup form, and there is no Admin Console session to sit through per domain.",
  },
  {
    q: "How long does a mailbox take?",
    a: "We do not quote a single headline setup time, because the slowest step is not ours to control. Domain verification alone budgets several hours of retries: Google decides when it is satisfied, and DNS propagation cannot be hurried. The dashboard shows which of the eight steps a mailbox is on the whole way through, with the same per-step estimates this site quotes.",
  },
  {
    q: "Can I keep using my own sending tool?",
    a: "Yes — that is the point. The mailboxes speak ordinary SMTP, so you point the sequencer you already use at them. Infrabox is the infrastructure underneath your sending tool, not a replacement for it.",
  },
  {
    q: "What happens if a step fails?",
    a: "A step that is merely slow is retried rather than failed. Domain verification carries its own retry policy of 40 attempts on a backoff that widens to fifteen minutes, precisely because nameserver delegation routinely takes hours. A step that genuinely cannot complete surfaces as a failure on that mailbox, naming the step it stopped at, rather than disappearing.",
  },
  {
    q: "Do you support Microsoft 365, Azure or plain SMTP mailboxes?",
    a: "Not today. Google Workspace is the whole of the current product. We would rather say that plainly than list providers that are not built yet.",
  },
  {
    q: "What does it cost?",
    a: `Mailboxes are ${usd(MAILBOX_PRICE_USD)} per mailbox per month. Domains are priced per TLD, with a $${DOMAIN_MARKUP.standard} markup over the registrar's price, or $${DOMAIN_MARKUP.aged} once a domain is ${DOMAIN_MARKUP.agedThresholdYears}+ year old. Checkout quotes the final price for the exact domain you choose.`,
  },
];

function Faq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Section divided aria-labelledby="faq-heading" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SectionShell index="05" label="faq">
        <SectionHeading
          id="faq-heading"
          title="Questions, answered plainly."
          lede="Where the honest answer is “not yet”, that is the answer you will get here."
        />
        <div className="mt-10 max-w-3xl border-t border-border">
          {FAQS.map((faq, i) => (
            <Disclosure key={faq.q} question={faq.q} defaultOpen={i === 0}>
              {faq.a}
            </Disclosure>
          ))}
        </div>
      </SectionShell>
    </Section>
  );
}

/* ===================================================================== cta */

function ClosingCta() {
  return (
    <Section
      tone="ink"
      aria-labelledby="cta-heading"
      className="ink-gradient relative overflow-hidden"
    >
      <div aria-hidden className="dot-field absolute inset-0" />
      <div aria-hidden className="accent-edge absolute inset-x-0 top-0 h-px" />
      <Container className="relative flex flex-col gap-10 py-20 lg:flex-row lg:items-end lg:justify-between lg:py-24">
        <div className="max-w-xl">
          <Eyebrow tone="ink">Get started</Eyebrow>
          <h2
            id="cta-heading"
            className="mt-5 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] text-ink-foreground"
          >
            Tell us what you need to send.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-foreground/70">
            How many mailboxes, on how many domains, and which tool you send
            with. We will tell you what it costs and what the pipeline will do
            with it.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <ButtonLink href="/get-started" variant="inverse" size="lg">
            Get started
            <ArrowRight aria-hidden />
          </ButtonLink>
          <ButtonLink href="/pricing" variant="outlineInverse" size="lg">
            See pricing
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
