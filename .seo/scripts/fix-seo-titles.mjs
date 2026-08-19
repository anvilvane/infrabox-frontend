#!/usr/bin/env node
// One-shot SEO title fixer.
// Run from the project root: `node .seo/scripts/fix-seo-titles.mjs`
//
// Behavior:
//   1. Rewrites /learn/* article titles (data-driven from the LEARN_REWRITES map).
//   2. Rewrites root + /resources + /compare layout titles.
//   3. Strips redundant trailing " | Infrabox" / "| ${config.appName}" from
//      all child app/**/layout.js files (root layout's title.template adds it).
//   4. Patches the cheapinboxes entry in app/compare/[slug]/compare-data.js.
//   5. Fixes the encoding glitch in app/resources/knowledge-base/dns-management/layout.js.
//
// Validation:
//   - Every produced final title (with " | Infrabox" appended where applicable)
//     must be <=60 chars.
//   - No "| Infrabox | Infrabox" doubles anywhere.
//   - No non-ASCII junk (U+FFFD or stray U+FFFD-class chars) in rewritten titles.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const MAX_FINAL_LEN = 60;
const SUFFIX = " | Infrabox"; // 11 chars (added by root layout title.template)
const MAX_SRC_LEN = MAX_FINAL_LEN - SUFFIX.length; // 49

const updates = [];
const errors = [];
const warnings = [];

