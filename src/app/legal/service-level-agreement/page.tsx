import type { Metadata } from "next";
import Link from "next/link";

import {
  Article,
  ArticleHeader,
  Callout,
  Pending,
  Pill,
  Prose,
  TableScroll,
  Td,
  Th,
} from "@/components/content";
import { DraftBanner, LegalFootLinks, PendingLegend } from "../legal-chrome";

export const metadata: Metadata = {
  title: "Deliverability SLA",
  description:
    "Draft service level agreement for inbox placement: the sender-hygiene conditions it depends on, how placement is measured, the service-credit remedy, and the exclusions.",
};

const TOC = [
  { id: "scope", label: "1. Eligibility and scope" },
  { id: "conditions", label: "2. Sender hygiene conditions" },
  { id: "measurement", label: "3. Measurement" },
  { id: "remedy", label: "4. Remedy — service credits" },
  { id: "exclusions", label: "5. Exclusions" },
  { id: "replacement", label: "6. Replacement commitment" },
  { id: "changes", label: "7. Changes to this SLA" },
];

export default function ServiceLevelAgreementPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Deliverability SLA"
        lede="A placement guarantee is only worth what its conditions and exclusions leave standing, so this draft states both before it states the promise."
        pills={
          <>
            <Pill>Draft</Pill>
            <Pill>Tier not currently sold</Pill>
            <Pill>Not in force</Pill>
          </>
        }
      />

      <Article toc={TOC}>
        <Prose>
          <DraftBanner>
            <p>
              This document has not been reviewed by counsel and is not in force.
              It is published so it can be read and argued with before it becomes
              binding.
            </p>
            <p className="mt-3">
              It is also written for a <strong>Guaranteed Placement</strong>{" "}
              subscription tier that Infrabox does not currently sell. What is on{" "}
              <Link href="/pricing">the pricing page</Link> today is the mailbox
              and the domain, with no placement guarantee attached to either.
            </p>
          </DraftBanner>

          <Callout tone="warn" title="Why no percentages appear below">
            <p>
              The source draft carries suggested thresholds. They were calibrated
              from nothing — the draft itself says they must come from Infrabox&rsquo;s
              own seeded placement tests, which have not been run at the volume
              needed to set a defensible number. Printing them here would be
              publishing a deliverability figure we cannot stand behind, so every
              one of them is shown as a gap instead.
            </p>
          </Callout>

          <PendingLegend />

          <h2 id="scope">1. Eligibility and scope</h2>
          <ol>
            <li>
              This SLA applies <strong>only</strong> to mailboxes on a Guaranteed
              Placement subscription tier. Mailboxes on other tiers receive
              monitoring, but no placement guarantee.
            </li>
            <li>
              It covers <strong>inbox placement rate</strong> as measured by
              Infrabox&rsquo;s seeded placement testing described in section 3. It
              does not cover open rates, reply rates, click rates or any business
              outcome. Nobody can guarantee those, and an SLA that implied
              otherwise would be worthless.
            </li>
            <li>
              Guaranteed thresholds are set per mailbox type and measured as a
              monthly average across your eligible mailboxes.
            </li>
          </ol>

          <TableScroll>
            <thead>
              <tr>
                <Th>Mailbox type</Th>
                <Th>Guaranteed inbox placement rate</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Google Workspace (guaranteed tier)</Td>
                <Td>
                  <Pending>threshold pending calibration</Pending>
                </Td>
              </tr>
              <tr>
                <Td>Private SMTP</Td>
                <Td>
                  No placement guarantee — monitoring and replacement only
                </Td>
              </tr>
            </tbody>
          </TableScroll>

          <h2 id="conditions">2. Conditions — sender hygiene requirements</h2>
          <p>
            The guarantee in section 1 applies during a calendar month{" "}
            <strong>only if</strong>, for that month, you maintain across the
            covered mailboxes:
          </p>
          <ol>
            <li>
              a spam complaint rate below <Pending>threshold pending</Pending>, as
              measured by available feedback loops and provider postmaster tools;
            </li>
            <li>
              a hard bounce rate below <Pending>threshold pending</Pending> of
              delivered volume;
            </li>
            <li>
              <strong>intact authentication</strong> — the SPF, DKIM and DMARC
              records as provisioned by Infrabox, unmodified and passing;
            </li>
            <li>
              daily sending within the published per-mailbox limits for the
              mailbox type, and ramp-up within Infrabox&rsquo;s published warmup
              schedule;
            </li>
            <li>
              list hygiene — all recipient lists passed through the required
              pre-flight verification, or a verification provider approved in
              writing, within <Pending>window pending</Pending> before sending;
            </li>
            <li>
              no unresolved violation of the{" "}
              <Link href="/legal/acceptable-use-policy">
                Acceptable Use Policy
              </Link>
              .
            </li>
          </ol>
          <p>
            If any condition is not met in a given month, the guarantee is{" "}
            <strong>suspended for that month</strong> for the affected mailboxes.
            Infrabox notifies you through the dashboard when a condition is
            breached, rather than quietly logging it and declining a claim later.
          </p>

          <h2 id="measurement">3. Measurement</h2>
          <ol>
            <li>
              Placement is measured by automated seeded inbox-placement tests
              against a representative seed panel (Gmail, Outlook and Microsoft
              365, Yahoo), run at least <Pending>frequency pending</Pending> per
              domain group.
            </li>
            <li>
              The monthly inbox placement rate is the volume-weighted average of
              seeded test results for your covered mailboxes in that calendar
              month.
            </li>
            <li>
              Measurement data is shown in your dashboard and is the sole basis
              for SLA determinations. There is no second, private number.
            </li>
          </ol>

          <h2 id="remedy">4. Remedy — service credits</h2>
          <p>
            If in a calendar month the measured placement rate for covered
            mailboxes falls below the guaranteed threshold{" "}
            <strong>and</strong> every section 2 condition was met, you are
            entitled to a service credit, scaled to the size of the shortfall.
          </p>

          <TableScroll>
            <thead>
              <tr>
                <Th>Shortfall against threshold</Th>
                <Th>Credit, as a share of that month&rsquo;s fees for the affected mailboxes</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Small</Td>
                <Td>
                  <Pending>band and credit pending</Pending>
                </Td>
              </tr>
              <tr>
                <Td>Moderate</Td>
                <Td>
                  <Pending>band and credit pending</Pending>
                </Td>
              </tr>
              <tr>
                <Td>Severe</Td>
                <Td>
                  <Pending>band and credit pending</Pending>
                </Td>
              </tr>
            </tbody>
          </TableScroll>

          <ul>
            <li>
              Total service credits in any month are capped at{" "}
              <Pending>cap pending</Pending> of your total monthly invoice.
            </li>
            <li>
              Credits are applied to future invoices, are non-transferable, and
              are not redeemable for cash except where the law requires it.
            </li>
            <li>
              Credits are the <strong>sole and exclusive remedy</strong> for a
              placement shortfall.
            </li>
            <li>
              Claims must be submitted within <Pending>window pending</Pending> of
              the end of the affected month; Infrabox responds within{" "}
              <Pending>window pending</Pending>.
            </li>
          </ul>

          <h2 id="exclusions">5. Exclusions</h2>
          <p>
            No credit is owed where the shortfall arises, in whole or in material
            part, from:
          </p>
          <ol>
            <li>
              <strong>Platform action</strong> — suspension, throttling, policy
              change or other action by Google, Microsoft, Yahoo or another
              mailbox provider, not caused by Infrabox&rsquo;s breach. This
              includes industry-wide enforcement waves and changes to sending
              limits, which happen and are not negotiable by anyone.
            </li>
            <li>
              <strong>Customer-caused damage</strong> — content, lists, volumes or
              sending patterns you chose, including the persisting effects of a
              section 2 breach in an earlier month.
            </li>
            <li>
              Third-party blocklists triggered by your content or your recipient
              lists, including blocklisting of your landing-page or tracking
              domains.
            </li>
            <li>
              Force majeure, internet-infrastructure failures, or DNS changes made
              by you or your registrar.
            </li>
            <li>Beta, trial, free or otherwise unpaid mailboxes.</li>
          </ol>

          <h2 id="replacement">6. Replacement commitment</h2>
          <p>
            Independent of placement credits: a provisioned mailbox or domain that
            becomes non-functional — suspended, blocklisted through a provisioning
            fault, or DNS-broken through Infrabox&rsquo;s fault — is replaced at no
            charge within <Pending>window pending</Pending> of detection or report.
            Replacement is the sole remedy for non-functional units on
            non-guaranteed tiers.
          </p>
          <Callout tone="warn" title="Not yet automated">
            <p>
              This clause describes an intended commitment, not a shipped feature.
              Today a mailbox that fails permanently during provisioning is
              re-run by an operator; there is no automatic replacement or credit
              in the product. That gap is stated here rather than papered over.
            </p>
          </Callout>

          <h2 id="changes">7. Changes to this SLA</h2>
          <p>
            Infrabox may revise thresholds and terms on{" "}
            <Pending>notice period pending</Pending> notice, and revisions apply
            prospectively. If a revision materially reduces the guarantee, you may
            terminate the affected subscription without penalty within the notice
            period.
          </p>

          <LegalFootLinks current="/legal/service-level-agreement" />
        </Prose>
      </Article>
    </>
  );
}
