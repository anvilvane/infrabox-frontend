#!/usr/bin/env node
// Print a coverage + run status report for the SEO system.
// Usage: node .seo/scripts/status.mjs

import fs from "node:fs";
import path from "node:path";

const REPO = process.cwd();
const CLUSTERS_DIR = path.join(REPO, ".seo/clusters");
const GENERATED = path.join(REPO, ".seo/memory/generated.json");
const GAPS = path.join(REPO, ".seo/memory/gaps.json");

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }

const generated = fs.existsSync(GENERATED) ? readJson(GENERATED) : { entries: [], _meta: { counts: {} } };
const gaps = fs.existsSync(GAPS) ? readJson(GAPS) : { gaps: [] };
const clusters = fs.existsSync(CLUSTERS_DIR)
  ? fs.readdirSync(CLUSTERS_DIR).filter(f => f.endsWith(".json")).map(f => readJson(path.join(CLUSTERS_DIR, f)))
  : [];

const counts = generated._meta?.counts || {};

console.log("Infrabox SEO status");
console.log("===================\n");

console.log("Live pages:");
console.log(`  compare:      ${counts.compare ?? "?"}`);
console.log(`  alternatives: ${counts.alternatives ?? "?"}`);
console.log(`  learn:        ${counts.learn ?? "?"}`);
console.log(`  total:        ${counts.total ?? generated.entries?.length ?? 0}\n`);

console.log(`Clusters: ${clusters.length}`);
for (const c of clusters) {
  let targetCount = 0;
  if (Array.isArray(c.slugs)) targetCount = c.slugs.length;
  else if (Array.isArray(c.variables)) targetCount = c.variables.length;
  const done = generated.entries.filter(e => e.cluster === c.id).length;
  console.log(`  [${c.status.padEnd(11)}] ${c.id.padEnd(36)} ${c.pageType.padEnd(13)} targets=${targetCount} done=${done} panels=${c.cmuxPanelCount ?? "?"}`);
}

console.log(`\nGaps recorded: ${gaps.gaps?.length ?? 0}`);
if (gaps.gaps?.length) {
  for (const g of gaps.gaps.slice(0, 10)) {
    const label = g.id ?? g.slug ?? g.keyword ?? g.variant ?? "?";
    const where = g.cluster ? ` [${g.cluster}]` : "";
    console.log(`  - ${label}${where}: ${g.reason ?? ""}`);
  }
}