// ---------------------------------------------------------------------------
// /learn/* article title rewrites
// Final string in the rendered <title> = `${value} | Infrabox`
// So each value below must be <=49 chars.
// ---------------------------------------------------------------------------
const LEARN_REWRITES = {
  "cold-email-infrastructure-saas":              "Cold Email Infrastructure for SaaS (2026)",
  "best-domain-extensions-cold-email":           "Best Domain Extensions for Cold Email (2026)",
  "coldiq-inboxes-review":                       "ColdIQ Inboxes Review (2026): Agency Bundle",
  "cold-email-sending-volume-limits-guide":      "Cold Email Sending Volume Limits (2026)",
  "mailforge-pricing":                           "Mailforge Pricing Breakdown (2026)",
  "dns-setup-guide":                             "DNS Setup for Cold Email: SPF, DKIM, DMARC (2026)",
  "cold-email-warmup-guide":                     "Cold Email Warmup: 14-Day Guide (2026)",
  "infraforge-alternatives":                     "6 Best Infraforge Alternatives (2026)",
  "mightymail-review":                           "MightyMail Review (2026): Azure Outlook Inboxes",
  "cold-email-infrastructure-startups":          "Cold Email Infrastructure for Startups (2026)",
  "instantly-mailboxes-review":                  "Instantly Mailboxes Review (2026)",
  "primeforge-pricing":                          "Primeforge Pricing Breakdown (2026)",
  "smartlead-mailboxes-review":                  "Smartlead Mailboxes Review (2026)",
  "best-cold-email-infrastructure-startups-2026":"Best Cold Email Infra for Startups (2026)",
  "cold-email-infrastructure-solo-founders":     "Cold Email Infra for Solo Founders (2026)",
  "inboxnavigator-review":                       "Inbox Navigator Review (2026): Multi-Platform",
  "google-postmaster-tools-guide":               "Google Postmaster Tools: Setup Guide (2026)",
  "google-yahoo-sender-requirements-2026":       "Google & Yahoo Sender Requirements (2026)",
  "infrabox-vs-mailforge":                       "Infrabox vs Mailforge (2026): Real vs Shared IP",
  "primeforge-review":                           "Primeforge Review (2026): 30 Mailboxes Tested",
  "agentmail-review":                            "AgentMail Review (2026): Email API for AI Agents",
  "best-cold-email-infrastructure-under-50-mailboxes": "Best Cold Email Infra Under 50 Mailboxes (2026)",
  "coldsire-review":                             "ColdSire Review (2026): Mixed-Pool Inboxes",
  "endy-inboxes-review":                         "Endy Inboxes Review (2026): Dedicated-IP From $2",
  "best-cold-email-infrastructure-high-volume":  "Best Cold Email Infra for High Volume (2026)",
  "email-astra-review":                          "Email Astra Review (2026): Pre-Warmed Inboxes",
  "hyperinbox-review":                           "HyperInboxes Review (2026): Google Mailboxes",
  "premium-inboxes-review":                      "Premium Inboxes Review (2026)",
  "agency-workflows-guide":                      "Agency Cold Email Workflows (2026)",
  "cold-email-reply-rate-benchmarks-2026":       "Cold Email Reply Rate Benchmarks (2026)",
  "infrabox-whitelabel-guide":                   "Infrabox Whitelabel Guide (2026)",
  "skysenders-review":                           "SkySenders Review (2026): Server-Per-Domain Infra",
  "smartlead-vs-instantly":                      "Smartlead vs Instantly (2026)",
  "cold-email-infrastructure-australia":         "Cold Email Infrastructure for Australia (2026)",
  "cold-email-infrastructure-india":             "Cold Email Infrastructure for India (2026)",
  "infrabox-vs-primeforge":                      "Infrabox vs Primeforge (2026)",
  "mission-inbox-review":                        "Mission Inbox Review (2026)",
  "superwave-review":                            "SuperWave Review (2026): The 95% SLA",
  "zapmail-pricing":                             "Zapmail Pricing Breakdown (2026)",
  "best-cold-email-infrastructure-2026":         "7 Best Cold Email Infrastructure Tools (2026)",
  "bimi-setup-guide":                            "BIMI Setup Guide: Show Your Logo in Inbox (2026)",
  "cheapinboxes-review":                         "CheapInboxes Review (2026)",
  "email-authentication-spf-dkim-dmarc-explained":"SPF vs DKIM vs DMARC Explained (2026)",
  "email-infrastructure-cost-analysis-2026":     "Cold Email Infrastructure Cost Analysis (2026)",
  "infrabox-vs-zapmail":                         "Infrabox vs Zapmail (2026)",
  "mailforge-vs-primeforge":                     "Mailforge vs Primeforge (2026): Shared vs Real IP",
  "pre-warmed-mailboxes-vs-self-warmup":         "Pre-Warmed vs Self-Warmup Mailboxes (2026)",
  "zapmail-review":                              "Zapmail Review (2026): 50 Mailboxes Tested",
  "zapmail-vs-mailforge":                        "Zapmail vs Mailforge (2026)",
  "mailpool-ai-review":                          "MailPool AI Review (2026)",
  "puzzleinbox-review":                          "PuzzleInbox Review (2026)",
  "wizemails-review":                            "wizeMails Review (2026): Monitoring-First Infra",
  "cold-email-sequencer-integration-guide":      "Connect Infrabox Mailboxes to Sequencer (2026)",
  "email-warmup-tools-comparison-2026":          "Email Warmup Tools Compared (2026)",
  "inbox-placement-testing-explained":           "Inbox Placement Testing Explained (2026)",
  "infraboxes-review":                           "InfraBoxes Review (2026)",
  "infraforge-review":                           "InfraForge Review (2026)",
  "infraforge-vs-instantly":                     "Infraforge vs Instantly (2026): IPs vs Platform",
  "lunatro-mx-review":                           "Lunatro MX Review (2026)",
  "mailforge-vs-instantly":                      "Mailforge vs Instantly (2026): Infra vs Sender",
  "scaledmail-review":                           "ScaledMail Review (2026)",
  "goboxmate-review":                            "GoBoxMate Review (2026)",
  "hypertide-review":                            "HyperTide Review (2026)",
  "infrabox-vs-puzzleinbox":                     "Infrabox vs PuzzleInbox (2026): 30-Min Delivery",
  "launch-cold-email-campaign-same-day":         "Launch a Cold Email Campaign Same-Day (2026)",
  "mailforge-vs-maildoso":                       "Mailforge vs Maildoso (2026): Shared-IP Compared",
  "mailin-ai-review":                            "Mailin AI Review (2026)",
  "mailscale-review":                            "Mailscale Review (2026)",
  "shared-vs-private-email-infrastructure":      "Shared vs Private Email Infrastructure (2026)",
  "aerosend-review":                             "AeroSend Review (2026)",
  "domain-reputation-vs-ip-reputation":          "Domain Reputation vs IP Reputation (2026)",
  "infrabox-vs-zapmail-vs-primeforge":           "Infrabox vs Zapmail vs Primeforge (2026)",
  "mailreef-review":                             "MailReef Review (2026)",
  "cold-email-infrastructure-france":            "Cold Email Infrastructure for France (2026)",
  "cold-email-infrastructure-germany":           "Cold Email Infrastructure for Germany (2026)",
  "cold-email-infrastructure-uk":                "Cold Email Infrastructure for the UK (2026)",
  "cold-email-infrastructure-us":                "Cold Email Infrastructure for the US (2026)",
  "dkim-setup-cold-email":                       "How to Set Up DKIM for Cold Email (2026)",
  "email-deliverability-monitoring-setup":       "Email Deliverability Monitoring Setup (2026)",
  "pre-warmed-google-workspace-accounts":        "Pre-Warmed Google Workspace Accounts (2026)",
  "primeforge-vs-smartlead":                     "Primeforge vs Smartlead (2026)",
  "slicey-review":                               "Slicey Review (2026)",
  "us-ip-benefits-guide":                        "Why US IPs Matter for Cold Email (2026)",
  "what-is-infrabox":                            "What is Infrabox? Cold Email Infra (2026)",
  "zapmail-prewarm-vs-infrabox-prewarm":         "Zapmail Pre-Warm vs Infrabox Pre-Warm (2026)",
  "zapmail-vs-primeforge":                       "Zapmail vs Primeforge (2026)",

  // Pass-2 additions: /learn articles flagged by the independent validator
  // (>60 chars) that weren't in the original CSV. Same <=49-char budget.
  "apollo-review":                               "Apollo Review (2026): Cold Email & Data Platform",
  "best-cold-email-infrastructure-microsoft-365":"Best Cold Email Infra for Microsoft 365 (2026)",
  "best-email-infrastructure-agencies":          "8 Best Email Infrastructure for Agencies (2026)",
  "buy-pre-warmed-email-accounts-guide":         "How to Buy Pre-Warmed Email Accounts (2026)",
  "cheapest-cold-email-infrastructure-2026":     "Cheapest Cold Email Infrastructure (2026)",
  "check-domain-blacklisted":                    "How to Check If Your Domain Is Blacklisted (2026)",
  "cold-email-ab-testing-guide":                 "How to A/B Test Cold Emails (2026)",
  "cold-email-bounce-rate-benchmarks":           "Cold Email Bounce Rate Benchmarks (2026)",
  "cold-email-compliance-gdpr-can-spam":         "Cold Email Compliance: GDPR & CAN-SPAM (2026)",
  "cold-email-deliverability-statistics-2026":   "Cold Email Deliverability Statistics (2026)",
  "cold-email-domain-setup-checklist":           "Cold Email Domain Setup Checklist (2026)",
  "cold-email-infrastructure-canada":            "Cold Email Infrastructure for Canada (2026)",
  "cold-email-infrastructure-comparison-2026":   "Cold Email Infrastructure Comparison (2026)",
  "cold-email-infrastructure-healthcare":        "Cold Email Infrastructure for Healthtech (2026)",
  "cold-email-infrastructure-netherlands":       "Cold Email Infrastructure for Netherlands (2026)",
  "cold-email-infrastructure-recruitment":       "Cold Email Infra for Recruitment Agencies (2026)",
  "cold-email-infrastructure-setup-guide":       "Cold Email Infrastructure Setup Guide (2026)",
  "cold-emails-going-to-spam-gmail-fix":         "Cold Emails Going to Spam in Gmail? Fix (2026)",
  "domain-blacklisted-diagnosis-guide":          "Why Is My Domain Blacklisted? (2026)",
  "domain-warmup-best-practices":                "Domain Warmup Best Practices (2026)",
  "email-blacklist-removal-guide":               "Email Blacklist Removal Guide (2026)",
  "email-sending-limits-google-microsoft":       "Email Sending Limits: Google vs Microsoft (2026)",
  "emails-landing-in-promotions-tab":            "Cold Emails in Promotions Tab? Fix (2026)",
  "google-workspace-vs-microsoft-365-cold-email":"Google Workspace vs Microsoft 365 (2026)",
  "how-many-domains-cold-email":                 "How Many Domains for Cold Email? (2026)",
  "infrabox-brandjet-integration":               "Connect Infrabox to BrandJet (2026)",
  "infrabox-emailbison-integration":             "Connect Infrabox to Email Bison (2026)",
  "infrabox-emelia-integration":                 "Connect Infrabox to Emelia (2026)",
  "infrabox-hothawk-integration":                "Connect Infrabox to Hothawk (2026)",
  "infrabox-instantly-integration":              "Connect Infrabox to Instantly (2026)",
  "infrabox-lemlist-integration":                "Connect Infrabox to Lemlist (2026)",
  "infrabox-mailtoaster-integration":            "Connect Infrabox to MailToaster (2026)",
  "infrabox-manyreach-integration":              "Connect Infrabox to Manyreach (2026)",
  "infrabox-masterinbox-integration":            "Connect Infrabox to Master Inbox (2026)",
  "infrabox-plusvibe-integration":               "Connect Infrabox to PlusVibe (2026)",
  "infrabox-prewarmed-mailboxes":                "Infrabox Pre-Warmed Mailboxes (2026)",
  "infrabox-pricing":                            "Infrabox Pricing Breakdown (2026)",
  "infrabox-reachinbox-integration":             "Connect Infrabox to ReachInbox (2026)",
  "infrabox-replyio-integration":                "Connect Infrabox to Reply.io (2026)",
  "infrabox-review":                             "Infrabox Review (2026): Pricing & Features",
  "infrabox-salesforge-integration":             "Connect Infrabox to Salesforge (2026)",
  "infrabox-saleshandy-integration":             "Connect Infrabox to Saleshandy (2026)",
  "infrabox-sendkit-integration":                "Connect Infrabox to SendKit (2026)",
  "infrabox-smartlead-integration":              "Connect Infrabox to Smartlead (2026)",
  "infrabox-snovio-integration":                 "Connect Infrabox to Snov.io (2026)",
  "infrabox-supersend-integration":              "Connect Infrabox to Supersend (2026)",
  "infrabox-trulyinbox-integration":             "Connect Infrabox to TrulyInbox (2026)",
  "infrabox-warmforge-integration":              "Connect Infrabox to Warmforge (2026)",
  "infrabox-warmy-integration":                  "Connect Infrabox to Warmy.io (2026)",
  "infrabox-woodpecker-integration":             "Connect Infrabox to Woodpecker (2026)",
  "infrabox-zazu-integration":                   "Connect Infrabox to Za-Zu (2026)",
  "inframail-review":                            "Inframail Review (2026): Private Infrastructure",
  "instantly-review":                            "Instantly Review (2026): Cold Email Platform",
  "ip-rotation-cold-email":                      "IP Rotation for Cold Email (2026)",
  "lemlist-review":                              "Lemlist Review (2026): Cold Email Sequencer",
  "maildeck-review":                             "MailDeck Review (2026): Multi-Platform Infra",
  "maildoso-alternatives":                       "7 Best Maildoso Alternatives (2026)",
  "mailforge-review":                            "Mailforge Review (2026): Shared IPs at Scale",
  "pre-warmed-mailboxes-worth-it":               "Are Pre-Warmed Mailboxes Worth It? (2026)",
  "pre-warmed-microsoft-365-mailboxes":          "Pre-Warmed Microsoft 365 Mailboxes (2026)",
  "scale-cold-email-100-to-10000":               "Scale Cold Email: 100 to 10,000 Sends/Day (2026)",
  "skip-email-warmup-safely":                    "How to Skip Email Warmup Safely (2026)",
  "smartlead-review":                            "Smartlead Review (2026): Honest Cold Email Take",
  "zapmail-vs-maildoso":                         "Zapmail vs Maildoso (2026): Google vs SMTP",
};

