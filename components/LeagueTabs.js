"use client";

import { useState } from "react";

// Client tab switcher. Receives already-rendered (server component) content per tab
// as `content`, so darts standings stay server-fetched. All panels render; inactive
// ones are hidden (present for SEO + no refetch on switch).
export default function LeagueTabs({ tabs }) {
  const available = tabs.filter((t) => t.content);
  const [active, setActive] = useState(available[0]?.id);
  if (!available.length) return null;

  return (
    <div>
      <div role="tablist" aria-label="League information" className="flex flex-wrap gap-2 border-b border-line mb-8">
        {available.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              className={`font-display font-bold uppercase tracking-wide text-sm md:text-base px-4 py-3 border-b-2 rounded-t-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red ${
                selected ? "border-red text-red" : "border-transparent text-smoke hover:text-chalk"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {available.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
