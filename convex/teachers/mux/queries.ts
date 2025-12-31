import { ConvexError, v } from "convex/values";
import { teacherQuery } from "../../utils";
import { db } from "../../db";

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

    return db.muxAssets.queries.getById(ctx, lesson.videoId);
  },
});

export const getAllVideos = teacherQuery({
  args: {},
  handler: async (ctx) => {
    return db.muxAssets.queries.getAllByTeacherId(ctx, ctx.teacherId);
  },
});

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
