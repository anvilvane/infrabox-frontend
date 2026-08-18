import type { Metadata } from "next";
import Link from "next/link";

import { Callout, CodeBlock } from "@/components/content";
import { getGuide } from "@/content/guides";
import { GuideShell } from "../guide-chrome";

const guide = getGuide("app-passwords");

const TOC = [
  { id: "the-chain", label: "The chain, link by link" },
  { id: "the-near-miss", label: "The control that looks like the answer" },
  { id: "what-it-forces", label: "What this forces" },
  { id: "the-way-out", label: "The way out is architectural" },
];

export const metadata: Metadata = {
  title: guide.shortTitle,
  description: guide.description,
};

export default function AppPasswordsGuide() {
  return (
    <GuideShell slug={guide.slug} toc={TOC}>
      <p>
        Almost every cold-email tool asks for an SMTP username and password. For
        a Google Workspace mailbox, the password it wants is an{" "}
        <strong>app password</strong> — a sixteen-character string Google issues
        so that a program can authenticate without going through an interactive
        login. If you are provisioning mailboxes one at a time by hand, you
        generate one, paste it in, and never think about it again.
      </p>
      <p>
        If you are provisioning them by the hundred, you eventually try to
        automate that generation, and you discover it is not slow or fiddly. It
        is impossible. This is the chain, in the order you hit it.
      </p>

      <h2 id="the-chain">The chain, link by link</h2>
      <p>
        Generating an app password requires being signed in as the mailbox user
        and visiting the account security page. So the automation needs to: sign
        in as the user, enable 2-step verification, then generate the password.
        Three steps. Each one has a wall behind it.
      </p>

      <h3>Link 1: app passwords require 2-step verification</h3>
      <p>
        Google does not offer app passwords on an account without 2SV enabled.
        The option is not hidden or hard to find — it does not exist on the page
        until 2SV is on. So the first link demands the second.
      </p>

      <h3>Link 2: only the user can enable 2-step verification</h3>
      <p>
        This is where an administrator would expect to be able to help, and
        cannot. A Workspace super-admin can <em>enforce</em> 2SV as a policy, but
        cannot <em>enable</em> it on a specific account. The Admin Console says so
        on the card itself:
      </p>
      <CodeBlock label="Google Workspace Admin Console">
        {`Only the user can turn on 2-step verification`}
      </CodeBlock>
      <p>
        Enabling 2SV means choosing and registering a second factor, and Google
        treats that as an act only the account holder can perform. Which means the
        automation has to sign in as the user. Which brings us to the wall.
      </p>

      <h3>Link 3: a brand-new user cannot sign in from automation</h3>
      <p>
        A freshly created Workspace user has a password that the provisioning
        system set, so signing in ought to be mechanical. It is not. Google
        accepts the password and then serves an identity-assurance challenge:
      </p>
      <CodeBlock label="What a first automated sign-in actually gets">
        {`url:      accounts.google.com/v3/signin/challenge/iap
heading:  "Verify it's you"
inputs:   ["tel[phoneNumber]"]
body:     "Enter a phone number to get a text message with a verification code."`}
      </CodeBlock>
      <p>
        The account has never signed in before, has no recovery phone set, and is
        being accessed from an unfamiliar context. Google will not hand out a
        session until it can deliver an SMS to a real handset.
      </p>

      <h2 id="the-near-miss">The administrative control that looks like the answer</h2>
      <p>
        There is a per-user setting in the Admin Console called the{" "}
        <strong>login challenge</strong>, and it can be turned off for ten
        minutes. It is exactly the shape of thing you would expect to solve this,
        and it is automatable — the control is there, it responds, the console
        even warns you that <em>&ldquo;disabling login challenge will make the
        account less secure&rdquo;</em>, which reads like a system that expects
        you to be about to do something it will then permit.
      </p>
      <p>
        It does not solve it. That control covers knowledge-based identity
        questions — the &ldquo;confirm the recovery email on this account&rdquo;
        class of prompt. It does not cover the phone challenge above. We
        reproduced the same <code>challenge/iap</code> page twice: once before
        clearing the login challenge and once immediately after. Same wall.
      </p>
      <Callout title="Why this distinction matters">
        <p>
          It is the difference between a problem that is one selector away from
          working and a problem that has no solution in this direction at all. A
          lot of engineering time gets spent on the first interpretation. The
          honest read is the second: this is not a session problem and not a
          selector problem. It is Google policy, and Google is not going to change
          it for a bulk mailbox provisioner.
        </p>
      </Callout>

      <h2 id="what-it-forces">What this forces</h2>
      <p>Follow the chain to its end and the consequences are unambiguous:</p>
      <ul>
        <li>
          <strong>No app password can be generated by automation.</strong> Not
          slowly, not with better selectors, not with a smarter browser profile.
        </li>
        <li>
          <strong>A human signing in once per mailbox would work.</strong> And
          that is precisely the thing that does not scale. Any system built to
          stand up hundreds of mailboxes exists to keep humans out of the
          per-mailbox path; putting one back in at the last step defeats the
          entire design.
        </li>
        <li>
          <strong>So the mailbox gets stuck one step from usable.</strong> Domain
          registered, DNS published, verification passed, DKIM signing — and then
          no credential to hand you.
        </li>
      </ul>

      <h2 id="the-way-out">The way out is architectural, not technical</h2>
      <p>
        The answer is to stop needing an app password at all. A service account
        with <strong>domain-wide delegation</strong> can be authorised to
        impersonate users in a Workspace, and mint an access token for any mailbox
        on demand. No browser, no sign-in, no 2SV, no per-mailbox secret — nothing
        in the path for Google to challenge, because nothing in the path is
        pretending to be an interactive human.
      </p>
      <p>
        That is what Infrabox does, and it is why the{" "}
        <Link href="/how-it-works">provisioning pipeline</Link>&rsquo;s sending-
        credential step mints and verifies a credential rather than generating and
        storing one. The mechanics are in{" "}
        <Link href="/guides/domain-wide-delegation">
          the domain-wide delegation guide
        </Link>
        .
      </p>
      <p>
        The thing your sending tool connects to is then not Gmail&rsquo;s SMTP
        server with an app password, but the{" "}
        <Link href="/guides/smtp-relay">Infrabox relay</Link> with a credential
        Infrabox issued. From the tool&rsquo;s point of view it is still a host, a
        port and a password. Underneath, the impossible link in the chain has been
        removed rather than worked around.
      </p>

      <Callout title="If a vendor tells you they automate app passwords">
        <p>
          Ask which of the three links they broke. The plausible answers are that
          a person signs in per mailbox somewhere in their process, or that the
          mailboxes come from accounts that were created and signed into long
          before you bought them. Both are real approaches with real trade-offs.
          Neither is automation.
        </p>
      </Callout>
    </GuideShell>
  );
}
