// Native league content. Only darts RULES are served natively (as Markdown);
// pool rules and all schedules are Caleb-managed PDFs in /public/docs (uploaded via
// /admin), so there's nothing here that only Wyatt can update.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dartsInhouseRules from "@/data/leagues/rules/darts-inhouse.md";
import dartsRemoteRules from "@/data/leagues/rules/darts-remote.md";

// Returns a public URL for a file in /public if it exists, else null (so a tab is
// only shown for leagues that actually have that document uploaded).
//
// The URL carries a ?v=<content hash> cache-buster. The site sits behind Cloudflare,
// which edge-caches PDFs and hands browsers a multi-hour Cache-Control; without a
// changing URL a freshly uploaded PDF keeps serving stale for hours (Caleb: "it isn't
// changing"). Hashing the committed bytes means the URL changes exactly when the file
// does, so every upload is a brand-new URL no cache can match. Computed at build time.
export function publicDocUrl(rel) {
  try {
    const abs = path.join(process.cwd(), "public", rel);
    if (!fs.existsSync(abs)) return null;
    const hash = crypto.createHash("md5").update(fs.readFileSync(abs)).digest("hex").slice(0, 10);
    return `/${rel}?v=${hash}`;
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
