# Hancock Amusement — Redesign Demo, Phase 1

**Prepared by:** Ladner Web Systems
**Purpose:** Build a send-ready demo to win the redesign. This is a pitch asset, not a production site.

---

## 1. Context

**Client:** Hancock Amusement — Michael Veglia, 228-493-0845, hancockamusement@gmail.com
**Current site:** hancockamusement.com (dated site-builder template, sidebar nav, no logo, no photography)
**Territory:** South Mississippi and Southeast Louisiana

**What they do:**

- Commission-based amusement equipment placed in bars and venues (pool tables, dartboards, jukeboxes, arcade)
- Sale and leasing of amusement equipment and ATM machines
- Game repairs, including pool table recovering
- Game rentals for parties and events
- Private dart and pool leagues

**The structural problem we're solving:** the site serves two audiences with opposite needs through one flat sidebar. Bar owners (the revenue) get one paragraph of template filler. League players (the traffic) get eight of ten nav items, but their standings are posted as **screenshots of Excel spreadsheets** — unreadable on the phone, which is where they're actually checked, from a bar.

**The demo's job is to prove two things:** that the site can speak to venue owners at all, and that standings can be real, readable, mobile-first data. The second point is the one that closes.

---

## 2. Stack

**Tailwind CSS via CDN, hand-written HTML. No build step, no npm, no framework.**

Rationale: Wyatt needs to email this or drop it on a static host and have Michael open it on his phone in thirty seconds. Zero friction to view beats architectural purity at the demo stage. If the client signs, Phase 3 rebuilds in Next.js so standings become JSON data instead of hand-written table rows.

Constraints:

- Tailwind Play CDN `<script src="https://cdn.tailwindcss.com"></script>`
- Google Fonts via `<link>`
- Vanilla JS only, inline in a `<script>` tag at the end of body. No libraries.
- Must open correctly from `file://` — no fetch calls, no ES modules, no server required
- Every page is standalone and self-contained. Duplicating the header markup across the two pages is expected and fine.

---

## 3. File structure

```
hancock-demo/
├── index.html
├── wednesday-a-pool.html
├── images/
│   └── (see manifest in §7 — Wyatt populates this)
└── README.md
```

Create the `images/` folder as part of this build. Populate it with the **exact filenames listed in §7** as 1×1 transparent placeholders or simple gray SVGs so nothing 404s. Wyatt will drop real files over them without touching markup.

Every `<img>` must have `loading="lazy"` (except the hero), explicit `width`/`height` or an aspect-ratio wrapper to prevent layout shift, and a real descriptive `alt`.

---

## 4. Design system

Define once as Tailwind config in an inline `<script>` before the CDN script runs, then use the semantic names throughout. Do not use raw hex values in markup.

### Palette — dark bar / neon

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0D0F` | Page background |
| `surface` | `#14181B` | Cards, sections |
| `surface-2` | `#1C2226` | Raised cards, table header rows |
| `line` | `#262E33` | Borders, dividers |
| `amber` | `#F2A03D` | Primary accent, CTAs, active states |
| `felt` | `#2F9E63` | Secondary accent, positive stats, league identity |
| `chalk` | `#F5F3F0` | Primary text |
| `smoke` | `#9BA3A8` | Muted text, labels, captions |

Use amber sparingly — primary buttons, active nav, key numbers. If everything glows, nothing does.

### Typography

- Headings: **Barlow Condensed**, weight 600–700, `uppercase`, `tracking-wide`. Bar-signage feel without kitsch.
- Body: **Inter**, weight 400–500, `leading-relaxed`
- Data tables: **Inter** with `tabular-nums` so columns align

Scale: h1 `text-5xl md:text-7xl`, h2 `text-3xl md:text-5xl`, h3 `text-xl md:text-2xl`, body `text-base md:text-lg`, caption `text-sm`.

### Rules

- Mobile-first. Design the 375px view first, then scale up. League players are on phones — if the standings table doesn't work at 375px the demo has failed.
- Section vertical rhythm: `py-16 md:py-24`. Content max-width `max-w-7xl mx-auto px-5 md:px-8`.
- Border radius: `rounded-lg` on cards, `rounded-md` on buttons. Consistent, no mixing.
- Images inside cards always get a subtle dark gradient overlay so white text stays legible regardless of what photo Wyatt drops in.
- Transitions on interactive elements only: `transition-colors duration-200`. No scroll animations, no parallax, no AOS.
- Focus states must be visible — `focus-visible:ring-2 focus-visible:ring-amber`.