// ---------------------------------------------------------------------------
// Layout file rewrites — relative path → new title string.
// Final = `${value} | Infrabox` (template appends). value must be <=49 chars.
// Evergreen/marketing pages skip the "(2026)" suffix.
// ---------------------------------------------------------------------------
const LAYOUT_REWRITES = {
  "app/cold-email-warmup/layout.js":                                  "Email Warmup | 24+ Sequencer Integrations",
  "app/careers/layout.js":                                            "Careers — Join the Team Building Email Infra",
  "app/agency-email-solution/layout.js":                              "Email Solution for Agencies — Multi-Client",
  "app/azure-mailboxes/layout.js":                                    "Azure Mailboxes | 100 Free | $30 Per Domain",
  "app/resources/layout.js":                                          "Email Resources Hub — Tools & Guides",
  "app/resources/tools/dkim-checker/layout.js":                       "Free DKIM Checker — Validate DKIM Signatures",
  "app/resources/knowledge-base/layout.js":                           "Knowledge Base — DNS & Email Infrastructure",
  "app/resources/tools/dmarc-checker/layout.js":                      "Free DMARC Checker — Validate Policy & Alignment",
  "app/affiliates/layout.js":                                         "Affiliate Program — 10% Lifetime Commissions",
  "app/resources/knowledge-base/dns-management/layout.js":            "DNS for Cold Email — SPF, DKIM, DMARC (2026)",
  "app/resources/tools/spf-checker/layout.js":                        "Free SPF Checker — Validate DNS Records",

  // Pass-2 additions: layouts that were over 60 chars after the simple
  // suffix-strip but were not in the original CSV. Same <=49-char budget.
  "app/creators/layout.js":                                           "Creator Program — 10% Lifetime Commissions",
  "app/dns-management/layout.js":                                     "DNS Management — Auto SPF, DKIM, DMARC Setup",
  "app/google-disruption/layout.js":                                  "Google Workspace Disruption Protection",
  "app/google-panel-checker/layout.js":                               "Google Workspace Admin Panel Health Check",
  "app/google-suspension/layout.js":                                  "Google Workspace Suspension Recovery",
  "app/google-workspace-accounts/layout.js":                          "US-IP Google Workspace Accounts — $2.50/mo",
  "app/partners/layout.js":                                           "Partner Network — Certified Cold Email Partners",
  "app/resources/guides/cold-email-warmup/layout.js":                 "Cold Email Warmup Guide (2026)",
  "app/resources/guides/dns-setup/layout.js":                         "DNS Setup for Email Authentication (2026)",
  "app/resources/guides/layout.js":                                   "Email Deliverability Guides & Tutorials",
  "app/resources/knowledge-base/google-disruption/layout.js":         "Google Workspace Disruption Protection",
  "app/resources/knowledge-base/google-panel-checker/layout.js":      "Google Workspace Admin Panel Health Check",
  "app/resources/knowledge-base/google-suspension/layout.js":         "Google Workspace Suspension Recovery",
  "app/resources/knowledge-base/google-workspace-accounts/layout.js": "US-IP Google Workspace Accounts — $2.50/mo",
  "app/resources/tools/bimi-checker/layout.js":                       "Free BIMI Checker — Validate BIMI DNS & Logo",
  "app/resources/tools/bimi-generator/layout.js":                     "Free BIMI Generator — Create BIMI DNS Records",
  "app/resources/tools/deliverability-score/layout.js":               "Free Domain Deliverability Score Checker",
  "app/resources/tools/dmarc-generator/layout.js":                    "Free DMARC Generator — Create DMARC Records",
  "app/resources/tools/domain-scanner/layout.js":                     "Free Domain Health Scanner — Full Analysis",
  "app/resources/tools/email-permutator/layout.js":                   "Free Email Permutator — Find Any Email",
  "app/resources/tools/email-verifier/layout.js":                     "Free Email Verifier — Validate Email Addresses",
  "app/resources/tools/layout.js":                                    "Email Tools — SPF, DKIM, DMARC Validators",
  "app/resources/tools/mailbox-calculator/layout.js":                 "Free Mailbox Cost Calculator — Pricing Tool",
  "app/resources/tools/reputation-check/layout.js":                   "Free Domain & IP Reputation Checker",
  "app/resources/tools/spf-generator/layout.js":                      "Free SPF Generator — Create SPF DNS Records",
  "app/resources/tools/spf-raw-checker/layout.js":                    "Free SPF Raw Syntax Checker — Validate SPF",
};

