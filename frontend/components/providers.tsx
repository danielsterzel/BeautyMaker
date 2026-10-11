"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { refreshSession } from "@/lib/api/client";
import { currentUserQueryKey } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/storage";

function SessionBootstrap() {
  const markSessionInitialized = useAuthStore(
    (store) => store.markSessionInitialized,
  );

  useEffect(() => {
    void refreshSession()
      .catch(() => {
        // An absent or expired refresh cookie simply means there is no session.
      })
      .finally(markSessionInitialized);
  }, [markSessionInitialized]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 30_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  useEffect(
    () =>
      useAuthStore.subscribe((state, previousState) => {
        if (previousState.accessToken && !state.accessToken) {
          queryClient.removeQueries({ queryKey: currentUserQueryKey });
        }
      }),
    [queryClient],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap />
      {children}
    </QueryClientProvider>
  );
}
