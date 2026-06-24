/**
 * LoginForm — Auth Feature
 * src/features/auth/LoginForm.tsx
 *
 * React Hook Form + Zod. On mock success → dispatches setCredentials.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials } from "@/store/slices/authSlice";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/* ----------------------------------------------------------------
   Schema
   ---------------------------------------------------------------- */
const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود"),
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginValues = z.infer<typeof loginSchema>;

/* ----------------------------------------------------------------
   LoginForm
   ---------------------------------------------------------------- */
export function LoginForm() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const [showPw, setShowPw]   = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginValues) => {
    setApiError(null);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    // Mock: wrong password check
    if (data.password === "wrong") {
      setApiError("شماره موبایل یا رمز عبور اشتباه است.");
      return;
    }

    dispatch(
      setCredentials({
        user: {
          id:          "u-001",
          name:        "کاربر آزمایشی",
          phone:       data.phone,
          email:       null,
          avatar:      null,
          role:        "patient",
          isVerified:  true,
        },
        accessToken: "mock-token-login-" + Date.now(),
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
        <h1 className="text-lg font-bold text-neutral-900">ورود به حساب</h1>
        <p className="text-xs text-neutral-400 mt-1">
          به دکترتو خوش آمدید
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Phone */}
        <Input
          id="login-phone"
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

        {/* Password */}
        <Input
          id="login-password"
          type={showPw ? "text" : "password"}
          autoComplete="current-password"
          label="رمز عبور"
          placeholder="••••••••"
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
          id="btn-login-submit"
        >
          ورود
        </Button>
      </form>

      {/* Links */}
      <div className="flex flex-col items-center gap-2 text-xs text-neutral-500">
        <p>
          حساب ندارید؟{" "}
          <Link href={ROUTES.REGISTER} className="text-brand-600 font-medium hover:underline">
            ثبت‌نام
          </Link>
        </p>
      </div>
    </div>
  );
}
