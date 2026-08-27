// Loads pool-league standings from local JSON (data/pool/*.json). These files are
// the single source of truth for pool standings and are written by the pool-ingest
// workflow (scripts/ingest-pool.mjs) once Caleb's source file is available.
import wednesdayA from "@/data/pool/wednesday-a.json";
import wednesdayB from "@/data/pool/wednesday-b.json";

const POOL = {
  "wednesday-a": wednesdayA,
  "wednesday-b": wednesdayB,
};

export function getPoolData(key) {
  return POOL[key] || null;
}
