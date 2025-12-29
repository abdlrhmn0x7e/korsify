import { v } from "convex/values";

export const brandingValidator = v.object({
  logoUrl: v.optional(v.string()),
  logoStorageId: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
  coverStorageId: v.optional(v.string()),
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
