#!/usr/bin/env node
// Parse-check every file modified by the meta-description fixer using espree.
// Run from the project root: `node .seo/scripts/parse-check-meta-descriptions.mjs`
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const report = JSON.parse(fs.readFileSync(path.join(ROOT, ".seo", "scripts", "fix-seo-meta-descriptions.report.json"), "utf8"));
const files = [...new Set(report.updates.map(u => u.file))].map(rel => path.join(ROOT, rel));

const espree = await import("espree");
const errors = [];
for (const f of files) {
  try {
    espree.parse(fs.readFileSync(f, "utf8"), { ecmaVersion: 2024, sourceType: "module", ecmaFeatures: { jsx: true } });
  } catch (e) {
    errors.push({ file: path.relative(ROOT, f).replace(/\\/g, "/"), error: e.message.split("\n")[0] });
  }
}
console.log(JSON.stringify({ filesChecked: files.length, errors: errors.length }, null, 2));
if (errors.length) { console.log("\nPARSE ERRORS:"); for (const e of errors) console.log(`  - ${e.file}: ${e.error}`); process.exit(1); }
