import type { Metadata } from "next";
import Link from "next/link";

import { Rails, Section, SectionHeading } from "@/components/ui";
import { ArticleHeader, LinkCard, Pill, Prose } from "@/components/content";
import { GUIDES } from "@/content/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Technical guides on email authentication, Google Workspace credentials and the Infrabox SMTP relay — written from how the product actually works.",
};

export default function GuidesIndexPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Guides"
        title="Guides"
        lede="Four pieces, each about something we had to solve to build this. They are longer than a blog post and shorter than documentation, and none of them exist to rank for a keyword."
        pills={<Pill>{GUIDES.length} guides</Pill>}
      />

      <Section>
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <h2 id="all-guides" className="sr-only">
            All guides
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
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

      <Section tone="muted">
        <Rails className="border-t border-dashed border-border py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading id="why-four" title="Why there are only four" />
            <Prose>
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
        </Rails>
      </Section>
    </>
  );
}
