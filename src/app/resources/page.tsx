import type { Metadata } from "next";

import { Rails, Section, SectionHeading } from "@/components/ui";
import {
  ArticleHeader,
  LinkCard,
  LinkRow,
  Pill,
  Prose,
} from "@/components/content";
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
        title="Resources"
        lede="Everything on this site that is not a product page: the technical guides, the questions people ask before buying, and the legal documents with an honest label on each."
        pills={
          <>
            <Pill>{GUIDES.length} guides</Pill>
            <Pill>FAQ</Pill>
            <Pill>{LEGAL_DOCS.length} legal documents</Pill>
          </>
        }
      />

      <Section aria-labelledby="start-heading">
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <SectionHeading
            id="start-heading"
            eyebrow="Start here"
            title="The two pages most people want first"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <LinkCard
              href="/resources/faq"
              kicker="FAQ"
              title="Frequently asked questions"
            >
              What happens when a mailbox fails, who the domain is registered to,
              what you can take with you if you leave, and how to connect a
              sending tool.
            </LinkCard>
            <LinkCard href="/how-it-works" kicker="Product" title="How it works">
              The eight provisioning steps in the order they run, with the typical
              time each takes and the one that dominates the total.
            </LinkCard>
          </div>
        </Rails>
      </Section>

      <Section aria-labelledby="guides-heading">
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <SectionHeading
            id="guides-heading"
            eyebrow="Guides"
            title="Four pieces of real technical writing"
            lede="Each came out of a problem that had to be solved to make provisioning work unattended."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {GUIDES.map((g) => (
              <li key={g.slug} className="flex">
                <LinkCard
                  href={`/guides/${g.slug}`}
                  kicker={`${g.topic} · ${g.minutes} min`}
                  title={g.shortTitle}
                >
                  {g.description}
                </LinkCard>
              </li>
            ))}
          </ul>
        </Rails>
      </Section>

      <Section aria-labelledby="legal-heading">
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading
              id="legal-heading"
              eyebrow="Legal"
              title="Labelled, not padded"
              lede="Two drafts pending review, three not written. Each page says which it is."
            />
            <ul className="border-t border-dashed border-border">
              {LEGAL_DOCS.map((doc) => (
                <LinkRow
                  key={doc.href}
                  href={doc.href}
                  title={doc.title}
                  badge={LEGAL_STATUS_LABEL[doc.status]}
                />
              ))}
            </ul>
          </div>
        </Rails>
      </Section>

      <Section tone="muted" aria-labelledby="not-here-heading">
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading id="not-here-heading" title="What is not here" />
            <Prose>
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
        </Rails>
      </Section>
    </>
  );
}
