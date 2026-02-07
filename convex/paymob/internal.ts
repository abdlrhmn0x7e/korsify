import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

interface SubscriptionWebhookPayload {
  subscription_data: {
    id: number;
    plan_id: number;
    state: string;
    amount_cents: number;
    starts_at: string;
    next_billing: string;
    frequency: number;
    name: string;
  };
  transaction_id?: number;
  trigger_type: string;
  hmac: string;
  card_data?: {
    token: string;
    masked_pan: string;
  };
}

function parseNextBillingDate(nextBilling: string): number {
  return new Date(nextBilling).getTime();
}

/**
 * Extract the teacher ID from the subscription plan name.
 * The plan name format is: `${teacherName}-${teacherId}`
 * Convex IDs don't contain dashes, so the last segment after
 * the final `-` is always the teacher ID.
 */
function extractTeacherIdFromPlanName(name: string): Id<"teachers"> | null {
  const lastDash = name.lastIndexOf("-");
  if (lastDash === -1) return null;
  const id = name.substring(lastDash + 1).trim();
  if (!id) return null;
  return id as Id<"teachers">;
}

export const fulfillSubscription = internalAction({
  args: {
    payload: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const payload = args.payload as SubscriptionWebhookPayload;
    const { subscription_data, trigger_type } = payload;
    const paymobSubscriptionId = subscription_data.id;
    const nextBilling = parseNextBillingDate(subscription_data.next_billing);
    const now = Date.now();

    switch (trigger_type) {
      case "Subscription Created": {
        // Extract teacher ID from the subscription plan name
        const teacherId = extractTeacherIdFromPlanName(
          subscription_data.name
        );
        if (!teacherId) {
          console.error(
            "Could not extract teacherId from plan name:",
            subscription_data.name
          );
          return null;
        }

        // Check if subscription already exists for this teacher
        const existing = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByTeacherId,
          { teacherId }
        );

        if (existing) {
          // Resubscribe case — update existing record
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.update,
            {
              subscriptionId: existing._id,
              status: "active" as const,
              lastRenewalDate: now,
              currentPeriodEnd: nextBilling,
            }
          );
        } else {
          // First-time subscription
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.create,
            {
              teacherId,
              status: "active" as const,
              paymobSubscriptionId,
              lastRenewalDate: now,
              currentPeriodEnd: nextBilling,
            }
          );
        }
        break;
      }

      case "suspended": {
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobId,
          { paymobSubscriptionId }
        );

        if (subscription) {
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.update,
            {
              subscriptionId: subscription._id,
              status: "inactive" as const,
              lastRenewalDate: subscription.lastRenewalDate,
              currentPeriodEnd: subscription.currentPeriodEnd,
            }
          );
        } else {
          console.warn(
            "No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "resumed": {
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobId,
          { paymobSubscriptionId }
        );

        if (subscription) {
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.update,
            {
              subscriptionId: subscription._id,
              status: "active" as const,
              lastRenewalDate: now,
              currentPeriodEnd: nextBilling,
            }
          );
        } else {
          console.warn(
            "No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "canceled": {
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobId,
          { paymobSubscriptionId }
        );

        if (subscription) {
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.update,
            {
              subscriptionId: subscription._id,
              status: "inactive" as const,
              lastRenewalDate: subscription.lastRenewalDate,
              currentPeriodEnd: subscription.currentPeriodEnd,
            }
          );
        } else {
          console.warn(
            "No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      default: {
        console.warn(
          "Unhandled Paymob subscription webhook trigger_type:",
          trigger_type
        );
      }
    }

    return null;
  },
});
