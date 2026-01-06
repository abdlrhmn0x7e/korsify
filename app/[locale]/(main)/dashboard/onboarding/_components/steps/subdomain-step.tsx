"use client";

import { useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useScopedI18n } from "@/locales/client";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  IconAlertCircle,
  IconCheck,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import { useDebounceValue } from "usehooks-ts";
import type { OnboardingFormValues } from "../types";

export function SubdomainStep() {
  const t = useScopedI18n("onboarding.steps.subdomain");
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  const subdomainValue = watch("subdomain");
  const [debouncedSubdomain] = useDebounceValue(
    subdomainValue?.toLowerCase().trim() || "",
    300
  );

  const { data: isAvailable, isPending: isCheckingAvailability } = useQuery({
    ...convexQuery(api.teachers.queries.isSubdomainAvailable, {
      subdomain: debouncedSubdomain,
    }),
    enabled: debouncedSubdomain.length >= 3,
  });

  const showAvailabilityStatus =
    debouncedSubdomain.length >= 3 && subdomainValue === debouncedSubdomain;

  return (
    <div className="space-y-4">
      <Field data-invalid={!!errors.subdomain || isAvailable === false}>
        <FieldLabel htmlFor="subdomain">{t("label")}</FieldLabel>
        <div className="flex items-center gap-2">
          <Input
            {...register("subdomain", {
              onChange: (e) => {
                e.target.value = e.target.value.toLowerCase();
              },
            })}
            id="subdomain"
            placeholder={t("placeholder")}
            aria-invalid={!!errors.subdomain || isAvailable === false}
          />
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            {t("suffix")}
          </span>
        </div>

        {showAvailabilityStatus && (
          <FieldDescription>
            {isCheckingAvailability ? (
              <span className="flex items-center gap-1 text-muted-foreground">
                <IconLoader2 className="size-4 animate-spin" />
                {t("checking")}
              </span>
            ) : isAvailable ? (
              <span className="flex items-center gap-1 text-green-600">
                <IconCheck className="size-4" />
                {t("available")}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-destructive">
                <IconX className="size-4" />
                {t("unavailable")}
              </span>
            )}
          </FieldDescription>
        )}

        {errors.subdomain && (
          <span className="text-destructive text-sm flex items-center gap-1">
            <IconAlertCircle className="size-4" />
            <FieldError errors={[errors.subdomain]} />
          </span>
        )}
      </Field>
    </div>
  );
}
