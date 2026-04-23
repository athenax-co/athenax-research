import { http } from "@/api/client";
import type { ProductIn, ProductOut, ProductDetailOut, ProductStatus, ProductComment, ProductSummary } from "./types";

export interface ProductStats {
  releases: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface ProductFilters {
  status?: ProductStatus;
  category_id?: number;
  date_filter?: "today" | "this_week" | "this_month" | "this_year";
  sort_by?: "newest" | "top";
  limit?: number;
  offset?: number;
}

export function getProductStats(): Promise<ProductStats> {
  return http.get<ProductStats>("/product/stats");
}

export function submitProduct(data: ProductIn): Promise<void> {
  return http.post<void>("/product", data, { auth: true });
}

export function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<ProductOut>> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.category_id != null) params.set("category_id", String(filters.category_id));
  if (filters.date_filter) params.set("date_filter", filters.date_filter);
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.limit != null) params.set("limit", String(filters.limit));
  if (filters.offset != null) params.set("offset", String(filters.offset));
  const query = params.toString();
  return http.get<PaginatedResponse<ProductOut>>(`/product${query ? `?${query}` : ""}`, { auth: true });
}

export function bookmarkProduct(id: number, bookmarked: boolean): Promise<void> {
  return http.put<void>(`/product/${id}/bookmark`, { bookmarked }, { auth: true });
}

export function getProductBySlug(slug: string): Promise<ProductDetailOut> {
  return http.get<ProductDetailOut>(`/product/slug/${slug}`, { auth: true });
}

export function voteProduct(id: number, voted: boolean): Promise<void> {
  return http.put<void>(`/product/${id}/vote`, { voted }, { auth: true });
}

export function getMyProducts(status?: ProductStatus): Promise<ProductOut[]> {
  return http.get<ProductOut[]>(status ? `/product/me?status=${status}` : "/product/me", { auth: true });
}

export function getMyVotedProducts(limit = 50, offset = 0): Promise<ProductSummary[]> {
  return http.get<ProductSummary[]>(`/product/me/voted?limit=${limit}&offset=${offset}`, { auth: true });
}

export function getMyBookmarkedProducts(limit = 50, offset = 0): Promise<ProductSummary[]> {
  return http.get<ProductSummary[]>(`/product/me/bookmarked?limit=${limit}&offset=${offset}`, { auth: true });
}

export function updateProductStatus(id: number, status: ProductStatus): Promise<ProductOut> {
  return http.patch<ProductOut>(`/product/${id}/status`, { status }, { auth: true });
}

export function interestProduct(id: number, interested: boolean): Promise<void> {
  return http.put<void>(`/product/${id}/interest`, { interested }, { auth: true });
}

export function getComments(productId: number, limit = 50, offset = 0): Promise<ProductComment[]> {
  return http.get<ProductComment[]>(`/product/${productId}/comments?limit=${limit}&offset=${offset}`);
}

export function createComment(productId: number, text: string): Promise<ProductComment> {
  return http.post<ProductComment>(`/product/${productId}/comments`, { text }, { auth: true });
}

export function updateComment(productId: number, commentId: number, text: string): Promise<ProductComment> {
  return http.patch<ProductComment>(`/product/${productId}/comments/${commentId}`, { text }, { auth: true });
}

export function deleteComment(productId: number, commentId: number): Promise<void> {
  return http.del<void>(`/product/${productId}/comments/${commentId}`, { auth: true });
}
