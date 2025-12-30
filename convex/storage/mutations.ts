import { v, ConvexError } from "convex/values";
import { mutation } from "../_generated/server";
import { authComponent } from "../auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    return await ctx.storage.getUrl(args.storageId);
  },
});
