import type { Metadata } from "next";

import { Cell, CellGrid } from "@/components/ui";
import {
  ArrowLink,
  Band,
  CheckList,
  CtaBand,
  DotList,
  FaqList,
  InlineLink,
  PageHero,
  type FaqItem,
} from "@/app/_marketing/page-parts";
import {
  DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN,
  GOOGLE_MAILBOXES_PER_DOMAIN_MAX,
  SITE_VERIFICATION_RETRY,
} from "@/app/_marketing/facts";
import {
  RELAY_DAILY_LIMIT,
  RELAY_HOST,
  RELAY_PORT,
  RELAY_SECURITY,
} from "@/content/relay";
import { PIPELINE, SITE_URL } from "@/lib/product";

export const metadata: Metadata = {
  title: "Authentication & deliverability",
  description:
    "MX, SPF, DKIM, DMARC and Google's domain verification, published as part of provisioning rather than left as a checklist — and a plain account of what authentication does and does not decide.",
  alternates: { canonical: "/deliverability" },
};

/* Pulled by key so this copy cannot drift from the pipeline definition. */
const stepFor = (key: string) => PIPELINE.find((s) => s.key === key)!;
const DNS_STEP = stepFor("workspace_dns");
const VERIFY_STEP = stepFor("site_verification");
const DKIM_STEP = stepFor("dkim");

/** The four DNS records, each one a record type — hence the mono names. */
const RECORDS = [
  {
    title: "MX",
    answers: "Where does mail go?",
    body: "Says where mail for the domain should be delivered. Without it the domain cannot receive — and a sending domain that cannot take a reply is not a sending domain, it is a leak.",
  },
  {
    title: "SPF",
    answers: "Who may send as you?",
    body: "Lists which servers may send as the domain. One stray include, one lookup too many, and receivers stop treating the domain as authorised. The easiest record to get subtly wrong.",
  },
  {
    title: "DKIM",
    answers: "Was it altered?",
    body: "The signature proving a message was not altered in transit. Google exposes the key only through the Admin Console, which is why it is the record most setups quietly skip.",
  },
  {
    title: "DMARC",
    answers: "What if they disagree?",
    body: "Tells receivers what to do when SPF and DKIM disagree with the visible From address. Publishing a policy is the difference between having an opinion about your domain and having none.",
  },
];

const BY_HAND_FAILS = [
  "The SPF record is edited by hand and gains an extra include, or trips the DNS lookup limit.",
  "DKIM never gets switched on, because the toggle is several menus deep and nothing breaks visibly when it is off.",
  "DMARC is never published at all, so receivers are left to guess.",
  "Verification is attempted once, fails because DNS has not propagated, and is quietly abandoned.",
  "It is all done correctly on the first domain, then approximately on the next nine.",
];

