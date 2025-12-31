import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import { attachThumbnailURL } from "./utils";

export async function getAll(ctx: GenericQueryCtx<DataModel>) {
  const courses = await ctx.db.query("courses").collect();
  return attachThumbnailURL(ctx, courses);
}

export async function getById(
  ctx: GenericQueryCtx<DataModel>,
  courseId: Id<"courses">,
) {
  const course = await ctx.db.get(courseId);
  return attachThumbnailURL(ctx, course);
}

export async function getBySlug(ctx: GenericQueryCtx<DataModel>, slug: string) {
  const course = await ctx.db
    .query("courses")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
  return attachThumbnailURL(ctx, course);
}

export async function getByTeacherId(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
) {
  const courses = await ctx.db
    .query("courses")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .order("desc")
    .collect();

  return attachThumbnailURL(ctx, courses);
}

export async function isSlugAvailable(
  ctx: GenericQueryCtx<DataModel>,
  slug: string,
) {
  // should I make this scoped to teacher courses?
  const existing = await getBySlug(ctx, slug);
  return existing === null;
}
