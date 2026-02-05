"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";
import { LessonForm } from "./lesson-form";
import type { LessonFormValues } from "./lesson-form-types";

interface EditLessonDialogProps {
  lesson: Doc<"lessons">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLessonDialog({
  lesson,
  open,
  onOpenChange,
}: EditLessonDialogProps) {
  const t = useScopedI18n("dashboard.courses.lessonForm");

  const { mutateAsync: updateLesson, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.lessons.mutations.update),
    onSuccess: () => {
      toast.success(t("updateSuccess.title"), {
        description: t("updateSuccess.description"),
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(t("updateError.title"), {
        description:
          error instanceof Error ? error.message : t("updateError.description"),
      });
    },
  });

  async function handleSubmit(
    values: LessonFormValues,
    options?: { onSuccess?: () => void }
  ) {
    await updateLesson({
      lessonId: lesson._id,
      title: values.title,
      description: values.description,
      hosting: values.hosting as Doc<"lessons">["hosting"],
      pdfStorageIds: values.pdfStorageIds as Array<Id<"_storage">>,
    });

    options?.onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("editTitle")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75svh] pb-4 pe-4">
          <LessonForm
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            defaultValues={{
              title: lesson.title,
              description: lesson.description,
              hosting: lesson.hosting,
              pdfStorageIds: lesson.pdfStorageIds.map(String),
            }}
          />
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
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
            {isPending ? <Spinner /> : t("buttons.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
