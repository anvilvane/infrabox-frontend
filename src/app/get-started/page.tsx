import type { Metadata } from "next";
import {
  ArrowRight,
  Clock,
  Globe,
  KeyRound,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";
import * as React from "react";

import {
  ArrowLink,
  Band,
  CheckList,
  InlineLink,
  PageHero,
  Strip,
  Tile,
  TileGrid,
} from "@/app/_marketing/page-parts";
import {
  DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN,
  DOMAIN_CONNECTION_LIMIT,
  GOOGLE_MAILBOXES_PER_DOMAIN_MAX,
  SITE_VERIFICATION_RETRY,
} from "@/app/_marketing/facts";
import {
  ButtonLink,
  Card,
  Cell,
  CellGrid,
  Container,
  Eyebrow,
  Note,
  Section,
  Tag,
  buttonClass,
} from "@/components/ui";
import {
  RELAY_AUTH_METHODS,
  RELAY_DAILY_LIMIT,
  RELAY_HOST,
  RELAY_MAX_MESSAGE_MB,
  RELAY_PORT,
  RELAY_SECURITY,
} from "@/content/relay";
import {
  DOMAIN_MARKUP,
  MAILBOX_PRICE_USD,
  PIPELINE,
  SITE_URL,
  TLD_PRICES,
  usd,
} from "@/lib/product";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "What to have ready before the first mailbox goes up, the eight steps Infrabox runs for you with their typical durations, what you hold at the end, and what it costs.",
  alternates: { canonical: "/get-started" },
};

/* There is no server behind this build, so the contact route is a mailto with
   the three things we actually need already scaffolded into the body. */
const CONTACT_EMAIL = "hello@infrabox.io";
const CONTACT_HREF =
  `mailto:${CONTACT_EMAIL}` +
  `?subject=${encodeURIComponent("Infrabox - getting started")}` +
  `&body=${encodeURIComponent(
    [
      "Domain I want to send from (or: please register one):",
      "",
      "Mailboxes I need:",
      "",
      "The tool I send with:",
      "",
    ].join("\n"),
  )}`;

/** The slowest single step, named rather than averaged into a headline. */
const LONGEST_STEP = PIPELINE.reduce((a, b) =>
  b.typicalMinutes > a.typicalMinutes ? b : a,
);

const CHEAPEST_TLD = TLD_PRICES.reduce((a, b) => (b.base < a.base ? b : a));
/** Registration plus the standard markup — what the calculator charges. */
const CHEAPEST_DOMAIN_FIRST_YEAR = CHEAPEST_TLD.base + DOMAIN_MARKUP.standard;

function humanDuration(minutes: number) {
  if (minutes < 60) return `~${minutes} min`;
  const hours = minutes / 60;
  return `~${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr`;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Get started",
      item: `${SITE_URL}/get-started`,
    },
  ],
};

