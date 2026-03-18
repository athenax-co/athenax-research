import ContentDetailPage from "@/components/page/content-details";
import { getResearchBySlug } from "@/lib/api";

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getResearchBySlug(slug);

  return <ContentDetailPage kind="research" item={item} slug={slug} />;
}
