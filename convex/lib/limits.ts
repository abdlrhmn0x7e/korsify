import { GenericQueryCtx } from "convex/server";
import { ConvexError } from "convex/values";
import { DataModel, Id } from "../_generated/dataModel";
import { db } from "../db";

// ---------------------------------------------------------------------------
// Plan types
// ---------------------------------------------------------------------------

/**
 * "free" = teacher has no active subscription row.
 * "pro"  = teacher has an active subscription.
 *
 * Add more plans here as needed (e.g. "business", "enterprise").
 */
const PLANS = ["free", "pro"] as const;
type Plan = (typeof PLANS)[number];

// ---------------------------------------------------------------------------
// Limits configuration  (single source of truth)
// ---------------------------------------------------------------------------

/**
 * Every key in PlanLimits is a capability / resource that can be constrained.
 * Adding a new limit is as simple as:
 *   1. Add the key + values here
 *   2. Add an `assert*` helper below
 *   3. Call it from the relevant mutation
 */
interface PlanLimits {
  /** Maximum number of courses a teacher can create. null = unlimited */
  maxCourses: number | null;
  /** Whether the teacher can use Mux (protected) video hosting */
  canUseMuxHosting: boolean;
}

const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxCourses: 3,
    canUseMuxHosting: false,
  },
  pro: {
    maxCourses: null,
    canUseMuxHosting: true,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export async function getTeacherPlan(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
): Promise<Plan> {
  const subscription = await db.subscriptions.queries.getByTeacherId(
    ctx,
    teacherId,
  );
  if (subscription && subscription.status === "active") {
    return "pro";
  }
  return "free";
}

export function getLimitsForPlan(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}

// ---------------------------------------------------------------------------
// Assertion helpers  (used inside mutations)
// ---------------------------------------------------------------------------

export async function assertCanCreateCourse(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
): Promise<void> {
  const plan = await getTeacherPlan(ctx, teacherId);
  const { maxCourses } = getLimitsForPlan(plan);

  if (maxCourses === null) return; // unlimited

  const courses = await ctx.db
    .query("courses")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .collect();

  if (courses.length >= maxCourses) {
    throw new ConvexError(
      `Free plan is limited to ${maxCourses} courses. Upgrade to create more.`,
    );
  }
}

export async function assertCanUseMuxHosting(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
): Promise<void> {
  const plan = await getTeacherPlan(ctx, teacherId);
  const { canUseMuxHosting } = getLimitsForPlan(plan);

  if (!canUseMuxHosting) {
    throw new ConvexError(
      "Free plan only supports YouTube video hosting. Upgrade to upload protected videos.",
    );
  }
}

// ---------------------------------------------------------------------------
// Query-friendly usage snapshot  (used by the UI to show limits reactively)
// ---------------------------------------------------------------------------

export interface PlanUsage {
  plan: Plan;
  limits: PlanLimits;
  usage: {
    courseCount: number;
  };
}

export async function getPlanUsage(
  ctx: GenericQueryCtx<DataModel>,
  teacherId: Id<"teachers">,
): Promise<PlanUsage> {
  const plan = await getTeacherPlan(ctx, teacherId);
  const limits = getLimitsForPlan(plan);

  const courses = await ctx.db
    .query("courses")
    .withIndex("by_teacherId", (q) => q.eq("teacherId", teacherId))
    .collect();

  return {
    plan,
    limits,
    usage: {
      courseCount: courses.length,
    },
  };
}