const FAQS: FaqItem[] = [
  {
    q: "Does Infrabox guarantee my mail reaches the inbox?",
    a: (
      <>
        <p>
          No, and be wary of anyone who does. Authentication decides whether a
          receiver can tell your mail is really yours and unaltered. It does not
          decide whether the person receiving it wants it — and that second
          thing is most of what modern filtering is actually measuring.
        </p>
        <p>
          We publish no inbox-placement percentage, because we have no
          measurement that would honestly support one.
        </p>
      </>
    ),
  },
  {
    q: "So what does DKIM actually buy me?",
    a: (
      <>
        <p>
          Our own provisioning code puts it about as plainly as it can be put: a
          mailbox with no DKIM record still sends and still receives — it just
          signs nothing, so its deliverability is worse. Qualitatively worse.
          There is no number attached to that sentence in our codebase and there
          is not going to be one on this page.
        </p>
        <p>
          It is also the one provisioning step allowed to fail without blocking
          the mailbox, for exactly that reason. If it does fail, the dashboard
          says so rather than hiding it.
        </p>
      </>
    ),
  },
  {
    q: "Why does domain verification take so long?",
    a: (
      <p>
        Because it is Google&rsquo;s check, not ours, and it waits on nameserver
        delegation and DNS propagation — which routinely take hours and are
        outside anyone&rsquo;s control. The step is built to wait rather than
        fail: up to {SITE_VERIFICATION_RETRY.maxAttempts} attempts, backing off
        from {SITE_VERIFICATION_RETRY.initialDelaySeconds} seconds to a{" "}
        {SITE_VERIFICATION_RETRY.maxDelayMinutes}-minute ceiling.{" "}
        <InlineLink href="/how-it-works">
          The full step-by-step timing is here
        </InlineLink>
        .
      </p>
    ),
  },
  {
    q: "Do I connect my sending tool to Google?",
    a: (
      <p>
        No. Your tool connects to the Infrabox relay over ordinary SMTP with a
        credential we issue. It never sees a Google login screen, never needs an
        app password, and never has to clear a 2-step verification prompt.{" "}
        <InlineLink href="/guides/smtp-relay">
          The relay guide has the settings
        </InlineLink>
        .
      </p>
    ),
  },
  {
    q: "Is there a sending limit per mailbox?",
    a: (
      <p>
        Yes — {RELAY_DAILY_LIMIT.toLocaleString("en-US")} messages per mailbox
        per day by default, in a window that resets at UTC midnight. That figure
        is not a commercial lever; it mirrors what Google enforces for a
        Workspace user, and a cap set above it would just mean failures one hop
        later.
      </p>
    ),
  },
  {
    q: "Can I read replies over this connection?",
    a: (
      <p>
        Not with the SMTP credential — it sends, and that is all it does. There
        is no IMAP in it. The MX records published during provisioning mean the
        mailbox genuinely receives, so replies land; getting them into your tool
        is a separate connection.
      </p>
    ),
  },
  {
    q: "How many mailboxes should I put on a domain?",
    a: (
      <p>
        The default allowance is {DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN} Google
        mailboxes per domain, raisable per account to{" "}
        {GOOGLE_MAILBOXES_PER_DOMAIN_MAX}. What the right number is for your
        volume is a judgement about concentration risk, not a fact we have, so
        we are not going to print one as though it were.
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
        name: "Authentication & deliverability",
        item: `${SITE_URL}/deliverability`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Infrabox guarantee inbox placement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Infrabox publishes the authentication records — MX, SPF, DKIM and DMARC — and completes Google's domain verification. Authentication establishes that mail is genuinely from your domain and unaltered; it does not determine whether a recipient wants the message. Infrabox publishes no inbox-placement percentage.",
        },
      },
      {
        "@type": "Question",
        name: "How does a sending tool connect to an Infrabox mailbox?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Over ordinary SMTP: host ${RELAY_HOST}, port ${RELAY_PORT}, ${RELAY_SECURITY}, authenticating with an Infrabox-issued username and password. The sending tool never signs in to Google and never needs an app password.`,
        },
      },
      {
        "@type": "Question",
        name: "Is there a daily sending limit per mailbox?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${RELAY_DAILY_LIMIT} messages per mailbox per day by default, resetting at UTC midnight. The cap mirrors the limit Google enforces for a Workspace user.`,
        },
      },
    ],
  },
];

