"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { LessonForm } from "./lesson-form";
import type { LessonFormValues } from "./lesson-form-types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      pdfStorageIds: values.pdfStorageIds as Array<Id<"_storage">>,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerButton} />
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75svh] pb-4 pe-4 ps-1">
          <LessonForm
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="lesson-form" disabled={isPending}>
            {isPending ? <Spinner /> : "Add Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
