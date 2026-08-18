import type { Metadata } from "next";
import Link from "next/link";

import { Callout, CodeBlock, TableScroll, Td, Th } from "@/components/content";
import { getGuide } from "@/content/guides";
import { GuideShell } from "../guide-chrome";

const guide = getGuide("spf-dkim-dmarc");

const TOC = [
  { id: "the-shape", label: "The shape of the problem" },
  { id: "spf", label: "SPF: which servers may send" },
  { id: "dkim", label: "DKIM: proving a message is intact" },
  { id: "dmarc", label: "DMARC: tying checks to the visible address" },
  { id: "what-infrabox-does", label: "Which of these Infrabox publishes" },
  { id: "reading-failures", label: "Reading a failure" },
];

export const metadata: Metadata = {
  title: guide.shortTitle,
  description: guide.description,
};

export default function SpfDkimDmarcGuide() {
  return (
    <GuideShell slug={guide.slug} toc={TOC}>
      <p>
        Three DNS records get mentioned in the same breath so often that they
        blur into one thing called &ldquo;email authentication&rdquo;. They are
        not one thing. They make three different claims, they are checked at
        three different moments, and two of them are almost useless without the
        third. Knowing which is which is the difference between fixing a
        deliverability problem and guessing at it.
      </p>

      <h2 id="the-shape">The shape of the problem</h2>
      <p>
        SMTP was designed without any notion of who is allowed to send as whom.
        Anyone who can open a connection can write{" "}
        <code>From: ceo@yourcompany.com</code> and the protocol will carry it.
        Every authentication mechanism since is an attempt to bolt an answer onto
        that, from the outside, using DNS — because DNS is the one place a domain
        owner can publish something the whole internet can read and nobody else
        can forge.
      </p>
      <p>
        So all three records are statements <em>published by the domain owner</em>{" "}
        and <em>checked by the receiving server</em>. Infrabox is neither of those
        parties. It publishes on your behalf, into the DNS zone for your domain,
        and then the receiver decides what it thinks.
      </p>

      <h2 id="spf">SPF: which servers may send for this domain</h2>
      <p>
        SPF is a list of IP addresses and hostnames permitted to send mail for
        your domain, published as a TXT record. When a message arrives, the
        receiver looks at the connecting IP, fetches your SPF record, and asks
        whether that IP is on the list.
      </p>
      <CodeBlock label="An SPF record for a Google-hosted domain">
        {`yourdomain.com.  TXT  "v=spf1 include:_spf.google.com ~all"`}
      </CodeBlock>
      <p>
        <code>include:_spf.google.com</code> delegates the actual list to Google,
        which is the only sane way to do it — Google&rsquo;s sending IPs change
        and you do not want to be tracking them. <code>~all</code> is a soft fail:
        anything not on the list is suspicious, not rejected outright.
      </p>
      <p>Two things about SPF trip people up constantly:</p>
      <ul>
        <li>
          <strong>It checks the envelope sender, not the From header you see.</strong>{" "}
          The address SPF validates is the one in the SMTP <code>MAIL FROM</code>{" "}
          command, which the recipient never sees. A message can pass SPF
          perfectly while displaying a completely different From address. This is
          exactly the gap DMARC exists to close.
        </li>
        <li>
          <strong>It breaks on forwarding.</strong> When a mailing list or a
          forwarding rule relays your message, the connecting IP becomes the
          forwarder&rsquo;s, which is not on your list. SPF fails through no fault
          of anyone. This is not a bug you can fix; it is why a second, unrelated
          mechanism exists.
        </li>
      </ul>
      <p>
        There is also a hard limit worth knowing: a receiver is required to give
        up after ten DNS lookups while evaluating your record. Chain enough{" "}
        <code>include:</code> statements together — one per tool you have ever
        connected — and you exceed it, at which point the whole record errors out
        rather than degrading gracefully.
      </p>

      <h2 id="dkim">DKIM: this message was not altered after signing</h2>
      <p>
        DKIM takes a different approach entirely. Instead of asking where a
        message came from, it asks whether the message is intact. The sending
        server hashes a defined set of headers plus the body, signs that hash with
        a private key, and attaches the signature as a{" "}
        <code>DKIM-Signature</code> header. The matching public key sits in DNS.
      </p>
      <CodeBlock label="Where the public key lives">
        {`google._domainkey.yourdomain.com.  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBg..."`}
      </CodeBlock>
      <p>
        <code>google</code> there is the <em>selector</em> — the label naming
        which key was used. The signature header carries the selector, so a
        receiver reads it, constructs the DNS name, fetches the public key, and
        verifies. Multiple selectors can coexist, which is how key rotation works
        without a gap.
      </p>
      <p>What a DKIM pass actually tells the receiver is narrow and specific:</p>
      <ul>
        <li>
          the signing domain holds the private key matching a published public
          key, and
        </li>
        <li>
          the signed headers and body have not changed since that signature was
          made.
        </li>
      </ul>
      <p>
        That is the whole claim. It says nothing about whether the message is
        wanted, whether the sender is reputable, or whether the content is true. A
        spammer can sign their mail with valid DKIM all day. What DKIM provides is
        a <em>stable identifier</em> — a domain that reputation can be attached to
        and that cannot be borrowed by someone else. Unlike SPF, it survives
        forwarding, because the signature travels inside the message rather than
        depending on the connection.
      </p>
      <Callout title="DKIM is not a deliverability setting">
        <p>
          It is a cryptographic claim about integrity and identity. It is also
          what DMARC alignment usually depends on, which is the real reason to
          care about it — see below. Anyone offering you a percentage improvement
          in exchange for turning it on is selling you something.
        </p>
      </Callout>

      <h2 id="dmarc">DMARC: tying the checks to the address people see</h2>
      <p>
        Here is the gap both previous records leave open. SPF validates the
        envelope sender. DKIM validates the signing domain. Neither of them is
        necessarily the <code>From:</code> header that the recipient actually
        reads. A message can pass both and still display someone else&rsquo;s
        domain in the mail client.
      </p>
      <p>
        DMARC closes that by adding a requirement it calls{" "}
        <strong>alignment</strong>: it is not enough for SPF or DKIM to pass, the
        domain that passed has to match the domain in the visible From header.
      </p>

      <TableScroll>
        <thead>
          <tr>
            <Th>Check</Th>
            <Th>Validates</Th>
            <Th>Aligned when</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>SPF</Td>
            <Td>The connecting IP against the envelope sender&rsquo;s domain</Td>
            <Td>Envelope sender domain matches the From domain</Td>
          </tr>
          <tr>
            <Td>DKIM</Td>
            <Td>A signature against the signing domain&rsquo;s published key</Td>
            <Td>Signing domain matches the From domain</Td>
          </tr>
        </tbody>
      </TableScroll>

      <p>
        DMARC passes if <em>either</em> check passes <em>and</em> is aligned. That
        &ldquo;either&rdquo; is deliberate: it is what lets a forwarded message
        survive on DKIM alone when SPF has been broken by the hop.
      </p>
      <CodeBlock label="A DMARC record">
        {`_dmarc.yourdomain.com.  TXT  "v=DMARC1; p=none; rua=mailto:reports@yourdomain.com"`}
      </CodeBlock>
      <p>
        The <code>p=</code> policy tells receivers what to do with unaligned mail
        claiming to be from you: <code>none</code> (do nothing, just report),{" "}
        <code>quarantine</code> (treat as suspicious), or <code>reject</code>{" "}
        (refuse at the door). <code>rua=</code> is where aggregate reports get
        sent — that is the feedback loop, and it is the only way you will find out
        that some tool you forgot about has been sending unaligned mail as you for
        six months.
      </p>
      <p>
        Starting at <code>p=none</code> is not weakness, it is sequence. You
        publish the record, read the reports until you recognise every source
        sending as your domain, and only then tighten the policy. Going straight
        to <code>p=reject</code> on a domain whose sending sources you have not
        inventoried is how organisations lose their invoicing email.
      </p>

      <h2 id="what-infrabox-does">Which of these Infrabox publishes</h2>
      <p>
        Two steps of the <Link href="/how-it-works">provisioning pipeline</Link>{" "}
        do this work, and they are separate for a reason.
      </p>
      <ul>
        <li>
          <strong>The Workspace &amp; DNS step</strong> writes MX, SPF and DMARC
          into your zone with the values Google expects. This is the step people
          most often get wrong by hand — a stray <code>include:</code> pushing you
          over the ten-lookup limit, or a DMARC record that was never published at
          all.
        </li>
        <li>
          <strong>The DKIM step</strong> generates the key, publishes the public
          half at the selector, and switches signing on for the domain. It is a
          separate step because it happens through Google&rsquo;s Admin Console
          rather than an API, and it is the piece most cold-email setups skip
          precisely for that reason.
        </li>
      </ul>
      <p>
        These are records in <em>your</em> domain&rsquo;s zone. Section 4 of the{" "}
        <Link href="/legal/acceptable-use-policy">Acceptable Use Policy</Link>{" "}
        asks you not to edit them, which is less about control than about the fact
        that a hand-edited SPF record is the single most common way a working
        setup stops working.
      </p>

      <h2 id="reading-failures">Reading a failure</h2>
      <p>
        When mail is landing badly, the useful question is not &ldquo;is
        authentication set up&rdquo; but &ldquo;which of the three claims is
        failing, and at which hop&rdquo;. Look at the{" "}
        <code>Authentication-Results</code> header on a message that actually
        arrived somewhere:
      </p>
      <CodeBlock label="A receiver reporting what it found">
        {`Authentication-Results: mx.example.com;
       spf=pass (sender IP is 209.85.x.x) smtp.mailfrom=yourdomain.com;
       dkim=pass header.d=yourdomain.com;
       dmarc=pass action=none header.from=yourdomain.com`}
      </CodeBlock>
      <p>
        Three verdicts, and each names the domain it judged. If{" "}
        <code>dmarc=fail</code> while both SPF and DKIM say pass, you have an
        alignment problem, not an authentication problem — something is signing or
        sending under a domain that is not the one in your From header. That is a
        completely different fix, and it is the one nobody finds without reading
        this header.
      </p>

      <Callout title="Authentication is a floor, not a lever">
        <p>
          All three records together get you to the point where a receiver knows
          who you are and can hold you responsible. That is the entry
          requirement. What happens after — whether your mail is wanted — is
          decided by complaint rates, bounce rates, sending patterns and content,
          and no DNS record influences any of them.
        </p>
      </Callout>
    </GuideShell>
  );
}
