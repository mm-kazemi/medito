/**
 * Auth Slice — Redux Toolkit
 * src/store/slices/authSlice.ts
 *
 * Manages authentication state: current user, token, and role.
 * Full login/register logic implemented in Phase 10.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "@/types/global";
import type { RootState } from "@/store";

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */
export interface AuthUser {
  id:        string;
  name:      string;
  phone:     string;
  email:     string | null;
  avatar:    string | null;
  role:      UserRole;
  isVerified: boolean;
}

export interface AuthState {
  user:          AuthUser | null;
  accessToken:   string | null;
  isAuthenticated: boolean;
  isInitialised:   boolean; // true once we've checked storage on mount
}

/* ----------------------------------------------------------------
   Initial state
   ---------------------------------------------------------------- */
const initialState: AuthState = {
  user:            null,
  accessToken:     null,
  isAuthenticated: false,
  isInitialised:   false,
};

/* ----------------------------------------------------------------
   Slice
   ---------------------------------------------------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Called after successful login / token refresh */
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) {
      state.user            = action.payload.user;
      state.accessToken     = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isInitialised   = true;
    },

    /** Update only the user profile (e.g. after profile edit) */
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /** Called on logout or 401 */
    clearCredentials(state) {
      state.user            = null;
      state.accessToken     = null;
      state.isAuthenticated = false;
    },

    /** Mark auth check as complete (even if not authenticated) */
    setInitialised(state) {
      state.isInitialised = true;
    },
  },
});

/* ----------------------------------------------------------------
   Actions & Reducer
   ---------------------------------------------------------------- */
export const {
  setCredentials,
  updateUser,
  clearCredentials,
  setInitialised,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

/* ----------------------------------------------------------------
   Selectors
   ---------------------------------------------------------------- */
export const selectCurrentUser      = (state: RootState) => state.auth.user;
export const selectIsAuthenticated  = (state: RootState) => state.auth.isAuthenticated;
export const selectIsInitialised    = (state: RootState) => state.auth.isInitialised;
export const selectUserRole         = (state: RootState) => state.auth.user?.role ?? null;
export const selectAccessToken      = (state: RootState) => state.auth.accessToken;
export const selectIsDoctor         = (state: RootState) => state.auth.user?.role === "doctor";
export const selectIsPatient        = (state: RootState) => state.auth.user?.role === "patient";
