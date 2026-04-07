import { BASE_URL, handleResponse } from "@/api/client";
import type { ProductIn, ProductOut, ProductDetailOut, ProductStatus, ProductComment } from "@/types/product";

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

export async function bookmarkProduct(id: number, bookmarked: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${id}/bookmark`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookmarked }),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getProductBySlug(slug: string): Promise<ProductDetailOut> {
  const res = await fetch(`${BASE_URL}/product/slug/${slug}`, { credentials: "include" });
  return handleResponse<ProductDetailOut>(res);
}

export async function voteProduct(id: number, voted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${id}/vote`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voted }),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getMyProducts(status?: ProductStatus): Promise<ProductOut[]> {
  const url = status ? `${BASE_URL}/product/me?status=${status}` : `${BASE_URL}/product/me`;
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

export async function interestProduct(id: number, interested: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${id}/interest`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interested }),
    credentials: "include",
  });
  return handleResponse<void>(res);
}

export async function getComments(productId: number, limit = 50, offset = 0): Promise<ProductComment[]> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments?limit=${limit}&offset=${offset}`);
  return handleResponse<ProductComment[]>(res);
}

export async function createComment(productId: number, text: string): Promise<ProductComment> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    credentials: "include",
  });
  return handleResponse<ProductComment>(res);
}

export async function updateComment(productId: number, commentId: number, text: string): Promise<ProductComment> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    credentials: "include",
  });
  return handleResponse<ProductComment>(res);
}

export async function deleteComment(productId: number, commentId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/product/${productId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<void>(res);
}
