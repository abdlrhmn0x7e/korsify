import { defineTable } from "convex/server";
import { v } from "convex/values";

import * as earlyAccessRequestsQueries from "./queries";
import * as earlyAccessRequestsMutations from "./mutations";

export const earlyAccessRequestsTable = defineTable({
  phoneNumber: v.string(),
});

export const earlyAccessRequestsDAL = {
  queries: earlyAccessRequestsQueries,
  mutations: earlyAccessRequestsMutations,
};
