import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productApi from "./api";
import type { ProductFilters, ProductStats } from "./api";
import type { ProductDetailOut, ProductIn, ProductListItem, ProductRelatedItem, ProductStatus, ProductSummary, TeamMemberIn, TeamMemberOut, VoiceIn, ProductVoice, BountyIn, Bounty, ProductUpdateIn, ProductLinkIn } from "./types";
import { ProductStatus as ProductStatusEnum } from "@/enums";
import type { VerificationStatus } from "@/enums";

const MIN_THIS_MONTH = 5;
const FALLBACK_THIS_MONTH = 12;

export function getProductStatsLabel(stats: ProductStats | undefined): string {
  if (!stats) return "";
  const { thisMonth } = stats.releases;
  const monthCount = thisMonth < MIN_THIS_MONTH ? FALLBACK_THIS_MONTH : thisMonth;
  return `${monthCount} products launched this month`;
}

export function useProductStats() {
  return useQuery<ProductStats>({
    queryKey: ["product", "stats"],
    queryFn: () => productApi.getProductStats(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useProductStages() {
  return useQuery<string[]>({
    queryKey: ["product", "stages"],
    queryFn: () => productApi.getProductStages(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useSubmitProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductIn) => productApi.submitProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProducts(status: ProductStatus) {
  return useQuery({
    queryKey: ["products", status],
    queryFn: () => productApi.getProducts({ status }),
  });
}

export type ProductQueryFilters = {
  categoryId?: number;
  dateFilter?: ProductFilters["date_filter"];
  sortBy?: ProductFilters["sort_by"];
  search?: string;
  upvoted?: boolean;
};

export function usePagedProducts(
  status: ProductStatus,
  filters: ProductQueryFilters & { page: number; pageSize: number },
  options?: { enabled?: boolean }
) {
  const { categoryId, dateFilter, sortBy, search, upvoted, page, pageSize } = filters;
  return useQuery({
    queryKey: ["products", "paged", status, categoryId, dateFilter, sortBy, search, upvoted, page, pageSize],
    queryFn: () =>
      productApi.getProducts({
        status,
        category_id: categoryId,
        date_filter: dateFilter,
        sort_by: sortBy,
        q: search || undefined,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        upvoted: upvoted || undefined,
      }),
    enabled: options?.enabled ?? true,
  });
}


export function useProductBySlug(slug: string) {
  return useQuery<ProductDetailOut>({
    queryKey: ["product", slug],
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
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
  return useQuery({
    queryKey: ["products", "me", status],
    queryFn: () => productApi.getMyProducts(status),
  });
}

export function useMyVotedProducts() {
  return useQuery({
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
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
}

const COMMENTS_PAGE_SIZE = 10;

export function useComments(productId: number) {
  return useInfiniteQuery({
    queryKey: ["comments", productId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productApi.getComments(productId, COMMENTS_PAGE_SIZE, pageParam as number),
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextOffset = (lastPageParam as number) + COMMENTS_PAGE_SIZE;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    enabled: productId > 0,
    retry: false,
  });
}

export function useCreateComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text, parentId }: { text: string; parentId?: number }) =>
      productApi.createComment(productId, text, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
  });
}

export function useUpdateComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: number; text: string }) =>
      productApi.updateComment(productId, commentId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
  });
}

export function useDeleteComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => productApi.deleteComment(productId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
  });
}

export function usePinComment(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, pinned }: { commentId: number; pinned: boolean }) =>
      productApi.pinComment(productId, commentId, pinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
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

export function useApproveAllPendingTeamMembers(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => productApi.approveAllPendingTeamMembers(productId),
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

export function useSwapVoice(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ idA, orderA, idB, orderB }: { idA: number; orderA: number; idB: number; orderB: number }) => {
      if (orderA === orderB) {
        await productApi.updateVoice(productId, idA, { sortOrder: orderB - 1 });
      } else {
        await Promise.all([
          productApi.updateVoice(productId, idA, { sortOrder: orderB }),
          productApi.updateVoice(productId, idB, { sortOrder: orderA }),
        ]);
      }
    },
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

export function useUploadProductMedia(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, sortOrder }: { file: File; sortOrder?: number }) =>
      productApi.uploadProductMedia(productId, file, sortOrder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useSwapProductMedia(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ idA, orderA, idB, orderB }: { idA: number; orderA: number; idB: number; orderB: number }) => {
      if (orderA === orderB) {
        await productApi.updateProductMedia(productId, idA, orderB - 1);
      } else {
        await Promise.all([
          productApi.updateProductMedia(productId, idA, orderB),
          productApi.updateProductMedia(productId, idB, orderA),
        ]);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useSimilarProducts(productId: number, enabled = true, limit = 3) {
  return useQuery<ProductListItem[]>({
    queryKey: ["product", productId, "similar", limit],
    queryFn: () => productApi.getSimilarProducts(productId, limit),
    enabled: productId > 0 && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSimilarProducts(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, similarProductIds }: { id: number; similarProductIds: number[] }) =>
      productApi.updateSimilarProducts(id, similarProductIds),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      queryClient.invalidateQueries({ queryKey: ["product", id, "similar"] });
    },
  });
}

export function useRelatedProducts(productId: number, enabled = true, limit = 3) {
  return useQuery<ProductRelatedItem[]>({
    queryKey: ["product", productId, "related", limit],
    queryFn: () => productApi.getRelatedProducts(productId, limit),
    enabled: productId > 0 && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateRelatedProducts(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, relatedProductIds }: { id: number; relatedProductIds: number[] }) =>
      productApi.updateRelatedProducts(id, relatedProductIds),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      queryClient.invalidateQueries({ queryKey: ["product", id, "related"] });
    },
  });
}

export function useProductSearch(query: string, excludeIds: number[] = []) {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productApi.getProducts({ q: query, status: ProductStatusEnum.APPROVED, limit: 10 }),
    enabled: query.trim().length > 0,
    select: (data) => data.items.filter((p) => !excludeIds.includes(p.id)),
    staleTime: 60 * 1000,
  });
}

export function useDeleteProductMedia(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: number) => productApi.deleteProductMedia(productId, mediaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useUpdateProduct(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdateIn }) => productApi.updateProduct(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useCreateProductLink(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductLinkIn) => productApi.createProductLink(productId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useUpdateProductLink(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ linkId, data }: { linkId: number; data: Partial<ProductLinkIn> }) =>
      productApi.updateProductLink(productId, linkId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useDeleteProductLink(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: number) => productApi.deleteProductLink(productId, linkId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useUploadProductLogo(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => productApi.uploadProductLogo(productId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useDeleteProductLogo(productId: number, slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => productApi.deleteProductLogo(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product", slug] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
