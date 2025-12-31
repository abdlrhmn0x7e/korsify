"use client";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { CourseForm } from "./course-form";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { toastManager } from "@/components/ui/toast";
import { CourseFormOnSubmit, slugify } from "./course-form-types";
import { Id } from "@/convex/_generated/dataModel";
import { useDialog } from "@/hooks/use-dialog";

interface AddCourseDialogProps {
  variant?: "default" | "outline" | "ghost";
}

export function AddCourseDialog({ variant = "outline" }: AddCourseDialogProps) {
  const { props, dismiss } = useDialog();

  const { mutateAsync: createCourse, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.create),
    onSuccess: () => {
      toastManager.add({
        title: "Course created",
        description: "Your course has been created successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toastManager.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create course",
        type: "error",
      });
    },
  });

  const onSubmit: CourseFormOnSubmit = async (values, options) => {
    // Use the generated slug if user didn't provide one
    const finalSlug = values.slug || slugify(values.title);

    await createCourse({
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
    dismiss();
  };

  return (
    <Dialog {...props}>
      <DialogTrigger render={<Button variant={variant} />}>
        Add New Course
        <IconPlus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden">
        <CourseForm isPending={isPending} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
