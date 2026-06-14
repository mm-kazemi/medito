/**
 * React Query Provider
 * src/lib/query/QueryProvider.tsx
 *
 * Wraps children with TanStack Query's QueryClientProvider.
 * Must be a Client Component (providers use React context).
 *
 * Usage (via the combined Providers component):
 *   <QueryProvider>{children}</QueryProvider>
 */

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./client";

interface QueryProviderProps {
  readonly children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only ships in development — tree-shaken in production */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
