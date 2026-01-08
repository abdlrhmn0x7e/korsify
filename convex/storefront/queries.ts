import { v } from "convex/values";
import { query } from "../_generated/server";
import { db } from "../db";

export const getStorefront = query({
  args: { teacherId: v.id("teachers") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return db.storefronts.queries.getByTeacherId(ctx, args.teacherId);
  },
});

export const getPublishedCourses = query({
  args: { teacherId: v.id("teachers") },
  returns: v.any(),
  handler: async (ctx, args) => {
    return db.courses.queries.listPublished(ctx, args.teacherId);
  },
});
