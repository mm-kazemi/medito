/**
 * UI Slice — Redux Toolkit
 * src/store/slices/uiSlice.ts
 *
 * Manages ephemeral UI state: drawer, modals, toast notifications.
 * Used by Phase 4 (App Shell) and beyond.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */
export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id:       string;
  message:  string;
  variant:  ToastVariant;
  duration: number; // ms
}

export interface UIState {
  isMobileDrawerOpen: boolean;
  isSearchModalOpen:  boolean;
  isFilterSidebarOpen: boolean;
  toasts:             Toast[];
}

/* ----------------------------------------------------------------
   Initial state
   ---------------------------------------------------------------- */
const initialState: UIState = {
  isMobileDrawerOpen:  false,
  isSearchModalOpen:   false,
  isFilterSidebarOpen: false,
  toasts:              [],
};

/* ----------------------------------------------------------------
   Slice
   ---------------------------------------------------------------- */
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /* --- Drawers & Modals --- */
    openMobileDrawer(state) {
      state.isMobileDrawerOpen = true;
    },
    closeMobileDrawer(state) {
      state.isMobileDrawerOpen = false;
    },
    toggleMobileDrawer(state) {
      state.isMobileDrawerOpen = !state.isMobileDrawerOpen;
    },

    openSearchModal(state) {
      state.isSearchModalOpen = true;
    },
    closeSearchModal(state) {
      state.isSearchModalOpen = false;
    },

    openFilterSidebar(state) {
      state.isFilterSidebarOpen = true;
    },
    closeFilterSidebar(state) {
      state.isFilterSidebarOpen = false;
    },
    toggleFilterSidebar(state) {
      state.isFilterSidebarOpen = !state.isFilterSidebarOpen;
    },

    /* --- Toast notifications --- */
    addToast(
      state,
      action: PayloadAction<Omit<Toast, "id">>
    ) {
      const { duration = 4_000, ...rest } = action.payload;
      const toast: Toast = { id: crypto.randomUUID(), duration, ...rest };
      state.toasts.push(toast);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts(state) {
      state.toasts = [];
    },
  },
});

/* ----------------------------------------------------------------
   Actions & Reducer
   ---------------------------------------------------------------- */
export const {
  openMobileDrawer,
  closeMobileDrawer,
  toggleMobileDrawer,
  openSearchModal,
  closeSearchModal,
  openFilterSidebar,
  closeFilterSidebar,
  toggleFilterSidebar,
  addToast,
  removeToast,
  clearAllToasts,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;

/* ----------------------------------------------------------------
   Selectors
   ---------------------------------------------------------------- */
export const selectIsMobileDrawerOpen  = (state: RootState) => state.ui.isMobileDrawerOpen;
export const selectIsSearchModalOpen   = (state: RootState) => state.ui.isSearchModalOpen;
export const selectIsFilterSidebarOpen = (state: RootState) => state.ui.isFilterSidebarOpen;
export const selectToasts              = (state: RootState) => state.ui.toasts;

/* ----------------------------------------------------------------
   Toast helper actions (convenience wrappers for typed callers)
   ---------------------------------------------------------------- */
export const toastActions = {
  success: (message: string, duration = 4_000): ReturnType<typeof addToast> =>
    addToast({ message, variant: "success", duration }),
  error: (message: string, duration = 6_000): ReturnType<typeof addToast> =>
    addToast({ message, variant: "error", duration }),
  warning: (message: string, duration = 5_000): ReturnType<typeof addToast> =>
    addToast({ message, variant: "warning", duration }),
  info: (message: string, duration = 4_000): ReturnType<typeof addToast> =>
    addToast({ message, variant: "info", duration }),
};
