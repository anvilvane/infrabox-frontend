# marketing-site — SPEC.md

> **Status:** partially built. This file documents **what exists in this folder today** first, and what remains design-only second.
> **Runtime (as built):** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4
> **Dev port:** **3003** (3000/3001/3002/3005 are taken by other services in this monorepo)
> **Last revision:** 2026-08-18 — rewritten from an aspirational design spec into a description of real code.

---

## 0. Read this first — spec vs reality

The previous version of this file described an ~80-page marketing site with 21 free
deliverability tools, 200+ programmatic SEO pages, an MDX blog with its own admin CMS, a
live placement-transparency page and a `.seo/` content engine. **None of that was ever
built.** It was a design document written before any code existed.

What now exists is a small, real, four-route marketing site. Anything the old spec
described that is not listed in [§2](#2-what-is-actually-built) is roadmap, not current
state.

Where the old spec and reality disagreed, reality won. The specific reversals:

| Old spec said | Built as | Why |
|---|---|---|
| Next.js 14 | **Next.js 15** | The brief is that this site and `customer-dashboard/infrabox-dashboard` should read as one product. The dashboard is Next 15 / React 19; splitting versions would fork the conventions for no benefit. |
| React 18 | **React 19** | Same reason. |
| JavaScript, no TypeScript | **TypeScript** | The dashboard is TypeScript. Prices and pipeline definitions are typed, so a bad edit fails the build rather than the page. |
| Tailwind 3 + daisyUI 4 | **Tailwind v4, no daisyUI** | The dashboard is Tailwind v4 with a CSS-variable token system. daisyUI would add a second, conflicting theming mechanism and a second visual language. |
| `pnpm` | **npm** (`package-lock.json`) | npm is what is installed and working here. The old spec's "exactly one lockfile" rule is respected. |
| MDX, `next-sitemap`, `framer-motion`, `react-hook-form`, `iron-session`, `ioredis`, `dns2` | **not installed** | Nothing in the four built routes needs any of them. |
| Live pricing from `GET /v1/public/pricing` | **Prices transcribed from source, with citations** | That endpoint was not verified to exist. Prices come from the api-server's own config files, each cited next to the number — see [§4](#4-where-the-numbers-come-from). |
| "money-back deliverability SLA", placement transparency, warmup, Microsoft/Azure/SMTP mailboxes | **absent from the site** | Per the root `CLAUDE.md`, MVP scope is Google Workspace only, and there is no SLA product. |

### The "90 seconds" claim — deliberately not used

The build brief for this site described a mailbox going "from purchase to usable in about
90 seconds". **That number is not supported anywhere in this repo and does not appear on
the site.** The real figures:

- There is no 90-second constant in the api-server or the dashboard.
- The dashboard's own progress model
  (`customer-dashboard/infrabox-dashboard/src/lib/mailbox-provisioning.ts`,
  `PROVISIONING_STEPS[].typicalMinutes`) sums to **~435 minutes (~7¼ hours)** typical, of
  which **300 minutes is the `site_verification` step alone**.
- `site_verification` in `api-server/.../provisioning/google/step-sequence.js` carries a
  bespoke retry policy (40 attempts, 60s doubling to a 15-minute ceiling) precisely
  because, in the code comment's own words, "NS delegation routinely takes hours".

So the site says the pipeline is **unattended**, and is explicit that domain verification
is the long pole and that Google controls its timing. It quotes the same per-step typical
durations the dashboard shows, labelled as estimates. It never quotes a single headline
setup time.

---

## 1. Purpose

The public face of Infrabox: what the product is, how the provisioning pipeline works,
what it costs, and a way to make contact. That is the whole remit today.

It owns no business logic and holds no credentials. It does not talk to the api-server or
to MongoDB at all — see [§5](#5-what-this-site-does-not-talk-to).

---

## 2. What is actually built

```
marketing-site/
├── SPEC.md                       ← this file
├── package.json                  ← npm; dev/build/start scripts pinned to port 3003
├── package-lock.json             ← the single lockfile
├── tsconfig.json                 ← mirrors the dashboard's; "@/*" -> "./src/*"
├── next.config.ts                ← security headers only
├── postcss.config.mjs            ← @tailwindcss/postcss
├── .gitignore                    ← see §6 — deliberately NOT a copy of the dashboard's
├── .nvmrc                        ← 20
├── .env.example                  ← committed; all keys, empty values
│
├── public/
│   ├── favicon.svg               ← copied from the dashboard
│   └── logo-icon.svg             ← the brand mark, copied from the dashboard
│
└── src/
    ├── app/
    │   ├── layout.tsx            ← root layout: Inter via next/font, header, footer, skip link, metadata
    │   ├── globals.css           ← design tokens (§3) plus a few utilities
    │   ├── page.tsx              ← "/"             landing page
    │   ├── how-it-works/page.tsx ← "/how-it-works" the eight steps, in detail
    │   ├── pricing/page.tsx      ← "/pricing"      mailbox price + domain TLD table
    │   ├── get-started/
    │   │   ├── page.tsx          ← "/get-started"  contact page
    │   │   └── contact-form.tsx  ← the only client component on the site
    │   ├── not-found.tsx         ← 404
    │   └── api/contact/route.ts  ← POST /api/contact — A STUB, see §7
    │
    ├── components/
    │   ├── site-chrome.tsx       ← SiteHeader, SiteFooter, Wordmark
    │   └── ui.tsx                ← Button, ButtonLink, Card, Container, Eyebrow
    │
    └── lib/
        ├── product.ts            ← ALL prices and pipeline copy, each citing its source file
        └── utils.ts              ← cn() — the same clsx + tailwind-merge helper as the dashboard
```

### Routes

| Route | Render mode | Notes |
|---|---|---|
| `/` | Static | Hero, why-it-exists strip, "what you get" spec list, 8-step preview, price line, CTA |
| `/how-it-works` | Static | All eight steps with the long explanation and the dashboard's `typicalMinutes` |
| `/pricing` | Static | $3.99/mailbox/month, domain TLD table, what is *not* included, FAQ, Product/FAQ JSON-LD |
| `/pricing/calculator` | Static shell + client widget | Domains x mailboxes x TLD x age -> first-month and first-year totals. Arithmetic only, no new constants; HowTo/FAQ JSON-LD |
| `/deliverability` | Static | MX/SPF/DKIM/DMARC/verification, the SMTP relay hand-off, and an explicit "what this page does not claim" band |
| `/for-agencies` | Static | Many-client estates: workspaces, member roles, batch domain connection, flat per-mailbox price |
| `/compare` | Static | Hub for the three comparisons, plus the editorial note on why no competitor is named |
| `/compare/[slug]` | SSG (3 params) | `doing-it-by-hand`, `smtp-relays`, `workspace-direct`. Data in `compare/comparisons.ts` |
| `/get-started` | Static shell + client form | Posts JSON to `/api/contact` |
| `/api/contact` | Dynamic (Node runtime) | Validates and returns 200. **Delivers nothing.** See §7 |
| `/resources` | Static | Hub: the FAQ, the four guides, and the legal documents with their status badges |
| `/resources/faq` | Static | 14 buyer questions across 5 sections, built on `Disclosure`; FAQPage JSON-LD |
| `/guides` | Static | Index of the four guides, read from `content/guides.ts` |
| `/guides/spf-dkim-dmarc` | Static | What each authentication record proves, and what DMARC alignment adds |
| `/guides/app-passwords` | Static | Why Google app passwords cannot be automated (the 2SV -> sign-in -> phone-challenge chain) |
| `/guides/domain-wide-delegation` | Static | One service account, per-Workspace authorisation, impersonation, scopes as blast radius |
| `/guides/smtp-relay` | Static | Relay settings, byte-for-byte forwarding, limits, and the SMTP code mapping |
| `/legal` | Static | Index of the five documents, each labelled Draft or Not written |
| `/legal/acceptable-use-policy` | Static | **Draft.** Real drafted text; every bracketed threshold rendered as a `Pending` gap |
| `/legal/service-level-agreement` | Static | **Draft.** Real drafted text; no placement percentage is printed anywhere |
| `/legal/terms-of-service` | Static | **Not written.** States the gap and lists what it must cover |
| `/legal/privacy-policy` | Static | **Not written.** Same, plus the one settled point (controller/processor) |
| `/legal/refund-policy` | Static | **Not written.** Same, plus what is already true in the product |
| `/sitemap.xml` | Static | Every route above, generated from the guide, comparison and legal registries |
| `/robots.txt` | Static | Per-agent groups; AI crawlers allowed, aggressive SEO crawlers blocked |
| `/opengraph-image` | Static (build-time) | 1200x630, rendered by `next/og` from `public/logo.png`. No external service |

There is exactly **one client component** (`contact-form.tsx`). Everything else is a
server component; the site ships ~103 kB of shared JS and does no client-side data
fetching. The FAQ and the guides' contents rails are `<details>`-based, so they work
with JavaScript disabled.

### Long-form layer

Guides, the FAQ and the legal documents share `src/components/content.tsx` —
`ArticleHeader`, `Article` (reading measure + sticky contents rail), `Prose`,
`Callout`, `CodeBlock`, `TableScroll`, `LinkCard`, `LinkRow` and `Pending`. It is a
layer *on top of* `@/components/ui`, not a second design system: it introduces no
colour, radius or font that is not already a token.

`Pending` is the one component with a policy attached. It renders a visible gap
wherever the source legal draft left a bracketed decision. **Never replace a
`Pending` with the draft's suggested number** — publishing an uncalibrated
threshold as if it were policy is exactly the failure mode the component exists to
prevent.

### Content registries

| File | Holds |
|---|---|
| `src/content/guides.ts` | One entry per guide: slug, titles, description, topic, reading time. The guides index, each guide's `metadata` and the sitemap all read from it. |
| `src/content/relay.ts` | SMTP relay facts (host, port, size cap, daily limit, SMTP code mapping), each citing the api-server file it was read out of — the same discipline as `src/lib/product.ts`. |
| `src/app/legal/legal-chrome.tsx` | `LEGAL_DOCS`: the five documents and their drafted / not-drafted status. |

### Not a route group

The old spec's `(marketing)` / `(tools)` / `(seo)` / `(admin)` route groups do not exist.
With four routes and one shared chrome, a group would be ceremony. Add one when a section
genuinely needs a different layout.

---

## 3. Design system

The palette, radii, border and shadow conventions are lifted verbatim from
`customer-dashboard/infrabox-dashboard/src/app/globals.css` so the site and the product
read as one company:

- `--brand: #103937` (deep spruce), `--brand-foreground: #ffffff`
- a neutral zinc scale for `--muted` / `--border` / `--foreground`
- `--radius: 0.625rem`, 1px borders, and **no shadows** — the dashboard sets
  `--card-shadow: none`, and this site follows
- Inter, loaded through `next/font/google`, which **self-hosts the font files at build
  time**. The served HTML makes no request to a font CDN — verified: the only external URL
  in the rendered homepage is the dashboard sign-in link.

Marketing-only additions, grouped and labelled at the bottom of `:root`:

- `--ink: #0b2523` — a darker derivative of the brand, used as the ground for the hero,
  the closing CTA band and the footer. Not a new hue.
- `--ink-foreground`, `--ink-muted`, `--ink-border` — the text and border scale on that ground.
- `.grid-field` — the hairline grid behind the hero. Two 1px repeating gradients under a
  radial mask. No image asset, no network request.

Accessibility decisions that are load-bearing rather than decorative:

- A skip link to `#main`, visible on focus.
- `:focus-visible` draws a 2px brand outline globally; inside `.on-ink` sections the
  outline flips to the light foreground so it stays visible on the dark ground.
- One `<h1>` per page, `<h2>` per section (each section is `aria-labelledby` its own
  heading, including the visually-hidden ones), `<h3>` for items within.
- The pricing TLD table uses `<caption>`, `<th scope="col">` and `<th scope="row">`.
- The contact form: every input has a real `<label>`; hints and errors are wired through
  `aria-describedby`; invalid fields get `aria-invalid`; the form-level error is
  `role="alert"`; the success state is `role="status"` and receives focus.
- `prefers-reduced-motion` disables smooth scrolling and animation.
- No information is carried by colour alone.

---

## 4. Where the numbers come from

Every figure on the site lives in `src/lib/product.ts` with the file it was read from
cited beside it. Nothing is invented, and the site quotes no metric, customer count,
testimonial or logo.

| Figure | Value | Source |
|---|---|---|
| Mailbox price | **$3.99 / mailbox / month** | `api-server/.../models/team.model.js` -> `credits_per_google_mailbox` default. Corroborated by `customer-dashboard/.../contexts/launchpad-context.tsx` (`MAILBOX_PRICES.GOOGLE`) and the buy-mailbox page copy. |
| Domain markup, new | **$6** | `api-server/.../config/pricing.config.js` -> `STANDARD_MARKUP` |
| Domain markup, aged 12mo+ | **$10** | same file -> `PREMIUM_AGE_MARKUP`, `PREMIUM_AGE_THRESHOLD_YEARS = 1` |
| TLD base prices | .com 12.50 · .net 15 · .org 9 · .co 14.99 · .shop 2 | `api-server/.../services/domain-pricing.service.js` -> `BASE_TLD_PRICES` |
| TLD pre-warmed prices | .com 15 · .net 17.50 · .org 11.50 · .co 12.50 · .shop 4.50 | same file -> `PREWARM_TLD_PRICES` |
| The eight step names and `typicalMinutes` | order 15 · admin_setup 15 · email_verification 30 · workspace_dns 20 · site_verification 300 · dkim 30 · auth_oauth 20 · renewal 5 | `customer-dashboard/.../lib/mailbox-provisioning.ts` -> `PROVISIONING_STEPS`, which mirrors `api-server/.../provisioning/google/step-sequence.js` -> `STEP_SEQUENCE` |

**Known inconsistency, surfaced honestly:** the domain-pricing service's own comments flag
that `.co` disagrees between its two tables (a 14.99 base, but a prewarm entry implying a
10 base). The site prints both values as written and states plainly that the exact total
for a specific domain is quoted at checkout.

Prices that exist in the api-server but are **deliberately not on the site**, being outside
current MVP scope: Microsoft/Outlook mailboxes ($3.99), Azure domains ($30), in-house SMTP
mailboxes ($3), the warmup add-on ($3.00), and every partner/whitelabel wholesale rate.

---

## 5. What this site does NOT talk to

No api-server client, no `INFRABOX_INTERNAL_KEY`, no MongoDB, no Redis, no analytics
scripts, no external CDN of any kind. The old spec's `lib/infrabox-api.js`,
`lib/rate-limit.js` and `lib/dns-lookup.js` do not exist, because nothing here needs them
yet. If a future route does need api-server data, add one server-side client module then —
and keep the key server-side, which the old spec was right about.

`NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` are the only environment variables read.
Both are public by construction (a dashboard URL and the site's own origin) and both have
safe defaults, so the site builds and boots with no `.env` file at all.

---

## 6. `.gitignore` — read before editing

This folder's `.gitignore` is **not** a copy of `customer-dashboard/infrabox-dashboard/.gitignore`.
That file ends with blanket `*.md`, `*.json`, `*.csv`, `*.sh` rules which silently exclude
its own `package.json` and `tsconfig.json` — a bug that has already cost this project real
time. Do not port those lines here.

Ignored here: `node_modules`, `.next`, `.env` and `.env.*` (with `!.env.example`), `*.pem`,
`*.key`, `*service-account*.json`, `cookies.txt`, `*.tsbuildinfo`, `next-env.d.ts`,
`.vercel`, debug logs. Verified with `git add --dry-run marketing-site/`: `package.json`,
`package-lock.json`, `tsconfig.json`, `next.config.ts` and every `src/` file are trackable,
and `.env.local` is correctly ignored.

---

## 7. `POST /api/contact` — this is a stub

`src/app/api/contact/route.ts` **does not deliver the enquiry anywhere.** It:

1. parses the JSON body (400 on malformed input),
2. trims and length-caps all five fields,
3. validates — `name` required, `email` required and shaped like an address, `mailboxes`
   required — returning `400 { ok:false, errors:{ field: message } }` otherwise,
4. logs one line to the server console with the email address **redacted** to `n***@domain`,
5. returns `200 { ok:true, stub:true }`.

The `stub: true` flag in the response is there so nobody mistakes it for a working
pipeline. To make it real, forward the payload from this handler to the api-server or an
email/CRM provider — the handler is server-only precisely so a provider credential never
reaches the browser. `CONTACT_FORWARD_EMAIL` is reserved in `.env.example` for that and is
currently unread.

---

## 8. Local dev

```bash
cd marketing-site
npm install
npm run dev      # http://localhost:3003
npm run build    # production build
npm start        # serves the build on 3003
```

Node 20+ (`.nvmrc`, `engines`). Port 3003 is fixed in the `dev` and `start` scripts because
3000/3001/3002/3005 are taken by other services in this monorepo.

**Verified on 2026-08-18:** `npm run build` compiles clean — no type errors, no lint
errors; 6 routes, ~103 kB shared JS, 5 of 6 prerendered as static. `npm start` boots in
about a second; `/`, `/how-it-works`, `/pricing` and `/get-started` return 200, an unknown
path returns 404, all four security headers are present, and `/api/contact` returns
200 / 400 / 400 for valid, invalid and malformed payloads respectively.

Unlike the dashboard, `next.config.ts` here does **not** set
`typescript.ignoreBuildErrors` or `eslint.ignoreDuringBuilds`. Type and lint errors fail
the build, and should stay that way.

---

## 9. Not built — roadmap, in rough priority order

Everything below was in the previous spec and remains unimplemented. Listed so the gap is
explicit rather than implied.

1. **Real contact delivery** — the single most valuable next change (§7).
2. **Legal pages — counsel review.** The AUP and the deliverability SLA now exist as
   *drafts* with every open threshold rendered as a visible `Pending` gap, and the Terms,
   Privacy Policy and Refund Policy exist as pages that state they are unwritten. Getting
   these reviewed, filling the gaps and removing the draft banners is the remaining work.
   The Article 28 DPA is not drafted at all.
3. **Per-route OG images.** The site-wide `opengraph-image.tsx` ships; individual guides
   and legal pages still fall back to it. `sitemap.ts`, `robots.ts` and FAQPage JSON-LD
   are done.
4. **Header navigation for `/resources`.** The footer links the legal documents and the
   hub pages exist, but the header nav is still only How it works / Pricing. Resources or
   Guides belongs in it.
5. **Analytics** — the dashboard runs PostHog, GA4, DataFast and Partnero. None here. If
   added, gate on consent and ship a cookie banner with it.
6. **Blog / changelog** — would need MDX and a content pipeline.
7. **Free deliverability tools** (the old spec's 21) — each needs a rate-limited server
   route doing real DNS/SMTP work. Genuinely useful for SEO, genuinely a project.
8. **Programmatic SEO** (`/learn`, `/alternatives`) and the `.seo/` engine. `/compare` now
   exists, but as three hand-written comparisons against *approaches*, not a generated
   matrix against named competitors — see §10.
9. **Transparency page** — blocked on `placement_public_snapshot` data actually existing.
10. **Partner directory, affiliates, careers, about, customer stories.**
11. **Tests** — no Playwright suite here yet; the dashboard has one to model it on.

### Product claims to keep off this site until they are true

- Any inbox-placement or deliverability **rate**, and any **SLA** or money-back guarantee.
  The draft SLA at `/legal/service-level-agreement` is the one place an SLA is discussed,
  it is labelled as not in force, it names a tier that is not sold, and it prints no
  percentage anywhere.
- Case studies, customer stories and testimonials. Deliberately not built: there is
  nothing true to put in them, and `/resources` says so in as many words rather than
  shipping an empty "coming soon" route.
- Customer counts, logos, testimonials, "X domains provisioned today" counters.
- A single headline setup time (see §0).
- Microsoft, Azure or SMTP mailboxes as purchasable products.
- Any claim that the DKIM step is proven end to end. It is implemented as step 6 and the
  site describes it as part of the pipeline, but per
  `api-server/infrabox-api-server/CLAUDE.md` its **write path has never completed a live
  run**. The site therefore attaches no reliability or success-rate claim to it, and
  nothing should be added until that changes.

---

---

## 10. The product and comparison routes

Added alongside the original four. Three conventions they follow, all load-bearing:

**Numbers.** No page holds a price or a duration of its own. `/pricing` and
`/pricing/calculator` read every figure from `src/lib/product.ts`; the relay's host,
port, security and daily cap come from `src/content/relay.ts`. Four values that existed
in neither — the default Google mailbox slots per domain (5, raisable to 20), the
per-team `domain_connection_limit` (250), the `site_verification` retry policy
(40 attempts, 60s doubling to a 15-minute ceiling) and the team `role` enum — live in
`src/app/_marketing/facts.ts`, each citing the api-server file it was read from.
**That file is a holding pen, not a second source of truth:** when `product.ts` or
`content/relay.ts` is next edited, fold these into it and delete it.

**The calculator invents nothing.** `pricing/calculator/estimate.tsx` is the site's
second client component. It contains no price literal — it multiplies the imported
constants and says plainly that the result is arithmetic on the published list rather
than a quote. Where the source tables disagree with each other (the `.co` prewarm/base
inconsistency already flagged in §4) it surfaces the disagreement in the result panel
instead of quietly picking the flattering number.

**Comparisons name no competitor.** Each `/compare/[slug]` entry is Infrabox versus an
*approach* — doing it by hand, a generic SMTP relay, buying Workspace seats directly.
The reasoning is in the header comment of `compare/comparisons.ts` and restated on the
hub page: we can verify our own column and cannot verify anybody else's, so the other
column describes a method and every claim in it is either definitional or a statement
about our own product. Every entry also carries a required `betterWhen` list — the
cases where the other approach wins — because a comparison without one is an advert.

`src/app/_marketing/` is a private folder (leading underscore, so the App Router does not
route it). It holds `page-parts.tsx` — `PageHero`, `Band`, `Strip`, `ComparisonTable`,
`FaqList`, `CtaBand`, the two list shapes and `InlineLink` — composed entirely from
`@/components/ui`. It declares no colour, font or radius of its own.

Claims deliberately kept off these pages, beyond the list in §9: any inbox-placement
figure; any reliability number attached to DKIM (the pages quote the provisioning code's
own qualitative line and note it is the one step allowed to fail); a free trial or refund
term (no such constant exists in the api-server); and warmup, InfraGuard or placement
testing as purchasable add-ons, since pricing them would mean introducing numbers that
`product.ts` does not carry.

---

*End of SPEC.md — marketing-site*
