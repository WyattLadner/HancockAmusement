// Native league content. Only darts RULES are served natively (as Markdown);
// pool rules and all schedules are Caleb-managed PDFs in /public/docs (uploaded via
// /admin), so there's nothing here that only Wyatt can update.
import fs from "node:fs";
import path from "node:path";
import dartsInhouseRules from "@/data/leagues/rules/darts-inhouse.md";
import dartsRemoteRules from "@/data/leagues/rules/darts-remote.md";

// Returns a public URL for a file in /public if it exists, else null (so a tab is
// only shown for leagues that actually have that document uploaded).
export function publicDocUrl(rel) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", rel)) ? `/${rel}` : null;
  } catch {
    return null;
  }
}

const RULES_BY_SLUG = {
  "tuesday-dart": dartsInhouseRules,
  "remote-monday-cash": dartsRemoteRules,
  "remote-thursday-cash": dartsRemoteRules,
};

export function getRules(slug) {
  return RULES_BY_SLUG[slug] || null;
}
