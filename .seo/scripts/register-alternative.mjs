#!/usr/bin/env node
// Register a new /alternatives/<slug> entry.
// Usage: node .seo/scripts/register-alternative.mjs <slug> <draft.json>
//
// Same rules as register-compare.mjs, but the target data structure is an
// array (`alternativesEntries`) appended to, not a keyed map.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const REPO = process.cwd();
const ALT_DATA = path.join(REPO, "app/alternatives/[slug]/alternatives-data.js");
const GENERATED = path.join(REPO, ".seo/memory/generated.json");
const LOCK_DIR = path.join(REPO, ".seo/memory/.locks");

const REQUIRED = [
  "slug", "toolName", "toolDomain", "title", "metaDescription",
  "headline", "subheadline", "intro", "whyLook", "alternatives",
  "comparisonTable", "buyerGuide", "faq", "lastUpdated", "sources",
];

function die(m, c = 1) { console.error(`[register-alternative] ${m}`); process.exit(c); }

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

function serialize(value, indent = 2, level = 0) {
  const pad = " ".repeat(indent * level);
  const padInner = " ".repeat(indent * (level + 1));
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => {
      if (v === "__INFRABOX_ALTERNATIVE__") return padInner + "infraboxAlternative";
      return padInner + serialize(v, indent, level + 1);
    });
    return "[\n" + items.join(",\n") + "\n" + pad + "]";
  }
  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";
    const items = keys.map((k) => {
      const keyRepr = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
      return padInner + `${keyRepr}: ${serialize(value[k], indent, level + 1)}`;
    });
    return "{\n" + items.join(",\n") + "\n" + pad + "}";
  }
  die(`cannot serialize value of type ${typeof value}`);
}

function validateDraft(draft, slug) {
  for (const k of REQUIRED) if (!(k in draft)) die(`draft missing required key: ${k}`);
  if (draft.slug !== slug) die(`draft.slug (${draft.slug}) must match CLI slug (${slug})`);
  if (!Array.isArray(draft.alternatives) || draft.alternatives.length < 5) die(`alternatives must have >= 5 entries`);
  if (draft.alternatives[0] !== "__INFRABOX_ALTERNATIVE__" && !draft.alternatives[0]?.isInfrabox) {
    die(`first alternative must be infraboxAlternative (use "__INFRABOX_ALTERNATIVE__" sentinel)`);
  }
  if (!Array.isArray(draft.whyLook) || draft.whyLook.length < 3) die(`whyLook must have >= 3 items`);
  if (!Array.isArray(draft.faq) || draft.faq.length < 4) die(`faq must have >= 4 items`);
  if (!Array.isArray(draft.sources) || draft.sources.length < 2) die(`sources must have >= 2 items`);
}

function atomicWrite(file, content) {
  const tmp = `${file}.tmp.${crypto.randomBytes(6).toString("hex")}`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

function insertEntry(src, slug, literal) {
  // Check the slug isn't already present as a top-level alternativesEntries array element.
  if (new RegExp(`^\\s*slug:\\s*["']${slug}["']`, "m").test(src)) {
    die(`slug "${slug}" may already exist — manual review required`);
  }
  const marker = "export const alternativesEntries = [";
  const idx = src.indexOf(marker);
  if (idx === -1) die(`could not find alternativesEntries array in alternatives-data.js`);
  const openIdx = idx + marker.length;
  const insertion = "\n  " + literal.replace(/\n/g, "\n  ") + ",";
  return src.slice(0, openIdx) + insertion + src.slice(openIdx);
}

function updateGenerated(slug) {
  const data = JSON.parse(fs.readFileSync(GENERATED, "utf8"));
  const exists = data.entries.find((e) => e.slug === slug && e.pageType === "alternatives");
  if (!exists) {
    data.entries.push({
      slug, pageType: "alternatives", url: `/alternatives/${slug}`,
      source: "agent-generated", generatedAt: new Date().toISOString(),
      cluster: process.env.SEO_CLUSTER_ID || null, status: "live",
    });
    data._meta.counts.alternatives = (data._meta.counts.alternatives || 0) + 1;
    data._meta.counts.total = (data._meta.counts.total || 0) + 1;
  }
  atomicWrite(GENERATED, JSON.stringify(data, null, 2) + "\n");
}

async function main() {
  const slug = process.argv[2];
  const draftPath = process.argv[3];
  if (!slug || !draftPath) die("usage: register-alternative.mjs <slug> <draft.json>");
  if (!fs.existsSync(draftPath)) die(`draft not found: ${draftPath}`);
  const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
  validateDraft(draft, slug);
  const literal = serialize(draft, 2, 1);
  await withLock("alternatives-data", async () => {
    const src = fs.readFileSync(ALT_DATA, "utf8");
    const next = insertEntry(src, slug, literal);
    atomicWrite(ALT_DATA, next);
    console.log(`[register-alternative] ${slug}: inserted`);
  });
  await withLock("generated-json", async () => updateGenerated(slug));
  console.log(`[register-alternative] ${slug}: generated.json updated`);
}

main().catch((e) => die(e.stack || e.message));
