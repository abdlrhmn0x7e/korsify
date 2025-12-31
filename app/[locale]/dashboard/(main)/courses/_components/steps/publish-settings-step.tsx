"use client";

import { useFormContext } from "react-hook-form";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import {
  IconAlertCircle,
  IconCheck,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";

import { api } from "@/convex/_generated/api";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { slugify, type CourseFormValues } from "../course-form-types";

export function PublishSettingsStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const title = watch("title");
  const slugValue = watch("slug");
  const price = watch("price");

  // Generate slug from title
  const generatedSlug = slugify(title || "");

  // Determine which slug to check - user input or generated
  const slugToCheck = slugValue || generatedSlug;
  const [debouncedSlug] = useDebounceValue(slugToCheck, 300);

  const { data: isAvailable, isPending: isCheckingAvailability } = useQuery({
    ...convexQuery(api.teachers.courses.queries.isSlugAvailable, {
      slug: debouncedSlug,
    }),
    enabled: debouncedSlug.length >= 3,
  });

  const showAvailabilityStatus =
    debouncedSlug.length >= 3 && slugToCheck === debouncedSlug;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Publish Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how your course appears to students and set your pricing.
        </p>
      </div>

      {/* Slug Field */}
      <Field data-invalid={!!errors.slug || isAvailable === false}>
        <FieldLabel htmlFor="slug">Course URL</FieldLabel>
        <FieldDescription>
          This will be the URL path for your course. We&apos;ve generated one from
          your title, but you can customize it.
        </FieldDescription>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            /courses/
          </span>
          <Input
            {...register("slug", {
              onChange: (e) => {
                e.target.value = e.target.value.toLowerCase();
              },
            })}
            id="slug"
            placeholder={generatedSlug || "course-slug"}
            aria-invalid={!!errors.slug || isAvailable === false}
          />
        </div>

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

        {errors.slug && (
          <span className="text-destructive text-sm flex items-center gap-1">
            <IconAlertCircle className="size-4" />
            <FieldError errors={[errors.slug]} />
          </span>
        )}
      </Field>

      {/* Pricing Section */}
      <div className="space-y-4 rounded-lg border p-4">
        <h4 className="font-medium">Pricing</h4>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="price">Price</FieldLabel>
            <FieldDescription>Set the base price for your course.</FieldDescription>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                {...register("price", { valueAsNumber: true })}
                id="price"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                className="ps-7"
                aria-invalid={!!errors.price}
              />
            </div>
            {errors.price && <FieldError errors={[errors.price]} />}
          </Field>

          <Field data-invalid={!!errors.overridePrice}>
            <FieldLabel htmlFor="overridePrice">Sale Price (Optional)</FieldLabel>
            <FieldDescription>
              Set a discounted price for promotions.
            </FieldDescription>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                {...register("overridePrice", {
                  setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                })}
                id="overridePrice"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                className="ps-7"
                aria-invalid={!!errors.overridePrice}
              />
            </div>
            {errors.overridePrice && (
              <FieldError errors={[errors.overridePrice]} />
            )}
            {price > 0 && watch("overridePrice") !== null && (
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  ((price - (watch("overridePrice") || 0)) / price) * 100
                )}
                % discount
              </p>
            )}
          </Field>
        </div>
      </div>

      {/* SEO Section */}
      <div className="space-y-4 rounded-lg border p-4">
        <div>
          <h4 className="font-medium">SEO (Optional)</h4>
          <p className="text-sm text-muted-foreground">
            Customize how your course appears in search results.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="metaTitle">Meta Title</FieldLabel>
          <FieldDescription>
            Override the default title for search engines.
          </FieldDescription>
          <Input
            {...register("metaTitle")}
            id="metaTitle"
            placeholder={title || "Course title"}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
          <FieldDescription>
            A brief summary for search engine results (150-160 characters
            recommended).
          </FieldDescription>
          <Textarea
            {...register("metaDescription")}
            id="metaDescription"
            placeholder="Describe what students will learn in this course..."
            rows={3}
          />
          {watch("metaDescription")?.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {watch("metaDescription").length}/160 characters
            </p>
          )}
        </Field>
      </div>
    </div>
  );
}

