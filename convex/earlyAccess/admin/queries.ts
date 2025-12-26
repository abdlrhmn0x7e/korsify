import { query } from "../../_generated/server";
import { authComponent } from "../../auth";
import { db } from "../../db";

export const getTokens = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await db.tokens.queries.get(ctx);
  },
});
