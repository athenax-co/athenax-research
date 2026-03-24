const AUTH_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`;

// ─── helpers ────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.detail || body?.message || body?.error || `Request failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return body as T;
}

// ─── types ───────────────────────────────────────────────────────────────────

export type Roles = "user" | "researcher" | "sponsor" | "builder";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: Roles;
}

export interface SignupResponse {
  message: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

// ─── auth functions ───────────────────────────────────────────────────────────

/**
 * POST /api/v1/user/signup
 */
export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  const res = await fetch(`${AUTH_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<SignupResponse>(res);
}

/**
 * GET /api/v1/user/verify-email?token=...
 */
export async function verifyEmail(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
  const params = new URLSearchParams({ token: payload.token });
  const res = await fetch(`${AUTH_BASE}/verify-email?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<VerifyEmailResponse>(res);
}

/**
 * POST /api/v1/user/verify-email/resend
 */
export async function resendVerification(payload: ResendVerificationPayload): Promise<ResendVerificationResponse> {
  const res = await fetch(`${AUTH_BASE}/verify-email/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<ResendVerificationResponse>(res);
}

/**
 * POST /api/v1/user/login  (x-www-form-urlencoded per the spec)
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const body = new URLSearchParams({
    username: payload.email,
    password: payload.password,
  });
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    credentials: "include",
  });
  return handleResponse<LoginResponse>(res);
}

/**
 * POST /api/v1/user/verify  — confirm the current session
 */
export async function verifySession(): Promise<SessionUser> {
  const res = await fetch(`${AUTH_BASE}/verify`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse<SessionUser>(res);
}

/**
 * POST /api/v1/user/forgot-password
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  const res = await fetch(`${AUTH_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<ForgotPasswordResponse>(res);
}

/**
 * POST /api/v1/user/reset-password
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  const res = await fetch(`${AUTH_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<ResetPasswordResponse>(res);
}

/**
 * POST /api/v1/user/logout
 */
export async function logout(): Promise<LogoutResponse> {
  const res = await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse<LogoutResponse>(res);
}
