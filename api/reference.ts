import { http, BASE_URL, handleResponse } from "@/api/client";
import type { CategoryOut, UniversityOut, LabOut, CategoryRef } from "@/types/reference";
import type { VerificationStatus } from "@/enums";

// ─── category ─────────────────────────────────────────────────────────────────

export async function getCategories(parentId?: number): Promise<CategoryOut[]> {
  const params = parentId != null ? `parent_id=${parentId}` : `limit=200`;
  return http.get<CategoryOut[]>(`/category?${params}`);
}

export async function createSubcategory(parentId: number, name: string): Promise<CategoryOut> {
  return http.post<CategoryOut>(`/category`, { name, parent_id: parentId }, { auth: true });
}

// Approve/reject a (sub-)category. Sub-categories are categories with a parent_id,
// so this drives the same admin-only PATCH /category/{id}/status endpoint.
export async function updateSubcategoryStatus(id: number, status: VerificationStatus): Promise<CategoryOut> {
  return http.patch<CategoryOut>(`/category/${id}/status`, { status }, { auth: true });
}

// ─── university ───────────────────────────────────────────────────────────────

export async function getUniversities(): Promise<UniversityOut[]> {
  const res = await fetch(`${BASE_URL}/university?limit=200`, { credentials: "include" });
  return handleResponse<UniversityOut[]>(res);
}

// ─── lab ──────────────────────────────────────────────────────────────────────

export async function getLabs(): Promise<LabOut[]> {
  const res = await fetch(`${BASE_URL}/lab?limit=200`, { credentials: "include" });
  return handleResponse<LabOut[]>(res);
}

// ─── user categories ──────────────────────────────────────────────────────────

export async function setUserCategories(userId: number, categoryIds: number[]): Promise<CategoryRef[]> {
  const res = await fetch(`${BASE_URL}/user/${userId}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryIds }),
    credentials: "include",
  });
  return handleResponse<CategoryRef[]>(res);
}
