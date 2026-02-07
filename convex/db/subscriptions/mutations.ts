import { GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import { Infer } from "convex/values";
import { subscriptionStatusValidator } from "./validators";

type SubscriptionStatus = Infer<typeof subscriptionStatusValidator>;

type CreateSubscriptionData = {
  teacherId: Id<"teachers">;
  status: SubscriptionStatus;
  paymobSubscriptionId: number;
  lastRenewalDate: number;
  currentPeriodEnd: number;
};

type UpdateSubscriptionData = {
  status: SubscriptionStatus;
  lastRenewalDate: number;
  currentPeriodEnd: number;
};

export async function create(
  ctx: GenericMutationCtx<DataModel>,
  data: CreateSubscriptionData
) {
  return ctx.db.insert("subscriptions", data);
}

export async function update(
  ctx: GenericMutationCtx<DataModel>,
  subscriptionId: Id<"subscriptions">,
  data: UpdateSubscriptionData
) {
  return ctx.db.patch("subscriptions", subscriptionId, data);
}

export async function remove(
  ctx: GenericMutationCtx<DataModel>,
  subscriptionId: Id<"subscriptions">
) {
  return ctx.db.delete("subscriptions", subscriptionId);
}
