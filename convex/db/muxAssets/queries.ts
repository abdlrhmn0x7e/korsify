import { DataModel, Id } from "../../_generated/dataModel";
import { GenericQueryCtx } from "convex/server";

export async function getById(
  ctx: GenericQueryCtx<DataModel>,
  muxAssetId: Id<"muxAssets">,
) {
  return ctx.db.get(muxAssetId);
}

export async function getByUploadId(
  ctx: GenericQueryCtx<DataModel>,
  uploadId: string,
) {
  return ctx.db
    .query("muxAssets")
    .withIndex("by_uploadId", (q) => q.eq("uploadId", uploadId))
    .first();
}

export async function getByAssetId(
  ctx: GenericQueryCtx<DataModel>,
  assetId: string,
) {
  return ctx.db
    .query("muxAssets")
    .withIndex("by_assetId", (q) => q.eq("assetId", assetId))
    .first();
}

export async function getAllByTeacherId(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
) {
  return ctx.db
    .query("muxAssets")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .collect();
}

