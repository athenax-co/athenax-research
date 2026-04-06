import { BASE_URL, handleResponse } from "@/api/client";
import type { ProductIn } from "@/types/product";

export async function submitProduct(data: ProductIn): Promise<void> {
  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse<void>(res);
}
