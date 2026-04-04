export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

/**
 * Parses a fetch Response as JSON and throws a human-readable Error if the
 * request was not successful (non-2xx status). Extracts the error message from
 * the backend's `detail`, `message`, or `error` fields, falling back to the
 * HTTP status code.
 */
export async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.detail || body?.message || body?.error || `Request failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return body as T;
}
