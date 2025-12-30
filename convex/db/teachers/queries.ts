import { GenericQueryCtx } from "convex/server";
import { DataModel } from "../../_generated/dataModel";

export function getAll(ctx: GenericQueryCtx<DataModel>) {
  return ctx.db.query("teachers").collect();
}

export function getByUserId(ctx: GenericQueryCtx<DataModel>, userId: string) {
  return ctx.db
    .query("teachers")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}

export function getBySubdomain(
  ctx: GenericQueryCtx<DataModel>,
  subdomain: string,
) {
  return ctx.db
    .query("teachers")
    .withIndex("by_subdomain", (q) => q.eq("subdomain", subdomain))
    .first();
}

export function getByCustomDomain(
  ctx: GenericQueryCtx<DataModel>,
  customDomain: string,
) {
  return ctx.db
    .query("teachers")
    .withIndex("by_customDomain", (q) => q.eq("customDomain", customDomain))
    .first();
}

export async function isSubdomainAvailable(
  ctx: GenericQueryCtx<DataModel>,
  subdomain: string,
): Promise<boolean> {
  const existing = await getBySubdomain(ctx, subdomain);
  return existing === null;
}

export async function isCustomDomainAvailable(
  ctx: GenericQueryCtx<DataModel>,
  customDomain: string,
): Promise<boolean> {
  const existing = await getByCustomDomain(ctx, customDomain);
  return existing === null;
}
