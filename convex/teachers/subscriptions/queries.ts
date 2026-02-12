import { Id } from "../../_generated/dataModel";
import { db } from "../../db";
import { teacherQuery } from "../../utils";
import { getPlanUsage } from "../../lib/limits";
import { BASE_AMOUNT_CENTS } from "../../lib/billing";
import { v } from "convex/values";
import { internalQuery } from "../../_generated/server";

export const getByTeacherId = internalQuery({
  args: {
    teacherId: v.id("teachers"),
  },
  handler: async (ctx, args) => {
    return db.subscriptions.queries.getByTeacherId(ctx, args.teacherId);
  },
});

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

export const getBillingBreakdown = teacherQuery({
  args: {},
  handler: async (ctx) => {
    const subscription = await db.subscriptions.queries.getByTeacherId(
      ctx,
      ctx.teacherId
    );

    if (!subscription) {
      return null;
    }

    // Get all lessons for this teacher
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_teacherId", (q) => q.eq("teacherId", ctx.teacherId))
      .collect();

    // Group mux-hosted lessons by course, summing durations
    const courseMap = new Map<Id<"courses">, { totalSeconds: number }>();

    for (const lesson of lessons) {
      if (lesson.hosting.type === "mux") {
        const asset = await ctx.db.get(lesson.hosting.videoId);
        const duration = asset?.duration ?? 0;

        const existing = courseMap.get(lesson.courseId);
        if (existing) {
          existing.totalSeconds += duration;
        } else {
          courseMap.set(lesson.courseId, { totalSeconds: duration });
        }
      }
    }

    // Calculate total seconds across all courses first (matching recalculateBilling)
    let totalSeconds = 0;
    for (const { totalSeconds: courseSeconds } of courseMap.values()) {
      totalSeconds += courseSeconds;
    }

    // Round once to get total minutes (matching recalculateBilling)
    const totalMinutes = Math.ceil(totalSeconds / 60);

    // Build per-course breakdown with proportional distribution
    const courses: Array<{
      courseId: Id<"courses">;
      courseTitle: string;
      totalMinutes: number;
      amountCents: number;
    }> = [];

    // Distribute minutes proportionally across courses
    const courseEntries = Array.from(courseMap.entries());
    let distributedMinutes = 0;

    for (let i = 0; i < courseEntries.length; i++) {
      const [courseId, { totalSeconds: courseSeconds }] = courseEntries[i];
      const course = await ctx.db.get(courseId);

      // Calculate proportional minutes
      let courseMinutes: number;
      if (i === courseEntries.length - 1) {
        // Last course gets the remainder to ensure sum equals totalMinutes
        courseMinutes = totalMinutes - distributedMinutes;
      } else {
        // Calculate proportionally and round
        courseMinutes = Math.round(
          (courseSeconds / totalSeconds) * totalMinutes
        );
        distributedMinutes += courseMinutes;
      }

      courses.push({
        courseId,
        courseTitle: course?.title ?? "Untitled Course",
        totalMinutes: courseMinutes,
        amountCents: courseMinutes * 100, // 1 EGP per minute
      });
    }

    return {
      courses,
      base: BASE_AMOUNT_CENTS,
      totalAmountCents: subscription.amountCents,
    };
  },
});