// ---------------------------------------------------------------------------
// /compare/[slug] data-file entry rewrites.
// app/compare/[slug]/page.js sets title: entry.title, which also runs through
// the root template (so source value <= 49).
// ---------------------------------------------------------------------------
const COMPARE_REWRITES = {
  "cheapinboxes": "Infrabox vs CheapInboxes (2026)",
  "mailforge":    "Infrabox vs Mailforge (2026)",
  "primeforge":   "Infrabox vs Primeforge (2026)",
  "infraforge":   "Infrabox vs Infraforge (2026)",
  "zapmail":      "Infrabox vs Zapmail (2026)",
  "maildoso":     "Infrabox vs Maildoso (2026)",
  "inframail":    "Infrabox vs Inframail (2026)",
  "mailreef":     "Infrabox vs Mailreef (2026)",
  "hypertide":    "Infrabox vs Hypertide (2026)",
  "instantly":    "Infrabox vs Instantly (2026)",
  "smartlead":    "Infrabox vs SmartLead (2026)",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(p)        { return fs.readFileSync(p, "utf8"); }
function writeFile(p, c)    { fs.writeFileSync(p, c, "utf8"); }
function exists(p)          { return fs.existsSync(p); }

// Walk all files under app/ that match layout.js
function findAllLayouts() {
  const results = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name === "layout.js") results.push(full);
    }
  }
  walk(path.join(ROOT, "app"));
  return results;
}

