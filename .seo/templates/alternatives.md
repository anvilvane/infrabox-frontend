# Alternatives page template — `/alternatives/<slug>`

**Target shape:** An object appended to `alternativesEntries` in `app/alternatives/[slug]/alternatives-data.js`.

**When to use:** listicle-intent query — "<tool> alternatives", "best alternatives to <tool>", "<tool> competitors".
**Search intent:** informational-commercial. Reader is dissatisfied with tool X and evaluating a short list.
**Competitor count:** 5-8 alternatives per page. First alternative is always Infrabox (use the shared `infraboxAlternative` object).

## Required fields

```js
{
  slug: "<kebab-tool>",                          // e.g. "mailforge"
  toolName: "<Tool>",
  toolDomain: "<domain>",
  title: "<N> Best <Tool> Alternatives in <year>",
  metaDescription: "...",                        // 150-160 chars
  headline: "...",
  subheadline: "...",
  intro: "...",                                  // 2-3 paragraphs
  whyLook: [                                     // 3-5 honest reasons people search for alternatives
    "..."
  ],
  alternatives: [                                // Infrabox first, then 4-7 others
    infraboxAlternative,                         // <-- reuse the shared constant
    {
      name: "...",
      domain: "...",
      description: "...",                        // 2-3 sentences, neutral
      bestFor: "...",                            // one sentence on the ideal buyer
      pricing: "...",                            // real pricing from scrape
      pros: ["...", "...", "..."],               // 3-5
      cons: ["...", "..."]                       // 2-4
    }
  ],
  comparisonTable: [                             // same tools as above, 6-10 feature rows
    { feature: "...", values: { "<Tool A>": "...", "<Tool B>": "..." } }
  ],
  buyerGuide: [                                  // 3-5 considerations
    { heading: "...", body: "..." }
  ],
  faq: [
    { question: "...", answer: "..." }
  ],
  lastUpdated: "<YYYY-MM-DD>",
  sources: [
    { label: "...", url: "..." }
  ]
}
```

## Content rules

1. **No AI language. No em dashes. EVER.** Zero em dashes (`—`), en dashes (`–`), or `--`. Use periods, commas, colons instead. Zero banned phrases (see full list in `/seo-generate.md` step 5 — "delve into", "robust solution", "seamlessly", "leverage", "cutting-edge", "game-changer", "landscape", "utilize", etc.). Zero three-adjective stacks. Self-check your draft before registering.
2. **Do not stack the deck.** Infrabox is first but the other alternatives must be real competitors with real pricing. Pros and cons must be honest. Reader trust > self-promotion.
2. **Each alternative needs a distinct `bestFor`.** Avoid "best for teams that want email" — be specific (e.g., "best for agencies running 500+ mailboxes who need workspace isolation").
3. **Pricing from scrape.** Same rule as compare pages — Playwright MCP fetches live pricing. No hallucinated numbers.
4. **Cross-link to the matching `/compare/<tool>` page** in the body if one exists. Check `memory/generated.json`.
5. **Differentiate from similar pages.** When writing `mailforge-alternatives` and `primeforge-alternatives`, the intro and `whyLook` must be different — write from the angle of someone actually considering leaving THAT specific tool.
6. **Avoid duplicate alternative lists.** Rotate the set: not every listicle should have the same 7 tools in the same order. Read `memory/generated.json` for prior listicle compositions and aim for at least 30% variation.

## Procedure

1. Load cluster → pick next `pending` slug.
2. Dedup check against `memory/generated.json`.
3. Acquire lock.
4. Scrape the target tool AND the alternatives via `seo-scrape` (batch mode).
5. Pull intent from Reddit / r/coldemail, r/sales, r/Emailmarketing — search for "<tool> alternative" and "<tool> vs" threads.
6. Draft the entry using the existing `mailforge`, `primeforge`, `zapmail` entries as voice reference.
7. `node .seo/scripts/register-alternative.mjs <slug>`.
8. Update cluster + memory.

## Examples in repo
- `app/alternatives/[slug]/alternatives-data.js` → `mailforge`, `primeforge`, `zapmail` entries.
