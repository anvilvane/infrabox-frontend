# Infrabox Frontend

The public marketing front end for Infrabox. **This repository contains the
website only.** It is deliberately separated from the Infrabox application so
that it can be deployed to a public host without carrying anything sensitive
with it.

## What is deliberately not here

This is the important part, and it is enforced by what the code contains rather
than by convention:

- **No API routes.** There is no `src/app/api` directory. Every route in this
  app is a static page — `next build` reports no dynamic (`ƒ`) routes at all.
- **No authentication.** There is no sign-in, no sign-up, no session, no
  password reset and no link into the customer dashboard. The word "Sign in"
  does not appear in the UI.
- **No database, queue or mail connection.** Nothing here talks to MongoDB,
  Redis, Google, the registrar, or the SMTP relay.
- **No credentials.** The only environment variable the app reads is
  `NEXT_PUBLIC_SITE_URL`, a public origin used for canonical URLs and Open
  Graph tags. `.env.example` documents that one variable and nothing else.
- **No customer data.** The get-started form does not post anywhere; it hands
  the drafted message to the visitor's own mail client via `mailto:`.

If you are adding to this repository, keep it that way. Anything that needs a
secret, a database or a logged-in user belongs in the application repo, not
here.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Fonts: **Geist Sans** for headings, **Figtree** for body copy — both
  self-hosted via `next/font`, no CDN request
- Brand palette sampled from `public/logo.png` (see `DESIGN.md`)

## Running it

```bash
npm install
npm run dev     # http://localhost:3003
npm run build   # production build
npm run start   # serve the production build
```

## Documentation

- `DESIGN.md` — the design system: tokens, type scale, spacing, the shared
  primitives in `src/components/ui.tsx`, and the visual decisions behind them.
  Read this before adding a page; pages consume tokens and never write raw hex
  colours or import fonts.
- `SPEC.md` — routes, content registries and conventions.

## A note on content accuracy

Every price and duration shown on the site is read from `src/lib/product.ts`,
which cites the application config each figure comes from. Numbers are not
hardcoded into pages. The site carries no customer counts, testimonials,
logos, uptime figures or deliverability percentages, because none of those are
verifiable today.

Several legal pages are published as **drafts** and say so on the page. They
are not in force and must be replaced with reviewed text before the site is
used commercially.
