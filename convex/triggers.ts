import { Triggers } from "convex-helpers/server/triggers";
import { DataModel, Id } from "./_generated/dataModel";
import { recalculateBilling } from "./teachers/subscriptions/internal";

export const triggers = new Triggers<DataModel>();

// When a course is deleted, delete all its sections
// (sections trigger will then cascade delete lessons)
triggers.register("courses", async (ctx, change) => {
  if (change.oldDoc && !change.newDoc) {
    // Course was deleted - delete all sections
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_courseId_order", (q) => q.eq("courseId", change.id))
      .collect();

    await Promise.all(sections.map((section) => ctx.db.delete(section._id)));
  }
});

// When a section is deleted, delete all its lessons
triggers.register("sections", async (ctx, change) => {
  if (change.oldDoc && !change.newDoc) {
    // Section was deleted - delete all lessons
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_sectionId_order", (q) => q.eq("sectionId", change.id))
      .collect();

    await Promise.all(lessons.map((lesson) => ctx.db.delete(lesson._id)));
  }
});

const scheduled: Record<Id<"teachers">, Id<"_scheduled_functions">> = {};

// When a subscription is created, recalculate billing for the teacher
triggers.register("subscriptions", async (ctx, change) => {
  if (change.operation !== "insert") return;

  const doc = change.newDoc;
  if (scheduled[doc.teacherId]) {
    await ctx.scheduler.cancel(scheduled[doc.teacherId]);
  }

  const id = await recalculateBilling(ctx, doc.teacherId);
  if (id) {
    scheduled[doc.teacherId] = id;
  }
});

// When a lesson is created or deleted, recalculate billing for the teacher
triggers.register("lessons", async (ctx, change) => {
  const doc = change.newDoc ?? change.oldDoc;
  if (!doc || doc.hosting.type !== "mux") return;

  if (scheduled[doc.teacherId]) {
    await ctx.scheduler.cancel(scheduled[doc.teacherId]);
  }

  const id = await recalculateBilling(ctx, doc.teacherId);
  if (id) {
    scheduled[doc.teacherId] = id;
  }
});

// When a muxAsset's duration changes (e.g. video becomes ready),
// recalculate billing for the teacher
triggers.register("muxAssets", async (ctx, change) => {
  const oldDuration = change.oldDoc?.duration;
  const newDuration = change.newDoc?.duration;
  if (oldDuration === newDuration) return; // no duration change
  const doc = change.newDoc ?? change.oldDoc;
  if (!doc) return;

  if (scheduled[doc.teacherId]) {
    await ctx.scheduler.cancel(scheduled[doc.teacherId]);
  }

  const id = await recalculateBilling(ctx, doc.teacherId);
  if (id) {
    scheduled[doc.teacherId] = id;
  }
});
