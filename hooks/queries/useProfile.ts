import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import * as authApi from "@/api/auth";
import { AUTH_QUERY_KEYS } from "@/hooks/queries/useAuth";
import type { UpdateProfilePayload, UpdateProfileResponse } from "@/types/auth";

// ─── useUpdateProfile ─────────────────────────────────────────────────────────

/**
 * PATCH /api/v1/user/{user_id} — updates the user's name.
 * Invalidates session on success so GlobalProvider re-fetches the latest user.
 *
 * @example
 * const { mutate: updateProfile, isPending } = useUpdateProfile(userId);
 * updateProfile({ name: "New Name" });
 */
export function useUpdateProfile(userId: number, options?: UseMutationOptions<UpdateProfileResponse, Error, UpdateProfilePayload>) {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, Error, UpdateProfilePayload>({
    ...options,
    mutationFn: (payload) => authApi.updateProfile(userId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.session });
      options?.onSuccess?.(...args);
    },
  });
}
