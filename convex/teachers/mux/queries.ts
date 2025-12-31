import { ConvexError, v } from "convex/values";
import { teacherQuery } from "../../utils";
import { db } from "../../db";

/**
 * Gets video information for a lesson.
 * Returns the muxAsset with its current status.
 */
export const getVideoForLesson = teacherQuery({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("Lesson not found");
    }

    if (!lesson.videoId) {
      return null;
    }

    const muxAsset = await db.muxAssets.queries.getById(ctx, lesson.videoId);

    return muxAsset;
  },
});

/**
 * Gets all videos for the current teacher.
 * Useful for video library management.
 */
export const getAllVideos = teacherQuery({
  args: {},
  handler: async (ctx) => {
    return db.muxAssets.queries.getAllByTeacherId(ctx, ctx.teacherId);
  },
});

/**
 * Gets video by ID (with ownership check).
 */
export const getVideo = teacherQuery({
  args: {
    muxAssetId: v.id("muxAssets"),
  },
  handler: async (ctx, args) => {
    const muxAsset = await db.muxAssets.queries.getById(ctx, args.muxAssetId);

    if (!muxAsset || muxAsset.teacherId !== ctx.teacherId) {
      throw new ConvexError("Video not found");
    }

    return muxAsset;
  },
});

/**
 * Gets the playback ID for a lesson's video.
 * Returns null if video doesn't exist or isn't ready.
 * Client should use this playbackId with getSignedPlaybackToken action.
 */
export const getPlaybackIdForLesson = teacherQuery({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("Lesson not found");
    }

    if (!lesson.videoId) {
      return null;
    }

    const muxAsset = await db.muxAssets.queries.getById(ctx, lesson.videoId);

    if (!muxAsset || muxAsset.status !== "ready" || !muxAsset.playbackId) {
      return null;
    }

    return {
      playbackId: muxAsset.playbackId,
      duration: muxAsset.duration,
      aspectRatio: muxAsset.aspectRatio,
    };
  },
});
