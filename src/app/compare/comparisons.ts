/**
 * The comparison set.
 *
 * ── A deliberate editorial rule ───────────────────────────────────────────
 * Every entry compares Infrabox against an *approach*, never against a named
 * company. That is not squeamishness — it is the only way to write a
 * comparison page we can stand behind. We know what our own product does,
 * because we wrote it. We do not know what any given competitor's product does
 * this week, what their price is after a negotiation, or what their roadmap
 * shipped yesterday, and inventing those details in a table with our logo on
 * top of the winning column would be dishonest whichever way the table fell.
 *
 * So: the "them" column describes a method — the steps involved, the work it
 * asks of you, what it structurally does and does not give you. Every claim in
 * it is either a definitional fact about that method or a description of our
 * own product. Nothing in it is a claim about a third party's software.
 *
 * Each entry also carries a `betterWhen` list, which is the part most
 * comparison pages leave out: the cases where the other approach is genuinely
 * the right call. A comparison with no such list is an advertisement.
 */

import type { CompareRow } from "@/app/_marketing/page-parts";

export type Comparison = {
  slug: string;
  /** The approach, as a noun phrase. Used in the "them" table column. */
  approach: string;
  /** Short label for cards and navigation. */
  cardTitle: string;
  cardBody: string;
  /** <title> and meta description. */
  metaTitle: string;
  metaDescription: string;
  /** The page's h1. */
  headline: string;
  /** One or two paragraphs directly under the h1. */
  summary: string[];
  /** "What this approach actually involves" — the fair description of it. */
  whatItInvolves: string[];
  rows: CompareRow[];
  /** Where the other approach genuinely wins. Not optional. */
  betterWhen: { title: string; body: string }[];
  bottomLine: string;
  faqs: { q: string; a: string }[];
};

