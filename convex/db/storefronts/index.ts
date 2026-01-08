import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as storefrontsQueries from "./queries";
import * as storefrontsMutations from "./mutations";
import {
  storefrontSectionValidator,
  storefrontStyleValidator,
  storefrontThemeValidator,
} from "./validators";

export {
  storefrontSectionValidator,
  storefrontStyleValidator,
  storefrontThemeValidator,
} from "./validators";

export const storefrontsTable = defineTable({
  teacherId: v.id("teachers"),
  theme: storefrontThemeValidator,
  style: storefrontStyleValidator,
  sections: v.array(storefrontSectionValidator),
  cssVariables: v.optional(v.record(v.string(), v.string())),
  updatedAt: v.number(),
}).index("by_teacherId", ["teacherId"]);

export const storefrontsDAL = {
  queries: storefrontsQueries,
  mutations: storefrontsMutations,
};
