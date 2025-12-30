import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { db } from "../db";
import { brandingValidator, paymentInfoValidator } from "../db/teachers/index";
import { authComponent } from "../auth";
import { RESERVED_SUBDOMAINS } from "../../lib/subdomain";
import { ConvexError } from "convex/values";
import { z } from "zod";

const subdomainSchema = z
  .string()
  .min(3, "Subdomain must be at least 3 characters")
  .max(63, "Subdomain must be at most 63 characters")
  .regex(
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    "Subdomain must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens"
  )
  .refine((val) => !RESERVED_SUBDOMAINS.has(val), "This subdomain is reserved")
  .transform((val) => val.toLowerCase().trim());

function validateSubdomain(subdomain: string): string {
  const result = subdomainSchema.safeParse(subdomain.toLowerCase().trim());
  if (!result.success) throw new ConvexError(result.error.issues[0].message);
  return result.data;
}

export const completeOnboarding = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subdomain: v.string(),
    phone: v.optional(v.string()),
    branding: v.optional(
      v.object({
        logoStorageId: v.optional(v.string()),
        coverStorageId: v.optional(v.string()),
        primaryColor: v.optional(v.string()),
      })
    ),
    paymentInfo: v.optional(
      v.object({
        vodafoneCash: v.optional(v.string()),
        instaPay: v.optional(v.string()),
        instructions: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const existingTeacher = await db.teachers.queries.getByUserId(
      ctx,
      user._id
    );
    if (existingTeacher) {
      throw new ConvexError("Teacher profile already exists");
    }

    const normalizedSubdomain = validateSubdomain(args.subdomain);

    const isAvailable = await db.teachers.queries.isSubdomainAvailable(
      ctx,
      normalizedSubdomain
    );
    if (!isAvailable) {
      throw new ConvexError("Subdomain is already taken");
    }

    return await db.teachers.mutations.create(ctx, {
      userId: user._id,
      name: args.name,
      email: args.email,
      subdomain: normalizedSubdomain,
      phone: args.phone,
      branding: args.branding
        ? {
            logoStorageId: args.branding.logoStorageId,
            coverStorageId: args.branding.coverStorageId,
            primaryColor: args.branding.primaryColor,
          }
        : undefined,
      paymentInfo: args.paymentInfo,
      status: "pending",
    });
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subdomain: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const existingTeacher = await db.teachers.queries.getByUserId(
      ctx,
      user._id
    );
    if (existingTeacher)
      throw new ConvexError("Teacher profile already exists");

    const normalizedSubdomain = validateSubdomain(args.subdomain);

    const isAvailable = await db.teachers.queries.isSubdomainAvailable(
      ctx,
      normalizedSubdomain
    );
    if (!isAvailable) throw new ConvexError("Subdomain is already taken");

    return await db.teachers.mutations.create(ctx, {
      userId: user._id,
      name: args.name,
      email: args.email,
      subdomain: normalizedSubdomain,
      phone: args.phone,
      status: "pending",
    });
  },
});

export const update = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) {
      throw new ConvexError("Teacher profile not found");
    }

    return await db.teachers.mutations.update(ctx, teacher._id, args);
  },
});

export const updateBranding = mutation({
  args: {
    branding: brandingValidator,
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) {
      throw new ConvexError("Teacher profile not found");
    }

    return await db.teachers.mutations.updateBranding(
      ctx,
      teacher._id,
      args.branding
    );
  },
});

export const updatePaymentInfo = mutation({
  args: {
    paymentInfo: paymentInfoValidator,
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) {
      throw new ConvexError("Teacher profile not found");
    }

    return await db.teachers.mutations.updatePaymentInfo(
      ctx,
      teacher._id,
      args.paymentInfo
    );
  },
});

export const updateSubdomain = mutation({
  args: {
    subdomain: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) {
      throw new ConvexError("Teacher profile not found");
    }

    const normalizedSubdomain = validateSubdomain(args.subdomain);

    if (normalizedSubdomain === teacher.subdomain) {
      return;
    }

    const isAvailable = await db.teachers.queries.isSubdomainAvailable(
      ctx,
      normalizedSubdomain
    );
    if (!isAvailable) {
      throw new ConvexError("Subdomain is already taken");
    }

    return await db.teachers.mutations.updateSubdomain(
      ctx,
      teacher._id,
      normalizedSubdomain
    );
  },
});

export const updateCustomDomain = mutation({
  args: {
    customDomain: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) {
      throw new ConvexError("Teacher profile not found");
    }

    if (args.customDomain) {
      const isAvailable = await db.teachers.queries.isCustomDomainAvailable(
        ctx,
        args.customDomain
      );
      if (!isAvailable) {
        throw new ConvexError("Custom domain is already in use");
      }
    }

    return await db.teachers.mutations.updateCustomDomain(
      ctx,
      teacher._id,
      args.customDomain,
      false
    );
  },
});
