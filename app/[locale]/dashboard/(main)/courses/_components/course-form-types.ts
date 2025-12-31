import type { FieldPath } from "react-hook-form";
import type { JSONContent } from "@tiptap/react";
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

export interface CourseFormValues {
  // Step 1: Basics
  title: string;
  thumbnailStorageId: string;

  // Step 2: Description
  description: JSONContent;

  // Step 3: Publish Settings
  slug: string;
  price: number;
  overridePrice: number | null;
  metaTitle?: string;
  metaDescription?: string;
}

export const DEFAULT_FORM_VALUES: CourseFormValues = {
  title: "",
  thumbnailStorageId: "",
  description: { type: "doc", content: [] },
  slug: "",
  price: 0,
  overridePrice: null,
  metaTitle: "",
  metaDescription: "",
};

export const courseFormSchema = z.object({
  // Step 1: Basics
  title: z.string().min(3, "Title must be at least 3 characters"),
  thumbnailStorageId: z.string().min(1, "Thumbnail is required"),

  // Step 2: Description
  description: z.any(),

  // Step 3: Publish Settings
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(63, "Slug must be at most 63 characters")
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Slug must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens"
    ),
  price: z.number().min(0, "Price must be a positive number"),
  overridePrice: z.number().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export interface Step {
  id: string;
  title: string;
  description: string;
  fields: FieldPath<CourseFormValues>[];
  component: React.ComponentType;
}

export const STEP_IDS = {
  BASICS: "basics",
  DESCRIPTION: "description",
  PUBLISH: "publish",
} as const;

