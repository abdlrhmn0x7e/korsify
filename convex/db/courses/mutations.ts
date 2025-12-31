import { Infer } from "convex/values";
import {
  coursePricingValidator,
  courseSeoValidator,
  courseStatusValidator,
} from "./validators";
import { DataModel, Id } from "../../_generated/dataModel";
import { type JSONContent } from "@tiptap/react";
import { GenericMutationCtx } from "convex/server";

type Status = Infer<typeof courseStatusValidator>;
type Pricing = Infer<typeof coursePricingValidator>;
type Seo = Infer<typeof courseSeoValidator>;

export type CreateCourseData = {
  teacherId: Id<"teachers">;

  title: string;
  slug: string;
  description: JSONContent;
  thumbnailStorageId: Id<"_storage">;

  pricing: Pricing;

  seo: Seo | null;
};

export async function create(
  ctx: GenericMutationCtx<DataModel>,
  data: CreateCourseData,
): Promise<Id<"courses">> {
  const now = Date.now();

  return ctx.db.insert("courses", {
    teacherId: data.teacherId,

    title: data.title,
    slug: data.slug,
    description: data.description,
    thumbnailStorageId: data.thumbnailStorageId,

    pricing: data.pricing,

    seo: data.seo,

    status: "draft",

    publishedAt: null,
    updatedAt: now,
  });
}

export type UpdateCourseData = {
  title?: string;
  slug?: string;
  description?: JSONContent;
  thumbnailStorageId?: Id<"_storage">;

  pricing?: Pricing;

  seo?: Seo | null;
};

export async function update(
  ctx: GenericMutationCtx<DataModel>,
  courseId: Id<"courses">,
  data: UpdateCourseData,
) {
  return ctx.db.patch("courses", courseId, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function updateStatus(
  ctx: GenericMutationCtx<DataModel>,
  courseId: Id<"courses">,
  status: Status,
) {
  const now = Date.now();

  return ctx.db.patch("courses", courseId, {
    status,
    publishedAt: status === "published" ? now : null,
    updatedAt: now,
  });
}

export function remove(
  ctx: GenericMutationCtx<DataModel>,
  courseId: Id<"courses">,
) {
  return ctx.db.delete("courses", courseId);
}
