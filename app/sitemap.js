import { leagues } from "@/lib/leagues";

const BASE = "https://hancockamusement.com";

export default function sitemap() {
  const now = new Date();
  const pages = [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/leagues`, priority: 0.8 },
    { url: `${BASE}/about`, priority: 0.6 },
    { url: `${BASE}/privacy`, priority: 0.3 },
    ...leagues.map((l) => ({ url: `${BASE}/leagues/${l.slug}`, priority: 0.6 })),
  ];
  return pages.map((p) => ({ ...p, lastModified: now, changeFrequency: "weekly" }));
}
