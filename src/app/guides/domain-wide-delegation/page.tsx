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
import { GuideShell } from "../guide-chrome";

const guide = getGuide("domain-wide-delegation");

const TOC = [
  { id: "what-it-is", label: "What it is" },
  { id: "the-objection", label: "The objection that matters" },
  { id: "the-authorisation", label: "Authorising a Workspace" },
  { id: "scopes", label: "Scopes are the blast radius" },
  { id: "minting", label: "Minting a credential" },
  { id: "verification", label: "The step verifies, it does not assume" },
  { id: "failures", label: "Failures are classified" },
  { id: "honest", label: "What is still awkward" },
];

export const metadata: Metadata = {
  title: guide.shortTitle,
  description: guide.description,
};

export default function DomainWideDelegationGuide() {
  return (
    <GuideShell slug={guide.slug} toc={TOC}>
      <p>
        If <Link href="/guides/app-passwords">app passwords are unreachable</Link>{" "}
        by automation, something else has to produce a working sending
        credential. Domain-wide delegation is that something. It is a Google
        Workspace mechanism that lets a single service account act as any user in
        a Workspace, without that user ever signing in, consenting, or existing as
        anything other than a row in the directory.
      </p>
      <p>
        It is also a genuinely large amount of trust to hand to one key, and this
        guide says so where it matters.
      </p>

      <h2 id="what-it-is">What it is</h2>
      <p>
        A service account is a non-human identity with its own key pair.
        Ordinarily it can only touch resources it has been granted directly.
        Domain-wide delegation changes that: a Workspace administrator authorises
        the service account&rsquo;s client ID for a specific list of OAuth scopes,
        and from then on the service account can assert{" "}
        <em>&ldquo;I am this user&rdquo;</em> for any user in that Workspace,
        within those scopes.
      </p>
      <p>
        The assertion is signed with the service account&rsquo;s private key and
        exchanged at Google&rsquo;s token endpoint for a short-lived access token
        scoped to that user. There is no consent screen, because the consent
        already happened once, at the Workspace level, when the administrator
        authorised the client ID.
      </p>

      <h2 id="the-objection">The objection that matters</h2>
      <p>
        The first reasonable reaction to &ldquo;a Google Cloud service
        account&rdquo; is: <em>if every new Workspace needs a manual Google Cloud
        change, this does not scale, and you have just moved the bottleneck.</em>
      </p>
      <p>
        That objection is correct in general. It does not apply here, and the
        reason is worth being precise about:{" "}
        <strong>there is one service account, not one per Workspace.</strong> It
        lives in Infrabox&rsquo;s own Cloud project. Each Workspace merely
        authorises that same client ID. Nothing is created per Workspace, and
        nothing is created per customer.
      </p>

      <TableScroll>
        <thead>
          <tr>
            <Th>Task</Th>
            <Th>How often</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Lift the org policy blocking service-account key creation</Td>
            <Td>Once, on the Infrabox Cloud project</Td>
          </tr>
          <tr>
            <Td>Create the service-account key</Td>
            <Td>Once</Td>
          </tr>
          <tr>
            <Td>Authorise the client ID inside a Workspace account</Td>
            <Td>Once per Workspace account — automated</Td>
          </tr>
          <tr>
            <Td>Mint a credential for a specific mailbox</Td>
            <Td>On demand, pure API call, no limit</Td>
          </tr>
        </tbody>
      </TableScroll>

      <p>
        The only recurring step is the third, and it is automated by driving the
        Admin Console — Security, API Controls, Domain-wide Delegation — because
        Google exposes no API for that surface. Everything below it is a plain
        HTTPS call.
      </p>

      <h2 id="the-authorisation">Authorising a Workspace, carefully</h2>
      <p>
        Two details in that automation are easy to get wrong and unpleasant to
        debug.
      </p>

      <h3>It has to be idempotent, in the right direction</h3>
      <p>
        Re-submitting a client ID that is already authorised does not add to the
        grant — it <strong>replaces</strong> it. Submit a shorter scope list on a
        Workspace that was already working and you have silently narrowed its
        permissions, and nothing will fail until the next mailbox tries to send.
        So an already-authorised client ID is left untouched rather than
        refreshed, and success is confirmed by re-reading the authorisation table,
        never by trusting that the click landed.
      </p>

      <h3>The console is localised, and the button is not spelled one way</h3>
      <p>
        The confirm button in the delegation dialog reads{" "}
        <strong>AUTHORISE</strong> on a console running <code>en-GB</code> and{" "}
        <strong>AUTHORIZE</strong> on <code>en-US</code>. A selector matching only
        the US spelling works on some Workspace accounts and not others, which is
        the worst kind of failure: intermittent, environment-dependent, and
        invisible until you have a fleet.
      </p>

      <h2 id="scopes">Scopes are the blast radius</h2>
      <p>
        Delegation is unrestricted impersonation <em>within whatever is
        granted</em>. There is no per-user restriction, no approval step, no
        audit prompt. The service account can become any user in the Workspace for
        any scope on the list. That means the scope list is not a configuration
        detail — it is the security boundary, and every extra entry widens what a
        leaked key could do.
      </p>
      <p>
        Infrabox authorises four, deliberately: sending and reading Gmail for the
        mailbox, and the directory access needed to create users and attach
        domains. Nothing about calendars, nothing about Drive, nothing about the
        wider Workspace.
      </p>
      <Callout title="What this means for you as a customer">
        <p>
          Infrabox can, technically, read the mailboxes it provisions for you.
          That is not a policy statement dressed as a limitation; it is a
          structural fact of how any provider that provisions Google mailboxes on
          your behalf has to work, and a provider that tells you otherwise is
          either using a different architecture or not being straight with you.
          What varies between providers is which scopes they took and what their
          contract says about using them.
        </p>
      </Callout>

      <h2 id="minting">Minting a credential, and why nothing is stored</h2>
      <p>
        When a mailbox needs to send, the service account asserts the mailbox
        user&rsquo;s identity and receives a short-lived access token. That token
        is used and discarded.
      </p>
      <p>
        There is deliberately <strong>no refresh token and no stored per-mailbox
        secret</strong>. With delegation there is nothing to refresh — a new
        token can always be minted from the service-account key — so persisting a
        long-lived per-mailbox credential would be pure liability with no
        corresponding benefit. One key exists, it is encrypted at rest, and it is
        the only thing that has to be protected.
      </p>
      <p>
        This is a real difference from the app-password model, where every mailbox
        produces its own long-lived secret that has to be stored somewhere, shown
        to someone, and revoked individually if it leaks.
      </p>

      <h2 id="verification">The step verifies, it does not assume</h2>
      <p>
        A token that mints successfully can still be useless, and this is not
        hypothetical. During the work that built this, the first live run produced
        a perfectly valid access token, and Gmail answered <code>403</code> —
        because the Gmail API had never been enabled on the Cloud project. The
        credential was real. It just could not do anything.
      </p>
      <p>
        So the sending-credential step in the{" "}
        <Link href="/how-it-works">provisioning pipeline</Link> does not stop at
        minting. It calls Gmail with the token and checks that the profile that
        comes back belongs to the mailbox it asked for — a mismatch would mean
        holding a working credential for the wrong user, which is worse than
        holding none.
      </p>

      <h2 id="failures">Failures are classified, because they need different people</h2>
      <CodeBlock label="What each class means and who fixes it">
        {`unauthorized_client   permanent — this Workspace has not authorised the
                      client ID. Fix: run the delegation authoriser on it.
invalid_grant         permanent — the user may not exist, or the key may
                      have been revoked.
429 / 5xx / network   transient — retry.`}
      </CodeBlock>
      <p>
        The distinction is operational, not cosmetic. A permanent error means
        something is misconfigured and retrying forever will never help; a
        transient one means the opposite. Collapsing the two into a generic
        &ldquo;auth failed&rdquo; is how a one-line fix turns into a day of
        looking at the wrong thing.
      </p>

      <h2 id="honest">What is still awkward about this</h2>
      <ul>
        <li>
          <strong>Each new Workspace account has to be authorised.</strong> It is
          automated, but it is a step, and forgetting it produces{" "}
          <code>unauthorized_client</code> on every mailbox in that account at
          once.
        </li>
        <li>
          <strong>One key protects everything.</strong> The concentration that
          makes this scale is the same concentration that makes the key
          catastrophic to lose. It is encrypted at rest and stored outside the
          deployment, so it can be rotated without shipping a release — but the
          exposure is real and worth naming.
        </li>
        <li>
          <strong>Enabling it required lifting an org policy</strong> that Google
          sets by default specifically to stop service-account keys existing.
          That default is good advice for most projects. Choosing to override it
          is a deliberate trade, not an oversight.
        </li>
      </ul>
    </GuideShell>
  );
}
