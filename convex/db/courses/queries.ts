import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import { Infer } from "convex/values";
import { courseStatusValidator } from "./validators";

export function getAll(ctx: GenericQueryCtx<DataModel>) {
  return ctx.db.query("courses").collect();
}

export function getById(
  ctx: GenericQueryCtx<DataModel>,
  courseId: Id<"courses">,
) {
  return ctx.db.get(courseId);
}

export function getBySlug(ctx: GenericQueryCtx<DataModel>, slug: string) {
  return ctx.db
    .query("courses")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
}

export function getByTeacherId(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
  status?: Infer<typeof courseStatusValidator>,
) {
  if (status) {
    return ctx.db
      .query("courses")
      .withIndex("by_teacherId_status", (q) =>
        q.eq("teacherId", teacherId).eq("status", status),
      )
      .collect();
  }

  return ctx.db
    .query("courses")
    .withIndex("by_teacherId_status", (q) => q.eq("teacherId", teacherId))
    .collect();
}

export async function isSlugAvailable(
  ctx: GenericQueryCtx<DataModel>,
  slug: string,
) {
  // should I make this scoped to teacher courses?
  const existing = await getBySlug(ctx, slug);
  return existing === null;
}
