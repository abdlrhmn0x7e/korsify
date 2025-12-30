import { GenericQueryCtx } from "convex/server";
import { DataModel, Doc } from "../../_generated/dataModel";

type LessonWithUrls = Doc<"lessons"> & {
  pdfUrl: string | null;
};

export async function attachMediaURLs(
  ctx: GenericQueryCtx<DataModel>,
  data: Doc<"lessons">[],
): Promise<LessonWithUrls[]>;
export async function attachMediaURLs(
  ctx: GenericQueryCtx<DataModel>,
  data: Doc<"lessons"> | null,
): Promise<LessonWithUrls | null>;

export async function attachMediaURLs(
  ctx: GenericQueryCtx<DataModel>,
  data: Doc<"lessons"> | Doc<"lessons">[] | null,
): Promise<LessonWithUrls | LessonWithUrls[] | null> {
  if (data === null) return null;

  if (Array.isArray(data)) {
    return Promise.all(
      data.map(async (lesson) => ({
        ...lesson,
        pdfUrl: lesson.pdfStorageId
          ? await ctx.storage.getUrl(lesson.pdfStorageId)
          : null,
      })),
    );
  }

  return {
    ...data,
    pdfUrl: data.pdfStorageId
      ? await ctx.storage.getUrl(data.pdfStorageId)
      : null,
  };
}
