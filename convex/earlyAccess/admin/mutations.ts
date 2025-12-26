import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { authComponent } from "../../auth";
import { db } from "../../db";

export const createToken = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await db.tokens.mutations.create(ctx);
  },
});

export const removeToken = mutation({
  args: {
    tokenId: v.id("tokens"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await db.tokens.mutations.remove(ctx, args);
  },
});
