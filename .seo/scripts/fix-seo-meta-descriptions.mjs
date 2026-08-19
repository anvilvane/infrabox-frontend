#!/usr/bin/env node
// One-shot meta-description fixer.
// Run from the project root: `node .seo/scripts/fix-seo-meta-descriptions.mjs`
//
// What it does:
//   1. Rewrites `metaDescription` for /learn/* article files.
//   2. Rewrites `description` for layout.js / page.js root files.
//   3. Rewrites taglines for short partners in app/partners/data.js
//      (the /partners/[slug] meta description is templated from `tagline`,
//      so lengthening the tagline lengthens the meta description naturally).
//   4. Bundled fix for /authors: changes `title: "Our Team | Infrabox"` →
//      `title: "Our Team"` (the root layout's title.template appends
//      " | Infrabox" — the old value was double-suffixing).
//
// Validation:
//   - Every meta description must be 120–170 chars (warn outside 145–160).
//   - Every meta description must be unique across the entire site.
//   - Files must remain valid JS.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const MIN_LEN = 120;
const MAX_LEN = 170;
const IDEAL_MIN = 145;
const IDEAL_MAX = 160;

const updates = [];
const errors = [];
const warnings = [];

// ---------------------------------------------------------------------------
// 1. /learn/* article metaDescription rewrites (44 entries)
// ---------------------------------------------------------------------------
const ARTICLE_REWRITES = {
  "mailpool-ai-review":             "MailPool.ai review (2026): multi-provider inboxes, AI domain generator, blacklist monitoring, and whether the GCP/Microsoft partner positioning fits you.",
  "superwave-review":               "SuperWave review (2026): the pipeline-as-a-service model, the 95% inbox SLA versus the provider's own 80-90% admission, and who SuperWave actually fits.",
  "infraboxes-review":              "InfraBoxes review (2026): $3 private and $2.50 Google mailbox tiers with warmup, monitoring, and burn alerts bundled in, and where the architecture fits.",
  "goboxmate-review":               "GoBoxMate review (2026): the done-for-you Google Workspace inbox model at $38.88-$99, 48-hour setup, templated testimonials, and who actually fits.",
  "instantly-mailboxes-review":     "Instantly Mailboxes (DFY and pre-warmed) review for 2026: per-mailbox pricing, in-platform-only positioning, domain ownership terms, and the real fit.",
  "mailin-ai-review":               "Mailin.ai review (2026): the Solopreneur/Business/Enterprise tiers, ~$1.20-per-mailbox economics at scale, founder-led support, and who Mailin actually fits.",
  "mailreef-review":                "MailReef review (2026): the per-server pricing, what 'unlimited' actually means in the marketing, dedicated IP considerations, and where MailReef fits.",
  "coldiq-inboxes-review":          "ColdIQ Inboxes review (2026): why it's infrastructure bundled into a managed GTM agency retainer (~$2K-8K/mo), not self-serve, and who fits that model.",
  "lunatro-mx-review":              "LUNATRO.MX review (2026): the $199 subscription, 400 Microsoft Azure inboxes, a 30,000-email monthly cap, application-gated access, and who it fits.",
  "premium-inboxes-review":         "Premium Inboxes review (2026): the per-inbox pricing, what the done-for-you setup actually delivers, the Slack-based support model, and the real fit.",
  "mission-inbox-review":           "Mission Inbox review (2026): isolated infrastructure plus dedicated IPs, the AI Pre-send Shield, the $199 starting plan, and where Mission Inbox fits.",
  "agentmail-review":               "AgentMail review (2026): what the AI-agent inbox API actually does, its published usage-based pricing, and why it's a different category from cold email.",
  "mailscale-review":               "Mailscale review (2026): the per-mailbox pricing, the tier-jump pricing structure, the marketing deliverability guarantee, and where Mailscale fits.",
  "infrabox-vs-zapmail":            "Infrabox vs ZapMail (2026): identical plan pricing, both with Google + Microsoft. Infrabox adds Azure mailboxes, isolated warmup, and InfraGuard monitoring.",
  "scaledmail-review":              "ScaledMail review (2026): per-provider pricing for Google, Outlook and SMTP, the fully-managed multi-provider model, and where ScaledMail actually fits.",
  "puzzleinbox-review":             "PuzzleInbox review (2026): per-inbox pricing on Google Workspace and Outlook 365, team transparency observations, and where the product actually fits.",
  "hypertide-review":               "HyperTide review (2026): advertised pricing, the Google/Microsoft/Entra platform claims, deliverability considerations, and where the provider fits.",
  "aerosend-review":                "AeroSend review (2026): slot-based pricing on 10-domain isolation pods, built-in domain burn-alert monitoring, and where AeroSend actually fits.",
  "email-astra-review":             "Email Astra review (2026): the pre-warmed Google/Microsoft inbox model, wildly inconsistent pricing ($2.75-$10), the non-refundable policy, and safe-test tips.",
  "infraforge-review":              "InfraForge review (2026): advertised pricing, the slot-based model, dedicated IP add-ons, and where the Salesforge infrastructure product actually fits.",
  "smartlead-mailboxes-review":     "Smartlead Mailboxes (SmartSenders) review for 2026: per-mailbox pricing, the vendor-bundled provisioning model, and where the product actually fits.",
  "slicey-review":                  "Slicey review (2026): per-domain pricing on isolated Outlook inboxes, the marketing-level guarantees, and where Slicey actually fits cold-email buyers.",
  "zapmail-vs-mailforge":           "ZapMail vs Mailforge (2026): real Google Workspace from $39/mo vs shared-IP accounts at $2-3/mo. Why Infrabox beats both with Microsoft 365 + isolated warmup.",
  "wizemails-review":               "wizeMails review (2026): the dedicated-server-per-client model, Signal Intelligence Engine monitoring every 15 minutes, $179/mo pricing, and who it fits.",
  "hyperinbox-review":              "HyperInboxes review (2026): the premium Google mailbox model, fast 12-hour setup, free replacements, reported sequencer disconnections, and signup status.",
  "mightymail-review":              "MightyMail review (2026): the high-density Microsoft Azure Outlook model (99 inboxes/domain), done-for-you 5-day setup, missing pricing, and who it fits.",
  "coldsire-review":                "ColdSire review (2026): the premium mixed-pool model (15% cold-email cap), true domain isolation, $6/account Google & Microsoft pricing, and the real fit.",
  "inboxnavigator-review":          "Inbox Navigator review (2026): the done-for-you multi-platform model (Google, Microsoft, SMTP, prewarmed), dedicated-IP isolation, $3/inbox, and who it fits.",
  "cheapinboxes-review":            "CheapInboxes review (2026): the pricing tiers, advertised features, the real deliverability considerations, and where CheapInboxes actually fits today.",
  "endy-inboxes-review":            "Endy Inboxes review (2026): private dedicated-IP infrastructure, transparent $25-$199 tiers (~$2-2.5/mailbox), 30-minute done-for-you setup, and the fit.",
  "cold-email-infrastructure-canada":      "Cold email into Canada is CASL-governed — one of the strictest anti-spam regimes worldwide. The legal playbook plus the exact infrastructure that lands inboxes.",
  "infrabox-warmforge-integration":        "Step-by-step guide to connect Infrabox Google Workspace and Microsoft 365 mailboxes to Warmforge, Salesforge's premium warmup with aged-account pools.",
  "cold-email-infrastructure-healthcare":  "Cold email infrastructure for healthtech B2B teams selling into hospitals, health systems, and payers. HIPAA guardrails plus the clinical-buyer playbook.",
  "skysenders-review":                     "SkySenders review (2026): the dedicated-server-per-domain model, transparent $59-$269/mo tiers, the SkyBox unified inbox, built-in monitoring, and the fit.",
  "smartlead-vs-instantly":                "Smartlead vs Instantly (2026) with verified pricing — Smartlead's $39-$379 ladder vs Instantly's $47-$358. Per-workspace vs per-plan, lead DB, AI agents.",
  "zapmail-vs-maildoso":                   "Zapmail vs Maildoso (2026): real pre-warmed Google/Microsoft + ZapShield at $39-299/mo vs SMTP + Google Workspace Combo with unlimited placement testing.",
  "cold-email-infrastructure-australia":   "Cold email in Australia is governed by the Spam Act 2003 — consent, identification, and unsubscribe. The full legal playbook plus the infrastructure setup.",
  "cold-email-infrastructure-germany":     "Germany is Europe's hardest cold-email market. UWG §7 bars it without explicit consent. Here's what's legal, what gets sued, and the infrastructure setup.",
  "cold-email-infrastructure-netherlands": "Dutch cold-email law: Telecommunicatiewet permits B2B messages to legal entities without consent. What the ACM and AP expect, plus the infrastructure setup.",
  "cold-email-infrastructure-us":          "Cold-email infrastructure for US senders. CAN-SPAM rules, Gmail/Yahoo bulk-sender requirements, US-IP reputation, plus the mailbox setup that lands inboxes.",
  "infrabox-prewarmed-mailboxes":          "Infrabox pre-warmed mailboxes ship same-day on Google Workspace and Microsoft 365. Browse the Prewarm Inventory, pick a domain-age tier, and start sending today.",
  "mailforge-vs-maildoso":                 "Mailforge vs Maildoso (2026) on pricing, features, warmup, and monitoring. The shared-IP SMTP showdown — Google Workspace, self-healing, and real deliverability.",
  "cold-email-infrastructure-france":      "France allows B2B cold email to a named professional address when the pitch matches the role. What CNIL expects, how to stay legal, plus the infrastructure setup.",
  "mailforge-vs-instantly":                "Mailforge vs Instantly: one is shared-IP mailbox infrastructure at $2-3/mo, the other is a $47/mo sender with Google-only accounts. Here's which to pick in 2026.",
  // Pass-2 additions: surfaced by independent validator (>170 chars, not in CSV).
  "maildeck-review":                        "MailDeck review (2026): the Microsoft/Google/SMTP multi-platform model, ~$0.30-$0.50 per inbox at scale (833K+ inboxes), and the concentration-risk fit.",
};

