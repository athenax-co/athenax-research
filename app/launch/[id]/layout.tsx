import type { Metadata } from "next";
import { BASE_URL } from "@/api/client" 

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}/product/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("not found");
    const product = await res.json();

    const title = `${product.name} - AthenaX`;
    const description: string = product.shortDesc ?? (product.description as string | undefined)?.slice(0, 160) ?? "";
    const version = encodeURIComponent(product.updatedAt ?? "");
    const ogImage = `/og/launch/${slug}${version ? `?v=${version}` : ""}`;

    return {
      title,
      description,
      openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 800, alt: product.name }] },
      twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    };
  } catch {
    return { title: "AthenaX — Discovery Platform for Frontier Products" };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
