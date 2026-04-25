import { http } from "@/api/client";
import type { PaperIn, PaperOut, PaperStatus, PaperUpdate, PaperVerificationStatus } from "./types";

export function submitPaper(data: PaperIn): Promise<void> {
  return http.post<void>("/paper", data, { auth: true });
}

export function getPapers(limit = 50, offset = 0, verificationStatus?: PaperVerificationStatus): Promise<PaperOut[]> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (verificationStatus) params.set("verification_status", verificationStatus);
  return http.get<PaperOut[]>(`/paper?${params}`, { auth: true });
}

export function getPaperBySlug(slug: string): Promise<PaperOut> {
  return http.get<PaperOut>(`/paper/slug/${slug}`, { auth: true });
}

export function getMyPapers(status?: PaperStatus): Promise<PaperOut[]> {
  const params = status ? `?status=${status}` : "";
  return http.get<PaperOut[]>(`/paper/me${params}`, { auth: true });
}

export function updatePaper(id: number, data: PaperUpdate): Promise<PaperOut> {
  return http.patch<PaperOut>(`/paper/${id}`, data, { auth: true });
}

export function updatePaperVerificationStatus(id: number, verificationStatus: PaperVerificationStatus): Promise<PaperOut> {
  return http.patch<PaperOut>(`/paper/${id}/verification-status`, { verificationStatus }, { auth: true });
}

export function deletePaper(id: number): Promise<void> {
  return http.del<void>(`/paper/${id}`, { auth: true });
}

export function getRelatedPapers(id: number, limit = 5): Promise<PaperOut[]> {
  return http.get<PaperOut[]>(`/paper/${id}/related?limit=${limit}`);
}

export function votePaper(id: number, voted: boolean): Promise<void> {
  return http.put<void>(`/paper/${id}/vote`, { voted }, { auth: true });
}
