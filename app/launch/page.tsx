import type { Metadata } from "next";
import { categorySlug } from "@/utils/lib";
import { fetchCategories, fetchLaunchProducts, resolveCategory } from "@/lib/og-launch";
import LaunchClient from "./LaunchClient";

const KEYWORDS = ["frontier products", "product discovery", "emerging technology", "AI", "crypto", "biotech", "robotics", "developer tools", "research"];

const GENERIC_TITLE = "AthenaX - Launch Frontier Products";
const GENERIC_DESC =
  "Launch your product on AthenaX and connect with builders, researchers, investors, and early adopters across frontier technology.";

// This page owns the launch metadata (there is no layout.tsx): only a page receives
// searchParams, which is what makes the ?category= OG image possible.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category: slug } = await searchParams;

  try {
    const categories = await fetchCategories();
    const category = resolveCategory(categories, slug);
    const { items, total } = await fetchLaunchProducts(category?.id ?? null, 1);

    // Social platforms cache OG images by URL — version it so the card refreshes as products launch.
    const params = new URLSearchParams();
    if (category) params.set("category", categorySlug(category.name));
    params.set("v", items[0]?.updatedAt ?? String(total)); // URLSearchParams encodes this for us
    const ogImage = `/og/launch?${params}`;

    const title = category ? `${category.name} Products — AthenaX Launch` : GENERIC_TITLE;
    const description = category
      ? `Discover ${total} early-stage ${category.name} ${total === 1 ? "product" : "products"} on AthenaX Launch.`
      : GENERIC_DESC;

    return {
      title,
      description,
      keywords: KEYWORDS,
      openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
      twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    };
  } catch {
    return {
      title: GENERIC_TITLE,
      description: GENERIC_DESC,
      keywords: KEYWORDS,
      openGraph: { title: GENERIC_TITLE, description: GENERIC_DESC, images: ["/AthenaX_OG.jpg"] },
      twitter: { card: "summary_large_image" },
    };
  }
}

export default function Page() {
  return <LaunchClient />;
}
