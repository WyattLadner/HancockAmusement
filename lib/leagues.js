// The five real Hancock Amusement leagues and where each one's data comes from.
// Discovered from the live Wix site (see memory/league-data-discovery.md):
//   - Darts leagues publish a LIVE public LeagueLeader shared report (operator 113).
//     We fetch + parse these server-side and render them in our own design.
//   - Pool leagues have no live feed: results go manual → Caleb → Excel → today they
//     were posted as PNG/PDF uploads. We render them from local JSON in /data/pool,
//     which the pool-ingest workflow will eventually write (see scripts/ingest-pool.mjs).
//
// `order` controls display order on the leagues hub and home page.

export const leagues = [
  {
    slug: "remote-monday-cash",
    name: "Remote Monday Cash League",
    day: "Monday",
    game: "Darts",
    type: "darts",
    badge: "Cash",
    order: 1,
    report: { operatorId: 113, code: "92e2e198-fc53-417e-836b-beb9b12209a5" },
  },
  {
    slug: "tuesday-dart",
    name: "Tuesday Dart League",
    day: "Tuesday",
    game: "Darts",
    type: "darts",
    badge: "In-House",
    order: 2,
    report: { operatorId: 113, code: "b0b2461f-f9dd-4a9f-b616-38092dec6326" },
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
    report: { operatorId: 113, code: "d17ffb6e-69e5-4b61-b857-5290f5e01f45" },
  },
];

export function getLeague(slug) {
  return leagues.find((l) => l.slug === slug) || null;
}

export function leaguesSorted() {
  return [...leagues].sort((a, b) => a.order - b.order);
}

// Build the public LeagueLeader shared-report URL for a darts league.
export function reportUrl(league) {
  if (!league.report) return null;
  const { operatorId, code } = league.report;
  return `https://www.leagueleader.net/sharedreport.php?operatorid=${operatorId}&code=${code}`;
}
