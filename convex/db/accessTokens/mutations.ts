import { GenericMutationCtx } from "convex/server";
import { DataModel, Doc, Id } from "../../_generated/dataModel";
import { Id as BetterAuthId } from "../../components/betterAuth/_generated/dataModel";
import { ConvexError } from "convex/values";

export function create(ctx: GenericMutationCtx<DataModel>) {
  const token = crypto.randomUUID();

  return ctx.db.insert("accessTokens", {
    token: token,
    user: null,
  });
}

export function remove(
  ctx: GenericMutationCtx<DataModel>,
  data: {
    accessTokenId: Id<"accessTokens">;
  }
) {
  return ctx.db.delete("accessTokens", data.accessTokenId);
}

export async function claim(
  ctx: GenericMutationCtx<DataModel>,
  data: {
    accessToken: Doc<"accessTokens">["token"];
    userId: BetterAuthId<"user">;
  }
) {
  const accessToken = await ctx.db
    .query("accessTokens")
    .withIndex("by_token", (q) => q.eq("token", data.accessToken))
    .first();
  if (!accessToken) throw new ConvexError("Invalid access token");

  return ctx.db.patch("accessTokens", accessToken._id, {
    user: { id: data.userId, usedAt: Date.now() },
  });
}
