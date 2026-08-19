// /llms-full.txt — full extractable text of Infrabox's content corpus for LLM
// ingestion (so models can cite us without crawling every page). Generated at
// build time from the same data that renders the pages, so it never goes stale.
// The lightweight index lives at /llms.txt; this is the long-form companion.
import { getAllLearnArticles } from '@/app/learn/[slug]/learn-data';

export const dynamic = 'force-static';

const BASE = 'https://www.infrabox.software';

// Lazy requires — these data modules may not all exist in every build context,
// mirroring how app/sitemap.js guards them.
function safe(loader) {
  try { return loader(); } catch { return []; }
}

function learnSection() {
  const articles = safe(() => getAllLearnArticles());
  if (!articles.length) return '';
  let out = '# Learn Articles (full text)\n\n';
  for (const a of articles) {
    out += `## ${a.headline || a.title}\n`;
    out += `URL: ${BASE}/learn/${a.slug}\n`;
    if (a.category) out += `Category: ${a.category}\n`;
    if (a.author) out += `Author: ${a.author}\n`;
    if (a.updatedAt) out += `Last updated: ${a.updatedAt}\n`;
    if (a.metaDescription) out += `\n${a.metaDescription}\n`;
    for (const s of a.sections || []) {
      out += `\n### ${s.heading}\n${s.content}\n`;
    }
    if (a.faqs?.length) {
      out += `\n### FAQ\n`;
      for (const f of a.faqs) out += `**${f.question}**\n${f.answer}\n\n`;
    }
    out += `\n---\n\n`;
  }
  return out;
}

function comparisonSection() {
  let out = '';

  // Alternatives listicles
  const altEntries = safe(() => {
    const { getAllAlternativesSlugs, getAlternativesEntry } = require('@/app/alternatives/[slug]/alternatives-data');
    return getAllAlternativesSlugs().map((slug) => ({ slug, e: getAlternativesEntry(slug) }));
  });
  if (altEntries.length) {
    out += '# Alternatives Pages\n\n';
    for (const { slug, e } of altEntries) {
      if (!e) continue;
      out += `## ${e.title}\nURL: ${BASE}/alternatives/${slug}\n`;
      if (e.metaDescription) out += `\n${e.metaDescription}\n`;
      for (const f of e.faqs || []) out += `\n**${f.question}**\n${f.answer}\n`;
      out += `\n---\n\n`;
    }
  }

  // Head-to-head /compare pages
  const cmpEntries = safe(() => {
    const { getAllComparisonSlugs, getComparisonEntry } = require('@/app/compare/[slug]/compare-data');
    return getAllComparisonSlugs().map((slug) => ({ slug, e: getComparisonEntry(slug) }));
  });
  if (cmpEntries.length) {
    out += '# Comparison Pages (Infrabox vs …)\n\n';
    for (const { slug, e } of cmpEntries) {
      if (!e) continue;
      out += `## ${e.title || e.headline}\nURL: ${BASE}/compare/${slug}\n`;
      if (e.summary) out += `\n${e.summary}\n`;
      else if (e.metaDescription) out += `\n${e.metaDescription}\n`;
      for (const f of e.faqs || []) out += `\n**${f.question}**\n${f.answer}\n`;
      out += `\n---\n\n`;
    }
  }

  // "<competitor>-vs-infrabox" landing pages
  const vsEntries = safe(() => {
    const { getAllVsSlugs, getVsEntry } = require('@/app/alternatives/_vs/vs-data');
    return getAllVsSlugs().map((slug) => ({ slug, e: getVsEntry(slug) }));
  });
  if (vsEntries.length) {
    out += '# Head-to-Head Landing Pages\n\n';
    for (const { slug, e } of vsEntries) {
      if (!e) continue;
      out += `## ${e.pageTitle}\nURL: ${BASE}/alternatives/${slug}\n`;
      if (e.pageDescription) out += `\n${e.pageDescription}\n`;
      for (const f of e.faqs || []) out += `\n**${f.question}**\n${f.answer}\n`;
      out += `\n---\n\n`;
    }
  }

  return out;
}

export async function GET() {
  const body =
    `# Infrabox — Full Content (llms-full.txt)\n\n` +
    `> Long-form, full-text export of Infrabox's learn articles and comparison pages for ` +
    `LLM ingestion and citation. The concise index is at ${BASE}/llms.txt. ` +
    `Infrabox provides US-IP Google Workspace and Microsoft 365 mailboxes from $2.50/mailbox/mo ` +
    `(Enterprise annual), automated DNS, isolated warmup, InfraGuard monitoring, and 24+ sequencer integrations.\n\n` +
    `---\n\n` +
    learnSection() +
    comparisonSection();

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
