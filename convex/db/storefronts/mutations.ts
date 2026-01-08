import { GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";
import type { StorefrontSection, StorefrontStyle, StorefrontTheme } from "./validators";
import { STARTER_TEMPLATES, StarterTemplateId } from "./templates";

export interface CreateFromTemplateData {
  teacherId: Id<"teachers">;
  templateId: StarterTemplateId;
}

export async function createFromTemplate(
  ctx: GenericMutationCtx<DataModel>,
  data: CreateFromTemplateData
): Promise<Id<"storefronts">> {
  const template = STARTER_TEMPLATES[data.templateId];
  if (!template) {
    throw new Error(`Template "${data.templateId}" not found`);
  }

  const now = Date.now();

  return ctx.db.insert("storefronts", {
    teacherId: data.teacherId,
    theme: template.defaultTheme,
    style: template.defaultStyle,
    sections: template.sections,
    updatedAt: now,
  });
}

export interface UpdateStyleData {
  theme?: StorefrontTheme;
  style?: StorefrontStyle;
}

export async function updateStyle(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">,
  data: UpdateStyleData
): Promise<void> {
  await ctx.db.patch(storefrontId, {
    ...data,
    updatedAt: Date.now(),
  });
}

export interface UpdateSectionData {
  sectionId: string;
  variant?: string;
  content?: Record<string, unknown>;
  visible?: boolean;
}

export async function updateSection(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">,
  data: UpdateSectionData
): Promise<void> {
  const storefront = await ctx.db.get(storefrontId);
  if (!storefront) throw new Error("Storefront not found");

  const sections = storefront.sections.map((section) => {
    if (section.id !== data.sectionId) return section;

    return {
      ...section,
      ...(data.variant !== undefined && { variant: data.variant }),
      ...(data.visible !== undefined && { visible: data.visible }),
      ...(data.content !== undefined && {
        content: { ...section.content, ...data.content },
      }),
    };
  }) as Array<StorefrontSection>;

  await ctx.db.patch(storefrontId, {
    sections,
    updatedAt: Date.now(),
  });
}

export async function reorderSections(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">,
  sectionIds: Array<string>
): Promise<void> {
  const storefront = await ctx.db.get(storefrontId);
  if (!storefront) throw new Error("Storefront not found");

  const sectionMap = new Map(
    storefront.sections.map((s) => [s.id, s])
  );

  const reorderedSections = sectionIds
    .map((id) => sectionMap.get(id))
    .filter((s): s is StorefrontSection => s !== undefined);

  await ctx.db.patch(storefrontId, {
    sections: reorderedSections,
    updatedAt: Date.now(),
  });
}

export async function toggleSectionVisibility(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">,
  sectionId: string,
  visible: boolean
): Promise<void> {
  const storefront = await ctx.db.get(storefrontId);
  if (!storefront) throw new Error("Storefront not found");

  const sections = storefront.sections.map((section) =>
    section.id === sectionId ? { ...section, visible } : section
  ) as Array<StorefrontSection>;

  await ctx.db.patch(storefrontId, {
    sections,
    updatedAt: Date.now(),
  });
}

export interface AddSectionData {
  type: StorefrontSection["type"];
  variant: string;
  afterSectionId?: string;
}

function generateSectionId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getDefaultContent(type: StorefrontSection["type"]): StorefrontSection["content"] {
  switch (type) {
    case "hero":
      return {
        headline: "Your Headline Here",
        subheadline: "Add your subheadline",
        ctaText: "Get Started",
        ctaLink: "/courses",
      };
    case "courses":
      return {
        title: "Our Courses",
        showPrice: true,
        showDuration: true,
        limit: 6,
        viewAllLink: true,
      };
    case "about":
      return {
        title: "About",
        showStats: true,
      };
    case "testimonials":
      return {
        title: "What Students Say",
        items: [],
      };
    case "faq":
      return {
        title: "Frequently Asked Questions",
        items: [],
      };
    case "cta":
      return {
        headline: "Ready to Start?",
        buttonText: "Join Now",
        buttonLink: "/courses",
        showWhatsApp: false,
      };
  }
}

export async function addSection(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">,
  data: AddSectionData
): Promise<void> {
  const storefront = await ctx.db.get(storefrontId);
  if (!storefront) throw new Error("Storefront not found");

  const newSection = {
    id: generateSectionId(),
    type: data.type,
    variant: data.variant,
    visible: true,
    content: getDefaultContent(data.type),
  } as StorefrontSection;

  let sections: Array<StorefrontSection>;

  if (data.afterSectionId) {
    const insertIndex = storefront.sections.findIndex(
      (s) => s.id === data.afterSectionId
    );
    if (insertIndex === -1) {
      sections = [...storefront.sections, newSection];
    } else {
      sections = [
        ...storefront.sections.slice(0, insertIndex + 1),
        newSection,
        ...storefront.sections.slice(insertIndex + 1),
      ];
    }
  } else {
    sections = [...storefront.sections, newSection];
  }

  await ctx.db.patch(storefrontId, {
    sections,
    updatedAt: Date.now(),
  });
}

export async function removeSection(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">,
  sectionId: string
): Promise<void> {
  const storefront = await ctx.db.get(storefrontId);
  if (!storefront) throw new Error("Storefront not found");

  const sections = storefront.sections.filter(
    (s) => s.id !== sectionId
  ) as Array<StorefrontSection>;

  await ctx.db.patch(storefrontId, {
    sections,
    updatedAt: Date.now(),
  });
}

export async function updateCssVariables(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">,
  cssVariables: Record<string, string>
): Promise<void> {
  await ctx.db.patch(storefrontId, {
    cssVariables,
    updatedAt: Date.now(),
  });
}

export async function remove(
  ctx: GenericMutationCtx<DataModel>,
  storefrontId: Id<"storefronts">
): Promise<void> {
  await ctx.db.delete(storefrontId);
}
