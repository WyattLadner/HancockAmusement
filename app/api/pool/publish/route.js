import { NextResponse } from "next/server";
import { validatePayload } from "@/lib/poolParse";

// Publishes uploaded pool standings by committing data/pool/<key>.json back to the
// GitHub repo, which triggers a Vercel redeploy. Gated by ADMIN_PASSWORD. Existing
// metadata (deadline, footnotes, makeup notice) is preserved server-side.
export const runtime = "nodejs";

const ALLOWED_KEYS = { "wednesday-a": "Wednesday A Division Pool", "wednesday-b": "Wednesday B Division Pool" };
const REPO = process.env.GITHUB_REPO || "WyattLadner/HancockAmusement";
const BRANCH = process.env.GITHUB_BRANCH || "main";

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

  const { key, password, week, standings, players } = body || {};
  if (password !== adminPassword) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  if (!ALLOWED_KEYS[key]) {
    return NextResponse.json({ error: "Unknown league." }, { status: 400 });
  }
  const errors = validatePayload({ standings });
  if (errors.length) {
    return NextResponse.json({ error: "Invalid standings.", details: errors }, { status: 422 });
  }

  const filePath = `data/pool/${key}.json`;
  try {
    // Read current file (for its sha + to preserve metadata).
    let sha;
    let existing = {};
    const getRes = await gh(`contents/${filePath}?ref=${BRANCH}`, token);
    if (getRes.ok) {
      const cur = await getRes.json();
      sha = cur.sha;
      try {
        existing = JSON.parse(Buffer.from(cur.content, "base64").toString("utf8"));
      } catch {
        existing = {};
      }
    } else if (getRes.status !== 404) {
      return NextResponse.json({ error: `GitHub read failed (${getRes.status}).` }, { status: 502 });
    }

    const merged = {
      ...existing,
      league: existing.league || ALLOWED_KEYS[key],
      source: "admin-upload",
      week: week ?? existing.week ?? null,
      updated: new Date().toISOString().slice(0, 10),
      standings,
      players: Array.isArray(players) ? players : existing.players ?? [],
    };
    delete merged._comment;

    const putRes = await gh(`contents/${filePath}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update ${ALLOWED_KEYS[key]} standings${week ? ` — Week ${week}` : ""}`,
        content: Buffer.from(JSON.stringify(merged, null, 2) + "\n", "utf8").toString("base64"),
        sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) {
      const t = await putRes.text();
      return NextResponse.json({ error: `GitHub write failed (${putRes.status}).`, details: t.slice(0, 300) }, { status: 502 });
    }

    return NextResponse.json({ ok: true, key, week: merged.week, teams: standings.length });
  } catch (e) {
    return NextResponse.json({ error: "Publish failed.", details: String(e).slice(0, 300) }, { status: 500 });
  }
}
