import { GenericQueryCtx } from "convex/server";
import { DataModel } from "../../_generated/dataModel";

export function get(ctx: GenericQueryCtx<DataModel>) {
  return ctx.db.query("accessTokens").collect();
}

export function getByToken(ctx: GenericQueryCtx<DataModel>, token: string) {
  return ctx.db
    .query("accessTokens")
    .filter((q) => q.eq(q.field("token"), token))
    .first();
}
