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
    "Infrabox's legal documents, with each one labelled as drafted or not drafted. Two exist in draft; three have not been written.",
};

export default function LegalIndexPage() {
  const drafted = LEGAL_DOCS.filter((d) => d.status === "drafted").length;
  const missing = LEGAL_DOCS.length - drafted;

  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="The documents, and their status"
        lede="Every document here is labelled with what it actually is. Nothing on this page is in force yet, and the ones that do not exist say so instead of being filled with plausible text."
        pills={
          <>
            <Pill className="tabular">{drafted} drafts</Pill>
            <Pill className="tabular">{missing} not written</Pill>
            <Pill>None in force</Pill>
          </>
        }
      />

      <Section divided aria-labelledby="documents-heading">
        <SectionShell index="01" label="the set">
          <SectionHeading
            id="documents-heading"
            title="Five in total"
            lede="The label on each is the honest one."
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
              <Callout tone="warn" title="Nothing here is binding today">
                <p>
                  {drafted} of these documents exist as drafts pending counsel
                  review. The other {missing} have not been written. None of them
                  is binding on Infrabox or on you today.
                </p>
                <p>
                  Generated legal text that reads like a contract but has never
                  been reviewed is worse than a blank page, because it invites you
                  to rely on it. So the blanks are visible.
                </p>
              </Callout>

              <h2 id="not-answered">Questions these pages do not answer yet</h2>
              <p>
                The <Link href="/resources/faq">FAQ</Link> answers the practical
                versions of several of these — who the domain is registered to,
                what happens if you leave, what happens when a mailbox fails —
                from how the product behaves today rather than from a clause.
                Where the product and a draft disagree, the product is the
                accurate one.
              </p>
            </Prose>
          </div>
        </SectionShell>
      </Section>
    </>
  );
}
