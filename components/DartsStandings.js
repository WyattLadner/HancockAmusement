// Renders a parsed LeagueLeader report (see lib/leagueleader.js) in our design:
//   - Team standings as a clean, mobile-friendly table (+ card view on phones)
//   - All remaining stat tables (most-improved, per-player X01/Cricket) as titled,
//     horizontally-scrollable tables so dense data never breaks the mobile layout.

function TeamStandings({ standings }) {
  if (!standings || !standings.length) return null;
  return (
    <>
      <div className="hidden sm:block rounded-lg border border-line">
        <table className="w-full text-sm md:text-base tabular-nums">
          <thead>
            <tr className="bg-surface-2">
              <th className="px-4 py-3 text-left font-display font-bold uppercase tracking-wide text-xs md:text-sm text-smoke">#</th>
              <th className="px-4 py-3 text-left font-display font-bold uppercase tracking-wide text-xs md:text-sm text-red">Win %</th>
              <th className="px-4 py-3 text-left font-display font-bold uppercase tracking-wide text-xs md:text-sm text-smoke">Team</th>
              <th className="px-4 py-3 text-left font-display font-bold uppercase tracking-wide text-xs md:text-sm text-smoke">Games</th>
              <th className="px-4 py-3 text-left font-display font-bold uppercase tracking-wide text-xs md:text-sm text-smoke">Wins</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, idx) => {
              const topThree = idx < 3;
              return (
                <tr key={row.team} className={`odd:bg-surface/40 border-t border-line${topThree ? " border-l-4 border-l-blue" : ""}`}>
                  <td className="px-4 py-3 text-smoke">{idx + 1}</td>
                  <td className="px-4 py-3 font-display font-bold text-red">{row.winPct}%</td>
                  <td className="px-4 py-3">{row.team}</td>
                  <td className="px-4 py-3">{row.games}</td>
                  <td className="px-4 py-3">{row.wins}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col gap-3">
        {standings.map((row, idx) => {
          const topThree = idx < 3;
          return (
            <div key={row.team} className={`rounded-lg border border-line bg-surface-2 p-4${topThree ? " border-l-4 border-l-blue" : ""}`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-display font-bold uppercase tracking-wide text-base">
                  <span className="text-smoke mr-2">#{idx + 1}</span>
                  {row.team}
                </p>
                <p className="font-display font-bold text-2xl text-red tabular-nums flex-shrink-0">{row.winPct}%</p>
              </div>
              <div className="flex gap-6 text-sm">
                <p><span className="text-smoke">Games</span> <span className="tabular-nums">{row.games}</span></p>
                <p><span className="text-smoke">Wins</span> <span className="tabular-nums">{row.wins}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function StatTable({ table }) {
  if (!table.headers?.length || !table.rows?.length) return null;
  return (
    <div>
      {table.title ? (
        <h3 className="font-display font-bold uppercase tracking-wide text-lg md:text-xl mb-3">
          {table.title}
        </h3>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm tabular-nums whitespace-nowrap">
          <thead>
            <tr className="bg-surface-2">
              {table.headers.map((h, i) => (
                <th key={i} className="px-3 py-2.5 text-left font-display font-bold uppercase tracking-wide text-xs text-smoke">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="odd:bg-surface/40 border-t border-line">
                {table.headers.map((_, ci) => (
                  <td key={ci} className={`px-3 py-2.5 ${ci === 0 ? "" : "text-smoke"}`}>
                    {row[ci] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DartsStandings({ report }) {
  const { meta, standings, tables } = report;
  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
          <h2 className="font-display font-bold uppercase tracking-wide text-2xl md:text-3xl">
            Team Standings{meta?.division ? ` — Division ${meta.division}` : ""}
          </h2>
          <span className="inline-flex items-center rounded-md bg-surface border border-line px-2.5 py-1 text-xs font-display font-bold uppercase tracking-wide text-blue">
            Live from LeagueLeader
          </span>
        </div>
        <TeamStandings standings={standings} />
      </div>

      {tables && tables.length ? (
        <div className="flex flex-col gap-8">
          <h2 className="font-display font-bold uppercase tracking-wide text-2xl md:text-3xl">
            Player Stats
          </h2>
          {tables.map((t, i) => (
            <StatTable key={i} table={t} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
