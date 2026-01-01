"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

import { Button } from "@/components/ui/button";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
  DrawerDialogBody,
} from "@/components/ui/drawer-dialog";
import { toastManager } from "@/components/ui/toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { LessonForm } from "./lesson-form";
import type { LessonFormValues } from "./lesson-form-types";

interface AddLessonDialogProps {
  sectionId: Id<"sections">;
  courseId: Id<"courses">;
  trigger?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
}

export function AddLessonDialog({
  sectionId,
  courseId,
  trigger,
  variant = "outline",
}: AddLessonDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createLesson, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.lessons.mutations.create),
    onSuccess: () => {
      toastManager.add({
        title: "Lesson created",
        description: "Your lesson has been created successfully.",
        type: "success",
      });
      setOpen(false);
    },
    onError: (error) => {
      toastManager.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create lesson",
        type: "error",
      });
    },
  });

  async function handleSubmit(
    values: LessonFormValues,
    options?: { onSuccess?: () => void }
  ) {
    await createLesson({
      courseId,
      sectionId,
      title: values.title,
      description: values.description,
      videoId: values.videoId as Id<"muxAssets">,
      pdfStorageId: values.pdfStorageId as Id<"_storage"> | undefined,
      isFree: values.isFree,
    });

    options?.onSuccess?.();
  }

  const triggerButton = trigger ? (
    <span>{trigger}</span>
  ) : (
    <Button variant={variant} size="sm">
      <IconPlus className="size-4" />
      Add Lesson
    </Button>
  );

  return (
    <DrawerDialog open={open} onOpenChange={setOpen} nested>
      <DrawerDialogTrigger render={triggerButton} />
      <DrawerDialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DrawerDialogHeader>
          <DrawerDialogTitle>Add New Lesson</DrawerDialogTitle>
        </DrawerDialogHeader>
        <DrawerDialogBody className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <LessonForm
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DrawerDialogBody>
      </DrawerDialogContent>
    </DrawerDialog>
  );
}
