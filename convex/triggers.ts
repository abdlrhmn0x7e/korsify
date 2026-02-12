import { Triggers } from "convex-helpers/server/triggers";
import { DataModel, Id } from "./_generated/dataModel";
import { recalculateBilling } from "./teachers/subscriptions/internal";
import { internal } from "./_generated/api";

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

const scheduledBilling: Record<Id<"teachers">, Id<"_scheduled_functions">> = {};
const scheduledMuxCleanup: Record<
  Id<"teachers">,
  Id<"_scheduled_functions">
> = {};

const MUX_CLEANUP_GRACE_DAYS = Number(
  process.env.MUX_CLEANUP_GRACE_DAYS ?? "30"
);
const MUX_CLEANUP_GRACE_MS = MUX_CLEANUP_GRACE_DAYS * 24 * 60 * 60 * 1000;

// When a subscription is created, recalculate billing for the teacher
triggers.register("subscriptions", async (ctx, change) => {
  const newDoc = change.newDoc;
  const oldDoc = change.oldDoc;
  const teacherId = newDoc?.teacherId ?? oldDoc?.teacherId;
  if (!teacherId) return;

  if (change.operation === "insert" && newDoc) {
    if (scheduledBilling[newDoc.teacherId]) {
      await ctx.scheduler.cancel(scheduledBilling[newDoc.teacherId]);
    }

    const id = await recalculateBilling(ctx, newDoc.teacherId);
    if (id) {
      scheduledBilling[newDoc.teacherId] = id;
    }
  }

  const becameInactive =
    oldDoc !== null &&
    oldDoc !== undefined &&
    newDoc !== null &&
    newDoc !== undefined &&
    oldDoc.status === "active" &&
    newDoc.status === "inactive";
  const wasDeleted = Boolean(oldDoc) && !newDoc;
  const becameActive =
    oldDoc !== null &&
    oldDoc !== undefined &&
    newDoc !== null &&
    newDoc !== undefined &&
    oldDoc.status === "inactive" &&
    newDoc.status === "active";

  if (becameActive && scheduledMuxCleanup[teacherId]) {
    await ctx.scheduler.cancel(scheduledMuxCleanup[teacherId]);
    delete scheduledMuxCleanup[teacherId];
  }

  if (!becameInactive && !wasDeleted) return;

  if (scheduledMuxCleanup[teacherId]) {
    await ctx.scheduler.cancel(scheduledMuxCleanup[teacherId]);
  }

  const scheduledId = await ctx.scheduler.runAfter(
    MUX_CLEANUP_GRACE_MS,
    internal.teachers.actions.cleanupInactive,
    {
      teacherId,
    }
  );
  scheduledMuxCleanup[teacherId] = scheduledId;

  if (wasDeleted) {
    console.log(
      `[Mux Cleanup] Scheduled after subscription deletion for teacher=${teacherId} in ${MUX_CLEANUP_GRACE_DAYS} day(s)`
    );
  } else {
    console.log(
      `[Mux Cleanup] Scheduled after subscription became inactive for teacher=${teacherId} in ${MUX_CLEANUP_GRACE_DAYS} day(s)`
    );
  }
});

// When a lesson is created or deleted, recalculate billing for the teacher
triggers.register("lessons", async (ctx, change) => {
  const doc = change.newDoc ?? change.oldDoc;
  if (!doc || doc.hosting.type !== "mux") return;

  if (scheduledBilling[doc.teacherId]) {
    await ctx.scheduler.cancel(scheduledBilling[doc.teacherId]);
  }

  const id = await recalculateBilling(ctx, doc.teacherId);
  if (id) {
    scheduledBilling[doc.teacherId] = id;
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

  if (scheduledBilling[doc.teacherId]) {
    await ctx.scheduler.cancel(scheduledBilling[doc.teacherId]);
  }

  const id = await recalculateBilling(ctx, doc.teacherId);
  if (id) {
    scheduledBilling[doc.teacherId] = id;
  }
});
