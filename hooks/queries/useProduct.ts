import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productApi from "@/api/product";
import type { ProductFilters, ProductStats } from "@/api/product";
import type { ProductComment, ProductDetailOut, ProductIn, ProductOut, ProductStatus, ProductSummary } from "@/types/product";
import type { CategoryOut } from "@/types/reference";
import { resolveCategories } from "@/utils/lib";
import { REFERENCE_QUERY_KEYS } from "./useReference";

// ── Helper: enrich a product list with resolved categories ───────────────────

function withCategories(products: ProductOut[], allCategories: CategoryOut[]): ProductOut[] {
  return products.map((p) => ({ ...p, categories: resolveCategories(p.categoryIds ?? [], allCategories) }));
}

function withCategoriesOne(p: ProductDetailOut, allCategories: CategoryOut[]): ProductDetailOut {
  return { ...p, categories: resolveCategories(p.categoryIds ?? [], allCategories) };
}

// ──  Helper: generate product stats label ────────────────────────────────────────

const MIN_TODAY = 2;
const MIN_THIS_WEEK = 3;

export function getProductStatsLabel(stats: ProductStats | undefined): string {
  if (!stats) return "";
  const { today, thisWeek, thisMonth } = stats.releases;
  if (today > MIN_TODAY) return `${today} products launched today`;
  if (thisWeek > MIN_THIS_WEEK) return `${thisWeek} products launched this week`;
  return `${thisMonth} products launched this month`;
}

// ─── useProductStats ─────────────────────────────────────────────────────────

export function useProductStats() {
  return useQuery<ProductStats>({
    queryKey: ["product", "stats"],
    queryFn: () => productApi.getProductStats(),
    staleTime: 30 * 60 * 1000,
  });
}

// ─── useSubmitProduct ─────────────────────────────────────────────────────────

export function useSubmitProduct() {
  return useMutation({
    mutationFn: (data: ProductIn) => productApi.submitProduct(data),
  });
}

// ─── useProducts ──────────────────────────────────────────────────────────────

export function useProducts(status: ProductStatus) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["products", status],
    queryFn: () => productApi.getProducts({ status }),
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategories(data, cats);
    },
  });
}

// ─── useInfiniteProducts ──────────────────────────────────────────────────────

const PAGE_SIZE = 50;

export type ProductQueryFilters = {
  categoryId?: number;
  dateFilter?: ProductFilters["date_filter"];
  sortBy?: ProductFilters["sort_by"];
};

export function useInfiniteProducts(status: ProductStatus, filters: ProductQueryFilters = {}) {
  const queryClient = useQueryClient();
  const { categoryId, dateFilter, sortBy } = filters;
  return useInfiniteQuery({
    queryKey: ["products", "infinite", status, categoryId, dateFilter, sortBy],
    queryFn: ({ pageParam = 0 }) =>
      productApi.getProducts({
        status,
        category_id: categoryId,
        date_filter: dateFilter,
        sort_by: sortBy,
        limit: PAGE_SIZE,
        offset: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return {
        ...data,
        pages: data.pages.map((page) => withCategories(page, cats)),
      };
    },
  });
}

// ─── useProductBySlug ─────────────────────────────────────────────────────────

export function useProductBySlug(slug: string) {
  const queryClient = useQueryClient();
  return useQuery<ProductDetailOut>({
    queryKey: ["product", slug],
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategoriesOne(data, cats);
    },
  });
}

// ─── useVoteProduct ───────────────────────────────────────────────────────────

export function useVoteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, voted }: { id: number; voted: boolean }) => productApi.voteProduct(id, voted),
    onSuccess: (_data, { id, voted }) => {
      queryClient.setQueriesData({ queryKey: ["product"] }, (old: ProductDetailOut | undefined) => {
        if (!old || old.id !== id) return old;
        return { ...old, voted, voteCount: Math.max(0, old.voteCount + (voted ? 1 : -1)) };
      });
    },
  });
}

// ─── useMyProducts ────────────────────────────────────────────────────────────

export function useMyProducts(status?: ProductStatus) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["products", "me", status],
    queryFn: () => productApi.getMyProducts(status),
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return withCategories(data, cats);
    },
  });
}

// ─── useMyVotedProducts ───────────────────────────────────────────────────────

export function useMyVotedProducts() {
  return useQuery<ProductSummary[]>({
    queryKey: ["products", "me", "voted"],
    queryFn: () => productApi.getMyVotedProducts(),
  });
}

// ─── useMyBookmarkedProducts ──────────────────────────────────────────────────

export function useMyBookmarkedProducts() {
  return useQuery<ProductSummary[]>({
    queryKey: ["products", "me", "bookmarked"],
    queryFn: () => productApi.getMyBookmarkedProducts(),
  });
}

// ─── useUpdateProductStatus ───────────────────────────────────────────────────

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ProductStatus }) => productApi.updateProductStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ─── useComments ──────────────────────────────────────────────────────────────

export function useComments(productId: number) {
  return useQuery<ProductComment[]>({
    queryKey: ["comments", productId],
    queryFn: () => productApi.getComments(productId),
    enabled: productId > 0,
  });
}

// ─── useCreateComment ─────────────────────────────────────────────────────────

export function useCreateComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => productApi.createComment(productId, text),
    onSuccess: (newComment) => {
      queryClient.setQueryData<ProductComment[]>(["comments", productId], (old = []) => [...old, newComment]);
    },
  });
}

// ─── useUpdateComment ─────────────────────────────────────────────────────────

export function useUpdateComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: number; text: string }) => productApi.updateComment(productId, commentId, text),
    onSuccess: (updated) => {
      queryClient.setQueryData<ProductComment[]>(["comments", productId], (old = []) =>
        old.map((c) => (c.id === updated.id ? updated : c))
      );
    },
  });
}

// ─── useDeleteComment ─────────────────────────────────────────────────────────

export function useDeleteComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => productApi.deleteComment(productId, commentId),
    onSuccess: (_data, commentId) => {
      queryClient.setQueryData<ProductComment[]>(["comments", productId], (old = []) => old.filter((c) => c.id !== commentId));
    },
  });
}

// ─── useInterestProduct ───────────────────────────────────────────────────────

export function useInterestProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, interested }: { id: number; interested: boolean }) => productApi.interestProduct(id, interested),
    onSuccess: (_data, { id, interested }) => {
      queryClient.setQueriesData({ queryKey: ["product"] }, (old: ProductDetailOut | undefined) => {
        if (!old || old.id !== id) return old;
        return {
          ...old,
          interested,
          investorInterestCount: Math.max(0, old.investorInterestCount + (interested ? 1 : -1)),
        };
      });
    },
  });
}
