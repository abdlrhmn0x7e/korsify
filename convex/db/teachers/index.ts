import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as teachersQueries from "./queries";
import * as teachersMutations from "./mutations";
import {
  brandingValidator,
  paymentInfoValidator,
  teacherStatusValidator,
} from "./validators";
export {
  brandingValidator,
  paymentInfoValidator,
  teacherStatusValidator,
} from "./validators";

export const teachersTable = defineTable({
  userId: v.string(),
  name: v.string(),
  phone: v.optional(v.string()),
  email: v.string(),
  subdomain: v.string(),
  customDomain: v.optional(v.string()),
  customDomainVerified: v.optional(v.boolean()),
  branding: v.optional(brandingValidator),
  paymentInfo: v.optional(paymentInfoValidator),
  status: teacherStatusValidator,
  updatedAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_subdomain", ["subdomain"])
  .index("by_customDomain", ["customDomain"]);

export const teachersDAL = {
  queries: teachersQueries,
  mutations: teachersMutations,
};