// Replace the FIRST `title:` field's string literal in a file.
// Handles single-line and multi-line forms, " ' ` quote styles.
// Returns { content, oldValue } or null if not found / non-string.
function replaceFirstTitleField(content, newValue) {
  const idx = content.indexOf("title:");
  if (idx < 0) return null;
  let i = idx + "title:".length;
  while (i < content.length && /\s/.test(content[i])) i++;
  const quote = content[i];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  let j = i + 1;
  let raw = "";
  while (j < content.length && content[j] !== quote) {
    if (content[j] === "\\" && j + 1 < content.length) {
      raw += content[j] + content[j + 1];
      j += 2;
      continue;
    }
    raw += content[j];
    j += 1;
  }
  if (j >= content.length) return null;
  // Build a safely-escaped double-quoted literal for the new value.
  const escaped = newValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const before = content.slice(0, i);
  const after = content.slice(j + 1);
  const next = before + '"' + escaped + '"' + after;
  return { content: next, oldValue: raw };
}

// Strip a trailing " | Infrabox" (or template-literal "| ${config.appName}")
// from a quoted string. Operates on the first `title:` value in the file.
function stripTrailingInfrabox(content) {
  const idx = content.indexOf("title:");
  if (idx < 0) return null;
  let i = idx + "title:".length;
  while (i < content.length && /\s/.test(content[i])) i++;
  const quote = content[i];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;
  let j = i + 1;
  let raw = "";
  while (j < content.length && content[j] !== quote) {
    if (content[j] === "\\" && j + 1 < content.length) {
      raw += content[j] + content[j + 1];
      j += 2;
      continue;
    }
    raw += content[j];
    j += 1;
  }
  if (j >= content.length) return null;
  // Possible trailing patterns to strip:
  //   " | Infrabox"
  //   " | ${config.appName}"
  //   " - Infrabox"  (one tool file uses a dash; leave that for the explicit edit list)
  const patterns = [" | Infrabox", " | ${config.appName}"];
  let stripped = raw;
  let didStrip = false;
  for (const pat of patterns) {
    if (stripped.endsWith(pat)) {
      stripped = stripped.slice(0, -pat.length);
      didStrip = true;
      break;
    }
  }
  if (!didStrip) return null;
  const escaped = stripped.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const before = content.slice(0, i);
  const after = content.slice(j + 1);
  return { content: before + '"' + escaped + '"' + after, oldValue: raw, newValue: stripped };
}

