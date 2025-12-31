import { ConvexError, v } from "convex/values";
import { teacherMutation } from "../../utils";
import { db } from "../../db";

/**
 * Links a video (muxAsset) to a lesson.
 * Called after the client has completed uploading via the action.
 */
export const linkVideoToLesson = teacherMutation({
  args: {
    lessonId: v.id("lessons"),
    muxAssetId: v.id("muxAssets"),
  },
  handler: async (ctx, args) => {
    // Verify lesson ownership
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("Lesson not found");
    }

    // Verify muxAsset ownership
    const muxAsset = await db.muxAssets.queries.getById(ctx, args.muxAssetId);

    if (!muxAsset || muxAsset.teacherId !== ctx.teacherId) {
      throw new ConvexError("Video not found");
    }

    // Link video to lesson
    await db.lessons.mutations.linkVideo(ctx, args.lessonId, args.muxAssetId);

    return { success: true };
  },
});

/**
 * Removes the video from a lesson.
 * Does NOT delete from Mux - use the deleteAsset action separately if needed.
 */
export const removeVideoFromLesson = teacherMutation({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    // Verify lesson ownership
    const lesson = await db.lessons.queries.getById(ctx, args.lessonId);

    if (!lesson || lesson.teacherId !== ctx.teacherId) {
      throw new ConvexError("Lesson not found");
    }

    if (!lesson.videoId) {
      throw new ConvexError("Lesson has no video");
    }

    // Get the mux asset for returning info
    const muxAsset = await db.muxAssets.queries.getById(ctx, lesson.videoId);

    // Unlink video from lesson
    await db.lessons.mutations.unlinkVideo(ctx, args.lessonId);

    // Delete the muxAsset record from database
    if (muxAsset) {
      await db.muxAssets.mutations.remove(ctx, muxAsset._id);
    }

    // Return assetId so client can call deleteAsset action if needed
    return {
      success: true,
      muxAssetId: muxAsset?.assetId,
    };
  },
});

/**
 * Deletes a muxAsset record (orphaned video not linked to any lesson).
 */
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
