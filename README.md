# Hancock Amusement — Website

Production site for Hancock Amusement (commission amusement equipment, ATMs, and
pool/dart leagues across South Mississippi & Southeast Louisiana). Built by Ladner Web
Systems. Next.js + Tailwind, deployable on Vercel.

> The approved static pitch demo this was built from is preserved in
> [`reference-demo/`](reference-demo/) (open `reference-demo/index.html` directly).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## How it's put together

| Area | Where | Notes |
|---|---|---|
| Design system | `tailwind.config.js`, `app/globals.css` | Palette + fonts ported verbatim from the approved demo. Don't re-hex without sign-off. |
| Shared UI | `components/Header.js`, `Footer.js` | One header/footer for every page (no more duplication). |
| Contact info | `lib/site.js` | **Single source of truth** — phone, SMS, email, contact name. Edit here once. |
| Leagues registry | `lib/leagues.js` | The 5 real leagues + where each one's data comes from. |
| Home page | `app/page.js` | |
| Leagues hub | `app/leagues/page.js` | |
| A league | `app/leagues/[slug]/page.js` | One page handles both darts and pool. |

## League data — two pipelines

### Darts (live, automatic)

The three dart leagues publish a **live public LeagueLeader report** (operator 113). We
fetch + parse it server-side and render it in our own design — no link-out.

- Fetch + parse: `lib/leagueleader.js` → `components/DartsStandings.js`
- **Stays fresh automatically:** pages use `export const revalidate = 1800` (30 min).
  No manual step, no cron. Nothing to do when scores change in LeagueLeader.
- If LeagueLeader is briefly unreachable, the page falls back to a link to the
  official report so it never shows a broken state.

### Pool (manual today; ingest scaffolded)

Pool has no live feed. Standings live in `data/pool/*.json` and render via
`components/PoolStandings.js`. To update **right now**, edit the JSON:

```jsonc
// data/pool/wednesday-a.json  → row schema:
{ "team": "5 Sticks & A Rack", "winPct": 66, "played": 35, "won": 23, "notes": "*" }
// notes: "" | "*" (played with 3) | "**" (forfeit)
```

`scripts/ingest-pool.mjs` is a **scaffold** for the eventual "Caleb drops a file → site
updates" workflow. The data contract and rendering already exist; only the source-file
parser remains, and it's intentionally unbuilt until we have a real sample of what Caleb
receives (the format decides whether it's a clean parse or an OCR problem). See the big
comment block in that file.

## Deploying (Vercel)

Standard Next.js deploy. `revalidate` (ISR) keeps darts fresh on Vercel with no extra
config.

⚠️ **Do not touch production DNS, Wix, registrar, or email during development.** The
domain's MX/SPF (email via hostedemail.com) is protected. A launch changes only the
website-routing records, after a tested cutover plan is approved — email must keep
working. Do not cancel Wix until everything is verified.

## Open items (pending client input)

- **Text number** — `lib/site.js` uses the main line for SMS pending confirmation it's
  text-capable. Swap `smsHref` if there's a dedicated text line.
- **Service-area counties/parishes** — placeholder in `app/page.js`, marked unverified.
- **Address zip** — LeagueLeader profile shows `35920`; Bay St. Louis is `39520`
  (likely a typo). Not displayed yet. Confirm before showing an address.
- **Real photos** — swap files in `public/images/` (keep filenames).
- **Pool source sample** — unblocks the pool ingest workflow.
