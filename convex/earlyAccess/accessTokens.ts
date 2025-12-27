import { Id as BetterAuthId } from "../components/betterAuth/_generated/dataModel";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { db } from "../db";

export const verify = query({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    const accessToken = await db.accessTokens.queries.getByToken(
      ctx,
      args.accessToken
    );
    if (!accessToken || accessToken.user?.usedAt) {
      return false; // maybe I should throw an error instead?
    }

    return true;
  },
});

export const claim = mutation({
  args: { accessToken: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    return await db.accessTokens.mutations.claim(ctx, {
      accessToken: args.accessToken,
      userId: args.userId as BetterAuthId<"user">,
    });
  },
});