export const COMPARISONS: Comparison[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: "doing-it-by-hand",
    approach: "Doing it by hand",
    cardTitle: "Infrabox vs. doing it by hand",
    cardBody:
      "Registrar, Admin Console, DNS records, verification, DKIM, a credential per mailbox. Everything the manual path actually contains, and when it is still the right path.",
    metaTitle: "Infrabox vs. doing it by hand",
    metaDescription:
      "What setting up cold-email domains and Google Workspace mailboxes manually actually involves, step by step — and an honest account of when doing it yourself is still the better call.",
    headline: "Infrabox vs. doing it by hand",
    summary: [
      "The manual path is not mysterious and it is not beyond anyone. You can register a domain, add it to a Google Workspace, publish the records, get the domain verified and turn DKIM on. Thousands of people have.",
      "The question is not whether you can. It is what happens on the ninth domain, at the end of a long week, when one SPF include is wrong and nothing anywhere reports an error.",
    ],
    whatItInvolves: [
      "Register the domain with a registrar, then point its nameservers somewhere you can actually write records — because everything that follows is a DNS record.",
      "Add the domain to a Google Workspace, create the admin account that will own its mailboxes, and get through Google's activation.",
      "Publish MX so the domain can receive, SPF so receivers know which servers may send as it, and DMARC so they know what to do when the first two disagree.",
      "Ask Google to verify you own the domain, then wait — for propagation, for Google's checks, for however long that takes today.",
      "Generate the DKIM key in the Admin Console, publish it to DNS, and remember to come back and switch signing on, which is a separate action people routinely miss.",
      "Get each mailbox to the point where a sending tool can use it — which is where the manual path gets genuinely awkward, because a brand-new Workspace user has to sign in and clear an identity challenge before it can hold a sending credential at all.",
      "Then do the whole thing again for the next domain, identically, from memory.",
    ],
    rows: [
      {
        criterion: "Who publishes MX, SPF and DMARC",
        ours: "Published during provisioning, with the values Google expects, as step four of eight.",
        theirs:
          "You do, in your DNS provider, once per domain, from a support article.",
      },
      {
        criterion: "DKIM",
        ours: "Key generated, published to DNS and signing switched on as step six. If it fails, it is reported rather than hidden.",
        theirs:
          "Generated in the Admin Console per domain, published by hand, and then switched on in a second, separate step that is easy to forget.",
      },
      {
        criterion: "Domain verification with Google",
        ours: "Token published and re-checked automatically, backing off and retrying for hours rather than failing on the first miss.",
        theirs:
          "Attempted manually. If DNS has not propagated yet it fails, and you come back later — if you remember.",
      },
      {
        criterion: "Getting a usable sending credential",
        ours: "Minted and then verified against Gmail before hand-off. No app password, no per-mailbox secret for you to hold.",
        theirs:
          "Requires signing in as each new mailbox and clearing Google's identity challenge before a credential can exist at all.",
      },
      {
        criterion: "Consistency across domains",
        ours: "The same eight steps, in the same order, every time. The ninth domain is done exactly like the first.",
        theirs: "As consistent as the person doing it was that afternoon.",
      },
      {
        criterion: "Visibility while it runs",
        ours: "The dashboard shows which of the eight steps each mailbox is on and which one it is waiting for.",
        theirs:
          "A browser tab, a mental checklist, and a spreadsheet if you are organised.",
      },
      {
        criterion: "Admin Console access",
        ours: "Not yours — the platform holds the admin account so the pipeline can run unattended.",
        theirs: "Entirely yours, with everything that implies in both directions.",
        verdict: "tradeoff",
      },
      {
        criterion: "Cost",
        ours: "A per-mailbox monthly fee on top of the domain.",
        theirs:
          "No platform fee. You pay the registrar and Google, and you pay in hours that never show up on an invoice.",
        verdict: "tradeoff",
      },
    ],
    betterWhen: [
      {
        title: "You need one or two mailboxes, once",
        body: "For a single domain that you will set up and then never think about again, the manual path is fine. An afternoon is an acceptable price for one afternoon of work. It stops being fine when it repeats.",
      },
      {
        title: "You need the Admin Console",
        body: "If you need to hold Workspace admin yourself — for policy, compliance, or because the mailboxes are also real human inboxes with Drive and Calendar attached — do it by hand. The platform holding the admin account is precisely what makes provisioning unattended, and you cannot have both.",
      },
      {
        title: "You already have a working process and someone who runs it",
        body: "If a person on your team already does this well, has automation of their own, and has not been bitten by it, replacing something that works with something new is a cost rather than a saving.",
      },
    ],
    bottomLine:
      "Do it by hand when it is a one-off, or when you need to own the Admin Console. Use a pipeline when the same fiddly, silent-failing sequence has to happen correctly on the tenth domain as reliably as it did on the first.",
    faqs: [
      {
        q: "Can I really not do this myself?",
        a: "Of course you can. Every individual step is documented by Google and none of it requires special access. What is hard is not any one step — it is doing all eight, identically, every time, on a schedule set by DNS propagation rather than by you.",
      },
      {
        q: "What is the one thing people get wrong most often?",
        a: "Two things, and both are silent. SPF gains an extra include or trips the DNS lookup limit, and DKIM gets generated but never switched on. Neither throws an error. Both are only visible later, in the reply rate.",
      },
      {
        q: "Do I lose access to my domains by using Infrabox?",
        a: "The domains are registered in your account. What you do not hold is the Google Workspace admin account for them — that sits with the platform, which is the thing that lets the pipeline run without a human clicking through the Admin Console.",
      },
      {
        q: "Is it faster than doing it manually?",
        a: "Your involvement is far shorter — you choose domains and mailbox counts and then stop. The wall-clock time is not dramatically shorter, because the longest part is Google's domain verification and it waits on DNS propagation whoever kicked it off.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: "smtp-relays",
    approach: "A generic SMTP relay",
    cardTitle: "Infrabox vs. a generic SMTP relay",
    cardBody:
      "Relays move messages. Mailboxes are places mail lives. Why that distinction decides whether replies reach you at all.",
    metaTitle: "Infrabox vs. a generic SMTP relay",
    metaDescription:
      "The structural difference between a transactional SMTP relay and a real Google Workspace mailbox — receiving, replies, reputation and acceptable use — and when a relay is the right tool.",
    headline: "Infrabox vs. a generic SMTP relay",
    summary: [
      "A relay and a mailbox are different categories of thing, and the comparison only makes sense once that is said out loud. A relay is a pipe: you hand it a message and it delivers it. A mailbox is a place: it has an address, it holds mail, and a person can open it.",
      "Cold outreach needs both halves. It needs to send, and it needs the reply — the entire point of the exercise — to land somewhere a human will read it.",
    ],
    whatItInvolves: [
      "You keep your own domain and publish the relay's authentication records on it, so the relay is authorised to send as you.",
      "Your application or sending tool hands messages to the relay over SMTP or an API, and the relay delivers them.",
      "Sending reputation accrues to the domain and to the relay's sending infrastructure, which you share with everyone else using it.",
      "Receiving is a separate problem. A relay delivers outbound mail; where inbound replies go is something you have to arrange yourself, with MX records pointing at an actual mail host.",
      "Acceptable use matters more than it looks. Relays built for transactional mail — receipts, password resets, notifications — have terms written for that use, and cold outreach is a different activity. Read them before pointing a campaign at one.",
    ],
    rows: [
      {
        criterion: "What you end up with",
        ours: "A real Google Workspace mailbox with an address, which sends and receives.",
        theirs:
          "A delivery path. Messages go out as your domain; there is no mailbox behind the address unless you build one.",
      },
      {
        criterion: "Replies",
        ours: "MX is published during provisioning, so the address genuinely receives and replies land in the mailbox.",
        theirs:
          "Handled separately. A relay's job ends when the message is delivered outbound.",
      },
      {
        criterion: "Domain and DNS setup",
        ours: "Domain registered through the platform, DNS connected, MX, SPF, DMARC, verification and DKIM all published as part of the run.",
        theirs:
          "You bring the domain and publish the relay's records on it yourself.",
      },
      {
        criterion: "How your sending tool connects",
        ours: "Ordinary SMTP with STARTTLS and a credential we issue — no Google sign-in, no app password.",
        theirs: "Ordinary SMTP or an API with a credential the relay issues.",
        verdict: "tradeoff",
      },
      {
        criterion: "Per-message economics",
        ours: "Priced per mailbox per month, regardless of how much that mailbox sends within its daily cap.",
        theirs:
          "Usually priced per message or per volume band, which is far cheaper at very high volume.",
        verdict: "tradeoff",
      },
      {
        criterion: "Sending volume ceiling",
        ours: "A per-mailbox daily cap set to mirror what Google allows a Workspace user. Volume comes from more mailboxes.",
        theirs:
          "Built for high throughput from a single sending identity — which is exactly what it is good at.",
        verdict: "tradeoff",
      },
      {
        criterion: "Fit for cold outreach",
        ours: "It is what the product is for.",
        theirs:
          "Depends entirely on the provider's acceptable-use terms, which for transactional services are generally written around a different activity.",
      },
    ],
    betterWhen: [
      {
        title: "You are sending application mail",
        body: "Receipts, password resets, alerts, notifications — mail generated by software, going to people who asked for it, at volumes a mailbox cap would make absurd. That is what a relay is built for and it is very good at it. Do not use mailboxes for that.",
      },
      {
        title: "Volume is the dominant cost",
        body: "At high enough throughput, per-message pricing beats per-mailbox pricing by a wide margin. If you are sending hundreds of thousands of messages from one identity, the arithmetic is not close.",
      },
      {
        title: "Nobody is going to reply",
        body: "If the mail is genuinely one-way and there is no reply path to protect, half of what a mailbox gives you is wasted. Be honest about which kind of mail you are sending.",
      },
    ],
    bottomLine:
      "Use a relay for machine-generated mail at volume. Use mailboxes when a human is meant to reply and that reply has to land somewhere real. They are not competing products so much as answers to different questions.",
    faqs: [
      {
        q: "Doesn't Infrabox use an SMTP relay too?",
        a: "Yes — your sending tool connects to our relay over SMTP, and the relay delivers through Google on the mailbox's behalf. The difference is what sits behind the address: a provisioned Google Workspace mailbox that receives, rather than a delivery path with nothing behind it.",
      },
      {
        q: "Can I point my sequencer at Infrabox the same way?",
        a: "Yes. It is ordinary SMTP with STARTTLS on port 587 and a username and password we issue. Any sequencer that can send over SMTP can send from these mailboxes.",
      },
      {
        q: "Which gets better deliverability?",
        a: "Not a question we are going to answer with a number, because we do not have one that would be honest. What we can say structurally: authentication is table stakes for both, and mail from a domain that can also receive and be replied to behaves differently from mail from an address that goes nowhere.",
      },
      {
        q: "Can I use both?",
        a: "Plenty of teams do, and should. Application mail through a relay, outreach through mailboxes. Keeping them on separate domains keeps their reputations separate too.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: "workspace-direct",
    approach: "Buying Workspace seats directly",
    cardTitle: "Infrabox vs. buying Workspace seats directly",
    cardBody:
      "Same mailboxes underneath, different amount of work on top. What you gain, what you give up, and who should choose which.",
    metaTitle: "Infrabox vs. buying Workspace seats directly",
    metaDescription:
      "Google Workspace bought direct versus mailboxes provisioned through Infrabox: what is identical, what differs, who holds Admin Console access, and when going direct is the right answer.",
    headline: "Infrabox vs. buying Workspace seats directly",
    summary: [
      "This is the fairest comparison on the site, because underneath they are the same thing. Infrabox provisions Google Workspace mailboxes. Buying seats directly gets you Google Workspace mailboxes. The mail is identical because it is the same mail.",
      "What differs is who does the configuration work, who holds the admin account, and how the mailbox reaches your sending tool at the end of it.",
    ],
    whatItInvolves: [
      "You buy seats from Google and hold the Workspace tenancy and its Admin Console yourself.",
      "You bring your own domain, add it to the Workspace, and complete Google's ownership verification.",
      "You publish MX, SPF, DMARC and the DKIM key yourself, and remember to switch DKIM signing on afterwards.",
      "You get the whole Workspace, not just the mailbox — Drive, Calendar, Meet, admin policy, the lot.",
      "And you solve the last-mile problem yourself: getting each new mailbox to a state where an automated sending tool can actually authenticate as it, which for a freshly created user is the genuinely fiddly part.",
    ],
    rows: [
      {
        criterion: "The mailbox itself",
        ours: "A Google Workspace mailbox.",
        theirs: "A Google Workspace mailbox. Identical.",
        verdict: "tradeoff",
      },
      {
        criterion: "Domain registration",
        ours: "Registered through the platform and connected to DNS we manage, which is what makes the records writable automatically.",
        theirs: "Yours, at whichever registrar you like, configured by you.",
        verdict: "tradeoff",
      },
      {
        criterion: "DNS records and verification",
        ours: "Published and confirmed as part of provisioning, on every domain, the same way.",
        theirs: "Your job, once per domain, from Google's documentation.",
      },
      {
        criterion: "DKIM",
        ours: "Generated, published and switched on automatically as one of the eight steps.",
        theirs:
          "Available in the Admin Console, and dependent on you remembering the second step after generating the key.",
      },
      {
        criterion: "Sending credential for automation",
        ours: "Minted and verified against Gmail before hand-off; your tool connects over plain SMTP.",
        theirs:
          "The hard part. A brand-new user must sign in and clear an identity challenge before it can hold one.",
      },
      {
        criterion: "Admin Console access",
        ours: "Held by the platform, which is the precondition for the pipeline running unattended.",
        theirs: "Yours, completely.",
        verdict: "tradeoff",
      },
      {
        criterion: "The rest of Workspace",
        ours: "Not the product. These mailboxes exist to send and receive campaign mail.",
        theirs: "Drive, Calendar, Meet, org policy — the whole suite.",
        verdict: "tradeoff",
      },
      {
        criterion: "Setting up the tenth domain",
        ours: "The same eight steps, unattended, with a progress view.",
        theirs: "The same manual sequence you did nine times already.",
      },
      {
        criterion: "Cost",
        ours: "A per-mailbox monthly fee plus the domain, both published on our pricing page.",
        theirs:
          "Google's seat price, which is Google's to quote and not ours to print on a page comparing ourselves to them.",
        verdict: "tradeoff",
      },
    ],
    betterWhen: [
      {
        title: "The mailboxes are for people, not campaigns",
        body: "If these are real employee accounts that need Drive, Calendar, shared documents and org policy, buy Workspace directly. Provisioning mailboxes for outreach is a narrower job and it is the only job we are doing.",
      },
      {
        title: "You must hold admin yourself",
        body: "Compliance requirements, data policies, security review, or simply a preference for holding your own keys. All legitimate, and all incompatible with a platform-held admin account. Go direct.",
      },
      {
        title: "Your estate is small and static",
        body: "One domain, a handful of mailboxes, set up once and left alone. Automation earns its keep through repetition, and if there is no repetition there is nothing to earn.",
      },
    ],
    bottomLine:
      "Same mailboxes, different division of labour. Buy direct if you need the Admin Console or the rest of the suite. Come to us if what you actually want is a lot of correctly configured sending domains without spending your week in DNS panels.",
    faqs: [
      {
        q: "Are these real Google Workspace mailboxes?",
        a: "Yes. Your domain is attached to a Google Workspace and real Workspace users are created on it. There is nothing simulated in the middle.",
      },
      {
        q: "Why can't I have the Admin Console?",
        a: "Because the pipeline holds that admin account in order to run the remaining steps without a human. It is a genuine trade-off rather than a policy we are pleased about, and if Admin Console access is a requirement for you, buying direct is the honest recommendation.",
      },
      {
        q: "Can I bring a domain I already own?",
        a: "Talk to us about the specific domain rather than reading a yes or a no off a comparison page. The automation depends on DNS records being writable by the platform, so what matters is where the domain's nameservers point.",
      },
      {
        q: "Do I get Drive and Calendar?",
        a: "Not as part of what we sell. These mailboxes are provisioned to send and receive campaign mail; if you need the rest of the suite, that is a reason to buy Workspace directly.",
      },
    ],
  },
];

export function getComparison(slug: string) {
  return COMPARISONS.find((c) => c.slug === slug);
}
