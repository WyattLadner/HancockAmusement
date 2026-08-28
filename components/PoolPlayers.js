// Per-team player standings for pool (from the workbook's team tabs). Grouped by
// team, players sorted by win %. Row schema: { name, winPct, wins, games }.
export default function PoolPlayers({ teams = [] }) {
  if (!teams.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((t) => (
        <div key={t.team} className="rounded-lg border border-line bg-surface overflow-hidden">
          <h3 className="font-display font-bold uppercase tracking-wide text-base md:text-lg px-4 md:px-5 py-3 bg-surface-2 border-b border-line">
            {t.team}
          </h3>
          <ul className="divide-y divide-line">
            {t.players.map((p, i) => (
              <li key={p.name + i} className="px-4 md:px-5 py-2.5 flex items-center justify-between gap-3">
                <span className="text-sm md:text-base text-chalk">{p.name}</span>
                <span className="flex items-baseline gap-3 flex-shrink-0 tabular-nums">
                  {p.games ? (
                    <span className="text-xs text-smoke">{p.wins}/{p.games}</span>
                  ) : null}
                  <span className="font-display font-bold text-red text-base md:text-lg w-12 text-right">{p.winPct}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
