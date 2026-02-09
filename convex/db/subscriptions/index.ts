import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as subscriptionsQueries from "./queries";
import * as subscriptionsMutations from "./mutations";
import { subscriptionStatusValidator } from "./validators";

export const subscriptionsTable = defineTable({
  teacherId: v.id("teachers"),
  status: subscriptionStatusValidator,

  paymobSubscriptionId: v.number(),
  amountCents: v.number(),

  lastRenewalDate: v.number(),
  currentPeriodEnd: v.number(),
})
  .index("by_teacherId", ["teacherId"])
  .index("by_paymobSubscriptionId", ["paymobSubscriptionId"]);

export const subscriptionsDAL = {
  queries: subscriptionsQueries,
  mutations: subscriptionsMutations,
};
export { subscriptionStatusValidator } from "./validators";
