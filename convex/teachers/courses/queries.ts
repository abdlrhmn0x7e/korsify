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

export const getAllWithLessonCount = teacherQuery({
  args: {
    status: v.optional(courseStatusValidator),
  },
  handler: async (ctx, args) => {
    const courses = await db.courses.queries.getByTeacherId(
      ctx,
      ctx.teacherId,
      args.status,
    );

    const coursesWithLessonCount = await Promise.all(
      courses.map(async (course) => ({
        ...course,
        lessonCount: await db.lessons.queries.countByCourseId(ctx, course._id),
      })),
    );

    return coursesWithLessonCount;
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

export const getById = teacherQuery({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getById(ctx, args.courseId);

    if (course && course.teacherId !== ctx.teacherId) {
      return null;
    }

    return course;
  },
});

export const isSlugAvailable = teacherQuery({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getBySlug(ctx, args.slug);
    return course === null;
  },
});
