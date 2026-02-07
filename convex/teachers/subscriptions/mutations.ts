import { v } from "convex/values";
import { internalMutation } from "../../utils";
import { db } from "../../db";
import { subscriptionStatusValidator } from "../../db/subscriptions/validators";

export const create = internalMutation({
  args: {
    teacherId: v.id("teachers"),
    status: subscriptionStatusValidator,
    paymobSubscriptionPlanId: v.number(),
    paymobSubscriptionId: v.number(),
    lastRenewalDate: v.number(),
    currentPeriodEnd: v.number(),
  },
  returns: v.id("subscriptions"),
  handler: async (ctx, args) => {
    return db.subscriptions.mutations.create(ctx, args);
  },
});

export const update = internalMutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    status: subscriptionStatusValidator,
    lastRenewalDate: v.number(),
    currentPeriodEnd: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { subscriptionId, ...updateData } = args;

    await db.subscriptions.mutations.update(ctx, subscriptionId, updateData);
    return null;
  },
});

export const remove = internalMutation({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await db.subscriptions.mutations.remove(ctx, args.subscriptionId);
    return null;
  },
});
