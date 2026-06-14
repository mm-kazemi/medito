/**
 * Redux Store Provider
 * src/store/StoreProvider.tsx
 *
 * Wraps children with react-redux <Provider>.
 * Must be a Client Component — Redux uses React context.
 *
 * Next.js App Router Note:
 * The root layout is a Server Component. We cannot use hooks or
 * context directly there. This thin Client Component boundary
 * is the recommended pattern for RTK + App Router.
 */

"use client";

import { Provider } from "react-redux";
import { store } from "./index";

interface StoreProviderProps {
  readonly children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
