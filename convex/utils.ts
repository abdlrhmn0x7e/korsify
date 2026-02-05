import {
  customQuery,
  customCtx,
  customMutation,
  CustomCtx,
} from "convex-helpers/server/customFunctions";
import {
  mutation as rawMutation,
  internalMutation as rawInternalMutation,
  query,
} from "./_generated/server";
import { authComponent } from "./auth";
import { ConvexError } from "convex/values";
import { db } from "./db";
import { triggers } from "./triggers";

// Wrap mutations with triggers for cascading deletes
const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB)
);

export const adminQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new ConvexError("Unauthorized");
    }

    return { user }; // Injected into the function's ctx
  })
);

export const adminMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new ConvexError("Unauthorized");
    }

    return { user }; // Injected into the function's ctx
  })
);

export const teacherQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);

    if (!teacher) {
      throw new ConvexError("Unauthorized");
    }

    return { teacherId: teacher._id };
  })
);

export const teacherMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const teacher = await db.teachers.queries.getByUserId(ctx, user._id);

    if (!teacher) {
      throw new ConvexError("Unauthorized");
    }

    return { teacherId: teacher._id };
  })
);

export type AdminQueryCtx = CustomCtx<typeof adminQuery>;
export type AdminMutationCtx = CustomCtx<typeof adminMutation>;

export type TeacherQueryCtx = CustomCtx<typeof teacherQuery>;
export type TeacherMutationCtx = CustomCtx<typeof teacherMutation>;
