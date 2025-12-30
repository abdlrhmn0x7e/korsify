import { v } from "convex/values";
import { db } from "../../db";
import { teacherQuery } from "../../utils";
import { ConvexError } from "convex/values";

export const getByCourseId = teacherQuery({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getById(ctx, args.courseId);

    if (!course || course.teacherId !== ctx.teacherId) {
      throw new ConvexError("course doesn't exist");
    }

    return db.sections.queries.getByCourseId(ctx, args.courseId);
  },
});

export const getById = teacherQuery({
  args: {
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      return null;
    }

    return section;
  },
});

export const getWithLessons = teacherQuery({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getById(ctx, args.courseId);

    if (!course || course.teacherId !== ctx.teacherId) {
      throw new ConvexError("course doesn't exist");
    }

    const sections = await db.sections.queries.getByCourseId(
      ctx,
      args.courseId,
    );

    // Get lessons for each section
    const sectionsWithLessons = await Promise.all(
      sections.map(async (section) => ({
        ...section,
        lessons: await db.lessons.queries.getBySectionId(ctx, section._id),
      })),
    );

    return sectionsWithLessons;
  },
});
