import { http, BASE_URL, handleResponse } from "@/api/client";
import type { CategoryOut, UniversityOut, LabOut, CategoryRef } from "@/types/reference";

// ─── category ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryOut[]> {
  const res = await fetch(`${BASE_URL}/category?limit=200`, { credentials: "include" });
  return handleResponse<CategoryOut[]>(res);
}

export async function getSubcategories(parentId: number): Promise<CategoryOut[]> {
  return http.get<CategoryOut[]>(`/category/${parentId}/subcategories`);
}

export async function createSubcategory(parentId: number, name: string): Promise<CategoryOut> {
  return http.post<CategoryOut>(`/category/${parentId}/subcategories`, { name }, { auth: true });
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
