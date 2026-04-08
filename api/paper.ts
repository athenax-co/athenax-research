import { BASE_URL, handleResponse } from "@/api/client";
import type { PaperIn, PaperOut, PaperStatus } from "@/types/paper";

export async function submitPaper(data: PaperIn): Promise<void> {
  const res = await fetch(`${BASE_URL}/paper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getPapers(status?: PaperStatus, limit = 50, offset = 0): Promise<PaperOut[]> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) params.set("status", status);
  const res = await fetch(`${BASE_URL}/paper?${params}`, { credentials: "include" });
  return handleResponse<PaperOut[]>(res);
}

export async function getPaperBySlug(slug: string): Promise<PaperOut> {
  const res = await fetch(`${BASE_URL}/paper/slug/${slug}`, { credentials: "include" });
  return handleResponse<PaperOut>(res);
}

export async function updatePaper(id: number, data: Partial<PaperIn>): Promise<PaperOut> {
  const res = await fetch(`${BASE_URL}/paper/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse<PaperOut>(res);
}

export async function updatePaperStatus(id: number, status: PaperStatus): Promise<PaperOut> {
  const res = await fetch(`${BASE_URL}/paper/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  return handleResponse<PaperOut>(res);
}

export async function deletePaper(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/paper/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function votePaper(id: number, voted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/paper/${id}/vote`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voted }),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getMyPapers(status?: PaperStatus): Promise<PaperOut[]> {
  const url = status ? `${BASE_URL}/paper/me?status=${status}` : `${BASE_URL}/paper/me`;
  const res = await fetch(url, { credentials: "include" });
  return handleResponse<PaperOut[]>(res);
}
