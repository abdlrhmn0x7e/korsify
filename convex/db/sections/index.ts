import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as sectionQueries from "./queries";
import * as sectionMutations from "./mutations";
import { sectionStatusValidator } from "./validators";

export const sectionsTable = defineTable({
  courseId: v.id("courses"),
  teacherId: v.id("teachers"),

  title: v.string(),
  order: v.number(),
  status: sectionStatusValidator,

  updatedAt: v.number(),
}).index("by_courseId_order", ["courseId", "order"]);

export const sectionsDAL = {
  queries: sectionQueries,
  mutations: sectionMutations,
};
