import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import * as authApi from "@/api/auth";
import { setUserCategories } from "@/api/reference";
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
import type { CategoryRef } from "@/types/reference";

// ─── query keys ──────────────────────────────────────────────────────────────

export const AUTH_QUERY_KEYS = {
  session: ["auth", "session"] as const,
};

// ─── useSignup ────────────────────────────────────────────────────────────────

/**
 * Registers a new user.
 *
 * @example
 * const { mutate: signup, isPending, error } = useSignup();
 * signup({ name, email, password });
 */
export function useSignup(options?: UseMutationOptions<SignupResponse, Error, SignupPayload>) {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: authApi.signup,
    ...options,
  });
}

// ─── useVerifyEmail ───────────────────────────────────────────────────────────

/**
 * Verifies a user's email using the token query param (GET).
 * Backend sets auth cookie on success and session query is refreshed.
 */
export function useVerifyEmail(options?: UseMutationOptions<VerifyEmailResponse, Error, VerifyEmailPayload>) {
  const queryClient = useQueryClient();

  return useMutation<VerifyEmailResponse, Error, VerifyEmailPayload>({
    ...options,
    mutationFn: authApi.verifyEmail,
    onSuccess: (...args) => {
      // If backend sets/updates auth cookie during verification, refresh session state.
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.session });
      options?.onSuccess?.(...args);
    },
  });
}

// ─── useResendVerification ────────────────────────────────────────────────────

/**
 * Requests a new verification email for the given address.
 */
export function useResendVerification(options?: UseMutationOptions<ResendVerificationResponse, Error, ResendVerificationPayload>) {
  return useMutation<ResendVerificationResponse, Error, ResendVerificationPayload>({
    mutationFn: authApi.resendVerification,
    ...options,
  });
}

// ─── useLogin ─────────────────────────────────────────────────────────────────

/**
 * Logs a user in.  On success the backend sets an HTTP-only cookie.
 * The session query is invalidated so `useSession` re-fetches automatically.
 */
export function useLogin(options?: UseMutationOptions<LoginResponse, Error, LoginPayload>) {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    ...options,
    mutationFn: authApi.login,
    onSuccess: (...args) => {
      // Invalidate the session so useSession refetches the new user
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.session });
      options?.onSuccess?.(...args);
    },
  });
}

// ─── useSession ───────────────────────────────────────────────────────────────

/**
 * Loads the currently authenticated user by sending a POST /verify with
 *
 * @example
 * const { data: user, isLoading } = useSession();
 */
export function useSession() {
  return useQuery<SessionUser | null, Error>({
    queryKey: AUTH_QUERY_KEYS.session,
    queryFn: async () => {
      try {
        return await authApi.verifySession();
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // treat as fresh for 5 min
    retry: false,
  });
}

// ─── useForgotPassword ────────────────────────────────────────────────────────

/**
 * Sends a password-reset email to the provided address.
 */
export function useForgotPassword(options?: UseMutationOptions<ForgotPasswordResponse, Error, ForgotPasswordPayload>) {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: authApi.forgotPassword,
    ...options,
  });
}

// ─── useResetPassword ─────────────────────────────────────────────────────────

/**
 * Completes a password reset with the token from the email.
 */
export function useResetPassword(options?: UseMutationOptions<ResetPasswordResponse, Error, ResetPasswordPayload>) {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: authApi.resetPassword,
    ...options,
  });
}

// ─── useSetUserCategories ─────────────────────────────────────────────────────

/**
 * Sets (replaces) the category list for the given user.
 * Used to apply categories collected during signup after the session is verified.
 */
export function useSetUserCategories(
  options?: UseMutationOptions<CategoryRef[], Error, { userId: number; categoryIds: number[] }>
) {
  return useMutation<CategoryRef[], Error, { userId: number; categoryIds: number[] }>({
    mutationFn: ({ userId, categoryIds }) => setUserCategories(userId, categoryIds),
    ...options,
  });
}

// ─── useLogout ────────────────────────────────────────────────────────────────

/**
 * Logs the current user out.  Clears the session query cache on success.
 */
export function useLogout(options?: UseMutationOptions<LogoutResponse, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, Error, void>({
    ...options,
    mutationFn: () => authApi.logout(),
    onSuccess: (...args) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.session });
      options?.onSuccess?.(...args);
    },
  });
}
