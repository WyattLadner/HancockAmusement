import { NextResponse } from "next/server";

// Updates a darts league's LeagueLeader shared-report link (the code changes each
// season). Parses the pasted share URL, then commits data/leagues/darts-reports.json
// back to the repo. Gated by ADMIN_PASSWORD.
export const runtime = "nodejs";

const DARTS_LEAGUES = new Set(["tuesday-dart", "remote-monday-cash", "remote-thursday-cash"]);
const FILE = "data/leagues/darts-reports.json";
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

// Pull operatorid + code out of a LeagueLeader share URL (or accept a bare code).
function parseReport(input) {
  const s = String(input || "").trim();
  const opMatch = s.match(/operatorid=(\d+)/i);
  const codeMatch = s.match(/code=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i)
    || s.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  if (!codeMatch) return null;
  return { operatorId: opMatch ? Number(opMatch[1]) : 113, code: codeMatch[1].toLowerCase() };
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

  const { league, password, url } = body || {};
  if (password !== adminPassword) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  if (!DARTS_LEAGUES.has(league)) return NextResponse.json({ error: "Pick a valid darts league." }, { status: 400 });

  const parsed = parseReport(url);
  if (!parsed) {
    return NextResponse.json({ error: "That doesn't look like a League Leader share link (no valid code found)." }, { status: 422 });
  }

  try {
    const getRes = await gh(`contents/${FILE}?ref=${BRANCH}`, token);
    if (!getRes.ok) return NextResponse.json({ error: `GitHub read failed (${getRes.status}).` }, { status: 502 });
    const cur = await getRes.json();
    let reports = {};
    try {
      reports = JSON.parse(Buffer.from(cur.content, "base64").toString("utf8"));
    } catch {
      reports = {};
    }
    reports[league] = parsed;

    const putRes = await gh(`contents/${FILE}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update ${league} LeagueLeader report link`,
        content: Buffer.from(JSON.stringify(reports, null, 2) + "\n", "utf8").toString("base64"),
        sha: cur.sha,
        branch: BRANCH,
      }),
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      return NextResponse.json({ error: `GitHub write failed (${putRes.status}).`, details: t.slice(0, 300) }, { status: 502 });
    }
    return NextResponse.json({ ok: true, league, operatorId: parsed.operatorId, code: parsed.code });
  } catch (e) {
    return NextResponse.json({ error: "Update failed.", details: String(e).slice(0, 300) }, { status: 500 });
  }
}
