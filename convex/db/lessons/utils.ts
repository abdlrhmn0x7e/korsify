import { GenericQueryCtx } from "convex/server";
import { DataModel, Doc } from "../../_generated/dataModel";

type LessonWithUrls = Doc<"lessons"> & {
  pdfUrls: Array<string>;
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

  async function resolvePdfUrls(pdfStorageIds: Array<Doc<"lessons">["pdfStorageIds"][number]>): Promise<Array<string>> {
    const urls = await Promise.all(
      pdfStorageIds.map((id) => ctx.storage.getUrl(id))
    );
    return urls.filter((url): url is string => url !== null);
  }

  if (Array.isArray(data)) {
    return Promise.all(
      data.map(async (lesson) => ({
        ...lesson,
        pdfUrls: await resolvePdfUrls(lesson.pdfStorageIds),
      })),
    );
  }

  return {
    ...data,
    pdfUrls: await resolvePdfUrls(data.pdfStorageIds),
  };
}
