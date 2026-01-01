"use client";

import { Controller, useFormContext } from "react-hook-form";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { useEffect } from "react";
import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";

import { api } from "@/convex/_generated/api";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  type CourseFormValues,
  useCourseFormContext,
} from "../course-form-types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useScopedI18n } from "@/locales/client";

export function PublishSettingsStep() {
  const t = useScopedI18n("dashboard.courses.form");
  const { watch, control, setValue } = useFormContext<CourseFormValues>();
  const { courseId, originalSlug } = useCourseFormContext();

  const title = watch("title");
  const slugValue = watch("slug");
  const price = watch("price");

  const [debouncedSlug] = useDebounceValue(slugValue, 300);

  // Skip availability check if slug hasn't changed from original (edit mode)
  const isOriginalSlug = originalSlug && debouncedSlug === originalSlug;

  const { data: isAvailable, isPending: isCheckingAvailability } = useQuery({
    ...convexQuery(api.teachers.courses.queries.isSlugAvailable, {
      slug: debouncedSlug,
      excludeCourseId: courseId,
    }),
    enabled: debouncedSlug.length >= 3 && !isOriginalSlug,
  });

  useEffect(() => {
    if (debouncedSlug.length >= 3 && slugValue === debouncedSlug) {
      // If it's the original slug, it's always available
      if (isOriginalSlug) {
        setValue("isSlugAvailable", true);
      } else {
        setValue("isSlugAvailable", isAvailable ?? true);
      }
    }
  }, [isAvailable, debouncedSlug, slugValue, setValue, isOriginalSlug]);

  const showAvailabilityStatus =
    debouncedSlug.length >= 3 && slugValue === debouncedSlug;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t("steps.publish.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("steps.publish.description")}
        </p>
      </div>

      {/* Slug Field */}
      <Controller
        name="slug"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>{t("fields.slug")}</FieldLabel>
              <FieldDescription>
                {t("fields.slugDescription")}
              </FieldDescription>
            </FieldContent>

            <InputGroup>
              <InputGroupInput
                className="pl-1!"
                {...field}
                placeholder={slugValue || t("fields.slugPlaceholder")}
              />
              <InputGroupAddon>
                <div className="flex items-center px-3 border-s bg-muted/50 text-muted-foreground text-sm">
                  /courses/
                </div>
              </InputGroupAddon>
            </InputGroup>

            {showAvailabilityStatus && (
              <div className="text-sm">
                {isOriginalSlug ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <IconCheck className="size-4" />
                    {t("errors.slugUnavailable.description")}
                  </span>
                ) : isCheckingAvailability ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <IconLoader2 className="size-4 animate-spin" />
                    Checking availability...
                  </span>
                ) : isAvailable ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <IconCheck className="size-4" />
                    This URL is available
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-destructive">
                    <IconX className="size-4" />
                    {t("errors.slugUnavailable.title")}
                  </span>
                )}
              </div>
            )}

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Pricing Section */}
      <div className="space-y-4">
        <h5 className="font-medium">{t("fields.price")}</h5>

        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{t("fields.price")}</FieldLabel>
                <FieldDescription>
                  {t("fields.pricePlaceholder")}
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="number"
                placeholder={t("fields.pricePlaceholder")}
                autoComplete="off"
                className="w-32"
              />
            </Field>
          )}
        />

        <Controller
          name="overridePrice"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="overridePrice">
                  {t("fields.overridePrice")}
                </FieldLabel>

                <FieldDescription>
                  {t("fields.overridePriceDescription")}
                </FieldDescription>
              </FieldContent>
              <div className="w-32 flex flex-col items-center justify-center gap-1">
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  placeholder={t("fields.overridePricePlaceholder")}
                  autoComplete="off"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                />
                {price > 0 && watch("overridePrice") !== null && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round(
                      ((price - (watch("overridePrice") || 0)) / price) * 100
                    )}
                    % discount
                  </p>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />
      </div>

      {/* SEO Section */}
      <div className="space-y-4">
        <div>
          <h5 className="font-medium">{t("fields.seo.title")}</h5>
          <p className="text-sm text-muted-foreground">
            {t("fields.seo.title")}
          </p>
        </div>
        <Controller
          name="metaTitle"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{t("fields.seo.metaTitle")}</FieldLabel>
                <FieldDescription>
                  {t("fields.seo.metaTitlePlaceholder")}
                </FieldDescription>
              </FieldContent>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={title || t("fields.seo.metaTitlePlaceholder")}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="metaDescription"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{t("fields.seo.metaDescription")}</FieldLabel>
                <FieldDescription>
                  {t("fields.seo.metaDescriptionPlaceholder")}
                </FieldDescription>
              </FieldContent>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={title || t("fields.seo.metaDescriptionPlaceholder")}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
