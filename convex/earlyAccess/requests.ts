import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { db } from "../db";

export const create = mutation({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    return await db.earlyAccessRequests.mutations.create(ctx, args);
  },
});
