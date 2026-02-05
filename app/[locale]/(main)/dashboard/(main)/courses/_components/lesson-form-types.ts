import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

const YOUTUBE_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}(?:\?.*)?$/;

export const lessonFormSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.custom<JSONContent>().optional(),
    hosting: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("mux"),
        videoId: z.string(),
      }),
      z.object({
        type: z.literal("youtube"),
        youtubeUrl: z.string(),
      }),
    ]),
    pdfStorageIds: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (
      data.hosting.type === "youtube" &&
      !YOUTUBE_URL_REGEX.test(data.hosting.youtubeUrl)
    ) {
      ctx.addIssue({
        code: "invalid_type",
        message: "Invalid YouTube URL",
        path: ["hosting.youtubeUrl"],
        expected: "custom",
      });
    }
  });

export type LessonFormValues = z.infer<typeof lessonFormSchema>;

export const DEFAULT_LESSON_FORM_VALUES: LessonFormValues = {
  title: "",
  description: undefined,
  hosting: {
    type: "mux",
    videoId: "",
  },
  pdfStorageIds: [],
};

export type LessonFormOnSubmit = (
  values: LessonFormValues,
  options?: { onSuccess?: () => void }
) => void;
