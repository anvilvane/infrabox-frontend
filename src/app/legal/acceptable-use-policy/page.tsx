import type { Metadata } from "next";
import Link from "next/link";

import {
  Article,
  ArticleHeader,
  Pending,
  Pill,
  Prose,
  TableScroll,
  Td,
  Th,
} from "@/components/content";
import { DraftBanner, LegalFootLinks, PendingLegend } from "../legal-chrome";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "What may and may not be sent through infrastructure Infrabox provisions: prohibited content, list-hygiene requirements, volume rules and the enforcement ladder.",
};

const TOC = [
  { id: "position", label: "1. Purpose and position" },
  { id: "prohibitions", label: "2. Absolute prohibitions" },
  { id: "lists", label: "3. Lists and list hygiene" },
  { id: "technical", label: "4. Technical and volume rules" },
  { id: "warranties", label: "5. Your compliance warranties" },
  { id: "enforcement", label: "6. Enforcement" },
  { id: "data", label: "7. Data protection" },
];

export default function AcceptableUsePolicyPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Acceptable Use Policy"
        lede="Infrabox provisions email infrastructure. You are the sender. This document sets out what that division of responsibility means in practice, and what happens when sending through Infrabox infrastructure crosses a line."
        pills={
          <>
            <Pill>Draft</Pill>
            <Pill>Pending counsel review</Pill>
            <Pill>Not in force</Pill>
          </>
        }
      />

      <Article toc={TOC}>
        <Prose>
          <DraftBanner />
          <PendingLegend />

          <h2 id="position">1. Purpose and position</h2>
          <p>
            Infrabox provides email infrastructure — mailbox provisioning,
            domains, DNS, authentication records, monitoring and an SMTP relay.{" "}
            <strong>Infrabox is an infrastructure provider, not a sender.</strong>{" "}
            You are solely responsible for the content, the recipients and the
            legality of every message sent through infrastructure we provision
            for you.
          </p>
          <p>
            This policy is intended to form a binding part of the Terms of
            Service. Violating it may result in throttling, suspension or
            termination under section 6.
          </p>

          <h2 id="prohibitions">2. Absolute prohibitions</h2>
          <p>You must not use the services to send, or to assist in sending:</p>
          <ol>
            <li>
              Messages that violate the U.S. CAN-SPAM Act, including messages
              with false or misleading header information, deceptive subject
              lines, a missing or non-functional opt-out, or a missing valid
              physical postal address.
            </li>
            <li>
              Messages to recipients in <strong>Canada</strong> without consent
              compliant with CASL — express, or valid implied consent. CASL has
              no general B2B exemption.
            </li>
            <li>
              Messages to individuals in the <strong>EU/EEA</strong> without a
              lawful basis under the GDPR and compliance with national e-privacy
              rules. Where you rely on legitimate interest, you must hold a
              documented Legitimate Interest Assessment.
            </li>
            <li>
              Messages to recipients in the <strong>UK</strong> in violation of
              PECR. Note that sole traders and some partnerships are treated as
              individuals requiring consent.
            </li>
            <li>
              Messages to consumers in <strong>France</strong> without prior
              opt-in consent. The precise scope of this rule is{" "}
              <Pending>scope pending</Pending> and will be confirmed before this
              policy is finalised.
            </li>
            <li>
              Content that is fraudulent, deceptive, defamatory, infringing or
              otherwise illegal; phishing; malware; or link laundering.
            </li>
            <li>
              Messages on behalf of third parties who would themselves be barred
              under this policy. Reselling access to a sender we would refuse is
              the same violation, one step removed.
            </li>
          </ol>

          <h2 id="lists">3. Lists and list hygiene</h2>
          <ul>
            <li>
              Recipient lists must be verified within{" "}
              <Pending>window pending</Pending> before first send, using
              Infrabox&rsquo;s pre-flight verification or a provider approved in
              writing.
            </li>
            <li>
              Lists exceeding a hard-bounce threshold (
              <Pending>threshold pending</Pending>), or with known spam-trap
              contamination, must not be used. Infrabox may block sending from
              mailboxes exhibiting these patterns, and an automatic bounce
              kill-switch engages at a second, higher threshold (
              <Pending>threshold pending</Pending>).
            </li>
            <li>
              Scraped lists of personal, non-business addresses are prohibited.
              B2B business-contact data is permitted only where it is lawful in
              the recipient&rsquo;s jurisdiction — which is a question about the
              recipient, not about you.
            </li>
          </ul>

          <h2 id="technical">4. Technical and volume rules</h2>
          <ul>
            <li>
              Per-mailbox daily sending limits and ramp schedules published by
              Infrabox are hard limits. Attempting to circumvent them —
              unauthorised aliasing, header forgery, or rotating identities to
              evade a limit — is prohibited. The relay enforces its own daily cap
              per mailbox; see{" "}
              <Link href="/guides/smtp-relay">how the relay works</Link>.
            </li>
            <li>
              The SPF, DKIM and DMARC records Infrabox publishes for your domains
              must not be modified or removed. If you need them changed, ask;
              changing them yourself breaks the authentication chain the rest of
              this policy assumes.
            </li>
            <li>
              You must maintain a functional unsubscribe mechanism and honour
              opt-outs within <Pending>window pending</Pending>, or sooner where
              local law requires it.
            </li>
            <li>
              The infrastructure is for business email sending. Abusing provider
              APIs, or automating account access in violation of Google&rsquo;s
              terms, is not permitted.
            </li>
          </ul>

          <h2 id="warranties">5. Your compliance warranties</h2>
          <p>You represent and warrant that:</p>
          <ol>
            <li>you have a lawful basis for each recipient you contact;</li>
            <li>
              your message content complies with all applicable laws in both the
              sending and the receiving jurisdiction;
            </li>
            <li>
              you will indemnify Infrabox against claims, fines and costs arising
              from your sending, on terms to be set out in the Terms of Service.
            </li>
          </ol>

          <h2 id="enforcement">6. Enforcement</h2>
          <p>
            Infrabox operates automated abuse monitoring. Where a trigger below is
            met, the corresponding action follows.
          </p>

          <TableScroll>
            <thead>
              <tr>
                <Th>Trigger</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  Complaint or bounce rate above the first threshold, measured
                  over a rolling window (<Pending />)
                </Td>
                <Td>Automatic warning and a dashboard flag</Td>
              </tr>
              <tr>
                <Td>
                  Complaint or bounce rate above the second threshold (
                  <Pending />)
                </Td>
                <Td>
                  <strong>Automatic sending pause</strong> on the affected
                  mailboxes, pending review
                </Td>
              </tr>
              <tr>
                <Td>Blocklist event attributable to your sending</Td>
                <Td>Pause, plus a required remediation plan</Td>
              </tr>
              <tr>
                <Td>Material violation of section 2</Td>
                <Td>
                  Immediate suspension; termination for cause within{" "}
                  <Pending>period pending</Pending> absent cure
                </Td>
              </tr>
              <tr>
                <Td>
                  Repeated violations within a rolling period (<Pending />)
                </Td>
                <Td>
                  Termination, with no refund of prepaid fees for the affected
                  service
                </Td>
              </tr>
            </tbody>
          </TableScroll>

          <p>
            Enforcement actions are logged and retained for{" "}
            <Pending>period pending</Pending>. Abuse reports can be raised
            through the <Link href="/get-started">get started</Link> form until a
            dedicated address is published; the acknowledgement and action windows
            are <Pending>windows pending</Pending>.
          </p>

          <h2 id="data">7. Data protection</h2>
          <p>
            Where your use involves personal data of individuals in the EU, EEA or
            UK, a Data Processing Agreement under Article 28 GDPR applies.
            Infrabox processes such data only on your documented instructions, as
            processor. <strong>You are the controller</strong> of recipient data —
            you chose the recipients, and Infrabox has no independent relationship
            with them.
          </p>
          <p>
            The DPA itself is not yet drafted. See the{" "}
            <Link href="/legal/privacy-policy">privacy policy</Link> page for what
            is and is not settled.
          </p>

          <LegalFootLinks current="/legal/acceptable-use-policy" />
        </Prose>
      </Article>
    </>
  );
}
