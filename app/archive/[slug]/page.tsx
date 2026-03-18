import ContentDetailPage from "@/components/page/content-details";
import { getArticleBySlug, getResearchBySlug } from "@/lib/api";

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, research] = await Promise.all([getArticleBySlug(slug), getResearchBySlug(slug)]);

  if (article) {
    return <ContentDetailPage kind="article" item={article} slug={slug} />;
  }

  if (research) {
    return <ContentDetailPage kind="research" item={research} slug={slug} />;
  }

  return <ContentDetailPage kind="article" item={null} slug={slug} />;
}
