import Link from "next/link";
import * as React from "react";

import { Rails, Section, SectionHeading } from "@/components/ui";
import {
  Article,
  ArticleHeader,
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
            <Pill>{guide.minutes} min read</Pill>
            <Link
              href="/guides"
              className="text-xs font-medium text-brand underline decoration-brand/30 underline-offset-[3px] hover:decoration-brand"
            >
              All guides
            </Link>
          </>
        }
      />

      <Article toc={toc}>
        <Prose>{children}</Prose>
      </Article>

      <Section tone="muted">
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <SectionHeading
            id="keep-reading"
            eyebrow="Keep reading"
            title="The rest of the set"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((g) => (
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
    </>
  );
}
