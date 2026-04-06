import { BASE_URL, handleResponse } from "@/api/client";
import type { ProductIn, ProductOut, ProductStatus } from "@/types/product";

export async function submitProduct(data: ProductIn): Promise<void> {
  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getProducts(status?: ProductStatus): Promise<ProductOut[]> {
  const url = status ? `${BASE_URL}/product?status=${status}` : `${BASE_URL}/product`;
  const res = await fetch(url, { credentials: "include" });
  return handleResponse<ProductOut[]>(res);
}

export async function updateProductStatus(id: number, status: ProductStatus): Promise<ProductOut> {
  const res = await fetch(`${BASE_URL}/product/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  return handleResponse<ProductOut>(res);
}
