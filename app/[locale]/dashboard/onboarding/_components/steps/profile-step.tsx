"use client";

import { useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useScopedI18n } from "@/locales/client";
import type { OnboardingFormValues } from "../types";

export function ProfileStep() {
  const t = useScopedI18n("onboarding.steps.profile");
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  return (
    <div className="space-y-4">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
        <Input
          {...register("name")}
          id="name"
          placeholder={t("namePlaceholder")}
          aria-invalid={!!errors.name}
        />
        {errors.name && <FieldError errors={[errors.name]} />}
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <FieldError errors={[errors.email]} />}
      </Field>

      <Field data-invalid={!!errors.phone}>
        <FieldLabel htmlFor="phone">{t("phone")}</FieldLabel>
        <Input
          {...register("phone")}
          id="phone"
          type="tel"
          placeholder={t("phonePlaceholder")}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <FieldError errors={[errors.phone]} />}
      </Field>
    </div>
  );
}
