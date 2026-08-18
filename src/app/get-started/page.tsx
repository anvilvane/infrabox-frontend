import type { Metadata } from "next";

import { Container, Eyebrow } from "@/components/ui";
import { MAILBOX_PRICE_USD, PIPELINE, usd } from "@/lib/product";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Tell us how many Google Workspace mailboxes you need, across how many domains, and which tool you send with.",
};

export default function GetStartedPage() {
  return (
    <section>
      <Container className="grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20 lg:py-24">
        <div className="max-w-2xl">
          <Eyebrow>Get started</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-5xl">
            Tell us what you need to send.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            How many mailboxes, across how many domains, and which tool you send
            with. We will come back with the real total and how quickly it can
            be standing.
          </p>

          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <aside className="lg:pt-16">
          <div className="mt-6 rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold">What it costs</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <span className="tabular font-medium text-foreground">
                {usd(MAILBOX_PRICE_USD)}
              </span>{" "}
              per mailbox per month, plus the domain priced per TLD.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold">What happens after</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              {PIPELINE.slice(0, 4).map((step, i) => (
                <li key={step.key} className="flex gap-3">
                  <span className="tabular font-mono text-xs leading-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step.label}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <span className="font-mono text-xs leading-5">..</span>
                <span>and four more, unattended.</span>
              </li>
            </ol>
          </div>
        </aside>
      </Container>
    </section>
  );
}
