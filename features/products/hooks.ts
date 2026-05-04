import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productApi from "./api";
import type { ProductFilters, ProductStats } from "./api";
import type { ProductComment, ProductDetailOut, ProductIn, ProductOut, ProductStatus, ProductSummary, TeamMemberIn, TeamMemberOut, VoiceIn, ProductVoice, BountyIn, Bounty } from "./types";
import type { VerificationStatus } from "@/enums";
import type { CategoryOut } from "@/types/reference";
import { resolveCategories } from "@/utils/lib";
import { REFERENCE_QUERY_KEYS } from "@/hooks/queries/useReference";

function withCategories(products: ProductOut[], allCategories: CategoryOut[]): ProductOut[] {
  return products.map((p) => ({ ...p, categories: resolveCategories(p.categoryIds ?? [], allCategories) }));
}

function withCategoriesOne(p: ProductDetailOut, allCategories: CategoryOut[]): ProductDetailOut {
  return { ...p, categories: resolveCategories(p.categoryIds ?? [], allCategories) };
}

const MIN_TODAY = 2;
const MIN_THIS_WEEK = 3;

export function getProductStatsLabel(stats: ProductStats | undefined): string {
  if (!stats) return "";
  const { today, thisWeek, thisMonth } = stats.releases;
  if (today > MIN_TODAY) return `${today} products launched today`;
  if (thisWeek > MIN_THIS_WEEK) return `${thisWeek} products launched this week`;
  return `${thisMonth} products launched this month`;
}

export function useProductStats() {
  return useQuery<ProductStats>({
    queryKey: ["product", "stats"],
    queryFn: () => productApi.getProductStats(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useSubmitProduct() {
  return useMutation({
    mutationFn: (data: ProductIn) => productApi.submitProduct(data),
  });
}

export function useProducts(status: ProductStatus) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["products", status],
    queryFn: () => productApi.getProducts({ status }),
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return {
        items: withCategories(data.items, cats),
        total: data.total,
      };
    },
  });
}

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
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.items.length, 0);
      return totalFetched < lastPage.total ? allPages.length * PAGE_SIZE : undefined;
    },
    select: (data) => {
      const cats: CategoryOut[] = queryClient.getQueryData(REFERENCE_QUERY_KEYS.categories) ?? [];
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: withCategories(page.items, cats),
        })),
      };
    },
  });
}

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

export function useMyVotedProducts() {
  return useQuery<ProductSummary[]>({
    queryKey: ["products", "me", "voted"],
    queryFn: () => productApi.getMyVotedProducts(),
  });
}

export function useMyBookmarkedProducts() {
  return useQuery<ProductSummary[]>({
    queryKey: ["products", "me", "bookmarked"],
    queryFn: () => productApi.getMyBookmarkedProducts(),
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ProductStatus }) => productApi.updateProductStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

export function useComments(productId: number) {
  return useQuery<ProductComment[]>({
    queryKey: ["comments", productId],
    queryFn: () => productApi.getComments(productId),
    enabled: productId > 0,
    retry: false,
  });
}

export function useCreateComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => productApi.createComment(productId, text),
    onSuccess: (newComment) => {
      queryClient.setQueryData<ProductComment[]>(["comments", productId], (old = []) => [...old, newComment]);
    },
  });
}

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

export function useDeleteComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => productApi.deleteComment(productId, commentId),
    onSuccess: (_data, commentId) => {
      queryClient.setQueryData<ProductComment[]>(["comments", productId], (old = []) => old.filter((c) => c.id !== commentId));
    },
  });
}

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

export function useBookmarkProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookmarked }: { id: number; bookmarked: boolean }) => productApi.bookmarkProduct(id, bookmarked),
    onSuccess: (_data, { id, bookmarked }) => {
      queryClient.setQueriesData({ queryKey: ["product"] }, (old: ProductDetailOut | undefined) => {
        if (!old || old.id !== id) return old;
        return { ...old, bookmarked };
      });
    },
  });
}

export function useCreateTeamMember(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TeamMemberIn) => productApi.createTeamMember(productId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useUpdateTeamMember(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: number; data: Partial<TeamMemberIn> }) =>
      productApi.updateTeamMember(productId, memberId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useDeleteTeamMember(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => productApi.deleteTeamMember(productId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useUpdateTeamMemberStatus(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, status }: { memberId: number; status: VerificationStatus }) =>
      productApi.updateTeamMemberStatus(productId, memberId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useCreateVoice(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VoiceIn) => productApi.createVoice(productId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useUpdateVoice(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ voiceId, data }: { voiceId: number; data: Partial<VoiceIn> }) => productApi.updateVoice(productId, voiceId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useDeleteVoice(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voiceId: number) => productApi.deleteVoice(productId, voiceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useCreateBounty(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BountyIn) => productApi.createBounty(productId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useDeleteBounty(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bountyId: number) => productApi.deleteBounty(productId, bountyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}
