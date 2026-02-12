import { ConvexError, v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const cleanupInactive = internalAction({
  args: {
    teacherId: v.id("teachers"),
  },
  returns: v.object({
    deletedFromMuxCount: v.number(),
    markedLocallyCount: v.number(),
    failedDeletesCount: v.number(),
    skippedBecauseActive: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const teacher = await ctx.runQuery(internal.teachers.queries.getById, {
      teacherId: args.teacherId,
    });

    if (!teacher) {
      throw new ConvexError("Teacher not found");
    }

    const subscription = await ctx.runQuery(
      internal.teachers.subscriptions.queries.getByTeacherId,
      {
        teacherId: args.teacherId,
      }
    );

    if (subscription?.status === "active") {
      return {
        deletedFromMuxCount: 0,
        markedLocallyCount: 0,
        failedDeletesCount: 0,
        skippedBecauseActive: true,
      };
    }

    const assets = await ctx.runQuery(internal.mux.internal.getAssetsByTeacherId, {
      teacherId: args.teacherId,
    });

    let deletedFromMuxCount = 0;
    let markedLocallyCount = 0;
    let failedDeletesCount = 0;

    for (const asset of assets) {
      if (asset.assetId) {
        const result = await ctx.runAction(internal.mux.actions.removeAsset, {
          muxAssetId: asset.assetId,
        });
        if (!result.success) {
          failedDeletesCount += 1;
          continue;
        }
        deletedFromMuxCount += 1;
      }

      await ctx.runMutation(internal.mux.internal.markAssetAsRemovedForBilling, {
        muxAssetId: asset._id,
        reason: "Removed after prolonged inactive subscription.",
      });
      markedLocallyCount += 1;
    }

    return {
      deletedFromMuxCount,
      markedLocallyCount,
      failedDeletesCount,
      skippedBecauseActive: false,
    };
  },
});
