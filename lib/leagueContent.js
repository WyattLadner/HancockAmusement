// Loads native league rules (Markdown) and schedules (JSON) generated from the
// legacy PDFs by scripts/build-league-content.mjs. Imported (not fs-read) so they're
// bundled and available at build + revalidate time on Vercel.
// Pool rules are now a Caleb-managed PDF (see /docs/pool-rules.pdf + /admin), so only
// darts rules are served natively here.
import dartsInhouseRules from "@/data/leagues/rules/darts-inhouse.md";
import dartsRemoteRules from "@/data/leagues/rules/darts-remote.md";

import waSched from "@/data/leagues/schedule/wednesday-a-pool.json";
import wbSched from "@/data/leagues/schedule/wednesday-b-pool.json";
import tueSched from "@/data/leagues/schedule/tuesday-dart.json";
import monSched from "@/data/leagues/schedule/remote-monday-cash.json";
import thuSched from "@/data/leagues/schedule/remote-thursday-cash.json";

const RULES_BY_SLUG = {
  "tuesday-dart": dartsInhouseRules,
  "remote-monday-cash": dartsRemoteRules,
  "remote-thursday-cash": dartsRemoteRules,
};

const SCHEDULE_BY_SLUG = {
  "wednesday-a-pool": waSched,
  "wednesday-b-pool": wbSched,
  "tuesday-dart": tueSched,
  "remote-monday-cash": monSched,
  "remote-thursday-cash": thuSched,
};

export function getRules(slug) {
  return RULES_BY_SLUG[slug] || null;
}

export function getSchedule(slug) {
  const s = SCHEDULE_BY_SLUG[slug];
  return s && s.weeks?.length ? s : null;
}
