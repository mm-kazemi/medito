/**
 * TanStack Query v5 — QueryClient configuration
 * src/lib/query/client.ts
 *
 * A single QueryClient instance is created here and imported by
 * the QueryProvider. Do NOT call `new QueryClient()` elsewhere.
 */

import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";
import type { ApiError } from "@/types/global";

/* ----------------------------------------------------------------
   Default query options
   ---------------------------------------------------------------- */
const QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      /**
       * staleTime: 5 minutes
       * Data stays fresh for 5 min — no background refetch within that window.
       */
      staleTime: 5 * 60 * 1_000,

      /**
       * gcTime (was cacheTime in v4): 10 minutes
       * Inactive cache entries are garbage-collected after 10 min.
       */
      gcTime: 10 * 60 * 1_000,

      /**
       * Retry once on failure (avoids hammering a broken API).
       * Skips retry for 4xx client errors — those are permanent.
       */
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        const status = apiError.status ?? 0;
        if (status >= 400 && status < 500) return false;
        return failureCount < 1;
      },

      /** Refetch on window focus is noisy in a medical booking app */
      refetchOnWindowFocus: false,

      /** Do reconnect-triggered refetch */
      refetchOnReconnect: true,
    },

    mutations: {
      /** Don't auto-retry mutations — mutations are not idempotent */
      retry: 0,
    },
  },
};

/* ----------------------------------------------------------------
   Singleton QueryClient
   ---------------------------------------------------------------- */
export const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);