// ---------------------------------------------------------------------------
// 1. /learn/* article titles
// ---------------------------------------------------------------------------
const articlesDir = path.join(ROOT, "app", "learn", "[slug]", "articles");

for (const [slug, newTitle] of Object.entries(LEARN_REWRITES)) {
  const p = path.join(articlesDir, `${slug}.js`);
  if (!exists(p)) {
    errors.push(`MISSING article file: ${p}`);
    continue;
  }
  const before = readFile(p);
  const r = replaceFirstTitleField(before, newTitle);
  if (!r) {
    errors.push(`Could not find title: field in ${slug}.js`);
    continue;
  }
  if (r.oldValue === newTitle) {
    warnings.push(`No change (already up to date): ${slug}`);
    continue;
  }
  writeFile(p, r.content);
  updates.push({ kind: "learn", file: `app/learn/[slug]/articles/${slug}.js`, old: r.oldValue, new: newTitle });
}

// ---------------------------------------------------------------------------
// 2. Explicit layout rewrites
// ---------------------------------------------------------------------------
for (const [rel, newTitle] of Object.entries(LAYOUT_REWRITES)) {
  const p = path.join(ROOT, rel);
  if (!exists(p)) {
    errors.push(`MISSING layout file: ${p}`);
    continue;
  }
  const before = readFile(p);
  const r = replaceFirstTitleField(before, newTitle);
  if (!r) {
    errors.push(`Could not find title: field in ${rel}`);
    continue;
  }
  writeFile(p, r.content);
  updates.push({ kind: "layout", file: rel, old: r.oldValue, new: newTitle });
}

