/**
 * Doctor Profile Page — Dynamic Route
 * src/app/(main)/doctors/[slug]/page.tsx
 *
 * Server Component that:
 *   1. Awaits the `params` Promise (Next.js 15+ requirement)
 *   2. Generates per-page metadata for SEO
 *   3. Provides generateStaticParams for the 12 known slugs
 *   4. Renders DoctorProfileClient (client island) with the slug
 *
 * Architecture:
 *   Server page (params) → DoctorProfileClient (useQuery → fetchDoctorBySlug)
 *
 * The client island handles its own loading/error/data states so the
 * server page stays lean and prerendering-safe.
 */

import type { Metadata } from "next";
/* params is a Promise in Next.js 15+ */
type SlugParams = { params: Promise<{ slug: string }> };
import { DoctorProfileClient } from "@/features/doctors/DoctorProfileClient";

/* ----------------------------------------------------------------
   Provide known slugs so Next.js can prerender at build time.
   Additional slugs (not in this list) are rendered on demand.
   ---------------------------------------------------------------- */
export function generateStaticParams() {
  return [
    { slug: "dr-ali-rezaei" },
    { slug: "dr-negar-mohammadi" },
    { slug: "dr-mohsen-karimi" },
    { slug: "dr-sara-ahmadi" },
    { slug: "dr-reza-hosseini" },
    { slug: "dr-maryam-sadeghi" },
    { slug: "dr-amir-taheri" },
    { slug: "dr-fatemeh-moradi" },
    { slug: "dr-hasan-bahrami" },
    { slug: "dr-zahra-nikpour" },
    { slug: "dr-mehdi-nazari" },
    { slug: "dr-kimia-rashidi" },
  ];
}

/* ----------------------------------------------------------------
   Per-page SEO metadata
   ---------------------------------------------------------------- */
export async function generateMetadata(
  { params }: SlugParams
): Promise<Metadata> {
  const { slug } = await params;

  /* Convert slug to a readable name for the title */
  const readableName = slug
    .replace(/^dr-/, "دکتر ")
    .replace(/-/g, " ");

  return {
    title: `پروفایل ${readableName}`,
    description: `مشاهده پروفایل کامل، نوبت‌دهی آنلاین و اطلاعات کلینیک ${readableName} در مدیتو.`,
  };
}

/* ----------------------------------------------------------------
   Page component
   ---------------------------------------------------------------- */
export default async function DoctorProfilePage(
  { params }: SlugParams
) {
  const { slug } = await params;

  return <DoctorProfileClient slug={slug} />;
}
