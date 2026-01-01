import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export const lessonFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.custom<JSONContent>().optional(),
  videoId: z.string().min(1, "Video is required"),
  pdfStorageId: z.string().optional(),
  isFree: z.boolean(),
});

export type LessonFormValues = z.infer<typeof lessonFormSchema>;

export const DEFAULT_LESSON_FORM_VALUES: LessonFormValues = {
  title: "",
  description: undefined,
  videoId: "",
  pdfStorageId: undefined,
  isFree: false,
};

export type LessonFormOnSubmit = (
  values: LessonFormValues,
  options?: { onSuccess?: () => void }
) => void;
