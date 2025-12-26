import * as accessTokensQueries from "./queries";
import * as accessTokensMutations from "./mutations";

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const accessTokensTable = defineTable({
  token: v.string(),
  user: v.nullable(
    v.object({
      id: v.string(),
      usedAt: v.number(),
    })
  ),
});
export const accessTokensDAL = {
  queries: accessTokensQueries,
  mutations: accessTokensMutations,
};
