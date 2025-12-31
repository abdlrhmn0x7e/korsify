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

import { type CourseFormValues } from "../course-form-types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

export function PublishSettingsStep() {
  const { watch, control, setValue } = useFormContext<CourseFormValues>();

  const title = watch("title");
  const slugValue = watch("slug");
  const price = watch("price");

  const [debouncedSlug] = useDebounceValue(slugValue, 300);

  const { data: isAvailable, isPending: isCheckingAvailability } = useQuery({
    ...convexQuery(api.teachers.courses.queries.isSlugAvailable, {
      slug: debouncedSlug,
    }),
    enabled: debouncedSlug.length >= 3,
  });

  useEffect(() => {
    if (debouncedSlug.length >= 3 && slugValue === debouncedSlug) {
      setValue("isSlugAvailable", isAvailable ?? true);
    }
  }, [isAvailable, debouncedSlug, slugValue, setValue]);

  const showAvailabilityStatus =
    debouncedSlug.length >= 3 && slugValue === debouncedSlug;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Publish Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how your course appears to students and set your pricing.
        </p>
      </div>

      {/* Slug Field */}
      <Controller
        name="slug"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Course Url</FieldLabel>
              <FieldDescription>
                This will be the URL path for your course. We&apos;ve generated
                one from your title, but you can customize it.
              </FieldDescription>
            </FieldContent>

            <InputGroup>
              <InputGroupInput
                className="pl-1!"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder={slugValue || "course-slug"}
              />
              <InputGroupAddon>
                <InputGroupText>/courses/</InputGroupText>
              </InputGroupAddon>
            </InputGroup>

            {showAvailabilityStatus && (
              <div className="text-sm">
                {isCheckingAvailability ? (
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
                    This URL is already taken
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
        <h5 className="font-medium">Pricing</h5>

        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                <FieldDescription>
                  The original price of the course before any discounts.
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
                placeholder="0.00"
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
                  Override Price (Optional)
                </FieldLabel>

                <FieldDescription>
                  The price after applying any discounts if desired.
                </FieldDescription>
              </FieldContent>
              <div className="w-32 flex flex-col items-center justify-center gap-1">
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  placeholder="0.00"
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
          <h5 className="font-medium">SEO (Optional)</h5>
          <p className="text-sm text-muted-foreground">
            Customize how your course appears in search results.
          </p>
        </div>
        <Controller
          name="metaTitle"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Meta Title</FieldLabel>
                <FieldDescription>
                  Override the default title for search engines.
                </FieldDescription>
              </FieldContent>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={title || "Course title"}
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
                <FieldLabel htmlFor={field.name}>Meta Description</FieldLabel>
                <FieldDescription>
                  A brief summary for search engine results (150-160 characters
                  recommended).
                </FieldDescription>
              </FieldContent>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={title || "Course title"}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
