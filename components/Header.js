"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/leagues", label: "Leagues" },
  { href: "/#service-area", label: "Service Area" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const linkClass =
  "hover:text-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red rounded-md";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red rounded-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-header.png"
            alt="Hancock Amusement"
            width={105}
            height={55}
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        <nav
          className="hidden md:flex items-center gap-8 font-display uppercase tracking-wide text-sm text-chalk"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Primary CTA: Text (client-confirmed Text → Call → Email hierarchy) */}
          <a
            href={site.smsHref}
            className="inline-flex items-center gap-2 bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-3 md:px-5 py-2.5 hover:bg-red/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label={`Text Hancock Amusement at ${site.phoneDisplay}`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4v3.5L13.5 18H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
            </svg>
            <span className="hidden sm:inline">Text {site.phoneDisplay}</span>
            <span className="sm:hidden">Text</span>
          </a>

          {/* Secondary CTA: Call */}
          <a
            href={site.phoneHref}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-line text-chalk hover:border-red hover:text-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            aria-label={`Call Hancock Amusement at ${site.phoneDisplay}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4.5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
            </svg>
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-line text-chalk hover:border-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="md:hidden border-t border-line bg-ink" aria-label="Primary mobile">
          <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1 font-display uppercase tracking-wide text-base">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-2.5 ${linkClass}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
