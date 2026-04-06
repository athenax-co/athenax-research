import { useMutation } from "@tanstack/react-query";
import * as productApi from "@/api/product";
import type { ProductIn } from "@/types/product";

// ─── useSubmitProduct ─────────────────────────────────────────────────────────

export function useSubmitProduct() {
  return useMutation({
    mutationFn: (data: ProductIn) => productApi.submitProduct(data),
  });
}
