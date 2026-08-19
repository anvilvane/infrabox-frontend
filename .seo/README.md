# Infrabox SEO system

A multi-agent content engine for Infrabox. Each agent takes a keyword cluster, scrapes competitors via Playwright MCP, pulls user intent from Reddit when needed, drafts a page using the Infrabox data-file shape, and registers it safely. Agents run in parallel across CMUX panels, coordinated through a shared file-based memory layer.

## Mental model

One operator (you) authors clusters. Many workers (agents, one per CMUX panel) consume them. A shared memory layer in `.seo/memory/` prevents overlap.

```
clusters/            memory/                    agents (in CMUX panels)
  vertical.json  ->  competitors.json       <-  seo-generate panel #1
  geo.json       ->  generated.json         <-  seo-generate panel #2
  listicles.json ->  intent-signals.json    <-  seo-generate panel #3
                     gaps.json
                            |
                            v
                 scripts/register-*.mjs
                            |
                            v
             app/compare  app/alternatives  app/learn
```

## Layout

- `config.json` — product facts, pricing, file paths, quality gates, parallelism budget
- `clusters/*.json` — one cluster per SEO front. Standard (explicit slug list) or programmatic (template × variables).
- `memory/competitors.json` — canonical competitor registry. Append-only merge.
- `memory/generated.json` — dedup registry. Every live slug lives here. Source of truth for "is this already built?"
- `memory/intent-signals.json` — Reddit-sourced user phrases by query. Used to align content voice with real user intent.
- `memory/gaps.json` — content gaps surfaced during generation. Operators review and act on these.
- `memory/.locks/` — per-slug file locks used by workers. Gitignored.
- `templates/*.md` — shape spec + content rules per page type (compare, alternatives, learn-article, programmatic)
- `runs/` — per-run artifacts (scrape extracts, screenshots, drafts). Gitignored.
- `scripts/` — node helpers that are the only supported way to write to `app/compare`, `app/alternatives`, `app/learn`.

## Page types

| Type | URL | Target file | Template |
|---|---|---|---|
| `compare` | `/compare/<slug>` | `app/compare/[slug]/compare-data.js` (object appended to `comparisonEntries`) | `templates/compare.md` |
| `alternatives` | `/alternatives/<slug>` | `app/alternatives/[slug]/alternatives-data.js` (entry appended to `alternativesEntries`) | `templates/alternatives.md` |
| `learn` | `/learn/<slug>` | `app/learn/[slug]/articles/<slug>.js` + registered in `learn-data.js` | `templates/learn-article.md` |
| programmatic | (any of the above) | (same — programmatic is a shortcut for generating N entries of one type from a template × variables matrix) | `templates/programmatic.md` |

## Commands

All commands live in `.claude/commands/`.

| Command | Purpose |
|---|---|
| `/seo-init` | First-time bootstrap / re-sync after merging new content manually |
| `/seo-status` | Read-only coverage and gap report |
| `/seo-scrape <domain>` | Playwright MCP clean-mode scrape of a competitor |
| `/seo-reddit-intent <query>` | Pull intent signals from Reddit for a query |
| `/seo-generate <cluster-id> [slug-or-index]` | The worker — drafts + registers one page |
| `/seo-launch [cluster-id...]` | Split clusters across CMUX panels and start workers in parallel |

## Parallel execution via CMUX

The operator runs `/seo-launch` in the main window. It reads `config.json :: parallelism.cmuxMaxPanels` and splits clusters across panels. Each panel runs `/seo-generate <cluster> <assignment>` independently.

Workers coordinate via files:
- Every worker holds a per-slug lock (`.seo/memory/.locks/<slug>.lock`).
- The first thing a worker does after picking a slug is confirm the slug is still absent from `generated.json` — a cheap re-check to catch races.
- All writes to `app/compare/*`, `app/alternatives/*`, `app/learn/*` go through `scripts/register-*.mjs` which re-acquire the relevant file lock and re-validate the draft before writing atomically.

## Operator workflow

### First run
```bash
/seo-init
/seo-status
```

### Author a new cluster
1. Pick a keyword front (vertical, geo, use case, troubleshooting, competitor axis).
2. Create `.seo/clusters/<id>.json`. Follow the shape of one of the existing clusters.
3. `node .seo/scripts/validate-memory.mjs`
4. `/seo-status <id>` to confirm.

### Generate a cluster
```
/seo-launch programmatic-vertical-infra
# watch the CMUX panels or:
/seo-status programmatic-vertical-infra
```

### Inspect a single generated page before shipping
Each worker drafts to `.seo/runs/<date>-<cluster>/<slug>.draft.json` before calling the register script. You can review drafts there before register runs by pausing the worker.

### Rolling back
If a generated page turns out wrong:
1. Delete the entry from `app/compare/[slug]/compare-data.js` (or the alt/learn file)
2. Delete from `.seo/memory/generated.json`
3. Mark the slug as `pending` again in its cluster file
4. Rerun `/seo-generate <cluster> <slug>`

## Quality gates

These are hard-enforced by the register scripts. A draft that fails these will not ship:

- **compare:** 8+ feature rows, 3+ competitor strengths, 4+ FAQ items, 2+ sources, live-scraped pricing
- **alternatives:** 5+ alternatives, 3+ whyLook items, 4+ FAQ items, 2+ sources, first entry must be `infraboxAlternative`
- **learn:** required keys present, slug must match filename, min section count checked by validator

Voice quality (ban lists, cadence) is the agent's responsibility — the scripts don't enforce it. Audit drafts before shipping major batches.

## Adding a new competitor

1. Add to `.seo/memory/competitors.json` under `competitors.<key>`.
2. Use the key in any cluster's `competitors` array.
3. Run `/seo-scrape <domain>` to populate `knownUrls`, `knownStrengths`, `knownWeaknesses`, `lastScrapedAt`.

## Known limits

- **Drift between `generated.json` and disk** happens when pages are added or removed manually. Run `/seo-init` to re-sync.
- **Register scripts validate shape, not quality.** A draft can pass the scripts and still be bad content. Humans must spot-check.
- **Reddit scraping is throttled.** Playwright + clean mode dismisses popups but Reddit may rate-limit — worst case, fall back to WebSearch snippets.
- **Programmatic similarity.** The system's guard against thin programmatic content is to require 3+ variant-specific facts per variant. Agents should actively refuse to generate when they can't find those facts, logging to `gaps.json` instead.
