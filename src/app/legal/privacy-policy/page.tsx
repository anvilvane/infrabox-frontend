import type { Metadata } from "next";
import Link from "next/link";

import {
  Article,
  ArticleHeader,
  Callout,
  Pill,
  Prose,
  TableScroll,
  Td,
  Th,
} from "@/components/content";
import { LegalDocRail, LegalNotice } from "../legal-chrome";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Infrabox collects about your account, exactly what the SMTP relay records about a message you send, the administrative access that exists to provisioned mailboxes, who else processes any of it, and how to exercise your rights.",
};

const TOC = [
  { id: "scope", label: "1. Scope" },
  { id: "roles", label: "2. Two roles, not one" },
  { id: "account-data", label: "3. Account data" },
  { id: "domains", label: "4. Domain registration data" },
  { id: "relay", label: "5. What sending records" },
  { id: "mailboxes", label: "6. Access to your mailboxes" },
  { id: "sub-processors", label: "7. Sub-processors and transfers" },
  { id: "retention", label: "8. How long data is kept" },
  { id: "security", label: "9. Security" },
  { id: "rights", label: "10. Your rights" },
  { id: "website", label: "11. This website" },
  { id: "children", label: "12. Children" },
  { id: "changes", label: "13. Changes" },
  { id: "contact", label: "14. Contact" },
];

const CONTACT_EMAIL = "hello@infrabox.io";

