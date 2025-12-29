"use client";

import { useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "@/locales/client";
import type { OnboardingFormValues } from "../types";

export function PaymentStep() {
  const t = useScopedI18n("onboarding.steps.payment");
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  return (
    <div className="space-y-4">
      <Field data-invalid={!!errors.vodafoneCash}>
        <FieldLabel htmlFor="vodafoneCash">{t("vodafoneCash")}</FieldLabel>
        <Input
          {...register("vodafoneCash")}
          id="vodafoneCash"
          placeholder={t("vodafoneCashPlaceholder")}
          aria-invalid={!!errors.vodafoneCash}
        />
        {errors.vodafoneCash && <FieldError errors={[errors.vodafoneCash]} />}
      </Field>

      <Field data-invalid={!!errors.instaPay}>
        <FieldLabel htmlFor="instaPay">{t("instaPay")}</FieldLabel>
        <Input
          {...register("instaPay")}
          id="instaPay"
          placeholder={t("instaPayPlaceholder")}
          aria-invalid={!!errors.instaPay}
        />
        {errors.instaPay && <FieldError errors={[errors.instaPay]} />}
      </Field>

      <Field data-invalid={!!errors.instructions}>
        <FieldLabel htmlFor="instructions">{t("instructions")}</FieldLabel>
        <FieldDescription>{t("instructionsDescription")}</FieldDescription>
        <Textarea
          {...register("instructions")}
          id="instructions"
          placeholder={t("instructionsPlaceholder")}
          rows={4}
        />
        {errors.instructions && <FieldError errors={[errors.instructions]} />}
      </Field>
    </div>
  );
}
