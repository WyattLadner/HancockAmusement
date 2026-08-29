// Native league content. Only darts RULES are served natively (as Markdown);
// pool rules and all schedules are Caleb-managed PDFs in /public/docs (uploaded via
// /admin), so there's nothing here that only Wyatt can update.
import dartsInhouseRules from "@/data/leagues/rules/darts-inhouse.md";
import dartsRemoteRules from "@/data/leagues/rules/darts-remote.md";

const RULES_BY_SLUG = {
  "tuesday-dart": dartsInhouseRules,
  "remote-monday-cash": dartsRemoteRules,
  "remote-thursday-cash": dartsRemoteRules,
};

export function getRules(slug) {
  return RULES_BY_SLUG[slug] || null;
}
