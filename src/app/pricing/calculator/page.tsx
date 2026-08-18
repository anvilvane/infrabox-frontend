import type { Metadata } from "next";

import { Rails, Section } from "@/components/ui";
import {
  ArrowLink,
  Band,
  CtaBand,
  FaqList,
  InlineLink,
  PageHero,
  Tile,
  TileGrid,
  type FaqItem,
} from "@/app/_marketing/page-parts";
import {
  DOMAIN_MARKUP,
  MAILBOX_PRICE_USD,
  SITE_URL,
  TLD_PRICES,
  usd,
} from "@/lib/product";
import { Estimate } from "./estimate";

export const metadata: Metadata = {
  title: "Pricing calculator",
  description: `Work out what a sending setup costs: ${usd(MAILBOX_PRICE_USD)} per Google Workspace mailbox per month, plus domain registration priced per TLD with a $${DOMAIN_MARKUP.standard} or $${DOMAIN_MARKUP.aged} platform markup.`,
  alternates: { canonical: "/pricing/calculator" },
};

const EXAMPLE_TLD = TLD_PRICES.find((t) => t.tld === ".com") ?? TLD_PRICES[0];
const EXAMPLE = { domains: 5, perDomain: 3 } as const;
const EXAMPLE_MAILBOXES = EXAMPLE.domains * EXAMPLE.perDomain;
const EXAMPLE_MONTHLY = EXAMPLE_MAILBOXES * MAILBOX_PRICE_USD;
const EXAMPLE_DOMAINS =
  EXAMPLE.domains * (EXAMPLE_TLD.base + DOMAIN_MARKUP.standard);

const STEPS = [
  {
    title: "Count the mailboxes",
    body: `Domains multiplied by mailboxes on each. Every Google Workspace mailbox is ${usd(MAILBOX_PRICE_USD)} a month — the tenth and the thousandth cost the same, because the eight provisioning steps are the same work either way.`,
  },
  {
    title: "Price the domains",
    body: "Registration is per TLD, per year. A pre-warmed domain has its own registration figure rather than a surcharge bolted onto the standard one.",
  },
  {
    title: "Add the platform markup",
    body: `A flat $${DOMAIN_MARKUP.standard} per domain, or $${DOMAIN_MARKUP.aged} once the domain is ${DOMAIN_MARKUP.agedThresholdYears * 12} months or older. Aged domains cost more because the history is what is being bought.`,
  },
  {
    title: "Split it by billing period",
    body: "Mailboxes recur monthly, domains yearly. That is why the estimate shows a first month and a first twelve months rather than one blended figure that flatters whichever we wanted to look small.",
  },
];

