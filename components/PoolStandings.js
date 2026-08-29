"use client";

import { useState } from "react";

// Sortable, mobile-first pool standings. Ported from the approved demo, now driven
// by data (data/pool/*.json) instead of a hard-coded array. Row schema:
//   { team, winPct, played, won, notes }
const COLUMNS = [
  { key: "winPct", label: "Win %", numeric: true },
  { key: "team", label: "Team", numeric: false },
  { key: "played", label: "Played", numeric: true },
  { key: "won", label: "Won", numeric: true },
  { key: "notes", label: "Notes", numeric: false },
];

export default function PoolStandings({ standings = [] }) {
  const [sort, setSort] = useState({ key: "winPct", dir: "desc" });

  const sorted = [...standings]
    .map((row, i) => ({ row, i }))
    .sort((a, b) => {
      const av = a.row[sort.key];
      const bv = b.row[sort.key];
      let cmp;
      if (typeof av === "string" || typeof bv === "string") {
        cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      } else {
        cmp = (av ?? 0) - (bv ?? 0);
      }
      if (sort.dir === "desc") cmp = -cmp;
      if (cmp === 0) cmp = a.i - b.i;
      return cmp;
    })
    .map((x) => x.row);

  function onSort(col) {
    setSort((s) =>
      s.key === col.key
        ? { key: col.key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key: col.key, dir: col.numeric ? "desc" : "asc" }
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden sm:block rounded-lg border border-line">
        <table className="w-full text-sm md:text-base tabular-nums">
          <thead>
            <tr className="bg-surface-2 sticky top-20 md:top-24 z-10">
              <th scope="col" className="px-4 py-3 text-left font-display font-bold uppercase tracking-wide text-xs md:text-sm text-smoke">
                #
              </th>
              {COLUMNS.map((col) => {
                const active = sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                    className="px-4 py-3 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => onSort(col)}
                      className={`inline-flex items-center gap-1 font-display font-bold uppercase tracking-wide text-xs md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red rounded-md ${
                        active ? "text-red" : "text-smoke hover:text-chalk transition-colors duration-200"
                      }`}
                    >
                      {col.label}
                      <span aria-hidden="true">{active ? (sort.dir === "asc" ? "▲" : "▼") : ""}</span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => {
              const rank = idx + 1;
              const topThree = rank <= 3;
              return (
                <tr
                  key={row.team}
                  className={`odd:bg-surface/40 border-t border-line${topThree ? " border-l-4 border-l-blue" : ""}`}
                >
                  <td className="px-4 py-3 text-smoke">{rank}</td>
                  <td className="px-4 py-3 font-display font-bold text-red">{row.winPct}%</td>
                  <td className="px-4 py-3">{row.team}</td>
                  <td className="px-4 py-3">{row.played}</td>
                  <td className="px-4 py-3">{row.won}</td>
                  <td className="px-4 py-3 text-smoke">{row.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards — no horizontal scroll */}
      <div className="sm:hidden flex flex-col gap-3">
        {sorted.map((row, idx) => {
          const rank = idx + 1;
          const topThree = rank <= 3;
          return (
            <div
              key={row.team}
              className={`rounded-lg border border-line bg-surface-2 p-4${topThree ? " border-l-4 border-l-blue" : ""}`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-display font-bold uppercase tracking-wide text-base">
                  <span className="text-smoke mr-2">#{rank}</span>
                  {row.team}
                </p>
                <p className="font-display font-bold text-2xl text-red tabular-nums flex-shrink-0">
                  {row.winPct}%
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <p><span className="text-smoke">Played</span> <span className="tabular-nums">{row.played}</span></p>
                <p><span className="text-smoke">Won</span> <span className="tabular-nums">{row.won}</span></p>
                {row.notes ? <p className="text-smoke">{row.notes}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
