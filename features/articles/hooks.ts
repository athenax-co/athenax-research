import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as articleApi from "./api";
import type { ArticleIn, ArticleOut, ArticleListParams, ArticleUpdate } from "./types";

export const ARTICLE_QUERY_KEYS = {
  list: (params?: ArticleListParams) => ["articles", params] as const,
  bySlug: (slug: string) => ["article", "slug", slug] as const,
  byId: (id: number) => ["article", id] as const,
};

export function useArticlesList(params?: ArticleListParams, opts?: { auth?: boolean }) {
  return useQuery({
    queryKey: [...ARTICLE_QUERY_KEYS.list(params), opts?.auth],
    queryFn: () => articleApi.getArticles(params, opts?.auth),
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticleBySlug(slug: string) {
  return useQuery<ArticleOut>({
    queryKey: ARTICLE_QUERY_KEYS.bySlug(slug),
    queryFn: () => articleApi.getArticleBySlug(slug),
    enabled: !!slug,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticleById(id: number | undefined) {
  return useQuery<ArticleOut>({
    queryKey: ARTICLE_QUERY_KEYS.byId(id!),
    queryFn: () => articleApi.getArticleById(id!),
    enabled: id != null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ArticleIn) => articleApi.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ArticleUpdate }) => articleApi.updateArticle(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.byId(updated.id) });
      queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.bySlug(updated.slug) });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => articleApi.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
