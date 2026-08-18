import type { Metadata } from "next";
import Link from "next/link";

import { Rails, Section, SectionHeading } from "@/components/ui";
import {
  Article,
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
        title="Legal"
        lede="Every document here is labelled with what it actually is. Nothing on this page is in force yet, and the ones that do not exist say so instead of being filled with plausible text."
        pills={
          <>
            <Pill>{drafted} drafts</Pill>
            <Pill>{missing} not written</Pill>
          </>
        }
      />

      <Section>
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <SectionHeading
                id="documents-heading"
                title="The documents"
                lede="Five in total. The label on each is the honest one."
              />
            </div>

            <ul className="border-t border-dashed border-border">
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
          </div>
        </Rails>
      </Section>

      <Article>
        <Prose>
          <Callout tone="warn" title="Where this stands">
            <p>
              {drafted} of these documents exist as drafts pending counsel
              review. The other {missing} have not been written. None of them is
              binding on Infrabox or on you today.
            </p>
            <p>
              Generated legal text that reads like a contract but has never been
              reviewed is worse than a blank page, because it invites you to rely
              on it. So the blanks are visible.
            </p>
          </Callout>

          <h2 id="not-answered">Questions these pages do not answer yet</h2>
          <p>
            The <Link href="/resources/faq">FAQ</Link> answers the practical
            versions of several of these — who the domain is registered to, what
            happens if you leave, what happens when a mailbox fails — from how
            the product behaves today rather than from a clause. Where the
            product and a draft disagree, the product is the accurate one.
          </p>
        </Prose>
      </Article>
    </>
  );
}
