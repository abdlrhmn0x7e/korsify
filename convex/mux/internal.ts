import { v } from "convex/values";
import {
  mutation,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { db } from "../db";

export const createAsset = mutation({
  args: {
    teacherId: v.id("teachers"),
    uploadId: v.string(),
  },
  returns: v.id("muxAssets"),
  handler: async (ctx, args) => {
    return db.muxAssets.mutations.create(ctx, {
      teacherId: args.teacherId,
      uploadId: args.uploadId,
    });
  },
});

export const onUploadAssetCreated = internalMutation({
  args: {
    uploadId: v.string(),
    assetId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const asset = await db.muxAssets.queries.getByUploadId(ctx, args.uploadId);

    if (asset) {
      await db.muxAssets.mutations.updateStatus(ctx, asset._id, {
        status: "processing",
        assetId: args.assetId,
      });
    }

    return null;
  },
});

export const onAssetReady = internalMutation({
  args: {
    assetId: v.string(),
    playbackId: v.string(),
    duration: v.optional(v.number()),
    aspectRatio: v.optional(v.string()),
  },
  returns: v.null(),
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

    return null;
  },
});

export const onAssetErrored = internalMutation({
  args: {
    assetId: v.string(),
    errorMessage: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const asset = await db.muxAssets.queries.getByAssetId(ctx, args.assetId);

    if (asset) {
      await db.muxAssets.mutations.updateStatus(ctx, asset._id, {
        status: "errored",
        errorMessage: args.errorMessage,
      });
    }

    return null;
  },
});

const muxAssetValidator = v.union(
  v.object({
    _id: v.id("muxAssets"),
    _creationTime: v.number(),
    teacherId: v.id("teachers"),
    uploadId: v.string(),
    assetId: v.optional(v.string()),
    playbackId: v.optional(v.string()),
    status: v.union(
      v.literal("waiting_upload"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("errored")
    ),
    duration: v.optional(v.number()),
    aspectRatio: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    updatedAt: v.number(),
  }),
  v.null()
);

export const getAssetByUploadId = internalQuery({
  args: { uploadId: v.string() },
  returns: muxAssetValidator,
  handler: async (ctx, args) => {
    return db.muxAssets.queries.getByUploadId(ctx, args.uploadId);
  },
});

export const getAssetByAssetId = internalQuery({
  args: { assetId: v.string() },
  returns: muxAssetValidator,
  handler: async (ctx, args) => {
    return db.muxAssets.queries.getByAssetId(ctx, args.assetId);
  },
});
