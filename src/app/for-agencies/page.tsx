import type { Metadata } from "next";

import { ButtonLink, Rails, Section } from "@/components/ui";
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
  DOMAIN_CONNECTION_LIMIT,
  GOOGLE_MAILBOXES_PER_DOMAIN_MAX,
  TEAM_ROLES,
} from "@/app/_marketing/facts";
import { RELAY_DAILY_LIMIT } from "@/content/relay";
import { MAILBOX_PRICE_USD, PIPELINE, SITE_URL, usd } from "@/lib/product";

export const metadata: Metadata = {
  title: "For agencies",
  description:
    "Standing up sending infrastructure for many clients at once: a workspace per client, member roles, batch domain connection, and a flat per-mailbox price with no seat minimums or volume tiers.",
  alternates: { canonical: "/for-agencies" },
};

const TOTAL_STEP_MINUTES = PIPELINE.reduce((n, s) => n + s.typicalMinutes, 0);
const TOTAL_HOURS = Math.round((TOTAL_STEP_MINUTES / 60) * 4) / 4;

const PAIN = [
  {
    title: "The work multiplies, the fee does not",
    body: "Setting up one client's sending domains is an afternoon. Twelve clients is the same afternoon twelve times, and none of them is billable in a way anyone enjoys explaining.",
  },
  {
    title: "The mistakes are invisible until they are expensive",
    body: "A missed DKIM toggle or a mangled SPF record throws no error. It surfaces six weeks later as a client asking why reply rates fell off a cliff — and by then the domain has a history.",
  },
  {
    title: "Everything ends up in one person's browser",
    body: "Admin Console sessions, registrar logins, a spreadsheet of credentials. Works right up until that person is on holiday, or leaves.",
  },
  {
    title: "Clients churn, infrastructure does not",
    body: "Domains and mailboxes outlive engagements. Without a boundary between one client's estate and the next, offboarding becomes an archaeology project.",
  },
];

const WORKFLOW = [
  {
    title: "A workspace per client",
    body: "Keep each client's domains and mailboxes in their own workspace and switch between them. One account, separate estates, no spreadsheet mapping domains to logos.",
  },
  {
    title: "Buy the domains",
    body: "Registered through the platform and pointed at DNS we manage — the precondition for anything automatic happening afterwards, because the records have to be writable.",
  },
  {
    title: "Ask for the mailboxes",
    body: "Say how many on each domain. Every one runs the same eight provisioning steps, in the same order, without an Admin Console session from you.",
  },
  {
    title: "Watch, rather than chase",
    body: "The dashboard shows which of the eight steps each mailbox is on. A mailbox that is taking a while is legible instead of mysterious — the difference between a status update and an apology.",
  },
  {
    title: "Hand off over SMTP",
    body: "Point the client's sequencer, or yours, at the relay. No Google logins to share, no app passwords to store, nothing to rotate when a contractor rolls off.",
  },
];

const BUILT_FOR_THIS = [
  <>
    <span className="font-medium text-foreground">
      Multiple workspaces on one account.
    </span>{" "}
    Separate a client&rsquo;s domains and mailboxes from every other
    client&rsquo;s, and move between them without signing out.
  </>,
  <>
    <span className="font-medium text-foreground">Member roles.</span> Team
    members are {TEAM_ROLES.slice(0, -1).join(", ")} or{" "}
    {TEAM_ROLES[TEAM_ROLES.length - 1]}, with billing permission held as a
    separate flag — so a strategist can see the estate without holding the card.
  </>,
  <>
    <span className="font-medium text-foreground">
      Batch domain connection.
    </span>{" "}
    Up to {DOMAIN_CONNECTION_LIMIT} domains connected in a batch by default,
    adjustable per account. Onboarding a client is not a hundred single clicks.
  </>,
  <>
    <span className="font-medium text-foreground">One flat mailbox price.</span>{" "}
    {usd(MAILBOX_PRICE_USD)} per mailbox per month whether it is your fifth or
    your five-hundredth. No volume band to negotiate into, no seat minimum to
    grow towards.
  </>,
  <>
    <span className="font-medium text-foreground">
      Credentials that are not secrets you hold.
    </span>{" "}
    Sending credentials are issued by us and shown once. No shared Google
    password living in a document that outlives the engagement.
  </>,
];

