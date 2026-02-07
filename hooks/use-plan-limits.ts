"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function usePlanLimits() {
  const planLimits = useQuery(api.teachers.subscriptions.queries.getPlanLimits);

  const isLoaded = planLimits !== undefined;
  const plan = planLimits?.plan ?? "free";
  const limits = planLimits?.limits;
  const usage = planLimits?.usage;

  const canCreateCourse =
    !isLoaded ||
    limits?.maxCourses === null ||
    (usage !== undefined && usage.courseCount < (limits?.maxCourses ?? 0));

  const canUseMuxHosting = limits?.canUseMuxHosting ?? false;

  return {
    isLoaded,
    plan,
    limits,
    usage,
    canCreateCourse,
    canUseMuxHosting,
  };
}
