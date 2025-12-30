import { v } from "convex/values";
import { db } from "../../db";
import { teacherQuery } from "../../utils";
import { courseStatusValidator } from "../../db/courses/validators";

export const getAll = teacherQuery({
  args: {
    status: v.optional(courseStatusValidator),
  },
  handler: async (ctx, args) => {
    return db.courses.queries.getByTeacherId(ctx, ctx.teacherId, args.status);
  },
});

export const getBySlug = teacherQuery({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getBySlug(ctx, args.slug);

    if (course && course.teacherId !== ctx.teacherId) {
      return null;
    }

    return course;
  },
});
