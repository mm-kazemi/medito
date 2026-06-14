/**
 * Redux Store — Root Configuration
 * src/store/index.ts
 *
 * Combines all slices into a single store.
 * RootState and AppDispatch are inferred here and exported
 * for use in typed hooks (src/hooks/redux.ts).
 */

import { configureStore } from "@reduxjs/toolkit";
import { searchReducer } from "./slices/searchSlice";
import { authReducer }   from "./slices/authSlice";
import { uiReducer }     from "./slices/uiSlice";

/* ----------------------------------------------------------------
   Store
   ---------------------------------------------------------------- */
export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth:   authReducer,
    ui:     uiReducer,
  },
  /**
   * Redux DevTools is enabled in development automatically by RTK.
   * Explicitly disable in production for security.
   */
  devTools: process.env.NODE_ENV !== "production",

  /**
   * Middleware: RTK adds redux-thunk by default.
   * Phase 2 keeps defaults. Phase 6+ may add redux-query middleware.
   */
});

/* ----------------------------------------------------------------
   Inferred types — single source of truth
   ---------------------------------------------------------------- */
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* ----------------------------------------------------------------
   Store Provider is in src/store/StoreProvider.tsx
   ---------------------------------------------------------------- */
