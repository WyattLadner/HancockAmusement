import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = {
  title: "About",
  description:
    "Hancock Amusement is a family owned and managed business placing amusement equipment and ATMs in bars and venues across South Mississippi and Southeast Louisiana.",
};

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";

// Offered services only — public repair, pool recovering, and party/event rentals
// are intentionally excluded (Hancock no longer offers them).
const WHAT_WE_DO = [
  "Amusement equipment placement for bars and venues — pool tables, dartboards, jukeboxes and arcade games",
  "Sales and leasing of amusement equipment and ATM machines",
  "Private dart and pool leagues",
];

export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden border-b border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/venue-owners.jpg" alt="Busy bar floor" className="absolute inset-0 w-full h-full object-cover" width={1600} height={600} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-smoke">
              <li><Link href="/" className={`hover:text-red ${ring} rounded-md`}>Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-chalk">About</li>
            </ol>
          </nav>
          <p className="font-display uppercase tracking-wide text-sm md:text-base text-red mb-3">
            A Family Owned &amp; Managed Business
          </p>
          <h1 className="font-display font-bold uppercase tracking-wide text-4xl md:text-6xl leading-[1.05]">
            About Hancock Amusement
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {/* Story */}
            <div className="md:col-span-2 space-y-5 text-base md:text-lg leading-relaxed text-smoke">
              <p>
                Our company is built on the belief that our customers&apos; needs come first. Our
                whole team is committed to meeting them — and as a result, a high percentage of our
                business comes from repeat customers and referrals.
              </p>
              <p>
                Starting or taking over a business is stressful. We help you plan which games make
                sense for your floor and your customers, install and maintain the equipment, and
                keep it running so it stays an asset, not a headache.
              </p>
              <p className="text-chalk">
                We&apos;d welcome the opportunity to earn your trust and deliver you the best service
                in the industry.
              </p>

              <div className="pt-4">
                <h2 className="font-display font-bold uppercase tracking-wide text-2xl md:text-3xl text-chalk mb-4">
                  What We Do
                </h2>
                <ul className="space-y-3">
                  {WHAT_WE_DO.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact / serving card */}
            <aside className="md:col-span-1">
              <div className="rounded-lg border border-line bg-surface-2 p-6 md:p-8 md:sticky md:top-28">
                <h2 className="font-display font-bold uppercase tracking-wide text-xl mb-1">
                  Talk To {site.contactName}
                </h2>
                <p className="text-sm text-smoke mb-5">Fastest response: text or call.</p>
                <div className="flex flex-col gap-2">
                  <a href={site.smsHref} className={`font-display font-bold uppercase tracking-wide text-2xl text-red hover:text-red/80 transition-colors duration-200 ${ring} rounded-md w-fit`}>
                    Text {site.phoneDisplay}
                  </a>
                  <a href={site.phoneHref} className={`text-base text-chalk hover:text-red transition-colors duration-200 ${ring} rounded-md w-fit`}>
                    or call {site.phoneDisplay}
                  </a>
                  <a href={site.emailHref} className={`text-base text-chalk hover:text-red transition-colors duration-200 ${ring} rounded-md w-fit`}>
                    {site.email}
                  </a>
                </div>
                <div className="mt-6 pt-6 border-t border-line">
                  <p className="font-display font-bold uppercase tracking-wide text-sm text-blue mb-1">Serving</p>
                  <p className="text-base text-chalk">{site.region}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