---

## 5. `index.html` — section by section

Use the real copy below. Do not write filler.

### 5.1 Header (sticky)

Logo left (`images/logo.svg`), nav center on desktop, tap-to-call right.

Nav: Services · Leagues · Service Area · About · Contact
Call button: `<a href="tel:+12284930845">` styled as amber primary, showing `228-493-0845`. On mobile, collapse the label to a phone icon but keep it visible in the bar at all times — never hide the phone number behind a hamburger.

Header is `sticky top-0 z-50` with `bg-ink/90 backdrop-blur border-b border-line`.

### 5.2 Hero

Full-bleed `images/hero-bar-pool-night.jpg`, `min-h-[85vh]`, dark gradient overlay (`from-ink via-ink/70 to-ink/40`) so text stays readable.

- Eyebrow: `SOUTH MISSISSIPPI & SOUTHEAST LOUISIANA · FAMILY OWNED`
- H1: **Games that pay for themselves.**
- Sub: *Pool tables, dartboards, jukeboxes and ATMs placed in your venue at no upfront cost. We install it, we service it, we split the revenue.*
- **Two CTAs, side by side — this is the structural fix, make it obvious:**
  - Primary (amber, solid): `Put equipment in my venue →`
  - Secondary (ghost, chalk border): `League standings & schedules →` linking to `wednesday-a-pool.html`

### 5.3 Trust strip

Thin full-width band, `bg-surface border-y border-line`, four items in a row (2×2 on mobile). Large amber number/short label over `smoke` caption:

- **Family Owned** — and managed, not a franchise
- **2 States** — South MS & Southeast LA
- **5 Leagues** — running weekly
- **$0 Upfront** — commission-based placement

### 5.4 The audience split

Two large side-by-side cards (stacked on mobile), equal weight. This section is the entire thesis of the redesign — give it room.

**Card A — For Venue Owners**
Image: `images/venue-owners.jpg`. Copy: *More reasons to stay for another round. We handle equipment, permits, maintenance and collections — you keep the traffic and a share of every dollar.* CTA: `See how commission works →`

**Card B — For League Players**
Image: `images/league-players.jpg`. Copy: *Standings, schedules, rules and team contacts for all five leagues. Updated weekly, readable on your phone at the bar.* CTA: `Find my league →`

### 5.5 Services

H2: **What We Do**. Six cards, 3-across desktop / 2 tablet / 1 mobile. Image top (16:9), title, one-line description.

| Title | Copy | Image |
|---|---|---|
| Commission Equipment | Pool tables, darts, jukeboxes and arcade placed in your venue at no cost to you. | `svc-commission.jpg` |
| Sales & Leasing | Buy or lease equipment outright, including ATM machines. | `svc-leasing.jpg` |
| ATM Machines | Keep cash on the floor and in your register. Sales, leasing and service. | `svc-atm.jpg` |
| Game Repairs | Fast local service on any machine, whether we placed it or not. | `svc-repairs.jpg` |
| Pool Table Recovering | New felt, professional leveling, done on site. | `svc-recovering.jpg` |
| Party & Event Rentals | Short-term game rentals for parties, fundraisers and company events. | `svc-rentals.jpg` |

### 5.6 How commission works

H2: **No Cost To Put A Game In Your Bar**. Three numbered steps, horizontal on desktop with a connecting line, vertical on mobile. Large amber step numerals.

1. **We install** — We assess your floor space and traffic, recommend the right mix, deliver and set up. No purchase, no lease, no upfront cost.
2. **You host** — The equipment earns while your customers play. We handle permits, licensing and compliance.
3. **We split and maintain** — We collect on a regular schedule, split the revenue with you, and repair anything that breaks at no charge to you.

Closing CTA below: `Talk to Michael → 228-493-0845` (tel link).

This section kills the "what's this going to cost me" objection, which their current site never addresses.

### 5.7 Leagues

H2: **Weekly Leagues**. Five cards in a responsive grid. Each shows night, game type, format badge, and links to the league page. Only the Wednesday A card links to a real page in Phase 1 — the rest get `href="#"` with a `data-phase2` attribute.

