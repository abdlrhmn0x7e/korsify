import { v } from "convex/values";

export const subscriptionStatusValidator = v.union(
  v.literal("active"),
  v.literal("inactive")
);

// active: subscription is active
// inactive: subscription is inactive (failed to pay)
