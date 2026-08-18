import {
  ArrowLink,
  Disclosure,
  Section,
  SectionHeading,
  SectionShell,
} from "@/components/ui";
import { DOMAIN_MARKUP, MAILBOX_PRICE_USD, usd } from "@/lib/product";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What exactly does Infrabox provision?",
    a: "A domain and Google Workspace mailboxes on it, set up end to end: the domain is registered and pointed at DNS we manage, the Workspace and its admin account are created, MX, SPF and DMARC are published, Google's domain verification is completed, DKIM is generated and switched on, and a sending credential is minted and verified before it is handed to you.",
  },
  {
    q: "Do I need a Google login or an admin password?",
    a: "No. The platform holds the admin credential for the Workspace so the rest of the pipeline can run without you. You never see a Workspace signup form, and there is no Admin Console session to sit through per domain.",
  },
  {
    q: "How long does a mailbox take?",
    a: "We do not quote a single headline setup time, because the slowest step is not ours to control. Domain verification alone budgets several hours of retries: Google decides when it is satisfied, and DNS propagation cannot be hurried. The dashboard shows which of the eight steps a mailbox is on the whole way through, with the same per-step estimates this site quotes.",
  },
  {
    q: "Can I keep using my own sending tool?",
    a: "Yes — that is the point. The mailboxes speak ordinary SMTP, so you point the sequencer you already use at them. Infrabox is the infrastructure underneath your sending tool, not a replacement for it.",
  },
  {
    q: "What happens if a step fails?",
    a: "A step that is merely slow is retried rather than failed. Domain verification carries its own retry policy of 40 attempts on a backoff that widens to fifteen minutes, precisely because nameserver delegation routinely takes hours. A step that genuinely cannot complete surfaces as a failure on that mailbox, naming the step it stopped at, rather than disappearing.",
  },
  {
    q: "Do you support Microsoft 365, Azure or plain SMTP mailboxes?",
    a: "Not today. Google Workspace is the whole of the current product. We would rather say that plainly than list providers that are not built yet.",
  },
  {
    q: "What does it cost?",
    a: `Mailboxes are ${usd(MAILBOX_PRICE_USD)} per mailbox per month. Domains are priced per TLD, with a $${DOMAIN_MARKUP.standard} markup over the registrar's price, or $${DOMAIN_MARKUP.aged} once a domain is ${DOMAIN_MARKUP.agedThresholdYears}+ year old. Checkout quotes the final price for the exact domain you choose.`,
  },
];

/*
 * Full-width hairline rows rather than a narrow column floating in a wide
 * band, with the answer measure held to a readable line length inside the row
 * and the site's monospace index carried onto each question.
 */
export function Faq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Section divided aria-labelledby="faq-heading" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SectionShell index="05" label="faq">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="faq-heading"
            title="Questions, answered plainly."
            lede="Where the honest answer is “not yet”, that is the answer you will get here."
          />
          <ArrowLink href="/get-started" className="shrink-0">
            Ask us directly
          </ArrowLink>
        </div>

        <div className="mt-10 border-t border-border">
          {FAQS.map((faq, i) => (
            <Disclosure
              key={faq.q}
              defaultOpen={i === 0}
              question={
                <>
                  <span className="tabular mr-4 font-mono text-[0.6875rem] font-normal text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {faq.q}
                </>
              }
            >
              <span className="block max-w-3xl">{faq.a}</span>
            </Disclosure>
          ))}
        </div>
      </SectionShell>
    </Section>
  );
}
