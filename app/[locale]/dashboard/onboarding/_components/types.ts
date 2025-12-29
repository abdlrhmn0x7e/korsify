import type { FieldPath } from "react-hook-form";

export const ONBOARDING_STORAGE_KEY = "korsify_onboarding_draft";

export type OnboardingStorageData = {
  step: number;
  values: Partial<OnboardingFormValues>;
};

export const DEFAULT_STORAGE_DATA: OnboardingStorageData = {
  step: 1,
  values: {},
};

export type OnboardingFormValues = {
  name: string;
  email: string;
  phone: string;
  subdomain: string;
  logoStorageId?: string;
  coverStorageId?: string;
  primaryColor?: string;
  vodafoneCash?: string;
  instaPay?: string;
  instructions?: string;
};

export const DEFAULT_FORM_VALUES: OnboardingFormValues = {
  name: "",
  email: "",
  phone: "",
  subdomain: "",
  logoStorageId: undefined,
  coverStorageId: undefined,
  primaryColor: "#6366f1",
  vodafoneCash: "",
  instaPay: "",
  instructions: "",
};

export type Step = {
  id: string;
  title: string;
  description: string;
  fields: FieldPath<OnboardingFormValues>[];
  component: React.ComponentType;
};

export const stepVariants = {
  initial: (direction: 1 | -1) => ({ x: `${direction * 110}%`, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ x: `${direction * -110}%`, opacity: 0 }),
};
