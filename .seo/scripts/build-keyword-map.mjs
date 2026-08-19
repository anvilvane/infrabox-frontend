#!/usr/bin/env node
// build-keyword-map.mjs
// Builds an in-memory map { normalizedQuery → [{ slug, pageType, cluster, rawQuery, title }] }
// Data sources:
//   1. .seo/memory/generated.json — every live slug
//   2. app/learn/[slug]/articles/*.js — each article's `slug` and `title`
//   3. app/compare/[slug]/compare-data.js — compare page titles
//   4. app/alternatives/[slug]/alternatives-data.js — alternatives titles
//   5. .seo/clusters/*.json — cluster-level head/semantic keywords mapped to slug lists
//
// Normalization:
//   - lowercase, strip punctuation, collapse whitespace
//   - remove year suffixes (2024|2025|2026)
//   - drop stopwords: best, top, the, a, an, of, for, in, to
//
// Near-match: Jaccard over 3-char-grams of space-separated tokens.
//
// Read-only. Prints JSON to stdout when run directly. Also exports the helpers.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const STOPWORDS = new Set([
  'best', 'top', 'the', 'a', 'an', 'of', 'for', 'in', 'to',
  'and', 'or', 'with', 'vs', 'versus', 'is', 'on', 'by',
  'guide', 'guides', 'tools', 'tool', 'software', 'platforms', 'platform',
  'service', 'services', 'solution', 'solutions',
]);
const YEAR_RE = /\b(20\d{2})\b/g;

export function normalizeQuery(raw) {
  if (!raw) return '';
  return String(raw)
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(YEAR_RE, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !STOPWORDS.has(t))
    .sort()
    .join(' ')
    .trim();
}

// For near-match, use token-multiset jaccard (order-insensitive) so "mailforge pricing" and "pricing mailforge" match.
export function tokenize(raw) {
  return normalizeQuery(raw).split(' ').filter(Boolean);
}

export function jaccardTokens(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const uni = A.size + B.size - inter;
  return uni === 0 ? 0 : inter / uni;
}

