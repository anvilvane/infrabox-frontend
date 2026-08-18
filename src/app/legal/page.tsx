import type { Metadata } from "next";
import Link from "next/link";

import { Section, SectionHeading, SectionShell } from "@/components/ui";
import {
  ArticleHeader,
  Callout,
  LinkRow,
  Pill,
  Prose,
} from "@/components/content";
import { LEGAL_DOCS, LEGAL_STATUS_LABEL } from "./legal-chrome";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Infrabox's legal documents: terms of service, privacy, acceptable use, refunds and the deliverability SLA, each written from how the product actually behaves.",
};

export default function LegalIndexPage() {
  const published = LEGAL_DOCS.filter((d) => d.status === "published").length;
  const conditional = LEGAL_DOCS.length - published;

  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="The documents, and what they cover"
        lede="Each of these is written from how Infrabox actually behaves rather than from a template — including the parts that are inconvenient to admit."
        pills={
          <>
            <Pill className="tabular">{published} published</Pill>
            <Pill className="tabular">{conditional} conditional</Pill>
          </>
        }
      />

      <Section divided aria-labelledby="documents-heading">
        <SectionShell index="01" label="the set">
          <SectionHeading
            id="documents-heading"
            title="Five in total"
            lede="Start with the Terms; the Privacy Policy and the Refund Policy are the two people are usually surprised by."
          />
          <ul className="mt-10 border-t border-border">
            {LEGAL_DOCS.map((doc) => (
              <LinkRow
                key={doc.href}
                href={doc.href}
                title={doc.title}
                badge={LEGAL_STATUS_LABEL[doc.status]}
              >
                {doc.summary}
              </LinkRow>
            ))}
          </ul>
        </SectionShell>
      </Section>

      <Section tone="muted" divided aria-labelledby="standing-heading">
        <SectionShell index="02" label="where this stands">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
            <SectionHeading
              id="standing-heading"
              title="Where this stands"
            />
            <Prose className="text-base">
              <Callout tone="note" title="Read these against the product, not instead of it">
                <p>
                  {published} of these documents describe the service as it runs
                  today. The {conditional} marked conditional — the deliverability
                  SLA — is written for a Guaranteed Placement tier that Infrabox
                  does not currently sell, and says so on its own page rather
                  than implying a guarantee you have not bought.
                </p>
                <p>
                  These documents have not been reviewed by counsel. They are
                  written to be accurate about how the system behaves, which is
                  the part a template cannot get right; the legal review is the
                  part they still need.
                </p>
              </Callout>

              <h2 id="not-answered">The practical version of the same questions</h2>
              <p>
                The <Link href="/resources/faq">FAQ</Link> answers the practical
                versions of several of these — who the domain is registered to,
                what happens if you leave, what happens when a mailbox fails —
                from how the product behaves today rather than from a clause.
                Where a clause here and the product appear to disagree, the
                product is the accurate one and the clause is the bug — tell us.
              </p>
            </Prose>
          </div>
        </SectionShell>
      </Section>
    </>
  );
}
