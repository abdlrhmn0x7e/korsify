import { GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";

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
