import { BASE_URL } from "@/api/client";
import type { SubscribeResult, UnsubscribeResult } from "./types";

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

export async function unsubscribe(token: string): Promise<UnsubscribeResult> {
  try {
    const res = await fetch(
      `${BASE_URL}/subscriber/unsubscribe?token=${encodeURIComponent(token)}`
    );
    if (res.status === 200) return { status: "unsubscribed" };
    if (res.status === 404) return { status: "invalid_token" };
    const body = await res.json().catch(() => ({}));
    const msg = body?.detail || body?.message || body?.error || `Request failed (${res.status})`;
    return { status: "error", message: typeof msg === "string" ? msg : JSON.stringify(msg) };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