const FAQS: FaqItem[] = [
  {
    q: "Is there an agency plan or a volume discount?",
    a: (
      <p>
        There is no agency tier on the public price list and no volume band —{" "}
        {usd(MAILBOX_PRICE_USD)} per mailbox per month is the price at every
        quantity. If your volume is large enough that you want a different
        commercial arrangement,{" "}
        <InlineLink href="/get-started">tell us the shape of it</InlineLink>{" "}
        rather than reading a number off a banner written to make you call
        anyway.
      </p>
    ),
  },
  {
    q: "Can I resell this to my clients under my own brand?",
    a: (
      <p>
        There is a white-label partner arrangement, and it is a conversation
        rather than a self-serve signup — so it is not priced on this site. If
        that is what you are after, say so when you get in touch and we will
        talk about it properly instead of quoting you something generic.
      </p>
    ),
  },
  {
    q: "Do my clients need their own logins?",
    a: (
      <p>
        Not for the infrastructure. Workspaces and member roles are how the
        estate is divided and who can see what; the mailboxes themselves are
        used through whatever sending tool the campaign runs in, over SMTP.
      </p>
    ),
  },
  {
    q: "How long does onboarding a client actually take?",
    a: (
      <p>
        Your part is short — pick domains, say how many mailboxes. The
        provisioning run is not: the typical durations in our own progress model
        sum to roughly {TOTAL_HOURS} hours per mailbox, and about five-sevenths
        of that is a single step waiting for Google to verify domain ownership.
        Plan client kickoffs around that rather than around a number a marketing
        page made up.{" "}
        <InlineLink href="/how-it-works">Here is the breakdown</InlineLink>.
      </p>
    ),
  },
  {
    q: "How many mailboxes can I run per client?",
    a: (
      <p>
        The default allowance is {DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN} Google
        mailboxes per domain, raisable per account to{" "}
        {GOOGLE_MAILBOXES_PER_DOMAIN_MAX}, and each mailbox is capped at{" "}
        {RELAY_DAILY_LIMIT.toLocaleString("en-US")} messages a day to stay
        inside what Google allows. Capacity comes from more domains and more
        mailboxes, so the arithmetic is straightforward — the{" "}
        <InlineLink href="/pricing/calculator">calculator</InlineLink> will do
        it for you.
      </p>
    ),
  },
  {
    q: "What happens when a client leaves?",
    a: (
      <p>
        The domains and mailboxes are assets on the account that holds them, and
        keeping each client in its own workspace is what makes that boundary
        clean. Mailboxes are billed per mailbox per month, so the bill follows
        the count when the count changes.
      </p>
    ),
  },
  {
    q: "Do you handle the campaigns too?",
    a: (
      <p>
        No. Infrabox is the infrastructure underneath a sequencer — not a
        sequencer, and not an agency. You keep the tool you already run
        campaigns in; we make sure the domains and mailboxes it sends from were
        set up properly.
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
        name: "For agencies",
        item: `${SITE_URL}/for-agencies`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Infrabox offer an agency plan or volume discount?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `No. Mailboxes are ${usd(MAILBOX_PRICE_USD)} per mailbox per month at every quantity, with no volume tiers and no seat minimums. Larger commercial arrangements are handled by getting in touch.`,
        },
      },
      {
        "@type": "Question",
        name: "How does an agency separate one client's mailboxes from another's?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each client can be kept in its own workspace on a single account, and team members hold owner, admin or member roles with billing permission granted as a separate flag.",
        },
      },
    ],
  },
];

