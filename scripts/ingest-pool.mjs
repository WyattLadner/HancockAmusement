#!/usr/bin/env node
/**
 * Pool standings ingest (CLI) — parses Caleb's pool workbook (e.g. "POOLA 26.xlsx")
 * and writes the standings JSON the site renders (data/pool/<key>.json).
 *
 * This is the command-line path; the same parsing runs in the browser on the /admin
 * upload page (both use lib/poolParse.js). The workbook's "SCORE SHEET" tab holds the
 * team standings; "SUMMARY SHEET" holds per-player win% (not ingested here yet).
 *
 * Existing metadata (statsDeadline, footnotes, makeupNotice) in the target JSON is
 * preserved; only standings, week, updated, and source are refreshed.
 *
 * Usage:  node scripts/ingest-pool.mjs "<path/to/POOLA 26.xlsx>" <key>
 *   e.g.  node scripts/ingest-pool.mjs "./POOLA 26.xlsx" wednesday-a
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parseScoreSheet } from "../lib/poolParse.js";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx"); // SheetJS ships CJS; load it via require in ESM.

const DATA_DIR = path.join(process.cwd(), "data", "pool");

function scoreSheetRows(wb) {
  const name = wb.SheetNames.find((n) => /score\s*sheet/i.test(n));
  if (!name) throw new Error('No "SCORE SHEET" tab found');
  return XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, blankrows: false, defval: "" });
}

export function writePoolData(key, parsed) {
  const file = path.join(DATA_DIR, `${key}.json`);
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(file, "utf8")); } catch { /* new file */ }
  const payload = {
    ...existing,
    source: "xlsx",
    week: parsed.week ?? existing.week ?? null,
    updated: new Date().toISOString().slice(0, 10),
    standings: parsed.standings,
  };
  delete payload._comment;
  fs.writeFileSync(file, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return { file, count: parsed.standings.length, week: payload.week };
}

function main() {
  const [srcArg, key] = process.argv.slice(2);
  if (!srcArg || !key) {
    console.error('Usage: node scripts/ingest-pool.mjs "<path to .xlsx>" <key>');
    process.exit(1);
  }
  const parsed = parseScoreSheet(scoreSheetRows(XLSX.readFile(srcArg)));
  const res = writePoolData(key, parsed);
  console.log(`Wrote ${res.file}: ${res.count} teams, week ${res.week}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
