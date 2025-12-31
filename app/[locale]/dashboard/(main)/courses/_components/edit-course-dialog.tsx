"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toastManager } from "@/components/ui/toast";
import { CourseFormOnSubmit, slugify } from "./course-form-types";
import { CourseForm } from "./course-form";

type CourseWithThumbnail = Doc<"courses"> & { thumbnailUrl: string | null };

interface EditCourseDialogProps {
  course: CourseWithThumbnail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCourseDialog({
  course,
  open,
  onOpenChange,
}: EditCourseDialogProps) {
  const { mutateAsync: updateCourse, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.update),
    onSuccess: () => {
      toastManager.add({
        title: "Course updated",
        description: "Your course has been updated successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toastManager.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update course",
        type: "error",
      });
    },
  });

  const onSubmit: CourseFormOnSubmit = async (values, options) => {
    // Use the generated slug if user didn't provide one
    const finalSlug = values.slug || slugify(values.title);

    await updateCourse({
      courseId: course._id,
      title: values.title,
      slug: finalSlug,
      description: values.description,
      thumbnailStorageId: values.thumbnailStorageId as Id<"_storage">,
      pricing: {
        price: values.price,
        overridePrice: values.overridePrice,
      },
      seo:
        values.metaTitle || values.metaDescription
          ? {
              metaTitle: values.metaTitle || values.title,
              metaDescription: values.metaDescription || "",
            }
          : null,
    });

    options?.onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden">
        <CourseForm course={course} isPending={isPending} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

