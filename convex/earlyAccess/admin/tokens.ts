import { db } from "../../db";

import { v } from "convex/values";
import { adminMutation, adminQuery } from "../../utils";

export const get = adminQuery({
  args: {},
  handler: async (ctx) => {
    return await db.tokens.queries.get(ctx);
  },
});

export const create = adminMutation({
  args: {},
  handler: async (ctx) => {
    return await db.tokens.mutations.create(ctx);
  },
});

export const remove = adminMutation({
  args: {
    tokenId: v.id("tokens"),
  },
  handler: async (ctx, args) => {
    return await db.tokens.mutations.remove(ctx, args);
  },
});
