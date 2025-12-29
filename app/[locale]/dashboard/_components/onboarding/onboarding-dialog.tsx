"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import parsePhoneNumber from "libphonenumber-js";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconSend,
} from "@tabler/icons-react";
import { useLocalStorage, useResizeObserver, useStep } from "usehooks-ts";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { useScopedI18n, useCurrentLocale } from "@/locales/client";
import { RESERVED_SUBDOMAINS } from "@/lib/subdomain";
import { cn } from "@/lib/utils";

import { ProfileStep } from "./steps/profile-step";
import { SubdomainStep } from "./steps/subdomain-step";
import { BrandingStep } from "./steps/branding-step";
import { PaymentStep } from "./steps/payment-step";
import {
  type OnboardingFormValues,
  type OnboardingDialogProps,
  type Step,
  DEFAULT_FORM_VALUES,
  ONBOARDING_STORAGE_KEY,
  stepVariants,
} from "./types";

export type { OnboardingFormValues } from "./types";

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const tProfile = useScopedI18n("onboarding.steps.profile");
  const tSubdomain = useScopedI18n("onboarding.steps.subdomain");
  const tBranding = useScopedI18n("onboarding.steps.branding");
  const tPayment = useScopedI18n("onboarding.steps.payment");
  const tWizard = useScopedI18n("onboarding.wizard");
  const tRoot = useScopedI18n("onboarding");

  const locale = useCurrentLocale();
  const isRTL = locale === "ar";

  const TOTAL_STEPS = 4;
  const [currentStep, stepHelpers] = useStep(TOTAL_STEPS);

  const [direction, setDirection] = useState<1 | -1>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const stepIndicatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const [storedFormData, setStoredFormData, removeStoredFormData] =
    useLocalStorage<Partial<OnboardingFormValues>>(ONBOARDING_STORAGE_KEY, {});

  const schema = z
    .object({
      name: z
        .string()
        .min(1, { message: tProfile("errors.nameRequired") })
        .min(2, { message: tProfile("errors.nameMin") }),
      email: z.email({ message: tProfile("errors.emailInvalid") }),
      phone: z
        .string()
        .min(1, { message: tProfile("errors.phoneRequired") })
        .transform((val) =>
          String(parsePhoneNumber(val, { defaultCountry: "EG" })?.number ?? val)
        )
        .refine(
          (val) => parsePhoneNumber(val, { defaultCountry: "EG" })?.isValid(),
          { message: tProfile("errors.phoneInvalid") }
        ),
      subdomain: z
        .string()
        .min(1, { message: tSubdomain("errors.required") })
        .min(3, { message: tSubdomain("errors.minLength") })
        .max(63, { message: tSubdomain("errors.maxLength") })
        .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
          message: tSubdomain("errors.format"),
        })
        .refine((val) => !RESERVED_SUBDOMAINS.has(val), {
          message: tSubdomain("errors.reserved"),
        }),
      logoStorageId: z.string().optional(),
      coverStorageId: z.string().optional(),
      primaryColor: z.string().optional(),
      vodafoneCash: z.string().optional(),
      instaPay: z.string().optional(),
      instructions: z.string().optional(),
    })
    .refine((data) => data.vodafoneCash || data.instaPay, {
      message: tPayment("errors.atLeastOne"),
      path: ["vodafoneCash"],
    });

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...DEFAULT_FORM_VALUES, ...storedFormData },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setStoredFormData(values as Partial<OnboardingFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [form, setStoredFormData]);

  const updateUnderlinePosition = useCallback(() => {
    const activeRef = stepIndicatorRefs.current[currentStep - 1];
    const header = headerRef.current;
    if (!activeRef || !header) return;

    const headerRect = header.getBoundingClientRect();
    const activeRect = activeRef.getBoundingClientRect();

    setUnderlineStyle({
      left: activeRect.left - headerRect.left,
      width: activeRect.width,
    });
  }, [currentStep]);

  useResizeObserver({ ref: headerRef, onResize: updateUnderlinePosition });

  useEffect(() => {
    updateUnderlinePosition();
  }, [updateUnderlinePosition, showSuccess]);

  const { mutateAsync: createTeacher, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.mutations.completeOnboarding),
    onSuccess: () => {
      removeStoredFormData();
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2500);
    },
    onError: () => {
      toast.error(tRoot("error.title"), {
        description: tRoot("error.description"),
      });
    },
  });

  const steps: Step[] = [
    {
      id: "profile",
      title: tProfile("title"),
      description: tProfile("description"),
      fields: ["name", "email", "phone"],
      component: ProfileStep,
    },
    {
      id: "subdomain",
      title: tSubdomain("title"),
      description: tSubdomain("description"),
      fields: ["subdomain"],
      component: SubdomainStep,
    },
    {
      id: "branding",
      title: tBranding("title"),
      description: tBranding("description"),
      fields: ["logoStorageId", "coverStorageId", "primaryColor"],
      component: BrandingStep,
    },
    {
      id: "payment",
      title: tPayment("title"),
      description: tPayment("description"),
      fields: ["vodafoneCash", "instaPay", "instructions"],
      component: PaymentStep,
    },
  ];

  const activeStep = steps[currentStep - 1];

  async function handleNext() {
    if (!stepHelpers.canGoToNextStep) return;

    const isValid = await form.trigger(activeStep?.fields);
    if (!isValid) return;

    setDirection(isRTL ? -1 : 1);
    stepHelpers.goToNextStep();
  }

  function handlePrevious() {
    if (!stepHelpers.canGoToPrevStep) return;
    setDirection(isRTL ? 1 : -1);
    stepHelpers.goToPrevStep();
  }

  async function onSubmit(values: OnboardingFormValues) {
    await createTeacher({
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      subdomain: values.subdomain.toLowerCase().trim(),
      branding: {
        logoStorageId: values.logoStorageId,
        coverStorageId: values.coverStorageId,
        primaryColor: values.primaryColor,
      },
      paymentInfo: {
        vodafoneCash: values.vodafoneCash || undefined,
        instaPay: values.instaPay || undefined,
        instructions: values.instructions || undefined,
      },
    });
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        className="p-0 gap-0 overflow-hidden max-w-3xl"
        size="lg"
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
            <MotionConfig
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            >
              <AlertDialogHeader
                ref={headerRef}
                className=" p-2 relative border-b sm:text-center"
              >
                <AlertDialogTitle className="sr-only">
                  {tRoot("title")}
                </AlertDialogTitle>
                <div className="flex items-center justify-center gap-6 w-full text-sm">
                  {steps.map((s, i) => {
                    const stepNumber = i + 1;
                    const isCompleted = stepNumber < currentStep || showSuccess;
                    const isActive = stepNumber === currentStep && !showSuccess;
                    const isFuture = stepNumber > currentStep && !showSuccess;

                    return (
                      <div
                        key={s.id}
                        ref={(el) => {
                          stepIndicatorRefs.current[i] = el;
                        }}
                        className={cn(
                          "flex items-center gap-2 transition-all duration-300",
                          isActive && "font-medium text-foreground",
                          isCompleted && "text-primary",
                          isFuture && "text-muted-foreground opacity-60"
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-5 items-center justify-center rounded-sm text-[10px] font-bold transition-colors",
                            isCompleted || isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isCompleted ? (
                            <IconCheck className="size-3" stroke={3} />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span className="hidden sm:inline">{s.title}</span>
                      </div>
                    );
                  })}
                </div>

                <motion.div
                  className="absolute bottom-0 h-px bg-primary"
                  animate={{
                    left: underlineStyle.left,
                    width: underlineStyle.width,
                  }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              </AlertDialogHeader>

              <div className="relative h-100 overflow-hidden bg-card">
                <AlertDialogDescription className="sr-only">
                  {activeStep?.description}
                </AlertDialogDescription>

                <AnimatePresence mode="popLayout" custom={direction}>
                  {showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mb-4 text-7xl"
                      >
                        🎉
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-2 text-2xl font-bold"
                      >
                        {tWizard("success.title")}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground max-w-sm"
                      >
                        {tWizard("success.description")}
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentStep}
                      variants={stepVariants}
                      custom={direction}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute inset-0 flex flex-col p-6"
                    >
                      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                        <div className="px-1">
                          <activeStep.component />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!showSuccess && (
                <AlertDialogFooter className="border-t bg-muted/20 p-4">
                  <div className="flex w-full justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handlePrevious}
                      disabled={!stepHelpers.canGoToPrevStep || isPending}
                      className={cn(
                        !stepHelpers.canGoToPrevStep && "invisible"
                      )}
                    >
                      {isRTL ? (
                        <IconArrowRight className="size-4 mr-2" />
                      ) : (
                        <IconArrowLeft className="size-4 mr-2" />
                      )}
                      {tWizard("buttons.back")}
                    </Button>

                    <Button
                      type={stepHelpers.canGoToNextStep ? "button" : "submit"}
                      onClick={
                        stepHelpers.canGoToNextStep ? handleNext : undefined
                      }
                      disabled={isPending}
                      className="min-w-[120px]"
                    >
                      {isPending ? (
                        <Spinner className="mr-2" />
                      ) : stepHelpers.canGoToNextStep ? (
                        <>
                          {tWizard("buttons.next")}
                          {isRTL ? (
                            <IconArrowLeft className="size-4 ml-2" />
                          ) : (
                            <IconArrowRight className="size-4 ml-2" />
                          )}
                        </>
                      ) : (
                        <>
                          {tWizard("buttons.submit")}
                          <IconSend className="size-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDialogFooter>
              )}
            </MotionConfig>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
}
