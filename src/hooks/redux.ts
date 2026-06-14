/**
 * Typed Redux Hooks
 * src/hooks/redux.ts
 *
 * Use these instead of the plain `useDispatch` / `useSelector`
 * from react-redux throughout the entire app.
 *
 * ✅ useAppDispatch — typed to AppDispatch (knows about thunks)
 * ✅ useAppSelector — typed to RootState (no manual type casting)
 *
 * Usage:
 *   const dispatch = useAppDispatch();
 *   const filters  = useAppSelector(selectSearchFilters);
 */

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

/** Pre-typed dispatch hook — use this everywhere, not useDispatch */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Pre-typed selector hook — use this everywhere, not useSelector */
export const useAppSelector = useSelector.withTypes<RootState>();
