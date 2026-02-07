import { db } from "../../db";
import { teacherQuery } from "../../utils";
import { getPlanUsage } from "../../lib/limits";

export const get = teacherQuery({
  args: {},
  handler: async (ctx) => {
    return db.subscriptions.queries.getByTeacherId(ctx, ctx.teacherId);
  },
});

export const getPlanLimits = teacherQuery({
  args: {},
  handler: async (ctx) => {
    return getPlanUsage(ctx, ctx.teacherId);
  },
});
