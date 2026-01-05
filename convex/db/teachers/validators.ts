import { v } from "convex/values";

export const brandingValidator = v.object({
  logoStorageId: v.optional(v.id("_storage")),
  coverStorageId: v.optional(v.id("_storage")),
  primaryColor: v.optional(v.string()),
});

export const paymentInfoValidator = v.object({
  vodafoneCash: v.optional(v.string()),
  instaPay: v.optional(v.string()),
  instructions: v.optional(v.string()),
});

export const teacherStatusValidator = v.union(
  v.literal("pending"),
  v.literal("active"),
  v.literal("suspended")
);
