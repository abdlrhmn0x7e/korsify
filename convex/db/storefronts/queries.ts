import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../../_generated/dataModel";

export async function getByTeacherId(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">
) {
  const storefront = await ctx.db
    .query("storefronts")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .first();

  if (!storefront) return null;

  const sectionsWithUrls = await Promise.all(
    storefront.sections.map(async (section) => {
      if (section.type === "hero" && section.content.backgroundImageStorageId) {
        const url = await ctx.storage.getUrl(
          section.content.backgroundImageStorageId
        );
        return {
          ...section,
          content: { ...section.content, backgroundImageUrl: url },
        };
      }
      if (section.type === "about" && section.content.imageStorageId) {
        const url = await ctx.storage.getUrl(section.content.imageStorageId);
        return {
          ...section,
          content: { ...section.content, imageUrl: url },
        };
      }
      if (section.type === "cta" && section.content.backgroundImageStorageId) {
        const url = await ctx.storage.getUrl(
          section.content.backgroundImageStorageId
        );
        return {
          ...section,
          content: { ...section.content, backgroundImageUrl: url },
        };
      }
      if (section.type === "testimonials") {
        const itemsWithUrls = await Promise.all(
          section.content.items.map(async (item) => {
            if (item.avatarStorageId) {
              const avatarUrl = await ctx.storage.getUrl(item.avatarStorageId);
              return { ...item, avatarUrl };
            }
            return item;
          })
        );
        return {
          ...section,
          content: { ...section.content, items: itemsWithUrls },
        };
      }
      return section;
    })
  );

  return {
    ...storefront,
    sections: sectionsWithUrls,
  };
}

export async function getById(
  ctx: GenericQueryCtx<DataModel>,
  storefrontId: Id<"storefronts">
) {
  return ctx.db.get(storefrontId);
}

export async function existsForTeacher(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">
): Promise<boolean> {
  const storefront = await ctx.db
    .query("storefronts")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .first();
  return storefront !== null;
}
