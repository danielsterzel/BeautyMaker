"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  confirmEmail,
  getCurrentUser,
  loginUser,
  registerUser,
  resendVerificationEmail,
} from "@/lib/api/auth";
import { useAuthStore } from "@/lib/storage";

export const currentUserQueryKey = ["current-user"] as const;

export function useRegisterMutation() {
  return useMutation({ mutationFn: registerUser });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((store) => store.setToken);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      setToken(response.tokens.accessToken);
      queryClient.setQueryData(currentUserQueryKey, response.user);
    },
  });
}

export function useCurrentUserQuery() {
  const accessToken = useAuthStore((store) => store.accessToken);
  const sessionInitialized = useAuthStore(
    (store) => store.sessionInitialized,
  );

  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    enabled: sessionInitialized && Boolean(accessToken),
  });
}

export function useConfirmEmailMutation() {
  return useMutation({ mutationFn: confirmEmail });
}

export function useResendEmailMutation() {
  return useMutation({ mutationFn: resendVerificationEmail });
}
