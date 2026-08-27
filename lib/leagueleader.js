// Fetch + parse a LeagueLeader public shared report into structured data we can
// render in our own design (client requirement: no plain link-out).
//
// The report is an HTML page whose data lives in <pre> blocks as fixed-width,
// pipe-delimited ASCII tables bounded by +---+ rule lines, e.g.:
//
//   ----------------------+-------+-------+------+
//    Team                 | Win % | Games | Wins |
//   ----------------------+-------+-------+------+
//    Sadies Boys          |  66.7 |   195 |  130 |
//   ----------------------+-------+-------+------+
//
// We fetch server-side (no CORS concern) with Next revalidation so darts standings
// stay fresh automatically without a manual rebuild.

import { reportUrl } from "@/lib/leagues";

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Pull the concatenated text out of all <pre> blocks.
function extractPreText(html) {
  const blocks = [...html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/gi)].map((m) =>
    decodeEntities(m[1])
  );
  return blocks.join("\n");
}

const isRule = (line) => /^[\s-]*\+[-+\s]*$/.test(line) && line.includes("+");
const isRow = (line) => line.includes("|");

function splitRow(line) {
  // Rows look like "| a | b | c |" — split on |, drop the empty ends, trim cells.
  const parts = line.split("|").map((c) => c.trim());
  if (parts.length && parts[0] === "") parts.shift();
  if (parts.length && parts[parts.length - 1] === "") parts.pop();
  return parts;
}

// Parse every pipe/rule table out of the text, tagging each with the nearest
// preceding descriptive line(s) as its title.
function parseTables(text) {
  const lines = text.split(/\r?\n/);
  const tables = [];
  let pendingTitle = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isRule(line)) {
      // A table starts: rule, header row, rule, data rows..., rule.
      const headerLine = lines[i + 1];
      if (headerLine && isRow(headerLine) && isRule(lines[i + 2] || "")) {
        const headers = splitRow(headerLine);
        const rows = [];
        let j = i + 3;
        for (; j < lines.length; j++) {
          if (isRule(lines[j])) break;
          if (isRow(lines[j])) rows.push(splitRow(lines[j]));
          else break;
        }
        tables.push({
          title: pendingTitle.join(" ").trim(),
          headers,
          rows,
        });
        pendingTitle = [];
        i = j; // resume at the closing rule
        continue;
      }
    }

    // Accumulate non-table descriptive lines as the next table's title.
    if (line.trim() === "") {
      pendingTitle = [];
    } else if (!isRow(line) && !isRule(line)) {
      pendingTitle.push(line.trim().replace(/[:]+$/, ""));
      if (pendingTitle.length > 2) pendingTitle.shift();
    }
  }
  return tables;
}

function parseMeta(text) {
  const league = (text.match(/League:\s*[^,]+,\s*(.+)/) || [])[1]?.trim() || null;
  const reportDate = (text.match(/Report Date:\s*(.+)/) || [])[1]?.trim() || null;
  const division = (text.match(/^Division\s+(.+)$/m) || [])[1]?.trim() || null;
  return { league, reportDate, division };
}

// Find the team-standings table and normalize it for the compact standings view.
function normalizeStandings(tables) {
  const t = tables.find(
    (tb) =>
      tb.headers.some((h) => /team/i.test(h)) &&
      tb.headers.some((h) => /win\s*%/i.test(h))
  );
  if (!t) return null;
  const idx = (re) => t.headers.findIndex((h) => re.test(h));
  const iTeam = idx(/team/i);
  const iPct = idx(/win\s*%/i);
  const iGames = idx(/games/i);
  const iWins = idx(/wins/i);
  const standings = t.rows
    .filter((r) => r[iTeam])
    .map((r) => ({
      team: r[iTeam],
      winPct: iPct >= 0 ? parseFloat(r[iPct]) : null,
      games: iGames >= 0 ? Number(r[iGames]) : null,
      wins: iWins >= 0 ? Number(r[iWins]) : null,
    }));
  return standings;
}

// Everything that isn't the primary team-standings table (most-improved, per-player
// X01/Cricket stat tables) — rendered as secondary, scrollable stat tables.
function extraTables(tables) {
  return tables.filter(
    (tb) =>
      !(
        tb.headers.some((h) => /team/i.test(h)) &&
        tb.headers.some((h) => /win\s*%/i.test(h))
      )
  );
}

/**
 * Fetch and parse a darts league's LeagueLeader report.
 * Returns { url, meta, standings, tables } or throws on network/parse failure
 * (callers should fall back to a link-out on error).
 */
export async function fetchReport(league, { revalidate = 1800 } = {}) {
  const url = reportUrl(league);
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`LeagueLeader ${res.status} for ${league.slug}`);
  const html = await res.text();
  const text = extractPreText(html);
  const tables = parseTables(text);
  return {
    url,
    meta: parseMeta(text),
    standings: normalizeStandings(tables),
    tables: extraTables(tables),
  };
}
