import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as referenceApi from "@/api/reference";
import type { CategoryOut } from "@/types/reference";
import type { VerificationStatus } from "@/enums";

// ─── query keys ──────────────────────────────────────────────────────────────

export const REFERENCE_QUERY_KEYS = {
  categories:   ["reference", "categories"]    as const,
  universities: ["reference", "universities"]  as const,
  labs:         ["reference", "labs"]          as const,
};

const STALE = 10 * 60 * 1000; // 10 minutes — reference data changes infrequently

// ─── useCategories ────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: REFERENCE_QUERY_KEYS.categories,
    queryFn: () => referenceApi.getCategories(),
    staleTime: STALE,
  });
}

// ─── useUniversities ──────────────────────────────────────────────────────────

export function useUniversities() {
  return useQuery({
    queryKey: REFERENCE_QUERY_KEYS.universities,
    queryFn: referenceApi.getUniversities,
    staleTime: STALE,
  });
}

// ─── useLabs ─────────────────────────────────────────────────────────────────

export function useLabs() {
  return useQuery({
    queryKey: REFERENCE_QUERY_KEYS.labs,
    queryFn: referenceApi.getLabs,
    staleTime: STALE,
  });
}

// ─── useSubcategories ────────────────────────────────────────────────────────

export function subcategoryQueryOptions(parentId: number) {
  return {
    queryKey: ["subcategories", parentId] as const,
    queryFn: () => referenceApi.getCategories(parentId),
    staleTime: 2 * 60 * 1000,
  };
}

export function useSubcategories(parentId: number | null) {
  return useQuery<CategoryOut[]>({
    ...subcategoryQueryOptions(parentId!),
    enabled: parentId != null,
  });
}

// ─── useCreateSubcategory ────────────────────────────────────────────────────

export function useCreateSubcategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentId, name }: { parentId: number; name: string }) =>
      referenceApi.createSubcategory(parentId, name),
    onSuccess: (newSub, { parentId }) => {
      queryClient.setQueryData<CategoryOut[]>(["subcategories", parentId], (old = []) => [...old, newSub]);
    },
  });
}

// ─── useUpdateSubcategoryStatus ──────────────────────────────────────────────

export function useUpdateSubcategoryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: VerificationStatus }) =>
      referenceApi.updateSubcategoryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({ queryKey: REFERENCE_QUERY_KEYS.categories });
    },
  });
}
