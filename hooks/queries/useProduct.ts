import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productApi from "@/api/product";
import type { ProductIn, ProductStatus } from "@/types/product";

// ─── useSubmitProduct ─────────────────────────────────────────────────────────

export function useSubmitProduct() {
  return useMutation({
    mutationFn: (data: ProductIn) => productApi.submitProduct(data),
  });
}

// ─── useProducts ──────────────────────────────────────────────────────────────

export function useProducts(status: ProductStatus) {
  return useQuery({
    queryKey: ["products", status],
    queryFn: () => productApi.getProducts(status),
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