| League | Night | Game | Badge |
|---|---|---|---|
| Remote Monday Cash League | Monday | Darts | Cash |
| Tuesday Dart League | Tuesday | Darts | In-House |
| Wednesday A Division Pool | Wednesday | 8-Ball | A Division |
| Wednesday B Division Pool | Wednesday | 8-Ball | B Division |
| Remote Thursday Cash League | Thursday | Darts | Cash |

Below the grid, a notice bar in amber: **Thursday Remote Cash League — next season starts Thursday, July 30th.**

### 5.8 Vegas / Team Dart banner

Full-width band over `images/vegas-strip.jpg` with heavy dark overlay.

H2: **Play Your Way To Las Vegas**
Copy: *Our cash league players compete for spots at the NDA Team Dart national championship — April 8–14, 2027, Westgate Las Vegas Resort & Casino.*
CTA: `Team Dart details →`

### 5.9 Service area

Two columns: left is `images/service-area-map.svg`, right is the territory list.

H2: **Where We Serve**
Mississippi: Hancock, Harrison, Jackson, Pearl River counties
Louisiana: St. Tammany, Washington, Orleans parishes
Caption in `smoke`: *Not sure if you're in range? Call — if we can get a truck to you, we'll come look.*

> Treat the county/parish list as a **placeholder pending client confirmation**. Add an HTML comment marking it as unverified so Wyatt doesn't ship it as fact.

### 5.10 Contact

Two columns. Left: form with First Name, Last Name, Business/Venue, Email, Phone, and a "What do you need?" select (Place equipment in my venue / Buy or lease equipment / Repair request / Party rental / League question / Something else), plus a message textarea.

Form is **non-functional** in the demo — `onsubmit` prevented, swap the form for a styled success message client-side. Add a comment noting Phase 2 wires this up.

Right: direct contact block — Michael Veglia, tap-to-call `228-493-0845` rendered large and amber, email, service area, and a line noting *Fastest response: call or text.*

### 5.11 Footer

Three columns: brand + one-line description, quick links, contact. Bottom bar: `© 2026 Hancock Amusement · A Family Owned & Managed Business` and a small `Site by Ladner Web Systems` credit.

---

## 6. `wednesday-a-pool.html` — the proof

This page is the demo's closing argument. Their current version of this content is a JPEG of a spreadsheet. Ours is real, sortable, mobile-readable data.

### Page header

Breadcrumb `Home / Leagues / Wednesday A Division`. H1 **Wednesday Night Pool — A Division**. Meta line in `smoke`: `Last updated 7/26/2026`.

### Deadline alert

Prominent amber-bordered bar, directly under the header — this is the thing players actually need to know:

> **All stats must be turned in by Thursday 11:00 AM at Knock Knock.** Questions? Call 228-493-0845.

### Section tabs

Client-side tabs (vanilla JS, no page reload): **Standings · Schedule · Rules · Team Contacts**. Standings is default-active. In Phase 1 only Standings is populated — the other three render a styled "Coming in the full build" placeholder card. Tabs must be real buttons with `aria-selected` and keyboard support.

### Standings table — the centerpiece

Real data, transcribed from the client's current spreadsheet screenshot:

| Win % | Team | Played | Won | Notes |
|---|---|---|---|---|
| 66 | 5 Sticks & A Rack | 35 | 23 | * |
| 66 | Outsiders | 35 | 23 | * |
| 64 | Miller Time | 35 | 22.5 | * |
| 63 | 8 Ball Express | 35 | 22 | |
| 61 | Below Average | 35 | 21.5 | |
| 50 | Back Sidee | 30 | 15 | |
| 49 | Shootin Blanks | 35 | 17 | |
| 33 | Gone Country | 35 | 11.5 | * |
| 30 | 8 In The Hole | 30 | 9 | |
| 16 | Shot In The Dark | 35 | 5.5 | ** |

Requirements:

- **Desktop:** real `<table>` with sticky header row (`bg-surface-2`), zebra striping via `odd:bg-surface/40`, `tabular-nums`, rank numeral in a leading column.
- **Mobile (<640px):** the table must **not** horizontally scroll. Collapse each row into a card — rank + team name on the first line, Win % as a large amber figure, Played/Won as a labeled pair beneath. This contrast against their current pinch-and-zoom JPEG is the single most persuasive thing in the demo.
- **Sortable:** clicking any column header sorts by that column, vanilla JS, with an arrow indicator and `aria-sort`. Default sort is Win % descending.
- Top three rows get a subtle `felt` left border accent.
- Footnote legend below the table: `* Played with 3 players` · `** Forfeit`
- Makeup notice below that: **8 In The Hole & Back Sidee — makeup Week 7.**