// ---------------------------------------------------------------------------
// 3. Strip trailing " | Infrabox" from every other layout.js
// ---------------------------------------------------------------------------
const explicitLayouts = new Set(Object.keys(LAYOUT_REWRITES).map(r => path.join(ROOT, r)));
for (const p of findAllLayouts()) {
  if (explicitLayouts.has(p)) continue;
  if (p === path.join(ROOT, "app", "layout.js")) continue; // root layout owns the template
  const before = readFile(p);
  const r = stripTrailingInfrabox(before);
  if (!r) continue;
  writeFile(p, r.content);
  updates.push({
    kind: "strip",
    file: path.relative(ROOT, p).replace(/\\/g, "/"),
    old: r.oldValue,
    new: r.newValue,
  });
}

// ---------------------------------------------------------------------------
// 4. /compare/[slug] data-file entry rewrites
// ---------------------------------------------------------------------------
const compareDataPath = path.join(ROOT, "app", "compare", "[slug]", "compare-data.js");
if (exists(compareDataPath)) {
  let content = readFile(compareDataPath);
  for (const [slug, newTitle] of Object.entries(COMPARE_REWRITES)) {
    // Locate `slug: "<slug>"`, then the next `title:` field after it.
    const slugMarker = `slug: "${slug}"`;
    const slugIdx = content.indexOf(slugMarker);
    if (slugIdx < 0) {
      errors.push(`compare-data.js: could not find slug "${slug}"`);
      continue;
    }
    const segmentStart = slugIdx;
    const titleRelIdx = content.indexOf("title:", segmentStart);
    if (titleRelIdx < 0) {
      errors.push(`compare-data.js: no title: after slug "${slug}"`);
      continue;
    }
    // Reuse replaceFirstTitleField on the substring starting at the slug.
    const slice = content.slice(segmentStart);
    const r = replaceFirstTitleField(slice, newTitle);
    if (!r) {
      errors.push(`compare-data.js: failed to rewrite title for "${slug}"`);
      continue;
    }
    content = content.slice(0, segmentStart) + r.content;
    updates.push({ kind: "compare", file: "app/compare/[slug]/compare-data.js", old: r.oldValue, new: newTitle });
  }
  writeFile(compareDataPath, content);
}

// ---------------------------------------------------------------------------
// Validation pass
// ---------------------------------------------------------------------------
const validation = {
  overLength: [],         // final title > 60 chars
  doubleSuffix: [],       // "| Infrabox | Infrabox" anywhere in titles
  badChars: [],           // U+FFFD or other replacement chars
};

function checkValue(file, kind, raw, rendersAsFinal = true) {
  const final = rendersAsFinal ? raw + SUFFIX : raw;
  if (final.length > MAX_FINAL_LEN) {
    validation.overLength.push({ file, kind, raw, final, len: final.length });
  }
  if (/\|\s*Infrabox\s*\|\s*Infrabox/i.test(raw + SUFFIX)) {
    validation.doubleSuffix.push({ file, kind, raw });
  }
  // U+FFFD is the encoding-replacement char that produced the original "�" bug.
  if (/�/.test(raw)) {
    validation.badChars.push({ file, kind, raw });
  }
}

