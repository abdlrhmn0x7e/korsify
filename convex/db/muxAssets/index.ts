import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as muxAssetQueries from "./queries";
import * as muxAssetMutations from "./mutations";

export const muxAssetsTable = defineTable({
  // Ownership
  teacherId: v.id("teachers"),

  // Mux identifiers
  uploadId: v.string(), // From direct upload
  assetId: v.optional(v.string()), // Set when asset is created
  playbackId: v.optional(v.string()), // Set when ready

  // Status tracking
  status: v.union(
    v.literal("waiting_upload"), // Upload URL created, waiting for file
    v.literal("processing"), // Mux is processing
    v.literal("ready"), // Ready to play
    v.literal("errored"), // Failed
  ),

  // Metadata (populated from Mux webhook)
  duration: v.optional(v.number()), // seconds
  aspectRatio: v.optional(v.string()), // "16:9"

  // Error info
  errorMessage: v.optional(v.string()),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_uploadId", ["uploadId"])
  .index("by_assetId", ["assetId"])
  .index("by_teacherId", ["teacherId"]);

export const muxAssetsDAL = {
  queries: muxAssetQueries,
  mutations: muxAssetMutations,
};