### Page footer

Same footer component as index. Add a back-link card: `← All Leagues`.

---

## 7. Image manifest

Create `images/` and generate a placeholder for each filename below so the build renders complete with zero broken images. Placeholders should be dark gray SVGs at the correct aspect ratio with the filename rendered as centered light text, so it's obvious at a glance what goes where.

| Filename | Ratio | Subject | Source |
|---|---|---|---|
| `logo.svg` | — | Hancock Amusement wordmark + 8-ball or dart mark | AI / design |
| `hero-bar-pool-night.jpg` | 16:9 | Bar interior at night, pool table under pendant lights, warm amber, people blurred | **Stock** |
| `venue-owners.jpg` | 4:3 | Busy bar floor, owner's perspective | **Stock** |
| `league-players.jpg` | 4:3 | League night, players around a table, chalkboard scores | **Stock** |
| `svc-commission.jpg` | 16:9 | Pool table installed in a venue | **Stock** |
| `svc-leasing.jpg` | 16:9 | Electronic dartboard cabinet | **Stock** |
| `svc-atm.jpg` | 16:9 | ATM in a bar or restaurant setting | **Stock** |
| `svc-repairs.jpg` | 16:9 | Hands servicing a machine, tools visible | **Stock** |
| `svc-recovering.jpg` | 16:9 | Re-felting a pool table | **Stock** |
| `svc-rentals.jpg` | 16:9 | Games set up at a party or event | **Stock** |
| `vegas-strip.jpg` | 21:9 | Las Vegas strip at night | **Stock** |
| `service-area-map.svg` | 4:3 | Gulf Coast, South MS + SE LA highlighted | **Hand-built SVG** |
| `texture-felt.jpg` | tile | Dark green felt texture, section backgrounds | **AI** |
| `og-image.jpg` | 1.91:1 | Social share card | Derive from hero |

Notes for sourcing: AI is unreliable on countable geometry — dartboard segments, pool pockets, ATM keypads, machine screen text. Use stock for anything a viewer looks at directly, AI only for texture and abstraction. Unsplash and Pexels are free and commercially licensed. All photos must skew dark and warm so they sit correctly on the ink background; reject bright daylight shots.

---

## 8. Acceptance criteria

- [ ] Both pages open correctly by double-clicking the file — no server, no build, no console errors
- [ ] Every image path resolves to a real file in `images/`; zero 404s
- [ ] At 375px wide: no horizontal scroll anywhere, standings render as cards, phone number reachable in one tap from any scroll position
- [ ] Standings table sorts on every column and announces state via `aria-sort`
- [ ] Both hero CTAs are visible without scrolling on a 375×667 viewport
- [ ] All interactive elements have visible focus states and pass keyboard-only navigation
- [ ] Real business data used throughout — no lorem ipsum, no invented statistics, no fabricated testimonials or client logos
- [ ] Every unverified claim (county list, revenue split terms) carries an HTML comment flagging it for client confirmation
- [ ] Contact form intercepts submit and shows a styled success state without navigating
- [ ] Total page weight under 2MB with placeholder images in place
- [ ] `README.md` documents how to swap placeholder images and where the standings data lives

---

## 9. Explicitly out of scope for Phase 1

Do not build these. They are Phase 2:

- The other four league pages
- Schedule, Rules, and Team Contacts tab content
- Working contact form submission
- About page, individual service detail pages
- The Team Dart / Vegas detail page
- Real logo design (placeholder is fine)
- Analytics, SEO metadata beyond basic title/description/OG tags
- Any CMS, admin panel, or standings-editing interface

---

## 10. Tone guardrails

Michael runs a family business placing pool tables in Gulf Coast bars. Write like a competent local operator, not a SaaS company. Short declarative sentences. No "solutions," "leverage," "seamless," or "elevate." No exclamation points. The current site's voice is generic template filler — replacing it with generic startup filler is not an improvement.

Do not invent: years in business, number of venues served, revenue split percentages, testimonials, or awards. If a number would strengthen the page and we don't have it, leave a clearly marked comment for Wyatt to ask Michael.
