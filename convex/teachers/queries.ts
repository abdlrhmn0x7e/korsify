import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { db } from "../db";
import { authComponent } from "../auth";

export const getTeacher = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    return await db.teachers.queries.getByUserId(ctx, user._id);
  },
});

export const getBySubdomain = query({
  args: { subdomain: v.string() },
  handler: async (ctx, args) => {
    return await db.teachers.queries.getBySubdomain(ctx, args.subdomain);
  },
});

export const getByCustomDomain = query({
  args: { customDomain: v.string() },
  handler: async (ctx, args) => {
    return await db.teachers.queries.getByCustomDomain(ctx, args.customDomain);
  },
});

export const isSubdomainAvailable = query({
  args: { subdomain: v.string() },
  handler: async (ctx, args) => {
    return await db.teachers.queries.isSubdomainAvailable(ctx, args.subdomain);
  },
});
