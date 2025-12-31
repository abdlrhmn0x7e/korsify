import { v } from "convex/values";
import { mutation, internalMutation, internalQuery } from "../_generated/server";
import { db } from "../db";

/**
 * Creates a new muxAsset record when starting an upload.
 * Called by the createDirectUpload action.
 */
export const createAsset = mutation({
  args: {
    teacherId: v.id("teachers"),
    uploadId: v.string(),
  },
  handler: async (ctx, args) => {
    return db.muxAssets.mutations.create(ctx, {
      teacherId: args.teacherId,
      uploadId: args.uploadId,
    });
  },
});

// ============================================
// Internal mutations (called by webhooks only)
// ============================================

/**
 * Called when Mux creates an asset from an upload.
 * Webhook event: video.upload.asset_created
 */
export const onUploadAssetCreated = internalMutation({
  args: {
    uploadId: v.string(),
    assetId: v.string(),
  },
  handler: async (ctx, args) => {
    const asset = await db.muxAssets.queries.getByUploadId(ctx, args.uploadId);

    if (asset) {
      await db.muxAssets.mutations.updateStatus(ctx, asset._id, {
        status: "processing",
        assetId: args.assetId,
      });
    }
  },
});

/**
 * Called when a Mux asset is ready for playback.
 * Webhook event: video.asset.ready
 */
export const onAssetReady = internalMutation({
  args: {
    assetId: v.string(),
    playbackId: v.string(),
    duration: v.optional(v.number()),
    aspectRatio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const asset = await db.muxAssets.queries.getByAssetId(ctx, args.assetId);

    if (asset) {
      await db.muxAssets.mutations.updateStatus(ctx, asset._id, {
        status: "ready",
        playbackId: args.playbackId,
        duration: args.duration,
        aspectRatio: args.aspectRatio,
      });
    }
  },
});

/**
 * Called when a Mux asset fails to process.
 * Webhook event: video.asset.errored
 */
export const onAssetErrored = internalMutation({
  args: {
    assetId: v.string(),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const asset = await db.muxAssets.queries.getByAssetId(ctx, args.assetId);

    if (asset) {
      await db.muxAssets.mutations.updateStatus(ctx, asset._id, {
        status: "errored",
        errorMessage: args.errorMessage,
      });
    }
  },
});

// ============================================
// Internal queries (for webhook lookups)
// ============================================

export const getAssetByUploadId = internalQuery({
  args: { uploadId: v.string() },
  handler: async (ctx, args) => {
    return db.muxAssets.queries.getByUploadId(ctx, args.uploadId);
  },
});

export const getAssetByAssetId = internalQuery({
  args: { assetId: v.string() },
  handler: async (ctx, args) => {
    return db.muxAssets.queries.getByAssetId(ctx, args.assetId);
  },
});

