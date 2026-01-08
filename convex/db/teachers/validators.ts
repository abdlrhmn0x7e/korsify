import { v } from "convex/values";

export const socialLinkValidator = v.object({
  platform: v.union(
    v.literal("facebook"),
    v.literal("instagram"),
    v.literal("twitter"),
    v.literal("youtube"),
    v.literal("tiktok"),
    v.literal("linkedin")
  ),
  url: v.string(),
});

export const brandingValidator = v.object({
  logoStorageId: v.optional(v.id("_storage")),
  coverStorageId: v.optional(v.id("_storage")),
  primaryColor: v.optional(v.string()),
  faviconStorageId: v.optional(v.id("_storage")),
  accentColor: v.optional(v.string()),
  bio: v.optional(v.string()),
  whatsappNumber: v.optional(v.string()),
  socialLinks: v.optional(v.array(socialLinkValidator)),
  footerText: v.optional(v.string()),
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
