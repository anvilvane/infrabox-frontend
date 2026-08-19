# Compare page template — `/compare/<slug>`

**Target shape:** A JavaScript object inside `comparisonEntries` in `app/compare/[slug]/compare-data.js`. Not MDX. Not markdown. The page renders from the data object via `app/compare/[slug]/page.js`.

**When to use:** head-to-head query — "infrabox vs X", "X vs Y", "compare X and Y".
**Search intent:** transactional comparison. Reader is deciding between two tools.
**Competitor target:** 1 direct competitor (or 2 if it's a 3-way).

## Required fields (keys that must exist in the entry)

```js
{
  slug: "<kebab-competitor>",                    // e.g. "mailforge"
  competitorName: "<Brand>",                     // e.g. "Mailforge"
  competitorDomain: "<domain>",                  // e.g. "mailforge.ai"
  title: "Infrabox vs <Brand> (<year>) - ...",   // <=65 chars ideal
  metaDescription: "...",                        // 150-160 chars, include both brand names + year
  headline: "...",                               // H1
  subheadline: "...",                            // supporting sentence
  summary: "...",                                // 2-3 sentences of neutral framing
  competitorOverview: "...",                     // 2-4 paragraphs, factual, no trashing
  competitorStrengths: [                         // 3-5 items, honest
    { title: "...", description: "..." }
  ],
  competitorPricing: [                           // real pricing from scrape
    { name: "...", price: "...", details: "..." }
  ],
  infraboxPricing: INFRABOX_PRICING,             // shared constant from the file
  pricingVerdict: "...",                         // one short paragraph, who wins on price and why
  features: [                                    // 8-14 rows
    { name: "...", infrabox: "...", competitor: "..." }
  ],
  deliverability: "...",                         // one paragraph
  useCases: {
    infrabox: ["..."],                           // 3-5 bullets
    competitor: ["..."]                          // 3-5 bullets
  },
  verdict: "...",                                // 2-3 paragraphs, honest split-recommendation
  faq: [                                         // 4-6 Q/A, schema-friendly
    { question: "...", answer: "..." }
  ],
  lastUpdated: "<YYYY-MM-DD>",
  sources: [                                     // at least 2, must be real URLs
    { label: "...", url: "..." }
  ]
}
```

## Content rules

1. **No AI language. No em dashes. EVER.** Zero em dashes (`—`), en dashes (`–`), or `--`. Use periods, commas, colons instead. Zero banned phrases (see full list in `/seo-generate.md` step 5 — "delve into", "robust solution", "seamlessly", "leverage", "cutting-edge", "game-changer", "landscape", "utilize", etc.). Zero three-adjective stacks. Self-check your draft before registering.
2. **Honesty beats hype.** Every `competitorStrengths` entry must be real and verifiable from the scrape. If the competitor is genuinely cheaper / faster / more integrated, say so. Credibility compounds.
2. **Pricing must be scraped, not invented.** The Playwright scrape step MUST capture the competitor's live pricing page. Store the raw scrape in `.seo/runs/<date>-<cluster>/<competitor>.scrape.json` and cite it in `sources`.
3. **Use the shared INFRABOX_PRICING constant** at the top of `compare-data.js`. Do NOT re-declare Infrabox's pricing inline — that causes drift when pricing changes.
4. **Feature matrix: 8-14 rows.** Choose features where there is a meaningful difference. Don't pad with "Both have email."
5. **Unique angle per comparison.** Read `memory/generated.json` before writing: if a prior comparison already hit angle X, take a different one. No duplicate talking points across competitors.
6. **Internal links: at least 4.** Cross-link to related `/compare/*`, `/alternatives/*`, `/learn/*` pages.
7. **Screenshots:** required for the page hero. Use the `seo-scrape` command which calls Playwright MCP in clean mode (cookie/popup dismissal, idle-wait, full-page hero) and saves to `public/compare/<slug>-hero.webp`.
8. **FAQ:** write 4-6 questions that real people ask. Source from SERP "People also ask", Reddit threads, or the intent-signals memory. No generic questions.
9. **Schema.org:** `ComparisonPage` or `Product` + `FAQPage` JSON-LD is emitted by the page component — agents don't write it inline.

## Procedure (followed by `seo-generate` for a compare cluster)

1. Load the cluster file from `.seo/clusters/<id>.json` — pick the next `pending` slug.
2. Check `memory/generated.json` for the slug; bail if it exists.
3. Acquire a lock: create `memory/.locks/<slug>.lock` with pid + timestamp.
4. Run `seo-scrape` on the competitor domain (home, pricing, features, docs). Load scrape results.
5. Pull Reddit/forum signals via `seo-reddit-intent` if the cluster's `intentHints` are empty.
6. Draft the entry object — aim for the structure above, keeping voice consistent with the existing entries.
7. Append via `node .seo/scripts/register-compare.mjs <slug>` (script validates and appends safely).
8. Mark the slug `done` in the cluster file, add to `memory/generated.json`, release lock.
9. Update `memory/competitors.json` with anything new learned about the competitor.

## Examples in repo
- `app/compare/[slug]/compare-data.js` → entries for `mailforge`, `primeforge`, `zapmail` — these are the target quality bar.
