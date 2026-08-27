# Hancock Amusement — Redesign Demo (Phase 1)

Pitch asset for Michael Veglia. Static, no build step, no server — open either HTML file directly by double-clicking it.

## Files

```
index.html               Home page
wednesday-a-pool.html    Wednesday A Division standings (the demo's proof point)
images/                  Placeholder assets — see below
README.md                This file
```

## Images

Real photos have replaced the gray placeholders for every manifest slot except one. Each was cropped/compressed from a source file Wyatt dropped in `images/` (originals kept alongside, uncompressed) to hit the target aspect ratio and keep page weight down.

| File | Ratio | Source | Notes |
|---|---|---|---|
| `logo-header.png` | ~1.9:1 | cropped from `logo_noBG.png` | Icon + "HANCOCK" wordmark only — the full mark's "AMUSEMENT" line and swoosh are illegible below ~80px tall, so header/footer use this tighter crop. Used in both. |
| `logo.png` | ~1.3:1 | trimmed from `logo_noBG.png` | Full mark (icon + both wordmark lines + swoosh), transparent PNG. Not currently used in markup — kept for contexts with more room (e.g. a future favicon/social treatment). |
| `hero-bar-pool-night.jpg` | 16:9 | `bar_hero.png` | |
| `og-image.jpg` | 1.91:1 | `bar_hero.png` | Derived crop of the hero shot per the original manifest note |
| `venue-owners.jpg` | 4:3 | `bar_pooltable.png` | |
| `league-players.jpg` | 4:3 | `pool_league.png` | |
| `svc-commission.jpg` | 16:9 | `jukebox.png` | Jukebox stands in for "Commission Equipment" generally — its own copy explicitly lists jukeboxes |
| `svc-leasing.jpg` | 16:9 | `electronic_darts.png` | Source photo is small (146×257) and portrait — letterboxed on a navy `surface-2` field rather than cropped, to avoid blowing it up blurry or cropping the board off |
| `svc-atm.jpg` | 16:9 | `atm.png` | |
| `svc-recovering.jpg` | 16:9 | `refelting.png` | |
| `svc-rentals.jpg` | 16:9 | `arcadegame.png` | |
| `svc-repairs.jpg` | 16:9 | — | **Still the generated placeholder.** No "hands servicing a machine, tools visible" photo was supplied — `refelting.png` was used for Recovering instead since it's an exact match there. Needs a real photo. |
| `vegas-strip.jpg` | 21:9 | `vegas-strip.jpg` (real photo, re-cropped/compressed in place) | |
| `service-area-map.svg` | 4:3 | hand-built | Recolored to the new palette (red MS pins, blue LA pins) |
| `texture-felt.jpg` | 512×512 | `green_felt.png` | Not currently used anywhere in the markup — available if a section ever wants a felt texture background |

**Unused bonus assets** left in `images/` at full resolution, not wired into either page: `darts_league.png`, `wood.png`, `8ball_dark_pattern.png`, `subtle_8ball_light.png`, `amusement_collage.png` (the reference contact sheet), and the original uncropped source photos (`bar_hero.png`, `bar_pooltable.png`, `pool_league.png`, `jukebox.png`, `atm.png`, `refelting.png`, `arcadegame.png`, `electronic_darts.png`, `logo_noBG.png`). Safe to delete or repurpose later — nothing in either HTML file references them by name.

To swap any image going forward: **replace the file, keep the exact filename.** No markup changes needed. Match the ratio in the table above so nothing shifts or crops oddly — the `<img>` tags carry explicit `width`/`height` attributes for layout stability.

## Color palette

Recolored from orange/green to red/white/blue to match the real Hancock Amusement logo. The accent red and the navy background ramp were both sampled directly from `logo_noBG.png` (not eyeballed) — the brand blue is a lightened tint of that same navy hue, needed because the logo itself has no lighter blue to sample; the navy alone is too close to the background to work as a visible accent.

Defined once, in a `tailwind.config` block near the top of each HTML file — change a value there and it updates everywhere.

| Token | Hex | Source | Role |
|---|---|---|---|
| `ink` | `#050C15` | derived (navy hue, low light) | Page background |
| `surface` | `#0A1422` | derived | Cards, sections |
| `surface-2` | `#0F1D2E` | derived | Raised cards, table header rows |
| `line` | `#1C2E45` | derived | Borders, dividers |
| `red` | `#F60B1A` | sampled from logo | Primary accent — CTAs, active nav, key numbers |
| `blue` | `#3188F2` | derived tint of logo navy | Secondary accent — top-3 standings border, "positive" highlights |
| `chalk` | `#F3F5F7` | derived | Primary text |
| `smoke` | `#919DAC` | derived | Muted text, captions |

`red` and `blue` replaced the old `amber`/`felt` keys everywhere in both files (class names too — `bg-amber` is now `bg-red`, `border-l-felt` is now `border-l-blue`, etc.), not just re-hexed under the old names, so the class names stay honest about what color they render.

Button text stayed `text-ink` on both `bg-red` and `bg-blue` (not white) — checked against WCAG contrast math, dark text reads better on both accents than white does (4.66:1 and 5.55:1 respectively vs. 3.86:1 and 3.24:1 for white), the same pattern the original amber design used.

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
