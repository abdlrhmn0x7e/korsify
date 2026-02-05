import { ConvexError, v } from "convex/values";
import { teacherMutation, TeacherMutationCtx } from "../../utils";
import { db } from "../../db";
import { Id } from "../../_generated/dataModel";

export const create = teacherMutation({
  args: {
    courseId: v.id("courses"),
    sectionId: v.id("sections"),
    title: v.string(),
    description: v.optional(v.any()),
    pdfStorageIds: v.optional(v.array(v.id("_storage"))),
    hosting: v.union(
      v.object({
        type: v.literal("mux"),
        videoId: v.id("muxAssets"),
      }),
      v.object({
        type: v.literal("youtube"),
        youtubeUrl: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("Section not found");
    }

    await checkHostingValidity(ctx, args.hosting);

    const maxOrder = await db.lessons.queries.getMaxOrderBySectionId(
      ctx,
      args.sectionId
    );

    return db.lessons.mutations.create(ctx, {
      courseId: args.courseId,
      sectionId: args.sectionId,
      teacherId: ctx.teacherId,
      title: args.title,
      description: args.description ?? null,
      pdfStorageIds: args.pdfStorageIds ?? [],
      hosting: args.hosting,
      order: maxOrder + 1,
    });
  },
});

export const update = teacherMutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.optional(v.string()),
    description: v.optional(v.nullable(v.any())),
    pdfStorageIds: v.optional(v.array(v.id("_storage"))),
    hosting: v.optional(
      v.union(
        v.object({
          type: v.literal("mux"),
          videoId: v.id("muxAssets"),
        }),
        v.object({
          type: v.literal("youtube"),
          youtubeUrl: v.string(),
        })
      )
    ),
    sectionId: v.optional(v.id("sections")),
  },
  handler: async (ctx, args) => {
    const { lessonId, sectionId, hosting, ...updateData } = args;
    const lesson = await db.lessons.queries.getById(ctx, lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("Lesson not found");
    }

    if (sectionId) {
      const section = await db.sections.queries.getById(ctx, sectionId);

      if (!section || section.teacherId !== ctx.teacherId) {
        throw new ConvexError("Section not found");
      }

      if (section.courseId !== lesson.courseId) {
        throw new ConvexError("Cannot move lesson to a different course");
      }
    }

    if (hosting) {
      await checkHostingValidity(ctx, hosting);
    }

    return db.lessons.mutations.update(ctx, lessonId, {
      ...updateData,
      ...(sectionId && { sectionId }),
      ...(hosting && { hosting }),
    });
  },
});

export const reorder = teacherMutation({
  args: {
    sectionId: v.id("sections"),
    lessonIds: v.array(v.id("lessons")),
  },
  handler: async (ctx, args) => {
    const section = await db.sections.queries.getById(ctx, args.sectionId);

    if (!section || section.teacherId !== ctx.teacherId) {
      throw new ConvexError("Section not found");
    }

    const lessons = await Promise.all(
      args.lessonIds.map((id) => db.lessons.queries.getById(ctx, id))
    );

    for (const lesson of lessons) {
      if (
        !lesson ||
        lesson.sectionId !== args.sectionId ||
        lesson.teacherId !== ctx.teacherId
      ) {
        throw new ConvexError("Invalid lesson");
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
      throw new ConvexError("Lesson not found");
    }

    return db.lessons.mutations.remove(ctx, args.lessonId);
  },
});

async function checkHostingValidity(
  ctx: TeacherMutationCtx,
  hosting:
    | {
        type: "mux";
        videoId: Id<"muxAssets">;
      }
    | {
        type: "youtube";
        youtubeUrl: string;
      }
) {
  if (hosting.type === "mux") {
    const muxAsset = await db.muxAssets.queries.getById(ctx, hosting.videoId);

    if (!muxAsset || muxAsset.teacherId !== ctx.teacherId) {
      throw new ConvexError("Video not found");
    }

    if (muxAsset.status !== "ready") {
      throw new ConvexError("Video is not ready");
    }
  }

  if (hosting.type === "youtube") {
    const YOUTUBE_URL_REGEX =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}(?:\?.*)?$/;

    if (!YOUTUBE_URL_REGEX.test(hosting.youtubeUrl)) {
      throw new ConvexError("Invalid YouTube URL");
    }
  }
}
