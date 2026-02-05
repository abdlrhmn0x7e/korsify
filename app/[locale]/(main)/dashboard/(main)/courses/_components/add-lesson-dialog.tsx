"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

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
import { useScopedI18n } from "@/locales/client";

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
  const t = useScopedI18n("dashboard.courses.lessonForm");

  const { mutateAsync: createLesson, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.lessons.mutations.create),
    onSuccess: () => {
      toast.success(t("createSuccess.title"), {
        description: t("createSuccess.description"),
      });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(t("createError.title"), {
        description:
          error instanceof Error ? error.message : t("createError.description"),
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
      hosting: values.hosting as Doc<"lessons">["hosting"],
      pdfStorageIds: values.pdfStorageIds as Array<Id<"_storage">>,
    });

    options?.onSuccess?.();
  }

  const triggerButton = trigger ? (
    <span>{trigger}</span>
  ) : (
    <Button variant={variant} size="sm">
      <IconPlus className="size-4" />
      {t("buttons.add")}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerButton} />
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("addTitle")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75svh] pb-4 pe-4">
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
            {t("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            form="lesson-form"
            className="w-24"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : t("buttons.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