// ---------------------------------------------------------------------------
// 2. Layout / page description rewrites (7 entries)
// ---------------------------------------------------------------------------
const LAYOUT_REWRITES = {
  "app/resources/tools/dmarc-checker/layout.js":           "Free DMARC record checker. Validate your DMARC DNS, analyze policy (none/quarantine/reject), check SPF and DKIM alignment, and verify reporting setup.",
  "app/resources/tools/bimi-checker/layout.js":            "Free BIMI record checker. Validate BIMI DNS records, your SVG logo and VMC certificate, and confirm whether your brand logo displays in Gmail, Yahoo, and Apple.",
  "app/resources/tools/dkim-checker/layout.js":            "Free DKIM record checker. Validate DKIM DNS records, public key configuration, key sizes, and selector setup. Auto-detect Google, Microsoft, and SendGrid keys.",
  "app/resources/tools/spf-checker/layout.js":             "Free SPF record checker. Validate SPF DNS records, count DNS lookups, analyze authorized mechanisms, and detect issues like exceeding the 10-lookup limit.",
  "app/cold-email-warmup/layout.js":                       "Built-in email warmup for Infrabox mailboxes or any of 24+ sequencers like Instantly, SmartLead, and Lemlist. Smart volume scaling and real-time health scoring.",
  "app/careers/layout.js":                                 "Hiring across engineering, growth, and operations in our Gurgaon office. Work directly with the founding team on cold email infrastructure used worldwide.",
  "app/refund-policy/layout.js":                           "Infrabox refund policy. Subscription fees, wallet credits, domain purchases, chargebacks, billing disputes, and how to request a refund from our billing team.",
  "app/resources/knowledge-base/layout.js":                "Knowledge base for cold email infrastructure. DNS management, Google Workspace configuration, panel diagnostics, disruption handling, and suspension recovery.",
  "app/resources/knowledge-base/google-panel-checker/layout.js": "Understand the Google Workspace admin panel for cold email — account status, suspension warnings, license usage, and the health signals worth tracking weekly.",
  // Pass-2 additions: uniquify descriptions that currently duplicate the
  // top-level product/marketing pages. The KB versions get a docs/guide voice;
  // the root product pages keep their conversion-focused descriptions.
  "app/resources/knowledge-base/dns-management/layout.js":              "Step-by-step guides for managing cold-email DNS — SPF, DKIM, DMARC, MX records, and key rotation. Best practices and troubleshooting from the Infrabox team.",
  "app/resources/knowledge-base/google-disruption/layout.js":           "How to spot, prevent, and recover from Google Workspace disruptions. Diagnostic playbooks, monitoring tips, and backup strategies for cold-email senders.",
  "app/resources/knowledge-base/google-suspension/layout.js":           "Playbook for recovering Google Workspace accounts after suspension. Reactivation steps, what to send Google support, and how to prevent it next time.",
  "app/resources/knowledge-base/google-workspace-accounts/layout.js":   "What to know before buying Google Workspace accounts for cold email — US IPs, admin access, 2FA, domain isolation, and how Infrabox sets them up.",
  // Pass-2 additions: >170 chars, not in CSV. Also differentiates the root
  // /google-panel-checker description from the /resources/knowledge-base/ version.
  "app/google-panel-checker/layout.js":   "Free Google Workspace admin panel check. Verify account status, surface suspension risks, and monitor workspace health to avoid costly email disruptions.",
  "app/partners/layout.js":               "Hand-picked agencies and operators who build, run, or rescue cold-email infrastructure. 66 Infrabox-certified partners across Platinum, Gold, and more.",
};

