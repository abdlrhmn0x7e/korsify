import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as lessonQueries from "./queries";
import * as lessonMutations from "./mutations";

export const lessonsTable = defineTable({
  courseId: v.id("courses"),
  sectionId: v.id("sections"),
  teacherId: v.id("teachers"),

  title: v.string(),
  description: v.nullable(v.any()),
  pdfStorageIds: v.array(v.id("_storage")),

  hosting: v.union(
    v.object({
      type: v.literal("mux"),
      videoId: v.id("muxAssets"),
    }),
    v.object({
      type: v.literal("youtube"),
      youtubeUrl: v.string(),
    })
  ),

  order: v.number(),
  updatedAt: v.number(),
})
  .index("by_sectionId_order", ["sectionId", "order"])
  .index("by_courseId", ["courseId"]);

export const lessonsDAL = {
  queries: lessonQueries,
  mutations: lessonMutations,
};