/** One row of a mono spec sheet. */
function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="tabular text-right text-[0.8125rem] font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Get started"
        title="Two things from you. Eight steps from us."
        aside={
          <Card className="p-6">
            <Eyebrow>At a glance</Eyebrow>
            <div className="mt-4">
              <SpecRow
                label="Per mailbox"
                value={`${usd(MAILBOX_PRICE_USD)} / month`}
              />
              <SpecRow
                label="Domain"
                value={`from ${usd(CHEAPEST_DOMAIN_FIRST_YEAR)} / year`}
              />
              <SpecRow
                label="Per domain"
                value={`${DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN} mailboxes, up to ${GOOGLE_MAILBOXES_PER_DOMAIN_MAX}`}
              />
              <SpecRow
                label="Setup"
                value={`${PIPELINE.length} steps, unattended`}
              />
              <SpecRow label="Sending" value={`${RELAY_HOST}:${RELAY_PORT}`} />
            </div>
            <a
              href={CONTACT_HREF}
              className={buttonClass({ className: "mt-6 w-full" })}
            >
              Email us what you need
              <ArrowRight aria-hidden />
            </a>
            <p className="mt-3 text-center font-mono text-[0.6875rem] tracking-[0.08em] text-muted-foreground">
              {CONTACT_EMAIL}
            </p>
          </Card>
        }
      >
        <p>
          Getting started means handing over a domain and telling us which tool
          you send with. Everything after that — the Workspace order, the admin
          account, MX, SPF and DMARC, Google&apos;s ownership check, DKIM and a
          sending credential — runs without you in the loop.
        </p>
        <p>
          This page is the whole shape of it: what to have ready, what runs,
          what you hold at the end, what it costs, and what happens on the one
          step that is genuinely slow.
        </p>
      </PageHero>

      {/* --------------------------------------------- 01 before you begin */}
      <Band
        id="before"
        index="01"
        label="before you begin"
        eyebrow="What you need"
        title="Have these ready."
        lede="Nothing else is required up front. There is no Workspace signup form to fill in and no Admin Console to learn — the admin account is created and held on the platform side so the rest can run unattended."
      >
        <TileGrid columns={3} className="mt-10">
          <Tile index={0} title="A domain to send from">
            Bring one you already own, or have Infrabox register one for you.
            Either way its DNS is delegated to us, because the setup writes the
            verification, MX, SPF, DMARC and DKIM records itself rather than
            emailing you a list to paste in.
          </Tile>
          <Tile index={1} title="The tool you already send with">
            You do not change sequencer. Mailboxes are handed back as ordinary
            SMTP, so anything that takes a host, a port and a username works —
            no app password to generate, no consent screen to click through.
          </Tile>
          <Tile index={2} title="A rough mailbox count">
            {DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN} mailboxes per domain by
            default, raisable to {GOOGLE_MAILBOXES_PER_DOMAIN_MAX}, and up to{" "}
            {DOMAIN_CONNECTION_LIMIT} domains connected in one batch. An
            estimate is fine — the{" "}
            <InlineLink href="/pricing/calculator">calculator</InlineLink> will
            total it up.
          </Tile>
        </TileGrid>
      </Band>

      {/* ------------------------------------------------- 02 what we run */}
      <Band
        id="pipeline"
        index="02"
        label="what runs"
        tone="muted"
        eyebrow="The pipeline"
        title="The eight steps, and how long each usually takes."
        lede="These are the same steps and the same typical durations the provisioning screen shows while it works. They run in this order, and each has to finish before the next begins."
      >
        <ol className="mt-10 border-t border-border">
          {PIPELINE.map((step, i) => (
            <li
              key={step.key}
              className="grid gap-x-8 gap-y-2 border-b border-border py-5 lg:grid-cols-[3rem_minmax(0,1fr)_5.5rem]"
            >
              <span className="tabular font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-brand lg:pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[0.9375rem] font-semibold leading-snug">
                  {step.label}
                </h3>
                <p className="mt-1.5 max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {step.short}
                </p>
              </div>
              <span className="tabular font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground lg:pt-1 lg:text-right">
                {humanDuration(step.typicalMinutes)}
              </span>
            </li>
          ))}
        </ol>

        <Note className="mt-8">
          These are estimates, not promises, and there is deliberately no single
          headline number here. {LONGEST_STEP.label} alone is typically{" "}
          {humanDuration(LONGEST_STEP.typicalMinutes)}, and it is Google, not
          Infrabox, that decides when a domain is confirmed.
        </Note>

        <div className="mt-8">
          <ArrowLink href="/how-it-works">
            The long version of each step
          </ArrowLink>
        </div>
      </Band>

      {/* ------------------------------------------------ 03 what you get */}
      <Band
        id="outcome"
        index="03"
        label="what you get"
        eyebrow="At the end"
        title="Working mailboxes, and a credential that has been tested."
        lede="Not a provisioning ticket and not a checklist. The credential step calls Google with the credential rather than issuing it and hoping, so a mailbox that is marked ready has already been proved against Google."
      >
        <CellGrid columns={2} className="mt-10">
          <Cell>
            <Mail aria-hidden className="size-[1.125rem] text-brand" />
            <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">
              Google Workspace mailboxes on your domain
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Real Workspace accounts, not forwarders or aliases. Your domain is
              attached as a secondary domain on a Workspace, and the mailboxes
              live on it.
            </p>
          </Cell>
          <Cell>
            <KeyRound aria-hidden className="size-[1.125rem] text-brand" />
            <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">
              An SMTP credential verified against Google
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Minted for the mailbox and checked by actually calling Google with
              it. There is no app password to store and no 2-step verification
              prompt to work around.
            </p>
          </Cell>
          <Cell>
            <ShieldCheck aria-hidden className="size-[1.125rem] text-brand" />
            <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">
              Authentication already published
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              MX, SPF and DMARC written with the values Google expects, and a
              DKIM key generated, published to DNS and switched on for the
              domain.{" "}
              <InlineLink href="/deliverability">
                What those records do
              </InlineLink>
              .
            </p>
          </Cell>
          <Cell>
            <Clock aria-hidden className="size-[1.125rem] text-brand" />
            <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">
              A renewal schedule
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              The final step puts the mailbox on its renewal schedule, so it
              does not quietly lapse in the middle of a campaign.
            </p>
          </Cell>
        </CellGrid>
      </Band>

      {/* ------------------------------------------------------ 04 connect */}
      <Band
        id="connect"
        index="04"
        label="connect it"
        tone="muted"
        eyebrow="Your sequencer"
        title="Point the tool you already use at the relay."
        lede="Mailboxes are reached over one SMTP relay, so a sending tool is set up the way it always is — host, port, username, password — and the relay hands the message to Google."
      >
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14">
          <Card className="h-fit p-6">
            <Eyebrow>Relay settings</Eyebrow>
            <div className="mt-4">
              <SpecRow label="Host" value={RELAY_HOST} />
              <SpecRow label="Port" value={RELAY_PORT} />
              <SpecRow label="Security" value={RELAY_SECURITY} />
              <SpecRow label="Auth" value={RELAY_AUTH_METHODS.join(" / ")} />
              <SpecRow label="Username" value="The mailbox address" />
              <SpecRow
                label="Daily cap"
                value={`${RELAY_DAILY_LIMIT.toLocaleString("en-US")} / mailbox`}
              />
              <SpecRow
                label="Max message"
                value={`${RELAY_MAX_MESSAGE_MB} MB`}
              />
            </div>
          </Card>

          <div>
            <CheckList
              items={[
                "Set the tool's From address to the mailbox address exactly — Google refuses a mismatch, and that is not something the relay can paper over.",
                "The daily cap runs from midnight UTC to midnight UTC, and only successful sends count against it.",
                "Transient failures come back as 4xx on purpose, so your tool retries a mailbox instead of writing the address off as dead.",
                "Nothing changes in the campaign itself — only the sending account it points at.",
              ]}
            />
            <div className="mt-8">
              <ArrowLink href="/guides/smtp-relay">
                Connecting your sending tool
              </ArrowLink>
            </div>
          </div>
        </div>
      </Band>

      {/* --------------------------------------------------- 05 what it costs */}
      <Band
        id="cost"
        index="05"
        label="what it costs"
        eyebrow="Pricing"
        title="Two line items."
        lede="A monthly price per mailbox, and the domain once a year if we register it for you. Checkout quotes the final domain price, because the registrar's own price is what it is built on."
      >
        <CellGrid columns={2} className="mt-10">
          <Cell>
            <Send aria-hidden className="size-[1.125rem] text-brand" />
            <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">
              Mailboxes
            </h3>
            <p className="tabular mt-3 text-3xl font-semibold tracking-[-0.03em]">
              {usd(MAILBOX_PRICE_USD)}
              <span className="ml-2 text-[0.8125rem] font-normal tracking-normal text-muted-foreground">
                per mailbox / month
              </span>
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Charged per mailbox, however many domains they are spread across.
            </p>
          </Cell>
          <Cell>
            <Globe aria-hidden className="size-[1.125rem] text-brand" />
            <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug">
              Domains, if we register them
            </h3>
            <p className="tabular mt-3 text-3xl font-semibold tracking-[-0.03em]">
              from {usd(CHEAPEST_DOMAIN_FIRST_YEAR)}
              <span className="ml-2 text-[0.8125rem] font-normal tracking-normal text-muted-foreground">
                per year, by TLD
              </span>
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Registration is priced per TLD — {CHEAPEST_TLD.tld} is the
              cheapest at {usd(CHEAPEST_TLD.base)} — plus a flat{" "}
              {usd(DOMAIN_MARKUP.standard)} markup, or{" "}
              {usd(DOMAIN_MARKUP.aged)} on a domain already{" "}
              {DOMAIN_MARKUP.agedThresholdYears * 12}+ months old. Bring your
              own domain and this line is zero.
            </p>
          </Cell>
        </CellGrid>

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
          <ArrowLink href="/pricing">The full price list</ArrowLink>
          <ArrowLink href="/pricing/calculator">Total up your setup</ArrowLink>
        </div>
      </Band>

      {/* ------------------------------------------------ 06 when it is slow */}
      <Band
        id="slow"
        index="06"
        label="when it is slow"
        tone="muted"
        eyebrow="Waiting and failure"
        title="One step waits on Google. It keeps asking rather than giving up."
        lede="Domain verification is the long pole, and slowness there is normal rather than a symptom of something broken. Nameserver delegation and DNS propagation are outside anyone's control, so that step is built to retry for hours."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Tag>{SITE_VERIFICATION_RETRY.maxAttempts} attempts</Tag>
          <Tag>
            {SITE_VERIFICATION_RETRY.initialDelaySeconds}s first delay
          </Tag>
          <Tag>
            doubling, capped at {SITE_VERIFICATION_RETRY.maxDelayMinutes} min
          </Tag>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-12">
          <div>
            <h3 className="text-[0.9375rem] font-semibold">
              What you will see
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              The pipeline sits on {LONGEST_STEP.label.toLowerCase()} while it
              waits. The steps behind it stay done, nothing is rolled back, and
              the steps after it pick up the moment Google confirms.
            </p>
          </div>
          <div>
            <h3 className="text-[0.9375rem] font-semibold">
              If something genuinely fails
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              An unfulfillable order is caught by the first step in a second,
              rather than halfway through a Google setup. Anything that stops
              later is ours to chase — email us and we will tell you which step
              it is on and what it is waiting for.
            </p>
          </div>
        </div>

        <Note className="mt-10">
          Every other step retries too, on the shared policy of five attempts a
          minute apart. Verification has its own longer policy because, in the
          provisioning code&apos;s own words, nameserver delegation routinely
          takes hours.
        </Note>
      </Band>

      {/* ------------------------------------------------------------ strip */}
      <Strip id="gs-read" heading="Before you commit">
        <p>
          <InlineLink href="/how-it-works">How it works</InlineLink> walks
          through each of the {PIPELINE.length} steps in full,{" "}
          <InlineLink href="/deliverability">deliverability</InlineLink> covers
          what the published records actually do and where we stop making
          claims, and the <InlineLink href="/resources/faq">FAQ</InlineLink> is
          where the &quot;not yet&quot; answers live.
        </p>
      </Strip>

      {/* ------------------------------------------------------ closing CTA */}
      <Section tone="ink" divided aria-labelledby="gs-cta-heading">
        <Container className="py-16 lg:py-24">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <Eyebrow tone="ink">Next step</Eyebrow>
              <h2
                id="gs-cta-heading"
                className="mt-4 text-3xl font-semibold leading-[1.08] text-ink-foreground sm:text-4xl"
              >
                Tell us the domain and the mailbox count.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                One email is enough to start: the domain you want to send from
                or would like registered, roughly how many mailboxes, and the
                tool you send with. We come back with the real total and what
                the pipeline will be waiting on.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={CONTACT_HREF}
                className={buttonClass({ variant: "inverse", size: "lg" })}
              >
                Email {CONTACT_EMAIL}
                <ArrowRight aria-hidden />
              </a>
              <ButtonLink
                href="/pricing/calculator"
                variant="outlineInverse"
                size="lg"
              >
                Price it first
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
