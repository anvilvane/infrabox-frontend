#!/usr/bin/env node
// Independent post-fix validation. Walks every layout.js under app/ and every
// /learn article file, extracts the first title field, applies " | Infrabox"
// (since the root layout's title.template does that), and flags:
//   - final length > 60
//   - "Infrabox | Infrabox" (any double-suffix that survived)
//   - U+FFFD glyphs (encoding-replacement chars)
//   - obvious metadata-export breakage (no `metadata` export or no title field)
//
// Run from the project root: `node .seo/scripts/validate-seo-titles.mjs`

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SUFFIX = " | Infrabox";
const MAX = 60;

const overLen = [];
const doubleSuffix = [];
const badChars = [];
const noTitle = [];
const noMetadata = [];

function walk(dir, hits, predicate) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, hits, predicate);
    else if (predicate(entry, full)) hits.push(full);
  }
}

function extractFirstTitleValue(content) {
  const i = content.indexOf("title:");
  if (i < 0) return null;
  let k = i + "title:".length;
  while (k < content.length && /\s/.test(content[k])) k++;
  const q = content[k];
  if (q !== '"' && q !== "'" && q !== "`") return null;
  let m = k + 1;
  let val = "";
  while (m < content.length && content[m] !== q) {
    if (content[m] === "\\" && m + 1 < content.length) {
      val += content[m + 1];
      m += 2;
      continue;
    }
    val += content[m];
    m += 1;
  }
  if (m >= content.length) return null;
  return val.replace(/\$\{config\.appName\}/g, "Infrabox");
}

function check(file, rawValue, applySuffix) {
  const final = applySuffix ? rawValue + SUFFIX : rawValue;
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (final.length > MAX) overLen.push({ file: rel, final, len: final.length });
  if (/\|\s*Infrabox\s*\|\s*Infrabox/i.test(final)) doubleSuffix.push({ file: rel, final });
  if (/�/.test(rawValue)) badChars.push({ file: rel, raw: rawValue });
}

// --- layouts -------------------------------------------------------------
const layouts = [];
walk(path.join(ROOT, "app"), layouts, (entry) => entry.isFile() && entry.name === "layout.js");
for (const p of layouts) {
  const content = fs.readFileSync(p, "utf8");
  const rel = path.relative(ROOT, p).replace(/\\/g, "/");
  if (rel === "app/layout.js") continue; // root layout owns title.default/template
  if (!/export\s+(const|async\s+function|function|let)\s+metadata/.test(content)
      && !/export\s+\{[^}]*\bmetadata\b/.test(content)
      && !/metadata\s*=\s*getSEOTags/.test(content)
      && !/metadata\s*=\s*generatePageMetadata/.test(content)
      && !/metadata\s*=\s*\{/.test(content)) {
    noMetadata.push({ file: rel });
    continue;
  }
  const val = extractFirstTitleValue(content);
  if (val === null) { noTitle.push({ file: rel }); continue; }
  check(p, val, true);
}

// --- /learn articles -----------------------------------------------------
const articlesDir = path.join(ROOT, "app", "learn", "[slug]", "articles");
const articles = [];
walk(articlesDir, articles, (entry) => entry.isFile() && entry.name.endsWith(".js"));
for (const p of articles) {
  const content = fs.readFileSync(p, "utf8");
  const val = extractFirstTitleValue(content);
  if (val === null) { noTitle.push({ file: path.relative(ROOT, p).replace(/\\/g, "/") }); continue; }
  check(p, val, true);
}

// --- /compare/[slug] entries --------------------------------------------
const compareData = path.join(ROOT, "app", "compare", "[slug]", "compare-data.js");
if (fs.existsSync(compareData)) {
  const content = fs.readFileSync(compareData, "utf8");
  // Iterate over each `slug: "..."` block and grab the title after it.
  const re = /slug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content))) {
    const slugName = m[1];
    const slice = content.slice(m.index);
    const val = extractFirstTitleValue(slice);
    if (val === null) continue;
    check(`${compareData}#${slugName}`, val, true);
  }
}

const out = {
  totalLayouts: layouts.length,
  totalArticles: articles.length,
  overLengthCount: overLen.length,
  doubleSuffixCount: doubleSuffix.length,
  badCharsCount: badChars.length,
  noTitleCount: noTitle.length,
  noMetadataCount: noMetadata.length,
};
console.log(JSON.stringify(out, null, 2));
if (overLen.length)      { console.log("\nOVER LENGTH:");    for (const x of overLen)      console.log(`  - [${x.len}] ${x.file}: ${x.final}`); }
if (doubleSuffix.length) { console.log("\nDOUBLE SUFFIX:");  for (const x of doubleSuffix) console.log(`  - ${x.file}: ${x.final}`); }
if (badChars.length)     { console.log("\nBAD CHARS:");      for (const x of badChars)     console.log(`  - ${x.file}: ${x.raw}`); }
if (noTitle.length)      { console.log("\nNO TITLE:");       for (const x of noTitle)      console.log(`  - ${x.file}`); }
if (noMetadata.length)   { console.log("\nNO METADATA:");    for (const x of noMetadata)   console.log(`  - ${x.file}`); }
