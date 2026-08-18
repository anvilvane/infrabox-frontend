import {
  Fingerprint,
  Globe,
  KeyRound,
  Layers,
  Plug,
  Repeat,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

import {
  ArrowLink,
  Cell,
  CellGrid,
  Note,
  Section,
  SectionHeading,
  SectionShell,
} from "@/components/ui";

/*
 * Eight flush cells on one hairline sheet. The cell is written out here rather
 * than reusing `FeatureCell` for two reasons: it carries the site's monospace
 * index in the corner, and its title reserves two lines so every body copy in
 * the row starts on the same baseline. Ragged starts were what made this grid
 * read as eight loose boxes instead of one machined panel.
 */

const FEATURES = [
  {
    icon: Globe,
    title: "Domain registered for you",
    body: "Bought in your account and pointed at DNS we manage, so the records the mailboxes need can actually be written.",
  },
  {
    icon: Layers,
    title: "Workspace, no signup form",
    body: "Your domain is attached as a secondary domain and its admin account is created for you. You never see the wizard.",
  },
  {
    icon: ScrollText,
    title: "MX, SPF and DMARC",
    body: "Published at provisioning time with the values Google expects — not left as a support article for you to follow.",
  },
  {
    icon: ShieldCheck,
    title: "Domain verification",
    body: "The ownership proof Google demands before a domain may send is published and confirmed on your behalf.",
  },
  {
    icon: Fingerprint,
    title: "DKIM, actually switched on",
    body: "Key generated, published to DNS and signing enabled for the domain. Not a checklist item you inherit.",
  },
  {
    icon: KeyRound,
    title: "A verified credential",
    body: "Checked against Google before hand-off. No app passwords, no per-mailbox secrets for you to store.",
  },
  {
    icon: Plug,
    title: "Plain SMTP",
    body: "Point the sequencer you already use at the mailboxes. Infrabox sits underneath your sending tool, not in place of it.",
  },
  {
    icon: Repeat,
    title: "Retries, not failures",
    body: "A step that is merely slow is retried on its own schedule rather than failed. Verification alone gets 40 attempts.",
  },
];

export function Features() {
  return (
    <Section aria-labelledby="features-heading">
      <SectionShell index="01" label="what you get">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="features-heading"
            title="A mailbox that is finished, not one that is started."
            lede="Everything below is done before the mailbox is handed over. There is no post-purchase checklist and no Admin Console session waiting for you."
          />
          <ArrowLink href="/how-it-works" className="shrink-0">
            What runs, in order
          </ArrowLink>
        </div>

        <CellGrid columns={4} className="mt-12">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Cell
                key={feature.title}
                className="flex flex-col p-6 hover:bg-brand-tint"
              >
                <div className="flex items-start justify-between gap-3">
                  <Icon aria-hidden className="size-[1.125rem] text-brand" />
                  <span className="tabular font-mono text-[0.625rem] tracking-[0.12em] text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                {/* Two lines are reserved for the title only where the grid is
                    four cells wide and titles actually wrap; that is what puts
                    every body copy in a row on one baseline. */}
                <h3 className="mt-5 text-[0.9375rem] font-semibold leading-snug lg:min-h-[2.75em]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground lg:mt-1">
                  {feature.body}
                </p>
              </Cell>
            );
          })}
        </CellGrid>

        <Note className="mt-10 max-w-3xl">
          <strong className="font-semibold text-foreground">
            What is not in the list is not in the product.
          </strong>{" "}
          Google Workspace is the whole of it today. Microsoft 365, Azure and
          plain-SMTP mailboxes are not built yet, and we would rather say so
          here than let you find out after checkout.
        </Note>
      </SectionShell>
    </Section>
  );
}
