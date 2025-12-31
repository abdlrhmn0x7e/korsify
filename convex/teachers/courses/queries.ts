import { v } from "convex/values";
import { db } from "../../db";
import { teacherQuery } from "../../utils";
import { courseStatusValidator } from "../../db/courses/validators";

export const getAll = teacherQuery({
  args: {},
  handler: async (ctx) => {
    return db.courses.queries.getByTeacherId(ctx, ctx.teacherId);
  },
});

export const getAllWithLessonCount = teacherQuery({
  args: {
    status: v.optional(courseStatusValidator),
  },
  handler: async (ctx) => {
    const courses = await db.courses.queries.getByTeacherId(ctx, ctx.teacherId);

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
    excludeCourseId: v.optional(v.id("courses")),
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getBySlug(ctx, args.slug);
    // If no course found with this slug, it's available
    if (course === null) return true;
    // If editing and the found course is the one being edited, slug is available
    if (args.excludeCourseId && course._id === args.excludeCourseId) return true;
    return false;
  },
});
