import { adminQuery } from "../../utils";
import { db } from "../../db";

export const getAll = adminQuery({
  args: {},
  handler: async (ctx) => {
    return await db.earlyAccessRequests.queries.getAll(ctx);
  },
});