const PAYING_FOR = [
  {
    title: "What the mailbox price covers",
    body: "The Workspace mailbox and the whole provisioning run behind it: admin account, MX, SPF and DMARC, domain verification with Google, DKIM, and a sending credential verified before hand-off.",
  },
  {
    title: "Why there are no tiers",
    body: "No volume band and no seat minimum on this list. Provisioning the two-hundredth mailbox costs us the same eight steps as the second, so it costs you the same too.",
  },
  {
    title: "The cost people forget",
    body: "Not the mailbox — the hours. Nameserver delegation, a mistyped SPF include, a DKIM key nobody switched on because it lives three menus deep. None of that appears on an invoice, and it is what actually gets expensive.",
  },
  {
    title: "What it does not cover",
    body: "Your sending tool. Infrabox is the infrastructure underneath a sequencer, not a replacement for one, so whatever you pay your sequencer is unchanged and separate.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Is this a quote?",
    a: (
      <p>
        No. It is the published price list with your numbers put into it. The
        registrar&rsquo;s price for a specific name, whether that name is even
        available, and how old it actually is are things we only know once you
        pick it — so the binding total appears at checkout, before you commit to
        anything.
      </p>
    ),
  },
  {
    q: "How many mailboxes should I put on one domain?",
    a: (
      <>
        <p>
          We are not going to invent a number for that. It depends on your
          volume per mailbox and how much risk you want concentrated on a single
          domain, and any figure quoted as a rule on a pricing page is
          somebody&rsquo;s guess dressed up as guidance.
        </p>
        <p>
          The mechanical part we can tell you: the price is per mailbox, not per
          domain, so spreading the same mailbox count across more domains costs
          you more domains and exactly the same mailbox bill.
        </p>
      </>
    ),
  },
  {
    q: "Why is the domain a separate line?",
    a: (
      <p>
        Because it is a separate purchase on a separate billing period. A domain
        is registered for a year at a price the registrar sets per TLD; a
        mailbox is a monthly subscription. Blending them into one
        &ldquo;per mailbox&rdquo; number would make the mailbox look more
        expensive than it is and the domain look free.
      </p>
    ),
  },
  {
    q: "What is the difference between pre-warmed and aged here?",
    a: (
      <p>
        Two different controls because they are two different things in our
        pricing. Pre-warmed selects a different registration price for the
        domain. Age changes the platform markup — ${DOMAIN_MARKUP.standard}{" "}
        under {DOMAIN_MARKUP.agedThresholdYears * 12} months, $
        {DOMAIN_MARKUP.aged} at or over it.
      </p>
    ),
  },
  {
    q: "Do I get a discount for buying a lot?",
    a: (
      <p>
        Not on this list — the unit price is the unit price. If your volume is
        large enough that you want to talk about it,{" "}
        <InlineLink href="/get-started">tell us the shape of it</InlineLink> and
        you will get a real answer rather than a banner promising one.
      </p>
    ),
  },
  {
    q: "How long until the mailboxes actually work?",
    a: (
      <p>
        Longer than a pricing page usually admits. Seven of the eight
        provisioning steps are quick; domain verification with Google is not,
        because it waits on DNS propagation and Google&rsquo;s own checks.{" "}
        <InlineLink href="/how-it-works">
          The step-by-step page gives the typical duration of each
        </InlineLink>{" "}
        and is honest about which one dominates.
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Pricing calculator",
        item: `${SITE_URL}/pricing/calculator`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Infrabox pricing is calculated",
    description:
      "Work out the cost of a cold-email sending setup from the per-mailbox price, the per-TLD domain registration price and the platform markup.",
    step: STEPS.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.body,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is the Infrabox pricing calculator a quote?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It applies the published price list to your numbers. The binding total for specific domains appears at checkout, because registrar prices, availability and recorded domain age vary per name.",
        },
      },
      {
        "@type": "Question",
        name: "How much does an Infrabox mailbox cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${usd(MAILBOX_PRICE_USD)} per Google Workspace mailbox per month, with no volume tiers or seat minimums. Domains are a separate yearly line priced per TLD.`,
        },
      },
    ],
  },
];

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Pricing calculator"
        title="Put your numbers into the price list."
        meta={[
          { label: "mailbox", value: `${usd(MAILBOX_PRICE_USD)} / mo` },
          { label: "domain", value: "Per TLD, per year" },
          {
            label: "markup",
            value: `$${DOMAIN_MARKUP.standard} or $${DOMAIN_MARKUP.aged}`,
          },
          { label: "volume tiers", value: "None" },
          { label: "sign-up needed", value: "None" },
        ]}
        metaCaption="Arithmetic on the published price list. The binding total is quoted at checkout."
      >
        <p>
          Two inputs decide almost everything: how many domains, and how many
          Google Workspace mailboxes on each. What follows is the published
          price list doing arithmetic — no lead capture in front of the number,
          and no &ldquo;contact us&rdquo; where a figure should be.
        </p>
      </PageHero>

      <Section divided aria-labelledby="estimate-heading">
        <Rails className="py-14 lg:py-20">
          <h2 id="estimate-heading" className="sr-only">
            Estimate your setup
          </h2>
          <Estimate />
        </Rails>
      </Section>

      {/* ---------------------------------------------------- the arithmetic */}
      <Band
        id="how-priced" index="01" label="the arithmetic"
        eyebrow="The arithmetic"
        title="How the number above is built."
        lede="Four operations, in this order. If you would rather do it on paper, these are the same four steps."
      >
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <Tile title={step.title} index={i}>
                {step.body}
              </Tile>
            </li>
          ))}
        </ol>

        <div className="mt-8 max-w-2xl rounded-md border border-border bg-muted p-5">
          <h3 className="text-sm font-semibold text-foreground">
            Worked example
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {EXAMPLE.domains} {EXAMPLE_TLD.tld} domains, newly registered, with{" "}
            {EXAMPLE.perDomain} mailboxes on each.
          </p>
          <dl className="tabular mt-4 grid gap-2 text-xs text-muted-foreground">
            <div className="flex justify-between gap-4">
              <dt>
                Mailboxes: {EXAMPLE_MAILBOXES} &times;{" "}
                {usd(MAILBOX_PRICE_USD)}
              </dt>
              <dd className="font-medium text-foreground">
                {usd(EXAMPLE_MONTHLY)} / month
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>
                Domains: {EXAMPLE.domains} &times; ({usd(EXAMPLE_TLD.base)} + $
                {DOMAIN_MARKUP.standard})
              </dt>
              <dd className="font-medium text-foreground">
                {usd(EXAMPLE_DOMAINS)} / year
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2">
              <dt className="font-medium text-foreground">First month</dt>
              <dd className="font-semibold text-foreground">
                {usd(EXAMPLE_MONTHLY + EXAMPLE_DOMAINS)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-foreground">
                Every month after
              </dt>
              <dd className="font-semibold text-foreground">
                {usd(EXAMPLE_MONTHLY)}
              </dd>
            </div>
          </dl>
        </div>
      </Band>

      {/* ----------------------------------------------------- paying for */}
      <Band
        id="paying-for" index="02" label="what you pay for"
        eyebrow="What you are paying for"
        title="The line items, and the one that is not on the invoice."
        tone="muted"
      >
        <TileGrid columns={2} className="mt-10">
          {PAYING_FOR.map((item) => (
            <Tile key={item.title} title={item.title}>
              {item.body}
            </Tile>
          ))}
        </TileGrid>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The full price list, including every TLD and the pre-warmed column, is
          on the <InlineLink href="/pricing">pricing page</InlineLink>.
        </p>
      </Band>

      <Band id="calc-faq" index="03" label="questions" eyebrow="Questions" title="Before you get to checkout.">
        <FaqList items={FAQS} />
        <div className="mt-10">
          <ArrowLink href="/how-it-works">
            See what happens after you buy
          </ArrowLink>
        </div>
      </Band>

      <CtaBand
        title="Want the real total for your list?"
        body="Send us the domains and mailbox counts you have in mind and we will price them properly rather than approximately."
        secondary={{ href: "/pricing", label: "Full price list" }}
      />
    </>
  );
}
