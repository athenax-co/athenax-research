import type { Metadata } from "next";
import { BASE_URL } from "@/api/client" 

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}/paper/slug/${slug}`, { next: { revalidate: 3600 } });
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
