import { GenericQueryCtx } from "convex/server";
import { DataModel } from "../../_generated/dataModel";

export function get(ctx: GenericQueryCtx<DataModel>) {
  return ctx.db.query("tokens").collect();
}
