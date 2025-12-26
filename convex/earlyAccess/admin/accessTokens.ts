import { db } from "../../db";

import { v } from "convex/values";
import { adminMutation, adminQuery } from "../../utils";

export const get = adminQuery({
  args: {},
  handler: async (ctx) => {
    return await db.accessTokens.queries.get(ctx);
  },
});

export const create = adminMutation({
  args: {},
  handler: async (ctx) => {
    return await db.accessTokens.mutations.create(ctx);
  },
});

export const remove = adminMutation({
  args: {
    accessTokenId: v.id("accessTokens"),
  },
  handler: async (ctx, args) => {
    return await db.accessTokens.mutations.remove(ctx, args);
  },
});
