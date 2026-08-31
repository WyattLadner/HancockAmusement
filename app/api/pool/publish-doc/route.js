import { NextResponse } from "next/server";

// Publishes an uploaded PDF (pool rules or blank score sheet) by committing it to
// public/docs/ in the repo, which triggers a Vercel redeploy. Gated by ADMIN_PASSWORD.
export const runtime = "nodejs";

// Fixed (site-wide) documents: doc type -> committed path + label.
const DOCS = {
  "pool-rules": { path: "public/docs/pool-rules.pdf", label: "pool rules" },
  "score-sheet": { path: "public/docs/pool-score-sheet.pdf", label: "score sheet" },
};
// Schedules are per-league; the "schedule" docType requires a valid league slug.
const SCHEDULE_LEAGUES = new Set([
  "wednesday-a-pool",
  "wednesday-b-pool",
  "tuesday-dart",
  "remote-monday-cash",
  "remote-thursday-cash",
]);
const REPO = process.env.GITHUB_REPO || "WyattLadner/HancockAmusement";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB cap

function gh(pathname, token, init = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "hancock-amusement-admin",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {}),
    },
  });
}

export async function POST(req) {
  const token = process.env.GITHUB_TOKEN;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!token || !adminPassword) {
    return NextResponse.json({ error: "Server is missing ADMIN_PASSWORD or GITHUB_TOKEN." }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { docType, password, contentBase64, league } = body || {};
  if (password !== adminPassword) return NextResponse.json({ error: "Wrong password." }, { status: 401 });

  // Per-league PDF types (need a valid league slug).
  const PER_LEAGUE = {
    schedule: (l) => ({ path: `public/docs/schedule-${l}.pdf`, label: `${l} schedule` }),
    "team-captains": (l) => ({ path: `public/docs/team-captains-${l}.pdf`, label: `${l} team captains` }),
  };

  let doc;
  if (PER_LEAGUE[docType]) {
    if (!SCHEDULE_LEAGUES.has(league)) {
      return NextResponse.json({ error: "Pick a valid league for this document." }, { status: 400 });
    }
    doc = PER_LEAGUE[docType](league);
  } else {
    doc = DOCS[docType];
  }
  if (!doc) return NextResponse.json({ error: "Unknown document type." }, { status: 400 });
  if (typeof contentBase64 !== "string" || !contentBase64) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  // Basic guards: size + PDF magic bytes ("%PDF").
  const buf = Buffer.from(contentBase64, "base64");
  if (buf.length > MAX_BYTES) return NextResponse.json({ error: "File is too large (max 8 MB)." }, { status: 413 });
  if (buf.slice(0, 4).toString("latin1") !== "%PDF") {
    return NextResponse.json({ error: "That doesn't look like a PDF." }, { status: 422 });
  }

  try {
    let sha;
    const getRes = await gh(`contents/${doc.path}?ref=${BRANCH}`, token);
    if (getRes.ok) sha = (await getRes.json()).sha;
    else if (getRes.status !== 404) return NextResponse.json({ error: `GitHub read failed (${getRes.status}).` }, { status: 502 });

    const putRes = await gh(`contents/${doc.path}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update ${doc.label} PDF`,
        content: contentBase64,
        sha,
        branch: BRANCH,
      }),
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      return NextResponse.json({ error: `GitHub write failed (${putRes.status}).`, details: t.slice(0, 300) }, { status: 502 });
    }
    return NextResponse.json({ ok: true, docType });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed.", details: String(e).slice(0, 300) }, { status: 500 });
  }
}
