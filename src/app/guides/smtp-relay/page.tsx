import type { Metadata } from "next";
import Link from "next/link";

import {
  Callout,
  CodeBlock,
  TableScroll,
  Td,
  Th,
} from "@/components/content";
import { getGuide } from "@/content/guides";
import {
  RELAY_AUTH_METHODS,
  RELAY_CODES,
  RELAY_DAILY_LIMIT,
  RELAY_HOST,
  RELAY_MAX_MESSAGE_MB,
  RELAY_PASSWORD_LENGTH,
  RELAY_PORT,
  RELAY_SECURITY,
} from "@/content/relay";
import { GuideShell } from "../guide-chrome";

const guide = getGuide("smtp-relay");

const TOC = [
  { id: "settings", label: "The settings" },
  { id: "password", label: "The password is shown once" },
  { id: "what-happens", label: "What happens to a message" },
  { id: "limits", label: "Limits" },
  { id: "codes", label: "Reading the codes it sends back" },
  { id: "testing", label: "Testing it by hand" },
  { id: "troubleshooting", label: "When it will not connect" },
];

export const metadata: Metadata = {
  title: guide.shortTitle,
  description: guide.description,
};

export default function SmtpRelayGuide() {
  return (
    <GuideShell slug={guide.slug} toc={TOC}>
      <p>
        Your sending tool wants a host, a port, a username and a password. It
        does not care what happens after that. This guide covers what to type,
        and then what actually happens to a message once the relay has it —
        because the second part is what you will need when something returns a
        code you do not recognise.
      </p>

      <h2 id="settings">The settings</h2>
      <p>
        Every mailbox uses the same host and port. Only the username and password
        differ.
      </p>

      <TableScroll>
        <thead>
          <tr>
            <Th>Field</Th>
            <Th>Value</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Host</Td>
            <Td>
              <code>{RELAY_HOST}</code>
            </Td>
          </tr>
          <tr>
            <Td>Port</Td>
            <Td className="tabular">{RELAY_PORT}</Td>
          </tr>
          <tr>
            <Td>Encryption</Td>
            <Td>{RELAY_SECURITY}</Td>
          </tr>
          <tr>
            <Td>Username</Td>
            <Td>The full mailbox address</Td>
          </tr>
          <tr>
            <Td>Password</Td>
            <Td>
              The relay credential, issued in the dashboard and shown once
            </Td>
          </tr>
          <tr>
            <Td>Authentication</Td>
            <Td>{RELAY_AUTH_METHODS.join(" or ")}</Td>
          </tr>
        </tbody>
      </TableScroll>

      <p>
        Some tools label the encryption field &ldquo;TLS&rdquo; and some say
        &ldquo;STARTTLS&rdquo;. On port {RELAY_PORT} they mean the same thing:
        connect in the clear, then upgrade before anything sensitive crosses the
        wire. If a tool offers you SSL on port 465, it is offering a different
        thing and the relay does not listen there.
      </p>

      <h2 id="password">The password is shown once, and that is not a UI choice</h2>
      <p>
        When you issue a relay credential you get a {RELAY_PASSWORD_LENGTH}
        -character password, once. It is not retrievable afterwards. The reason
        is worth stating precisely, because &ldquo;we choose not to show it
        again&rdquo; and &ldquo;we cannot show it again&rdquo; are very different
        promises: the password is stored as a bcrypt hash, so there is no code
        path that could return it. Losing it means rotating it, not recovering
        it.
      </p>
      <p>
        Rotation overwrites the credential immediately. There is no overlap
        window where both the old and the new password work, so rotate when your
        tool is ready to take the new value, not before.
      </p>
      <Callout title="This password is not your Google password">
        <p>
          It is an Infrabox credential, checked by Infrabox. Google is never
          consulted during authentication and never sees it. That is the whole
          point of the relay: it exists because{" "}
          <Link href="/guides/app-passwords">
            a Google app password cannot be produced by automation
          </Link>
          , so the relay issues its own credential and translates.
        </p>
      </Callout>

      <h2 id="what-happens">What happens to a message</h2>
      <p>
        The relay speaks SMTP to your tool and the Gmail API to Google. In
        between it does as little as possible, on purpose.
      </p>
      <ol>
        <li>
          Your tool connects, upgrades to TLS, and authenticates with the relay
          credential.
        </li>
        <li>
          The message bytes are buffered in memory. Nothing is written to disk
          and the message body is never logged.
        </li>
        <li>
          A short-lived access token for that specific mailbox is minted through{" "}
          <Link href="/guides/domain-wide-delegation">
            domain-wide delegation
          </Link>
          .
        </li>
        <li>
          The original bytes are handed to the Gmail send API{" "}
          <strong>unchanged</strong>, base64-encoded, with no re-serialisation.
        </li>
        <li>
          Google&rsquo;s message ID comes back and is returned to your tool in the{" "}
          <code>250</code> acceptance line. The buffered bytes are dropped.
        </li>
      </ol>

      <h3>Why the message is forwarded byte-for-byte</h3>
      <p>
        This is the single most consequential decision in the relay. Anything that
        parses a message and rebuilds it will subtly change it: header order,
        encoding of the boundary parameters, whitespace. Three things break when
        that happens.
      </p>
      <ul>
        <li>
          <strong>Your <code>Message-ID</code> changes</strong>, and reply
          threading in your sequencer stops working, because threading is matched
          on that value.
        </li>
        <li>
          <strong><code>List-Unsubscribe</code> can be dropped or reordered</strong>
          , which matters to receivers that look for it.
        </li>
        <li>
          <strong>Custom <code>X-</code> headers your tool relies on</strong> for
          open tracking and campaign attribution disappear.
        </li>
      </ul>
      <p>
        Forwarding the exact bytes avoids all three. It also means the relay
        cannot silently &ldquo;fix&rdquo; a malformed message for you — if your
        tool produces something Google rejects, you get the rejection rather than
        a quietly rewritten message.
      </p>

      <h3>The one header Google does enforce</h3>
      <p>
        The <code>From</code> header has to be the authenticated mailbox. Google
        checks this, not the relay, and refuses anything else. Sending tools that
        let you set a display From different from the connection identity will
        produce a rejection here. The envelope sender is a separate matter — the
        relay does not forward your <code>MAIL FROM</code>, because Gmail derives
        the envelope sender from the authenticated user regardless.
      </p>

      <h2 id="limits">Limits</h2>
      <ul>
        <li>
          <strong>Message size:</strong> {RELAY_MAX_MESSAGE_MB} MB. The
          constraint is the Gmail API&rsquo;s upload path rather than SMTP.
        </li>
        <li>
          <strong>Daily sending:</strong> {RELAY_DAILY_LIMIT.toLocaleString(
            "en-US",
          )}{" "}
          messages per mailbox by default, counted from midnight to midnight{" "}
          <strong>UTC</strong> — not your local midnight, which is worth knowing
          if your schedule assumes otherwise. Only successful sends count against
          it.
        </li>
      </ul>
      <p>
        That cap is a technical ceiling, not a recommendation. Sending anywhere
        near it from a new mailbox is a good way to get the mailbox suspended.
        Google applies its own limits underneath, and the ramp rules in section 4
        of the{" "}
        <Link href="/legal/acceptable-use-policy">Acceptable Use Policy</Link>{" "}
        apply well below the ceiling.
      </p>

      <h2 id="codes">Reading the codes it sends back</h2>
      <p>
        The relay maps Google&rsquo;s answers onto SMTP codes your tool already
        understands. The mapping is biased in one direction on purpose: anything
        the relay cannot confidently classify comes back as a{" "}
        <strong>4xx</strong>, because most sending tools treat a 5xx as
        &ldquo;this address is permanently dead&rdquo; and will stop retrying a
        mailbox that was only briefly unavailable.
      </p>

      <TableScroll>
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>What it means</Th>
            <Th>What to do</Th>
          </tr>
        </thead>
        <tbody>
          {RELAY_CODES.map((c) => (
            <tr key={c.code}>
              <Td className="whitespace-nowrap font-mono text-[0.85em] text-foreground">
                {c.code}
              </Td>
              <Td>{c.meaning}</Td>
              <Td>{c.action}</Td>
            </tr>
          ))}
        </tbody>
      </TableScroll>

      <h2 id="testing">Testing it by hand</h2>
      <p>
        Before wiring a tool up, it is worth confirming the credential works at
        all. Any SMTP client will do; the useful part is what you should see.
      </p>
      <CodeBlock label="A successful exchange, abridged">
        {`220 Infrabox SMTP relay
EHLO test
250-STARTTLS
250 AUTH PLAIN LOGIN
STARTTLS
220 Ready to start TLS
AUTH LOGIN
...
235 Authentication successful
MAIL FROM:<you@yourdomain.com>
250 OK
RCPT TO:<someone@example.com>
250 OK
DATA
...
250 Accepted <gmail-message-id>`}
      </CodeBlock>
      <p>
        The <code>250 Accepted</code> line carries Google&rsquo;s own message ID,
        which means the message did not merely reach the relay — it reached
        Gmail and was accepted there. A relay that answered <code>250</code>{" "}
        before talking to Google would be lying to your tool about delivery, so
        the acceptance is deliberately sent last.
      </p>

      <h2 id="troubleshooting">When it will not connect</h2>
      <ul>
        <li>
          <strong>Authentication fails immediately.</strong> The credential is
          wrong or has been rotated. Issue a new one; there is nothing to
          recover.
        </li>
        <li>
          <strong>Authentication works, sending returns 550 5.1.1.</strong> The
          mailbox is not active yet. A mailbox mid-provisioning has a credential
          endpoint but nothing to send through. Check its status.
        </li>
        <li>
          <strong>Everything works, then 452 partway through a campaign.</strong>{" "}
          The daily cap. Spread the volume across more mailboxes rather than
          waiting it out.
        </li>
        <li>
          <strong>Persistent 451s.</strong> Transient by definition, but if they
          persist it is on the Infrabox side rather than yours — a delegation or
          platform problem, not something to fix in your tool.
        </li>
      </ul>
    </GuideShell>
  );
}
