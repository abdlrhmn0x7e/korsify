"use client";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { CourseForm } from "./course-form";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { CourseFormOnSubmit, slugify } from "./course-form-types";
import { Id } from "@/convex/_generated/dataModel";
import { useDialog } from "@/hooks/use-dialog";
import { useScopedI18n } from "@/locales/client";
import { usePlanLimits } from "@/hooks/use-plan-limits";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddCourseDialogProps {
  variant?: "default" | "outline" | "ghost";
}

export function AddCourseDialog({ variant = "outline" }: AddCourseDialogProps) {
  const t = useScopedI18n("dashboard.courses");
  const { props, dismiss } = useDialog();
  const { canCreateCourse, limits, usage } = usePlanLimits();

  const { mutateAsync: createCourse, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.courses.mutations.create),
    onSuccess: () => {
      toast.success(t("createSuccess.title"), {
        description: t("createSuccess.description"),
      });
    },
    onError: (error) => {
      toast.error(t("createError.title"), {
        description:
          error instanceof Error ? error.message : t("createError.description"),
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

  if (!canCreateCourse) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant={variant} disabled>
              {t("addCourse")}
              <IconPlus />
            </Button>
          }
        />
        <TooltipContent>
          {t("limits.maxCoursesReached")}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Dialog {...props}>
      <DialogTrigger render={<Button variant={variant} />}>
        {t("addCourse")}
        <IconPlus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden">
        <CourseForm isPending={isPending} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
