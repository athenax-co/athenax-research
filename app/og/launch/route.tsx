import { ImageResponse } from "next/og";
import { OGListCard, type OGListProduct } from "@/components/og/OGListCard";
import { fetchCategories, fetchLaunchProducts, fetchLaunchStats, resolveCategory } from "@/lib/og-launch";
import { fetchImageDataUri, toJpegUrl } from "@/utils/og";

export const runtime = "edge";

const ROWS = 3;
const BRAND_LOGO_URL = "https://athenax.mypinx.store/Logo_Icon_White.png";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const slug = url.searchParams.get("category");
  const fallback = new Response(null, {
    status: 302,
    headers: { Location: `${origin}/AthenaX_OG.jpg` },
  });

  try {
    const [categories, stats, brandLogo, grotesk, groteskBold, mono, monoBold, londrina] = await Promise.all([
      fetchCategories(),
      fetchLaunchStats(),
      fetchImageDataUri(BRAND_LOGO_URL),
      fetchFont(origin, "SpaceGrotesk-Regular"),
      fetchFont(origin, "SpaceGrotesk-Bold"),
      fetchFont(origin, "SpaceMono-Regular"),
      fetchFont(origin, "SpaceMono-Bold"),
      fetchFont(origin, "LondrinaSolid-Regular"),
    ]);

    // An unknown slug renders the unfiltered card rather than 404ing — same as the page,
    // which clears a slug it can't resolve.
    const category = resolveCategory(categories, slug);
    const { items, total } = await fetchLaunchProducts(category?.id ?? null, ROWS);

    const logos = await Promise.all(
      items.slice(0, ROWS).map((p) => (p.logo ? fetchImageDataUri(toJpegUrl(p.logo)) : Promise.resolve(null)))
    );

    const products: OGListProduct[] = items.slice(0, ROWS).map((p, i) => ({
      name: p.name,
      shortDesc: p.shortDesc,
      logo: logos[i],
      categories: (p.categories ?? []).map((c) => c.name),
      subCategories: (p.categories ?? [])
        .flatMap((c) => c.subcategories ?? [])
        .filter((s) => s.status === "approved")
        .map((s) => s.name),
      stage: p.stage,
      founded: p.founded,
    }));

    return new ImageResponse(
      (
        <OGListCard
          activeCategory={category?.name ?? null}
          chips={categories.map((c) => c.name)}
          products={products}
          total={total}
          totalLaunches={stats.releases.total}
          categoriesCount={categories.length}
          thisWeek={stats.releases.thisWeek}
          thisMonth={stats.releases.thisMonth}
          brandLogo={brandLogo}
        />
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Space Grotesk", data: grotesk, weight: 400, style: "normal" },
          { name: "Space Grotesk", data: groteskBold, weight: 700, style: "normal" },
          { name: "Space Mono", data: mono, weight: 400, style: "normal" },
          { name: "Space Mono", data: monoBold, weight: 700, style: "normal" },
          { name: "Londrina Solid", data: londrina, weight: 400, style: "normal" },
        ],
        // Not immutable like the per-product card: this list changes whenever a product launches.
        headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
      }
    );
  } catch {
    return fallback;
  }
}

async function fetchFont(origin: string, name: string): Promise<ArrayBuffer> {
  const res = await fetch(new URL(`/fonts/${name}.ttf`, origin));
  if (!res.ok) throw new Error(`font fetch failed: ${name}`);
  return res.arrayBuffer();
}
