import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const adminQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return { user }; // Injected into the function's ctx
  })
);

export const adminMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return { user }; // Injected into the function's ctx
  })
);
