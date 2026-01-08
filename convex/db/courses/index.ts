import { defineTable } from "convex/server";
import { v } from "convex/values";
import {
  coursePricingValidator,
  courseSeoValidator,
  courseStatusValidator,
} from "./validators";

import * as courseQueries from "./queries";
import * as courseMutations from "./mutations";

// very basic, will probably need more idk
export const coursesTable = defineTable({
  teacherId: v.id("teachers"),

  title: v.string(),
  slug: v.string(),
  description: v.any(), //tiptap json
  thumbnailStorageId: v.id("_storage"),

  pricing: coursePricingValidator,

  seo: v.nullable(courseSeoValidator),

  status: courseStatusValidator,

  publishedAt: v.nullable(v.number()),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_teacherId", ["teacherId"])
  .index("by_teacherId_status", ["teacherId", "status"]);

export const coursesDAL = {
  queries: courseQueries,
  mutations: courseMutations,
};
