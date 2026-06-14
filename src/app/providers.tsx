/**
 * App Providers — Combined Provider Tree
 * src/app/providers.tsx
 *
 * This single component composes all context providers in the
 * correct order. Import it once in the root layout.
 *
 * Provider order (outer → inner):
 *   StoreProvider (Redux)
 *     └─ QueryProvider (React Query)
 *
 * Why this order?
 * React Query's QueryClient is independent of Redux. Either can wrap
 * the other. We put Redux outermost so that QueryProvider error
 * callbacks (Phase 6+) can dispatch Redux actions if needed.
 */

"use client";

import { StoreProvider } from "@/store/StoreProvider";
import { QueryProvider } from "@/lib/query/QueryProvider";

interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </StoreProvider>
  );
}
