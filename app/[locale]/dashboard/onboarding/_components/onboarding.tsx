"use client";

import { AnimatePresence, type Variants, motion } from "motion/react";
import { useLayoutEffect, useState } from "react";

import { useScopedI18n } from "@/locales/client";
import { OnboardingForm } from "./onboarding-form";
import { useRouter } from "next/navigation";

type Phase = "welcome" | "form";

const phaseVariants: Variants = {
  initial: { opacity: 0, y: 40, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -40, filter: "blur(10px)" },
};

const phaseTransition = { duration: 0.3, ease: "easeOut" } as const;

export function Onboarding() {
  const router = useRouter();
  const t = useScopedI18n("onboarding");
  const [phase, setPhase] = useState<Phase>("welcome");

  useLayoutEffect(() => {
    if (phase !== "welcome") return;
    const timeout = setTimeout(() => setPhase("form"), 1500);
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {phase === "welcome" && (
        <motion.div
          key="welcome"
          variants={phaseVariants}
          initial={false}
          animate="animate"
          exit="exit"
          transition={phaseTransition}
          className="flex flex-col items-center justify-center gap-4 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            {t("description")}
          </p>
        </motion.div>
      )}

      {phase === "form" && (
        <motion.div
          key="form"
          variants={phaseVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={phaseTransition}
          className="w-full flex justify-center"
        >
          <OnboardingForm onSuccess={() => router.push("/dashboard")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
