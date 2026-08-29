import Link from "next/link";
import { site } from "@/lib/site";

const linkClass =
  "hover:text-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red rounded-md";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-16">
        <div className="grid sm:grid-cols-3 gap-10">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hancock-amusement-logo.png"
              alt="Hancock Amusement"
              width={95}
              height={73}
              className="h-16 w-auto mb-4"
            />
            <p className="text-sm text-smoke leading-relaxed">
              Commission amusement equipment and ATM placement for bars and venues across{" "}
              {site.region}.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold uppercase tracking-wide text-sm text-smoke mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" className={linkClass}>Services</Link></li>
              <li><Link href="/leagues" className={linkClass}>Leagues</Link></li>
              <li><Link href="/#service-area" className={linkClass}>Service Area</Link></li>
              <li><Link href="/about" className={linkClass}>About</Link></li>
              <li><Link href="/#contact" className={linkClass}>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold uppercase tracking-wide text-sm text-smoke mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href={site.smsHref} className={linkClass}>Text {site.phoneDisplay}</a></li>
              <li><a href={site.phoneHref} className={linkClass}>Call {site.phoneDisplay}</a></li>
              <li><a href={site.emailHref} className={linkClass}>{site.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-smoke text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hancock Amusement · A Family Owned &amp; Managed Business</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className={linkClass}>Privacy Policy</Link>
            <span>Site by Ladner Web Systems</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
