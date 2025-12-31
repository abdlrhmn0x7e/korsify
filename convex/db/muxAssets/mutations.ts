import { DataModel, Id } from "../../_generated/dataModel";
import { GenericMutationCtx } from "convex/server";

export type MuxAssetStatus =
  | "waiting_upload"
  | "processing"
  | "ready"
  | "errored";

export type CreateMuxAssetData = {
  teacherId: Id<"teachers">;
  uploadId: string;
};

export async function create(
  ctx: GenericMutationCtx<DataModel>,
  data: CreateMuxAssetData,
): Promise<Id<"muxAssets">> {
  const now = Date.now();

  return ctx.db.insert("muxAssets", {
    teacherId: data.teacherId,
    uploadId: data.uploadId,
    status: "waiting_upload",
    updatedAt: now,
  });
}

export type UpdateMuxAssetStatusData = {
  status: MuxAssetStatus;
  assetId?: string;
  playbackId?: string;
  duration?: number;
  aspectRatio?: string;
  errorMessage?: string;
};

export async function updateStatus(
  ctx: GenericMutationCtx<DataModel>,
  muxAssetId: Id<"muxAssets">,
  data: UpdateMuxAssetStatusData,
) {
  return ctx.db.patch(muxAssetId, {
    status: data.status,
    ...(data.assetId !== undefined && { assetId: data.assetId }),
    ...(data.playbackId !== undefined && { playbackId: data.playbackId }),
    ...(data.duration !== undefined && { duration: data.duration }),
    ...(data.aspectRatio !== undefined && { aspectRatio: data.aspectRatio }),
    ...(data.errorMessage !== undefined && { errorMessage: data.errorMessage }),
    updatedAt: Date.now(),
  });
}

export async function remove(
  ctx: GenericMutationCtx<DataModel>,
  muxAssetId: Id<"muxAssets">,
) {
  return ctx.db.delete(muxAssetId);
}

