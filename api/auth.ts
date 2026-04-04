import { BASE_URL, handleResponse } from "@/api/client";
import type {
  SignupPayload,
  SignupResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  ResendVerificationPayload,
  ResendVerificationResponse,
  LoginPayload,
  LoginResponse,
  SessionUser,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  LogoutResponse,
} from "@/types/auth";

const AUTH_BASE = `${BASE_URL}/user`;

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
