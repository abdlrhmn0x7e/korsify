import { ConvexError, v } from "convex/values";
import { teacherMutation } from "../../utils";
import { db } from "../../db";

export const create = teacherMutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify course ownership
    const course = await db.courses.queries.getById(ctx, args.courseId);

    if (!course || course.teacherId !== ctx.teacherId) {
      throw new ConvexError("course doesn't exist");
    }

    const maxOrder = await db.sections.queries.getMaxOrderByCourseId(
      ctx,
      args.courseId,
    );

    return db.sections.mutations.create(ctx, {
      courseId: args.courseId,
      teacherId: ctx.teacherId,
      title: args.title,
      order: maxOrder + 1,
    });
  },
});

export const update = teacherMutation({
  args: {
    sectionId: v.id("sections"),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sectionId, ...updateData } = args;
    const section = await db.sections.queries.getById(ctx, sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("section doesn't exist");
    }

    return db.sections.mutations.update(ctx, sectionId, updateData);
  },
});

export const publish = teacherMutation({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("section doesn't exist");
    }

    return db.sections.mutations.updateStatus(ctx, args.sectionId, "published");
  },
});

export const draft = teacherMutation({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("section doesn't exist");
    }

    return db.sections.mutations.updateStatus(ctx, args.sectionId, "draft");
  },
});

export const reorder = teacherMutation({
  args: {
    courseId: v.id("courses"),
    sectionIds: v.array(v.id("sections")),
  },
  handler: async (ctx, args) => {
    // Verify course ownership
    const course = await db.courses.queries.getById(ctx, args.courseId);

    if (!course || course.teacherId !== ctx.teacherId) {
      throw new ConvexError("course doesn't exist");
    }

    // Verify all sections belong to this course and teacher
    const sections = await Promise.all(
      args.sectionIds.map((id) => db.sections.queries.getById(ctx, id)),
    );

    for (const section of sections) {
      if (
        !section ||
        section.courseId !== args.courseId ||
        section.teacherId !== ctx.teacherId
      ) {
        throw new ConvexError("invalid section");
      }
    }

    return db.sections.mutations.reorder(ctx, args.sectionIds);
  },
});

export const remove = teacherMutation({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("section doesn't exist");
    }

    // Lessons are automatically deleted via triggers
    return db.sections.mutations.remove(ctx, args.sectionId);
  },
});
