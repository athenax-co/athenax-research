export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

export async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.detail || body?.message || body?.error || `Request failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return body as T;
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

type Opts = { auth?: boolean };

function buildInit(method: string, body?: unknown, { auth = false }: Opts = {}): RequestInit {
  return {
    method,
    credentials: auth ? "include" : "same-origin",
    ...(body !== undefined && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  };
}

function req<T>(path: string, init: RequestInit): Promise<T> {
  return fetch(`${BASE_URL}${path}`, init).then(handleResponse<T>);
}

export const http = {
  get:   <T>(path: string, opts?: Opts)                => req<T>(path, buildInit("GET",    undefined, opts)),
  post:  <T>(path: string, body?: unknown, opts?: Opts) => req<T>(path, buildInit("POST",   body,      opts)),
  patch: <T>(path: string, body: unknown,  opts?: Opts) => req<T>(path, buildInit("PATCH",  body,      opts)),
  put:   <T>(path: string, body: unknown,  opts?: Opts) => req<T>(path, buildInit("PUT",    body,      opts)),
  del:   <T>(path: string, opts?: Opts)                => req<T>(path, buildInit("DELETE", undefined, opts)),
};
