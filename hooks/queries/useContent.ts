import { useQuery } from "@tanstack/react-query";
import { getResearchBySlug } from "@/lib/api";
import { useArticleBySlug, useArticlesList } from "@/features/articles";

export { useArticlesList as useArticles };

const STALE = 5 * 60 * 1000;

export function useContentBySlug(slug: string) {
  const article = useArticleBySlug(slug);

  const research = useQuery({
    queryKey: ["content", "research", slug],
    queryFn: () => getResearchBySlug(slug),
    staleTime: STALE,
    enabled: !!slug && article.isFetched && (article.isError || !article.data),
  });

  const loading =
    article.isLoading ||
    (article.isFetched && (article.isError || !article.data) && research.isLoading);

  if (article.data) return { item: article.data, kind: "article" as const, loading: false };
  if (research.data) return { item: research.data, kind: "research" as const, loading: false };
  return { item: null, kind: "article" as const, loading };
}
