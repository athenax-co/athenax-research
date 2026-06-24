import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/client";
import { ARTICLE_PAGE_SIZE, ARTICLE_QUERY_KEYS } from "@/features/articles";
import { BROADCAST_QUERY_KEYS } from "@/features/broadcasts";
import ArchiveClient from "./ArchiveClient";

// ISR: the default (unfiltered) article + broadcast lists are public and shared,
// so the rendered page is safe to cache and rebuild every 5 minutes.
export const revalidate = 300;

const cache: RequestInit = { next: { revalidate: 300, tags: ["archive"] } };

// Backend list endpoints return a paginated `{ items, total }` shape.
async function fetchPage<T>(path: string): Promise<{ items: T[]; total: number }> {
  const res = await fetch(`${BASE_URL}${path}`, cache);
  if (!res.ok) return { items: [], total: 0 };
  return res.json().catch(() => ({ items: [], total: 0 }));
}

export default async function Page() {
  const queryClient = new QueryClient();

  // Prefetch the default tab data under the exact query keys the client hooks use,
  // so the first paint shows content. Filtered views fetch client-side on demand.
  const articleListParams = { articleType: undefined, limit: ARTICLE_PAGE_SIZE, offset: 0 };
  await Promise.all([
    // Articles: paginated — matches usePagedArticles() for page 1.
    queryClient.prefetchQuery({
      queryKey: [...ARTICLE_QUERY_KEYS.paged(articleListParams), undefined],
      queryFn: () => fetchPage(`/article?limit=${ARTICLE_PAGE_SIZE}&offset=0`),
    }),
    // Broadcasts: unwrapped to a bare list — matches useBroadcastsList().
    queryClient.prefetchQuery({
      queryKey: [...BROADCAST_QUERY_KEYS.list(undefined), undefined],
      queryFn: () => fetchPage("/broadcast").then((r) => r.items),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArchiveClient />
    </HydrationBoundary>
  );
}
