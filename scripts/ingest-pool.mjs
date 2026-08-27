#!/usr/bin/env node
/**
 * Pool standings ingest — SCAFFOLD / STUB (parser not built yet).
 *
 * WHY THIS IS A STUB
 * ------------------
 * Pool results today flow: recorded manually → sent to Caleb → Caleb types them into
 * Excel → exported as PNG/PDF and uploaded to Wix. The goal is to let Caleb drop the
 * file he's sent into an inbox and have the site update. Whether that can be automatic
 * depends entirely on WHAT FORMAT he receives — which is still unknown:
 *
 *   - Structured file (Word table / Excel / CSV) → deterministic parse. Very doable.
 *   - Photo of a PRINTED sheet            → OCR + mandatory human verify.
 *   - Photo of HANDWRITTEN notes          → not reliably automatable; fix upstream.
 *
 * Do NOT build the parser until a real sample of Caleb's file exists. See
 * memory/league-data-discovery.md.
 *
 * THE CONTRACT (already wired up downstream)
 * ------------------------------------------
 * This script's only job is to WRITE files matching data/pool/<key>.json, whose schema
 * the site already renders (components/PoolStandings.js reads it). Row schema:
 *
 *   { "team": string, "winPct": number, "played": number, "won": number, "notes": "" | "*" | "**" }
 *
 * File schema: { league, updated, source, statsDeadline, footnotes[], makeupNotice, standings[] }
 *
 * INTENDED FLOW (once the input format is known)
 * ----------------------------------------------
 *   1. Read a dropped source file from an inbox (path via CLI arg or a watched folder).
 *   2. Parse it into the row schema above (parser TBD, format-dependent).
 *   3. Write data/pool/<key>.json.
 *   4. Caleb reviews a preview, then it publishes (commit/deploy). Human verify is
 *      REQUIRED before standings change — never auto-publish unverified OCR output.
 *
 * Usage (once implemented):  node scripts/ingest-pool.mjs <sourceFile> <key>
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data", "pool");

/** Validate a standings row against the contract the site renders. */
export function validateRow(row) {
  const errors = [];
  if (!row || typeof row.team !== "string" || !row.team.trim())
    errors.push("team must be a non-empty string");
  for (const k of ["winPct", "played", "won"]) {
    if (typeof row[k] !== "number" || Number.isNaN(row[k]))
      errors.push(`${k} must be a number`);
  }
  if (row.notes !== undefined && !["", "*", "**"].includes(row.notes))
    errors.push('notes must be "", "*", or "**"');
  return errors;
}

/** Write a validated standings payload to data/pool/<key>.json. */
export async function writePoolData(key, payload) {
  if (!Array.isArray(payload?.standings))
    throw new Error("payload.standings must be an array");
  const rowErrors = payload.standings.flatMap((r, i) =>
    validateRow(r).map((e) => `row ${i}: ${e}`)
  );
  if (rowErrors.length)
    throw new Error("Invalid standings:\n" + rowErrors.join("\n"));

  const file = path.join(DATA_DIR, `${key}.json`);
  await writeFile(file, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return file;
}

function main() {
  console.error(
    [
      "pool ingest is not implemented yet — this is a scaffold.",
      "Blocked on a real sample of the file Caleb receives (format unknown).",
      "The data contract and downstream rendering are already in place;",
      "only the source-file parser remains. See the comment block in this file.",
    ].join("\n")
  );
  process.exit(1);
}

// Only run the CLI guard when executed directly (not when imported for its helpers).
import { fileURLToPath } from "node:url";
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
