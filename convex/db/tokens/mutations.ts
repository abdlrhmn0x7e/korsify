import { GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";

export function create(ctx: GenericMutationCtx<DataModel>) {
  const token = crypto.randomUUID();

  return ctx.db.insert("tokens", {
    token: token,
    user: null,
  });
}

export function remove(
  ctx: GenericMutationCtx<DataModel>,
  data: {
    tokenId: Id<"tokens">;
  }
) {
  return ctx.db.delete("tokens", data.tokenId);
}
