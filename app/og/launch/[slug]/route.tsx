import { ImageResponse } from "next/og";
import { OGCard, type OGCardProduct } from "@/components/og/OGCard";
import { ProductLinkTypeLabel, sortProductLinksOtherLast, type ProductLinkType } from "@/enums";
import { prettyUrl } from "@/utils/lib";
import { BASE_URL } from "@/api/client" 

export const runtime = "edge";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

// resvg (next/og) can't decode WebP, so normalize every gallery image to JPEG
// through the wsrv.nl image proxy before embedding.
function toJpegUrl(url: string): string {
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=jpg&w=800`;
}

async function fetchImageDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") ?? "image/jpeg").split(";")[0].trim();
    // Skip formats resvg can't handle (e.g. webp)
    if (!SUPPORTED_IMAGE_TYPES.includes(ct)) return null;
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return `data:${ct};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

type ProductApi = {
  name: string;
  shortDesc?: string | null;
  description?: string | null;
  logo?: string | null;
  stage?: string | null;
  founded?: number | null;
  funding?: number | null;
  createdAt?: string | null;
  categories?: { id: number; name: string; subcategories: { id: number; name: string; status: string }[] }[];
  voteCount?: number | null;
  media?: { url: string; mediaType: string }[];
  links?: { linkType: string; url: string; label?: string | null }[];
  backers?: { name: string }[];
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const origin = new URL(request.url).origin;
  const fallback = new Response(null, {
    status: 302,
    headers: { Location: `${origin}/AthenaX_OG.jpg` },
  });

  try {
    const [productRes, groteskRes, groteskBoldRes, monoRes, monoBoldRes] = await Promise.all([
      fetch(`${BASE_URL}/product/slug/${slug}`, { next: { revalidate: 3600 } }),
      fetch(new URL("/fonts/SpaceGrotesk-Regular.ttf", origin)),
      fetch(new URL("/fonts/SpaceGrotesk-Bold.ttf", origin)),
      fetch(new URL("/fonts/SpaceMono-Regular.ttf", origin)),
      fetch(new URL("/fonts/SpaceMono-Bold.ttf", origin)),
    ]);

    if (!productRes.ok || !groteskRes.ok || !groteskBoldRes.ok || !monoRes.ok || !monoBoldRes.ok) return fallback;

    const [product, grotesk, groteskBold, mono, monoBold] = await Promise.all([
      productRes.json() as Promise<ProductApi>,
      groteskRes.arrayBuffer(),
      groteskBoldRes.arrayBuffer(),
      monoRes.arrayBuffer(),
      monoBoldRes.arrayBuffer(),
    ]);

    const categories = (product.categories ?? []).map((c) => ({ name: c.name }));
    const subCategories = (product.categories ?? [])
      .flatMap((c) => c.subcategories)
      .filter((s) => s.status === "approved")
      .map((s) => s.name);

    const links = sortProductLinksOtherLast(
      (product.links ?? []).filter((l): l is typeof l & { linkType: ProductLinkType } => l.linkType in ProductLinkTypeLabel)
    )
      .map((l) => ({ label: l.label ?? ProductLinkTypeLabel[l.linkType], url: prettyUrl(l.url) }))
      .slice(0, 4);

    const backers = (product.backers ?? []).map((b) => b.name);

    // Pre-fetch up to 3 gallery images as data URIs so Satori can embed them regardless of format
    let galleryImages: (string | null)[] = [];
    try {
      const mediaUrls = (product.media ?? [])
        .filter((m) => m.mediaType === "image")
        .slice(0, 3)
        .map((m) => toJpegUrl(m.url));
      galleryImages = await Promise.all(mediaUrls.map(fetchImageDataUri));
    } catch {
      // gallery images are optional — continue without them
    }

    const card: OGCardProduct = {
      name: product.name,
      shortDesc: product.shortDesc,
      description: product.description,
      logo: product.logo ? toJpegUrl(product.logo) : product.logo,
      slug,
      stage: product.stage,
      founded: product.founded,
      funding: product.funding,
      createdAt: product.createdAt,
      categories,
      subCategories,
      voteCount: product.voteCount,
      backers,
      links,
      galleryImages,
    };

    return new ImageResponse(<OGCard product={card} />, {
      width: 1200,
      height: 800,
      fonts: [
        { name: "Space Grotesk", data: grotesk, weight: 400, style: "normal" },
        { name: "Space Grotesk", data: groteskBold, weight: 700, style: "normal" },
        { name: "Space Mono", data: mono, weight: 400, style: "normal" },
        { name: "Space Mono", data: monoBold, weight: 700, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return fallback;
  }
}
