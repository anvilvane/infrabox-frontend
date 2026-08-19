#!/usr/bin/env node
// Independent meta-description validator. Walks every article/layout/page
// fresh from disk and checks:
//   - length 120–170 (warn outside 145–160)
//   - uniqueness across the whole site
//   - no malformed encoding chars (U+FFFD)
// Also simulates the templated /partners/[slug] description from the
// partners/data.js file so partner pages are validated end-to-end.
//
// Run from the project root: `node .seo/scripts/validate-seo-meta-descriptions.mjs`

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const MIN_LEN = 120;
const MAX_LEN = 170;
const IDEAL_MIN = 145;
const IDEAL_MAX = 160;

function walk(dir, hits, predicate) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, hits, predicate);
    else if (predicate(entry, full)) hits.push(full);
  }
}

function extractFirstField(content, fieldName) {
  const marker = `${fieldName}:`;
  const idx = content.indexOf(marker);
  if (idx < 0) return null;
  let i = idx + marker.length;
  while (i < content.length && /\s/.test(content[i])) i++;
  const q = content[i];
  if (q !== '"' && q !== "'" && q !== "`") return null;
  let j = i + 1;
  let val = "";
  while (j < content.length && content[j] !== q) {
    if (content[j] === "\\" && j + 1 < content.length) {
      val += content[j + 1];
      j += 2;
      continue;
    }
    val += content[j];
    j += 1;
  }
  if (j >= content.length) return null;
  return val;
}

// Find where the page/layout's actual metadata definition starts, so we don't
// accidentally grab a `description:` from a feature array that happens to
// appear before the metadata export.
function findMetadataBlockStart(content) {
  const patterns = [
    "export const metadata = {",
    "export const metadata = getSEOTags(",
    "export const metadata = generatePageMetadata(",
  ];
  for (const pat of patterns) {
    const idx = content.indexOf(pat);
    if (idx >= 0) return idx + pat.length;
  }
  return -1;
}

function extractMetadataDescription(content) {
  const startIdx = findMetadataBlockStart(content);
  if (startIdx < 0) return null;
  return extractFirstField(content.slice(startIdx), "description");
}

const collected = []; // { source, kind, value }

// /learn articles
const articlesDir = path.join(ROOT, "app", "learn", "[slug]", "articles");
if (fs.existsSync(articlesDir)) {
  const articles = [];
  walk(articlesDir, articles, (e) => e.isFile() && e.name.endsWith(".js"));
  for (const p of articles) {
    const val = extractFirstField(fs.readFileSync(p, "utf8"), "metaDescription");
    if (val == null) continue;
    collected.push({
      source: path.relative(ROOT, p).replace(/\\/g, "/"),
      kind: "article",
      value: val,
    });
  }
}

// Layouts + page.js (excluding admin/* — not indexed)
const layouts = [];
walk(path.join(ROOT, "app"), layouts, (e) => e.isFile() && (e.name === "layout.js" || e.name === "page.js"));
for (const p of layouts) {
  const rel = path.relative(ROOT, p).replace(/\\/g, "/");
  if (rel.startsWith("app/admin/")) continue;
  const val = extractMetadataDescription(fs.readFileSync(p, "utf8"));
  if (val == null || val === "") continue;
  collected.push({ source: rel, kind: "layout/page", value: val });
}

// /compare/[slug] data file entries
const compareData = path.join(ROOT, "app", "compare", "[slug]", "compare-data.js");
if (fs.existsSync(compareData)) {
  const content = fs.readFileSync(compareData, "utf8");
  const re = /slug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content))) {
    const slice = content.slice(m.index);
    const val = extractFirstField(slice, "metaDescription");
    if (val == null) continue;
    collected.push({ source: `app/compare/[slug]/compare-data.js#${m[1]}`, kind: "compare", value: val });
  }
}

// /partners/[slug] — simulate the templated meta description.
const partnersData = path.join(ROOT, "app", "partners", "data.js");
if (fs.existsSync(partnersData)) {
  const content = fs.readFileSync(partnersData, "utf8");
  for (const line of content.split("\n")) {
    const nm = line.match(/^\s*\{\s*name:'([^']+)'/);
    if (!nm) continue;
    const tg = line.match(/tagline:'([^']*)'/);
    const lc = line.match(/location:'([^']*)'/);
    if (!tg || !lc) continue;
    const rendered = `${tg[1]} Book a meeting with ${nm[1]}, a certified Infrabox partner based in ${lc[1]}.`;
    collected.push({ source: `partner:${nm[1]}`, kind: "partner", value: rendered });
  }
}

// Validate
const tooShort = [];
const tooLong = [];
const badChars = [];
const outsideIdeal = [];
for (const c of collected) {
  if (c.value.length < MIN_LEN) tooShort.push({ ...c, len: c.value.length });
  else if (c.value.length > MAX_LEN) tooLong.push({ ...c, len: c.value.length });
  else if (c.value.length < IDEAL_MIN || c.value.length > IDEAL_MAX) outsideIdeal.push({ ...c, len: c.value.length });
  if (/�/.test(c.value)) badChars.push(c);
}

const byValue = new Map();
for (const c of collected) {
  if (!byValue.has(c.value)) byValue.set(c.value, []);
  byValue.get(c.value).push(c);
}
const duplicates = [...byValue.entries()].filter(([_, ss]) => ss.length > 1).map(([value, sources]) => ({ value, sources }));

console.log(JSON.stringify({
  totalChecked: collected.length,
  byKind: collected.reduce((acc, c) => { acc[c.kind] = (acc[c.kind] || 0) + 1; return acc; }, {}),
  tooShortCount: tooShort.length,
  tooLongCount: tooLong.length,
  badCharsCount: badChars.length,
  duplicatesCount: duplicates.length,
  outsideIdealCount: outsideIdeal.length,
}, null, 2));

if (tooShort.length) { console.log("\nTOO SHORT (<120):"); for (const x of tooShort) console.log(`  - [${x.len}] [${x.kind}] ${x.source}: ${x.value}`); }
if (tooLong.length)  { console.log("\nTOO LONG (>170):");  for (const x of tooLong)  console.log(`  - [${x.len}] [${x.kind}] ${x.source}: ${x.value}`); }
if (badChars.length) { console.log("\nBAD CHARS:");        for (const x of badChars) console.log(`  - [${x.kind}] ${x.source}: ${x.value}`); }
if (duplicates.length) {
  console.log("\nDUPLICATES:");
  for (const d of duplicates) {
    console.log(`  - [${d.value.length}] "${d.value.slice(0, 80)}..."`);
    for (const s of d.sources) console.log(`      • [${s.kind}] ${s.source}`);
  }
}
