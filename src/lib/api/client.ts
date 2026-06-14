/**
 * Axios API Client
 * src/lib/api/client.ts
 *
 * Two pre-configured instances:
 *  - publicApiClient  → no auth header (public endpoints)
 *  - authApiClient    → injects Bearer token via request interceptor
 *
 * Both share:
 *  - baseURL from env
 *  - 10s timeout
 *  - JSON content-type
 *  - Response error normalisation (→ ApiError)
 *  - 401 auto-redirect to /login (auth client only)
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

import { API_BASE_URL, API_TIMEOUT } from "@/constants";
import type { ApiError } from "@/types/global";

/* ----------------------------------------------------------------
   Helper — token storage
   Phase 10 will replace these with cookie/session logic.
   ---------------------------------------------------------------- */
const TOKEN_KEY = "doktar_access_token" as const;

export const tokenStorage = {
  get: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
} as const;

/* ----------------------------------------------------------------
   Base Axios config shared by both instances
   ---------------------------------------------------------------- */
const BASE_CONFIG: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

/* ----------------------------------------------------------------
   Response error normaliser
   Converts any Axios error into a typed ApiError shape.
   ---------------------------------------------------------------- */
function normaliseError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiError> | undefined;
    return {
      message: data?.message ?? error.message ?? "خطای ناشناخته",
      errors:  data?.errors,
      code:    data?.code ?? String(error.response?.status ?? "NETWORK_ERROR"),
      status:  error.response?.status,
    };
  }
  return {
    message: error instanceof Error ? error.message : "خطای ناشناخته",
    code:    "UNKNOWN",
  };
}

/* ================================================================
   PUBLIC API CLIENT — no authentication
   ================================================================ */
function createPublicClient(): AxiosInstance {
  const instance = axios.create(BASE_CONFIG);

  /* --- Response interceptor: normalise errors --- */
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => Promise.reject(normaliseError(error))
  );

  return instance;
}

export const publicApiClient: AxiosInstance = createPublicClient();

/* ================================================================
   AUTH API CLIENT — attaches Bearer token + handles 401
   ================================================================ */
function createAuthClient(): AxiosInstance {
  const instance = axios.create(BASE_CONFIG);

  /* --- Request interceptor: inject token --- */
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = tokenStorage.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(normaliseError(error))
  );

  /* --- Response interceptor: handle 401 + normalise errors --- */
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        tokenStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(normaliseError(error));
    }
  );

  return instance;
}

export const authApiClient: AxiosInstance = createAuthClient();

/* ================================================================
   TYPED REQUEST HELPERS
   Wrap .data extraction so callers get T directly, not AxiosResponse<T>.
   ================================================================ */
export async function apiGet<T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.get<T>(url, config);
  return response.data;
}

export async function apiPost<T>(
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.post<T>(url, data, config);
  return response.data;
}

export async function apiPut<T>(
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.put<T>(url, data, config);
  return response.data;
}

export async function apiPatch<T>(
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.patch<T>(url, data, config);
  return response.data;
}

export async function apiDelete<T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await client.delete<T>(url, config);
  return response.data;
}
