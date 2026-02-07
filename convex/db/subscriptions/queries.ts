import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";

export async function get(
  ctx: GenericQueryCtx<DataModel>,
  subscriptionId: Id<"subscriptions">
) {
  return ctx.db.get(subscriptionId);
}

export async function getByTeacherId(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">
) {
  return ctx.db
    .query("subscriptions")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .first();
}

export async function getByPaymobSubscriptionId(
  ctx: GenericQueryCtx<DataModel>,
  paymobSubscriptionId: number
) {
  return ctx.db
    .query("subscriptions")
    .withIndex("by_paymobSubscriptionId", (q) =>
      q.eq("paymobSubscriptionId", paymobSubscriptionId)
    )
    .first();
}
