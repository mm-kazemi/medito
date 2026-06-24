/**
 * Global TypeScript Type Definitions
 * پلتفرم مدیتو — تعاریف تایپ سراسری
 *
 * These declarations extend built-in types and define project-wide
 * utility types used across all features.
 */

/* ============================================================
   UTILITY TYPES
   ============================================================ */

/** Makes specific keys optional in an object type */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Makes specific keys required in an object type */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Deeply makes all keys readonly */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/** Extracts the value type of a Record */
export type ValueOf<T> = T[keyof T];

/** Nullable wrapper */
export type Nullable<T> = T | null;

/** Optional wrapper */
export type Optional<T> = T | undefined;

/** Promise or value */
export type MaybePromise<T> = T | Promise<T>;

/* ============================================================
   API TYPES
   ============================================================ */

/** Standard paginated API response shape */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: Nullable<string>;
    next: Nullable<string>;
  };
}

/** Standard API error shape */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  status?: number;
}

/** Standard single-item API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/* ============================================================
   CORE DOMAIN TYPES
   ============================================================ */

/** Iranian provinces (استان‌ها) */
export type Province =
  | "تهران"
  | "اصفهان"
  | "فارس"
  | "خراسان رضوی"
  | "آذربایجان شرقی"
  | "آذربایجان غربی"
  | "گیلان"
  | "مازندران"
  | "کرمانشاه"
  | "البرز"
  | string;

/** Gender */
export type Gender = "male" | "female" | "other";

/** User roles */
export type UserRole = "patient" | "doctor" | "admin";

/** Appointment status */
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

/** Medical visit type */
export type VisitType = "in_person" | "online" | "home_visit";

/* ============================================================
   COMPONENT PROP TYPES
   ============================================================ */

/** Base component props every component can extend */
export interface BaseComponentProps {
  className?: string;
  id?: string;
  "data-testid"?: string;
}

/** Size variants */
export type SizeVariant = "xs" | "sm" | "md" | "lg" | "xl";

/** Color variants aligned with design tokens */
export type ColorVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "warning"
  | "error"
  | "ghost"
  | "outline";

/** Direction (for RTL-aware components) */
export type Direction = "rtl" | "ltr";

/* ============================================================
   NEXT.JS SPECIFIC
   ============================================================ */

/** Next.js page params */
export interface PageParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
