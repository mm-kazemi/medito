/**
 * Custom Hooks — Barrel Export
 * src/hooks/index.ts
 *
 * Phase 2: useAppDispatch, useAppSelector (typed Redux hooks)
 * Phase 7: useSearchSync (bidirectional URL ↔ Redux sync)
 */
export { useAppDispatch, useAppSelector } from "./redux";
export { useSearchSync }                  from "./useSearchSync";
