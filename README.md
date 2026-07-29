# Hancock Amusement — Redesign Demo (Phase 1)

Pitch asset for Michael Veglia. Static, no build step, no server — open either HTML file directly by double-clicking it.

## Files

```
index.html               Home page
wednesday-a-pool.html    Wednesday A Division standings (the demo's proof point)
images/                  Placeholder assets — see below
README.md                This file
```

## Swapping placeholder images

Every image in `images/` is a placeholder generated so nothing 404s — dark gray JPGs with the filename printed on them, or (for `logo.svg` and `service-area-map.svg`) simple hand-built SVGs.

To swap in real assets: **replace the file, keep the exact filename.** No markup changes needed anywhere in either HTML file. Match the aspect ratio noted in `IMPLEMENTATION_PHASE1.md` §7 so nothing shifts or crops oddly — most `<img>` tags rely on the placeholder's original width/height for layout.

| File | Ratio | Notes |
|---|---|---|
| `logo.svg` | — | Real logo design is Phase 2; current mark is a placeholder wordmark |
| `hero-bar-pool-night.jpg` | 16:9 | Stock — dark, warm, no bright daylight shots |
| `venue-owners.jpg` | 4:3 | Stock |
| `league-players.jpg` | 4:3 | Stock |
| `svc-commission.jpg` | 16:9 | Stock |
| `svc-leasing.jpg` | 16:9 | Stock |
| `svc-atm.jpg` | 16:9 | Stock |
| `svc-repairs.jpg` | 16:9 | Stock |
| `svc-recovering.jpg` | 16:9 | Stock |
| `svc-rentals.jpg` | 16:9 | Stock |
| `vegas-strip.jpg` | 21:9 | Stock |
| `service-area-map.svg` | 4:3 | Hand-built SVG, not a placeholder to source from stock |
| `texture-felt.jpg` | tile | AI-generated is fine — texture only, no countable geometry |
| `og-image.jpg` | 1.91:1 | Social share card, can be derived from the hero shot |

Unsplash and Pexels are free and commercially licensed. Avoid AI for anything with countable geometry a viewer looks at directly (dartboard segments, pool pockets, ATM keypads, machine screens) — it tends to render those wrong.

## Where the standings data lives

`wednesday-a-pool.html`, inside the final `<script>` block, in the `standings` array (search for `var standings =`). Each row is one object:

```js
{ team: '5 Sticks & A Rack', winPct: 66, played: 35, won: 23, notes: '*' }
```

Update numbers there each week — the desktop table, the mobile card layout, and the sort behavior all render from this one array, so there's exactly one place to edit. `notes` takes `'*'` (played with 3 players), `'**'` (forfeit), or `''`. Default sort is Win % descending; sort state resets to that on page load regardless of what's in the array's original order.

In Phase 3 (Next.js rebuild) this array becomes real JSON data instead of a hand-edited block.

## Flagged for client confirmation

Two things in the copy are placeholders pending Michael's sign-off, each marked with an HTML comment at the point in the markup where they appear:

- The county/parish service-area list (`index.html`, Service Area section)
- Nothing else invents numbers — no fabricated years-in-business, venue counts, or revenue split percentages are in this build

## Out of scope (Phase 2)

See `IMPLEMENTATION_PHASE1.md` §9. Notably: the other four league pages, the Schedule/Rules/Team Contacts tab content (currently placeholder cards), and a working contact form submission (current form intercepts submit and shows a styled success message client-side only — nothing is sent anywhere).
