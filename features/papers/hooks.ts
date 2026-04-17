import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as paperApi from "./api";
import type { PaperIn, PaperOut, PaperUpdate } from "./types";
import { PaperVerificationStatus } from "@/enums";
import type { CategoryOut } from "@/types/reference";
import { resolveCategories } from "@/utils/lib";
import { REFERENCE_QUERY_KEYS } from "@/hooks/queries/useReference";

// ── Helper: enrich a paper list with resolved categories ─────────────────────

function withCategories(papers: PaperOut[], allCategories: CategoryOut[]): PaperOut[] {
  return papers.map((p) => ({ ...p, categories: resolveCategories(p.categoryIds ?? [], allCategories) }));
}

function withCategory(paper: PaperOut, allCategories: CategoryOut[]): PaperOut {
  return { ...paper, categories: resolveCategories(paper.categoryIds ?? [], allCategories) };
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

export function usePapers(limit = 50, offset = 0, verificationStatus?: PaperVerificationStatus) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["papers", limit, offset, verificationStatus],
    queryFn: () => paperApi.getPapers(limit, offset, verificationStatus),
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
    queryKey: ["paper", "slug", slug],
    queryFn: () => paperApi.getPaperBySlug(slug),
    enabled: !!slug,
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategory(data, cats);
    },
  });
}

// ─── useMyPapers ──────────────────────────────────────────────────────────────

export function useMyPapers() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["papers", "me"],
    queryFn: () => paperApi.getMyPapers(),
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategories(data, cats);
    },
  });
}

// ─── useUpdatePaper ───────────────────────────────────────────────────────────

export function useUpdatePaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PaperUpdate }) => paperApi.updatePaper(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      queryClient.invalidateQueries({ queryKey: ["paper", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["paper", "slug", updated.slug] });
    },
  });
}

// ─── useUpdatePaperVerificationStatus ────────────────────────────────────────

export function useUpdatePaperVerificationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verificationStatus }: { id: number; verificationStatus: PaperVerificationStatus }) =>
      paperApi.updatePaperVerificationStatus(id, verificationStatus),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      queryClient.invalidateQueries({ queryKey: ["paper", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["paper", "slug", updated.slug] });
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

// ─── useRelatedPapers ─────────────────────────────────────────────────────────

export function useRelatedPapers(id: number | undefined, limit = 5) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["paper", id, "related", limit],
    queryFn: () => paperApi.getRelatedPapers(id!, limit),
    enabled: !!id,
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategories(data, cats);
    },
  });
}

// ─── useVotePaper ─────────────────────────────────────────────────────────────

export function useVotePaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, voted }: { id: number; voted: boolean }) => paperApi.votePaper(id, voted),
    onSuccess: (_data, { id, voted }) => {
      const delta = voted ? 1 : -1;
      queryClient.setQueriesData({ queryKey: ["paper"] }, (old: PaperOut | undefined) => {
        if (!old || old.id !== id) return old;
        return { ...old, voteCount: Math.max(0, old.voteCount + delta) };
      });
      queryClient.setQueriesData({ queryKey: ["papers"] }, (old: PaperOut[] | undefined) => {
        if (!old) return old;
        return old.map((p) => (p.id === id ? { ...p, voteCount: Math.max(0, p.voteCount + delta) } : p));
      });
    },
  });
}
