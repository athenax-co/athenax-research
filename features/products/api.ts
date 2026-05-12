import { http, BASE_URL, handleResponse } from "@/api/client";
import type { ProductIn, ProductOut, ProductDetailOut, ProductStatus, ProductComment, ProductSummary, ProductListItem, TeamMemberIn, TeamMemberOut, VoiceIn, ProductVoice, BountyIn, Bounty, ProductMedia } from "./types";
import type { VerificationStatus } from "@/enums";

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
  q?: string;
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
  if (filters.q) params.set("q", filters.q);
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

export function getComments(productId: number, limit = 10, offset = 0): Promise<PaginatedResponse<ProductComment>> {
  return http.get<PaginatedResponse<ProductComment>>(`/product/${productId}/comments?limit=${limit}&offset=${offset}`);
}

export function createComment(productId: number, text: string, parentId?: number): Promise<ProductComment> {
  return http.post<ProductComment>(`/product/${productId}/comments`, { text, parentId }, { auth: true });
}

export function updateComment(productId: number, commentId: number, text: string): Promise<ProductComment> {
  return http.patch<ProductComment>(`/product/${productId}/comments/${commentId}`, { text }, { auth: true });
}

export function deleteComment(productId: number, commentId: number): Promise<void> {
  return http.del<void>(`/product/${productId}/comments/${commentId}`, { auth: true });
}

export function pinComment(productId: number, commentId: number, pinned: boolean): Promise<ProductComment> {
  return http.patch<ProductComment>(`/product/${productId}/comments/${commentId}/pin`, { pinned }, { auth: true });
}

export function createTeamMember(productId: number, data: TeamMemberIn): Promise<TeamMemberOut> {
  return http.post<TeamMemberOut>(`/product/${productId}/team`, data, { auth: true });
}

export function updateTeamMember(productId: number, memberId: number, data: Partial<TeamMemberIn>): Promise<TeamMemberOut> {
  return http.patch<TeamMemberOut>(`/product/${productId}/team/${memberId}`, data, { auth: true });
}

export function deleteTeamMember(productId: number, memberId: number): Promise<void> {
  return http.del<void>(`/product/${productId}/team/${memberId}`, { auth: true });
}

export function updateTeamMemberStatus(productId: number, memberId: number, status: VerificationStatus): Promise<TeamMemberOut> {
  return http.patch<TeamMemberOut>(`/product/${productId}/team/${memberId}/status`, { status }, { auth: true });
}

export function createVoice(productId: number, data: VoiceIn): Promise<ProductVoice> {
  return http.post<ProductVoice>(`/product/${productId}/voices`, data, { auth: true });
}

export function updateVoice(productId: number, voiceId: number, data: Partial<VoiceIn>): Promise<ProductVoice> {
  return http.patch<ProductVoice>(`/product/${productId}/voices/${voiceId}`, data, { auth: true });
}

export function deleteVoice(productId: number, voiceId: number): Promise<void> {
  return http.del<void>(`/product/${productId}/voices/${voiceId}`, { auth: true });
}

export function createBounty(productId: number, data: BountyIn): Promise<Bounty> {
  return http.post<Bounty>(`/product/${productId}/bounties`, data, { auth: true });
}

export function deleteBounty(productId: number, bountyId: number): Promise<void> {
  return http.del<void>(`/product/${productId}/bounties/${bountyId}`, { auth: true });
}

export async function uploadProductMedia(productId: number, file: File, sortOrder?: number): Promise<ProductMedia> {
  const form = new FormData();
  form.append("file", file);
  if (sortOrder != null) form.append("sort_order", String(sortOrder));
  const res = await fetch(`${BASE_URL}/product/${productId}/media/upload`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  return handleResponse<ProductMedia>(res);
}

export function getSimilarProducts(productId: number): Promise<ProductListItem[]> {
  return http.get(`/product/${productId}/similar?limit=3`);
}

export function updateProductMedia(productId: number, mediaId: number, sortOrder: number): Promise<ProductMedia> {
  return http.patch<ProductMedia>(`/product/${productId}/media/${mediaId}`, { sortOrder }, { auth: true });
}

export function deleteProductMedia(productId: number, mediaId: number): Promise<void> {
  return http.del<void>(`/product/${productId}/media/${mediaId}`, { auth: true });
}
