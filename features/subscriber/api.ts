import { BASE_URL } from "@/api/client";
import type { SubscribeResult } from "./types";

export async function subscribe(email: string): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${BASE_URL}/subscriber`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.status === 201) return { status: "subscribed" };
    if (res.status === 409) return { status: "already_subscribed" };
    if (res.status === 422) return { status: "invalid_email" };
    if (res.status === 429) return { status: "rate_limited" };

    const body = await res.json().catch(() => ({}));
    const msg = body?.detail || body?.message || body?.error || `Request failed (${res.status})`;
    return { status: "error", message: typeof msg === "string" ? msg : JSON.stringify(msg) };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
