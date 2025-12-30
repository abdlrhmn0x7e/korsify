import { Triggers } from "convex-helpers/server/triggers";
import { DataModel } from "./_generated/dataModel";

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

