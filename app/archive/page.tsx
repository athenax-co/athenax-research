import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/client";
import { ARTICLE_QUERY_KEYS } from "@/features/articles";
import { BROADCAST_QUERY_KEYS } from "@/features/broadcasts";
import ArchiveClient from "./ArchiveClient";

// ISR: the default (unfiltered) article + broadcast lists are public and shared,
// so the rendered page is safe to cache and rebuild every 5 minutes.
export const revalidate = 300;

const cache: RequestInit = { next: { revalidate: 300, tags: ["archive"] } };

async function fetchList(path: string): Promise<unknown[]> {
  const res = await fetch(`${BASE_URL}${path}`, cache);
  if (!res.ok) return [];
  return res.json().catch(() => []);
}

export default async function Page() {
  const queryClient = new QueryClient();

  // Prefetch the default tab data under the exact query keys the client hooks use,
  // so the first paint shows content. Filtered views fetch client-side on demand.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [...ARTICLE_QUERY_KEYS.list({ articleType: undefined }), undefined],
      queryFn: () => fetchList("/article"),
    }),
    queryClient.prefetchQuery({
      queryKey: [...BROADCAST_QUERY_KEYS.list(undefined), undefined],
      queryFn: () => fetchList("/broadcast"),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArchiveClient />
    </HydrationBoundary>
  );
}
