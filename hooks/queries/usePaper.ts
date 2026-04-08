import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as paperApi from "@/api/paper";
import type { PaperIn, PaperOut, PaperStatus } from "@/types/paper";
import type { CategoryOut } from "@/types/reference";
import { resolveCategories } from "@/utils/lib";
import { REFERENCE_QUERY_KEYS } from "./useReference";

// ── Helper: enrich a paper list with resolved categories ─────────────────────

function withCategories(papers: PaperOut[], allCategories: CategoryOut[]): PaperOut[] {
  return papers.map((p) => ({ ...p, categories: resolveCategories(p.categoryIds ?? [], allCategories) }));
}

// ─── useSubmitPaper ───────────────────────────────────────────────────────────

export function useSubmitPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaperIn) => paperApi.submitPaper(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    },
  });
}

// ─── usePapers ────────────────────────────────────────────────────────────────

export function usePapers(status?: PaperStatus) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["papers", status ?? "all"],
    queryFn: () => paperApi.getPapers(status),
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategories(data, cats);
    },
  });
}

// ─── usePaperBySlug ───────────────────────────────────────────────────────────

export function usePaperBySlug(slug: string) {
  const queryClient = useQueryClient();
  return useQuery<PaperOut>({
    queryKey: ["paper", slug],
    queryFn: () => paperApi.getPaperBySlug(slug),
    enabled: !!slug,
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return { ...data, categories: resolveCategories(data.categoryIds ?? [], cats) };
    },
  });
}

// ─── useVotePaper ─────────────────────────────────────────────────────────────

export function useVotePaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, voted }: { id: number; voted: boolean }) => paperApi.votePaper(id, voted),
    onSuccess: (_data, { id, voted }) => {
      // Update all single paper caches (keyed by slug — update any that match this id)
      queryClient.setQueriesData({ queryKey: ["paper"] }, (old: PaperOut | undefined) => {
        if (!old || old.id !== id) return old;
        return { ...old, voteCount: Math.max(0, old.voteCount + (voted ? 1 : -1)) };
      });
      // Update list caches
      queryClient.setQueriesData({ queryKey: ["papers"] }, (old: PaperOut[] | undefined) => {
        if (!old) return old;
        return old.map((p) =>
          p.id === id ? { ...p, voteCount: Math.max(0, p.voteCount + (voted ? 1 : -1)) } : p
        );
      });
    },
  });
}

// ─── useMyPapers ──────────────────────────────────────────────────────────────

export function useMyPapers(status?: PaperStatus) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["papers", "me", status],
    queryFn: () => paperApi.getMyPapers(status),
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategories(data, cats);
    },
  });
}

// ─── useUpdatePaperStatus ─────────────────────────────────────────────────────

export function useUpdatePaperStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: PaperStatus }) => paperApi.updatePaperStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    },
  });
}

// ─── useDeletePaper ───────────────────────────────────────────────────────────

export function useDeletePaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paperApi.deletePaper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    },
  });
}
