import { v, ConvexError } from "convex/values";
import { action } from "../../_generated/server";
import { api } from "../../_generated/api";
import { internal } from "../../_generated/api";
import { Doc } from "../../_generated/dataModel";
import {
  transactionValidator,
  cardInfoValidator,
  type MappedTransaction,
  type CardInfo,
} from "../../paymob/internal";

// ---------------------------------------------------------------------------
// Return type (discriminated union to avoid circularity)
// ---------------------------------------------------------------------------

type SubscriptionDetailsResult =
  | {
      hasSubscription: true;
      subscription: {
        status: "active" | "inactive";
        paymobSubscriptionId: number;
        lastRenewalDate: number;
        currentPeriodEnd: number;
      };
      card: CardInfo | null;
      transactions: Array<MappedTransaction>;
    }
  | {
      hasSubscription: false;
    };

// ---------------------------------------------------------------------------
// getDetails — public action for the dashboard payments page
// ---------------------------------------------------------------------------

export const getDetails = action({
  args: {},
  returns: v.union(
    v.object({
      hasSubscription: v.literal(true),
      subscription: v.object({
        status: v.union(v.literal("active"), v.literal("inactive")),
        paymobSubscriptionId: v.number(),
        lastRenewalDate: v.number(),
        currentPeriodEnd: v.number(),
      }),
      card: cardInfoValidator,
      transactions: v.array(transactionValidator),
    }),
    v.object({
      hasSubscription: v.literal(false),
    })
  ),
  handler: async (ctx): Promise<SubscriptionDetailsResult> => {
    const teacher: Doc<"teachers"> | null = await ctx.runQuery(
      api.teachers.queries.getTeacher,
      {}
    );
    if (!teacher) {
      throw new ConvexError("Teacher not found");
    }

    const subscription: Doc<"subscriptions"> | null = await ctx.runQuery(
      api.teachers.subscriptions.queries.get,
      {}
    );

    if (!subscription) {
      return { hasSubscription: false as const };
    }

    // Delegate Paymob API fetch to the internal action
    const { card, transactions } = await ctx.runAction(
      internal.paymob.internal.fetchSubscriptionTransactions,
      { paymobSubscriptionId: subscription.paymobSubscriptionId }
    );

    return {
      hasSubscription: true as const,
      subscription: {
        status: subscription.status,
        paymobSubscriptionId: subscription.paymobSubscriptionId,
        lastRenewalDate: subscription.lastRenewalDate,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      card,
      transactions,
    };
  },
});
