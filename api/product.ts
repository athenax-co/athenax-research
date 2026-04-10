import { BASE_URL, handleResponse } from "@/api/client";
import type { ProductIn, ProductOut, ProductDetailOut, ProductStatus, ProductComment, ProductSummary } from "@/types/product";

export interface ProductStats {
  releases: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export async function getProductStats(): Promise<ProductStats> {
  const res = await fetch(`${BASE_URL}/product/stats`);
  return handleResponse<ProductStats>(res);
}

export async function submitProduct(data: ProductIn): Promise<void> {
  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export interface ProductFilters {
  status?: ProductStatus;
  category_id?: number;
  date_filter?: "today" | "this_week" | "this_month" | "this_year";
  sort_by?: "newest" | "top";
  limit?: number;
  offset?: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductOut[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.category_id != null) params.set("category_id", String(filters.category_id));
  if (filters.date_filter) params.set("date_filter", filters.date_filter);
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.limit != null) params.set("limit", String(filters.limit));
  if (filters.offset != null) params.set("offset", String(filters.offset));
  const query = params.toString();
  const url = `${BASE_URL}/product${query ? `?${query}` : ""}`;
  const res = await fetch(url, { credentials: "include" });
  return handleResponse<ProductOut[]>(res);
}

export async function bookmarkProduct(id: number, bookmarked: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${id}/bookmark`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookmarked }),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getProductBySlug(slug: string): Promise<ProductDetailOut> {
  const res = await fetch(`${BASE_URL}/product/slug/${slug}`, { credentials: "include" });
  return handleResponse<ProductDetailOut>(res);
}

export async function voteProduct(id: number, voted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${id}/vote`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voted }),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getMyProducts(status?: ProductStatus): Promise<ProductOut[]> {
  const url = status ? `${BASE_URL}/product/me?status=${status}` : `${BASE_URL}/product/me`;
  const res = await fetch(url, { credentials: "include" });
  return handleResponse<ProductOut[]>(res);
}

export async function getMyVotedProducts(limit = 50, offset = 0): Promise<ProductSummary[]> {
  const res = await fetch(`${BASE_URL}/product/me/voted?limit=${limit}&offset=${offset}`, { credentials: "include" });
  return handleResponse<ProductSummary[]>(res);
}

export async function getMyBookmarkedProducts(limit = 50, offset = 0): Promise<ProductSummary[]> {
  const res = await fetch(`${BASE_URL}/product/me/bookmarked?limit=${limit}&offset=${offset}`, { credentials: "include" });
  return handleResponse<ProductSummary[]>(res);
}

export async function updateProductStatus(id: number, status: ProductStatus): Promise<ProductOut> {
  const res = await fetch(`${BASE_URL}/product/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  return handleResponse<ProductOut>(res);
}

export async function interestProduct(id: number, interested: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${id}/interest`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interested }),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getComments(productId: number, limit = 50, offset = 0): Promise<ProductComment[]> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments?limit=${limit}&offset=${offset}`);
  return handleResponse<ProductComment[]>(res);
}

export async function createComment(productId: number, text: string): Promise<ProductComment> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    credentials: "include",
  });
  return handleResponse<ProductComment>(res);
}

export async function updateComment(productId: number, commentId: number, text: string): Promise<ProductComment> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    credentials: "include",
  });
  return handleResponse<ProductComment>(res);
}

export async function deleteComment(productId: number, commentId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<void>(res);
}
