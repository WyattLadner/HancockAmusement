"use client";

import { useState } from "react";
import { parseScoreSheet, parsePlayers, isTeamTab } from "@/lib/poolParse";
import PoolStandings from "@/components/PoolStandings";
import PoolPlayers from "@/components/PoolPlayers";

const LEAGUES = [
  { key: "wednesday-a", label: "Wednesday A Division Pool" },
  { key: "wednesday-b", label: "Wednesday B Division Pool" },
];
const DOC_TYPES = [
  { key: "pool-rules", label: "Pool Rules (PDF)" },
  { key: "score-sheet", label: "Blank Score Sheet (PDF)" },
];

const inputClass =
  "w-full rounded-md bg-ink border border-line px-4 py-2.5 text-chalk placeholder:text-smoke/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";
const labelClass = "block text-sm font-display font-bold uppercase tracking-wide text-smoke mb-2";
const cardClass = "rounded-lg border border-line bg-surface-2 p-6 md:p-8 space-y-6";
const btnClass =
  "inline-flex items-center justify-center bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-8 py-3.5 hover:bg-red/90 transition-colors duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

function Status({ status }) {
  if (!status) return null;
  return (
    <div className={`rounded-md px-4 py-3 text-sm ${status.type === "ok" ? "bg-blue/15 border border-blue text-chalk" : "bg-red/15 border border-red text-chalk"}`}>
      {status.msg}
    </div>
  );
}

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export default function AdminPage() {
  const [password, setPassword] = useState("");

  // Standings uploader
  const [leagueKey, setLeagueKey] = useState("wednesday-a");
  const [parsed, setParsed] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  // Document uploader
  const [docType, setDocType] = useState("pool-rules");
  const [docFile, setDocFile] = useState(null);
  const [docStatus, setDocStatus] = useState(null);
  const [docBusy, setDocBusy] = useState(false);

  async function handleFile(e) {
    setStatus(null);
    setParsed(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.SheetNames.find((n) => /score\s*sheet/i.test(n));
      if (!sheet) throw new Error('No "SCORE SHEET" tab found in this workbook.');
      const toRows = (ws) => XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: "" });
      const { week, standings } = parseScoreSheet(toRows(wb.Sheets[sheet]));
      const rowsByTeam = {};
      for (const n of wb.SheetNames) if (isTeamTab(n)) rowsByTeam[n] = toRows(wb.Sheets[n]);
      const players = parsePlayers(rowsByTeam);
      setParsed({ week, standings, players, fileName: file.name });
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Could not read that file." });
    }
  }

  async function publish() {
    if (!parsed) return;
    if (!password) return setStatus({ type: "error", msg: "Enter the password first." });
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/pool/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: leagueKey, password, week: parsed.week, standings: parsed.standings, players: parsed.players }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Publish failed (${res.status}).`);
      setStatus({ type: "ok", msg: `Published ${data.teams} teams${data.week ? ` for Week ${data.week}` : ""}. The site updates in a minute or two.` });
      setParsed(null);
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function uploadDoc() {
    if (!docFile) return setDocStatus({ type: "error", msg: "Choose a PDF first." });
    if (!password) return setDocStatus({ type: "error", msg: "Enter the password first." });
    setDocBusy(true);
    setDocStatus(null);
    try {
      const contentBase64 = await fileToBase64(docFile);
      const res = await fetch("/api/pool/publish-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, password, contentBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status}).`);
      setDocStatus({ type: "ok", msg: "Uploaded. The site updates in a minute or two." });
      setDocFile(null);
    } catch (err) {
      setDocStatus({ type: "error", msg: err.message });
    } finally {
      setDocBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <h1 className="font-display font-bold uppercase tracking-wide text-3xl md:text-5xl mb-2">Pool Admin</h1>
      <p className="text-base text-smoke mb-10">Update standings from the weekly Excel file, or swap the rules / score-sheet PDFs.</p>

      {/* Shared password */}
      <div className="mb-8">
        <label htmlFor="password" className={labelClass}>Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} max-w-sm`} autoComplete="off" placeholder="••••••••" />
      </div>

      {/* Standings */}
      <h2 className="font-display font-bold uppercase tracking-wide text-2xl mb-4">Standings &amp; Player Stats</h2>
      <div className={cardClass}>
        <div>
          <label htmlFor="league" className={labelClass}>Division</label>
          <select id="league" value={leagueKey} onChange={(e) => setLeagueKey(e.target.value)} className={inputClass}>
            {LEAGUES.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="file" className={labelClass}>Weekly Excel file (.xlsx)</label>
          <input id="file" type="file" accept=".xlsx,.xls" onChange={handleFile}
            className="block w-full text-sm text-smoke file:mr-4 file:rounded-md file:border-0 file:bg-red file:text-ink file:font-display file:font-bold file:uppercase file:tracking-wide file:px-4 file:py-2.5 hover:file:bg-red/90" />
        </div>
        <Status status={status} />
      </div>

      {parsed ? (
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <h3 className="font-display font-bold uppercase tracking-wide text-2xl">Preview{parsed.week ? ` — Week ${parsed.week}` : ""}</h3>
            <span className="text-sm text-smoke">
              {parsed.standings.length} teams
              {parsed.players?.length ? ` · ${parsed.players.reduce((n, t) => n + t.players.length, 0)} players` : ""} · {parsed.fileName}
            </span>
          </div>
          <PoolStandings standings={parsed.standings} />
          {parsed.players?.length ? (
            <>
              <h3 className="font-display font-bold uppercase tracking-wide text-xl mt-8 mb-4">Player Stats</h3>
              <PoolPlayers teams={parsed.players} />
            </>
          ) : null}
          <button type="button" onClick={publish} disabled={busy} className={`mt-8 w-full sm:w-auto ${btnClass}`}>
            {busy ? "Publishing…" : "Publish standings to the site →"}
          </button>
          <p className="mt-2 text-sm text-smoke">Updates the live standings + player stats (in a minute or two).</p>
        </div>
      ) : null}

      {/* Documents */}
      <h2 className="font-display font-bold uppercase tracking-wide text-2xl mb-4 mt-16">Rules &amp; Score Sheet</h2>
      <div className={cardClass}>
        <div>
          <label htmlFor="docType" className={labelClass}>Which document</label>
          <select id="docType" value={docType} onChange={(e) => { setDocType(e.target.value); setDocStatus(null); }} className={inputClass}>
            {DOC_TYPES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
          </select>
          <p className="mt-2 text-sm text-smoke">
            <strong className="text-chalk">Pool Rules</strong> = the rulebook shown on the pool pages.{" "}
            <strong className="text-chalk">Blank Score Sheet</strong> = the empty sheet teams print to record a match.
          </p>
        </div>
        <div>
          <label htmlFor="docFile" className={labelClass}>Choose the new PDF</label>
          <input id="docFile" type="file" accept="application/pdf,.pdf" onChange={(e) => { setDocFile(e.target.files?.[0] || null); setDocStatus(null); }}
            className="block w-full text-sm text-smoke file:mr-4 file:rounded-md file:border-0 file:bg-red file:text-ink file:font-display file:font-bold file:uppercase file:tracking-wide file:px-4 file:py-2.5 hover:file:bg-red/90" />
        </div>
      </div>

      {/* Apply button — separated from the card so it's clearly the "publish to the site" action */}
      <div className="mt-6">
        <Status status={docStatus} />
        <button type="button" onClick={uploadDoc} disabled={docBusy} className={`mt-3 w-full sm:w-auto ${btnClass}`}>
          {docBusy ? "Uploading…" : "Publish this document to the site →"}
        </button>
        <p className="mt-2 text-sm text-smoke">
          Replaces the selected PDF on the live hancockamusement.com pages (updates in a minute or two).
        </p>
      </div>
    </div>
  );
}
