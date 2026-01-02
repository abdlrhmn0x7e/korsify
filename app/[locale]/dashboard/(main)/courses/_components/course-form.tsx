"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconSend } from "@tabler/icons-react";
import { motion, MotionConfig } from "motion/react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useStep } from "usehooks-ts";

import { DirectedArrow } from "@/components/directed-arrow";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import {
  CourseFormContext,
  useCourseFormSchema,
  DEFAULT_FORM_VALUES,
  STEP_IDS,
  type CourseFormValues,
  type Step,
} from "./course-form-types";
import { BasicsStep } from "./steps/basics-step";
import { DescriptionStep } from "./steps/description-step";
import { PublishSettingsStep } from "./steps/publish-settings-step";
import { useScopedI18n } from "@/locales/client";

type CourseWithThumbnail = Doc<"courses"> & { thumbnailUrl: string | null };

interface CourseFormProps {
  course?: CourseWithThumbnail;
  isPending: boolean;
  onSubmit: (
    values: CourseFormValues,
    options?: { onSuccess?: () => void }
  ) => void;
}

function getDefaultValues(course?: CourseWithThumbnail): CourseFormValues {
  if (!course) return DEFAULT_FORM_VALUES;

  return {
    title: course.title,
    thumbnailStorageId: course.thumbnailStorageId,
    thumbnailPreviewUrl: course.thumbnailUrl ?? undefined,
    description: course.description,
    slug: course.slug,
    isSlugAvailable: true,
    price: course.pricing.price,
    overridePrice: course.pricing.overridePrice,
    metaTitle: course.seo?.metaTitle ?? "",
    metaDescription: course.seo?.metaDescription ?? "",
  };
}

export function CourseForm({ course, isPending, onSubmit }: CourseFormProps) {
  const t = useScopedI18n("dashboard.courses.form");
  const courseFormSchema = useCourseFormSchema();

  const STEPS: Step[] = [
    {
      id: STEP_IDS.BASICS,
      title: t("steps.basics.title"),
      description: t("steps.basics.description"),
      fields: ["title", "thumbnailStorageId"],
      component: BasicsStep,
    },
    {
      id: STEP_IDS.DESCRIPTION,
      title: t("steps.description.title"),
      description: t("steps.description.description"),
      fields: ["description"],
      component: DescriptionStep,
    },
    {
      id: STEP_IDS.PUBLISH,
      title: t("steps.publish.title"),
      description: t("steps.publish.description"),
      fields: [
        "slug",
        "price",
        "overridePrice",
        "metaTitle",
        "metaDescription",
      ],
      component: PublishSettingsStep,
    },
  ];

  const [currentStep, stepHelpers] = useStep(STEPS.length);
  const mode = course ? ("edit" as const) : ("create" as const);

  const formDefaultValues = useMemo(() => getDefaultValues(course), [course]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const contextValue = useMemo(
    () => ({
      mode,
      courseId: course?._id,
      originalSlug: course?.slug,
    }),
    [mode, course?._id, course?.slug]
  );

  const activeStep = STEPS[currentStep - 1];

  async function handleNext() {
    const isValid = await form.trigger(activeStep?.fields);
    if (!isValid) return;

    if (!stepHelpers.canGoToNextStep) {
      const isSlugAvailable = form.getValues("isSlugAvailable");
      if (!isSlugAvailable) {
        toast.error(t("errors.slugUnavailable.title"), {
          description: t("errors.slugUnavailable.description"),
        });
        return;
      }
      await form.handleSubmit(handleSubmit)();
      return;
    }

    stepHelpers.goToNextStep();
  }

  function handlePrevious() {
    if (!stepHelpers.canGoToPrevStep) return;
    stepHelpers.goToPrevStep();
  }

  function handleClose() {
    // Reset form and step after dialog closes
    setTimeout(() => {
      form.reset(DEFAULT_FORM_VALUES);
      stepHelpers.setStep(1);
    }, 200);
  }

  function handleSubmit(values: CourseFormValues) {
    onSubmit(values, {
      onSuccess: handleClose,
    });
  }

  return (
    <CourseFormContext.Provider value={contextValue}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="contents">
          <MotionConfig
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 h-[75svh]">
              {/* Left sidebar - Step navigation */}
              <div className="flex flex-col gap-2 border-e bg-muted/30 p-4">
                <h5 className="font-semibold text-lg mb-2">
                  {mode === "edit" ? t("editTitle") : t("createTitle")}
                </h5>
                {STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      // Only allow going to completed or current steps
                      if (idx + 1 <= currentStep) {
                        stepHelpers.setStep(idx + 1);
                      }
                    }}
                    disabled={idx + 1 > currentStep}
                    className={cn(
                      "relative py-2 px-3 text-start rounded-lg transition-colors",
                      idx + 1 > currentStep && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "size-7 rounded-full text-sm flex items-center justify-center font-medium transition-colors",
                          idx + 1 === currentStep
                            ? "bg-primary text-primary-foreground"
                            : idx + 1 < currentStep
                              ? "bg-primary/20 text-primary"
                              : "border text-muted-foreground"
                        )}
                      >
                        {idx + 1 < currentStep ? "✓" : idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {idx + 1 === currentStep && (
                      <motion.div
                        className="absolute inset-0 rounded-lg -z-10 bg-accent"
                        layoutId="step-bg"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Right content area */}
              <div className="col-span-1 sm:col-span-2 flex flex-col h-full overflow-y-auto">
                {/* Step content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <activeStep.component />
                </div>

                {/* Navigation buttons */}
                <div className="border-t bg-muted/30 p-4">
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handlePrevious}
                      disabled={!stepHelpers.canGoToPrevStep || isPending}
                    >
                      <DirectedArrow inverse />
                      <span>{t("buttons.back")}</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isPending}
                      className="min-w-30"
                    >
                      {isPending ? (
                        <Spinner />
                      ) : stepHelpers.canGoToNextStep ? (
                        <>
                          <span>{t("buttons.next")}</span>
                          <DirectedArrow />
                        </>
                      ) : (
                        <>
                          <span>
                            {mode === "edit"
                              ? t("buttons.save")
                              : t("buttons.create")}
                          </span>
                          <IconSend className="size-4 ms-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </MotionConfig>
        </form>
      </FormProvider>
    </CourseFormContext.Provider>
  );
}
