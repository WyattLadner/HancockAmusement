// The five real Hancock Amusement leagues and where each one's data comes from.
// Discovered from the live Wix site (see memory/league-data-discovery.md):
//   - Darts leagues publish a LIVE public LeagueLeader shared report (operator 113).
//     We fetch + parse these server-side and render them in our own design.
//   - Pool leagues have no live feed: results go manual → Caleb → Excel → today they
//     were posted as PNG/PDF uploads. We render them from local JSON in /data/pool,
//     which the pool-ingest workflow will eventually write (see scripts/ingest-pool.mjs).
//
// `order` controls display order on the leagues hub and home page.
//
// Darts LeagueLeader report links live in data/leagues/darts-reports.json (Caleb
// updates them each season via /admin), keyed by slug -> { operatorId, code }.
import dartsReports from "@/data/leagues/darts-reports.json";

export const leagues = [
  {
    slug: "remote-monday-cash",
    name: "Remote Monday Cash League",
    day: "Monday",
    game: "Darts",
    type: "darts",
    badge: "Cash",
    order: 1,
  },
  {
    slug: "tuesday-dart",
    name: "Tuesday Dart League",
    day: "Tuesday",
    game: "Darts",
    type: "darts",
    badge: "In-House",
    order: 2,
  },
  {
    slug: "wednesday-a-pool",
    name: "Wednesday A Division Pool",
    day: "Wednesday",
    game: "8-Ball",
    type: "pool",
    badge: "A Division",
    order: 3,
    data: "wednesday-a", // -> data/pool/wednesday-a.json
  },
  {
    slug: "wednesday-b-pool",
    name: "Wednesday B Division Pool",
    day: "Wednesday",
    game: "8-Ball",
    type: "pool",
    badge: "B Division",
    order: 4,
    data: "wednesday-b", // -> data/pool/wednesday-b.json
  },
  {
    slug: "remote-thursday-cash",
    name: "Remote Thursday Cash League",
    day: "Thursday",
    game: "Darts",
    type: "darts",
    badge: "Cash",
    order: 5,
  },
];

export function getLeague(slug) {
  return leagues.find((l) => l.slug === slug) || null;
}

export function leaguesSorted() {
  return [...leagues].sort((a, b) => a.order - b.order);
}

// Build the public LeagueLeader shared-report URL for a darts league, from the
// Caleb-editable report config (data/leagues/darts-reports.json).
export function reportUrl(league) {
  const slug = typeof league === "string" ? league : league?.slug;
  const r = dartsReports[slug];
  if (!r?.operatorId || !r?.code) return null;
  return `https://www.leagueleader.net/sharedreport.php?operatorid=${r.operatorId}&code=${r.code}`;
}
