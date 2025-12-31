import { ConvexError, v } from "convex/values";
import { teacherQuery } from "../../utils";
import { db } from "../../db";

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

export const getAllVideos = teacherQuery({
  args: {},
  handler: async (ctx) => {
    return db.muxAssets.queries.getAllByTeacherId(ctx, ctx.teacherId);
  },
});
