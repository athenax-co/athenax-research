// ─── helpers ─────────────────────────────────────────────────────────────────

import { BASE_URL } from "./api";

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.detail || body?.message || body?.error || `Request failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return body as T;
}

// ─── types ────────────────────────────────────────────────────────────────────

export interface CategoryOut {
  id: number;
  name: string;
}

export interface UniversityOut {
  id: number;
  name: string;
  country: string;
  focus?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LabOut {
  id: number;
  universityId: number;
  name: string;
  focus?: string | null;
  description?: string | null;
  active: boolean;
  categories: CategoryOut[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRef {
  categoryId: number;
}

// ─── category ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryOut[]> {
  const res = await fetch(`${BASE_URL}/category?limit=200`, { credentials: "include" });
  return handleResponse<CategoryOut[]>(res);
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