function readArticleMeta(filePath) {
  try {
    const src = fs.readFileSync(filePath, 'utf8');
    const slugMatch = src.match(/slug:\s*["'`]([^"'`]+)["'`]/);
    const titleMatch = src.match(/title:\s*\n?\s*["'`]([^"'`]+)["'`]/) || src.match(/title:\s*["'`]([^"'`]+)["'`]/);
    const metaMatch = src.match(/metaDescription:\s*\n?\s*["'`]([^"'`]+)["'`]/) || src.match(/metaDescription:\s*["'`]([^"'`]+)["'`]/);
    return {
      slug: slugMatch?.[1] || path.basename(filePath, '.js'),
      title: titleMatch?.[1] || '',
      metaDescription: metaMatch?.[1] || '',
      _raw: src,
    };
  } catch (e) {
    return null;
  }
}

function readDataFileObjects(filePath) {
  // Parse a data file. Supports two shapes:
  //   (A) object map keyed by slug     → `  slug: { title: "..." }`
  //   (B) array of entries with slug   → `    slug: "apollo", title: "..."`
  try {
    const src = fs.readFileSync(filePath, 'utf8');
    const entries = [];

    // Shape B: `slug: "xyz"` lines (array-entry style)
    const slugLineRe = /slug:\s*["'`]([a-z0-9][a-z0-9-]*)["'`]/g;
    const slugHits = [];
    let m;
    while ((m = slugLineRe.exec(src)) !== null) slugHits.push({ slug: m[1], idx: m.index });
    if (slugHits.length > 0) {
      for (let i = 0; i < slugHits.length; i++) {
        const start = slugHits[i].idx;
        const end = i + 1 < slugHits.length ? slugHits[i + 1].idx : Math.min(src.length, start + 3000);
        const slice = src.slice(start, end);
        const titleMatch = slice.match(/title:\s*["'`]([^"'`]+)["'`]/);
        const heroMatch = slice.match(/(?:headline|heroTitle|h1):\s*["'`]([^"'`]+)["'`]/);
        const metaMatch = slice.match(/(?:metaDescription|description):\s*["'`]([^"'`]+)["'`]/);
        entries.push({
          slug: slugHits[i].slug,
          title: titleMatch?.[1] || '',
          headline: heroMatch?.[1] || '',
          metaDescription: metaMatch?.[1] || '',
        });
      }
      return entries;
    }

    // Shape A fallback: object keyed by slug
    const keyRe = /^\s{2}["']?([a-z0-9][a-z0-9-]*)["']?\s*:\s*\{/gm;
    const keys = [];
    while ((m = keyRe.exec(src)) !== null) keys.push({ slug: m[1], idx: m.index });
    for (let i = 0; i < keys.length; i++) {
      const start = keys[i].idx;
      const end = i + 1 < keys.length ? keys[i + 1].idx : src.length;
      const slice = src.slice(start, end);
      const titleMatch = slice.match(/title:\s*["'`]([^"'`]+)["'`]/);
      const heroMatch = slice.match(/(?:h1|headline|heroTitle):\s*["'`]([^"'`]+)["'`]/);
      const metaMatch = slice.match(/(?:metaDescription|description):\s*["'`]([^"'`]+)["'`]/);
      entries.push({
        slug: keys[i].slug,
        title: titleMatch?.[1] || '',
        headline: heroMatch?.[1] || '',
        metaDescription: metaMatch?.[1] || '',
      });
    }
    return entries;
  } catch (e) {
    return [];
  }
}

export function collectAllEntries() {
  const entries = [];

  // Learn articles
  const learnDir = path.join(ROOT, 'app/learn/[slug]/articles');
  if (fs.existsSync(learnDir)) {
    for (const f of fs.readdirSync(learnDir)) {
      if (!f.endsWith('.js')) continue;
      const full = path.join(learnDir, f);
      const meta = readArticleMeta(full);
      if (!meta) continue;
      entries.push({
        slug: meta.slug,
        pageType: 'learn',
        title: meta.title,
        metaDescription: meta.metaDescription,
        file: full,
      });
    }
  }

  // Compare
  const compareData = path.join(ROOT, 'app/compare/[slug]/compare-data.js');
  if (fs.existsSync(compareData)) {
    const seen = new Set();
    for (const e of readDataFileObjects(compareData)) {
      if (seen.has(e.slug)) continue;
      seen.add(e.slug);
      entries.push({
        slug: e.slug,
        pageType: 'compare',
        title: e.title || e.headline,
        metaDescription: e.metaDescription,
        file: compareData,
      });
    }
  }

  // Alternatives
  const altData = path.join(ROOT, 'app/alternatives/[slug]/alternatives-data.js');
  if (fs.existsSync(altData)) {
    const seen = new Set();
    for (const e of readDataFileObjects(altData)) {
      if (seen.has(e.slug)) continue;
      seen.add(e.slug);
      entries.push({
        slug: e.slug,
        pageType: 'alternatives',
        title: e.title || e.headline,
        metaDescription: e.metaDescription,
        file: altData,
      });
    }
  }

  // Attach cluster membership from cluster files
  const clusterDir = path.join(ROOT, '.seo/clusters');
  const bySlug = new Map(entries.map((e) => [e.slug + '::' + e.pageType, e]));
  const clusters = [];
  if (fs.existsSync(clusterDir)) {
    for (const f of fs.readdirSync(clusterDir)) {
      if (!f.endsWith('.json')) continue;
      const c = JSON.parse(fs.readFileSync(path.join(clusterDir, f), 'utf8'));
      clusters.push(c);
      const slugs = Array.isArray(c.slugs) ? c.slugs : [];
      for (const s of slugs) {
        // pageType inferred from cluster.pageType
        const key = s + '::' + (c.pageType || 'learn');
        const e = bySlug.get(key) || bySlug.get(s + '::learn') || bySlug.get(s + '::compare') || bySlug.get(s + '::alternatives');
        if (e) e.cluster = c.id;
      }
    }
  }

  return { entries, clusters };
}

export function buildQueryMap({ entries, clusters }) {
  const map = new Map(); // normalizedQuery → [entry]
  const rawQueries = []; // {norm, raw, slug, pageType, source}

  const push = (raw, entry, source) => {
    const norm = normalizeQuery(raw);
    if (!norm || norm.split(' ').length < 2) return; // skip single-token / empty
    if (!map.has(norm)) map.set(norm, []);
    const arr = map.get(norm);
    // dedupe by slug+pageType
    if (!arr.find((x) => x.slug === entry.slug && x.pageType === entry.pageType)) {
      arr.push({ slug: entry.slug, pageType: entry.pageType, cluster: entry.cluster || null, rawQuery: raw, source, title: entry.title });
    }
    rawQueries.push({ norm, raw, slug: entry.slug, pageType: entry.pageType });
  };

  for (const e of entries) {
    // Source 1: slug itself (the strongest signal since URL is what Google indexes)
    push(e.slug.replace(/-/g, ' '), e, 'slug');
    // Source 2: title
    if (e.title) push(e.title, e, 'title');
  }

  // Source 3: cluster head keywords → map to each slug in that cluster
  for (const c of clusters) {
    const slugs = Array.isArray(c.slugs) ? c.slugs : [];
    const heads = Array.isArray(c.headKeywords) ? c.headKeywords : [];
    for (const slug of slugs) {
      const e = entries.find((x) => x.slug === slug);
      if (!e) continue;
      for (const hk of heads) push(hk, e, 'cluster-head:' + c.id);
    }
  }

  return { map, rawQueries };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = collectAllEntries();
  const { map } = buildQueryMap(data);
  const collisions = [];
  for (const [norm, arr] of map.entries()) {
    if (arr.length > 1) collisions.push({ normalizedQuery: norm, entries: arr });
  }
  const out = {
    _meta: {
      totalEntries: data.entries.length,
      totalClusters: data.clusters.length,
      totalNormalizedQueries: map.size,
      exactCollisions: collisions.length,
    },
    collisions,
  };
  process.stdout.write(JSON.stringify(out, null, 2));
}
