import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_BASE}/paper/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("not found");
    const paper = await res.json();

    const title = `${paper.title} - AthenaX`;
    const description: string = (paper.abstract as string | undefined)?.slice(0, 160) ?? "";

    return {
      title,
      description,
      openGraph: { title, description, images: ["/AthenaX_OG.jpg"] },
      twitter: { card: "summary_large_image", title, description, images: ["/AthenaX_OG.jpg"] },
    };
  } catch {
    return { title: "AthenaX — Research Papers" };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
