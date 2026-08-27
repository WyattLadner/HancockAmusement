import Link from "next/link";
import { leaguesSorted } from "@/lib/leagues";

export const metadata = {
  title: "Leagues",
  description:
    "Weekly pool and dart leagues from Hancock Amusement — standings, schedules and team contacts, updated for the season.",
};

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";

export default function LeaguesHub() {
  const leagues = leaguesSorted();
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-smoke">
          <li><Link href="/" className={`hover:text-red ${ring} rounded-md`}>Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-chalk">Leagues</li>
        </ol>
      </nav>

      <h1 className="font-display font-bold uppercase tracking-wide text-4xl md:text-6xl mb-2">Weekly Leagues</h1>
      <p className="text-base md:text-lg text-smoke mb-10 max-w-2xl">
        Five leagues running every week across the Coast. Standings, schedules and team
        contacts — readable on your phone at the bar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {leagues.map((l) => (
          <Link
            key={l.slug}
            href={`/leagues/${l.slug}`}
            className={`group rounded-lg border border-line bg-surface-2 p-6 flex flex-col gap-3 hover:border-red transition-colors duration-200 ${ring}`}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex w-fit items-center rounded-md bg-ink border border-line px-2.5 py-1 text-xs font-display font-bold uppercase tracking-wide text-smoke">
                {l.badge}
              </span>
              <span className="inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-display font-bold uppercase tracking-wide text-blue border border-line">
                {l.game}
              </span>
            </div>
            <h2 className="font-display font-bold uppercase tracking-wide text-xl">{l.name}</h2>
            <p className="text-sm text-smoke">{l.day}</p>
            <span className="mt-auto text-sm font-display font-bold uppercase tracking-wide text-red">
              {l.type === "darts" ? "View standings →" : "View league →"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
