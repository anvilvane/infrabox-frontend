import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";

import { Disclosure, Rails, Section, SectionHeading } from "@/components/ui";
import { ArticleHeader, Callout, Pill, Prose } from "@/components/content";
import {
  MAILBOX_PRICE_USD,
  PIPELINE,
  SITE_URL,
  usd,
} from "@/lib/product";
import { RELAY_DAILY_LIMIT, RELAY_HOST, RELAY_PORT } from "@/content/relay";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "What happens when a mailbox fails, who the domain is registered to, whether you need your own Google Workspace, how to connect a sending tool, and what is not settled yet.",
};

/**
 * The typical end-to-end time, summed from the pipeline rather than written
 * down. If a step's duration changes in `product.ts`, this changes with it.
 */
const TOTAL_HOURS = Math.round(
  PIPELINE.reduce((sum, step) => sum + step.typicalMinutes, 0) / 60,
);

/**
 * Each entry carries both the rendered answer and a one-paragraph plain-text
 * version. The plain text is what goes into the FAQPage structured data, which
 * cannot contain markup. Keeping them adjacent is the only thing that stops
 * them disagreeing.
 */
type Item = {
  id: string;
  question: string;
  plain: string;
  answer: React.ReactNode;
};

const SECTIONS: { slug: string; heading: string; items: Item[] }[] = [
  {
    slug: "before-you-buy",
    heading: "Before you buy",
    items: [
      {
        id: "own-workspace",
        question: "Do I need my own Google Workspace account?",
        plain:
          "No. Infrabox holds a pool of Google Workspace accounts. Your domain is added to one of them as a secondary domain and your mailboxes are created inside it. You never sign up for Workspace, never see a Workspace bill, and never hold the admin password.",
        answer: (
          <>
            <p>
              No. Infrabox holds a pool of Google Workspace accounts. Your domain
              is added to one of them as a secondary domain, and your mailboxes
              are created inside it. You never see a Workspace signup form, never
              get a Workspace bill, and never hold the admin password — the
              platform holds it so the provisioning steps can run without you.
            </p>
            <p>
              The practical consequence worth understanding: your mailboxes live
              in an account Infrabox controls, not one you control. That is what
              makes unattended provisioning possible, and it is also the honest
              reason the &ldquo;what if I leave&rdquo; question below has the
              answer it does.
            </p>
          </>
        ),
      },
      {
        id: "existing-domain",
        question: "Can I use a domain I already own?",
        plain:
          "Yes. You can connect an existing domain instead of buying a new one, provided its DNS can be pointed at the Infrabox-managed zone so the MX, SPF, DMARC, verification and DKIM records can be published automatically.",
        answer: (
          <p>
            Yes. You can connect a domain you already own rather than buying a new
            one. The requirement is that its DNS be pointed at the zone Infrabox
            manages, because every step after that — MX, SPF, DMARC, the Google
            verification token, the DKIM key — works by writing records into that
            zone. A domain whose DNS you want to keep elsewhere is not a good fit
            for this.
          </p>
        ),
      },
      {
        id: "cost",
        question: "What does it actually cost?",
        plain: `Two line items: ${usd(MAILBOX_PRICE_USD)} per Google Workspace mailbox per month, and the domain registration, which is priced per TLD. There is no provisioning fee, onboarding fee or per-record DNS charge.`,
        answer: (
          <p>
            Two line items. {usd(MAILBOX_PRICE_USD)} per Google Workspace mailbox
            per month, and the domain registration, which is priced per TLD. There
            is no separate provisioning fee, no onboarding fee and no per-record
            DNS billing. The breakdown, including how domain pricing varies with
            the age of the domain, is on the{" "}
            <Link href="/pricing">pricing page</Link>.
          </p>
        ),
      },
      {
        id: "how-long",
        question: "How long does a mailbox take to be ready?",
        plain: `Roughly ${TOTAL_HOURS} hours end to end in the typical case, and most of that is a single step: waiting for Google to verify domain ownership. That step is paced by DNS propagation and by Google, not by Infrabox.`,
        answer: (
          <>
            <p>
              Roughly {TOTAL_HOURS} hours end to end in the typical case. That is
              an estimate, not a promise, and it is dominated by one step: waiting
              for Google to confirm it can see the domain-verification record.
            </p>
            <p>
              That wait is paced by DNS propagation and by Google&rsquo;s own
              checking schedule. Nobody — not Infrabox, not you, not a support
              ticket — makes it go faster. The per-step breakdown is on{" "}
              <Link href="/how-it-works">how it works</Link>, and the dashboard
              shows the same numbers live while a mailbox provisions.
            </p>
          </>
        ),
      },
    ],
  },
  {
    slug: "ownership",
    heading: "Ownership and leaving",
    items: [
      {
        id: "domain-owner",
        question: "Who is the domain registered to?",
        plain:
          "By default the domain is registered under Infrabox's own registrant identity, with WHOIS privacy enabled. You can opt in to using your own contact details as the registrant of record instead, and if the registrant identity matters to you, choose that at purchase.",
        answer: (
          <>
            <p>
              By default, under Infrabox&rsquo;s registrant identity, with WHOIS
              privacy enabled. There is an explicit opt-in to use{" "}
              <strong>your own contact details</strong> as the registrant of
              record instead.
            </p>
            <p>
              This is a real choice with real consequences, so it is worth making
              deliberately rather than by default. If the registrant identity
              matters to you — because the domain is an asset you intend to keep,
              or because your own name being in WHOIS is part of how you present
              — select your own identity at purchase.
            </p>
          </>
        ),
      },
      {
        id: "leaving",
        question: "What if I leave? Can I take the domains and mailboxes with me?",
        plain:
          "Domain transfer-out is not built yet — there is no self-service way to get an authorisation code and move a domain to another registrar, so leaving is currently a manual conversation. The mailboxes cannot move at all: they exist inside a Google Workspace account Infrabox holds, so they end when the subscription does.",
        answer: (
          <>
            <p>
              Two different answers, and the honest version of both is
              uncomfortable enough to state plainly.
            </p>
            <p>
              <strong>Domains:</strong> transfer-out is not built. There is no
              self-service path in the product today to obtain an authorisation
              code and move a domain to another registrar. Moving one is a manual
              conversation, not a button. If being able to walk away with your
              domains on your own schedule is a requirement, ask about it before
              you buy rather than after.
            </p>
            <p>
              <strong>Mailboxes:</strong> they cannot move. They exist as users
              inside a Google Workspace account Infrabox holds. There is no export
              that turns them into mailboxes in a Workspace you own — the account
              they live in is not yours to receive them into. When the subscription
              ends, the mailboxes end.
            </p>
          </>
        ),
      },
      {
        id: "can-you-read",
        question: "Can Infrabox read my mailboxes?",
        plain:
          "Technically yes. Mailbox credentials are minted through Google domain-wide delegation, which grants impersonation within the authorised scopes, and those scopes include reading Gmail. This is structural to how any provider that provisions Google mailboxes on your behalf operates.",
        answer: (
          <>
            <p>
              Technically, yes. Sending credentials are minted through Google
              domain-wide delegation, which is impersonation within an authorised
              scope list, and that list includes reading Gmail as well as sending.
            </p>
            <p>
              This is structural rather than a policy choice: any provider that
              provisions and operates Google mailboxes on your behalf holds
              something equivalent. What varies between providers is which scopes
              they took and what their contract says about using them. The
              mechanism is described in full in{" "}
              <Link href="/guides/domain-wide-delegation">
                the delegation guide
              </Link>
              , including what the scope list is limited to.
            </p>
          </>
        ),
      },
    ],
  },
  {
    slug: "failures",
    heading: "When things go wrong",
    items: [
      {
        id: "mailbox-fails",
        question: "What happens when a mailbox fails to provision?",
        plain:
          "A step that fails permanently marks the mailbox failed and stops the pipeline rather than continuing into a broken state. Transient failures retry automatically. There is currently no automatic replacement, refund or credit — a permanently failed mailbox is re-run by an operator.",
        answer: (
          <>
            <p>
              The pipeline distinguishes two kinds of failure, and the distinction
              is the useful part. A <strong>transient</strong> failure — Google
              rate-limiting, a network timeout, a slow propagation — retries on its
              own. A <strong>permanent</strong> failure marks the mailbox failed
              and stops, rather than pushing on into a half-configured state that
              looks alive and cannot send.
            </p>
            <p>
              What happens next is the part worth being straight about:{" "}
              <strong>
                there is no automatic replacement, refund or credit today.
              </strong>{" "}
              A permanently failed mailbox is re-run by an operator. The intended
              commitment — free replacement of a non-functional mailbox within a
              defined window — is drafted in section 6 of the{" "}
              <Link href="/legal/service-level-agreement">
                deliverability SLA
              </Link>
              , and that document is not in force.
            </p>
          </>
        ),
      },
      {
        id: "dkim-fails",
        question: "What if DKIM does not get set up?",
        plain:
          "DKIM is the one provisioning step that still depends on browser automation against Google's Admin Console, because Google exposes no API for it. A mailbox without DKIM can still send, but DMARC then has only SPF to align against, and SPF does not survive forwarding.",
        answer: (
          <>
            <p>
              DKIM is the one step that still depends on driving Google&rsquo;s
              Admin Console rather than calling an API, because Google exposes no
              API for it. It is therefore the step most likely to need attention.
            </p>
            <p>
              A mailbox without DKIM can still send. What it loses is a signing
              identity: DMARC then has only SPF to align against, and SPF does not
              survive forwarding. That is a description of what breaks, not a
              percentage — see{" "}
              <Link href="/guides/spf-dkim-dmarc">
                the authentication guide
              </Link>{" "}
              for what each record actually proves.
            </p>
          </>
        ),
      },
      {
        id: "suspension",
        question: "What if Google suspends a mailbox?",
        plain:
          "Google can suspend a mailbox or an entire Workspace account for its own reasons, on its own schedule, with no appeal that Infrabox controls. Provisioning checks account standing before configuring, so a suspended account fails early rather than midway.",
        answer: (
          <>
            <p>
              Google can suspend a mailbox, or an entire Workspace account, for its
              own reasons and on its own schedule. There is no appeal process
              Infrabox controls and no vendor can promise you otherwise.
            </p>
            <p>
              What the platform does do is check account standing before
              configuring anything, so a suspended account fails at the start of
              the pipeline rather than five steps in. Workspace accounts in the
              pool are also deliberately kept well below Google&rsquo;s ceiling on
              domains per account, so that a suspension affects a bounded set of
              domains rather than everything at once.
            </p>
          </>
        ),
      },
    ],
  },
  {
    slug: "sending",
    heading: "Sending",
    items: [
      {
        id: "connect-tool",
        question: "How do I connect my sending tool?",
        plain: `Over SMTP. Host ${RELAY_HOST}, port ${RELAY_PORT}, STARTTLS, username is the full mailbox address, and the password is a relay credential issued in the dashboard. It works with any tool that accepts SMTP settings.`,
        answer: (
          <>
            <p>
              Over SMTP, with settings any tool that accepts a custom SMTP server
              will take — Instantly, Smartlead, Lemlist and the rest all do. Host{" "}
              <code>{RELAY_HOST}</code>, port {RELAY_PORT}, STARTTLS, username is
              the full mailbox address, and the password is a relay credential you
              issue in the dashboard.
            </p>
            <p>
              That password is an Infrabox credential, not a Google one. Google is
              never consulted when your tool authenticates.{" "}
              <Link href="/guides/smtp-relay">The relay guide</Link> covers the
              settings, what happens to a message afterwards, and how to read the
              error codes.
            </p>
          </>
        ),
      },
      {
        id: "app-password",
        question: "Why don't I get a Google app password like everywhere else?",
        plain:
          "Because app passwords cannot be produced by automation. They require 2-step verification, only the account holder can enable 2-step verification, and a brand-new Workspace user cannot complete an automated sign-in because Google demands a phone number. The relay exists to remove that dependency.",
        answer: (
          <p>
            Because app passwords cannot be produced by automation at all. They
            require 2-step verification; only the account holder can enable
            2-step verification; and a brand-new Workspace user cannot complete an
            automated sign-in because Google demands a phone number it can text.
            Every link in that chain was tested against live Google, and the full
            account is in{" "}
            <Link href="/guides/app-passwords">
              why app passwords cannot be automated
            </Link>
            . The relay exists to remove the dependency rather than work around
            it.
          </p>
        ),
      },
      {
        id: "sending-limits",
        question: "How much can one mailbox send per day?",
        plain: `The relay applies a default cap of ${RELAY_DAILY_LIMIT.toLocaleString("en-US")} messages per mailbox per day, counted from midnight to midnight UTC. That is a technical ceiling, not a recommendation — Google applies its own limits underneath, and sending near the cap from a new mailbox risks suspension.`,
        answer: (
          <>
            <p>
              The relay applies a default cap of{" "}
              {RELAY_DAILY_LIMIT.toLocaleString("en-US")} messages per mailbox per
              day, counted midnight to midnight <strong>UTC</strong> — not your
              local midnight. Only successful sends count against it.
            </p>
            <p>
              Treat that as a ceiling, not a target. Google applies its own limits
              underneath, and sending anywhere near the cap from a new mailbox is
              a reliable way to get it suspended. Ramp deliberately.
            </p>
          </>
        ),
      },
    ],
  },
  {
    slug: "contracts",
    heading: "Contracts",
    items: [
      {
        id: "contracts",
        question: "Is there a contract, an SLA, or a privacy policy?",
        plain:
          "Partly. The Acceptable Use Policy and a deliverability SLA exist as drafts pending counsel review and are not in force. The Terms of Service, Privacy Policy and Refund Policy have not been written. Every legal page states which it is.",
        answer: (
          <>
            <p>
              Partly, and every page says which. The Acceptable Use Policy and a
              deliverability SLA exist as drafts pending review — they are
              published so they can be read and argued with, not because they bind
              anyone. The Terms of Service, Privacy Policy and Refund Policy have
              not been written, and those pages say so rather than being filled
              with plausible text.
            </p>
            <p>
              The <Link href="/legal">legal index</Link> lists all five with their
              status. If something in there needs settling before you can buy, say
              so on the <Link href="/get-started">get started</Link> form.
            </p>
          </>
        ),
      },
    ],
  },
];

