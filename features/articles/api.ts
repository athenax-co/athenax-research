import { http } from "@/api/client";
import type { ArticleOut, ArticleIn, ArticleUpdate, ArticleListParams } from "./types";

export function getArticles(params: ArticleListParams = {}, auth = false): Promise<ArticleOut[]> {
  const p = new URLSearchParams();
  if (params.limit != null) p.set("limit", String(params.limit));
  if (params.offset != null) p.set("offset", String(params.offset));
  if (params.status) p.set("status", params.status);
  if (params.articleType) p.set("articleType", params.articleType);
  if (params.tag) p.set("tag", params.tag);
  const qs = p.toString();
  return http.get<ArticleOut[]>(`/article${qs ? `?${qs}` : ""}`, auth ? { auth: true } : undefined);
}

export function getArticleById(id: number): Promise<ArticleOut> {
  return http.get<ArticleOut>(`/article/${id}`, { auth: true });
}

export function getArticleBySlug(slug: string): Promise<ArticleOut> {
  return http.get<ArticleOut>(`/article/slug/${slug}`);
}

export function createArticle(data: ArticleIn): Promise<ArticleOut> {
  return http.post<ArticleOut>("/article", data, { auth: true });
}

export function updateArticle(id: number, data: ArticleUpdate): Promise<ArticleOut> {
  return http.patch<ArticleOut>(`/article/${id}`, data, { auth: true });
}

export function deleteArticle(id: number): Promise<void> {
  return http.del<void>(`/article/${id}`, { auth: true });
}
