import {
  defineTable,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";
import { v } from "convex/values";
import { DataModel, Id } from "../../_generated/dataModel";

export const table = defineTable({
  token: v.string(),
  user: v.nullable(
    v.object({
      id: v.string(),
      usedAt: v.number(),
    }),
  ),
});

export function get(ctx: GenericQueryCtx<DataModel>) {
  return ctx.db.query("tokens").collect();
}

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
  },
) {
  return ctx.db.delete("tokens", data.tokenId);
}