// ---------------------------------------------------------------------------
// 3. Partner tagline rewrites (12 entries). The /partners/[slug] meta
//    description is templated as:
//      `${tagline} Book a meeting with ${name}, a certified Infrabox partner based in ${location}.`
//    So we lengthen the tagline; the suffix supplies name + location naturally.
// ---------------------------------------------------------------------------
const PARTNER_TAGLINES = {
  "Axia Growth":      "M&A deal-flow outbound niche with account research and sequencer build.",
  "Enavra":           "Boutique outbound for B2B SaaS teams — done-with-you sequencer builds and reply handling.",
  "Enrow":            "French-market outbound operator with native French sequences and CNIL-aware deliverability.",
  "Lidgen":           "MENA/Israel outbound specialist with sequencer build and reply handling.",
  "Prospectify":      "Outbound for European B2B SaaS with sequencer build and pan-EU account research.",
  "Prospero AI":      "AI-augmented prospecting for B2B teams with enriched targeting and copy generation.",
  "Relevance AI":     "AI-driven outbound personalization at scale for SaaS and agency teams.",
  "Primavera Solar":  "LATAM-market outbound with native Spanish and Portuguese sequences.",
  "Email Ethos":      "Ethical, deliverability-safe outbound with sender-reputation guardrails.",
  "Level180":         "African-market outbound specialist with sequencer build for SaaS teams.",
  "Revenue Boost":    "Outbound retainers for early-stage SaaS founders, from copy to reply handling.",
  "Prospeqt":         "DACH-market outbound agency. Localized copy for German enterprise buyers.",
  // Pass-2 additions: surfaced by validator (outside [120,170] after first pass).
  "cold.email":       "Full-stack cold email agency for B2B SaaS. Built-for-you outbound with creator distribution.",
  "GTMx":             "High-volume outbound shop for B2B SaaS with sequencer builds and reply handling.",
  "Best Leads":       "Lead-generation focused outbound shop with sequencer build and copywriting.",
};