export default function PrivacyPolicyPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede="What Infrabox holds, what it can see, and what it deliberately never writes down. Where a claim in here could have been softened, it has not been."
        pills={
          <>
            <Pill>Published</Pill>
            <Pill>Applies to the platform and this site</Pill>
          </>
        }
      />

      <Article toc={TOC} aside={<LegalDocRail current="/legal/privacy-policy" />}>
        <Prose>
          <LegalNotice>
            It describes how the product behaves today. Read it before you buy —
            sections 5 and 6 are the ones people are usually surprised by.
          </LegalNotice>

          <h2 id="scope">1. Scope</h2>
          <p>
            This policy is issued by Infrabox and describes how Infrabox handles
            personal data across three things: this website, the customer
            dashboard and API, and the email infrastructure Infrabox provisions
            and operates for you — domains, DNS, Google Workspace mailboxes and
            the SMTP relay.
          </p>
          <p>
            It does not describe how Google, your domain registrar, or the
            sending tool you connect to the relay handle data once it is in their
            hands. Section 7 names the categories of provider involved so you can
            go and read theirs.
          </p>
          <p>
            Where this policy and the{" "}
            <Link href="/resources/faq">FAQ</Link> describe the same mechanism,
            they are meant to say the same thing. If they ever diverge, the
            product&rsquo;s actual behaviour is the accurate account, and telling
            us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> gets the
            wrong one fixed.
          </p>

          <h2 id="roles">2. Two roles, not one</h2>
          <p>
            Infrabox occupies two genuinely different positions with respect to
            personal data, and almost every question about this policy resolves
            once you know which one applies.
          </p>

          <TableScroll>
            <thead>
              <tr>
                <Th>The data</Th>
                <Th>Infrabox&rsquo;s role</Th>
                <Th>What that means</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Your account data</strong> — who you are, what you
                  bought, how you use the dashboard
                </Td>
                <Td>
                  <strong>Controller</strong>
                </Td>
                <Td>
                  Infrabox decides what is collected and why, and answers to you
                  directly for it. Sections 3, 4, 8, 9 and 10 apply.
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>Recipient data</strong> — the people you contact, and
                  the content of the messages you send them
                </Td>
                <Td>
                  <strong>Processor</strong>
                </Td>
                <Td>
                  You chose those recipients. Infrabox has no relationship with
                  them, no independent purpose for their data, and processes it
                  only to move your mail. Sections 5, 6 and 7 apply.
                </Td>
              </tr>
            </tbody>
          </TableScroll>

          <p>
            This allocation is not a convenience. It is stated in section 7 of the{" "}
            <Link href="/legal/acceptable-use-policy">Acceptable Use Policy</Link>{" "}
            and it is what puts the lawful basis for contacting a given recipient
            on you rather than on Infrabox. Where your sending involves personal
            data of individuals in the EU, EEA or UK, a data processing agreement
            under Article 28 GDPR governs that processing; ask for it at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and it will be
            put in place alongside your subscription.
          </p>

          <h2 id="account-data">3. Account data</h2>
          <p>
            As controller, Infrabox collects only what running an account
            requires:
          </p>
          <ul>
            <li>
              <strong>Identity and contact details</strong> — your name, email
              address, and optionally a phone number, job title and country, taken
              at signup or from the sign-in provider you used.
            </li>
            <li>
              <strong>Team and workspace membership</strong> — which account you
              belong to and what role you hold in it, because access control is
              impossible without it.
            </li>
            <li>
              <strong>Subscription and billing records</strong> — what you bought,
              what it renews at, and the invoice history. Card details are entered
              with a payment processor and are not stored by Infrabox.
            </li>
            <li>
              <strong>Support correspondence</strong> — anything you send to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or through
              the <Link href="/get-started">get started</Link> page, kept so a
              conversation has a memory.
            </li>
            <li>
              <strong>Operational records of your infrastructure</strong> — the
              domains and mailboxes provisioned for you, the state of each
              provisioning step, DNS records published on your behalf, and the
              send log described in section 5.
            </li>
          </ul>
          <p>
            The lawful basis for all of it is performance of the contract you
            entered into, except for records kept to meet a legal obligation
            (billing) or to defend the platform against abuse, which rest on
            Infrabox&rsquo;s legitimate interest in running a network that is not
            used to send fraud.
          </p>

          <h2 id="domains">4. Domain registration data</h2>
          <p>
            Registering a domain means giving a registrar registrant contact
            details, and those details are what appears — or is proxied — in
            WHOIS. Infrabox handles this with an explicit switch rather than a
            default nobody sees:
          </p>
          <ul>
            <li>
              <strong>By default, the registrant is Infrabox</strong>, using
              Infrabox&rsquo;s own contact details, with WHOIS privacy enabled.
              Your personal details are not sent to the registrar as the
              registrant.
            </li>
            <li>
              <strong>You can opt in to your own identity</strong> at purchase, in
              which case the contact details you supply are transmitted to the
              registrar as the registrant of record and are subject to that
              registrar&rsquo;s WHOIS handling and ICANN&rsquo;s requirements.
            </li>
          </ul>
          <p>
            This is a deliberate choice with consequences either way, which is why
            it is a question and not a setting buried in an account page. The{" "}
            <Link href="/resources/faq#domain-owner">FAQ</Link> covers what the
            choice means commercially.
          </p>

          <h2 id="relay">5. What sending through Infrabox records</h2>
          <p>
            This is the section that matters most, so it is the most specific.
            When your sending tool connects to the Infrabox SMTP relay and hands
            over a message, two separate things happen to it.
          </p>

          <p>
            <strong>The message itself is passed through and dropped.</strong> The
            relay forwards your bytes to Google exactly as your tool produced
            them — it does not re-encode the message, because re-serialising it
            would disturb the tracking, threading and campaign headers your tool
            put there. The message is held in memory only for as long as the
            handoff takes. It is not written to disk, not queued to a store, and
            not logged. The only part of it ever read as text is the header block,
            and the reader stops at the blank line that ends the headers and never
            looks past it.
          </p>

          <p>
            <strong>A metadata row is written for every attempt.</strong> One row
            per message, whether it succeeded or not. It contains:
          </p>
          <ul>
            <li>
              the mailbox that authenticated, as an address and an internal
              identifier — that is, who sent it;
            </li>
            <li>
              the team and workspace the mailbox belongs to;
            </li>
            <li>
              the <code>Message-ID</code> header your sending tool generated, and
              the message and thread identifiers Google returned, so a specific
              delivery can be traced later;
            </li>
            <li>
              the outcome, the SMTP status code your tool was handed, and the
              error text where there was one;
            </li>
            <li>
              the <strong>number</strong> of recipients, the size of the message
              in bytes, and how long the send took;
            </li>
            <li>
              the IP address and hostname the connection came from — which is your
              sending tool, not your recipient;
            </li>
            <li>the timestamp.</li>
          </ul>

          <Callout title="What is not in that row, by construction">
            <p>
              No message body. No subject line. No recipient email addresses —
              only a count. No hash or fingerprint of the content either, because
              a hash of a message is still a record of that message.
            </p>
            <p>
              This is enforced in the code rather than left to discipline. The
              function that writes the log physically cannot be handed the raw
              message, and it screens the record it is given for a list of
              content-bearing field names — body, subject, recipients and their
              synonyms — refusing outright in development and stripping them in
              production. The check exists because the obvious future feature
              request, &ldquo;can we show customers what was sent?&rdquo;, is
              exactly the change that would quietly turn this log into a copy of
              every customer&rsquo;s prospect mail.
            </p>
          </Callout>

          <p>
            The same log is the quota ledger: the daily send limit is calculated
            by counting successful rows since midnight UTC rather than from a
            separate counter, so there is one number and not two that can drift
            apart. That is also why the log cannot simply be emptied on request
            mid-period without breaking the rate limiting that protects your
            mailbox&rsquo;s reputation. The mechanism is described in full in{" "}
            <Link href="/guides/smtp-relay">the relay guide</Link>.
          </p>

          <p>
            None of this changes the fact that your sent mail exists in full in
            the mailbox it was sent from, which is a Google mailbox. That is the
            subject of the next section.
          </p>

          <h2 id="mailboxes">6. Access to your mailboxes</h2>
          <p>
            <strong>
              Infrabox can technically read the mailboxes it provisions for you.
            </strong>{" "}
            That is stated plainly here because it is true, and a privacy policy
            that implied otherwise would be contradicted by the{" "}
            <Link href="/resources/faq#can-you-read">FAQ</Link> on the same site.
          </p>
          <p>
            The reason is structural. Your mailboxes are created inside a Google
            Workspace account that Infrabox holds, not one you hold — that is what
            makes unattended provisioning possible at all, and it means Infrabox
            holds the administrative credential for the account they live in.
            Sending credentials are minted through Google domain-wide delegation,
            which is impersonation of a user within an authorised list of scopes,
            and the authorised list includes reading Gmail as well as sending it.
            Reply detection is why the read scope is on the list.
          </p>
          <p>
            What Infrabox undertakes about that access is the part that is a
            choice rather than a consequence:
          </p>
          <ul>
            <li>
              the scope list is kept deliberately short — sending and reading
              Gmail, and the directory operations needed to create and configure
              users. Every additional scope widens what a leaked key could reach,
              so scopes are not added speculatively;
            </li>
            <li>
              impersonation produces a short-lived access token and nothing else.
              No refresh token and no long-lived per-mailbox credential is stored,
              so there is no standing key sitting in a database waiting to be
              stolen;
            </li>
            <li>
              access is used to provision, configure, diagnose and repair your
              infrastructure, and to respond to abuse — not to read your mail for
              any purpose of Infrabox&rsquo;s own, and not for training, analysis,
              resale or profiling.
            </li>
          </ul>
          <p>
            Any provider that provisions and operates Google mailboxes on your
            behalf holds something equivalent. What differs between them is which
            scopes they took and what they say about using them, which is why both
            are written down here. The full mechanism is in{" "}
            <Link href="/guides/domain-wide-delegation">
              the delegation guide
            </Link>
            .
          </p>

          <h2 id="sub-processors">7. Sub-processors and where data goes</h2>
          <p>
            Infrabox does not run a mail system of its own; it operates yours on
            top of other people&rsquo;s. The categories of provider involved:
          </p>

          <TableScroll>
            <thead>
              <tr>
                <Th>Provider</Th>
                <Th>What it processes</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>Google</strong> (Google Workspace and the Gmail API)
                </Td>
                <Td>
                  Your mailboxes and everything in them — every message you send
                  and receive, in full, including recipients and content. Google
                  is where your mail actually lives; Infrabox is the thing that
                  hands it over.
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>The domain registrar and DNS provider</strong> used for
                  your domain
                </Td>
                <Td>
                  The domain name, its DNS records, and registrant contact details
                  — which are Infrabox&rsquo;s unless you opted in under section 4.
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>The hosting and infrastructure provider</strong> running
                  the Infrabox API, dashboard and relay
                </Td>
                <Td>
                  Everything stored by the platform: account records, provisioning
                  state and the send log described in section 5.
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>A payment processor</strong>
                </Td>
                <Td>
                  Your billing details and payment instrument. Card numbers go to
                  the processor and not to Infrabox.
                </Td>
              </tr>
              <tr>
                <Td>
                  <strong>Transactional email and support tooling</strong>
                </Td>
                <Td>
                  Your name and email address, so that account notifications and
                  replies reach you.
                </Td>
              </tr>
            </tbody>
          </TableScroll>

          <p>
            The registrar and DNS provider are named to you for your own domain,
            because more than one is supported and which one is used depends on
            the domain. Infrabox will name any specific provider in the list above
            on request.
          </p>
          <p>
            These providers operate internationally, so operating your
            infrastructure involves transferring personal data across borders,
            including to the United States. Where such a transfer is subject to
            EU, EEA or UK data protection law, it is made under the transfer
            mechanism in the relevant provider&rsquo;s own terms — standard
            contractual clauses in the ordinary case. Infrabox does not claim any
            certification or adequacy finding of its own, and does not hold one.
          </p>

          <h2 id="retention">8. How long data is kept</h2>
          <p>
            Infrabox has not set a fixed number of days for each category, and
            printing one here that the system does not enforce would be a
            fiction. What governs retention instead:
          </p>
          <ul>
            <li>
              <strong>Account and subscription records</strong> are kept while
              your account exists, and afterwards only as long as billing, tax and
              limitation-period obligations require.
            </li>
            <li>
              <strong>The send log</strong> is kept while it is doing work — it
              enforces your daily quota, it is the only record that answers
              &ldquo;did that message go out?&rdquo;, and it is the evidence
              behind any abuse decision. It holds no message content and no
              recipient addresses, so retaining it does not retain your list.
            </li>
            <li>
              <strong>Mailbox contents</strong> are held by Google, not by
              Infrabox, and last as long as the mailbox does. When a subscription
              ends the mailboxes end with it, and their contents go with them.
              There is no export that moves a mailbox into a Workspace you own —
              see the <Link href="/resources/faq#leaving">FAQ</Link>, which does
              not soften this either.
            </li>
            <li>
              <strong>Enforcement records</strong> under the{" "}
              <Link href="/legal/acceptable-use-policy">
                Acceptable Use Policy
              </Link>{" "}
              are kept because a record of what was done about abuse is the only
              defence that a network has.
            </li>
          </ul>
          <p>
            If a defined retention period matters to you, ask for one in writing
            before you buy rather than assuming it.
          </p>

          <h2 id="security">9. Security</h2>
          <p>
            Described, not certified. Infrabox holds no security audit or
            compliance certification and claims none. What is actually
            implemented:
          </p>
          <ul>
            <li>
              <strong>Stored secrets are encrypted with AES-256-GCM</strong> —
              an authenticated cipher, so tampering with stored ciphertext is
              detected rather than silently decrypted. Each value carries its own
              salt and nonce, and the key is derived from a master key held in the
              environment using PBKDF2-SHA256 at 100,000 iterations.
            </li>
            <li>
              <strong>Relay passwords are hashed, not encrypted.</strong> The SMTP
              password your sending tool uses is generated from a cryptographic
              random source, shown to you exactly once, and stored only as a
              bcrypt hash. It cannot be recovered — not by support, not by an
              operator, not by anyone who takes the database. Losing it means
              issuing a new one, and that trade was made deliberately.
            </li>
            <li>
              <strong>Authentication failures cost the same as successes.</strong>{" "}
              An unknown username still runs a full hash comparison, so the relay
              cannot be used as an oracle to enumerate which Infrabox mailboxes
              exist. Verdicts are never cached, which makes revoking a credential
              take effect immediately.
            </li>
            <li>
              <strong>No standing Google credential per mailbox.</strong> As in
              section 6, access tokens are minted on demand and expire; there is
              no long-lived per-mailbox secret in storage.
            </li>
            <li>
              <strong>Transport is encrypted.</strong> The relay requires
              STARTTLS, and the connection onward to Google is HTTPS.
            </li>
            <li>
              <strong>The log is designed not to hold the sensitive thing.</strong>{" "}
              Section 5 is a security measure as much as a privacy one: content
              that is never written down cannot be breached.
            </li>
          </ul>
          <p>
            No system is exempt from compromise. If Infrabox becomes aware of a
            breach affecting your personal data or the recipient data you process
            through the platform, it will tell you without undue delay, describe
            what is known and what is not, and say what it is doing — including
            where the facts are still unclear.
          </p>

          <h2 id="rights">10. Your rights</h2>
          <p>
            For your own account data, where Infrabox is the controller, you can
            ask to:
          </p>
          <ul>
            <li>see what is held about you, and get a copy;</li>
            <li>have inaccurate details corrected;</li>
            <li>
              have data deleted, subject to what must be kept for billing, legal
              obligations, or an unresolved abuse matter;
            </li>
            <li>receive your data in a portable form;</li>
            <li>
              object to or restrict processing that rests on legitimate interest.
            </li>
          </ul>
          <p>
            Depending on where you live, some of these are legal rights and others
            are simply things Infrabox will do. The practical answer is the same
            either way: email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the
            address on the account. You will get a response within a reasonable
            period and, where the law sets one, within the statutory deadline.
            There is no fee.
          </p>
          <p>
            <strong>For recipient data, the route runs through you.</strong> If
            one of your recipients contacts Infrabox asking to see, correct or
            delete their data, Infrabox will not act on it unilaterally — it has
            no relationship with them and no way to verify them. The request will
            be passed to you as the controller, and Infrabox will assist you in
            answering it. If you have a supervisory authority in your
            jurisdiction, nothing in this policy affects your right to complain to
            it.
          </p>

          <h2 id="website">11. This website</h2>
          <Callout title="No analytics, no cookies, no third-party requests">
            <p>
              This marketing site sets no cookies and loads no analytics. There is
              no tracking script, no tag manager, no pixel, no session recorder
              and no advertising identifier on any page of it. Nothing here needs
              a consent banner, which is why you were not shown one.
            </p>
            <p>
              There is also no third-party connection to make. The pages are
              rendered ahead of time and served as static files; both typefaces
              are packaged with the site rather than fetched from a font CDN. The get
              started page has no form and no server behind it — its contact
              action opens a message in your own mail client, so nothing you type
              is transmitted anywhere until you press send.
            </p>
          </Callout>
          <p>
            The web server keeps ordinary request logs, as every web server does,
            which include IP addresses and are used to keep the site up and to
            spot abuse.
          </p>
          <p>
            The customer dashboard is a different application from this site. It
            needs a session cookie or token to keep you signed in, which is
            strictly necessary for it to work at all and is not used to track you
            across other sites.
          </p>

          <h2 id="children">12. Children</h2>
          <p>
            Infrabox sells business email infrastructure to businesses. The
            services are not directed at children, and Infrabox does not knowingly
            collect personal data from anyone under 16. If you believe a child has
            provided personal data through an Infrabox account, write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and it will be
            deleted.
          </p>

          <h2 id="changes">13. Changes to this policy</h2>
          <p>
            This policy tracks how the product actually works, so it changes when
            the product does. Material changes — a new category of data, a new
            sub-processor, a change to what the relay records — will be notified
            to account holders by email before they take effect, and the date at
            the top of this page will change with them.
          </p>
          <p>
            Superseded versions are not published as an archive. If you need to
            know what this page said on a particular date, ask and you will be
            told.
          </p>

          <h2 id="contact">14. Contact</h2>
          <p>
            Privacy questions, data requests, and corrections to anything stated
            on this page:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. A question
            about whether Infrabox can do a thing is best asked before you buy,
            and the <Link href="/get-started">get started</Link> page is the other
            way to reach the same inbox.
          </p>
        </Prose>
      </Article>
    </>
  );
}
