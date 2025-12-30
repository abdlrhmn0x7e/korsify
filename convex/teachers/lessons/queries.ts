import { v } from "convex/values";
import { db } from "../../db";
import { teacherQuery } from "../../utils";
import { ConvexError } from "convex/values";

export const getBySectionId = teacherQuery({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("section doesn't exist");
    }

    return db.lessons.queries.getBySectionId(ctx, args.sectionId);
  },
});

export const getById = teacherQuery({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      return null;
    }

    return lesson;
  },
});
