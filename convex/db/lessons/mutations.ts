import { DataModel, Id } from "../../_generated/dataModel";
import { type JSONContent } from "@tiptap/react";
import { GenericMutationCtx } from "convex/server";

export type HostingMode = "mux" | "youtube";

export type CreateLessonData = {
  courseId: Id<"courses">;
  sectionId: Id<"sections">;
  teacherId: Id<"teachers">;

  title: string;
  description: JSONContent | null;
  pdfStorageIds: Array<Id<"_storage">>;

  hosting:
    | {
        type: "mux";
        videoId: Id<"muxAssets">;
      }
    | {
        type: "youtube";
        youtubeUrl: string;
      };

  order: number;
};

export async function create(
  ctx: GenericMutationCtx<DataModel>,
  data: CreateLessonData
): Promise<Id<"lessons">> {
  const now = Date.now();

  return ctx.db.insert("lessons", {
    courseId: data.courseId,
    sectionId: data.sectionId,
    teacherId: data.teacherId,

    title: data.title,
    description: data.description,
    pdfStorageIds: data.pdfStorageIds,

    hosting: data.hosting,

    order: data.order,

    updatedAt: now,
  });
}

export type UpdateLessonData = {
  title?: string;
  description?: JSONContent | null;
  pdfStorageIds?: Array<Id<"_storage">>;
  hosting?:
    | {
        type: "mux";
        videoId: Id<"muxAssets">;
      }
    | {
        type: "youtube";
        youtubeUrl: string;
      };
  sectionId?: Id<"sections">;
};

export async function update(
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">,
  data: UpdateLessonData
) {
  return ctx.db.patch(lessonId, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function reorder(
  ctx: GenericMutationCtx<DataModel>,
  lessonIds: Id<"lessons">[]
) {
  const now = Date.now();

  await Promise.all(
    lessonIds.map((lessonId, index) =>
      ctx.db.patch(lessonId, {
        order: index + 1,
        updatedAt: now,
      })
    )
  );
}

export function remove(
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">
) {
  return ctx.db.delete(lessonId);
}

export async function removeAllBySectionId(
  ctx: GenericMutationCtx<DataModel>,
  sectionId: Id<"sections">
) {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_sectionId_order", (q) => q.eq("sectionId", sectionId))
    .collect();

  await Promise.all(lessons.map((lesson) => ctx.db.delete(lesson._id)));
}

export async function removeAllByCourseId(
  ctx: GenericMutationCtx<DataModel>,
  courseId: Id<"courses">
) {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_courseId", (q) => q.eq("courseId", courseId))
    .collect();

  await Promise.all(lessons.map((lesson) => ctx.db.delete(lesson._id)));
}
