#!/usr/bin/env node
/**
 * One-off/repeatable converter: turns the league PDFs' extracted TEXT into the
 * native data the site renders — schedules -> JSON, rules -> Markdown. Run when
 * new schedule/rules PDFs are issued.
 *
 * Input: plain-text extractions (via mupdf) of the source PDFs, in a directory
 *   passed as argv[2] (defaults to ./_pdf_text). Expected filenames below.
 * Output: data/leagues/schedule/<slug>.json and data/leagues/rules/<set>.md
 */
import fs from "node:fs";
import path from "node:path";

const IN = process.argv[2] || path.join(process.cwd(), "_pdf_text");
const OUT_SCHED = path.join(process.cwd(), "data", "leagues", "schedule");
const OUT_RULES = path.join(process.cwd(), "data", "leagues", "rules");
fs.mkdirSync(OUT_SCHED, { recursive: true });
fs.mkdirSync(OUT_RULES, { recursive: true });

const read = (f) => fs.readFileSync(path.join(IN, f), "utf8");
const norm = (s) => s.replace(/=====\s*PAGE[^=]*=====/g, " ").replace(/\s+/g, " ").trim();

// ---------- SCHEDULES ----------
function parseSchedule(txt) {
  let s = norm(txt);
  // Repair fragmentation seen in the darts PDFs: split dates ("4/28/202 6" -> "4/28/2026")
  // and split separators ("v s" -> "vs"). Harmless for the already-clean pool PDFs.
  s = s.replace(/(\d{1,2}\/\d{1,2}\/\d{2,3})\s+(\d{1,2})\b/g, "$1$2");
  s = s.replace(/\bv\s+s\b/g, "vs");
  const weekRe = /Week\s+(\d+)\s+(\d{1,2}\/\d{1,2}\/\d{4})/g;
  const heads = [];
  let m;
  while ((m = weekRe.exec(s))) heads.push({ week: +m[1], date: m[2], kwStart: m.index, end: weekRe.lastIndex });
  const weeks = [];
  for (let i = 0; i < heads.length; i++) {
    const slice = s.slice(heads[i].end, i + 1 < heads.length ? heads[i + 1].kwStart : undefined);
    const matchRe = /(\d{1,2}\/\d{1,2}\/\d{4})\s+(.+?)\s+vs\s+(.+?)\s+at\s+(.+?)(?=\s+\d{1,2}\/\d{1,2}\/\d{4}\s|\s*$)/g;
    const matches = [];
    let mm;
    while ((mm = matchRe.exec(slice))) {
      matches.push({ home: mm[2].trim(), away: mm[3].trim(), venue: mm[4].trim() });
    }
    weeks.push({ week: heads[i].week, date: heads[i].date, matches });
  }
  return weeks;
}

// ---------- RULES: pool clean outline -> markdown ----------
function poolRulesToMd(txt) {
  const lines = txt.split(/\r?\n/).map((l) => l.replace(/\s+$/, ""));
  const items = [];
  let cur = null;
  const flush = () => { if (cur) { cur.text = cur.text.trim(); items.push(cur); cur = null; } };
  const type = (t) =>
    /^[IVXL]+\.$/.test(t) ? "roman" :
    /^[A-Z]\.$/.test(t) ? "letter" :
    /^\d+\.$/.test(t) ? "num" :
    /^[a-z]\.\)$/.test(t) || /^[a-z]\)$/.test(t) ? "sub" : null;
  for (const raw of lines) {
    const t = raw.trim();
    if (!t || /^=+ PAGE/.test(t) || /RULES \(New/.test(t) || /^HANCOCK AMUSEMENT$/.test(t) || /^POOL LEAGUE$/.test(t)) continue;
    const ty = type(t);
    if (ty) { flush(); cur = { type: ty, marker: t.replace(/[.)]/g, ""), text: "" }; }
    else if (cur) cur.text += " " + t;
  }
  flush();
  let md = `# Pool League Rules\n\n_New as of June 2026_\n`;
  for (const it of items) {
    // Keep the source's original heading casing (accurate acronyms: LLC, HA-LLC, ATM).
    if (it.type === "roman") md += `\n## ${it.marker}. ${it.text}\n`;
    else if (it.type === "letter") md += `\n### ${it.marker}. ${it.text}\n`;
    else if (it.type === "num") md += `${it.marker}. ${it.text}\n`;
    else if (it.type === "sub") md += `    - ${it.text}\n`;
  }
  return md;
}

// ---------- RULES: darts prose+bullets -> markdown ----------
const DART_HEADINGS = [
  "Basic Information", "League Play", "Sanction Fees", "Captain's Expectations",
  "Captains Expectations", "League Rules", "Substitutes", "Subs", "Forfeits",
  "Playoffs", "Play Offs", "Payouts", "Pay Outs", "Rescheduling", "Conduct",
  "Remote League", "In Person", "Scoring", "Awards",
];
function dartsRulesToMd(txt, heading) {
  let s = norm(txt).replace(/[’‘]/g, "'"); // normalize curly apostrophes for heading matching
  // Break bullets onto their own lines
  s = s.replace(/\s*•\s*/g, "\n• ");
  // Promote known section headings to their own markdown headings
  for (const h of DART_HEADINGS) {
    const re = new RegExp(`\\s*(?<![#\\w])${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=\\s+[A-Z•])`, "g");
    s = s.replace(re, `\n\n### ${h}\n`);
  }
  const out = [`# ${heading}`, ""];
  for (const line of s.split(/\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("###")) out.push("", t, "");
    else if (t.startsWith("• ")) out.push(`- ${t.slice(2).trim()}`);
    else out.push(t);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

// ---------- RUN ----------
const schedules = {
  "wednesday-a-pool": "pool-schedule.txt",
  "wednesday-b-pool": "pool-b-schedule.txt",
  "tuesday-dart": "darts-schedule.txt",
  "remote-monday-cash": "monday-schedule.txt",
  "remote-thursday-cash": "thursday-schedule.txt",
};
for (const [slug, file] of Object.entries(schedules)) {
  const weeks = parseSchedule(read(file));
  const total = weeks.reduce((n, w) => n + w.matches.length, 0);
  fs.writeFileSync(path.join(OUT_SCHED, `${slug}.json`),
    JSON.stringify({ slug, source: file, weeks }, null, 2) + "\n");
  console.log(`schedule ${slug}: ${weeks.length} weeks, ${total} matches`);
}

fs.writeFileSync(path.join(OUT_RULES, "pool.md"), poolRulesToMd(read("pool-rules.txt")));
fs.writeFileSync(path.join(OUT_RULES, "darts-inhouse.md"), dartsRulesToMd(read("darts-rules.txt"), "Tuesday Dart League Rules"));
fs.writeFileSync(path.join(OUT_RULES, "darts-remote.md"), dartsRulesToMd(read("darts-rules-remote.txt"), "Remote Cash League Rules"));
console.log("rules: pool.md, darts-inhouse.md, darts-remote.md written");
