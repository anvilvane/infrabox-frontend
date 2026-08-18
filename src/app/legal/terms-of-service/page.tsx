import type { Metadata } from "next";
import Link from "next/link";

import { Article, ArticleHeader, Pill, Prose } from "@/components/content";
import {
  LEGAL_LAST_UPDATED,
  LegalDocRail,
  LegalNotice,
} from "../legal-chrome";
import {
  DOMAIN_MARKUP,
  MAILBOX_PRICE_USD,
  PIPELINE,
  usd,
} from "@/lib/product";
import { RELAY_DAILY_LIMIT, RELAY_HOST, RELAY_PORT } from "@/content/relay";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The agreement between Infrabox and its customers: what is provided and what is not, who the domain is registered to, what administrative access exists, how billing and termination work, and where liability stops.",
};

const CONTACT_EMAIL = "hello@infrabox.io";

/**
 * Summed from the pipeline rather than written down, exactly as the FAQ does
 * it. If a step's duration changes in `product.ts`, this sentence changes with
 * it instead of quietly going stale.
 */
const TOTAL_HOURS = Math.round(
  PIPELINE.reduce((sum, step) => sum + step.typicalMinutes, 0) / 60,
);

const TOC = [
  { id: "parties", label: "1. The agreement" },
  { id: "account", label: "2. Eligibility and account" },
  { id: "provides", label: "3. What Infrabox provides" },
  { id: "not-provided", label: "4. What is not provided" },
  { id: "obligations", label: "5. Your obligations" },
  { id: "domains", label: "6. Domains and registrant identity" },
  { id: "google", label: "7. Google Workspace" },
  { id: "access", label: "8. Administrative access" },
  { id: "fees", label: "9. Fees, billing and renewal" },
  { id: "suspension", label: "10. Suspension and termination" },
  { id: "ending", label: "11. When the agreement ends" },
  { id: "availability", label: "12. Availability and support" },
  { id: "liability", label: "13. Warranties and liability" },
  { id: "changes", label: "14. Changes to these Terms" },
  { id: "contact", label: "15. Contact" },
];

