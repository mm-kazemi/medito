/**
 * RegisterForm — Auth Feature
 * src/features/auth/RegisterForm.tsx
 *
 * Patient / Doctor role toggle → conditional council field.
 * RHF + Zod with Persian error messages.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { User, Phone, Lock, Eye, EyeOff, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials } from "@/store/slices/authSlice";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { UserRole } from "@/types/global";

/* ----------------------------------------------------------------
   Schemas — superset covers both roles
   ---------------------------------------------------------------- */
const patientSchema = z.object({
  fullName:      z.string().min(3, "نام باید حداقل ۳ حرف باشد").max(60),
  phone:         z.string().regex(/^09\d{9}$/, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود"),
  password:      z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  councilNumber: z.string().optional(),
});

const doctorSchema = patientSchema.extend({
  councilNumber: z.string().min(4, "کد نظام پزشکی معتبر نیست").max(10),
});

// Superset type for useForm — always includes councilNumber (optional for patient)
type FormValues = z.infer<typeof doctorSchema>;

/* ----------------------------------------------------------------
   Role toggle
   ---------------------------------------------------------------- */
function RoleToggle({
  role,
  onChange,
}: {
  role: "patient" | "doctor";
  onChange: (r: "patient" | "doctor") => void;
}) {
  return (
    <div
      role="group"
      aria-label="نوع حساب"
      className="flex rounded-xl border border-neutral-200 p-0.5 bg-neutral-50"
    >
      {(["patient", "doctor"] as const).map((r) => (
        <button
          key={r}
          type="button"
          id={`role-${r}`}
          aria-pressed={role === r}
          onClick={() => onChange(r)}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150 select-none",
            role === r
              ? "bg-neutral-0 text-brand-700 shadow-sm border border-neutral-200"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          {r === "patient" ? "بیمار" : "پزشک"}
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------
   RegisterForm
   ---------------------------------------------------------------- */
export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  const [role,     setRole]    = useState<"patient" | "doctor">("patient");
  const [showPw,   setShowPw]  = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // Cast to Resolver<FormValues> — schema switches at runtime but TS is happy
    resolver: zodResolver(role === "doctor" ? doctorSchema : patientSchema) as Resolver<FormValues>,
  });

  const handleRoleChange = (r: "patient" | "doctor") => {
    setRole(r);
    reset();
    setApiError(null);
  };

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    await new Promise((res) => setTimeout(res, 1100));

    dispatch(
      setCredentials({
        user: {
          id:         "u-" + Date.now(),
          name:       data.fullName,
          phone:      data.phone,
          email:      null,
          avatar:     null,
          role:       role as UserRole,
          isVerified: false,
        },
        accessToken: "mock-token-register-" + Date.now(),
      })
    );

    router.push(ROUTES.HOME);
  };

  return (
    <div className={cn(
      "bg-neutral-0 rounded-2xl border border-neutral-100 shadow-sm",
      "px-6 py-8 flex flex-col gap-6"
    )}>
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-lg font-bold text-neutral-900">ایجاد حساب کاربری</h1>
        <p className="text-xs text-neutral-400 mt-1">همین حالا ثبت‌نام کنید</p>
      </div>

      {/* Role toggle */}
      <RoleToggle role={role} onChange={handleRoleChange} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Full name */}
        <Input
          id="register-fullname"
          type="text"
          autoComplete="name"
          label="نام و نام خانوادگی"
          placeholder="مثال: علی احمدی"
          inputSize="lg"
          startIcon={<User size={15} />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Phone */}
        <Input
          id="register-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          dir="ltr"
          label="شماره موبایل"
          placeholder="09123456789"
          inputSize="lg"
          startIcon={<Phone size={15} />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        {/* Council number — doctor only */}
        {role === "doctor" && (
          <Input
            id="register-council"
            type="text"
            inputMode="numeric"
            label="کد نظام پزشکی"
            placeholder="مثال: ۱۲۳۴۵۶"
            inputSize="lg"
            startIcon={<Award size={15} />}
            error={errors.councilNumber?.message}
            {...register("councilNumber")}
          />
        )}

        {/* Password */}
        <Input
          id="register-password"
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          label="رمز عبور"
          placeholder="حداقل ۶ کاراکتر"
          inputSize="lg"
          startIcon={<Lock size={15} />}
          endIcon={
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPw ? "پنهان کردن رمز" : "نمایش رمز"}
              onClick={() => setShowPw((v) => !v)}
              className="text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />

        {/* API error */}
        {apiError && (
          <p role="alert" className="text-xs text-red-500 text-center">{apiError}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full mt-1"
          id="btn-register-submit"
        >
          {role === "doctor" ? "ثبت‌نام پزشک" : "ثبت‌نام بیمار"}
        </Button>
      </form>

      <p className="text-xs text-neutral-500 text-center">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href={ROUTES.LOGIN} className="text-brand-600 font-medium hover:underline">
          وارد شوید
        </Link>
      </p>
    </div>
  );
}
