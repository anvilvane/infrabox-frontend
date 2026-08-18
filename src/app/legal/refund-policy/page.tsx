import type { Metadata } from "next";
import Link from "next/link";

import { Article, ArticleHeader, Callout, Pill, Prose } from "@/components/content";
import { LegalDocRail, LegalNotice } from "../legal-chrome";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "What Infrabox refunds and what it cannot: why a domain registration behaves differently from a mailbox subscription, what happens when provisioning fails or runs slow, and how to ask.",
};

const TOC = [
  { id: "scope", label: "1. Scope" },
  { id: "two-charges", label: "2. Two charges, two answers" },
  { id: "domains", label: "3. Domain registrations" },
  { id: "mailboxes", label: "4. Mailbox subscriptions" },
  { id: "credit", label: "5. Prepaid credit" },
  { id: "failed", label: "6. Provisioning that fails" },
  { id: "slow", label: "7. Provisioning that runs slow" },
  { id: "aup", label: "8. Termination for breach" },
  { id: "how", label: "9. How to request a refund" },
  { id: "chargebacks", label: "10. Chargebacks" },
  { id: "changes", label: "11. Changes" },
  { id: "contact", label: "12. Contact" },
];

const CONTACT_EMAIL = "hello@infrabox.io";

export default function RefundPolicyPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Refund Policy"
        lede="A domain registration and a mailbox subscription are not the same kind of purchase, and pretending otherwise is how refund policies end up dishonest. This one separates them."
        pills={
          <>
            <Pill>Published</Pill>
            <Pill>Read with the Terms of Service</Pill>
          </>
        }
      />

      <Article toc={TOC} aside={<LegalDocRail current="/legal/refund-policy" />}>
        <Prose>
          <LegalNotice>
            Section 3 is the one to read before you buy: a registered domain is
            generally not refundable, and no policy Infrabox writes can change
            that.
          </LegalNotice>

          <h2 id="scope">1. Scope</h2>
          <p>
            This policy covers money paid to Infrabox for mailbox subscriptions,
            domain registrations and renewals, and any prepaid balance held on a
            customer account. It sits under the{" "}
            <Link href="/legal/terms-of-service">Terms of Service</Link>; where
            the two documents describe the same thing, the Terms govern the
            relationship and this policy describes how refunds are handled within
            it.
          </p>
          <p>
            Nothing here limits a right you have under consumer law that cannot
            be contracted away. Where such a right applies to you, it applies in
            addition to this policy, not instead of it.
          </p>

          <h2 id="two-charges">2. Two charges, two answers</h2>
          <p>
            An Infrabox invoice generally contains two very different things, and
            they behave differently when you want your money back:
          </p>
          <ul>
            <li>
              <strong>A domain registration</strong> is a one-time purchase that
              Infrabox pays onward to a registrar and a registry the moment it
              succeeds. That payment is not reversible.
            </li>
            <li>
              <strong>A mailbox subscription</strong> is a recurring charge for a
              service that runs on an ongoing basis, and can be stopped.
            </li>
          </ul>
          <p>
            Most confusion about refunds in this industry comes from policies
            that blur those two together. This one does not.
          </p>

          <h2 id="domains">3. Domain registrations</h2>
          <p>
            <strong>Domain registration and renewal fees are not refundable.</strong>{" "}
            When a domain is registered, the fee is paid through to the registrar
            and the registry immediately and irreversibly, and the domain exists
            from that moment whether or not you go on to use it. This is a
            constraint of how domain registration works, not a commercial choice
            Infrabox has made.
          </p>
          <p>
            This applies equally to the markup Infrabox adds over the registrar's
            price, which is described on the{" "}
            <Link href="/pricing">pricing page</Link>, and to pre-warmed domains,
            which are purchased ahead of time and held.
          </p>
          <p>
            If a registration attempt <em>fails</em> — the domain turns out to be
            unavailable, or the registrar rejects it — nothing has been bought
            and you are not charged for it. If you have already been charged, the
            amount is refunded in full.
          </p>

          <h2 id="mailboxes">4. Mailbox subscriptions</h2>
          <p>
            You can cancel a mailbox subscription at any time. Cancellation stops
            the next renewal; it does not retroactively refund the period you are
            already in. The mailbox continues to work until the end of the period
            you have paid for, and then stops.
          </p>
          <p>
            Partial months are not refunded on cancellation. The reason is
            straightforward: a provisioned mailbox occupies a real seat in a
            Google Workspace account for the whole period, and that cost is
            incurred whether or not you send from it.
          </p>
          <Callout tone="note" title="Cancelling is not the same as deleting">
            <p>
              Cancelling stops billing. What happens to the mailbox and its
              contents at the end of the period, and what does and does not
              transfer out with you, is described in the{" "}
              <Link href="/legal/terms-of-service">Terms of Service</Link>. Read
              that before you cancel, not after — mailboxes provisioned in a
              pooled Workspace cannot currently be migrated out.
            </p>
          </Callout>

          <h2 id="credit">5. Prepaid credit</h2>
          <p>
            An unspent balance on your account can be used against any future
            Infrabox invoice and does not expire while the account is open. On
            request, Infrabox will return an unspent balance to the original
            payment method, less any amount already committed to a domain
            registration that has completed.
          </p>
          <p>
            Credit that has already been consumed — by a mailbox that ran, or a
            domain that was registered — is not part of an unspent balance.
          </p>

          <h2 id="failed">6. Provisioning that fails</h2>
          <p>
            Provisioning is an eight-step pipeline, and a step can fail for
            reasons outside anyone's control. What you are owed depends on what
            actually got bought:
          </p>
          <ul>
            <li>
              <strong>The mailbox never reaches a working state.</strong> You are
              not charged for a mailbox that never worked, and any charge already
              taken for it is refunded or credited in full, at your choice.
            </li>
            <li>
              <strong>The domain was registered but the mailbox failed.</strong>{" "}
              The domain charge stands, because the domain genuinely exists and
              is yours. The mailbox charge does not.
            </li>
            <li>
              <strong>The mailbox works but DKIM could not be enabled.</strong>{" "}
              This is a real outcome — DKIM is the one optional step in the
              pipeline, and a domain whose nameservers are not under Infrabox's
              control can complete every other step. The mailbox sends and
              receives, so it is chargeable; if that is not acceptable to you,
              cancel it under section 4 and the next renewal will not be taken.
            </li>
          </ul>
          <Callout tone="warn" title="This is not automatic today">
            <p>
              Nothing in the billing system currently reverses a charge on its
              own when a mailbox fails. A failed mailbox is picked up and re-run
              by an operator, and a refund under this section is issued when you
              ask for it or when Infrabox spots it. If a mailbox of yours never
              came up, write in — do not assume it has been credited.
            </p>
          </Callout>

          <h2 id="slow">7. Provisioning that runs slow</h2>
          <p>
            A slow run is not a failed run, and is not on its own grounds for a
            refund. Domain verification in particular depends on Google
            confirming ownership and on DNS propagating, and the pipeline is
            deliberately built to wait for hours rather than give up on a domain
            that is simply still propagating. The per-step estimates shown on{" "}
            <Link href="/how-it-works">how it works</Link> are estimates, not a
            service level, and Infrabox does not quote a single headline setup
            time because Google controls the slowest part of it.
          </p>
          <p>
            If a run has genuinely stalled rather than merely being slow, that is
            section 6, not this one.
          </p>

          <h2 id="aup">8. Termination for breach</h2>
          <p>
            If an account is terminated for a breach of the{" "}
            <Link href="/legal/acceptable-use-policy">Acceptable Use Policy</Link>
            , prepaid fees are not refunded. Domains registered to you remain
            yours; the services attached to them stop.
          </p>

          <h2 id="how">9. How to request a refund</h2>
          <p>
            Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from
            the address on the account, and say which mailbox or domain the
            request concerns and what went wrong. You do not need to argue a
            case — if it falls under section 6, saying what happened is enough.
          </p>
          <p>
            Infrabox aims to answer refund requests within five working days.
            Where a refund is due, it is returned to the original payment method;
            how long it then takes to appear depends on your bank or card issuer,
            not on Infrabox.
          </p>

          <h2 id="chargebacks">10. Chargebacks</h2>
          <p>
            If you open a chargeback, please tell Infrabox at the same time. A
            chargeback on a live account puts the services on it at risk of
            suspension while the dispute is open, which usually means mailboxes
            stopping mid-campaign — an outcome nobody wants, and one that is
            avoidable by raising the problem directly first.
          </p>
          <p>
            Raising a dispute does not remove your rights under this policy, and
            Infrabox would rather resolve a refund than a chargeback.
          </p>

          <h2 id="changes">11. Changes</h2>
          <p>
            Infrabox may update this policy. The version in force for a given
            charge is the version published when that charge was taken; a later
            change does not retroactively narrow a refund you were already owed.
          </p>

          <h2 id="contact">12. Contact</h2>
          <p>
            Refund requests, billing questions, and corrections to anything stated
            on this page: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            If you are weighing this policy up before buying rather than after,
            that is the right time to ask — see{" "}
            <Link href="/get-started">get started</Link>.
          </p>
        </Prose>
      </Article>
    </>
  );
}
