import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import db from "../db";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await db.admin.tokens.get(ctx);
  },
});

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await db.admin.tokens.create(ctx);
  },
});

export const remove = mutation({
  args: {
    tokenId: v.id("tokens"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await db.admin.tokens.remove(ctx, args);
  },
});
