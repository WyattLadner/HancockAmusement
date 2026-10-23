import { NextResponse } from "next/server";

// Sets or clears a short per-league notice shown above the standings. Commits
// data/leagues/notices.json (slug -> message) back to the repo, which triggers a
// Vercel redeploy. Gated by ADMIN_PASSWORD. Lets Caleb post announcements himself.
export const runtime = "nodejs";

const LEAGUES = new Set([
  "remote-monday-cash",
  "tuesday-dart",
  "wednesday-a-pool",
  "wednesday-b-pool",
  "remote-thursday-cash",
]);
const FILE = "data/leagues/notices.json";
const REPO = process.env.GITHUB_REPO || "WyattLadner/HancockAmusement";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const MAX_LEN = 280;

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
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { league, password, text } = body || {};
  if (password !== adminPassword) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  if (!LEAGUES.has(league)) return NextResponse.json({ error: "Pick a valid league." }, { status: 400 });

  const note = String(text ?? "").trim().replace(/\s+/g, " ");
  if (note.length > MAX_LEN) {
    return NextResponse.json({ error: `Note is too long (max ${MAX_LEN} characters).` }, { status: 422 });
  }

  try {
    let notices = {};
    let sha;
    const getRes = await gh(`contents/${FILE}?ref=${BRANCH}`, token);
    if (getRes.ok) {
      const cur = await getRes.json();
      sha = cur.sha;
      try {
        notices = JSON.parse(Buffer.from(cur.content, "base64").toString("utf8"));
      } catch {
        notices = {};
      }
    } else if (getRes.status !== 404) {
      return NextResponse.json({ error: `GitHub read failed (${getRes.status}).` }, { status: 502 });
    }

    if (note) notices[league] = note;
    else delete notices[league];

    const putRes = await gh(`contents/${FILE}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: note ? `Set ${league} notice` : `Clear ${league} notice`,
        content: Buffer.from(JSON.stringify(notices, null, 2) + "\n", "utf8").toString("base64"),
        sha,
        branch: BRANCH,
      }),
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      return NextResponse.json({ error: `GitHub write failed (${putRes.status}).`, details: t.slice(0, 300) }, { status: 502 });
    }
    return NextResponse.json({ ok: true, league, cleared: !note });
  } catch (e) {
    return NextResponse.json({ error: "Update failed.", details: String(e).slice(0, 300) }, { status: 500 });
  }
}
