import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { ButtonLink, Pill, Rails, Section } from "@/components/ui";
import {
  ArrowLink,
  Band,
  CheckList,
  CtaBand,
  FaqList,
  InlineLink,
  PageHero,
  Tile,
  TileGrid,
  type FaqItem,
} from "@/app/_marketing/page-parts";
import {
  DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN,
  GOOGLE_MAILBOXES_PER_DOMAIN_MAX,
} from "@/app/_marketing/facts";
import { RELAY_DAILY_LIMIT } from "@/content/relay";
import {
  DOMAIN_MARKUP,
  MAILBOX_PRICE_USD,
  SITE_URL,
  TLD_PRICES,
  usd,
} from "@/lib/product";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Google Workspace mailboxes at ${usd(MAILBOX_PRICE_USD)} per mailbox per month, plus domain registration priced per TLD. What is included, what is not, and what is quoted at checkout.`,
  alternates: { canonical: "/pricing" },
};

const INCLUDED = [
  "The Google Workspace mailbox itself",
  "MX, SPF and DMARC published for the domain",
  "Domain verification with Google",
  "DKIM key generated, published and signing enabled",
  "A sending credential, verified against Google before hand-off",
  "SMTP access from the sending tool you already use",
  "Live provisioning status for every mailbox",
  "Renewal scheduled as the final provisioning step",
];

const NOT_INCLUDED = [
  {
    title: "Your sending tool",
    body: "Infrabox is the infrastructure underneath a sequencer, not a sequencer. Whatever you pay yours is separate and unchanged.",
  },
  {
    title: "A deliverability guarantee",
    body: "No inbox-placement rate on this list and no service level behind it, because no measurement in our systems would honestly support one.",
  },
  {
    title: "Mailbox platforms other than Google",
    body: "Google Workspace is what is on sale today. Everything else is roadmap, and roadmap does not get a price on a pricing page.",
  },
  {
    title: "Reading mail programmatically",
    body: "The sending credential sends; it does not include IMAP. Replies do arrive at the mailbox, because MX is published during provisioning.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Is there a minimum, a contract, or a setup fee?",
    a: (
      <p>
        None of the three. Mailboxes are billed per mailbox per month and
        domains per year; the eight provisioning steps are the product rather
        than a service charged on top of it.
      </p>
    ),
  },
  {
    q: "Do I get a discount at volume?",
    a: (
      <p>
        The published price is the same at every quantity — provisioning the
        five-hundredth mailbox is the same eight steps as the fifth.{" "}
        <InlineLink href="/get-started">Get in touch</InlineLink> if your volume
        is large enough that you want to discuss it, and you will get a real
        answer rather than a banner promising one.
      </p>
    ),
  },
  {
    q: "Why is the domain price only an estimate until checkout?",
    a: (
      <p>
        Because the registrar sets it, it moves, and it depends on the specific
        name — whether it is available at all, and how old it already is, which
        decides whether the ${DOMAIN_MARKUP.standard} or the $
        {DOMAIN_MARKUP.aged} markup applies. The table above is the price list;
        checkout quotes the name you actually picked.
      </p>
    ),
  },
  {
    q: "How many mailboxes can I put on one domain?",
    a: (
      <p>
        The default allowance is {DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN} Google
        mailboxes per domain, raisable per account to{" "}
        {GOOGLE_MAILBOXES_PER_DOMAIN_MAX}. Each mailbox is separately capped at{" "}
        {RELAY_DAILY_LIMIT.toLocaleString("en-US")} messages a day, which
        mirrors what Google allows a Workspace user rather than being a tier we
        sell past.
      </p>
    ),
  },
  {
    q: "Is there a free trial?",
    a: (
      <p>
        There is no trial defined anywhere in our systems, so there is not one
        advertised here. If you want to start small, start small — the price is
        per mailbox, and one mailbox is a valid order.
      </p>
    ),
  },
  {
    q: "What am I paying for, given the mailbox is Google's?",
    a: (
      <p>
        The provisioning. Google sells the mailbox; what costs you a week is
        registering the domain, connecting DNS, publishing MX, SPF and DMARC
        correctly, getting the domain verified, turning DKIM on, and arriving at
        a credential a sending tool can actually use — on every domain,
        identically.{" "}
        <InlineLink href="/compare/workspace-direct">
          That comparison, written out properly
        </InlineLink>
        .
      </p>
    ),
  },
  {
    q: "When does the mailbox start working?",
    a: (
      <p>
        After the eight steps finish, and the honest answer is hours rather than
        minutes — dominated by Google&rsquo;s domain verification, which waits
        on DNS propagation.{" "}
        <InlineLink href="/how-it-works">
          Every step&rsquo;s typical duration is published
        </InlineLink>{" "}
        rather than averaged into one flattering headline number.
      </p>
    ),
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: `${SITE_URL}/pricing`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Infrabox Google Workspace mailbox",
    description:
      "A Google Workspace mailbox provisioned end to end: domain connected, MX, SPF and DMARC published, domain verified with Google, DKIM enabled, and a sending credential verified before hand-off.",
    brand: { "@type": "Brand", name: "Infrabox" },
    offers: {
      "@type": "Offer",
      price: MAILBOX_PRICE_USD,
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing`,
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does an Infrabox mailbox cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${usd(MAILBOX_PRICE_USD)} per Google Workspace mailbox per month, plus domain registration priced per TLD per year with a $${DOMAIN_MARKUP.standard} platform markup on a newly registered domain or $${DOMAIN_MARKUP.aged} on one already ${DOMAIN_MARKUP.agedThresholdYears * 12} months or older.`,
        },
      },
      {
        "@type": "Question",
        name: "Is there a minimum order, a contract or a setup fee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Mailboxes are billed per mailbox per month and domains per year. There is no separate provisioning or onboarding charge.",
        },
      },
      {
        "@type": "Question",
        name: "Does Infrabox offer volume discounts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The published price is the same at every quantity. Larger commercial arrangements are handled by getting in touch rather than by a published tier.",
        },
      },
    ],
  },
];

/**
 * The one price on the site, given the dark ground so it carries the hero
 * rather than sitting in it as another pale box. Every figure resolves through
 * `@/lib/product`; there is no numeric literal in here.
 */
function PriceCard() {
  return (
    <div className="on-ink ink-gradient relative isolate overflow-hidden rounded-lg border border-ink-border">
      <div
        aria-hidden
        className="dot-field pointer-events-none absolute inset-0 -z-10"
      />
      <div className="p-7">
        <Pill tone="ink">Google Workspace mailbox</Pill>
        <p className="mt-6 flex items-baseline gap-2">
          <span className="tabular font-display text-[3.25rem] font-semibold leading-none tracking-[-0.04em] text-ink-foreground">
            {usd(MAILBOX_PRICE_USD)}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            / mbx / mo
          </span>
        </p>
        <p className="mt-5 text-sm leading-relaxed text-ink-foreground/75">
          The same price at every quantity. Renewal is scheduled as the last
          provisioning step, so a mailbox does not quietly lapse mid-campaign.
        </p>

        <dl className="mt-6 border-t border-ink-border pt-4 text-sm">
          {[
            { term: "Minimum order", detail: "1 mailbox" },
            { term: "Contract", detail: "None" },
            { term: "Setup fee", detail: "None" },
            {
              term: "Domain markup",
              detail: `$${DOMAIN_MARKUP.standard} or $${DOMAIN_MARKUP.aged}`,
            },
          ].map((item) => (
            <div
              key={item.term}
              className="flex items-baseline justify-between gap-4 border-b border-ink-border/60 py-2.5 last:border-b-0"
            >
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                {item.term}
              </dt>
              <dd className="tabular text-sm font-medium text-ink-foreground">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>

        <ButtonLink
          href="/get-started"
          variant="inverse"
          size="lg"
          className="mt-7 w-full"
        >
          Get started
          <ArrowRight aria-hidden />
        </ButtonLink>
        <p className="mt-4 text-center text-xs text-ink-muted">
          Plus the domain, priced per TLD below.
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Pricing"
        title="Two line items. The mailbox, and the domain it lives on."
        aside={<PriceCard />}
      >
        <p>
          There is no separate charge for provisioning, no onboarding fee and no
          per-record DNS billing. The eight setup steps are the product, not an
          add-on to it.
        </p>
        <div className="pt-2">
          <ArrowLink href="/pricing/calculator">
            Put your own numbers into it
          </ArrowLink>
        </div>
      </PageHero>

      {/* -------------------------------------------------------- included */}
      <Band
        id="included" index="01" label="included"
        eyebrow="Included"
        title="What every mailbox arrives with."
        lede={
          <>
            All of it is done before the mailbox reaches you. There is no
            post-purchase checklist, and none of these lines is a paid add-on.
          </>
        }
      >
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <CheckList items={INCLUDED} columns={2} />
          <div className="rounded-md border border-border bg-muted p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Volume changes nothing
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The unit price does not move with quantity, because the work does
              not. Provisioning the thousandth mailbox is the same eight steps
              as the first — so there is no tier to negotiate into and no seat
              minimum to grow towards.
            </p>
          </div>
        </div>
      </Band>

      {/* --------------------------------------------------------- domains */}
      <Band
        id="domains" index="02" label="domains"
        eyebrow="Domains"
        title="Priced per TLD, per year."
        lede={
          <>
            On top of the registration price there is a flat platform markup: $
            {DOMAIN_MARKUP.standard} for a newly registered domain, or $
            {DOMAIN_MARKUP.aged} for one already{" "}
            {DOMAIN_MARKUP.agedThresholdYears * 12} months or older — aged
            domains cost more because the history is the thing being bought.
          </>
        }
      >
        <div className="mt-10 max-w-4xl overflow-hidden rounded-md border border-border">
          <div className="-mx-px overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Domain registration prices per TLD, before and after the flat
                platform markup on a newly registered domain
              </caption>
              <colgroup>
                <col className="w-[8rem]" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr className="bg-muted">
                  <th
                    scope="col"
                    className="px-5 py-3.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    TLD
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-right font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Registration / yr
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-right font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Pre-warmed / yr
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-right font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-foreground"
                  >
                    New domain, yr 1
                  </th>
                </tr>
              </thead>
              <tbody>
                {TLD_PRICES.map((row) => (
                  <tr
                    key={row.tld}
                    className="border-t border-border transition-colors hover:bg-muted/60"
                  >
                    <th
                      scope="row"
                      className="px-5 py-3.5 text-left font-mono text-sm font-medium text-foreground"
                    >
                      {row.tld}
                    </th>
                    <td className="tabular px-5 py-3.5 text-right font-mono text-[0.8125rem] text-muted-foreground">
                      {usd(row.base)}
                    </td>
                    <td className="tabular px-5 py-3.5 text-right font-mono text-[0.8125rem] text-muted-foreground">
                      {row.prewarmed === null ? "—" : usd(row.prewarmed)}
                    </td>
                    <td className="tabular px-5 py-3.5 text-right font-mono text-[0.8125rem] font-medium text-foreground">
                      {usd(row.base + DOMAIN_MARKUP.standard)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The last column is the first two added together — registration plus
          the ${DOMAIN_MARKUP.standard} markup on a newly registered name — and
          nothing else. Registrar prices move, and availability and recorded age
          vary per name, so the exact total for a specific domain is quoted at
          checkout before you commit to it. Pre-warmed domains carry their own
          registration figure rather than a surcharge on the standard one, and
          the {DOMAIN_MARKUP.agedThresholdYears * 12}-month markup is $
          {DOMAIN_MARKUP.aged} rather than ${DOMAIN_MARKUP.standard}.
        </p>
        <div className="mt-6">
          <ArrowLink href="/pricing/calculator">
            Work out a total for your setup
          </ArrowLink>
        </div>
      </Band>

      {/* ---------------------------------------------------- not included */}
      <Band
        id="not-included" index="03" label="exclusions"
        eyebrow="Not included"
        title="What the price does not cover."
        lede="A price list that only lists what you get is half a price list."
        tone="muted"
      >
        <TileGrid columns={2} className="mt-10">
          {NOT_INCLUDED.map((item) => (
            <Tile key={item.title} title={item.title}>
              {item.body}
            </Tile>
          ))}
        </TileGrid>
      </Band>

      {/* ----------------------------------------------------------- scope */}
      <Band
        id="scope" index="04" label="scope"
        eyebrow="Scope"
        title="What Infrabox sells today."
        lede="The pricing above is the whole price list, and this is the whole product it prices."
        tone="ink"
      >
        <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-ink-foreground/75">
          <p>
            Google Workspace mailboxes, on domains registered and connected
            through Infrabox, delivered to your sending tool over SMTP. That is
            it.
          </p>
          <p>
            Other mailbox platforms are on the roadmap rather than on sale. When
            they ship they will get their own line here with their own number —
            not a footnote implying they already exist.
          </p>
        </div>

        <dl className="mt-10 grid max-w-3xl gap-px overflow-hidden rounded-md border border-ink-border bg-ink-border sm:grid-cols-2">
          {[
            { term: "On sale", detail: "Google Workspace mailboxes" },
            { term: "Billed", detail: "Per mailbox, per month" },
            { term: "Delivered over", detail: "SMTP, to your own tool" },
            { term: "Not on sale yet", detail: "Every other mailbox platform" },
          ].map((item) => (
            <div key={item.term} className="bg-ink px-5 py-4">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                {item.term}
              </dt>
              <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink-foreground">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </Band>

      {/* ------------------------------------------------------------- faq */}
      <Band id="pricing-faq" index="05" label="questions" eyebrow="Questions" title="Before you spend anything.">
        <FaqList items={FAQS} />
      </Band>

      {/* --------------------------------------------------------- related */}
      <Section divided aria-labelledby="related-heading">
        <Rails className="py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <h2
              id="related-heading"
              className="text-lg font-semibold text-foreground"
            >
              Working out whether it is worth it?
            </h2>
            <p className="leading-relaxed text-muted-foreground md:col-span-2">
              The <InlineLink href="/pricing/calculator">calculator</InlineLink>{" "}
              turns the list above into a total for your setup.{" "}
              <InlineLink href="/compare">The comparisons</InlineLink> weigh
              this against doing it by hand, against a generic relay, and
              against buying Workspace seats directly — including the cases
              where those win.{" "}
              <InlineLink href="/for-agencies">For agencies</InlineLink> covers
              running many client estates on one account.
            </p>
          </div>
        </Rails>
      </Section>

      <CtaBand
        title="Want a number for your volume?"
        body="Tell us how many mailboxes across how many domains and we will come back with the real total."
        secondary={{ href: "/pricing/calculator", label: "Use the calculator" }}
      />
    </>
  );
}
