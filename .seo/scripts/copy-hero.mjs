#!/usr/bin/env node
// Copy a scraped screenshot from .seo/runs/ into public/ with deterministic naming.
// Usage:
//   node .seo/scripts/copy-hero.mjs <src> <pageType> <slug> [<variant>]
//
// Examples:
//   node .seo/scripts/copy-hero.mjs .seo/runs/2026-04-11-scrape/gmass/home-hero.webp alternatives gmass
//   node .seo/scripts/copy-hero.mjs .seo/runs/2026-04-11-scrape/gmass/home-hero.webp alternatives gmass gmass-co
//   node .seo/scripts/copy-hero.mjs .seo/runs/2026-04-11-seo/infrabox-hero.webp compare mailforge-vs-instantly
//   node .seo/scripts/copy-hero.mjs .seo/runs/2026-04-11-seo/dash-01.webp learn dmarc-failed-gmail-fix 01
//
// Page type -> destination rules:
//   compare       -> public/compare/<slug>-hero.webp (or -<variant>.webp if variant is "infrabox")
//   alternatives  -> public/alternatives/<slug>-<variant>.webp  (variant required, usually tool domain slugified)
//   learn         -> public/learn/<slug>-<variant>.webp         (variant is the step number, e.g. "01")
//
// This script is idempotent: if the destination already exists with identical content, it's a no-op.
// It never deletes the source.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const REPO = process.cwd();

function die(m, c = 1) { console.error(`[copy-hero] ${m}`); process.exit(c); }

function hash(file) {
  return crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex");
}

function destFor(pageType, slug, variant) {
  const safe = s => String(s).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  const s = safe(slug);
  switch (pageType) {
    case "compare":
      return variant
        ? path.join(REPO, `public/compare/${s}-${safe(variant)}.webp`)
        : path.join(REPO, `public/compare/${s}-hero.webp`);
    case "alternatives":
      if (!variant) die(`alternatives requires a variant (tool domain or name)`);
      return path.join(REPO, `public/alternatives/${s}-${safe(variant)}.webp`);
    case "learn":
      if (!variant) die(`learn requires a variant (step number like "01")`);
      return path.join(REPO, `public/learn/${s}-${safe(variant)}.webp`);
    default:
      die(`unknown pageType: ${pageType}`);
  }
}

function main() {
  const [src, pageType, slug, variant] = process.argv.slice(2);
  if (!src || !pageType || !slug) die(`usage: copy-hero.mjs <src> <pageType> <slug> [<variant>]`);
  if (!fs.existsSync(src)) die(`source file not found: ${src}`);

  const dest = destFor(pageType, slug, variant);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (fs.existsSync(dest)) {
    try {
      if (hash(src) === hash(dest)) {
        console.log(`[copy-hero] no-op (identical): ${path.relative(REPO, dest)}`);
        return;
      }
    } catch {}
  }

  const tmp = `${dest}.tmp.${crypto.randomBytes(6).toString("hex")}`;
  fs.copyFileSync(src, tmp);
  fs.renameSync(tmp, dest);
  console.log(`[copy-hero] ${path.relative(REPO, src)} -> ${path.relative(REPO, dest)}`);
}

main();
