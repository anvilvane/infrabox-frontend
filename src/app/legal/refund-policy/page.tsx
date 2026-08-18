import type { Metadata } from "next";
import Link from "next/link";

import { Article, ArticleHeader, Pill, Prose } from "@/components/content";
import { LegalDocRail, NotDrafted } from "../legal-chrome";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Infrabox's refund policy has not been drafted yet. This page states the gap and lists the decisions the finished document has to make.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Refund Policy"
        lede="Not yet written. The hard part is not the wording, it is that a domain registration and a mailbox subscription behave completely differently when you want your money back."
        pills={<Pill>Not written yet</Pill>}
      />

      <Article aside={<LegalDocRail current="/legal/refund-policy" />}>
        <Prose>
          <NotDrafted
            covers={[
              "Domain registrations: a registration is paid to the registrar and to the registry the moment it succeeds, and is not reversible. The policy has to say so rather than imply a refund is possible.",
              "Mailbox subscriptions: whether a partial month is refunded, prorated or forfeited on cancellation.",
              "Prepaid credit: whether an unspent balance is refundable to the original payment method or usable only against future invoices.",
              "A mailbox that never reaches active: what is owed when provisioning fails permanently, and whether the domain charge stands when the mailbox on it does not.",
              "Provisioning that succeeds but slowly: whether a long domain-verification wait is grounds for anything.",
              "Termination for an Acceptable Use Policy breach, where the current draft says prepaid fees are not refunded.",
              "Chargebacks, and what happens to live mailboxes while one is open.",
              "How a refund is requested and how long a decision takes.",
            ]}
          />

          <h2>The part that is already true in the product</h2>
          <p>
            There is no automatic refund or credit when a mailbox fails permanently
            during provisioning. A failed mailbox is currently re-run by an
            operator; nothing in the billing system reverses a charge on its own.
            That is the honest state today, and the finished policy has to either
            commit to something better or say this plainly.
          </p>
          <p>
            The related commitment — free replacement of a non-functional mailbox
            or domain — is drafted in section 6 of the{" "}
            <Link href="/legal/service-level-agreement">deliverability SLA</Link>,
            and is likewise not yet in force.
          </p>

          <h2>Until then</h2>
          <p>
            Refunds are handled case by case. If that is not good enough to buy on,
            it is a reasonable thing to raise on the{" "}
            <Link href="/get-started">get started</Link> form before you do.
          </p>
        </Prose>
      </Article>
    </>
  );
}
