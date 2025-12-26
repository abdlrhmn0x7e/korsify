import * as tokensQueries from "./queries";
import * as tokensMutations from "./mutations";

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tokensTable = defineTable({
  token: v.string(),
  user: v.nullable(
    v.object({
      id: v.string(),
      usedAt: v.number(),
    })
  ),
});
export const tokensDAL = { queries: tokensQueries, mutations: tokensMutations };
