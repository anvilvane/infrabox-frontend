# Learn article template — `/learn/<slug>`

**Target shape:** A JS module at `app/learn/[slug]/articles/<slug>.js` exporting `const article = { ... }`. The module is then imported and registered inside `app/learn/[slug]/learn-data.js`. Both steps must happen — the `register-article.mjs` script handles step 2 safely.

**When to use:** informational intent — guides, how-tos, explainers, benchmarks, pricing breakdowns, reviews of tools.
**Word count:** 1800-3500 words for standard guides, 3000-5000 for pillar pages.

## Required shape

```js
export const article = {
  slug: "<kebab-slug>",                          // must match the filename
  title: "...",                                  // <= 65 chars, include year for anything time-sensitive
  metaDescription: "...",                        // 150-160 chars
  headline: "...",                               // H1 shown on page
  publishedAt: "<YYYY-MM-DD>",
  updatedAt: "<YYYY-MM-DD>",
  author: "Mohit Mimani",                        // default; override if briefed
  category: "Guides" | "Comparisons" | "Reviews" | "Benchmarks" | "Pricing" | "Technical",
  readingTime: "<N> min read",                   // computed from content length; ~200wpm
  tags: ["...", "...", "..."],                   // 4-8 tags
  excerpt: "...",                                // 1-2 sentences shown in listings
  type: "guide" | "how-to" | "comparison" | "review" | "benchmark" | "pricing" | "what-is",
  sections: [                                    // 6-12 sections, rendered as H2s
    { heading: "...", content: "..." }
  ],
  faq: [                                         // 4-6 Q/A, optional but recommended
    { question: "...", answer: "..." }
  ],
  keyTakeaways: ["...", "..."],                  // 3-6 bullet takeaways shown near top
  internalLinks: [                               // at least 4 — script validates against sitemap
    { anchor: "...", href: "/learn/..." }
  ],
  sources: [                                     // at least 2 external authoritative sources
    { label: "...", url: "..." }
  ]
};
```

## Content rules

1. **Intent-first intro.** First 100 words must answer the query directly. No "In today's fast-paced world..."
2. **Markdown inside `content` strings.** Sections use markdown — H3 as `###`, bold `**text**`, tables, lists. The renderer passes it through `marked`.
3. **Tables for comparison/pricing/benchmark sections.** Reference existing articles like `what-is-infrabox.js` for the pattern.
4. **Section cadence:** lead with the answer, then sections go specific → general → action. Avoid filler ("Let's dive in!").
5. **Semantic coverage:** cover the cluster's `semanticKeywords` across sections. The `seo-generate` worker checks coverage before finalizing.
6. **Cite numbers.** Benchmarks, statistics, and claims need a source URL. Use `sources` and reference them in body text via `[label](url)`.
7. **Internal linking:** at least 4 links to related `/learn/*`, `/compare/*`, `/alternatives/*`. Pull candidates from `memory/generated.json`.
8. **No AI fingerprints. No em dashes. EVER.** See the full ban list in `/seo-generate.md` step 5 voice rules. Key rules: ZERO em dashes (`—`), en dashes (`–`), or double-hyphens (`--`) as punctuation. Use periods, commas, colons, or parentheses instead. ZERO banned phrases ("delve into", "it's crucial to note", "navigating the complexities", "ever-evolving", "robust solution", "cutting-edge", "game-changer", "seamlessly", "leverage" as verb, "landscape", "utilize", "in order to", "a plethora of", and 15+ more). ZERO three-adjective stacks or rhetorical question openers. Self-check the draft with a grep before registering.
9. **Reddit-sourced edges.** If the cluster has intent signals, weave in at least one actual user concern from the signals. Attribution is not required but the phrasing should sound like a real user problem, not marketing copy.
10. **Screenshots in articles:** if the article references the Infrabox product, Playwright MCP captures a dashboard screenshot. Images saved to `public/learn/<slug>-<step>.webp`. Reference with markdown image syntax inside `content`.

## Procedure

1. Load cluster → pick next pending slug.
2. Dedup — check `memory/generated.json` AND check the articles directory on disk (single source of truth).
3. Acquire lock.
4. If the article needs competitor data, `seo-scrape` the relevant competitor URLs.
5. If the article is intent-sensitive (reviews, "worth it?", "best" listicles), run `seo-reddit-intent` first.
6. Draft the module file at `app/learn/[slug]/articles/<slug>.js`.
7. `node .seo/scripts/register-article.mjs <slug>` — appends the import and map entry to `learn-data.js` safely.
8. Update cluster + memory.
9. Run `node .seo/scripts/validate-memory.mjs` before releasing lock.

## Examples in repo
- `app/learn/[slug]/articles/what-is-infrabox.js` — "what is" voice
- `app/learn/[slug]/articles/cold-email-infrastructure-setup-guide.js` — long-form guide
- `app/learn/[slug]/articles/mailforge-pricing.js` — pricing breakdown
- `app/learn/[slug]/articles/infrabox-review.js` — review structure
