/**
 * Doctors Search Page — Phase 6
 * src/app/(main)/doctors/page.tsx
 *
 * Server Component: reads URL searchParams (Next.js 15 Promise API),
 * passes resolved initial values to the client island SearchPageClient.
 *
 * Supported URL params:
 *   ?q=       → initial text query   → filters.query
 *   ?city=    → initial city id      → filters.city
 *   ?spec=    → initial specialty id → filters.specialty
 *
 * Example: /doctors?q=قلب&city=tehran&spec=cardiology
 */

import type { Metadata } from "next";
import { SearchPageClient } from "@/features/search/SearchPageClient";

/* ----------------------------------------------------------------
   Metadata
   ---------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "جستجوی پزشک",
  description:
    "جستجو در میان بیش از ۱۰٬۰۰۰ پزشک متخصص در سراسر ایران. فیلتر بر اساس تخصص، شهر، امتیاز و نوع ویزیت.",
};

/* ----------------------------------------------------------------
   Page (async Server Component — searchParams is a Promise in Next.js 15+)
   ---------------------------------------------------------------- */
export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  /* Safely extract scalar string values */
  const initialQuery     = typeof params.q    === "string" ? params.q    : "";
  const initialCity      = typeof params.city === "string" ? params.city : "";
  const initialSpecialty = typeof params.spec === "string" ? params.spec : "";

  return (
    <SearchPageClient
      initialQuery={initialQuery}
      initialCity={initialCity}
      initialSpecialty={initialSpecialty}
    />
  );
}
