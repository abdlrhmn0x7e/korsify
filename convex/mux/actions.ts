"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import Mux from "@mux/mux-node";
import jwt from "jsonwebtoken";

const DEFAULT_TOKEN_EXPIRY_SECONDS = 3600;

function getMuxClient() {
  return new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });
}

type CreateDirectUploadResult = {
  uploadUrl: string;
  uploadId: string;
  muxAssetId: Id<"muxAssets">;
};

export const createDirectUpload = action({
  args: {
    teacherId: v.id("teachers"),
  },
  returns: v.object({
    uploadUrl: v.string(),
    uploadId: v.string(),
    muxAssetId: v.id("muxAssets"),
  }),
  handler: async (ctx, args): Promise<CreateDirectUploadResult> => {
    const mux = getMuxClient();

    const upload = await mux.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_SITE_URL || "*",
      new_asset_settings: {
        playback_policy: ["signed"],
        encoding_tier: "baseline",
      },
    });

    const muxAssetId: Id<"muxAssets"> = await ctx.runMutation(
      api.mux.internal.createAsset,
      {
        teacherId: args.teacherId,
        uploadId: upload.id,
      }
    );

    return {
      uploadUrl: upload.url,
      uploadId: upload.id,
      muxAssetId,
    };
  },
});

export const getSignedPlaybackToken = action({
  args: {
    playbackId: v.string(),
    expiresInSeconds: v.optional(v.number()),
  },
  returns: v.object({
    token: v.string(),
  }),
  handler: async (_, args) => {
    const keyId = process.env.MUX_SIGNING_KEY_ID;
    const keySecret = process.env.MUX_SIGNING_KEY_PRIVATE;

    if (!keyId || !keySecret) {
      throw new Error(
        "MUX_SIGNING_KEY_ID and MUX_SIGNING_KEY_PRIVATE must be set"
      );
    }

    const privateKey = Buffer.from(keySecret, "base64").toString("ascii");
    const expiresIn = args.expiresInSeconds ?? DEFAULT_TOKEN_EXPIRY_SECONDS;

    const token = jwt.sign(
      {
        sub: args.playbackId,
        aud: "v",
        exp: Math.floor(Date.now() / 1000) + expiresIn,
        kid: keyId,
      },
      privateKey,
      { algorithm: "RS256" }
    );

    return { token };
  },
});

export const deleteAsset = action({
  args: {
    muxAssetId: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (_, args) => {
    const mux = getMuxClient();

    try {
      await mux.video.assets.delete(args.muxAssetId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete Mux asset:", error);
      return { success: false, error: String(error) };
    }
  },
});
