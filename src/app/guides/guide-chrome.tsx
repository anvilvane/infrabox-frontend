import * as React from "react";

import { ArrowLink, Container, Section, SectionHeading } from "@/components/ui";
import {
  Article,
  ArticleHeader,
  CardGrid,
  ContentCta,
  LinkCard,
  Pill,
  Prose,
  type TocEntry,
} from "@/components/content";
import { GUIDES, getGuide } from "@/content/guides";

/**
 * The frame every guide sits in. Each guide supplies its slug, its contents
 * list and its body; the title, description, topic and reading time come from
 * the registry, so a guide's heading and its sitemap entry cannot drift apart.
 *
 * A guide ends somewhere rather than trailing into the footer: the rest of the
 * set on a flush sheet, then the closing band.
 */
export function GuideShell({
  slug,
  toc,
  children,
}: {
  slug: string;
  toc: TocEntry[];
  children: React.ReactNode;
}) {
  const guide = getGuide(slug);
  const others = GUIDES.filter((g) => g.slug !== slug);

  return (
    <>
      <ArticleHeader
        eyebrow="Guide"
        title={guide.title}
        lede={guide.description}
        pills={
          <>
            <Pill>{guide.topic}</Pill>
            <Pill className="tabular">{guide.minutes} min read</Pill>
            <ArrowLink href="/guides" className="ml-auto">
              All guides
            </ArrowLink>
          </>
        }
      />

      <Article toc={toc}>
        <Prose>{children}</Prose>
      </Article>

      <Section tone="muted" divided aria-labelledby="keep-reading">
        <Container className="py-14 lg:py-16">
          <SectionHeading
            id="keep-reading"
            eyebrow="Keep reading"
            title="The rest of the set"
          />
          <CardGrid columns={3} className="mt-8">
            {others.map((g) => (
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
        </Container>
      </Section>

      <ContentCta id="guide-cta" />
    </>
  );
}
