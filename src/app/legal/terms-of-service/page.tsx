import type { Metadata } from "next";

import { Article, ArticleHeader, Pill, Prose } from "@/components/content";
import { LegalFootLinks, NotDrafted } from "../legal-chrome";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Infrabox's master agreement has not been drafted yet. This page states the gap and lists what the finished document has to cover.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Terms of Service"
        lede="Not yet written. This page says so plainly and lists what the finished agreement has to settle."
        pills={<Pill>Not written yet</Pill>}
      />

      <Article>
        <Prose>
          <NotDrafted
            covers={[
              "The service being bought: domain registration, DNS management, Google Workspace mailbox provisioning, and relayed sending — and explicitly what is not being bought.",
              "The relationship between Infrabox and Google, including that mailboxes are created inside Workspace accounts Infrabox holds, and what that means for your rights in them.",
              "Term, renewal and cancellation, including what happens to a mailbox and its data at the end of a subscription.",
              "Payment terms, billing currency, taxes, and the treatment of prepaid credit.",
              "Ownership of the domain: who is registrant of record, and the process for taking a domain elsewhere.",
              "Uptime, support response and the boundary between this agreement and the deliverability SLA.",
              "Limitation of liability, and a cap that is mirrored against the indemnity in the Acceptable Use Policy.",
              "Incorporation of the Acceptable Use Policy and the Data Processing Agreement by reference.",
              "Governing law, jurisdiction and dispute resolution.",
              "How the terms may change, and what notice you get before they do.",
            ]}
          />

          <h2>What holds in the meantime</h2>
          <p>
            Until this document exists, the only written commitments are the ones
            on the public pages of this site: the price on the pricing page, the
            steps described on the how-it-works page, and the conduct rules in the
            Acceptable Use Policy. If something matters enough to you that it needs
            to be in writing before you buy, ask for it in writing. That is a
            better answer than a page of boilerplate.
          </p>

          <LegalFootLinks current="/legal/terms-of-service" />
        </Prose>
      </Article>
    </>
  );
}
