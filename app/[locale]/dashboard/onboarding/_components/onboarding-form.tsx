"use client";

import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import parsePhoneNumber from "libphonenumber-js";
import { MotionConfig, motion } from "motion/react";
import { useEffect, useEffectEvent, useLayoutEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage, useStep } from "usehooks-ts";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { RESERVED_SUBDOMAINS } from "@/lib/subdomain";
import { useScopedI18n } from "@/locales/client";

import { DirectedArrow } from "@/components/directed-arrow";
import { Step as StepComponent } from "./step";
import { BrandingStep } from "./steps/branding-step";
import { PaymentStep } from "./steps/payment-step";
import { ProfileStep } from "./steps/profile-step";
import { SubdomainStep } from "./steps/subdomain-step";
import {
  type OnboardingFormValues,
  type OnboardingStorageData,
  type Step,
  DEFAULT_FORM_VALUES,
  DEFAULT_STORAGE_DATA,
  ONBOARDING_STORAGE_KEY,
} from "./types";

interface OnboardingFormProps {
  onSuccess: () => void;
}

export function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  const tProfile = useScopedI18n("onboarding.steps.profile");
  const tSubdomain = useScopedI18n("onboarding.steps.subdomain");
  const tBranding = useScopedI18n("onboarding.steps.branding");
  const tPayment = useScopedI18n("onboarding.steps.payment");
  const tWizard = useScopedI18n("onboarding.wizard");
  const tRoot = useScopedI18n("onboarding");

  const TOTAL_STEPS = 4;

  const [storedData, setStoredData, removeStoredData] =
    useLocalStorage<OnboardingStorageData>(
      ONBOARDING_STORAGE_KEY,
      DEFAULT_STORAGE_DATA
    );

  const [currentStep, stepHelpers] = useStep(TOTAL_STEPS);

  const restoreStep = useEffectEvent(() => {
    if (storedData.step > 1 && storedData.step <= TOTAL_STEPS) {
      stepHelpers.setStep(storedData.step);
    }
  });
  useLayoutEffect(() => {
    restoreStep();
  }, []);

  useEffect(() => {
    setStoredData((prev) => ({ ...prev, step: currentStep }));
  }, [currentStep, setStoredData]);

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
    defaultValues: { ...DEFAULT_FORM_VALUES, ...storedData.values },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setStoredData((prev) => ({
        ...prev,
        values: values as Partial<OnboardingFormValues>,
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, setStoredData]);

  const { mutateAsync: createTeacher, isPending } = useMutation({
    mutationFn: useConvexMutation(api.teachers.mutations.completeOnboarding),
    onSuccess: () => {
      removeStoredData();
      onSuccess();
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

    stepHelpers.goToNextStep();
  }

  function handlePrevious() {
    if (!stepHelpers.canGoToPrevStep) return;
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
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 max-w-2xl"
      >
        <MotionConfig transition={{ type: "spring", duration: 0.5, bounce: 0 }}>
          <div className="relative border-b">
            <h2 className="sr-only">{tRoot("title")}</h2>
            <div className="flex w-full gap-4 items-center justify-center">
              {steps.map((s, i) => (
                <div key={s.id} className="w-fit px-6 py-3 relative">
                  <StepComponent
                    isCompleted={i + 1 < currentStep}
                    isActive={i + 1 === currentStep}
                    isFuture={i + 1 > currentStep}
                    number={i + 1}
                    title={s.title}
                    className="text-sm"
                  />

                  {i + 1 === currentStep && (
                    <motion.div
                      className="absolute bottom-0 inset-x-0 sm:-inset-x-2 h-px bg-primary"
                      transition={{
                        type: "spring",
                        duration: 0.2,
                        bounce: 0.15,
                      }}
                      layoutId="step-underline"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[45svh] overflow-hidden">
            <p className="sr-only">{activeStep?.description}</p>

            <div className="h-full overflow-y-auto px-2">
              <activeStep.component />
            </div>
          </div>

          <div className="border-t sm:bg-accent/50 p-4 rounded-b-lg">
            <div className="flex w-full justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrevious}
                disabled={!stepHelpers.canGoToPrevStep || isPending}
              >
                <DirectedArrow inverse />
                <span>{tWizard("buttons.back")}</span>
              </Button>

              <Button
                type={stepHelpers.canGoToNextStep ? "button" : "submit"}
                onClick={stepHelpers.canGoToNextStep ? handleNext : undefined}
                disabled={isPending}
                className="min-w-[120px]"
              >
                {isPending ? (
                  <Spinner />
                ) : stepHelpers.canGoToNextStep ? (
                  <>
                    <span>{tWizard("buttons.next")}</span>
                    <DirectedArrow />
                  </>
                ) : (
                  <>
                    <span>{tWizard("buttons.submit")}</span>
                    <IconSend className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </MotionConfig>
      </form>
    </FormProvider>
  );
}
