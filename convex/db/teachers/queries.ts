import { GenericQueryCtx } from "convex/server";
import { DataModel } from "../../_generated/dataModel";

export function getAll(ctx: GenericQueryCtx<DataModel>) {
  return ctx.db.query("teachers").collect();
}

export async function getByUserId(
  ctx: GenericQueryCtx<DataModel>,
  userId: string
) {
  const teacher = await ctx.db
    .query("teachers")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (!teacher) return null;

  const logoUrl = teacher.branding?.logoStorageId
    ? await ctx.storage.getUrl(teacher.branding.logoStorageId)
    : null;
  const coverUrl = teacher.branding?.coverStorageId
    ? await ctx.storage.getUrl(teacher.branding.coverStorageId)
    : null;

  return {
    ...teacher,
    branding: {
      ...teacher.branding,
      logoUrl,
      coverUrl,
    },
  };
}

export async function getBySubdomain(
  ctx: GenericQueryCtx<DataModel>,
  subdomain: string
) {
  const teacher = await ctx.db
    .query("teachers")
    .withIndex("by_subdomain", (q) => q.eq("subdomain", subdomain))
    .first();

  if (!teacher) return null;

  const logoUrl = teacher.branding?.logoStorageId
    ? await ctx.storage.getUrl(teacher.branding.logoStorageId)
    : null;
  const coverUrl = teacher.branding?.coverStorageId
    ? await ctx.storage.getUrl(teacher.branding.coverStorageId)
    : null;

  return {
    ...teacher,
    branding: {
      ...teacher.branding,
      logoUrl,
      coverUrl,
    },
  };
}

export async function getByCustomDomain(
  ctx: GenericQueryCtx<DataModel>,
  customDomain: string
) {
  const teacher = await ctx.db
    .query("teachers")
    .withIndex("by_customDomain", (q) => q.eq("customDomain", customDomain))
    .first();

  if (!teacher) return null;

  const logoUrl = teacher.branding?.logoStorageId
    ? await ctx.storage.getUrl(teacher.branding.logoStorageId)
    : null;
  const coverUrl = teacher.branding?.coverStorageId
    ? await ctx.storage.getUrl(teacher.branding.coverStorageId)
    : null;

  return {
    ...teacher,
    branding: {
      ...teacher.branding,
      logoUrl,
      coverUrl,
    },
  };
}

export async function isSubdomainAvailable(
  ctx: GenericQueryCtx<DataModel>,
  subdomain: string
): Promise<boolean> {
  const existing = await getBySubdomain(ctx, subdomain);
  return existing === null;
}

export async function isCustomDomainAvailable(
  ctx: GenericQueryCtx<DataModel>,
  customDomain: string
): Promise<boolean> {
  const existing = await getByCustomDomain(ctx, customDomain);
  return existing === null;
}
