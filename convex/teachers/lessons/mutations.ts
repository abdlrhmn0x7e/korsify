import { ConvexError, v } from "convex/values";
import { teacherMutation } from "../../utils";
import { db } from "../../db";

export const create = teacherMutation({
  args: {
    courseId: v.id("courses"),
    sectionId: v.id("sections"),
    title: v.string(),
    description: v.optional(v.any()),
    pdfStorageId: v.optional(v.id("_storage")),
    isFree: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Verify section ownership
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("section doesn't exist");
    }

    const maxOrder = await db.lessons.queries.getMaxOrderBySectionId(
      ctx,
      args.sectionId,
    );

    return db.lessons.mutations.create(ctx, {
      courseId: args.courseId,
      sectionId: args.sectionId,
      teacherId: ctx.teacherId,

      title: args.title,
      description: args.description ?? null,

      pdfStorageId: args.pdfStorageId ?? null,
      order: maxOrder + 1,
      isFree: args.isFree ?? false,
    });
  },
});

export const update = teacherMutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.optional(v.string()),
    description: v.optional(v.nullable(v.any())),
    pdfStorageId: v.optional(v.nullable(v.id("_storage"))),
    isFree: v.optional(v.boolean()),
    sectionId: v.optional(v.id("sections")),
  },
  handler: async (ctx, args) => {
    const { lessonId, sectionId, ...updateData } = args;
    const lesson = await db.lessons.queries.getById(ctx, lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("lesson doesn't exist");
    }

    // If moving to a different section, verify ownership
    if (sectionId) {
      const section = await db.sections.queries.getById(ctx, sectionId);

      if (!section || section.teacherId !== ctx.teacherId) {
        throw new ConvexError("section doesn't exist");
      }

      // Ensure the section belongs to the same course
      if (section.courseId !== lesson.courseId) {
        throw new ConvexError(
          "cannot move lesson to a section in a different course",
        );
      }
    }

    return db.lessons.mutations.update(ctx, lessonId, {
      ...updateData,
      sectionId,
    });
  },
});

export const reorder = teacherMutation({
  args: {
    sectionId: v.id("sections"),
    lessonIds: v.array(v.id("lessons")),
  },
  handler: async (ctx, args) => {
    // Verify section ownership
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("section doesn't exist");
    }

    // Verify all lessons belong to this section and teacher
    const lessons = await Promise.all(
      args.lessonIds.map((id) => db.lessons.queries.getById(ctx, id)),
    );

    for (const lesson of lessons) {
      if (
        !lesson ||
        lesson.sectionId !== args.sectionId ||
        lesson.teacherId !== ctx.teacherId
      ) {
        throw new ConvexError("invalid lesson");
      }
    }

    return db.lessons.mutations.reorder(ctx, args.lessonIds);
  },
});

export const remove = teacherMutation({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("lesson doesn't exist");
    }

    return db.lessons.mutations.remove(ctx, args.lessonId);
  },
});
