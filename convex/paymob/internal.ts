import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

interface SubscriptionWebhookPayload {
  paymob_request_id: string;
  subscription_data: {
    id: number;
    client_info: {
      email: string;
      full_name: string;
      phone_number: string;
    };
    frequency: number;
    created_at: string;
    updated_at: string;
    name: string;
    reminder_days: number | null;
    retrial_days: number | null;
    plan_id: number;
    state: string;
    amount_cents: number;
    starts_at: string;
    next_billing: string;
    reminder_date: string | null;
    ends_at: string | null;
    resumed_at: string | null;
    suspended_at: string | null;
    reactivated_at?: string | null;
    webhook_url: string;
    integration: number;
    initial_transaction: number;
  };
  transaction_id?: number;
  trigger_type: string;
  hmac: string;
  card_data?: {
    token: string;
    masked_pan: string;
  };
}

/**
 * Trigger types we explicitly handle.
 * Card management events (add_secondry_card, change_primary_card,
 * delete_card) and register_webhook are ignored.
 */
const HANDLED_TRIGGER_TYPES = [
  "Subscription Created",
  "suspended",
  "canceled",
  "resumed",
  "updated",
  "Successful Transaction",
  "Failed Transaction",
  "Failed Overdue Transaction",
] as const;

const IGNORED_TRIGGER_TYPES = [
  "add_secondry_card",
  "change_primary_card",
  "delete_card",
  "register_webhook",
] as const;

function parseNextBillingDate(nextBilling: string): number {
  const ts = new Date(nextBilling).getTime();
  if (isNaN(ts)) {
    console.error("Invalid next_billing date:", nextBilling);
    // Fall back to 30 days from now so the subscription doesn't
    // immediately appear expired.
    return Date.now() + 30 * 24 * 60 * 60 * 1000;
  }
  return ts;
}

/**
 * Map Paymob subscription state to our internal status.
 * Paymob states: "active", "suspended", "canceled"
 */
function mapPaymobStateToStatus(state: string): "active" | "inactive" {
  return state === "active" ? "active" : "inactive";
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
    const paymobPlanId = subscription_data.plan_id;
    const nextBilling = parseNextBillingDate(subscription_data.next_billing);
    const now = Date.now();

    console.log(
      `[Paymob Webhook] trigger_type="${trigger_type}" ` +
        `subscription_id=${paymobSubscriptionId} ` +
        `state="${subscription_data.state}" ` +
        `request_id="${payload.paymob_request_id}"`
    );

    // Ignore card management and webhook registration events
    if ((IGNORED_TRIGGER_TYPES as readonly string[]).includes(trigger_type)) {
      console.log(`[Paymob Webhook] Ignoring trigger_type="${trigger_type}"`);
      return null;
    }

    switch (trigger_type) {
      case "Subscription Created": {
        const teacherId = extractTeacherIdFromPlanName(subscription_data.name);
        if (!teacherId) {
          console.error(
            "[Paymob Webhook] Could not extract teacherId from plan name:",
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
          // Resubscribe case — update existing record with new paymob IDs
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.update,
            {
              subscriptionId: existing._id,
              status: "active" as const,
              lastRenewalDate: now,
              currentPeriodEnd: nextBilling,
              paymobPlanId,
              paymobSubscriptionId,
            }
          );
          console.log(
            `[Paymob Webhook] Resubscribed teacher=${teacherId} ` +
              `subscription=${existing._id}`
          );
        } else {
          // First-time subscription
          const subscriptionId: Id<"subscriptions"> = await ctx.runMutation(
            internal.teachers.subscriptions.mutations.create,
            {
              teacherId,
              status: "active" as const,
              paymobPlanId,
              paymobSubscriptionId,
              lastRenewalDate: now,
              currentPeriodEnd: nextBilling,
            }
          );
          console.log(
            `[Paymob Webhook] Created subscription=${subscriptionId} ` +
              `for teacher=${teacherId}`
          );
        }
        break;
      }

      case "suspended": {
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobSubscriptionId,
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
          console.log(
            `[Paymob Webhook] Suspended subscription=${subscription._id}`
          );
        } else {
          console.warn(
            "[Paymob Webhook] No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "resumed": {
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobSubscriptionId,
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
          console.log(
            `[Paymob Webhook] Resumed subscription=${subscription._id}`
          );
        } else {
          console.warn(
            "[Paymob Webhook] No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "canceled": {
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobSubscriptionId,
          { paymobSubscriptionId }
        );

        if (subscription) {
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.update,
            {
              subscriptionId: subscription._id,
              status: "inactive" as const,
              // Keep existing dates — subscription won't renew
              lastRenewalDate: subscription.lastRenewalDate,
              currentPeriodEnd: subscription.currentPeriodEnd,
            }
          );
          console.log(
            `[Paymob Webhook] Canceled subscription=${subscription._id} ` +
              `(permanent — cannot be reactivated)`
          );
        } else {
          console.warn(
            "[Paymob Webhook] No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "updated": {
        // Plan was updated (e.g. amount, frequency changed by merchant).
        // Sync subscription state and billing dates from the payload.
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobSubscriptionId,
          { paymobSubscriptionId }
        );

        if (subscription) {
          const status = mapPaymobStateToStatus(subscription_data.state);
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.update,
            {
              subscriptionId: subscription._id,
              status,
              lastRenewalDate: subscription.lastRenewalDate,
              currentPeriodEnd: nextBilling,
            }
          );
          console.log(
            `[Paymob Webhook] Updated subscription=${subscription._id} ` +
              `status="${status}"`
          );
        } else {
          console.warn(
            "[Paymob Webhook] No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "Successful Transaction": {
        // Next billing cycle charged successfully.
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobSubscriptionId,
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
          console.log(
            `[Paymob Webhook] Successful transaction for ` +
              `subscription=${subscription._id} ` +
              `next_billing=${subscription_data.next_billing}`
          );
        } else {
          console.warn(
            "[Paymob Webhook] No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "Failed Transaction": {
        // Billing cycle charge failed.
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobSubscriptionId,
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
          console.log(
            `[Paymob Webhook] Failed transaction for ` +
              `subscription=${subscription._id}`
          );
        } else {
          console.warn(
            "[Paymob Webhook] No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      case "Failed Overdue Transaction": {
        // Retrial charge also failed — subscription is now overdue.
        const subscription = await ctx.runQuery(
          internal.paymob.queries.getSubscriptionByPaymobSubscriptionId,
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
          console.log(
            `[Paymob Webhook] Failed overdue transaction for ` +
              `subscription=${subscription._id} ` +
              `(retrial failed)`
          );
        } else {
          console.warn(
            "[Paymob Webhook] No subscription found for paymobSubscriptionId:",
            paymobSubscriptionId
          );
        }
        break;
      }

      default: {
        console.warn("[Paymob Webhook] Unhandled trigger_type:", trigger_type);
      }
    }

    return null;
  },
});
