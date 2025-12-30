import { Infer } from "convex/values";
import { DataModel, Id } from "../../_generated/dataModel";
import { GenericMutationCtx } from "convex/server";
import { sectionStatusValidator } from "./validators";

type Status = Infer<typeof sectionStatusValidator>;

export type CreateSectionData = {
  courseId: Id<"courses">;
  teacherId: Id<"teachers">;
  title: string;
  order: number;
};

export async function create(
  ctx: GenericMutationCtx<DataModel>,
  data: CreateSectionData,
): Promise<Id<"sections">> {
  const now = Date.now();

  return ctx.db.insert("sections", {
    courseId: data.courseId,
    teacherId: data.teacherId,

    title: data.title,
    order: data.order,
    status: "draft",

    updatedAt: now,
  });
}

export type UpdateSectionData = {
  title?: string;
};

export async function update(
  ctx: GenericMutationCtx<DataModel>,
  sectionId: Id<"sections">,
  data: UpdateSectionData,
) {
  return ctx.db.patch(sectionId, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function reorder(
  ctx: GenericMutationCtx<DataModel>,
  sectionIds: Id<"sections">[],
) {
  const now = Date.now();

  await Promise.all(
    sectionIds.map((sectionId, index) =>
      ctx.db.patch(sectionId, {
        order: index + 1,
        updatedAt: now,
      }),
    ),
  );
}

export async function updateStatus(
  ctx: GenericMutationCtx<DataModel>,
  sectionId: Id<"sections">,
  status: Status,
) {
  return ctx.db.patch(sectionId, {
    status,
    updatedAt: Date.now(),
  });
}

export function remove(
  ctx: GenericMutationCtx<DataModel>,
  sectionId: Id<"sections">,
) {
  return ctx.db.delete(sectionId);
}

export async function removeAllByCourseId(
  ctx: GenericMutationCtx<DataModel>,
  courseId: Id<"courses">,
) {
  const sections = await ctx.db
    .query("sections")
    .withIndex("by_courseId_order", (q) => q.eq("courseId", courseId))
    .collect();

  await Promise.all(sections.map((section) => ctx.db.delete(section._id)));
}
