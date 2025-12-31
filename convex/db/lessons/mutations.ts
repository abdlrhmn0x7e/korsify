import { DataModel, Id } from "../../_generated/dataModel";
import { type JSONContent } from "@tiptap/react";
import { GenericMutationCtx } from "convex/server";

export type CreateLessonData = {
  courseId: Id<"courses">;
  sectionId: Id<"sections">;
  teacherId: Id<"teachers">;

  title: string;
  description: JSONContent | null;
  pdfStorageId: Id<"_storage"> | null;

  order: number;
  isFree: boolean;
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
    pdfStorageId: data.pdfStorageId,

    order: data.order,
    isFree: data.isFree,

    updatedAt: now,
  });
}

export type UpdateLessonData = {
  title?: string;
  description?: JSONContent | null;
  pdfStorageId?: Id<"_storage"> | null;
  videoId?: Id<"muxAssets">;
  isFree?: boolean;
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

export async function linkVideo(
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">,
  videoId: Id<"muxAssets">
) {
  return ctx.db.patch(lessonId, {
    videoId,
    updatedAt: Date.now(),
  });
}

export async function unlinkVideo(
  ctx: GenericMutationCtx<DataModel>,
  lessonId: Id<"lessons">
) {
  return ctx.db.patch(lessonId, {
    videoId: undefined,
    updatedAt: Date.now(),
  });
}
