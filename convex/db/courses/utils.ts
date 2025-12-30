import { GenericQueryCtx } from "convex/server";
import { DataModel, Doc } from "../../_generated/dataModel";

type CourseWithThumbnail = Doc<"courses"> & { thumbnailUrl: string | null };

export async function attachThumbnailURL(
  ctx: GenericQueryCtx<DataModel>,
  data: Doc<"courses">[],
): Promise<CourseWithThumbnail[]>;
export async function attachThumbnailURL(
  ctx: GenericQueryCtx<DataModel>,
  data: Doc<"courses"> | null,
): Promise<CourseWithThumbnail | null>;

export async function attachThumbnailURL(
  ctx: GenericQueryCtx<DataModel>,
  data: Doc<"courses"> | Doc<"courses">[] | null,
): Promise<CourseWithThumbnail | CourseWithThumbnail[] | null> {
  if (data === null) return null;

  if (Array.isArray(data)) {
    return Promise.all(
      data.map(async (course) => ({
        ...course,
        thumbnailUrl: await ctx.storage.getUrl(course.thumbnailStorageId),
      })),
    );
  }

  return {
    ...data,
    thumbnailUrl: await ctx.storage.getUrl(data.thumbnailStorageId),
  };
}
