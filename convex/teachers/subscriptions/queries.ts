import { db } from "../../db";
import { teacherQuery } from "../../utils";

export const get = teacherQuery({
  args: {},
  handler: async (ctx) => {
    return db.subscriptions.queries.getByTeacherId(ctx, ctx.teacherId);
  },
});
