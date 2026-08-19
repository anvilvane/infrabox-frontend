# Programmatic page template

**What this is:** pages generated at scale from a `(template × variable)` matrix. One template + a dataset of variables produces hundreds of URLs.

**When to use:** massive-volume informational or transactional intent with a clear variable axis. Examples for Infrabox:

| Template | Variables | Example URL | Count |
|---|---|---|---|
| `cold-email-infrastructure-for-<vertical>` | SaaS, agencies, recruitment, real estate, e-commerce, real estate, staffing, legal, B2B sales, startup, etc. | `/learn/cold-email-infrastructure-saas` | ~20 |
| `<tool-A>-vs-<tool-B>` | tool pairs from competitor registry | `/compare/mailforge-vs-primeforge` | ~30 |
| `<tool>-pricing` | each competitor | `/learn/mailforge-pricing` | ~15 |
| `<tool>-review` | each competitor | `/learn/zapmail-review` | ~15 |
| `best-cold-email-infrastructure-for-<vertical>` | vertical | `/learn/best-cold-email-infrastructure-saas` | ~20 |
| `cold-email-infrastructure-<country>` | US, UK, Canada, Australia, Germany, etc. | `/learn/cold-email-infrastructure-us` | ~12 |

## Output mapping

Programmatic pages don't have their own URL namespace — they're routed into the existing `/compare/`, `/alternatives/`, or `/learn/` page types. A programmatic cluster is just a shortcut for generating N entries of one of those page types against a dataset.

## Cluster file format for a programmatic cluster

```json
{
  "id": "pseo-learn-vertical",
  "pageType": "learn",
  "generator": "programmatic",
  "template": {
    "slugPattern": "cold-email-infrastructure-<vertical>",
    "titlePattern": "Cold Email Infrastructure for <Vertical> (<year>)",
    "category": "Guides",
    "type": "guide",
    "semanticKeywords": [
      "<vertical> cold email",
      "<vertical> outreach",
      "deliverability for <vertical>",
      "<vertical> sender reputation"
    ]
  },
  "variables": [
    { "vertical": "saas",       "Vertical": "SaaS",        "audience": "SaaS growth teams",          "notes": "..." },
    { "vertical": "agencies",   "Vertical": "Agencies",    "audience": "lead-gen agencies",          "notes": "..." },
    { "vertical": "recruitment","Vertical": "Recruitment", "audience": "talent sourcers",            "notes": "..." }
  ],
  "status": "pending"
}
```

## Content rules (critical — Google penalizes thin programmatic SEO)

1. **No Mad-Libs.** Each variant must have unique body content — not the same paragraph with a word swapped. The programmatic layer controls the SKELETON, the agent fills each variant with variant-specific facts.
2. **Variant-specific data required.** Each vertical/geo must have at least 3 concrete facts specific to it (avg deal size, typical sending volume, regulatory notes, a real-world example, common pain).
3. **Variant-specific sources.** Programmatic pages need at least 1 source URL that is specific to the variant (e.g., for "cold email infra for recruitment" cite an actual recruiting industry source, not the same generic deliverability blog across all 20 pages).
4. **Variant-specific FAQ.** Don't paste the same FAQ across all variants.
5. **Internal link network.** Every programmatic variant links to its 2-3 nearest siblings in the same cluster AND 1-2 unrelated pillar pages. This is what gives the programmatic network compounding value.
6. **Kill empty variants.** If the agent can't find 3 variant-specific facts after scraping, drop that variant from `variables` and log it to `memory/gaps.json` with reason.
7. **Coverage audit before ship.** `node .seo/scripts/validate-memory.mjs --programmatic <cluster-id>` runs a similarity check across all variants in the cluster and fails if two variants exceed 70% content overlap.

## Procedure

1. Load cluster → list pending variables.
2. Split variables across CMUX panels (`.seo/config.json :: parallelism.cmuxMaxPanels`).
3. Each panel runs `seo-generate --cluster <id> --variable <index>`.
4. Each variant goes through the normal `learn`/`compare`/`alternatives` path.
5. After all variants finish, run the similarity check.
