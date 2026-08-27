"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const inputClass =
  "w-full rounded-md bg-ink border border-line px-4 py-2.5 text-chalk placeholder:text-smoke/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";
const labelClass =
  "block text-sm font-display font-bold uppercase tracking-wide text-smoke mb-2";

// Repair and party-rental options intentionally removed — Hancock does not offer
// public repair or party/event rentals (client-confirmed).
const NEEDS = [
  "Place equipment in my venue",
  "Buy or lease equipment",
  "League question",
  "Something else",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-lg border border-line bg-surface-2 p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="w-14 h-14 rounded-full bg-blue/20 border border-blue flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display font-bold uppercase tracking-wide text-xl md:text-2xl mb-2">
            Message received
          </h3>
          <p className="text-base text-smoke max-w-sm">
            Thanks — {site.contactName} will get back to you directly. For a faster
            response, text or call {site.phoneDisplay}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface-2 p-6 md:p-8">
      {/* Phase 2: wire this to a real submit endpoint. For now it shows a styled
          success state client-side only — nothing is sent anywhere. */}
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="first-name" className={labelClass}>First Name</label>
            <input type="text" id="first-name" name="first-name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="last-name" className={labelClass}>Last Name</label>
            <input type="text" id="last-name" name="last-name" required className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="venue" className={labelClass}>Business / Venue</label>
          <input type="text" id="venue" name="venue" className={inputClass} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input type="email" id="email" name="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone</label>
            <input type="tel" id="phone" name="phone" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="need" className={labelClass}>What do you need?</label>
          <select id="need" name="need" className={inputClass}>
            {NEEDS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>Message</label>
          <textarea id="message" name="message" rows={4} className={inputClass} />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-6 py-3.5 hover:bg-red/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
        >
          Send message →
        </button>
      </form>
    </div>
  );
}
