#!/usr/bin/env node
// Register a new /compare/<slug> entry.
// Usage: node .seo/scripts/register-compare.mjs <slug> <draft.json>
//
// <draft.json> is the agent's draft object (keys matching .seo/templates/compare.md).
// This script:
//   - Validates required keys
//   - Verifies slug doesn't already exist in compare-data.js
//   - Serializes the draft as a JS object literal (not JSON — proper JS quoting)
//   - Inserts it as a new top-level entry inside the `comparisonEntries` object
//   - Updates generated.json
//
// Does NOT execute any code from the draft — it only string-walks.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const REPO = process.cwd();
const COMPARE_DATA = path.join(REPO, "app/compare/[slug]/compare-data.js");
const GENERATED = path.join(REPO, ".seo/memory/generated.json");
const LOCK_DIR = path.join(REPO, ".seo/memory/.locks");

const REQUIRED = [
  "slug", "competitorName", "competitorDomain", "title", "metaDescription",
  "headline", "subheadline", "summary", "competitorOverview",
  "competitorStrengths", "competitorPricing", "pricingVerdict",
  "features", "deliverability", "useCases", "verdict", "faq",
  "lastUpdated", "sources",
];

function die(m, c = 1) { console.error(`[register-compare] ${m}`); process.exit(c); }

async function withLock(key, fn) {
  fs.mkdirSync(LOCK_DIR, { recursive: true });
  const lockFile = path.join(LOCK_DIR, `${key}.lock`);
  for (let i = 0; i < 50; i++) {
    try {
      fs.writeFileSync(lockFile, JSON.stringify({ pid: process.pid, at: new Date().toISOString() }), { flag: "wx" });
      try { return await fn(); } finally { fs.unlinkSync(lockFile); }
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      await new Promise((r) => setTimeout(r, 100 + Math.floor(Math.random() * 150)));
    }
  }
  die(`could not acquire lock ${key}`);
}

// Serialize a JS value as a JS object literal using JSON shape but keeping
// the shared constant reference for infraboxPricing.
function serialize(value, indent = 2, level = 0) {
  const pad = " ".repeat(indent * level);
  const padInner = " ".repeat(indent * (level + 1));
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => padInner + serialize(v, indent, level + 1));
    return "[\n" + items.join(",\n") + "\n" + pad + "]";
  }
  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";
    const items = keys.map((k) => {
      if (k === "infraboxPricing" && value[k] === "__INFRABOX_PRICING__") {
        return padInner + `${k}: INFRABOX_PRICING`;
      }
      const keyRepr = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
      return padInner + `${keyRepr}: ${serialize(value[k], indent, level + 1)}`;
    });
    return "{\n" + items.join(",\n") + "\n" + pad + "}";
  }
  die(`cannot serialize value of type ${typeof value}`);
}

function validateDraft(draft, slug) {
  for (const k of REQUIRED) {
    if (!(k in draft)) die(`draft missing required key: ${k}`);
  }
  if (draft.slug !== slug) die(`draft.slug (${draft.slug}) must match CLI slug (${slug})`);
  if (!Array.isArray(draft.competitorStrengths) || draft.competitorStrengths.length < 3) {
    die(`competitorStrengths must have >= 3 items`);
  }
  if (!Array.isArray(draft.features) || draft.features.length < 8) {
    die(`features must have >= 8 rows`);
  }
  if (!Array.isArray(draft.faq) || draft.faq.length < 4) {
    die(`faq must have >= 4 questions`);
  }
  if (!Array.isArray(draft.sources) || draft.sources.length < 2) {
    die(`sources must have >= 2 entries`);
  }
}

function atomicWrite(file, content) {
  const tmp = `${file}.tmp.${crypto.randomBytes(6).toString("hex")}`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

function insertEntry(src, slug, entryLiteral) {
  if (new RegExp(`slug:\\s*["']${slug}["']`).test(src)) {
    die(`slug "${slug}" already exists in compare-data.js`);
  }
  const marker = "export const comparisonEntries = {";
  const idx = src.indexOf(marker);
  if (idx === -1) die(`could not find comparisonEntries in compare-data.js`);
  const openIdx = idx + marker.length;
  const insertion = `\n  ${slug}: ${entryLiteral.replace(/\n/g, "\n  ")},`;
  return src.slice(0, openIdx) + insertion + src.slice(openIdx);
}

function updateGenerated(slug) {
  const data = JSON.parse(fs.readFileSync(GENERATED, "utf8"));
  const exists = data.entries.find((e) => e.slug === slug && e.pageType === "compare");
  if (!exists) {
    data.entries.push({
      slug, pageType: "compare", url: `/compare/${slug}`,
      source: "agent-generated", generatedAt: new Date().toISOString(),
      cluster: process.env.SEO_CLUSTER_ID || null, status: "live",
    });
    data._meta.counts.compare = (data._meta.counts.compare || 0) + 1;
    data._meta.counts.total = (data._meta.counts.total || 0) + 1;
  }
  atomicWrite(GENERATED, JSON.stringify(data, null, 2) + "\n");
}

async function main() {
  const slug = process.argv[2];
  const draftPath = process.argv[3];
  if (!slug || !draftPath) die("usage: register-compare.mjs <slug> <draft.json>");
  if (!fs.existsSync(draftPath)) die(`draft not found: ${draftPath}`);
  const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
  validateDraft(draft, slug);

  const literal = serialize(draft, 2, 1);

  await withLock("compare-data", async () => {
    const src = fs.readFileSync(COMPARE_DATA, "utf8");
    const next = insertEntry(src, slug, literal);
    atomicWrite(COMPARE_DATA, next);
    console.log(`[register-compare] ${slug}: inserted`);
  });
  await withLock("generated-json", async () => updateGenerated(slug));
  console.log(`[register-compare] ${slug}: generated.json updated`);
}

main().catch((e) => die(e.stack || e.message));
