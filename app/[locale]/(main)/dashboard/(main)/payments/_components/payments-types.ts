import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

export type SubscriptionDetails = FunctionReturnType<
  typeof api.teachers.subscriptions.actions.getDetails
>;
type SubscribedDetails = Extract<SubscriptionDetails, { hasSubscription: true }>;
export type CardInfo = NonNullable<SubscribedDetails["card"]>;
