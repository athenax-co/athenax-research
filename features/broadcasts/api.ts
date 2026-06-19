import { http } from "@/api/client";
import type { BroadcastOut, BroadcastIn, BroadcastUpdate, BroadcastListParams } from "./types";

// Backend returns a paginated `{ items, total }` shape; unwrap to the bare list
// since broadcast consumers don't paginate yet.
export function getBroadcasts(params: BroadcastListParams = {}, auth = false): Promise<BroadcastOut[]> {
  const p = new URLSearchParams();
  if (params.limit != null) p.set("limit", String(params.limit));
  if (params.offset != null) p.set("offset", String(params.offset));
  if (params.status) p.set("status", params.status);
  if (params.broadcastType) p.set("broadcastType", params.broadcastType);
  if (params.tag) p.set("tag", params.tag);
  const qs = p.toString();
  return http
    .get<{ items: BroadcastOut[]; total: number }>(`/broadcast${qs ? `?${qs}` : ""}`, auth ? { auth: true } : undefined)
    .then((r) => r.items ?? []);
}

export function getBroadcastById(id: number): Promise<BroadcastOut> {
  return http.get<BroadcastOut>(`/broadcast/${id}`, { auth: true });
}

export function getBroadcastBySlug(slug: string): Promise<BroadcastOut> {
  return http.get<BroadcastOut>(`/broadcast/slug/${slug}`);
}

export function createBroadcast(data: BroadcastIn): Promise<BroadcastOut> {
  return http.post<BroadcastOut>("/broadcast", data, { auth: true });
}

export function updateBroadcast(id: number, data: BroadcastUpdate): Promise<BroadcastOut> {
  return http.patch<BroadcastOut>(`/broadcast/${id}`, data, { auth: true });
}

export function deleteBroadcast(id: number): Promise<void> {
  return http.del<void>(`/broadcast/${id}`, { auth: true });
}
