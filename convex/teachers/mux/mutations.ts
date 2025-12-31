import { ConvexError, v } from "convex/values";
import { teacherMutation } from "../../utils";
import { db } from "../../db";

export const deleteVideo = teacherMutation({
  args: {
    muxAssetId: v.id("muxAssets"),
  },
  handler: async (ctx, args) => {
    const muxAsset = await db.muxAssets.queries.getById(ctx, args.muxAssetId);

    if (!muxAsset || muxAsset.teacherId !== ctx.teacherId) {
      throw new ConvexError("Video not found");
    }

    await db.muxAssets.mutations.remove(ctx, args.muxAssetId);

    return { muxAssetId: muxAsset.assetId };
  },
});
