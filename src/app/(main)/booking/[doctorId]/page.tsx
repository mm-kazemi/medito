/**
 * Booking Page — Dynamic Route
 * src/app/(main)/booking/[doctorId]/page.tsx
 *
 * Server Component: awaits params, generates metadata, renders client island.
 */

import type { Metadata } from "next";
import { BookingPageClient } from "@/features/booking/BookingPageClient";

type BookingParams = { params: Promise<{ doctorId: string }> };

export async function generateMetadata({ params }: BookingParams): Promise<Metadata> {
  const { doctorId } = await params;
  return {
    title:       `رزرو نوبت — ${doctorId.replace(/-/g, " ")}`,
    description: "انتخاب تاریخ و ساعت ویزیت و تأیید نوبت پزشک",
  };
}

export default async function BookingPage({ params }: BookingParams) {
  const { doctorId } = await params;
  return <BookingPageClient doctorId={doctorId} />;
}
