import type { MetadataRoute } from "next";
import { BASE_URL as API_BASE } from "@/api/client" 

const BASE = "https://athenax.co";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE}/`,        priority: 1.0, changeFrequency: "daily"  },
  { url: `${BASE}/launch`,  priority: 0.9, changeFrequency: "daily"  },
  { url: `${BASE}/archive`, priority: 0.9, changeFrequency: "daily"  },
  { url: `${BASE}/roadmap`, priority: 0.8, changeFrequency: "weekly" },
  { url: `${BASE}/brand`,   priority: 0.5, changeFrequency: "monthly" },
];

async function fetchProductSlugs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_BASE}/product?limit=1000`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const items: { slug?: string; updatedAt?: string }[] = data?.items ?? data?.results ?? (Array.isArray(data) ? data : []);
    return items
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE}/launch/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        priority: 0.85,
        changeFrequency: "weekly" as const,
      }));
  } catch {
    return [];
  }
}

async function fetchArticleSlugs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_BASE}/article?limit=1000`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const items: { slug?: string; updatedAt?: string }[] = data?.items ?? (Array.isArray(data) ? data : []);
    return items
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${BASE}/archive/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
        priority: 0.8,
        changeFrequency: "monthly" as const,
      }));
  } catch {
    return [];
  }
}

async function fetchBroadcastSlugs(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_BASE}/broadcast?limit=1000`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const items: { slug?: string; updatedAt?: string }[] = data?.items ?? (Array.isArray(data) ? data : []);
    return items
      .filter((b) => b.slug)
      .map((b) => ({
        url: `${BASE}/archive/broadcast/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : undefined,
        priority: 0.75,
        changeFrequency: "monthly" as const,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, broadcasts] = await Promise.all([
    fetchProductSlugs(),
    fetchArticleSlugs(),
    fetchBroadcastSlugs(),
  ]);

  return [...STATIC_ROUTES, ...products, ...articles, ...broadcasts];
}
