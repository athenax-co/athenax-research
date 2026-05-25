import type { Metadata } from "next";
import ContentDetailPage from "@/features/articles/components/Content";
import { getResearchBySlug } from "@/lib/api";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getResearchBySlug(slug);

  if (!item) return { title: "AthenaX — Research" };

  const title = `${item.title} - AthenaX`;

  return {
    title,
    openGraph: { title, images: ["/AthenaX_OG.jpg"] },
    twitter: { card: "summary_large_image", title, images: ["/AthenaX_OG.jpg"] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getResearchBySlug(slug);

  return <ContentDetailPage kind="research" item={item} slug={slug} />;
}
