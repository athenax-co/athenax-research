import { useQuery } from "@tanstack/react-query";
import { getArticles, getBroadcasts, getArticleBySlug, getResearchBySlug, sortByPublishedAtDesc } from "@/lib/api";

export const CONTENT_QUERY_KEYS = {
  articles: ["content", "articles"] as const,
  broadcasts: ["content", "broadcasts"] as const,
  articleBySlug: (slug: string) => ["content", "article", slug] as const,
  researchBySlug: (slug: string) => ["content", "research", slug] as const,
};

const STALE = 5 * 60 * 1000;

export function useArticles() {
  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.articles,
    queryFn: async () => sortByPublishedAtDesc(await getArticles()),
    staleTime: STALE,
  });
}

export function useBroadcasts() {
  return useQuery({
    queryKey: CONTENT_QUERY_KEYS.broadcasts,
    queryFn: async () => sortByPublishedAtDesc(await getBroadcasts()),
    staleTime: STALE,
  });
}

export function useContentBySlug(slug: string) {
  const article = useQuery({
    queryKey: CONTENT_QUERY_KEYS.articleBySlug(slug),
    queryFn: () => getArticleBySlug(slug),
    staleTime: STALE,
    enabled: !!slug,
  });

  const research = useQuery({
    queryKey: CONTENT_QUERY_KEYS.researchBySlug(slug),
    queryFn: () => getResearchBySlug(slug),
    staleTime: STALE,
    enabled: !!slug && article.isFetched && !article.data,
  });

  const loading = article.isLoading || (article.isFetched && !article.data && research.isLoading);

  if (article.data) return { item: article.data, kind: "article" as const, loading: false };
  if (research.data) return { item: research.data, kind: "research" as const, loading: false };
  return { item: null, kind: "article" as const, loading };
}
