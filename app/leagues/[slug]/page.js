import Link from "next/link";
import { notFound } from "next/navigation";
import { leagues, getLeague, reportUrl } from "@/lib/leagues";
import { fetchReport } from "@/lib/leagueleader";
import { getPoolData } from "@/lib/pool";
import { getRules, publicDocUrl } from "@/lib/leagueContent";
import DartsStandings from "@/components/DartsStandings";
import PoolStandings from "@/components/PoolStandings";
import PoolPlayers from "@/components/PoolPlayers";
import RulesContent from "@/components/RulesContent";
import PdfDoc from "@/components/PdfDoc";
import LeagueTabs from "@/components/LeagueTabs";
import { site } from "@/lib/site";

// Darts standings fetch the live LeagueLeader report; revalidate keeps them fresh
// automatically. Schedule + rules are bundled static content.
export const revalidate = 1800;

export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const league = getLeague(slug);
  if (!league) return {};
  return {
    title: league.name,
    description: `${league.name} — ${league.day} ${league.game}. Standings, schedule and rules from Hancock Amusement.`,
  };
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";

function Breadcrumb({ league }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-smoke">
        <li><Link href="/" className={`hover:text-red ${ring} rounded-md`}>Home</Link></li>
        <li aria-hidden="true">/</li>
        <li><Link href="/leagues" className={`hover:text-red ${ring} rounded-md`}>Leagues</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-chalk">{league.name}</li>
      </ol>
    </nav>
  );
}

function DeadlineAlert({ text }) {
  return (
    <div className="rounded-lg border-2 border-red bg-surface px-5 md:px-6 py-4 mb-8 flex items-start gap-3">
      <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-red mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      </svg>
      <p className="text-sm md:text-base leading-relaxed">
        <span className="font-display font-bold uppercase tracking-wide">{text}</span>{" "}
        Questions? <a href={site.phoneHref} className={`text-red hover:text-red/80 underline underline-offset-2 ${ring} rounded-md`}>Call {site.phoneDisplay}</a>.
      </p>
    </div>
  );
}

function PoolStandingsPanel({ data }) {
  return (
    <>
      <PoolStandings standings={data.standings} />
      {data.footnotes?.length ? (
        <p className="text-xs md:text-sm text-smoke mt-4">
          {data.footnotes.map((f, i) => (
            <span key={f.mark}>{i > 0 ? " · " : ""}{f.mark} {f.meaning}</span>
          ))}
        </p>
      ) : null}
      {data.makeupNotice ? (
        <div className="mt-4 rounded-lg bg-surface border border-line px-5 py-4 text-sm md:text-base">
          <span className="font-display font-bold uppercase tracking-wide text-blue">Makeup notice:</span>{" "}
          {data.makeupNotice}
        </div>
      ) : null}
    </>
  );
}

function DartsFallback({ league }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-8 md:p-10">
      <p className="text-base md:text-lg mb-4">Live standings are momentarily unavailable. You can view the official report directly:</p>
      <a href={reportUrl(league)} target="_blank" rel="noopener noreferrer"
         className={`inline-flex items-center justify-center bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-6 py-3.5 hover:bg-red/90 transition-colors duration-200 ${ring}`}>
        Open LeagueLeader report →
      </a>
    </div>
  );
}

function ComingSoon({ label }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-10 text-center">
      <p className="font-display font-bold uppercase tracking-wide text-xl text-smoke">{label}</p>
    </div>
  );
}

export default async function LeaguePage({ params }) {
  const { slug } = await params;
  const league = getLeague(slug);
  if (!league) notFound();

  let metaLine;
  let deadline = null;
  let standings;
  let playersContent = null;

  if (league.type === "darts") {
    let report = null;
    try {
      report = await fetchReport(league);
    } catch {
      report = null;
    }
    metaLine =
      `${league.day} · ${league.game}` +
      (report?.meta?.reportDate ? ` · Updated ${report.meta.reportDate}` : "");
    standings =
      report?.standings?.length ? (
        <>
          <DartsStandings report={report} />
          <p className="text-xs text-smoke mt-6">
            Standings pulled live from LeagueLeader.{" "}
            <a href={reportUrl(league)} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 hover:text-red ${ring} rounded-md`}>
              View the official report →
            </a>
          </p>
        </>
      ) : (
        <DartsFallback league={league} />
      );
  } else {
    const data = getPoolData(league.data);
    metaLine =
      `${league.day} · ${league.game}` +
      (data?.week ? ` · Week ${data.week}` : "") +
      (data?.updated ? ` · Updated ${data.updated}` : "");
    deadline = data?.statsDeadline ? <DeadlineAlert text={data.statsDeadline} /> : null;
    standings = data?.standings?.length ? (
      <PoolStandingsPanel data={data} />
    ) : (
      <ComingSoon label="Standings for this division will post here soon." />
    );
    playersContent = data?.players?.length ? <PoolPlayers teams={data.players} /> : null;
  }

  const isPool = league.type !== "darts";

  // Darts rules render natively; pool rules are a Caleb-managed PDF.
  const rules = getRules(slug);
  const rulesContent = isPool ? (
    <PdfDoc url="/docs/pool-rules.pdf" title="Pool League Rules" note="Maintained by Hancock Amusement — updated each season." />
  ) : rules ? (
    <RulesContent markdown={rules} />
  ) : null;

  const captainsPdf = publicDocUrl(`docs/team-captains-${slug}.pdf`);

  const tabs = [
    { id: "standings", label: "Standings", content: standings },
    { id: "players", label: "Player Stats", content: playersContent },
    { id: "schedule", label: "Schedule", content: <PdfDoc url={`/docs/schedule-${slug}.pdf`} title="Season Schedule" note="Full season matchups and venues." /> },
    { id: "captains", label: "Team Captains", content: captainsPdf ? <PdfDoc url={captainsPdf} title="Team Captains" note="Team captains and home-bar contacts." /> : null },
    { id: "rules", label: "Rules", content: rulesContent },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
      <Breadcrumb league={league} />
      <h1 className="font-display font-bold uppercase tracking-wide text-4xl md:text-6xl mb-2">
        {league.name}
      </h1>
      <p className="text-sm text-smoke mb-8">{metaLine}</p>
      {deadline}
      {isPool ? (
        <a
          href="/docs/pool-score-sheet.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 mb-8 rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wide text-blue hover:border-red hover:text-red transition-colors duration-200 ${ring}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          Blank Score Sheet (PDF)
        </a>
      ) : null}
      <LeagueTabs tabs={tabs} />
      <Link href="/leagues" className={`block rounded-lg border border-line bg-surface px-6 py-5 mt-12 md:mt-16 hover:border-red transition-colors duration-200 ${ring}`}>
        <span className="font-display font-bold uppercase tracking-wide text-red">← All Leagues</span>
      </Link>
    </div>
  );
}
