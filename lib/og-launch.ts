import { BASE_URL } from "@/api/client";
import { categorySlug } from "@/utils/lib";

// Server-side reads shared by the /launch generateMetadata and the /og/launch image route,
// so the card and the page can never disagree about which category a slug means.

export type LaunchCategory = { id: number; name: string; parentId: number | null };

export type LaunchProduct = {
  name: string;
  shortDesc?: string | null;
  logo?: string | null;
  updatedAt?: string | null;
  stage?: string | null;
  founded?: number | null;
  categories?: { id: number; name: string; subcategories?: { name: string; status: string }[] }[];
};

export type LaunchStats = { releases: { total: number; thisWeek: number; thisMonth: number } };

const REVALIDATE = { next: { revalidate: 3600 } } as const;

export async function fetchCategories(): Promise<LaunchCategory[]> {
  const res = await fetch(`${BASE_URL}/category?limit=200`, REVALIDATE);
  if (!res.ok) throw new Error(`category fetch failed (${res.status})`);
  const all = (await res.json()) as LaunchCategory[];
  return all.filter((c) => c.parentId == null);
}

/** The category whose name slugifies to `slug`, or null when absent/unknown. */
export function resolveCategory(categories: LaunchCategory[], slug: string | null | undefined): LaunchCategory | null {
  if (!slug) return null;
  return categories.find((c) => categorySlug(c.name) === slug) ?? null;
}

export async function fetchLaunchProducts(
  categoryId: number | null,
  limit: number
): Promise<{ items: LaunchProduct[]; total: number }> {
  const params = new URLSearchParams({ status: "approved", limit: String(limit), offset: "0" });
  if (categoryId != null) params.set("category_id", String(categoryId));
  const res = await fetch(`${BASE_URL}/product?${params}`, REVALIDATE);
  if (!res.ok) throw new Error(`product fetch failed (${res.status})`);
  return (await res.json()) as { items: LaunchProduct[]; total: number };
}

export async function fetchLaunchStats(): Promise<LaunchStats> {
  const res = await fetch(`${BASE_URL}/product/stats`, REVALIDATE);
  if (!res.ok) throw new Error(`stats fetch failed (${res.status})`);
  return (await res.json()) as LaunchStats;
}
