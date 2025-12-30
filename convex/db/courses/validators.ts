import { v } from "convex/values";

export const courseStatusValidator = v.union(
  v.literal("draft"),
  v.literal("published"),
);

export const coursePricingValidator = v.object({
  price: v.number(),
  overridePrice: v.nullable(v.number()),
});

export const courseSeoValidator = v.object({
  metaTitle: v.string(),
  metaDescription: v.string(),
});