export default function TermsOfServicePage() {
  return (
    <>
      <ArticleHeader
        eyebrow="Legal"
        title="Terms of Service"
        lede="The agreement that governs an Infrabox account: what you are buying, what you are not, who the domain is registered to, what access Infrabox holds over the mailboxes it creates, and what happens when either side walks away."
        pills={
          <>
            <Pill>Last updated {LEGAL_LAST_UPDATED}</Pill>
            <Pill>{TOC.length} sections</Pill>
          </>
        }
      />

      <Article
        toc={TOC}
        aside={<LegalDocRail current="/legal/terms-of-service" />}
      >
        <Prose>
          <LegalNotice>
            Three clauses below carry more weight than the rest — the registrant
            identity of your domains (section 6), the administrative access
            Infrabox holds (section 8), and what does and does not survive
            termination (section 11). Read those before you buy.
          </LegalNotice>

          <h2 id="parties">1. The agreement</h2>
          <p>
            These Terms of Service (the &ldquo;Terms&rdquo;) govern your use of
            the Infrabox platform and everything bought through it. They are an
            agreement between <strong>Infrabox</strong> (&ldquo;Infrabox&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;) and the person or company that
            opens the account and pays for the services (&ldquo;you&rdquo;).
            Where you open an account for a company, you confirm you are
            authorised to bind it, and &ldquo;you&rdquo; means that company.
          </p>
          <p>
            You accept these Terms by creating an account, placing an order or
            using any part of the service. If you do not accept them, do not use
            the service.
          </p>
          <p>
            The{" "}
            <Link href="/legal/acceptable-use-policy">
              Acceptable Use Policy
            </Link>
            , the <Link href="/legal/refund-policy">Refund Policy</Link> and the{" "}
            <Link href="/legal/privacy-policy">Privacy Policy</Link> form part
            of these Terms and are incorporated by reference. Where these Terms
            and one of those documents conflict, these Terms govern — except on
            questions of what may be sent, where the Acceptable Use Policy
            governs.
          </p>
          <p>
            The{" "}
            <Link href="/legal/service-level-agreement">
              deliverability SLA
            </Link>{" "}
            published on this site is a draft written for a guaranteed-placement
            tier that Infrabox does not currently sell. It is <strong>not</strong>{" "}
            part of these Terms and creates no obligation on either side.
            Nothing in it should be relied on when deciding to buy.
          </p>

          <h2 id="account">2. Eligibility and your account</h2>
          <ul>
            <li>
              You must be able to enter a binding contract, and you must use the
              service for business purposes. This is business sending
              infrastructure; it is not sold to consumers for personal use.
            </li>
            <li>
              The information you give us — billing details, and any contact
              details you elect to use as a domain registrant under section 6 —
              must be accurate and kept current. Registrars and registries can
              suspend a domain over inaccurate registrant data, and that is a
              consequence we cannot reverse for you.
            </li>
            <li>
              You are responsible for everything done under your account,
              including by anyone you invite to your team and by any sending
              tool you connect. Keep dashboard logins and relay credentials
              secure, and tell us promptly if you believe either has been
              compromised.
            </li>
            <li>
              We send provisioning notices, abuse notices and billing notices to
              the email address on the account. Keep it monitored; a notice sent
              there is treated as given.
            </li>
          </ul>

          <h2 id="provides">3. What Infrabox provides</h2>
          <p>
            Subject to payment and to these Terms, Infrabox provides some or all
            of the following, as ordered:
          </p>
          <ul>
            <li>
              <strong>Domain registration and DNS.</strong> Registration of
              domains through a registrar Infrabox holds an account with, and
              hosting of those domains&rsquo; DNS in a zone Infrabox manages.
              You may instead connect a domain you already own, provided its DNS
              is pointed at that zone.
            </li>
            <li>
              <strong>Google Workspace mailboxes.</strong> Mailboxes on your
              domain, created as users inside Google Workspace accounts that
              Infrabox holds. Your domain is attached to one of those accounts
              as a secondary domain. You do not sign up for Workspace, do not
              receive a Workspace bill, and do not hold the Workspace admin
              password.
            </li>
            <li>
              <strong>Automated provisioning.</strong> A {PIPELINE.length}-step
              pipeline that places the Workspace order, creates the admin
              account, waits for Google to activate it, publishes MX, SPF and
              DMARC, obtains Google&rsquo;s domain verification, generates and
              publishes a DKIM key and enables signing, mints and verifies a
              sending credential, and puts the mailbox on its renewal schedule.
            </li>
            <li>
              <strong>An SMTP relay.</strong> Sending access at{" "}
              <code>{RELAY_HOST}</code> on port {RELAY_PORT} over STARTTLS,
              authenticated with a relay credential issued by Infrabox rather
              than by Google, subject to a default cap of{" "}
              {RELAY_DAILY_LIMIT.toLocaleString("en-US")} messages per mailbox
              per day counted midnight to midnight UTC.
            </li>
            <li>
              <strong>Status and monitoring.</strong> Live provisioning status
              per mailbox, and the abuse monitoring described in section 6 of
              the Acceptable Use Policy.
            </li>
          </ul>

          <h2 id="not-provided">4. What Infrabox does not provide</h2>
          <p>
            This section is deliberately explicit, because the gap between what
            is sold and what people assume is sold is where most disputes start.
          </p>
          <ul>
            <li>
              <strong>Any mailbox platform other than Google Workspace.</strong>{" "}
              Microsoft 365 and Outlook mailboxes, Azure-hosted mail, and plain
              self-hosted or IP-based SMTP sending are <strong>not</strong>{" "}
              offered today. Nothing on this site is an offer to supply them,
              and no order can be placed for them.
            </li>
            <li>
              <strong>A sending tool.</strong> Infrabox is the infrastructure
              underneath a sequencer, not a sequencer. Whatever you pay yours is
              separate and unchanged.
            </li>
            <li>
              <strong>Programmatic mailbox reading for you.</strong> The sending
              credential sends; it does not give you IMAP. Replies do arrive at
              the mailbox, because MX is published during provisioning.
            </li>
            <li>
              <strong>
                Any guarantee of deliverability, inbox placement, sender
                reputation or campaign outcome.
              </strong>{" "}
              No placement rate is promised here and no service level stands
              behind one. Whether your mail reaches an inbox depends on your
              content, your lists and the receiving provider&rsquo;s judgement.
            </li>
            <li>
              <strong>
                Any assurance about what Google, a registrar or a registry will
                do.
              </strong>{" "}
              Each can suspend, refuse or reclaim an account or a domain on its
              own terms and its own schedule.
            </li>
            <li>
              <strong>Lists, content, or legal advice.</strong> You choose the
              recipients and write the messages, and you are responsible for the
              lawfulness of both.
            </li>
          </ul>

          <h2 id="obligations">5. Your obligations</h2>
          <p>
            <strong>
              Infrabox is an infrastructure provider, not a sender.
            </strong>{" "}
            You are solely responsible for the content, the recipients and the
            legality of every message sent through infrastructure we provision
            for you. The{" "}
            <Link href="/legal/acceptable-use-policy">
              Acceptable Use Policy
            </Link>{" "}
            applies in full to that sending and forms part of these Terms; a
            breach of it is a breach of these Terms.
          </p>
          <p>In addition, and without limiting that policy, you must:</p>
          <ol>
            <li>
              leave the SPF, DKIM and DMARC records Infrabox publishes for your
              domains in place and unmodified — ask us if you need them changed,
              because editing them yourself breaks the authentication chain the
              rest of the service assumes;
            </li>
            <li>
              stay within the relay&rsquo;s per-mailbox daily cap and any ramp
              schedule we publish, and not rotate identities or forge headers to
              get around either;
            </li>
            <li>
              not use the mailboxes for anything other than business email, and
              not use them in a way that would breach Google&rsquo;s own terms;
            </li>
            <li>
              not resell or provide access to a sender who would themselves be
              refused under the Acceptable Use Policy;
            </li>
            <li>
              hold a lawful basis for every recipient you contact, and comply
              with the law of both the sending and the receiving jurisdiction.
            </li>
          </ol>
          <p>
            <strong>Indemnity.</strong> You will indemnify Infrabox against
            third-party claims, regulatory penalties, blocklist remediation
            costs and reasonable legal costs arising from your sending, your
            content, your recipient data or your breach of these Terms. This
            indemnity is not subject to the cap in section 13 — that cap limits
            what Infrabox owes you, not what you owe us.
          </p>

          <h2 id="domains">6. Domains, registrant identity and DNS</h2>
          <p>
            This is material and belongs in plain sight rather than in a
            schedule.{" "}
            <strong>
              By default, a domain bought through Infrabox is registered under
              Infrabox&rsquo;s own registrant identity, with WHOIS privacy
              enabled. You are not the registrant of record unless you choose to
              be.
            </strong>
          </p>
          <p>
            There is an explicit option at purchase to use{" "}
            <strong>your own contact details</strong> as the registrant of
            record instead. It is a real choice with real consequences, and it
            is worth making deliberately: if the registrant identity matters to
            you — because the domain is an asset you intend to keep, or because
            your own name appearing in WHOIS is part of how you present — select
            your own identity when you buy. Changing it afterwards depends on
            registrar and registry procedures and is not a setting you can flip.
          </p>
          <ul>
            <li>
              <strong>What the default means in practice.</strong> Where a
              domain stands in Infrabox&rsquo;s registrant identity, the
              registrar recognises Infrabox, not you, as the party entitled to
              instruct it. You direct what happens to the domain through your
              account; the registrar relationship is ours.
            </li>
            <li>
              <strong>What it does not mean.</strong> Infrabox will not send
              from your domains for its own purposes, will not transfer a domain
              you paid for to another customer, and will not park, monetise or
              sell it while your subscription is current.
            </li>
            <li>
              <strong>DNS.</strong> Domains under management must be served by
              the DNS zone Infrabox manages, because every provisioning step
              works by writing records into it — MX, SPF, DMARC, the Google
              verification token and the DKIM key. A domain whose DNS you want
              to keep elsewhere is not compatible with this service.
            </li>
            <li>
              <strong>Renewal and lapse.</strong> Domains are registered by the
              year. A registration that is not renewed and paid for lapses at
              the registry, after which the name may be registered by anyone.
              Registration, renewal and transfer are all governed by registrar,
              registry and ICANN rules that neither of us can vary.
            </li>
            <li>
              <strong>Names you choose.</strong> You are responsible for
              ensuring a name you ask us to register does not infringe someone
              else&rsquo;s trademark or other rights. We may refuse to register
              a name.
            </li>
          </ul>
          <p>
            What happens to domains when the agreement ends — including the
            state of transfer-out today — is in section 11.
          </p>

          <h2 id="google">7. The Google Workspace relationship</h2>
          <p>
            Your mailboxes are Google Workspace users inside Workspace accounts
            that Infrabox holds and administers. Infrabox is Google&rsquo;s
            customer for those accounts. You do not hold a Workspace contract
            with Google for them, do not receive a Workspace invoice, and do not
            hold the admin password.
          </p>
          <ul>
            <li>
              <strong>Google&rsquo;s terms apply to the mailboxes.</strong> Mail
              sent from them is subject to Google&rsquo;s terms, sending limits
              and program policies as well as to these Terms. Use that would
              breach Google&rsquo;s terms is also a breach of ours.
            </li>
            <li>
              <strong>Google&rsquo;s decisions are final as to Google.</strong>{" "}
              Google can suspend a mailbox, a domain or an entire Workspace
              account for its own reasons and on its own schedule. There is no
              appeal process Infrabox controls, and we do not promise a
              particular outcome from one. Workspace accounts in our pool are
              deliberately kept well below Google&rsquo;s ceiling on domains per
              account, so a suspension affects a bounded set of domains rather
              than everything at once.
            </li>
            <li>
              <strong>Google&rsquo;s platform can change.</strong> Where Google
              changes an API, a policy or an administrative surface the service
              depends on, Infrabox may have to change how a step works or, in
              the extreme, stop offering it. Section 12 covers what happens
              then.
            </li>
          </ul>
          <p>
            Google&rsquo;s own limits sit underneath the relay cap in section 3.
            The lower of the two is the one that binds.
          </p>

          <h2 id="access">
            8. Administrative access, and what Infrabox can see
          </h2>
          <p>
            Stated plainly, because it is structural rather than incidental:{" "}
            <strong>
              Infrabox is technically able to read mail in the mailboxes it
              provisions.
            </strong>
          </p>
          <p>
            Sending credentials are minted through Google domain-wide
            delegation, which is impersonation of a user within an authorised
            list of scopes, and that list includes reading Gmail as well as
            sending it. Infrabox also holds the Workspace admin credentials for
            the pooled account your domain sits in. This is not a policy choice
            we could simply reverse: any provider that provisions and operates
            Google mailboxes on your behalf holds something equivalent. What
            varies between providers is which scopes they took and what their
            contract says about using them. Ours says this:
          </p>
          <ul>
            <li>
              The delegated scope list is kept to what provisioning and
              operation require — sending mail, reading mail, and administering
              users and domains in the directory. Each extra scope widens the
              blast radius of a leaked key, so the list is deliberately short.
              The mechanism is described in full in{" "}
              <Link href="/guides/domain-wide-delegation">
                the delegation guide
              </Link>
              .
            </li>
            <li>
              We use that access to provision, operate, repair and support your
              mailboxes; to investigate a suspected breach of the Acceptable Use
              Policy or a security incident; and where we are required to by
              law. We do not read your mail for commercial purposes, do not use
              its contents for our own sending, and do not sell it.
            </li>
            <li>
              Messages you send through the relay pass through Infrabox systems,
              which process them in order to hand them to Gmail. What is
              retained, and for how long, is described in the{" "}
              <Link href="/legal/privacy-policy">Privacy Policy</Link>.
            </li>
            <li>
              Administrative actions are logged, and enforcement actions are
              logged and retained under section 6 of the Acceptable Use Policy.
            </li>
          </ul>
          <p>
            If mail whose contents cannot be visible to a vendor is going to
            pass through these mailboxes, this is not the right service for it,
            and no clause here changes that.
          </p>

          <h2 id="fees">9. Fees, billing and renewal</h2>
          <p>There are two kinds of charge, and they behave differently.</p>
          <ul>
            <li>
              <strong>Mailboxes</strong> are billed at {usd(MAILBOX_PRICE_USD)}{" "}
              per Google Workspace mailbox per month, recurring until cancelled.
            </li>
            <li>
              <strong>Domains</strong> are billed per registration, per year,
              priced per TLD, and include a platform markup — $
              {DOMAIN_MARKUP.standard} on a newly registered domain and $
              {DOMAIN_MARKUP.aged} on one already{" "}
              {DOMAIN_MARKUP.agedThresholdYears * 12} months or older. The
              tables on the <Link href="/pricing">pricing page</Link> are
              indicative; the price quoted at checkout is the price charged.
            </li>
          </ul>
          <p>
            There is no minimum term, no setup or onboarding fee, and no
            per-record DNS charge. Prices are quoted in US dollars. Any sales
            tax, VAT or equivalent that applies to you is your responsibility
            unless it is itemised on your invoice.
          </p>
          <ul>
            <li>
              <strong>Renewal.</strong> Mailbox subscriptions renew
              automatically each month until you cancel. Domain registrations
              run for their registered year; renewal is scheduled as the final
              provisioning step so a mailbox does not quietly lapse
              mid-campaign.
            </li>
            <li>
              <strong>Failed payment.</strong> If a charge fails we may suspend
              sending and, if it stays unpaid, terminate the affected services
              under section 10. A domain whose renewal is not paid for will
              lapse at the registry, and a lapsed domain takes its mailboxes
              with it.
            </li>
            <li>
              <strong>Price changes.</strong> We may change prices. A change to
              a recurring mailbox fee applies from your next renewal after we
              tell you about it, and you are free to cancel before that renewal
              rather than accept it. Domain pricing follows registrar and
              registry pricing, which can move without notice to us.
            </li>
            <li>
              <strong>Refunds</strong> are governed by the{" "}
              <Link href="/legal/refund-policy">Refund Policy</Link>. The short
              version is that a domain registration is spent the moment it
              succeeds and a mailbox subscription is not.
            </li>
          </ul>

          <h2 id="suspension">10. Suspension and termination</h2>
          <p>
            <strong>By you.</strong> There is no minimum term. You may cancel a
            mailbox subscription at any time; what happens to the remainder of a
            paid period is in the Refund Policy.
          </p>
          <p>
            <strong>By Infrabox.</strong> We may suspend sending, suspend an
            account, or terminate services where:
          </p>
          <ol>
            <li>a payment fails and is not resolved;</li>
            <li>
              the Acceptable Use Policy is breached — the enforcement ladder in
              its section 6 sets out which trigger produces a warning, an
              automatic sending pause, or termination for cause;
            </li>
            <li>
              complaint or bounce behaviour crosses the automated thresholds, in
              which case a sending pause may be applied by the system before
              anyone reviews it;
            </li>
            <li>
              Google, a registrar, a registry, a blocklist operator or a legal
              authority requires it;
            </li>
            <li>
              the activity endangers the pooled infrastructure or the other
              customers on it — a pooled Workspace means one sender&rsquo;s
              conduct can put other people&rsquo;s mailboxes at risk, and we
              will act to prevent that.
            </li>
          </ol>
          <p>
            Where we terminate for cause under this section, prepaid fees for
            the affected service are not refunded. We may also stop selling a
            service, or close an account without cause, in which case we will
            tell you, stop charging you, and treat money already paid under the
            Refund Policy.
          </p>

          <h2 id="ending">
            11. What happens to domains and mailboxes at the end
          </h2>
          <p>
            <strong>Mailboxes end.</strong> They exist as users inside a Google
            Workspace account that Infrabox holds, so there is nothing to hand
            over: no export turns them into mailboxes in a Workspace you own,
            because the account they live in is not yours to receive them into.
            When the subscription ends, the mailboxes and their contents are
            deleted. If mail held in one matters to you, retrieve it while the
            mailbox still exists — tell us before you cancel and we will help
            you arrange it. Once deleted, it cannot be recovered.
          </p>
          <p>
            <strong>
              Domains are a different question, and the honest answer is
              uncomfortable.
            </strong>{" "}
            A registration you paid for runs to the end of its registered year
            regardless of whether the mailboxes on it are still running. But{" "}
            <strong>transfer-out is not automated</strong>: there is no
            self-service path in the product today to obtain an authorisation
            code and move a domain to another registrar. Moving one is a manual
            request handled by a person, not a button in the dashboard.
          </p>
          <ul>
            <li>
              We will not unreasonably refuse a transfer-out request for a
              domain you have paid for and which is not the subject of an unpaid
              invoice or an open abuse investigation.
            </li>
            <li>
              Timing is governed by registrar and registry rules, including the
              restrictions that apply to recently registered or recently
              modified domains. Those rules bind us as much as they bind you.
            </li>
            <li>
              Where the domain stands in Infrabox&rsquo;s registrant identity
              under section 6, moving it also involves a change of registrant,
              which some registries treat as a separate process with its own
              conditions.
            </li>
            <li>
              If being able to walk away with your domains on your own schedule
              is a requirement, raise it before you buy rather than after. This
              clause is the whole of what we can promise today.
            </li>
          </ul>
          <p>
            Account data after termination is handled under the{" "}
            <Link href="/legal/privacy-policy">Privacy Policy</Link>.
          </p>

          <h2 id="availability">
            12. Availability, provisioning times and support
          </h2>
          <p>
            <strong>
              These Terms contain no uptime commitment, and no availability
              percentage is published anywhere on this site.
            </strong>{" "}
            We do not offer a service level agreement today, and we would rather
            say that than print a number no measurement of ours would support.
            We operate the service with reasonable skill and care, and that is
            the commitment.
          </p>
          <p>
            <strong>Provisioning times are estimates, not commitments.</strong>{" "}
            The typical case is roughly {TOTAL_HOURS} hours end to end, and it
            is dominated by a single step: waiting for Google to confirm it can
            see the domain-verification record. That wait is paced by DNS
            propagation and by Google&rsquo;s own checking schedule. Nobody —
            not Infrabox, not you, not a support ticket — makes it go faster.
            The per-step breakdown is on{" "}
            <Link href="/how-it-works">how it works</Link>.
          </p>
          <p>
            The DKIM step still depends on driving Google&rsquo;s Admin Console
            rather than calling an API, because Google exposes no API for it,
            and it is therefore the step most likely to need attention. A
            mailbox without DKIM can still send; what it loses is a signing
            identity, so DMARC has only SPF to align against and SPF does not
            survive forwarding.
          </p>
          <p>
            We may change, add to or withdraw features, and we may perform
            maintenance that interrupts the service. Where a change removes
            something you were relying on, we will tell you, and you may cancel.
            Support is by email at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>; these Terms
            do not set a response time.
          </p>

          <h2 id="liability">13. Warranties, liability and disputes</h2>
          <p>
            To the fullest extent the law allows, the service is provided as it
            is, and Infrabox excludes implied warranties of merchantability,
            fitness for a particular purpose and non-infringement. Nothing here
            excludes liability that cannot lawfully be excluded, including for
            fraud or for death or personal injury caused by negligence, and
            nothing here affects rights you hold under mandatory law that
            applies to you.
          </p>
          <p>Infrabox is not liable for:</p>
          <ul>
            <li>
              lost profits, lost revenue, lost business, lost or delayed
              campaigns, wasted expenditure, or loss of goodwill or reputation;
            </li>
            <li>
              deliverability outcomes, spam-folder placement, blocklisting, or a
              receiving provider&rsquo;s treatment of your mail;
            </li>
            <li>
              acts and decisions of Google, a registrar, a registry, a blocklist
              operator or any other third party, including suspension, refusal
              or reclamation of an account or a domain;
            </li>
            <li>
              loss of mailbox contents where you did not retrieve them before
              the mailbox was deleted under section 11;
            </li>
            <li>anything arising from your own breach of these Terms.</li>
          </ul>
          <p>
            <strong>Cap.</strong> Infrabox&rsquo;s total aggregate liability
            arising out of or in connection with these Terms is limited to the
            fees you paid Infrabox for the affected service in the three months
            before the event giving rise to the claim. That is a policy choice
            rather than a legal necessity, and it is stated here so it is
            visible before purchase rather than after a dispute.
          </p>
          <p>
            <strong>One thing these Terms do not settle.</strong> They do not
            name a governing law, a court or an arbitration forum. Rather than
            print a jurisdiction that has not actually been decided, we have
            left it out; until it is settled, a dispute is resolved under
            whatever law and forum would apply anyway. If that matters to you,
            raise it before you buy and we will deal with it in writing.
          </p>

          <h2 id="changes">14. Changes to these Terms</h2>
          <p>
            We may update these Terms. The date at the top of this page is the
            date of the current version, and it changes when the document does.
            Where a change materially affects a service you are subscribed to,
            we will tell you at the account email address before it applies to
            your next renewal. Continuing to use the service after that is
            acceptance; if you do not accept a change, cancel before the renewal
            it would apply to. Changes never apply retroactively to a period
            already paid for.
          </p>

          <h2 id="contact">15. Contact</h2>
          <p>
            Questions about these Terms, anything in them you want settled in
            writing before you buy, and requests under sections 10 and 11 all go
            to the same place:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can
            also use the <Link href="/get-started">get started</Link> page.
            Questions that come up more than once end up on the{" "}
            <Link href="/resources/faq">FAQ</Link>, phrased the way they were
            asked.
          </p>
        </Prose>
      </Article>
    </>
  );
}
