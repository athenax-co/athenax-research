import { useQuery } from "@tanstack/react-query";
import * as referenceApi from "@/api/reference";

// ─── query keys ──────────────────────────────────────────────────────────────

export const REFERENCE_QUERY_KEYS = {
  categories:   ["reference", "categories"]   as const,
  universities: ["reference", "universities"] as const,
  labs:         ["reference", "labs"]         as const,
};

const STALE = 10 * 60 * 1000; // 10 minutes — reference data changes infrequently

// ─── useCategories ────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: REFERENCE_QUERY_KEYS.categories,
    queryFn: referenceApi.getCategories,
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
