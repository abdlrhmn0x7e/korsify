import { ConvexError, v } from "convex/values";
import { teacherMutation } from "../../utils";
import { db } from "../../db";

export const linkVideoToLesson = teacherMutation({
  args: {
    lessonId: v.id("lessons"),
    muxAssetId: v.id("muxAssets"),
  },
  handler: async (ctx, args) => {
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("Lesson not found");
    }

    const muxAsset = await db.muxAssets.queries.getById(ctx, args.muxAssetId);

    if (!muxAsset || muxAsset.teacherId !== ctx.teacherId) {
      throw new ConvexError("Video not found");
    }

    await db.lessons.mutations.linkVideo(ctx, args.lessonId, args.muxAssetId);

    return { success: true };
  },
});

export const removeVideoFromLesson = teacherMutation({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("Lesson not found");
    }

    if (!lesson.videoId) {
      throw new ConvexError("Lesson has no video");
    }

    const muxAsset = await db.muxAssets.queries.getById(ctx, lesson.videoId);

    await db.lessons.mutations.unlinkVideo(ctx, args.lessonId);

    if (muxAsset) {
      await db.muxAssets.mutations.remove(ctx, muxAsset._id);
    }

    return {
      success: true,
      muxAssetId: muxAsset?.assetId,
    };
  },
});

export const deleteMuxAsset = teacherMutation({
  args: {
    muxAssetId: v.id("muxAssets"),
  },
  handler: async (ctx, args) => {
    const muxAsset = await db.muxAssets.queries.getById(ctx, args.muxAssetId);

    if (!muxAsset || muxAsset.teacherId !== ctx.teacherId) {
      throw new ConvexError("Video not found");
    }

    await db.muxAssets.mutations.remove(ctx, args.muxAssetId);

    return {
      success: true,
      muxAssetId: muxAsset.assetId,
    };
  },
});
