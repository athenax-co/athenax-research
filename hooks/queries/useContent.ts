import { useQuery } from "@tanstack/react-query";
import { getBroadcasts, getResearchBySlug, sortByPublishedAtDesc } from "@/lib/api";
import { useArticleBySlug, useArticlesList } from "@/features/articles";

export { useArticlesList as useArticles };

export const CONTENT_QUERY_KEYS = {
  broadcasts: ["content", "broadcasts"] as const,
  researchBySlug: (slug: string) => ["content", "research", slug] as const,
};

const STALE = 5 * 60 * 1000;

export function useBroadcasts() {
  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.broadcasts,
    queryFn: async () => sortByPublishedAtDesc(await getBroadcasts()),
    staleTime: STALE,
  });
}

export function useContentBySlug(slug: string) {
  const article = useArticleBySlug(slug);

  const research = useQuery({
    queryKey: CONTENT_QUERY_KEYS.researchBySlug(slug),
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
