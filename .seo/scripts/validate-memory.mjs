#!/usr/bin/env node
// Validate the .seo memory layer and cluster files.
// Usage:
//   node .seo/scripts/validate-memory.mjs               # run all checks
//   node .seo/scripts/validate-memory.mjs --sync        # re-sync generated.json from disk
//   node .seo/scripts/validate-memory.mjs --cluster <id>
//
// Checks:
//   1. config.json exists and is valid JSON with expected keys
//   2. every cluster file is valid JSON with required keys
//   3. memory files are valid JSON with expected top-level keys
//   4. every slug in generated.json still exists on disk
//   5. competitors referenced in clusters exist in competitors.json
//   6. no slug appears in more than one cluster (--sync also rebuilds from disk)
//
// Exits non-zero on any failure, listing every problem found.

import fs from "node:fs";
import path from "node:path";

const REPO = process.cwd();
const CONFIG = path.join(REPO, ".seo/config.json");
const CLUSTERS_DIR = path.join(REPO, ".seo/clusters");
const MEM = {
  competitors: path.join(REPO, ".seo/memory/competitors.json"),
  generated:   path.join(REPO, ".seo/memory/generated.json"),
  gaps:        path.join(REPO, ".seo/memory/gaps.json"),
  intent:      path.join(REPO, ".seo/memory/intent-signals.json"),
};

const errors = [];
const warnings = [];
function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function readJson(file, label) {
  if (!fs.existsSync(file)) { err(`${label}: missing (${file})`); return null; }
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (e) { err(`${label}: invalid JSON — ${e.message}`); return null; }
}

function checkConfig() {
  const cfg = readJson(CONFIG, "config.json");
  if (!cfg) return null;
  for (const k of ["project", "product", "paths", "pageTypes", "memory", "quality", "parallelism"]) {
    if (!cfg[k]) err(`config.json: missing top-level key "${k}"`);
  }
  if (cfg?.project && !cfg.project.sendkitSeoProjectId) {
    warn(`config.json: sendkitSeoProjectId is empty — MCP handoff will fail`);
  }
  return cfg;
}

function checkClusters(competitors) {
  if (!fs.existsSync(CLUSTERS_DIR)) { err(`clusters/ dir missing`); return []; }
  const files = fs.readdirSync(CLUSTERS_DIR).filter(f => f.endsWith(".json"));
  const seenSlugs = new Map(); // slug -> cluster id

  const clusters = [];
  for (const f of files) {
    const c = readJson(path.join(CLUSTERS_DIR, f), `clusters/${f}`);
    if (!c) continue;
    clusters.push(c);
    for (const k of ["id", "name", "pageType", "generator", "status"]) {
      if (!c[k]) err(`clusters/${f}: missing "${k}"`);
    }
    if (c.id && c.id !== f.replace(/\.json$/, "")) {
      warn(`clusters/${f}: id "${c.id}" does not match filename`);
    }

    // MCP keyword sync state — flag if missing or older than 7 days
    const mcpSync = c.mcp?.keywordsSyncedAt;
    if (!mcpSync) {
      warn(`clusters/${f}: mcp.keywordsSyncedAt missing — run /seo-push-cluster ${c.id}`);
    } else {
      const ageDays = (Date.now() - new Date(mcpSync).getTime()) / (1000 * 60 * 60 * 24);
      if (Number.isFinite(ageDays) && ageDays > 7) {
        warn(`clusters/${f}: mcp.keywordsSyncedAt is ${ageDays.toFixed(1)}d old — consider /seo-push-cluster ${c.id}`);
      }
    }

    // referenced competitors must exist
    for (const ref of (c.competitors || [])) {
      if (!competitors?.competitors?.[ref]) {
        warn(`clusters/${f}: references unknown competitor "${ref}" — add to competitors.json`);
      }
    }

    // explicit slug list (standard generator)
    if (c.generator === "standard" && Array.isArray(c.slugs)) {
      for (const s of c.slugs) {
        const slug = typeof s === "string" ? s : s.slug;
        if (!slug) { err(`clusters/${f}: slug entry missing slug field`); continue; }
        if (seenSlugs.has(slug)) {
          err(`slug "${slug}" is claimed by two clusters: ${seenSlugs.get(slug)} and ${c.id}`);
        } else {
          seenSlugs.set(slug, c.id);
        }
      }
    }
  }
  return clusters;
}

function checkMemoryShape(name, data, requiredKeys) {
  if (!data) return;
  for (const k of requiredKeys) {
    if (!(k in data)) err(`${name}: missing key "${k}"`);
  }
  if (data._meta && !data._meta.description) warn(`${name}: _meta.description empty`);
}

function checkGeneratedOnDisk(generated) {
  if (!generated) return;
  const checks = {
    compare:      path.join(REPO, "app/compare/[slug]/compare-data.js"),
    alternatives: path.join(REPO, "app/alternatives/[slug]/alternatives-data.js"),
  };
  const compareSrc = fs.existsSync(checks.compare) ? fs.readFileSync(checks.compare, "utf8") : "";
  const altSrc = fs.existsSync(checks.alternatives) ? fs.readFileSync(checks.alternatives, "utf8") : "";
  const articlesDir = path.join(REPO, "app/learn/[slug]/articles");
  const articlesOnDisk = fs.existsSync(articlesDir)
    ? new Set(fs.readdirSync(articlesDir).filter(f => f.endsWith(".js")).map(f => f.replace(/\.js$/, "")))
    : new Set();

  for (const e of generated.entries || []) {
    if (e.pageType === "learn") {
      if (!articlesOnDisk.has(e.slug)) err(`generated.json: learn slug "${e.slug}" has no file on disk`);
    } else if (e.pageType === "compare") {
      if (!new RegExp(`slug:\\s*["']${e.slug}["']`).test(compareSrc)) {
        err(`generated.json: compare slug "${e.slug}" not in compare-data.js`);
      }
    } else if (e.pageType === "alternatives") {
      if (!new RegExp(`^\\s*slug:\\s*["']${e.slug}["']`, "m").test(altSrc)) {
        err(`generated.json: alternatives slug "${e.slug}" not in alternatives-data.js`);
      }
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const syncMode = args.includes("--sync");

  const cfg = checkConfig();
  const competitors = readJson(MEM.competitors, "memory/competitors.json");
  const generated = readJson(MEM.generated, "memory/generated.json");
  const gaps = readJson(MEM.gaps, "memory/gaps.json");
  const intent = readJson(MEM.intent, "memory/intent-signals.json");

  checkMemoryShape("competitors.json", competitors, ["competitors"]);
  checkMemoryShape("generated.json", generated, ["entries"]);
  checkMemoryShape("gaps.json", gaps, ["gaps"]);
  checkMemoryShape("intent-signals.json", intent, ["signals"]);

  const clusters = checkClusters(competitors);

  checkGeneratedOnDisk(generated);

  console.log(`[validate-memory] clusters: ${clusters.length}`);
  console.log(`[validate-memory] generated entries: ${generated?.entries?.length ?? 0}`);
  console.log(`[validate-memory] competitors: ${Object.keys(competitors?.competitors || {}).length}`);
  console.log(`[validate-memory] gaps: ${gaps?.gaps?.length ?? 0}`);

  if (warnings.length) {
    console.log(`\n[validate-memory] ${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  warn: ${w}`);
  }
  if (errors.length) {
    console.error(`\n[validate-memory] ${errors.length} error(s):`);
    for (const e of errors) console.error(`  FAIL: ${e}`);
    process.exit(1);
  }
  console.log(`\n[validate-memory] OK`);
}

main();
