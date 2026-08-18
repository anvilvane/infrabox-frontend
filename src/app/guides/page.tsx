import type { Metadata } from "next";
import Link from "next/link";

import { Section, SectionHeading, SectionShell } from "@/components/ui";
import {
  ArticleHeader,
  CardGrid,
  ContentCta,
  LinkCard,
  Pill,
  Prose,
} from "@/components/content";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Technical guides on email authentication, Google Workspace credentials and the Infrabox SMTP relay — written from how the product actually works.",
};

export default function GuidesIndexPage() {
  const minutes = GUIDES.reduce((sum, g) => sum + g.minutes, 0);

  return (
    <>
      <ArticleHeader
        eyebrow="Resources"
        title="Guides"
        lede="Four pieces, each about something we had to solve to build this. They are longer than a blog post and shorter than documentation, and none of them exist to rank for a keyword."
        pills={
          <>
            <Pill className="tabular">{GUIDES.length} guides</Pill>
            <Pill className="tabular">{minutes} min in total</Pill>
          </>
        }
      />

      <Section divided aria-labelledby="all-guides">
        <SectionShell index="01" label="the set">
          <h2 id="all-guides" className="sr-only">
            All guides
          </h2>
          <CardGrid columns={2}>
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

      <Section tone="muted" divided aria-labelledby="why-four">
        <SectionShell index="02" label="why only four">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
            <SectionHeading
              id="why-four"
              title="Why there are only four"
            />
            <Prose className="text-base">
              <p>
                Because these are the four things we actually know something
                about that is not already written down better elsewhere. Each one
                came out of a problem that had to be solved to make mailbox
                provisioning work unattended, and each says what did not work as
                well as what did.
              </p>
              <p>
                There is no content calendar behind this page and there will not
                be a hundred articles on it. If you want the practical version —
                what happens when a mailbox fails, who owns the domain, what you
                need before you start — the{" "}
                <Link href="/resources/faq">FAQ</Link> answers those directly.
              </p>
            </Prose>
          </div>
        </SectionShell>
      </Section>

      <ContentCta id="guides-cta" />
    </>
  );
}
