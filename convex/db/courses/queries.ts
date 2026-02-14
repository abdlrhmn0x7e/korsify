import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import { attachThumbnailURL } from "./utils";

async function attachCourseDurations<
  T extends {
    _id: Id<"courses">;
  },
>(ctx: GenericQueryCtx<DataModel>, courses: Array<T>) {
  return Promise.all(
    courses.map(async (course) => {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_courseId", (q) => q.eq("courseId", course._id))
        .collect();

      let duration = 0;
      for (const lesson of lessons) {
        if (lesson.hosting.type !== "mux") continue;

        const asset = await ctx.db.get(lesson.hosting.videoId);
        duration += asset?.duration ?? 0;
      }

      return { ...course, duration };
    })
  );
}

export async function getAll(ctx: GenericQueryCtx<DataModel>) {
  const courses = await ctx.db.query("courses").collect();
  return attachThumbnailURL(ctx, courses);
}

export async function getById(
  ctx: GenericQueryCtx<DataModel>,
  courseId: Id<"courses">,
) {
  const course = await ctx.db.get(courseId);
  return attachThumbnailURL(ctx, course);
}

export async function getBySlug(ctx: GenericQueryCtx<DataModel>, slug: string) {
  const course = await ctx.db
    .query("courses")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
  return attachThumbnailURL(ctx, course);
}

export async function getByTeacherId(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
) {
  const courses = await ctx.db
    .query("courses")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .order("desc")
    .collect();

  return attachThumbnailURL(ctx, courses);
}

export async function getByTeacherIdWithDuration(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
) {
  const courses = await getByTeacherId(ctx, teacherId);
  return attachCourseDurations(ctx, courses);
}

export async function isSlugAvailable(
  ctx: GenericQueryCtx<DataModel>,
  slug: string,
) {
  // should I make this scoped to teacher courses?
  const existing = await getBySlug(ctx, slug);
  return existing === null;
}

export async function listPublished(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
) {
  const courses = await ctx.db
    .query("courses")
    .withIndex("by_teacherId_status", (q) =>
      q.eq("teacherId", teacherId).eq("status", "published")
    )
    .order("desc")
    .collect();

  return attachThumbnailURL(ctx, courses);
}

export async function listPublishedWithDuration(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
) {
  const courses = await listPublished(ctx, teacherId);
  return attachCourseDurations(ctx, courses);
}
