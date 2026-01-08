import { v, ConvexError } from "convex/values";
import { mutation, query } from "../_generated/server";
import { db } from "../db";
import { authComponent } from "../auth";
import {
  storefrontStyleValidator,
  storefrontThemeValidator,
} from "../db/storefronts";

export const get = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    return db.storefronts.queries.getByTeacherId(ctx, teacher._id);
  },
});

export const createFromTemplate = mutation({
  args: {
    templateId: v.string(),
  },
  returns: v.id("storefronts"),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const exists = await db.storefronts.queries.existsForTeacher(
      ctx,
      teacher._id
    );
    if (exists) {
      throw new ConvexError("Storefront already exists. Use update instead.");
    }

    return db.storefronts.mutations.createFromTemplate(ctx, {
      teacherId: teacher._id,
      templateId: args.templateId as Parameters<
        typeof db.storefronts.mutations.createFromTemplate
      >[1]["templateId"],
    });
  },
});

export const updateStyle = mutation({
  args: {
    theme: v.optional(storefrontThemeValidator),
    style: v.optional(storefrontStyleValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (!storefront) throw new ConvexError("Storefront not found");

    await db.storefronts.mutations.updateStyle(ctx, storefront._id, args);
    return null;
  },
});

export const updateSection = mutation({
  args: {
    sectionId: v.string(),
    variant: v.optional(v.string()),
    content: v.optional(v.any()),
    visible: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (!storefront) throw new ConvexError("Storefront not found");

    await db.storefronts.mutations.updateSection(ctx, storefront._id, args);
    return null;
  },
});

export const reorderSections = mutation({
  args: {
    sectionIds: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (!storefront) throw new ConvexError("Storefront not found");

    await db.storefronts.mutations.reorderSections(
      ctx,
      storefront._id,
      args.sectionIds
    );
    return null;
  },
});

export const toggleSectionVisibility = mutation({
  args: {
    sectionId: v.string(),
    visible: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (!storefront) throw new ConvexError("Storefront not found");

    await db.storefronts.mutations.toggleSectionVisibility(
      ctx,
      storefront._id,
      args.sectionId,
      args.visible
    );
    return null;
  },
});

export const addSection = mutation({
  args: {
    type: v.union(
      v.literal("hero"),
      v.literal("courses"),
      v.literal("about"),
      v.literal("testimonials"),
      v.literal("faq"),
      v.literal("cta")
    ),
    variant: v.string(),
    afterSectionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (!storefront) throw new ConvexError("Storefront not found");

    await db.storefronts.mutations.addSection(ctx, storefront._id, args);
    return null;
  },
});

export const removeSection = mutation({
  args: {
    sectionId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (!storefront) throw new ConvexError("Storefront not found");

    await db.storefronts.mutations.removeSection(
      ctx,
      storefront._id,
      args.sectionId
    );
    return null;
  },
});

export const updateCssVariables = mutation({
  args: {
    cssVariables: v.record(v.string(), v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (!storefront) throw new ConvexError("Storefront not found");

    await db.storefronts.mutations.updateCssVariables(
      ctx,
      storefront._id,
      args.cssVariables
    );
    return null;
  },
});

export const resetToTemplate = mutation({
  args: {
    templateId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Unauthorized");

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);
    if (!teacher) throw new ConvexError("Teacher profile not found");

    const storefront = await db.storefronts.queries.getByTeacherId(
      ctx,
      teacher._id
    );
    if (storefront) {
      await db.storefronts.mutations.remove(ctx, storefront._id);
    }

    await db.storefronts.mutations.createFromTemplate(ctx, {
      teacherId: teacher._id,
      templateId: args.templateId as Parameters<
        typeof db.storefronts.mutations.createFromTemplate
      >[1]["templateId"],
    });
    return null;
  },
});
