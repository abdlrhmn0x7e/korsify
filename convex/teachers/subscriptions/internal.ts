import { GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import { db } from "../../db";
import { calculateAmountCents } from "../../lib/billing";
import { internal } from "../../_generated/api";

export async function recalculateBilling(
  ctx: GenericMutationCtx<DataModel>,
  teacherId: Id<"teachers">
) {
  console.log("Recalculating billing for teacher", teacherId);
  const subscription = await db.subscriptions.queries.getByTeacherId(
    ctx,
    teacherId
  );
  if (!subscription || subscription.status !== "active") return null;

  // Get all lessons for this teacher
  const lessons = await ctx.db
    .query("lessons")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .collect();

  let totalDuration = 0;
  for (const lesson of lessons) {
    if (lesson.hosting.type === "mux") {
      const asset = await ctx.db.get(lesson.hosting.videoId);
      if (asset?.duration) totalDuration += asset.duration;
    }
  }

  const newAmount = calculateAmountCents(totalDuration);
  console.log("New amount for teacher", teacherId, newAmount);

  if (newAmount !== subscription.amountCents) {
    return await ctx.scheduler.runAfter(
      0,
      internal.paymob.internal.syncAmountToPaymob,
      {
        paymobSubscriptionId: subscription.paymobSubscriptionId,
        amountCents: newAmount,
      }
    );
  }

  return null;
}
