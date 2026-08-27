// Renders a league's season schedule (native, from data/leagues/schedule/*.json).
// One block per week; each match shows home vs away and venue. Mobile-first.
const isBye = (t) => /^bye$/i.test((t || "").trim());

function fmtDate(d) {
  const p = (d || "").split("/");
  if (p.length !== 3) return d;
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[+p[0]] || p[0]} ${+p[1]}`;
}

export default function ScheduleTable({ schedule }) {
  if (!schedule?.weeks?.length) return null;
  return (
    <div className="flex flex-col gap-6">
      {schedule.weeks.map((w) => (
        <div key={w.week} className="rounded-lg border border-line bg-surface overflow-hidden">
          <div className="flex items-baseline justify-between gap-3 px-4 md:px-5 py-3 bg-surface-2 border-b border-line">
            <h3 className="font-display font-bold uppercase tracking-wide text-base md:text-lg">Week {w.week}</h3>
            <span className="text-sm text-smoke tabular-nums">{fmtDate(w.date)}</span>
          </div>
          {w.matches.length ? (
            <ul className="divide-y divide-line">
              {w.matches.map((m, i) => (
                <li key={i} className="px-4 md:px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="text-sm md:text-base">
                    <span className={isBye(m.home) ? "text-smoke" : "text-chalk"}>{m.home}</span>
                    <span className="text-smoke font-display uppercase text-xs mx-2">vs</span>
                    <span className={isBye(m.away) ? "text-smoke" : "text-chalk"}>{m.away}</span>
                  </p>
                  {!isBye(m.venue) ? (
                    <p className="text-xs md:text-sm text-smoke flex-shrink-0">
                      <span className="text-blue font-display uppercase mr-1">at</span>{m.venue}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 md:px-5 py-3 text-sm text-smoke">No matches listed.</p>
          )}
        </div>
      ))}
    </div>
  );
}
