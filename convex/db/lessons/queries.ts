import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import { attachMediaURLs } from "./utils";

export async function getById(
  ctx: GenericQueryCtx<DataModel>,
  lessonId: Id<"lessons">
) {
  const lesson = await ctx.db.get(lessonId);
  return attachMediaURLs(ctx, lesson);
}

export async function getBySectionId(
  ctx: GenericQueryCtx<DataModel>,
  sectionId: Id<"sections">
) {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_sectionId_order", (q) => q.eq("sectionId", sectionId))
    .collect();

  return attachMediaURLs(ctx, lessons);
}

export async function countByCourseId(
  ctx: GenericQueryCtx<DataModel>,
  courseId: Id<"courses">
): Promise<number> {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_courseId", (q) => q.eq("courseId", courseId))
    .collect();

  return lessons.length;
}

export async function countBySectionId(
  ctx: GenericQueryCtx<DataModel>,
  sectionId: Id<"sections">
): Promise<number> {
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_sectionId_order", (q) => q.eq("sectionId", sectionId))
    .collect();

  return lessons.length;
}

export async function getMaxOrderBySectionId(
  ctx: GenericQueryCtx<DataModel>,
  sectionId: Id<"sections">
) {
  const lesson = await ctx.db
    .query("lessons")
    .withIndex("by_sectionId_order", (q) => q.eq("sectionId", sectionId))
    .order("desc")
    .first();

  const maxOrder = lesson ? lesson.order : 0;
  return maxOrder;
}