// Validate /learn titles
for (const slug of Object.keys(LEARN_REWRITES)) {
  const p = path.join(articlesDir, `${slug}.js`);
  if (!exists(p)) continue;
  const r = replaceFirstTitleField(readFile(p), "__probe__");
  if (!r) continue;
  // Re-read with current value by extracting it.
  // Easier: parse the title again.
  const content = readFile(p);
  const i = content.indexOf("title:");
  let k = i + "title:".length;
  while (/\s/.test(content[k])) k++;
  const q = content[k];
  let m = k + 1;
  let val = "";
  while (m < content.length && content[m] !== q) {
    if (content[m] === "\\") { val += content[m + 1]; m += 2; continue; }
    val += content[m]; m++;
  }
  checkValue(`app/learn/[slug]/articles/${slug}.js`, "learn", val, true);
}

// Validate all layouts (including stripped + explicit + others).
for (const p of findAllLayouts()) {
  const content = readFile(p);
  const i = content.indexOf("title:");
  if (i < 0) continue;
  let k = i + "title:".length;
  while (/\s/.test(content[k])) k++;
  const q = content[k];
  if (q !== '"' && q !== "'" && q !== "`") continue;
  let m = k + 1;
  let val = "";
  while (m < content.length && content[m] !== q) {
    if (content[m] === "\\") { val += content[m + 1]; m += 2; continue; }
    val += content[m]; m++;
  }
  const rel = path.relative(ROOT, p).replace(/\\/g, "/");
  // Root layout uses a title.default + title.template object, not a quoted
  // string for the top-level `title:` key. We skip it.
  if (rel === "app/layout.js") continue;
  // If the value still contains ${config.appName}, expand it for length check.
  const rendered = val.replace(/\$\{config\.appName\}/g, "Infrabox");
  checkValue(rel, "layout", rendered, true);
}

// Validate cheapinboxes compare entry
if (exists(compareDataPath)) {
  const content = readFile(compareDataPath);
  for (const slug of Object.keys(COMPARE_REWRITES)) {
    const slugMarker = `slug: "${slug}"`;
    const slugIdx = content.indexOf(slugMarker);
    if (slugIdx < 0) continue;
    const slice = content.slice(slugIdx);
    const i = slice.indexOf("title:");
    let k = i + "title:".length;
    while (/\s/.test(slice[k])) k++;
    const q = slice[k];
    if (q !== '"' && q !== "'" && q !== "`") continue;
    let m = k + 1;
    let val = "";
    while (m < slice.length && slice[m] !== q) {
      if (slice[m] === "\\") { val += slice[m + 1]; m += 2; continue; }
      val += slice[m]; m++;
    }
    checkValue(`app/compare/[slug]/compare-data.js#${slug}`, "compare", val, true);
  }
}

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
      overLength: validation.overLength.length,
      doubleSuffix: validation.doubleSuffix.length,
      badChars: validation.badChars.length,
    },
  },
  updates,
  errors,
  warnings,
  validation,
};

const outPath = path.join(ROOT, ".seo", "scripts", "fix-seo-titles.report.json");
writeFile(outPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify(report.summary, null, 2));
console.log(`\nFull report: ${outPath}`);
if (errors.length) {
  console.log("\nERRORS:");
  for (const e of errors) console.log(`  - ${e}`);
}
if (validation.overLength.length) {
  console.log("\nOVER LENGTH (final >60 chars):");
  for (const v of validation.overLength) console.log(`  - [${v.len}] ${v.file}: ${v.final}`);
}
if (validation.doubleSuffix.length) {
  console.log("\nDOUBLE SUFFIX:");
  for (const v of validation.doubleSuffix) console.log(`  - ${v.file}: ${v.raw}`);
}
if (validation.badChars.length) {
  console.log("\nBAD CHARS:");
  for (const v of validation.badChars) console.log(`  - ${v.file}: ${v.raw}`);
}
