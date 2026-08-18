import type { Metadata } from "next";
import Link from "next/link";

import { Article, ArticleHeader, Pill, Prose } from "@/components/content";
import { LegalFootLinks, NotDrafted } from "../legal-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Infrabox's privacy policy has not been drafted yet. This page states the gap, lists what the finished document must cover, and sets out the one data-protection point that is settled.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede="Not yet written. One part of the picture is settled and is stated below; the rest is an honest gap."
        pills={<Pill>Not written yet</Pill>}
      />

      <Article>
        <Prose>
          <NotDrafted
            covers={[
              "Account data: what Infrabox collects when you sign up, why, and how long it is kept.",
              "Recipient data: the contact lists and message content that pass through the relay, and the fact that message bodies are not stored.",
              "Sub-processors: Google, the domain registrar, the DNS provider, the payment processor and the hosting provider, each named, with the region their processing happens in.",
              "International transfers, and the mechanism relied on for them.",
              "Security measures, including encryption at rest for stored credentials and the fact that sending passwords are hashed rather than encrypted.",
              "Your rights of access, correction, deletion and portability, and how to exercise them.",
              "Cookies and analytics on this site and in the dashboard.",
              "Breach notification: the threshold, the timeline, and who gets told.",
              "The contact point for privacy questions, and a supervisory authority where applicable.",
            ]}
          />

          <h2>The one point that is settled</h2>
          <p>
            For the recipient data you send through Infrabox,{" "}
            <strong>you are the controller and Infrabox is the processor</strong>.
            You chose the recipients; Infrabox has no independent relationship with
            them and processes their data only on your documented instructions.
            That allocation is stated in section 7 of the{" "}
            <Link href="/legal/acceptable-use-policy">Acceptable Use Policy</Link>{" "}
            and is the foundation the Article 28 Data Processing Agreement will be
            built on.
          </p>
          <p>
            The DPA itself is not drafted, and neither is the localisation work it
            needs. Until it is, do not treat this site as a compliance answer for
            EU, EEA or UK recipient data.
          </p>

          <h2>What the product does with message content today</h2>
          <p>
            One factual note, because it is the question people actually ask: when
            you send through the Infrabox SMTP relay, the message bytes are held in
            memory only for as long as it takes to hand them to Google, and are then
            dropped. They are not written to disk and not logged. What is retained
            is delivery metadata — which mailbox sent, when, and what the outcome
            was. The mechanism is described on the{" "}
            <Link href="/guides/smtp-relay">SMTP relay guide</Link>. That is a
            description of the current implementation, not yet a contractual
            commitment.
          </p>

          <LegalFootLinks current="/legal/privacy-policy" />
        </Prose>
      </Article>
    </>
  );
}
