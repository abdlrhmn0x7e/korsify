import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as teachersQueries from "./queries";
import * as teachersMutations from "./mutations";
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
  branding: v.optional(
    v.object({
      logoUrl: v.optional(v.string()),
      coverImageUrl: v.optional(v.string()),
      primaryColor: v.optional(v.string()),
    })
  ),
  paymentInfo: v.optional(
    v.object({
      vodafoneCash: v.optional(v.string()),
      instaPay: v.optional(v.string()),
      instructions: v.optional(v.string()),
    })
  ),
  status: v.union(v.literal("pending"), v.literal("active"), v.literal("suspended")),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_subdomain", ["subdomain"])
  .index("by_customDomain", ["customDomain"]);

export const teachersDAL = {
  queries: teachersQueries,
  mutations: teachersMutations,
};
