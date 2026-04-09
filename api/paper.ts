import { BASE_URL, handleResponse } from "@/api/client";
import type { PaperIn, PaperOut, PaperUpdate, PaperVerificationStatus } from "@/types/paper";

export async function submitPaper(data: PaperIn): Promise<void> {
  const res = await fetch(`${BASE_URL}/paper`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getPapers(limit = 50, offset = 0, verificationStatus?: PaperVerificationStatus): Promise<PaperOut[]> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (verificationStatus) params.set("verification_status", verificationStatus);
  const res = await fetch(`${BASE_URL}/paper?${params}`, { credentials: "include" });
  return handleResponse<PaperOut[]>(res);
}

export async function getPaperBySlug(slug: string): Promise<PaperOut> {
  const res = await fetch(`${BASE_URL}/paper/slug/${slug}`, { credentials: "include" });
  return handleResponse<PaperOut>(res);
}

export async function getMyPapers(): Promise<PaperOut[]> {
  const res = await fetch(`${BASE_URL}/paper/me`, { credentials: "include" });
  return handleResponse<PaperOut[]>(res);
}

/** Owner or admin — can include `status` to change publication state */
export async function updatePaper(id: number, data: PaperUpdate): Promise<PaperOut> {
  const res = await fetch(`${BASE_URL}/paper/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse<PaperOut>(res);
}

/** Admin only */
export async function updatePaperVerificationStatus(
  id: number,
  verificationStatus: PaperVerificationStatus
): Promise<PaperOut> {
  const res = await fetch(`${BASE_URL}/paper/${id}/verification-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verificationStatus }),
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

export async function getRelatedPapers(id: number, limit = 5): Promise<PaperOut[]> {
  const res = await fetch(`${BASE_URL}/paper/${id}/related?limit=${limit}`, { credentials: "include" });
  return handleResponse<PaperOut[]>(res);
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
