/**
 * Search Slice — Redux Toolkit
 * src/store/slices/searchSlice.ts
 *
 * Manages all doctor search filter state.
 * Consumed by Phase 6 (filter sidebar) and Phase 7 (doctor listing).
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SortOptionId, SpecialtyId } from "@/constants";
import type { RootState } from "@/store";

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */
export interface SearchFilters {
  query:       string;
  city:        string;
  specialty:   SpecialtyId | "";
  insurance:   string;
  gender:      "male" | "female" | "";
  visitType:   "in_person" | "online" | "home_visit" | "";
  minRating:   number;
  hasPhoto:    boolean;
  isAvailable: boolean;
}

export interface SearchState {
  filters:     SearchFilters;
  sortBy:      SortOptionId;
  currentPage: number;
  isLoading:   boolean;
}

/* ----------------------------------------------------------------
   Initial state
   ---------------------------------------------------------------- */
const DEFAULT_FILTERS: SearchFilters = {
  query:       "",
  city:        "",
  specialty:   "",
  insurance:   "",
  gender:      "",
  visitType:   "",
  minRating:   0,
  hasPhoto:    false,
  isAvailable: false,
};

const initialState: SearchState = {
  filters:     DEFAULT_FILTERS,
  sortBy:      "relevance",
  currentPage: 1,
  isLoading:   false,
};

/* ----------------------------------------------------------------
   Slice
   ---------------------------------------------------------------- */
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    /** Update one or more filter fields at once */
    setFilters(
      state,
      action: PayloadAction<Partial<SearchFilters>>
    ) {
      state.filters     = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to page 1 on filter change
    },

    /** Set only the text query (hero search bar) */
    setQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload;
      state.currentPage   = 1;
    },

    /** Set the city filter */
    setCity(state, action: PayloadAction<string>) {
      state.filters.city = action.payload;
      state.currentPage  = 1;
    },

    /** Set specialty filter */
    setSpecialty(state, action: PayloadAction<SpecialtyId | "">) {
      state.filters.specialty = action.payload;
      state.currentPage       = 1;
    },

    /** Change sort order */
    setSortBy(state, action: PayloadAction<SortOptionId>) {
      state.sortBy      = action.payload;
      state.currentPage = 1;
    },

    /** Go to a specific page */
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },

    /** Set loading state (for manual loading control) */
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    /** Reset all filters to defaults */
    resetFilters(state) {
      state.filters     = DEFAULT_FILTERS;
      state.currentPage = 1;
    },

    /** Reset everything */
    resetSearch() {
      return initialState;
    },
  },
});

/* ----------------------------------------------------------------
   Actions & Reducer
   ---------------------------------------------------------------- */
export const {
  setFilters,
  setQuery,
  setCity,
  setSpecialty,
  setSortBy,
  setPage,
  setLoading,
  resetFilters,
  resetSearch,
} = searchSlice.actions;

export const searchReducer = searchSlice.reducer;

/* ----------------------------------------------------------------
   Selectors
   ---------------------------------------------------------------- */
export const selectSearchFilters  = (state: RootState) => state.search.filters;
export const selectSortBy         = (state: RootState) => state.search.sortBy;
export const selectCurrentPage    = (state: RootState) => state.search.currentPage;
export const selectSearchIsLoading = (state: RootState) => state.search.isLoading;
export const selectSearchQuery    = (state: RootState) => state.search.filters.query;
export const selectSearchCity     = (state: RootState) => state.search.filters.city;