// ---------------------------------------------------------------------------
// 4. /authors fix: title (bundled cleanup of double " | Infrabox") + description
// ---------------------------------------------------------------------------
const AUTHORS_PAGE = {
  oldTitle: "Our Team | Infrabox",
  newTitle: "Our Team",
  newDescription: "Meet the people building Infrabox — the cold email infrastructure platform trusted by agencies and B2B sales teams across the US, EU, and APAC.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(p)        { return fs.readFileSync(p, "utf8"); }
function writeFile(p, c)    { fs.writeFileSync(p, c, "utf8"); }
function exists(p)          { return fs.existsSync(p); }

// Replace the first occurrence of a named string field (e.g. "title",
// "description", "metaDescription") with a new value. Handles single-line and
// multi-line forms and " ' ` quote styles. Returns { content, oldValue } or
// null if not found.
function replaceFirstField(content, fieldName, newValue) {
  const marker = `${fieldName}:`;
  const idx = content.indexOf(marker);
  if (idx < 0) return null;
  let i = idx + marker.length;
  while (i < content.length && /\s/.test(content[i])) i++;
  const quote = content[i];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  let j = i + 1;
  let raw = "";
  while (j < content.length && content[j] !== quote) {
    if (content[j] === "\\" && j + 1 < content.length) {
      raw += content[j + 1];
      j += 2;
      continue;
    }
    raw += content[j];
    j += 1;
  }
  if (j >= content.length) return null;
  const escaped = newValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const before = content.slice(0, i);
  const after = content.slice(j + 1);
  return { content: before + '"' + escaped + '"' + after, oldValue: raw };
}

// Parse partner records out of app/partners/data.js. Each partner is a
// single-line object literal — no need to actually require/import.
function parsePartnersFromFile(content) {
  const out = [];
  for (const line of content.split("\n")) {
    const nm = line.match(/^\s*\{\s*name:'([^']+)'/);
    if (!nm) continue;
    const tg = line.match(/tagline:'([^']*)'/);
    const lc = line.match(/location:'([^']*)'/);
    if (!tg || !lc) continue;
    out.push({ name: nm[1], tagline: tg[1], location: lc[1] });
  }
  return out;
}

