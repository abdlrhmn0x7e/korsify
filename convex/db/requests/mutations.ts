import { GenericMutationCtx } from "convex/server";
import { DataModel } from "../../_generated/dataModel";

export function create(
  ctx: GenericMutationCtx<DataModel>,
  data: { phoneNumber: string }
) {
  return ctx.db.insert("earlyAccessRequests", {
    phoneNumber: data.phoneNumber,
  });
}
