import { v } from "convex/values";
import { internalQuery } from "../_generated/server";
import { db } from "../db";

export const getSubscriptionByTeacherId = internalQuery({
  args: {
    teacherId: v.id("teachers"),
  },
  handler: async (ctx, args) => {
    return db.subscriptions.queries.getByTeacherId(ctx, args.teacherId);
  },
});

export const getSubscriptionByPaymobSubscriptionId = internalQuery({
  args: {
    paymobSubscriptionId: v.number(),
  },
  handler: async (ctx, args) => {
    return db.subscriptions.queries.getByPaymobSubscriptionId(
      ctx,
      args.paymobSubscriptionId
    );
  },
});

export const getTeacherByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return db.teachers.queries.getByEmail(ctx, args.email);
  },
});
