/**
 * AccountSettings — Patient Feature
 * src/features/patient/AccountSettings.tsx
 *
 * Editable patient profile form.
 */

"use client";

import { useState } from "react";
import { User, Phone, Mail, CreditCard, Save, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MOCK_PATIENT_PROFILE } from "@/lib/api/patient";

export function AccountSettings() {
  const [form, setForm]       = useState({ ...MOCK_PATIENT_PROFILE });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-neutral-800">تنظیمات حساب</h2>
        <p className="text-xs text-neutral-400 mt-0.5">اطلاعات شخصی خود را ویرایش کنید.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-5 p-5 sm:p-6",
          "rounded-2xl border border-neutral-100 bg-neutral-0"
        )}
        noValidate
      >
        {/* Full Name */}
        <Input
          label="نام و نام خانوادگی"
          value={form.fullName}
          onChange={handleChange("fullName")}
          startIcon={<User size={16} />}
          placeholder="نام کامل"
        />

        {/* Phone */}
        <Input
          label="شماره موبایل"
          value={form.phone}
          onChange={handleChange("phone")}
          startIcon={<Phone size={16} />}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          inputMode="tel"
          dir="ltr"
        />

        {/* Email */}
        <Input
          label="ایمیل"
          value={form.email ?? ""}
          onChange={handleChange("email")}
          startIcon={<Mail size={16} />}
          placeholder="example@email.com"
          type="email"
          dir="ltr"
        />

        {/* National ID — read-only */}
        <Input
          label="کد ملی"
          value={form.nationalId ?? ""}
          onChange={handleChange("nationalId")}
          startIcon={<CreditCard size={16} />}
          placeholder="۱۰ رقم"
          helper="کد ملی برای تأیید هویت استفاده می‌شود."
        />

        {/* Save */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle2 size={13} aria-hidden="true" />
              تغییرات ذخیره شد
            </span>
          )}
          <div className={cn("ms-auto")}>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={saving}
              startIcon={<Save size={15} />}
            >
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