// Replace a partner's `tagline` field in app/partners/data.js. Partners are
// single-line records like { name:'X', monogram:'..', ..., tagline:'<text>', ...}.
// We locate by name and rewrite the tagline only.
function replacePartnerTagline(content, partnerName, newTagline) {
  const nameMarker = `name:'${partnerName}'`;
  const idx = content.indexOf(nameMarker);
  if (idx < 0) return null;
  // Find next `tagline:'...'` after this name.
  const tagIdx = content.indexOf("tagline:", idx);
  if (tagIdx < 0) return null;
  let i = tagIdx + "tagline:".length;
  while (i < content.length && /\s/.test(content[i])) i++;
  const q = content[i];
  if (q !== "'" && q !== '"' && q !== "`") return null;
  let j = i + 1;
  let raw = "";
  while (j < content.length && content[j] !== q) {
    if (content[j] === "\\" && j + 1 < content.length) {
      raw += content[j + 1];
      j += 2;
      continue;
    }
    raw += content[j];
    j += 1;
  }
  if (j >= content.length) return null;
  // data.js uses single quotes; new value must escape ' inside.
  if (newTagline.includes("'")) {
    errors.push(`Partner "${partnerName}" — new tagline contains a single quote; need to escape: ${newTagline}`);
    return null;
  }
  const before = content.slice(0, i);
  const after = content.slice(j + 1);
  return { content: before + "'" + newTagline + "'" + after, oldValue: raw };
}

// ---------------------------------------------------------------------------
// Apply: /learn article metaDescription
// ---------------------------------------------------------------------------
const articlesDir = path.join(ROOT, "app", "learn", "[slug]", "articles");

for (const [slug, newDesc] of Object.entries(ARTICLE_REWRITES)) {
  const p = path.join(articlesDir, `${slug}.js`);
  if (!exists(p)) { errors.push(`MISSING article: ${p}`); continue; }
  const before = readFile(p);
  const r = replaceFirstField(before, "metaDescription", newDesc);
  if (!r) { errors.push(`No metaDescription field in ${slug}.js`); continue; }
  writeFile(p, r.content);
  updates.push({ kind: "article", file: `app/learn/[slug]/articles/${slug}.js`, old: r.oldValue, new: newDesc, len: newDesc.length });
}

// ---------------------------------------------------------------------------
// Apply: layout/page description
// ---------------------------------------------------------------------------
for (const [rel, newDesc] of Object.entries(LAYOUT_REWRITES)) {
  const p = path.join(ROOT, rel);
  if (!exists(p)) { errors.push(`MISSING layout/page: ${p}`); continue; }
  const before = readFile(p);
  const r = replaceFirstField(before, "description", newDesc);
  if (!r) { errors.push(`No description field in ${rel}`); continue; }
  writeFile(p, r.content);
  updates.push({ kind: "layout", file: rel, old: r.oldValue, new: newDesc, len: newDesc.length });
}

