import { ConvexError, v } from "convex/values";
import { teacherMutation } from "../../utils";
import {
  coursePricingValidator,
  courseSeoValidator,
  courseStatusValidator,
} from "../../db/courses/validators";
import { db } from "../../db";
import z from "zod";

const slugSchema = z
  .string()
  .min(3, "slug must be at least 3 characters")
  .max(63, "slug must be at most 63 characters")
  .regex(
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    "slug must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens",
  )
  .transform((val) => val.toLowerCase().trim());

function validateSlug(slug: string): string {
  const result = slugSchema.safeParse(slug.toLowerCase().trim());
  if (!result.success) throw new ConvexError(result.error.issues[0].message);
  return result.data;
}

export const create = teacherMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.any(),
    thumbnailStorageId: v.id("_storage"),

    pricing: coursePricingValidator,

    seo: v.nullable(courseSeoValidator),
  },
  handler: async (ctx, args) => {
    const normalizedSlug = validateSlug(args.slug);

    const isSlugAvailable = await db.courses.queries.isSlugAvailable(
      ctx,
      normalizedSlug,
    );

    if (!isSlugAvailable) {
      throw new ConvexError("slug is already taken");
    }

    return db.courses.mutations.create(ctx, {
      ...args,
      slug: normalizedSlug,
      teacherId: ctx.teacherId,
    });
  },
});

export const update = teacherMutation({
  args: {
    courseId: v.id("courses"),

    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.any()),
    thumbnailStorageId: v.optional(v.id("_storage")),

    pricing: v.optional(coursePricingValidator),

    seo: v.optional(v.nullable(courseSeoValidator)),
  },
  handler: async (ctx, args) => {
    const { courseId, ...updateData } = args;
    const course = await db.courses.queries.getById(ctx, courseId);

    if (!course || course.teacherId !== ctx.teacherId) {
      throw new ConvexError("course doesn't exist");
    }

    const normalizedSlug = args.slug ? validateSlug(args.slug) : undefined;

    const isSlugAvailable = normalizedSlug
      ? await db.courses.queries.isSlugAvailable(ctx, normalizedSlug)
      : true;

    if (!isSlugAvailable) {
      throw new ConvexError("slug is already taken");
    }

    return db.courses.mutations.update(ctx, courseId, {
      ...updateData,
      slug: normalizedSlug,
    });
  },
});

export const updateStatus = teacherMutation({
  args: {
    courseId: v.id("courses"),
    status: courseStatusValidator,
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getById(ctx, args.courseId);

    if (!course || course.teacherId != ctx.teacherId) {
      throw new ConvexError("course doesn't exist");
    }

    return db.courses.mutations.updateStatus(ctx, args.courseId, args.status);
  },
});

export const remove = teacherMutation({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const course = await db.courses.queries.getById(ctx, args.courseId);

    if (!course || course.teacherId != ctx.teacherId) {
      throw new ConvexError("course doesn't exist");
    }

    // Sections and lessons are automatically deleted via triggers
    return db.courses.mutations.remove(ctx, args.courseId);
  },
});
