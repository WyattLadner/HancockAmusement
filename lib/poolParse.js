// Pure parsing logic for Caleb's pool workbook, shared by the CLI ingest script
// and the in-browser /admin uploader. Takes the SCORE SHEET as a 2D array of rows
// (produced by SheetJS `sheet_to_json(ws, { header: 1 })`) and returns the standings
// in the site's schema. No SheetJS import here so it runs anywhere.

export function titleCase(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\b[a-z0-9]/g, (c) => c.toUpperCase())
    .replace(/\s+/g, " ");
}

const isNum = (v) => typeof v === "number" && isFinite(v);

// Find "WEEK n" anywhere in the sheet.
export function findWeek(rows) {
  for (const r of rows) {
    for (const c of r) {
      const m = /week\s*(\d+)/i.exec(String(c));
      if (m) return Number(m[1]);
    }
  }
  return null;
}

// A standings row = a team name (text) immediately followed by two numbers
// (played, won). Detected positionally so it survives the workbook's leading blank
// column, the venue column before the team, and minor layout shifts.
export function parseStandingsRows(rows) {
  const standings = [];
  for (const r of rows) {
    let j = -1;
    for (let k = 0; k < r.length - 2; k++) {
      const t = String(r[k] || "").trim();
      if (t && !isNum(r[k]) && !/^(team|played|won)$/i.test(t) && isNum(r[k + 1]) && isNum(r[k + 2])) {
        j = k;
        break;
      }
    }
    if (j < 0) continue;
    const team = String(r[j]).trim();
    const played = r[j + 1];
    const won = r[j + 2];
    const frac = r.find((c) => isNum(c) && c > 0 && c <= 1.5);
    const pct = frac != null ? frac * 100 : played ? (won / played) * 100 : 0;
    let notes = String(r[j + 3] || "").trim();
    if (!["*", "**", "B", "F"].includes(notes)) notes = "";
    standings.push({ team: titleCase(team), winPct: Math.round(pct), played, won, notes });
  }
  return standings;
}

// Full parse of a SCORE SHEET's rows.
export function parseScoreSheet(rows) {
  const standings = parseStandingsRows(rows);
  if (!standings.length) throw new Error("No standings rows found on the SCORE SHEET.");
  return { week: findWeek(rows), standings };
}

// Validate a payload before it is published.
export function validatePayload(payload) {
  const errors = [];
  if (!Array.isArray(payload?.standings) || !payload.standings.length)
    errors.push("standings must be a non-empty array");
  (payload?.standings || []).forEach((row, i) => {
    if (!row || typeof row.team !== "string" || !row.team.trim()) errors.push(`row ${i}: team required`);
    for (const k of ["winPct", "played", "won"])
      if (typeof row[k] !== "number" || Number.isNaN(row[k])) errors.push(`row ${i}: ${k} must be a number`);
  });
  return errors;
}
