import { v, Infer } from "convex/values";

const baseSectionFields = {
  id: v.string(),
  visible: v.boolean(),
};

export const heroVariantValidator = v.union(
  v.literal("centered"),
  v.literal("split"),
  v.literal("minimal"),
  v.literal("video")
);

export const heroContentValidator = v.object({
  headline: v.string(),
  subheadline: v.string(),
  ctaText: v.string(),
  ctaLink: v.string(),
  backgroundImageStorageId: v.optional(v.id("_storage")),
});

export const heroSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("hero"),
  variant: heroVariantValidator,
  content: heroContentValidator,
});

export const coursesVariantValidator = v.union(
  v.literal("grid"),
  v.literal("list"),
  v.literal("carousel"),
  v.literal("featured")
);

export const coursesContentValidator = v.object({
  title: v.string(),
  subtitle: v.optional(v.string()),
  showPrice: v.boolean(),
  showDuration: v.boolean(),
  limit: v.optional(v.number()),
  viewAllLink: v.optional(v.boolean()),
});

export const coursesSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("courses"),
  variant: coursesVariantValidator,
  content: coursesContentValidator,
});

export const aboutVariantValidator = v.union(
  v.literal("side-by-side"),
  v.literal("centered"),
  v.literal("stats-focus")
);

export const aboutContentValidator = v.object({
  title: v.string(),
  imageStorageId: v.optional(v.id("_storage")),
  showStats: v.boolean(),
});

export const aboutSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("about"),
  variant: aboutVariantValidator,
  content: aboutContentValidator,
});

export const testimonialsVariantValidator = v.union(
  v.literal("cards"),
  v.literal("carousel"),
  v.literal("quotes")
);

export const testimonialItemValidator = v.object({
  id: v.string(),
  name: v.string(),
  role: v.optional(v.string()),
  content: v.string(),
  avatarStorageId: v.optional(v.id("_storage")),
  rating: v.optional(v.number()),
});

export const testimonialsContentValidator = v.object({
  title: v.string(),
  items: v.array(testimonialItemValidator),
});

export const testimonialsSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("testimonials"),
  variant: testimonialsVariantValidator,
  content: testimonialsContentValidator,
});

export const faqVariantValidator = v.union(
  v.literal("accordion"),
  v.literal("two-column")
);

export const faqItemValidator = v.object({
  id: v.string(),
  question: v.string(),
  answer: v.string(),
});

export const faqContentValidator = v.object({
  title: v.string(),
  items: v.array(faqItemValidator),
});

export const faqSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("faq"),
  variant: faqVariantValidator,
  content: faqContentValidator,
});

export const ctaVariantValidator = v.union(
  v.literal("simple"),
  v.literal("gradient"),
  v.literal("image")
);

export const ctaContentValidator = v.object({
  headline: v.string(),
  subheadline: v.optional(v.string()),
  buttonText: v.string(),
  buttonLink: v.string(),
  showWhatsApp: v.boolean(),
  backgroundImageStorageId: v.optional(v.id("_storage")),
});

export const ctaSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("cta"),
  variant: ctaVariantValidator,
  content: ctaContentValidator,
});

export const storefrontSectionValidator = v.union(
  heroSectionValidator,
  coursesSectionValidator,
  aboutSectionValidator,
  testimonialsSectionValidator,
  faqSectionValidator,
  ctaSectionValidator
);

export const storefrontThemeValidator = v.union(
  v.literal("light"),
  v.literal("dark"),
  v.literal("soft")
);

export const buttonStyleValidator = v.union(
  v.literal("rounded"),
  v.literal("sharp")
);

export const storefrontStyleValidator = v.object({
  fontPair: v.string(),
  buttonStyle: buttonStyleValidator,
  borderRadius: v.optional(v.string()),
});

export type StorefrontTheme = Infer<typeof storefrontThemeValidator>;
export type StorefrontStyle = Infer<typeof storefrontStyleValidator>;
export type StorefrontSection = Infer<typeof storefrontSectionValidator>;

export type HeroSection = Infer<typeof heroSectionValidator>;
export type CoursesSection = Infer<typeof coursesSectionValidator>;
export type AboutSection = Infer<typeof aboutSectionValidator>;
export type TestimonialsSection = Infer<typeof testimonialsSectionValidator>;
export type FaqSection = Infer<typeof faqSectionValidator>;
export type CtaSection = Infer<typeof ctaSectionValidator>;

export type HeroVariant = Infer<typeof heroVariantValidator>;
export type CoursesVariant = Infer<typeof coursesVariantValidator>;
export type AboutVariant = Infer<typeof aboutVariantValidator>;
export type TestimonialsVariant = Infer<typeof testimonialsVariantValidator>;
export type FaqVariant = Infer<typeof faqVariantValidator>;
export type CtaVariant = Infer<typeof ctaVariantValidator>;

export type HeroContent = Infer<typeof heroContentValidator>;
export type CoursesContent = Infer<typeof coursesContentValidator>;
export type AboutContent = Infer<typeof aboutContentValidator>;
export type TestimonialsContent = Infer<typeof testimonialsContentValidator>;
export type FaqContent = Infer<typeof faqContentValidator>;
export type CtaContent = Infer<typeof ctaContentValidator>;

export type TestimonialItem = Infer<typeof testimonialItemValidator>;
export type FaqItem = Infer<typeof faqItemValidator>;

export type SectionType = StorefrontSection["type"];
