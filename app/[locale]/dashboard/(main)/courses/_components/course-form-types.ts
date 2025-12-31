import type { FieldPath } from "react-hook-form";
import { JSONContent } from "@tiptap/react";
import { z } from "zod";

/**
 * Simple slugify function to convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  thumbnailStorageId: z.string().min(1, "Thumbnail is required"),
  thumbnailPreviewUrl: z.url().optional(),

  description: z.custom<JSONContent>(),

  slug: z
    .string()
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Slug must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens",
    ),
  isSlugAvailable: z.boolean(),
  price: z.coerce.number<number>().min(0, "Price must be a positive number"),
  overridePrice: z.coerce.number<number>().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export const DEFAULT_FORM_VALUES: CourseFormValues = {
  title: "",
  thumbnailStorageId: "",
  thumbnailPreviewUrl: "",
  description: { type: "doc", content: [] },
  slug: "",
  isSlugAvailable: true,
  price: 0,
  overridePrice: null,
  metaTitle: "",
  metaDescription: "",
};

export interface Step {
  id: string;
  title: string;
  description: string;
  fields: FieldPath<CourseFormValues>[];
  component: React.ComponentType;
}

export type CourseFormOnSubmit = (
  values: CourseFormValues,
  options?: { onSuccess?: () => void },
) => void;

export const STEP_IDS = {
  BASICS: "basics",
  DESCRIPTION: "description",
  PUBLISH: "publish",
} as const;
