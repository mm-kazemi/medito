/**
 * Utility Functions — توابع کمکی
 * cn: class-names merger (clsx + tailwind-merge)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names intelligently.
 * Resolves conflicts and deduplicates classes.
 *
 * @example
 * cn("px-4 py-2", condition && "bg-primary", "py-3")
 * // → "px-4 bg-primary py-3" (py-2 removed, py-3 wins)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Persian currency (تومان).
 */
export function formatCurrency(
  amount: number,
  currency: "تومان" | "ریال" = "تومان"
): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " " + currency;
}

/**
 * Converts Western Arabic numerals to Eastern Arabic (Persian) numerals.
 */
export function toPersianNumerals(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) + 1728)
  );
}

/**
 * Converts Persian/Arabic numerals back to Western Arabic.
 */
export function toLatinNumerals(value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 1728)
    )
    .replace(/[\u0660-\u0669]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 1632)
    );
}

/**
 * Formats an ISO date string to a human-readable Persian date string.
 * Uses Intl.DateTimeFormat with fa-IR locale.
 */
export function formatPersianDate(
  isoDate: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(isoDate));
}

/**
 * Formats an ISO date string to a time string in Persian locale.
 */
export function formatPersianTime(isoDate: string): string {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

/**
 * Generates a slug from a Persian or English string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\u200B-\u200D\uFEFF]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Truncates a string to a given length with an ellipsis.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

/**
 * Debounces a function call.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Returns a range array [start, ..., end].
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
