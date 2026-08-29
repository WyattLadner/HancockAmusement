import Link from "next/link";
import { site } from "@/lib/site";
import { leaguesSorted } from "@/lib/leagues";
import ContactForm from "@/components/ContactForm";

const SERVICES = [
  {
    title: "Equipment Placement",
    copy: "Pool tables, darts, jukeboxes and arcade games for your bar or venue.",
    img: "/images/svc-jukebox.jpg",
    alt: "Jukebox",
    fit: "cover",
  },
  {
    title: "Sales & Leasing",
    copy: "Buy or lease equipment outright, including ATM machines.",
    img: "/images/svc-darts.png",
    alt: "Arachnid G3 Fire electronic dartboard",
    fit: "contain",
  },
  {
    title: "ATM Machines",
    copy: "Keep cash on the floor and in your register. Sales, leasing and service.",
    img: "/images/svc-atm.png",
    alt: "Triton ATM",
    fit: "contain",
  },
];

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";

export default function Home() {
  const leagues = leaguesSorted();

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-bar-pool-night.jpg"
          alt="Pool table under warm pendant lights in a bar at night"
          className="absolute inset-0 w-full h-full object-cover"
          width={1600}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl">
            <p className="font-display uppercase tracking-wide text-sm md:text-base text-red mb-4">
              {site.region} · Family Owned
            </p>
            <h1 className="font-display font-bold uppercase tracking-wide text-5xl md:text-7xl leading-[1.05] mb-5">
              Games that keep your bar busy.
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-chalk/90 mb-8 max-w-xl">
              Pool tables, dartboards, jukeboxes and ATMs for bars and venues across{" "}
              {site.region}. We deliver it, install it, and keep it running.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={site.smsHref}
                className={`inline-flex items-center justify-center bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-6 py-3.5 text-center hover:bg-red/90 transition-colors duration-200 ${ring} focus-visible:ring-offset-2 focus-visible:ring-offset-ink`}
              >
                Text us about your venue →
              </a>
              <Link
                href="/leagues"
                className={`inline-flex items-center justify-center border border-chalk/60 text-chalk font-display font-bold uppercase tracking-wide rounded-md px-6 py-3.5 text-center hover:border-red hover:text-red transition-colors duration-200 ${ring} focus-visible:ring-offset-2 focus-visible:ring-offset-ink`}
              >
                League standings &amp; schedules →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="bg-surface border-y border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <p className="font-display font-bold uppercase text-2xl md:text-3xl text-red">Family Owned</p>
              <p className="text-sm text-smoke mt-1">and managed, not a franchise</p>
            </div>
            <div>
              <p className="font-display font-bold uppercase text-2xl md:text-3xl text-red">2 States</p>
              <p className="text-sm text-smoke mt-1">South MS &amp; Southeast LA</p>
            </div>
            <div>
              <p className="font-display font-bold uppercase text-2xl md:text-3xl text-red">{leagues.length} Leagues</p>
              <p className="text-sm text-smoke mt-1">running weekly</p>
            </div>
            <div>
              <p className="font-display font-bold uppercase text-2xl md:text-3xl text-red">Local Service</p>
              <p className="text-sm text-smoke mt-1">fast, and in person</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AUDIENCE SPLIT ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="rounded-lg overflow-hidden border border-line bg-surface flex flex-col">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/venue-owners.jpg" alt="Busy bar floor from the owner's perspective" loading="lazy" className="absolute inset-0 w-full h-full object-cover" width={1200} height={900} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="font-display font-bold uppercase tracking-wide text-xl md:text-2xl mb-3">For Venue Owners</h3>
                <p className="text-base leading-relaxed text-smoke mb-6 flex-1">
                  More reasons to stay for another round. We deliver, install and maintain the
                  equipment your customers want — you get the games without the hassle of owning them.
                </p>
                <a href="/#contact" className={`inline-flex items-center gap-1 font-display font-bold uppercase tracking-wide text-red hover:text-red/80 transition-colors duration-200 ${ring} rounded-md w-fit`}>
                  Talk to us about your venue →
                </a>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-line bg-surface flex flex-col">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/league-players.jpg" alt="League night players around a table with a chalkboard scoreboard" loading="lazy" className="absolute inset-0 w-full h-full object-cover" width={1200} height={900} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="font-display font-bold uppercase tracking-wide text-xl md:text-2xl mb-3">For League Players</h3>
                <p className="text-base leading-relaxed text-smoke mb-6 flex-1">
                  Standings, schedules and team contacts for all five leagues. Updated weekly,
                  readable on your phone at the bar.
                </p>
                <Link href="/leagues" className={`inline-flex items-center gap-1 font-display font-bold uppercase tracking-wide text-red hover:text-red/80 transition-colors duration-200 ${ring} rounded-md w-fit`}>
                  Find my league →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="py-16 md:py-24 bg-surface border-y border-line scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <h2 className="font-display font-bold uppercase tracking-wide text-3xl md:text-5xl mb-10 md:mb-14">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SERVICES.map((s) => (
              <article key={s.title} className="rounded-lg overflow-hidden border border-line bg-surface-2">
                <div className={`relative aspect-video ${s.fit === "contain" ? "bg-surface" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.alt}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full ${s.fit === "contain" ? "object-contain p-4" : "object-cover"}`}
                    width={800}
                    height={450}
                  />
                  {s.fit !== "contain" ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                  ) : null}
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-display font-bold uppercase tracking-wide text-xl mb-2">{s.title}</h3>
                  <p className="text-sm md:text-base text-smoke leading-relaxed">{s.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MID-PAGE CTA (neutral — no revenue-model claims) ============ */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="rounded-lg border border-line bg-surface-2 px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="font-display font-bold uppercase tracking-wide text-2xl md:text-4xl mb-2">
                Want games in your venue?
              </h2>
              <p className="text-base md:text-lg text-smoke">
                Text or call {site.contactName} — {site.phoneDisplay}.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a href={site.smsHref} className={`inline-flex items-center justify-center bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-6 py-3.5 hover:bg-red/90 transition-colors duration-200 ${ring} focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2`}>
                Text {site.phoneDisplay}
              </a>
              <a href={site.phoneHref} className={`inline-flex items-center justify-center border border-chalk/60 text-chalk font-display font-bold uppercase tracking-wide rounded-md px-6 py-3.5 hover:border-red hover:text-red transition-colors duration-200 ${ring}`}>
                Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LEAGUES ============ */}
      <section id="leagues" className="py-16 md:py-24 bg-surface border-y border-line scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <h2 className="font-display font-bold uppercase tracking-wide text-3xl md:text-5xl mb-10 md:mb-14">Weekly Leagues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {leagues.map((l) => (
              <Link
                key={l.slug}
                href={`/leagues/${l.slug}`}
                className={`group rounded-lg border border-line bg-surface-2 p-6 flex flex-col gap-3 hover:border-red transition-colors duration-200 ${ring}`}
              >
                <span className="inline-flex w-fit items-center rounded-md bg-ink border border-line px-2.5 py-1 text-xs font-display font-bold uppercase tracking-wide text-smoke">
                  {l.badge}
                </span>
                <h3 className="font-display font-bold uppercase tracking-wide text-xl">{l.name}</h3>
                <p className="text-sm text-smoke">{l.day} · {l.game}</p>
                <span className="mt-auto text-sm font-display font-bold uppercase tracking-wide text-red">
                  {l.type === "darts" ? "View standings →" : "View league →"}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:mt-10 rounded-lg bg-red text-ink px-5 md:px-6 py-4 font-display font-bold uppercase tracking-wide text-center text-sm md:text-base">
            New league seasons start throughout the year — text {site.phoneDisplay} to get your team in.
          </div>
        </div>
      </section>

      {/* ============ VEGAS / TEAM DART BANNER ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/vegas-strip.jpg" alt="Las Vegas strip at night" loading="lazy" className="absolute inset-0 w-full h-full object-cover" width={1600} height={686} />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display font-bold uppercase tracking-wide text-3xl md:text-5xl mb-4">Play Your Way To Las Vegas</h2>
          <p className="text-base md:text-lg leading-relaxed text-chalk/90 max-w-2xl mx-auto mb-8">
            Our cash league players compete for a spot at the NDA Team Dart national championship
            in Las Vegas. Check the official site for the current event details.
          </p>
          <a
            href="https://ndadarts.com/events/team-dart-2/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center border border-chalk/60 text-chalk font-display font-bold uppercase tracking-wide rounded-md px-6 py-3.5 hover:border-red hover:text-red transition-colors duration-200 ${ring} focus-visible:ring-offset-2 focus-visible:ring-offset-ink`}
          >
            Team Dart details →
          </a>
        </div>
      </section>

      {/* ============ SERVICE AREA ============ */}
      <section id="service-area" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="rounded-lg overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/service-area-map.svg" alt="Map of South Mississippi and Southeast Louisiana service territory" loading="lazy" className="w-full h-auto" width={800} height={600} />
            </div>
            <div>
              <h2 className="font-display font-bold uppercase tracking-wide text-3xl md:text-5xl mb-6">Where We Serve</h2>
              {/* UNVERIFIED: county/parish list is a placeholder pending confirmation. Do not ship as fact. */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-display font-bold uppercase tracking-wide text-sm text-blue mb-1">Mississippi</p>
                  <p className="text-base md:text-lg text-chalk">Hancock, Harrison, Jackson, Pearl River counties</p>
                </div>
                <div>
                  <p className="font-display font-bold uppercase tracking-wide text-sm text-blue mb-1">Louisiana</p>
                  <p className="text-base md:text-lg text-chalk">St. Tammany, Washington, Orleans parishes</p>
                </div>
              </div>
              <p className="text-sm text-smoke">Not sure if you&apos;re in range? Reach out — if we can get a truck to you, we&apos;ll come look.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="py-16 md:py-24 bg-surface border-y border-line scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <h2 className="font-display font-bold uppercase tracking-wide text-3xl md:text-5xl mb-10 md:mb-14">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            <ContactForm />
            <div className="flex flex-col justify-center">
              <h3 className="font-display font-bold uppercase tracking-wide text-xl md:text-2xl mb-6">
                Talk To {site.contactName}
              </h3>
              {/* Text → Call → Email */}
              <a href={site.smsHref} className={`font-display font-bold uppercase tracking-wide text-3xl md:text-4xl text-red hover:text-red/80 transition-colors duration-200 ${ring} rounded-md w-fit mb-1`}>
                Text {site.phoneDisplay}
              </a>
              <a href={site.phoneHref} className={`text-lg md:text-xl text-chalk hover:text-red transition-colors duration-200 ${ring} rounded-md w-fit mb-4`}>
                or call {site.phoneDisplay}
              </a>
              <a href={site.emailHref} className={`text-base md:text-lg text-chalk hover:text-red transition-colors duration-200 ${ring} rounded-md w-fit mb-4`}>
                {site.email}
              </a>
              <p className="text-base text-smoke mb-4">{site.region}</p>
              <p className="text-sm text-smoke">Fastest response: text or call.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
