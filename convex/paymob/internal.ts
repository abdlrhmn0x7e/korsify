import { v, ConvexError } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY!;
const PAYMOB_API_URL = "https://accept.paymob.com/api";

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

export const fulfillSubscription = internalAction({
  args: {
    payload: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const payload = args.payload as SubscriptionWebhookPayload;
    const { subscription_data, trigger_type } = payload;
    const paymobSubscriptionId = subscription_data.id;
    const amountCents = subscription_data.amount_cents;
    const nextBilling = parseNextBillingDate(subscription_data.next_billing);
    const now = Date.now();

    console.log(
      `[Paymob Webhook] trigger_type="${trigger_type}" ` +
        `subscription_id=${paymobSubscriptionId} ` +
        `state="${subscription_data.state}" ` +
        `amount_cents=${amountCents} ` +
        `request_id="${payload.paymob_request_id}"` +
        `payload=${JSON.stringify(payload)}`
    );

    // Ignore card management and webhook registration events
    if ((IGNORED_TRIGGER_TYPES as readonly string[]).includes(trigger_type)) {
      console.log(`[Paymob Webhook] Ignoring trigger_type="${trigger_type}"`);
      return null;
    }

    switch (trigger_type) {
      case "Subscription Created": {
        // Look up teacher by email from the webhook payload
        const email = subscription_data.client_info.email;
        const teacher = await ctx.runQuery(
          internal.paymob.queries.getTeacherByEmail,
          { email }
        );

        if (!teacher) {
          console.error(
            "[Paymob Webhook] Could not find teacher by email:",
            email
          );
          return null;
        }

        const teacherId = teacher._id;

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
              amountCents,
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
              paymobSubscriptionId,
              amountCents,
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
          // Cancellation is permanent — remove the subscription from DB
          await ctx.runMutation(
            internal.teachers.subscriptions.mutations.remove,
            { subscriptionId: subscription._id }
          );
          console.log(
            `[Paymob Webhook] Canceled and removed subscription=${subscription._id} ` +
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
        // Subscription was updated (e.g. amount synced from trigger).
        // Write amountCents from Paymob — this is the source of truth.
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
              amountCents,
            }
          );
          console.log(
            `[Paymob Webhook] Updated subscription=${subscription._id} ` +
              `status="${status}" amountCents=${amountCents}`
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

// ---------------------------------------------------------------------------
// syncAmountToPaymob — PUT new billing amount to Paymob subscription
// ---------------------------------------------------------------------------

export const syncAmountToPaymob = internalAction({
  args: {
    paymobSubscriptionId: v.number(),
    amountCents: v.number(),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const authToken = await getPaymobAuthToken();
    const response = await fetch(
      `${PAYMOB_API_URL}/acceptance/subscriptions/${args.paymobSubscriptionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount_cents: args.amountCents }),
      }
    );
    if (!response.ok) {
      console.error(
        `[Paymob] Failed to sync amount (${args.amountCents}) to subscription ${args.paymobSubscriptionId}:`,
        await response.text()
      );
    } else {
      console.log(
        `[Paymob] Synced amount_cents=${args.amountCents} to subscription ${args.paymobSubscriptionId}`
      );
    }
    return null;
  },
});

// ---------------------------------------------------------------------------
// Paymob transaction type from the API
// ---------------------------------------------------------------------------

interface PaymobTransaction {
  id: number;
  pending: boolean;
  amount_cents: number;
  success: boolean;
  created_at: string;
  paid_at: string | null;
  currency: string;
  source_data: {
    pan: string;
    type: string;
    tenure: number | null;
    sub_type: string;
  };
  error_occured: boolean;
  is_refunded: boolean;
  is_voided: boolean;
}

// ---------------------------------------------------------------------------
// Shared validators & types for subscription transaction data
// ---------------------------------------------------------------------------

export const transactionValidator = v.object({
  id: v.number(),
  amountCents: v.number(),
  success: v.boolean(),
  pending: v.boolean(),
  createdAt: v.string(),
  paidAt: v.union(v.string(), v.null()),
  currency: v.string(),
  cardPan: v.string(),
  cardBrand: v.string(),
  errorOccurred: v.boolean(),
  isRefunded: v.boolean(),
  isVoided: v.boolean(),
});

export const cardInfoValidator = v.union(
  v.object({
    pan: v.string(),
    brand: v.string(),
  }),
  v.null()
);

export interface MappedTransaction {
  id: number;
  amountCents: number;
  success: boolean;
  pending: boolean;
  createdAt: string;
  paidAt: string | null;
  currency: string;
  cardPan: string;
  cardBrand: string;
  errorOccurred: boolean;
  isRefunded: boolean;
  isVoided: boolean;
}

export interface CardInfo {
  pan: string;
  brand: string;
}

// ---------------------------------------------------------------------------
// fetchSubscriptionTransactions — internal action that hits Paymob API
// ---------------------------------------------------------------------------

async function getPaymobAuthToken() {
  const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });

  if (!response.ok) {
    throw new ConvexError("Failed to get Paymob auth token");
  }

  const data = await response.json();
  return data.token as string;
}

export const fetchSubscriptionTransactions = internalAction({
  args: {
    paymobSubscriptionId: v.number(),
  },
  returns: v.object({
    card: cardInfoValidator,
    transactions: v.array(transactionValidator),
  }),
  handler: async (_ctx, args) => {
    const authToken = await getPaymobAuthToken();

    const response = await fetch(
      `${PAYMOB_API_URL}/acceptance/subscriptions/${args.paymobSubscriptionId}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let card: CardInfo | null = null;
    const transactions: Array<MappedTransaction> = [];

    if (response.ok) {
      const data = await response.json();
      const results = (data.results ?? []) as Array<PaymobTransaction>;

      // Extract card info from the first transaction that has source_data
      for (const tx of results) {
        if (tx.source_data?.pan && tx.source_data?.sub_type) {
          card = {
            pan: tx.source_data.pan,
            brand: tx.source_data.sub_type,
          };
          break;
        }
      }

      // Map transactions to our format
      for (const tx of results) {
        transactions.push({
          id: tx.id,
          amountCents: tx.amount_cents,
          success: tx.success,
          pending: tx.pending,
          createdAt: tx.created_at,
          paidAt: tx.paid_at,
          currency: tx.currency,
          cardPan: tx.source_data?.pan ?? "",
          cardBrand: tx.source_data?.sub_type ?? "",
          errorOccurred: tx.error_occured,
          isRefunded: tx.is_refunded,
          isVoided: tx.is_voided,
        });
      }
    } else {
      console.error(
        "Failed to fetch Paymob transactions:",
        await response.text()
      );
    }

    return { card, transactions };
  },
});