export default function ForAgenciesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="For agencies"
        title="The same setup, twelve times, without twelve afternoons."
      >
        <p>
          Nothing about standing up a client&rsquo;s sending domains is
          intellectually difficult. It is just long, fiddly, easy to get subtly
          wrong, and it repeats per client — the worst possible combination of
          properties for work a person does by hand.
        </p>
        <p>
          Infrabox turns that repetition into a pipeline: domains registered,
          DNS connected, Google Workspace mailboxes provisioned through the same
          eight steps every time, and handed to whatever sequencer the campaign
          runs in.
        </p>
      </PageHero>

      {/* ------------------------------------------------------------- pain */}
      <Band
        id="pain" index="01" label="at scale"
        eyebrow="At agency scale"
        title="What actually breaks when it is not one client, it is twelve."
      >
        <TileGrid columns={2} className="mt-10">
          {PAIN.map((item) => (
            <Tile key={item.title} title={item.title}>
              {item.body}
            </Tile>
          ))}
        </TileGrid>
      </Band>

      {/* --------------------------------------------------------- workflow */}
      <Band
        id="workflow" index="02" label="workflow"
        eyebrow="The workflow"
        title="Onboarding a client, end to end."
        lede="Five things you do. The eight provisioning steps sit underneath step three and run without you."
        tone="muted"
      >
        <ol className="mt-10 grid gap-3">
          {WORKFLOW.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-x-6 gap-y-2 rounded-md border border-border bg-background p-5 sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <span className="tabular font-mono text-sm text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <ArrowLink href="/how-it-works">
            What the eight steps do, and how long each takes
          </ArrowLink>
        </div>
      </Band>

      {/* --------------------------------------------------- built for this */}
      <Band
        id="built" index="03" label="what exists"
        eyebrow="What exists for this"
        title="The parts of the product that are about running many estates."
        lede="Not a separate agency edition — the same product, with the pieces that matter once the count goes up."
      >
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <CheckList items={BUILT_FOR_THIS} />

          <div className="space-y-5">
            <div className="rounded-md border border-border bg-muted p-5">
              <h3 className="text-sm font-semibold text-foreground">
                What we are not going to pretend
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                There is no client-facing white-label dashboard you can drop a
                logo into today, no automated client reporting, and no
                deliverability guarantee to put in a proposal. Google Workspace
                is the only mailbox platform on sale.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                We would rather you found that out on this page than three weeks
                into an engagement.
              </p>
            </div>

            <div className="rounded-md border border-border bg-brand-tint p-5">
              <h3 className="text-sm font-semibold text-foreground">
                The price at any volume
              </h3>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="tabular font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                  {usd(MAILBOX_PRICE_USD)}
                </span>
                <span className="text-xs text-muted-foreground">
                  / mailbox / month
                </span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Plus the domains, priced per TLD per year.
              </p>
              <ButtonLink
                href="/pricing/calculator"
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Estimate a client estate
              </ButtonLink>
            </div>
          </div>
        </div>
      </Band>

      {/* -------------------------------------------------------------- faq */}
      <Band
        id="agency-faq" index="04" label="questions"
        eyebrow="Questions"
        title="The ones agencies actually ask."
      >
        <FaqList items={FAQS} />
      </Band>

      {/* ---------------------------------------------------- compare strip */}
      <Section divided aria-labelledby="compare-link-heading">
        <Rails className="py-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2
                id="compare-link-heading"
                className="text-lg font-semibold text-foreground"
              >
                Weighing this against doing it in-house?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We wrote the comparison out honestly, including the cases where
                the other approach is the right one.
              </p>
            </div>
            <ArrowLink href="/compare">Read the comparisons</ArrowLink>
          </div>
        </Rails>
      </Section>

      <CtaBand
        title="Tell us how many clients."
        body="How many client estates, how many domains each, and which sequencer they run in. We will come back with a real total and a realistic timeline."
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
