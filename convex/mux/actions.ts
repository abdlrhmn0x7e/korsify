"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import Mux from "@mux/mux-node";
import jwt from "jsonwebtoken";

const getMuxClient = () => {
  return new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });
};

type CreateDirectUploadResult = {
  uploadUrl: string;
  uploadId: string;
  muxAssetId: Id<"muxAssets">;
};

/**
 * Creates a direct upload URL for uploading videos to Mux.
 * The upload uses signed playback policy for secure video delivery.
 */
export const createDirectUpload = action({
  args: {
    teacherId: v.id("teachers"),
  },
  handler: async (ctx, args): Promise<CreateDirectUploadResult> => {
    const mux = getMuxClient();

    // Create upload with SIGNED playback policy for secure streaming
    const upload = await mux.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_SITE_URL || "*",
      new_asset_settings: {
        playback_policy: ["signed"], // Requires signed tokens to play
        encoding_tier: "baseline",
      },
    });

    // Create muxAsset record in database
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

type GetSignedPlaybackTokenResult = {
  token: string;
};

/**
 * Generates a signed JWT token for secure video playback.
 * This token must be passed to the Mux Player for signed playback IDs.
 */
export const getSignedPlaybackToken = action({
  args: {
    playbackId: v.string(),
    expiresInSeconds: v.optional(v.number()), // Default 1 hour
  },
  handler: async (_, args): Promise<GetSignedPlaybackTokenResult> => {
    const keyId = process.env.MUX_SIGNING_KEY_ID;
    const keySecret = process.env.MUX_SIGNING_KEY_PRIVATE;

    if (!keyId || !keySecret) {
      throw new Error(
        "MUX_SIGNING_KEY_ID and MUX_SIGNING_KEY_PRIVATE must be set for signed playback"
      );
    }

    // Decode the base64 private key
    const privateKey = Buffer.from(keySecret, "base64").toString("ascii");

    const expiresIn = args.expiresInSeconds || 3600; // 1 hour default

    // Create JWT token for Mux signed playback
    const token = jwt.sign(
      {
        sub: args.playbackId,
        aud: "v", // "v" for video
        exp: Math.floor(Date.now() / 1000) + expiresIn,
        kid: keyId,
      },
      privateKey,
      { algorithm: "RS256" }
    );

    return { token };
  },
});

type DeleteAssetResult = {
  success: boolean;
  error?: string;
};

/**
 * Deletes an asset from Mux.
 * Should be called when removing a video from a lesson.
 */
export const deleteAsset = action({
  args: {
    muxAssetId: v.string(),
  },
  handler: async (_, args): Promise<DeleteAssetResult> => {
    const mux = getMuxClient();

    try {
      await mux.video.assets.delete(args.muxAssetId);
      return { success: true };
    } catch (error) {
      // Asset might already be deleted or not exist
      console.error("Failed to delete Mux asset:", error);
      return { success: false, error: String(error) };
    }
  },
});
