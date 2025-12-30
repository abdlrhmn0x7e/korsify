import { v } from "convex/values";

export const sectionStatusValidator = v.union(
  v.literal("draft"),
  v.literal("published"),
);
