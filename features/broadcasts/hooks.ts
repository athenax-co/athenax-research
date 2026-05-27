import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as broadcastApi from "./api";
import type { BroadcastIn, BroadcastOut, BroadcastListParams, BroadcastUpdate } from "./types";

export const BROADCAST_QUERY_KEYS = {
  list: (params?: BroadcastListParams) => ["broadcasts", params] as const,
  bySlug: (slug: string) => ["broadcast", "slug", slug] as const,
  byId: (id: number) => ["broadcast", id] as const,
};

export function useBroadcastsList(params?: BroadcastListParams, opts?: { auth?: boolean }) {
  return useQuery({
    queryKey: [...BROADCAST_QUERY_KEYS.list(params), opts?.auth],
    queryFn: () => broadcastApi.getBroadcasts(params, opts?.auth),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBroadcastBySlug(slug: string) {
  return useQuery<BroadcastOut>({
    queryKey: BROADCAST_QUERY_KEYS.bySlug(slug),
    queryFn: () => broadcastApi.getBroadcastBySlug(slug),
    enabled: !!slug,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBroadcastById(id: number | undefined) {
  return useQuery<BroadcastOut>({
    queryKey: BROADCAST_QUERY_KEYS.byId(id!),
    queryFn: () => broadcastApi.getBroadcastById(id!),
    enabled: id != null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BroadcastIn) => broadcastApi.createBroadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
    },
  });
}

export function useUpdateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BroadcastUpdate }) => broadcastApi.updateBroadcast(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
      queryClient.invalidateQueries({ queryKey: BROADCAST_QUERY_KEYS.byId(updated.id) });
      queryClient.invalidateQueries({ queryKey: BROADCAST_QUERY_KEYS.bySlug(updated.slug) });
    },
  });
}

export function useDeleteBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => broadcastApi.deleteBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
    },
  });
}