// ---------------------------------------------------------------------------
// Apply: partners/data.js taglines
// ---------------------------------------------------------------------------
const partnersData = path.join(ROOT, "app", "partners", "data.js");
if (exists(partnersData)) {
  let content = readFile(partnersData);
  for (const [partnerName, newTagline] of Object.entries(PARTNER_TAGLINES)) {
    const r = replacePartnerTagline(content, partnerName, newTagline);
    if (!r) { errors.push(`partners/data.js: could not rewrite tagline for "${partnerName}"`); continue; }
    content = r.content;
    updates.push({ kind: "partner-tagline", file: "app/partners/data.js", partner: partnerName, old: r.oldValue, new: newTagline });
  }
  writeFile(partnersData, content);
}

// ---------------------------------------------------------------------------
// Apply: /authors page.js — title + metadata.description + openGraph.description
// ---------------------------------------------------------------------------
const authorsPage = path.join(ROOT, "app", "authors", "page.js");
if (exists(authorsPage)) {
  let content = readFile(authorsPage);
  // Title: rewrite the first `title:` if it matches the known double-suffix.
  const r1 = replaceFirstField(content, "title", AUTHORS_PAGE.newTitle);
  if (r1 && r1.oldValue === AUTHORS_PAGE.oldTitle) {
    content = r1.content;
    updates.push({ kind: "authors-title", file: "app/authors/page.js", old: r1.oldValue, new: AUTHORS_PAGE.newTitle });
  } else if (r1 && r1.oldValue !== AUTHORS_PAGE.oldTitle) {
    warnings.push(`authors/page.js: first title is "${r1.oldValue}", not the expected "${AUTHORS_PAGE.oldTitle}". Leaving as-is.`);
    // Revert: don't write the failed title swap.
    content = readFile(authorsPage);
  }
  // metadata.description (first occurrence).
  const r2 = replaceFirstField(content, "description", AUTHORS_PAGE.newDescription);
  if (!r2) {
    errors.push("authors/page.js: no description field found.");
  } else {
    content = r2.content;
    updates.push({ kind: "authors-description", file: "app/authors/page.js", old: r2.oldValue, new: AUTHORS_PAGE.newDescription, len: AUTHORS_PAGE.newDescription.length });
  }
  // openGraph.description (second `description:` — find it after the first).
  const firstDescIdx = content.indexOf("description:");
  const secondDescIdx = content.indexOf("description:", firstDescIdx + 1);
  if (secondDescIdx >= 0) {
    const slice = content.slice(secondDescIdx);
    const r3 = replaceFirstField(slice, "description", AUTHORS_PAGE.newDescription);
    if (r3) {
      content = content.slice(0, secondDescIdx) + r3.content;
      updates.push({ kind: "authors-og-description", file: "app/authors/page.js", old: r3.oldValue, new: AUTHORS_PAGE.newDescription, len: AUTHORS_PAGE.newDescription.length });
    }
  }
  writeFile(authorsPage, content);
}

// ---------------------------------------------------------------------------
// Validation pass: length + uniqueness
// ---------------------------------------------------------------------------

const lengthIssues = [];
const idealRangeWarnings = [];

function check(label, value) {
  if (typeof value !== "string") return;
  if (value.length < MIN_LEN || value.length > MAX_LEN) {
    lengthIssues.push({ label, value, len: value.length });
  } else if (value.length < IDEAL_MIN || value.length > IDEAL_MAX) {
    idealRangeWarnings.push({ label, len: value.length });
  }
}

for (const [slug, v] of Object.entries(ARTICLE_REWRITES)) check(`article:${slug}`, v);
for (const [rel, v] of Object.entries(LAYOUT_REWRITES)) check(`layout:${rel}`, v);

// For partners, simulate the final rendered description from the template:
//   `${tagline} Book a meeting with ${name}, a certified Infrabox partner based in ${location}.`
const partnerRenderedDescs = [];
{
  const partnersContent = readFile(partnersData);
  const all = parsePartnersFromFile(partnersContent);
  for (const partner of all) {
    const rendered = `${partner.tagline} Book a meeting with ${partner.name}, a certified Infrabox partner based in ${partner.location}.`;
    partnerRenderedDescs.push({ name: partner.name, rendered });
    check(`partner-rendered:${partner.name}`, rendered);
  }
}

check("authors", AUTHORS_PAGE.newDescription);

// Uniqueness pass: walk every metaDescription/description on disk.
function walk(dir, hits, predicate) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, hits, predicate);
    else if (predicate(entry, full)) hits.push(full);
  }
}

