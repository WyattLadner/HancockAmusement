"use client";

import { useState } from "react";
import { parseScoreSheet } from "@/lib/poolParse";
import PoolStandings from "@/components/PoolStandings";

const LEAGUES = [
  { key: "wednesday-a", label: "Wednesday A Division Pool" },
  { key: "wednesday-b", label: "Wednesday B Division Pool" },
];

const inputClass =
  "w-full rounded-md bg-ink border border-line px-4 py-2.5 text-chalk placeholder:text-smoke/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";
const labelClass =
  "block text-sm font-display font-bold uppercase tracking-wide text-smoke mb-2";

export default function AdminPage() {
  const [leagueKey, setLeagueKey] = useState("wednesday-a");
  const [password, setPassword] = useState("");
  const [parsed, setParsed] = useState(null); // { week, standings, fileName }
  const [status, setStatus] = useState(null); // { type: 'error'|'ok', msg }
  const [busy, setBusy] = useState(false);

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
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, blankrows: false, defval: "" });
      const { week, standings } = parseScoreSheet(rows);
      setParsed({ week, standings, fileName: file.name });
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Could not read that file." });
    }
  }

  async function publish() {
    if (!parsed) return;
    if (!password) {
      setStatus({ type: "error", msg: "Enter the password first." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/pool/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: leagueKey, password, week: parsed.week, standings: parsed.standings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Publish failed (${res.status}).`);
      setStatus({
        type: "ok",
        msg: `Published ${data.teams} teams${data.week ? ` for Week ${data.week}` : ""}. The site updates in a minute or two.`,
      });
      setParsed(null);
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <h1 className="font-display font-bold uppercase tracking-wide text-3xl md:text-5xl mb-2">
        Update Pool Standings
      </h1>
      <p className="text-base text-smoke mb-10">
        Choose the division, drop in the week&apos;s Excel file, check the preview, and publish.
      </p>

      <div className="rounded-lg border border-line bg-surface-2 p-6 md:p-8 space-y-6">
        <div>
          <label htmlFor="league" className={labelClass}>Division</label>
          <select id="league" value={leagueKey} onChange={(e) => setLeagueKey(e.target.value)} className={inputClass}>
            {LEAGUES.map((l) => (
              <option key={l.key} value={l.key}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className={inputClass} autoComplete="off" placeholder="••••••••" />
        </div>

        <div>
          <label htmlFor="file" className={labelClass}>Excel file (.xlsx)</label>
          <input id="file" type="file" accept=".xlsx,.xls" onChange={handleFile}
            className="block w-full text-sm text-smoke file:mr-4 file:rounded-md file:border-0 file:bg-red file:text-ink file:font-display file:font-bold file:uppercase file:tracking-wide file:px-4 file:py-2.5 hover:file:bg-red/90" />
        </div>

        {status ? (
          <div className={`rounded-md px-4 py-3 text-sm ${status.type === "ok" ? "bg-blue/15 border border-blue text-chalk" : "bg-red/15 border border-red text-chalk"}`}>
            {status.msg}
          </div>
        ) : null}
      </div>

      {parsed ? (
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <h2 className="font-display font-bold uppercase tracking-wide text-2xl">
              Preview{parsed.week ? ` — Week ${parsed.week}` : ""}
            </h2>
            <span className="text-sm text-smoke">{parsed.standings.length} teams · {parsed.fileName}</span>
          </div>
          <PoolStandings standings={parsed.standings} />
          <button
            type="button"
            onClick={publish}
            disabled={busy}
            className="mt-8 w-full sm:w-auto inline-flex items-center justify-center bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-8 py-3.5 hover:bg-red/90 transition-colors duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {busy ? "Publishing…" : "Publish to site →"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