const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      url: `${SITE_URL}/resources/faq#${item.id}`,
      acceptedAnswer: { "@type": "Answer", text: item.plain },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // The payload is built from the constant above, not from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleHeader
        eyebrow="Resources"
        title="Frequently asked questions"
        lede="The questions people actually ask before buying, answered from how the product behaves today rather than from how it is meant to behave eventually. Where those differ, the answer says so."
        pills={
          <>
            <Pill>{ALL_ITEMS.length} questions</Pill>
            <Pill>Works without JavaScript</Pill>
          </>
        }
      />

      {SECTIONS.map((section, i) => (
        <Section
          key={section.heading}
          tone={i % 2 === 1 ? "muted" : "default"}
          aria-labelledby={`${section.slug}-heading`}
        >
          <Rails className="border-t border-dashed border-border py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <div className="lg:sticky lg:top-24">
                  <SectionHeading
                    id={`${section.slug}-heading`}
                    eyebrow={`0${i + 1}`}
                    title={section.heading}
                  />
                </div>
              </div>

              {/*
                Disclosure draws its own `border-b` and clears it on the last
                sibling. Wrapping each one in an <li> makes every Disclosure a
                last child, so the separator moves to the <li> instead — which
                is also where the anchor id has to live for a deep link to land
                on the whole row rather than inside it.
              */}
              <ul className="border-t border-border">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    id={item.id}
                    className="scroll-mt-24 border-b border-border last:border-b-0"
                  >
                    <Disclosure question={item.question}>
                      <Prose className="text-sm leading-relaxed">
                        {item.answer}
                      </Prose>
                    </Disclosure>
                  </li>
                ))}
              </ul>
            </div>
          </Rails>
        </Section>
      ))}

      <Section aria-labelledby="more-heading">
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <h2 id="more-heading" className="sr-only">
            Anything else
          </h2>
          <div className="max-w-2xl">
            <Callout title="Something not answered here?">
              <p>
                Ask it on the{" "}
                <Link
                  href="/get-started"
                  className="font-medium text-brand underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand"
                >
                  get started
                </Link>{" "}
                form. Questions that come up more than once end up on this page,
                phrased the way they were asked rather than the way we would
                prefer them.
              </p>
            </Callout>
          </div>
        </Rails>
      </Section>
    </>
  );
}
