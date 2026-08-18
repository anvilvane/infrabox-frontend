import type { Metadata } from "next";

import { Section, SectionHeading, SectionShell } from "@/components/ui";
import {
  ArticleHeader,
  CardGrid,
  ContentCta,
  LinkCard,
  LinkRow,
  Pill,
  Prose,
} from "@/components/content";
import { PIPELINE } from "@/lib/product";
import { GUIDES } from "@/content/guides";
import { LEGAL_DOCS, LEGAL_STATUS_LABEL } from "../legal/legal-chrome";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides on email authentication and Google Workspace credentials, an FAQ answering what buyers actually ask, and the legal documents with their status stated.",
};

export default function ResourcesPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Resources"
        title="Guides, answers and documents"
        lede="Everything on this site that is not a product page: the technical guides, the questions people ask before buying, and the legal documents with an honest label on each."
        pills={
          <>
            <Pill className="tabular">{GUIDES.length} guides</Pill>
            <Pill>FAQ</Pill>
            <Pill className="tabular">
              {LEGAL_DOCS.length} legal documents
            </Pill>
          </>
        }
      />

      <Section divided aria-labelledby="start-heading">
        <SectionShell index="01" label="start here">
          <SectionHeading
            id="start-heading"
            title="The two pages most people want first"
          />
          <CardGrid columns={2} className="mt-10">
            <LinkCard
              href="/resources/faq"
              kicker="FAQ"
              title="Frequently asked questions"
            >
              What happens when a mailbox fails, who the domain is registered to,
              what you can take with you if you leave, and how to connect a
              sending tool.
            </LinkCard>
            <LinkCard
              href="/how-it-works"
              kicker={`Product · ${PIPELINE.length} steps`}
              title="How it works"
            >
              The eight provisioning steps in the order they run, with the typical
              time each takes and the one that dominates the total.
            </LinkCard>
          </CardGrid>
        </SectionShell>
      </Section>

      <Section tone="muted" divided aria-labelledby="guides-heading">
        <SectionShell index="02" label="guides">
          <SectionHeading
            id="guides-heading"
            title="Four pieces of real technical writing"
            lede="Each came out of a problem that had to be solved to make provisioning work unattended."
          />
          <CardGrid columns={2} className="mt-10">
            {GUIDES.map((g) => (
              <LinkCard
                key={g.slug}
                href={`/guides/${g.slug}`}
                kicker={`${g.topic} · ${g.minutes} min`}
                title={g.shortTitle}
              >
                {g.description}
              </LinkCard>
            ))}
          </CardGrid>
        </SectionShell>
      </Section>

      <Section divided aria-labelledby="legal-heading">
        <SectionShell index="03" label="legal">
          <SectionHeading
            id="legal-heading"
            title="Labelled, not padded"
            lede="Two drafts pending review, three not written. Each page says which it is."
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

      <Section tone="muted" divided aria-labelledby="not-here-heading">
        <SectionShell index="04" label="what is missing">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
            <SectionHeading
              id="not-here-heading"
              title="What is not here"
            />
            <Prose className="text-base">
              <p>
                There are no case studies, customer stories or testimonials on
                this site. Not as a design decision — there is simply nothing to
                put there that would be true, and social proof is the one kind of
                content where inventing it is indistinguishable from lying. When
                there are customers willing to be named, this is where they will
                be.
              </p>
              <p>
                There is also no blog. Four guides that came out of real problems
                are more use than forty that came out of a keyword list.
              </p>
            </Prose>
          </div>
        </SectionShell>
      </Section>

      <ContentCta id="resources-cta" />
    </>
  );
}