export default function DeliverabilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Authentication & deliverability"
        title="The records that decide whether your domain is believed."
        meta={[
          { label: "records", value: "MX · SPF · DKIM · DMARC" },
          { label: "verified by", value: "Google" },
          { label: "connection", value: `SMTP · port ${RELAY_PORT}` },
          {
            label: "daily cap",
            value: `${RELAY_DAILY_LIMIT.toLocaleString("en-US")} / mailbox`,
          },
          { label: "placement rate", value: "Not claimed" },
        ]}
        metaCaption="The last row is not an omission. It is the point of the section headed “where the line is”."
      >
        <p>
          Before a receiving server decides where your message goes, it asks a
          much duller question first: is this domain who it says it is? That is
          answered entirely by DNS records and one verification check — and
          those are the part Infrabox can genuinely do for you, so they are what
          this page is about.
        </p>
        <p>
          What happens after that question — whether the person wanted the
          message — is not something any infrastructure vendor can sell you. We
          would rather state the line than blur it.
        </p>
      </PageHero>

      {/* ------------------------------------------------------- the records */}
      <Band
        id="records" index="01" label="the records"
        eyebrow="What gets checked"
        title="Five things a receiver looks at."
        lede="Four are DNS records, and each one answers exactly one question. The fifth is not a record at all — it is a gate Google puts in front of the domain before it will carry any mail."
      >
        <CellGrid columns={4} className="mt-10">
          {RECORDS.map((record) => (
            <Cell key={record.title} className="flex flex-col">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-brand">
                {record.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] font-semibold leading-snug text-foreground">
                {record.answers}
              </p>
              <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {record.body}
              </p>
            </Cell>
          ))}
        </CellGrid>

        {/* The two things that are not records, kept out of the record grid. */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-muted p-5">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              Not a record — a gate
            </p>
            <h3 className="mt-2.5 text-[0.9375rem] font-semibold text-foreground">
              Google&rsquo;s domain verification
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Google will not let a domain send at all until it has confirmed
              you own it, and Google decides when it is satisfied. It is step{" "}
              {PIPELINE.findIndex((s) => s.key === "site_verification") + 1} of{" "}
              {PIPELINE.length}, and it is the one that takes the longest.
            </p>
          </div>
          <div className="rounded-md border border-border bg-background p-5">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              And what none of them decide
            </p>
            <h3 className="mt-2.5 text-[0.9375rem] font-semibold text-foreground">
              Whether the recipient wanted it
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              All five answer identity, not welcome — which is why getting every
              one of them right is necessary and still not sufficient. That
              distinction is the whole reason this page has a section headed
              &ldquo;where the line is&rdquo;.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ArrowLink href="/guides/spf-dkim-dmarc">
            How each record works, in detail
          </ArrowLink>
        </div>
      </Band>

      {/* -------------------------------------------------- hand vs pipeline */}
      <Band
        id="by-hand" index="02" label="failure modes"
        eyebrow="Why it goes wrong"
        title="None of this is hard. All of it is easy to get slightly wrong."
        lede="Every failure below is silent. Nothing throws an error, no page goes down, and the domain keeps sending — into a spam folder, for weeks, until somebody notices the reply rate."
        tone="muted"
      >
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="rounded-md border border-border bg-background p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Doing it by hand
            </h3>
            <div className="mt-4">
              <DotList items={BY_HAND_FAILS} />
            </div>
          </div>

          <div className="rounded-md border border-border bg-brand-tint p-6">
            <h3 className="text-sm font-semibold text-foreground">
              What provisioning does instead
            </h3>
            <div className="mt-4">
              <CheckList
                items={[
                  <>
                    <span className="font-medium text-foreground">
                      {DNS_STEP.label}.
                    </span>{" "}
                    {DNS_STEP.short}
                  </>,
                  <>
                    <span className="font-medium text-foreground">
                      {VERIFY_STEP.label}.
                    </span>{" "}
                    {VERIFY_STEP.short}
                  </>,
                  <>
                    <span className="font-medium text-foreground">
                      {DKIM_STEP.label}.
                    </span>{" "}
                    {DKIM_STEP.short}
                  </>,
                  <>
                    The same steps run identically on the tenth domain as on the
                    first, because it is a pipeline rather than a person
                    following a checklist at 6pm.
                  </>,
                  <>
                    A step that is merely slow is retried rather than failed,
                    and the dashboard shows which step each mailbox is sitting
                    on.
                  </>,
                ]}
              />
            </div>
            <div className="mt-6">
              <ArrowLink href="/how-it-works">
                All eight steps, with timings
              </ArrowLink>
            </div>
          </div>
        </div>
      </Band>

      {/* --------------------------------------------------------- the relay */}
      <Band
        id="relay" index="03" label="the relay"
        eyebrow="Connecting your tool"
        title="Four fields, and no Google login anywhere in the process."
        lede={
          <>
            Infrabox runs its own SMTP relay. Your sequencer connects to it the
            way it connects to any SMTP server, and the relay delivers through
            Google on the mailbox&rsquo;s behalf — which is what makes automated
            provisioning possible at all.
          </>
        }
      >
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-14">
          <div className="overflow-hidden rounded-md border border-border">
            <p className="border-b border-border bg-muted px-5 py-3 font-mono text-xs text-muted-foreground">
              smtp connection
            </p>
            <dl className="text-sm">
              {[
                ["Host", RELAY_HOST],
                ["Port", String(RELAY_PORT)],
                ["Security", RELAY_SECURITY],
                ["Auth", "Username and password we issue"],
              ].map(([term, def]) => (
                <div
                  key={term}
                  className="flex items-baseline justify-between gap-6 border-b border-border px-5 py-3 last:border-b-0"
                >
                  <dt className="font-medium text-foreground">{term}</dt>
                  <dd className="tabular text-right font-mono text-xs text-muted-foreground">
                    {def}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6">
            <CheckList
              items={[
                <>
                  <span className="font-medium text-foreground">
                    No app passwords.
                  </span>{" "}
                  A freshly created Workspace user cannot generate one anyway —
                  app passwords need 2-step verification, which needs a sign-in,
                  which is exactly what Google challenges.{" "}
                  <InlineLink href="/guides/app-passwords">
                    Why that dead end exists
                  </InlineLink>
                  .
                </>,
                <>
                  <span className="font-medium text-foreground">
                    No Google sign-in.
                  </span>{" "}
                  Your sending tool authenticates to Infrabox. It never reaches
                  a Google login screen or a consent prompt.
                </>,
                <>
                  <span className="font-medium text-foreground">
                    No integration work.
                  </span>{" "}
                  If your sequencer can send over SMTP — and they all can — it
                  can send from these mailboxes today.
                </>,
                <>
                  <span className="font-medium text-foreground">
                    Sending only.
                  </span>{" "}
                  The credential sends; it does not include IMAP. Replies still
                  arrive, because MX was published during provisioning.
                </>,
              ]}
            />

            <div className="rounded-md border border-border bg-muted p-5">
              <h3 className="text-sm font-semibold text-foreground">
                The daily cap, and why it is where it is
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Each mailbox is capped at{" "}
                <span className="tabular font-medium text-foreground">
                  {RELAY_DAILY_LIMIT.toLocaleString("en-US")}
                </span>{" "}
                messages a day, in a window resetting at UTC midnight. That is
                not a pricing tier in disguise — it is set to mirror the limit
                Google enforces on a Workspace user. Raising it would not buy
                you throughput, it would buy you rejections one hop later.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                The default allowance is {DEFAULT_GOOGLE_MAILBOXES_PER_DOMAIN}{" "}
                mailboxes per domain, adjustable per account up to{" "}
                {GOOGLE_MAILBOXES_PER_DOMAIN_MAX}. Volume comes from more
                mailboxes and more domains, not from pushing one harder than
                Google allows.
              </p>
            </div>

            <ArrowLink href="/guides/smtp-relay">
              Full relay settings and error codes
            </ArrowLink>
          </div>
        </div>
      </Band>

      {/* ----------------------------------------------------- the honest bit */}
      <Band
        id="limits" index="04" label="where the line is"
        eyebrow="Where the line is"
        title="What this page deliberately does not claim."
        tone="ink"
      >
        <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-ink-foreground/75">
          <p>
            No inbox-placement rate. No &ldquo;95% of your mail lands&rdquo;. No
            deliverability guarantee and no money back if a campaign
            underperforms. None of those numbers exist in our systems, so
            printing one here would mean making it up.
          </p>
          <p>
            No claim that correct authentication makes a campaign work.
            Authentication is necessary and it is not sufficient. If the list is
            bad, the copy is generic or the volume is reckless, perfectly signed
            mail goes to spam — correctly.
          </p>
          <p>
            And no reliability figure attached to the DKIM step in particular.
            It is implemented, it runs as step{" "}
            {PIPELINE.findIndex((s) => s.key === "dkim") + 1} of{" "}
            {PIPELINE.length}, and it is the one step permitted to fail without
            blocking the mailbox. When it does fail, you are told.
          </p>
          <p className="text-ink-foreground/95">
            What is left after all that is a real and useful thing: the boring,
            error-prone, entirely mechanical work of standing a domain up
            correctly, done the same way every time.
          </p>
        </div>

        <dl className="mt-10 grid max-w-3xl gap-px overflow-hidden rounded-md border border-ink-border bg-ink-border sm:grid-cols-3">
          {[
            { term: "Placement rate published", detail: "None" },
            { term: "Deliverability guarantee", detail: "None" },
            { term: "DKIM reliability figure", detail: "None" },
          ].map((item) => (
            <div key={item.term} className="bg-ink px-5 py-4">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                {item.term}
              </dt>
              <dd className="mt-1.5 text-[0.9375rem] font-semibold text-ink-foreground">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band
        id="deliverability-faq" index="05" label="questions"
        eyebrow="Questions"
        title="The ones worth asking."
      >
        <FaqList items={FAQS} />
      </Band>

      <CtaBand
        title="Stand a domain up properly."
        body="Tell us how many mailboxes across how many domains, and which tool you send with. We will tell you what it costs and what to expect."
        secondary={{ href: "/pricing/calculator", label: "Estimate the cost" }}
      />
    </>
  );
}
