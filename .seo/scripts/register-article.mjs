#!/usr/bin/env node
// Safely register a new learn article in learn-data.js.
// Usage: node .seo/scripts/register-article.mjs <slug>
//
// Assumes:
//   - The article file already exists at app/learn/[slug]/articles/<slug>.js
//   - The article file exports `const article = { ... }` (checked)
//
// This script:
//   - Validates the article file exists and has the expected shape
//   - Adds the import line in learn-data.js if missing
//   - Adds the map entry in the articles object in learn-data.js if missing
//   - Updates .seo/memory/generated.json
//   - Writes atomically (temp + rename) with a simple file lock
//
// Agents MUST call this instead of editing learn-data.js directly.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const REPO = process.cwd();
const LEARN_DATA = path.join(REPO, "app/learn/[slug]/learn-data.js");
const ARTICLES_DIR = path.join(REPO, "app/learn/[slug]/articles");
const GENERATED = path.join(REPO, ".seo/memory/generated.json");
const LOCK_DIR = path.join(REPO, ".seo/memory/.locks");

function die(msg, code = 1) {
  console.error(`[register-article] ${msg}`);
  process.exit(code);
}

function slugToIdent(slug) {
  return slug.replace(/-/g, "_");
}

async function withLock(key, fn) {
  fs.mkdirSync(LOCK_DIR, { recursive: true });
  const lockFile = path.join(LOCK_DIR, `${key}.lock`);
  const lockPayload = JSON.stringify({ pid: process.pid, at: new Date().toISOString() });
  for (let i = 0; i < 50; i++) {
    try {
      fs.writeFileSync(lockFile, lockPayload, { flag: "wx" });
      try { return await fn(); } finally { fs.unlinkSync(lockFile); }
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
      await new Promise((r) => setTimeout(r, 100 + Math.floor(Math.random() * 150)));
    }
  }
  die(`could not acquire lock ${key} after 50 attempts — stale lock? check ${lockFile}`);
}

function validateArticleFile(slug) {
  const file = path.join(ARTICLES_DIR, `${slug}.js`);
  if (!fs.existsSync(file)) die(`article file not found: ${path.relative(REPO, file)}`);
  const src = fs.readFileSync(file, "utf8");
  if (!/export\s+const\s+article\s*=/.test(src)) die(`${slug}.js must export 'const article'`);
  const requiredKeys = ["slug", "title", "metaDescription", "headline", "publishedAt", "sections"];
  for (const key of requiredKeys) {
    if (!new RegExp(`\\b${key}\\s*:`).test(src)) {
      die(`${slug}.js is missing required key: ${key}`);
    }
  }
  const slugMatch = src.match(/slug:\s*["']([^"']+)["']/);
  if (!slugMatch) die(`${slug}.js missing slug field`);
  if (slugMatch[1] !== slug) die(`slug field (${slugMatch[1]}) does not match filename (${slug})`);
  return file;
}

function insertImport(src, slug) {
  const ident = slugToIdent(slug);
  const importLine = `import { article as ${ident} } from './articles/${slug}.js';`;
  if (src.includes(importLine)) return { src, added: false };
  const importBlock = src.match(/^(import[^;]+;\s*)+/m);
  if (!importBlock) die(`no import block in learn-data.js`);
  const insertAt = importBlock.index + importBlock[0].length;
  return {
    src: src.slice(0, insertAt) + importLine + "\n" + src.slice(insertAt),
    added: true,
  };
}

function insertMapEntry(src, slug) {
  const ident = slugToIdent(slug);
  const entry = `  "${slug}": ${ident},`;
  if (src.includes(`"${slug}":`) || src.includes(`'${slug}':`)) return { src, added: false };
  const mapOpen = src.match(/(?:export\s+)?const\s+\w*[aA]rticles\w*\s*=\s*\{/);
  if (!mapOpen) die(`could not find articles map in learn-data.js`);
  const openIdx = mapOpen.index + mapOpen[0].length;
  return {
    src: src.slice(0, openIdx) + "\n" + entry + src.slice(openIdx),
    added: true,
  };
}

function atomicWrite(file, content) {
  const tmp = `${file}.tmp.${crypto.randomBytes(6).toString("hex")}`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

function updateGenerated(slug) {
  const data = JSON.parse(fs.readFileSync(GENERATED, "utf8"));
  const exists = data.entries.find((e) => e.slug === slug && e.pageType === "learn");
  if (exists) {
    exists.status = "live";
    exists.updatedAt = new Date().toISOString();
  } else {
    data.entries.push({
      slug,
      pageType: "learn",
      url: `/learn/${slug}`,
      source: "agent-generated",
      generatedAt: new Date().toISOString(),
      cluster: process.env.SEO_CLUSTER_ID || null,
      status: "live",
    });
    data._meta.counts.learn = (data._meta.counts.learn || 0) + 1;
    data._meta.counts.total = (data._meta.counts.total || 0) + 1;
  }
  atomicWrite(GENERATED, JSON.stringify(data, null, 2) + "\n");
}

async function main() {
  const slug = process.argv[2];
  if (!slug) die("usage: register-article.mjs <slug>");

  validateArticleFile(slug);

  await withLock("learn-data", async () => {
    const src = fs.readFileSync(LEARN_DATA, "utf8");
    let next = src;
    const a = insertImport(next, slug); next = a.src;
    const b = insertMapEntry(next, slug); next = b.src;
    if (a.added || b.added) {
      atomicWrite(LEARN_DATA, next);
      console.log(`[register-article] ${slug}: import=${a.added} map=${b.added}`);
    } else {
      console.log(`[register-article] ${slug}: already registered`);
    }
  });

  await withLock("generated-json", async () => updateGenerated(slug));
  console.log(`[register-article] ${slug}: generated.json updated`);
}

main().catch((e) => die(e.stack || e.message));
