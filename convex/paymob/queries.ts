import { v } from "convex/values";
import { internalQuery } from "../_generated/server";
import { db } from "../db";

export const getSubscriptionByTeacherId = internalQuery({
  args: { teacherId: v.id("teachers") },
  returns: v.union(
    v.object({
      _id: v.id("subscriptions"),
      _creationTime: v.number(),
      teacherId: v.id("teachers"),
      status: v.union(v.literal("active"), v.literal("inactive")),
      paymobSubscriptionId: v.number(),
      lastRenewalDate: v.number(),
      currentPeriodEnd: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return db.subscriptions.queries.getByTeacherId(ctx, args.teacherId);
  },
});

export const getSubscriptionByPaymobId = internalQuery({
  args: { paymobSubscriptionId: v.number() },
  returns: v.union(
    v.object({
      _id: v.id("subscriptions"),
      _creationTime: v.number(),
      teacherId: v.id("teachers"),
      status: v.union(v.literal("active"), v.literal("inactive")),
      paymobSubscriptionId: v.number(),
      lastRenewalDate: v.number(),
      currentPeriodEnd: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return db.subscriptions.queries.getByPaymobSubscriptionId(
      ctx,
      args.paymobSubscriptionId
    );
  },
});
