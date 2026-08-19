#!/usr/bin/env node
// Parse-only validation: feed every file touched by the title fixer through
// the espree JSX-aware parser (falls back to @babel/parser, then `node --check`)
// to catch syntax issues a title rewrite could have introduced.
//
// Run from the project root: `node .seo/scripts/parse-check-titles.mjs`

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();

const reportPath = path.join(ROOT, ".seo", "scripts", "fix-seo-titles.report.json");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const files = [...new Set(report.updates.map(u => u.file))]
  .map(rel => path.join(ROOT, rel));

const errors = [];
let parser = null;
let parserName = "none";
try {
  parser = await import("espree");
  parserName = "espree";
} catch {
  try {
    parser = await import("@babel/parser");
    parserName = "@babel/parser";
  } catch {}
}

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  try {
    if (parserName === "espree") {
      parser.parse(source, {
        ecmaVersion: 2024,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      });
    } else if (parserName === "@babel/parser") {
      parser.parse(source, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
        errorRecovery: false,
      });
    } else {
      execSync(`node --check "${file}"`, { stdio: "pipe" });
    }
  } catch (e) {
    errors.push({ file: path.relative(ROOT, file).replace(/\\/g, "/"), error: e.message.split("\n")[0] });
  }
}

console.log(JSON.stringify({
  filesChecked: files.length,
  parserUsed: parserName,
  errors: errors.length,
}, null, 2));
if (errors.length) {
  console.log("\nPARSE ERRORS:");
  for (const e of errors) console.log(`  - ${e.file}: ${e.error}`);
  process.exit(1);
}
