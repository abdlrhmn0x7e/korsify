import { v } from "convex/values";
import { query } from "../_generated/server";
import { db } from "../db";

export const verifyToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const accessToken = await db.accessTokens.queries.getByToken(
      ctx,
      args.token
    );
    if (!accessToken || accessToken.user?.usedAt) {
      return false; // maybe I should throw an error instead?
    }

    return true;
  },
});
