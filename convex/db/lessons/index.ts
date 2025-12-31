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
  pdfStorageId: v.nullable(v.id("_storage")),

  videoId: v.id("muxAssets"),

  order: v.number(),
  isFree: v.boolean(),

  updatedAt: v.number(),
})
  .index("by_sectionId_order", ["sectionId", "order"])
  .index("by_courseId", ["courseId"]);

export const lessonsDAL = {
  queries: lessonQueries,
  mutations: lessonMutations,
};