function extractFieldValues(content, fieldName) {
  const values = [];
  let from = 0;
  const marker = `${fieldName}:`;
  while (true) {
    const idx = content.indexOf(marker, from);
    if (idx < 0) break;
    let i = idx + marker.length;
    while (i < content.length && /\s/.test(content[i])) i++;
    const q = content[i];
    if (q !== '"' && q !== "'" && q !== "`") { from = i + 1; continue; }
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
    values.push(val);
    from = j + 1;
  }
  return values;
}

// Find where the page/layout's actual metadata block starts, so the
// uniqueness sweep doesn't grab a `description:` from a feature array.
function metadataBlockStart(content) {
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

const collected = []; // { source, kind, value }
// /learn articles
const articles = [];
walk(articlesDir, articles, (e) => e.isFile() && e.name.endsWith(".js"));
for (const p of articles) {
  const content = readFile(p);
  const vals = extractFieldValues(content, "metaDescription");
  if (vals.length === 0) continue;
  collected.push({ source: path.relative(ROOT, p).replace(/\\/g, "/"), kind: "article", value: vals[0] });
}
// layouts + non-layout page.js files. Skip admin/* routes (not indexed) and
// empty descriptions (form-state defaults that look like SEO fields but aren't).
const layouts = [];
walk(path.join(ROOT, "app"), layouts, (e) => e.isFile() && (e.name === "layout.js" || e.name === "page.js"));
for (const p of layouts) {
  const rel = path.relative(ROOT, p).replace(/\\/g, "/");
  if (rel.startsWith("app/admin/")) continue;
  const content = readFile(p);
  const mdStart = metadataBlockStart(content);
  if (mdStart < 0) continue;
  const vals = extractFieldValues(content.slice(mdStart), "description");
  if (vals.length === 0 || !vals[0]) continue;
  collected.push({ source: rel, kind: "layout/page", value: vals[0] });
}
// Partner rendered descriptions
for (const { name, rendered } of partnerRenderedDescs) {
  collected.push({ source: `partner:${name}`, kind: "partner", value: rendered });
}

// Detect duplicates.
const byValue = new Map();
for (const c of collected) {
  if (!byValue.has(c.value)) byValue.set(c.value, []);
  byValue.get(c.value).push(c);
}
const duplicates = [...byValue.entries()]
  .filter(([_, sources]) => sources.length > 1)
  .map(([value, sources]) => ({ value, sources }));

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const filesChanged = new Set(updates.map(u => u.file));
const report = {
  summary: {
    totalEdits: updates.length,
    filesChanged: filesChanged.size,
    errors: errors.length,
    warnings: warnings.length,
    validation: {
      lengthIssues: lengthIssues.length,
      idealRangeWarnings: idealRangeWarnings.length,
      duplicates: duplicates.length,
    },
  },
  updates,
  errors,
  warnings,
  lengthIssues,
  idealRangeWarnings,
  duplicates,
};

const outPath = path.join(ROOT, ".seo", "scripts", "fix-seo-meta-descriptions.report.json");
writeFile(outPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify(report.summary, null, 2));
console.log(`\nFull report: ${outPath}`);
if (errors.length) {
  console.log("\nERRORS:");
  for (const e of errors) console.log(`  - ${e}`);
}
if (lengthIssues.length) {
  console.log("\nLENGTH OUT OF [120,170]:");
  for (const v of lengthIssues) console.log(`  - [${v.len}] ${v.label}: ${v.value}`);
}
if (idealRangeWarnings.length) {
  console.log(`\nOUTSIDE IDEAL [145,160] (still valid, but not optimal — ${idealRangeWarnings.length} entries):`);
  for (const v of idealRangeWarnings.slice(0, 20)) console.log(`  - [${v.len}] ${v.label}`);
  if (idealRangeWarnings.length > 20) console.log(`  ... ${idealRangeWarnings.length - 20} more`);
}
if (duplicates.length) {
  console.log("\nDUPLICATES:");
  for (const d of duplicates) {
    console.log(`  - "${d.value.slice(0, 80)}..."`);
    for (const s of d.sources) console.log(`      • [${s.kind}] ${s.source}`);
  }
}
