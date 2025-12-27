import { GenericQueryCtx } from "convex/server";
import { DataModel } from "../../_generated/dataModel";

export function getAll(ctx: GenericQueryCtx<DataModel>) {
  return ctx.db.query("earlyAccessRequests").collect();
}
