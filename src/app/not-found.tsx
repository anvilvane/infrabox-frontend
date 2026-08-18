import type { Metadata } from "next";

import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="max-w-2xl py-24 lg:py-32">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-[-0.035em]">
        That page does not exist.
      </h1>
      <p className="mt-5 leading-relaxed text-muted-foreground">
        The link may be out of date. The pages that do exist are how it works,
        pricing, and get started.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to the homepage</ButtonLink>
        <ButtonLink href="/how-it-works" variant="outline">
          How it works
        </ButtonLink>
      </div>
    </Container>
  );
}
