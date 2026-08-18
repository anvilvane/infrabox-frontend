# DESIGN.md — Infrabox marketing site

The design system for `marketing-site/`. Two files hold it:

| File | Holds |
|---|---|
| `src/app/globals.css` | Every colour, font, radius and hand-written utility. The single source of truth. |
| `src/components/ui.tsx` | The primitives every page is built out of. |

If you are building a page here, import from `@/components/ui` and use token
class names (`text-brand`, `border-border`, `bg-ink`). **Do not write a raw hex
value in a page file.** If you need a colour that is not a token, add the token
to `globals.css` first.

---

## 0. Direction — what this site is, and what it is not

The legacy reference site checked out alongside this repo (the predecessor
brand's marketing site) was read for **structure and quality bar only**:
its section ordering (hero → features → how it works → comparison → pricing →
FAQ → CTA) is simply good landing-page logic and we keep it.

**The surface design is ours and must stay visibly different.** Side by side,
the two sites should read as two different products in the same category, not
as one site with the words swapped. Concretely, we deliberately do *not* use:

| Reference does | We do |
|---|---|
| Dashed vertical rails down the content column | No rails. A **monospace index in the left gutter** (`01 / what you get`) marks each section. |
| Fully-rounded pill buttons | **4px radius**, squared-off buttons and tags. |
| Floating `rounded-xl` cards with gaps between them | **Flush hairline cells** sharing one 1px sheet (`CellGrid`). |
| Centred headings, centred hero | **Left-aligned** headings throughout; an asymmetric hero split. |
| Grey accordion bubbles with a ⊕/⊖ in a box | **Flush hairline FAQ rows** with a rotating caret. |
| A pale mint highlight column in the comparison table | The Infrabox column is the **full dark ground**. |
| Sans-serif uppercase eyebrows | **Monospace** eyebrows, indices, prices and durations. |

Anything you add should extend that vocabulary — engineered, hairline,
left-aligned, monospace-labelled — rather than reintroducing the soft/rounded
one.

---

## 1. Colour — sampled from the logo

**The palette comes from `public/logo.png`, measured pixel by pixel.** The mark
is a cyan/teal cube with a bright cyan wordmark. **There is no green in the
logo and there must be none on the site.** (An earlier `#103938` spruce came
from the reference site's CSS and is wrong for this brand — it is gone.)

### The measured ramp

| Token | Value | Where it came from |
|---|---|---|
| `bg-brand-950` | `#01202c` | Deepest cube faces |
| `bg-brand-900` | `#012c3c` | Dark sections, footer |
| `bg-brand-800` | `#013a4d` | |
| `bg-brand-700` | `#014b63` | The most common single colour in the mark |
| `bg-brand-600` | `#01536c` | |
| `bg-brand-500` | `#026c8a` | **Primary action on white** |
| `bg-brand-400` | `#017493` | |
| `bg-brand-300` | `#0283a3` | |
| `bg-brand-200` | `#0293b4` | |
| `bg-accent-400` | `#3ce2f4` | Wordmark cyan |
| `bg-accent-300` | `#4ae3f4` | |
| `bg-accent-200` | `#6cf4fb` | Brightest wordmark cyan |
| `bg-accent-100` | `#b3fdfe` | Specular highlight on the mark |

### Reach for the semantic aliases, not the ramp

| Token | Resolves to | Use |
|---|---|---|
| `bg-brand` `text-brand` | `#026c8a` | Primary buttons, accent icons, links that matter, the focus ring. |
| `bg-brand-hover` | `#01536c` | Hover state of a brand-filled control. |
| `text-brand-foreground` | `#ffffff` | Text on brand fill. |
| `bg-brand-tint` | `#eef7fa` | Pale teal cell/callout tint. |

### The dark ground (`ink`)

| Token | Value | Use |
|---|---|---|
| `bg-ink` | `#012c3c` | Section background: hero, closing CTA, footer, the Infrabox table column. |
| `bg-ink-raised` | `#013a4d` | A panel sitting on top of ink. |
| `text-ink-foreground` | `#eaf7fa` | Text on ink. **14.4:1**. |
| `text-ink-muted` | `#8fb6c4` | Secondary text on ink. **6.8:1**. |
| `border-ink-border` | `#0a4257` | Hairlines and outline buttons on ink. |
| `text-ink-accent` | `#4ae3f4` | The one semantic use of wordmark cyan: links, emphasis and rules **on ink**. **9.5:1**. |

**Always add `on-ink` to a dark section** (`<Section tone="ink">` does it).
It flips the keyboard focus ring to a light colour; the brand teal ring is
invisible against ink.

### Contrast rules — non-negotiable

- `#026c8a` on white is **5.98:1** — safe for body text and as a button fill
  with white on top.
- **The accent cyans are never text on white.** `#4ae3f4` on white is ~1.5:1.
  They exist for the dark ground, gradient edges, glows and 1px rules only.
- Anything you add must clear WCAG AA: **4.5:1** for body, **3:1** for large
  text and UI boundaries. Check before you ship, do not eyeball it.

### Neutrals

They are faintly cool so they sit under the teal rather than fighting it.

| Token | Value |
|---|---|
| `bg-background` / `bg-card` | `#ffffff` |
| `text-foreground` | `#0b1a20` |
| `text-muted-foreground` | `#4f6570` (6.1:1 on white) |
| `bg-muted` | `#f2f7f9` |
| `border-border` | `#dfe8ec` |
| `border-input` | `#c6d5dc` |

Status tokens (`success`, `warning`, `info`, `destructive`) are for form
feedback only. Never use them decoratively.

---

## 2. Type

| Role | Face | Loaded as | Tailwind |
|---|---|---|---|
| Headings and the wordmark | **Geist Sans** | `geist/font/sans` — files ship inside the npm package | `font-display` |
| Body, paragraphs, UI labels | **Figtree** | `next/font/google`, inlined at build | `font-sans` (the `<body>` default) |
| Eyebrows, section indices, prices, durations, TLDs | system mono stack | — | `font-mono` |

Both faces are **self-hosted by `next/font`**. No page makes a runtime request
to a font CDN — keep it that way. Verified in the browser: `<h1>` computes to
`Geist`, `<p>` computes to `Figtree`.

`globals.css` applies `font-display` and `letter-spacing:-0.03em` to every
`h1`–`h6` automatically, so you never write `className="font-display
tracking-tight"` on a heading.

The mono/sans split is a **signature**, not decoration: every label, index,
price and measurement is monospace; every sentence is not.

**Scale in use**

| Element | Classes |
|---|---|
| Page `h1` | `text-[clamp(2.375rem,6vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em]` |
| Section `h2` | `text-[1.75rem] sm:text-[2.125rem] font-semibold leading-[1.12]` (given to you by `SectionHeading`) |
| Cell `h3` | `text-[0.9375rem] font-semibold` |
| Lede | `text-[0.9375rem] leading-relaxed text-muted-foreground` |
| Cell body | `text-[0.8125rem] leading-relaxed text-muted-foreground` |
| Eyebrow / index / measurement | `font-mono text-[0.6875rem] uppercase tracking-[0.18em]` |

Add `tabular` to anything containing a price, count or duration.

---

## 3. Shape

- `--radius` is **`4px`**. Cards and tables are `rounded-md`; nothing is a pill
  and nothing is a bubble.
- **1px hairlines, never shadows.** Nothing on this site casts a shadow.
- Depth comes from `bg-muted` / `bg-ink` grounds and `border-border` lines.
- Groups of things are **flush cells on a shared 1px sheet** (`CellGrid`), not
  separated cards with gaps.
- Sections are separated by a single edge-to-edge hairline (`<Section divided>`)
  and alternate `default` / `muted` grounds.
- Content column is `max-w-6xl`, padding `px-5 sm:px-7 lg:px-10`. Section
  rhythm is `py-16 lg:py-24` (`SectionShell` applies it).

---

## 4. Primitives — `@/components/ui`

All server components. No `"use client"` in the file; the only interactive
widget (`Disclosure`) is a `<details>`, so it works with JS disabled.

### Structure

| Export | Signature | Notes |
|---|---|---|
| `Container` | `div` props | The `max-w-6xl` content column. |
| `Section` | `section` props + `tone?: "default" \| "muted" \| "ink"`, `divided?: boolean` | Full-bleed band. `tone="ink"` adds `bg-ink text-ink-foreground on-ink`. `divided` draws the top hairline. |
| `SectionShell` | `{ index, label, tone?, className?, children }` | **The default section wrapper.** Renders the monospace gutter index (`index="02"`, `label="how it works"`) beside the content and applies the vertical rhythm. |
| `Rails` | *deprecated* | Alias of `Container`. The site no longer draws vertical rails. |

### Type

| Export | Signature |
|---|---|
| `Eyebrow` | `p` props + `tone?: "default" \| "ink"` — monospace kicker. |
| `SectionHeading` | `{ eyebrow?, title, lede?, id?, tone?, className? }` — left-aligned by design. |

Give `SectionHeading` an `id` and point the parent `<Section aria-labelledby>`
at it; that is how every section on the homepage is labelled.

### Buttons and links

`Button` (a `<button>`), `ButtonLink` (a next/link), `buttonClass(...)` for the
classes alone, and `ArrowLink` (monospace text link with a rule that extends on
hover).

- `variant`: `default` (brand fill) · `outline` · `ghost` · `inverse` (light
  fill for use on ink) · `outlineInverse` (hairline on ink)
- `size`: `sm` (h-8) · `default` (h-10) · `lg` (h-12)

An icon child is auto-sized to `size-4`; mark it `aria-hidden`.

### Content

| Export | Signature | Notes |
|---|---|---|
| `CellGrid` | `div` props + `columns?: 2 \| 3 \| 4` | The shared 1px sheet. Put `Cell`s or `FeatureCell`s inside. |
| `Cell` | `div` props | One flush cell; supplies its own background. |
| `FeatureCell` | `{ icon?, title, children?, className? }` | Icon + title + body. `icon` is a lucide **component**, not an element. |
| `Card` | `div` props | Standalone hairline box. Prefer `CellGrid` for groups. |
| `Tag` | `{ tone?, className?, children }` | Squared monospace label. |
| `Note` | `{ tone?, className?, children }` | Left-ruled aside for a caveat that must be read. |
| `Disclosure` | `{ question, children, defaultOpen? }` | One FAQ row: flush hairline row, rotating caret. |
| `FeatureCard`, `Pill` | *deprecated* | Aliases kept so older imports compile. Use `FeatureCell` / `Tag`. |

### Utility classes in `globals.css`

| Class | Purpose |
|---|---|
| `on-ink` | Flips the focus ring on dark grounds. **Required** on any ink surface. |
| `ink-gradient` | The dark ground lit the way the cube is: `--brand-900` → `--brand-700` toward the lower right. |
| `accent-edge` | A 1px cyan specular rule. Closes a dark band; never a border on white. |
| `dot-field` | 1px dot texture for ink grounds (light dots). |
| `dot-field-light` | The same in brand teal, for light grounds. |
| `cell-grid` | The shared 1px sheet (use `<CellGrid>` rather than this directly). |
| `tabular` | Tabular numerals. |
| `disclosure` | Drives the `Disclosure` caret rotation. |
| `skip-link` | The off-screen-until-focused skip link in the layout. |

Put `dot-field` / `dot-field-light` on an `aria-hidden absolute inset-0` div.

---

## 5. Logo and icons

`public/logo.png` — 500×500 RGBA, the only brand image on the site, and the
source of the entire palette. It is a lockup: the isometric cube occupies
`(123,50)–(391,355)`, and a baked-in "INFRABOX" wordmark sits at rows
`401–429`.

- **Header and footer**: `<Wordmark>` / `<LogoMark>` from
  `@/components/site-chrome`. `LogoMark` CSS-crops the file to the cube only —
  at header size the baked-in wordmark would be two pixels tall — and
  `Wordmark` pairs that mark with "Infrabox" set in Geist Sans.
- **Favicon / tab icon**: `src/app/icon.png`
- **iOS home screen**: `src/app/apple-icon.png`

All three are byte-identical copies of the same file. If the logo changes,
replace all three; never create per-surface variants.

`themeColor` is `#012c3c` (set in `layout.tsx`'s `viewport` export).

---

## 6. Content rules

Not style preferences — this is why the copy is short.

1. **Every price and duration comes from `src/lib/product.ts`**, which cites the
   api-server or dashboard file each value was read out of. Never hardcode a
   number in a page, and never invent one.
2. **No metrics, customer counts, testimonials, logo walls, star ratings or
   uptime claims.** None exist as facts in this repository.
3. **No single headline setup time.** The dashboard's own per-step estimates sum
   to hours, dominated by Google's domain verification, and the site says so.
4. **The comparison compares against doing the job by hand**, not a named
   competitor — we have no verified data about anyone else's product.
5. **"Not yet" is a valid answer.** Microsoft, Azure and SMTP mailboxes are
   outside the current product, and the FAQ says so in as many words.
6. **No trace of the predecessor brand anywhere under `marketing-site/`** — not
   in copy, alt text, metadata, JSON-LD, filenames, comments or URLs. The
   product is called Infrabox and nothing else. A case-insensitive search for
   the old name across this folder must return zero hits; it is part of the
   definition of done, so re-run it before you hand work over.

---

## 7. Viewport priority and accessibility floor

**Desktop first.** Design and check at **1280–1600px**; that is where this site
is judged right now. Smaller widths must not break catastrophically or scroll
horizontally, but fine mobile polish is explicitly not the current priority.

Do not regress any of this:

- No horizontal body scroll at any width (`html { overflow-x: hidden }` is a
  backstop, not a licence to overflow).
- Visible keyboard focus everywhere — brand ring on light, light ring on ink
  (that is what `on-ink` is for).
- One `h1` per page; section `h2`s labelled via `aria-labelledby`; cell titles
  are `h3`. No level skipped.
- Comparison and pricing tables are real `<table>` elements with `<caption>`,
  `scope` on every header cell, and an `sr-only` "Yes"/"No" beside every
  check/cross icon.
- Decorative icons and background layers carry `aria-hidden`.
- The FAQ works with JavaScript disabled.
