import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";

export async function getById(
  ctx: GenericQueryCtx<DataModel>,
  sectionId: Id<"sections">,
) {
  return ctx.db.get(sectionId);
}

export async function getByCourseId(
  ctx: GenericQueryCtx<DataModel>,
  courseId: Id<"courses">,
) {
  return ctx.db
    .query("sections")
    .withIndex("by_courseId_order", (q) => q.eq("courseId", courseId))
    .collect();
}

export async function countByCourseId(
  ctx: GenericQueryCtx<DataModel>,
  courseId: Id<"courses">,
): Promise<number> {
  const sections = await ctx.db
    .query("sections")
    .withIndex("by_courseId_order", (q) => q.eq("courseId", courseId))
    .collect();

  return sections.length;
}

export async function getMaxOrderByCourseId(
  ctx: GenericQueryCtx<DataModel>,
  courseId: Id<"courses">,
) {
  const section = await ctx.db
    .query("sections")
    .withIndex("by_courseId_order", (q) => q.eq("courseId", courseId))
    .order("desc")
    .first();

  const maxOrder = section ? section.order : 0;
  return maxOrder;
}
