"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState, type ReactNode } from "react";
import { OnboardingDialog } from "../onboarding/onboarding-dialog";

type TeacherContextType = {
  teacher: Doc<"teachers">;
  isLoading: boolean;
};

const TeacherContext = createContext<TeacherContextType | null>(null);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: teacher, isPending } = useQuery(
    convexQuery(api.teachers.queries.getTeacher, {})
  );

  const [showOnboarding, setShowOnboarding] = useState(true);

  const needsOnboarding = !isPending && teacher === null;

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    queryClient.invalidateQueries({
      queryKey: convexQuery(api.teachers.queries.getTeacher, {}).queryKey,
    });
  }

  if (isPending) {
    return null;
  }

  if (needsOnboarding && showOnboarding) {
    return (
      <>
        {children}
        <OnboardingDialog open={true} onComplete={handleOnboardingComplete} />
      </>
    );
  }

  if (!teacher) {
    return null;
  }

  return (
    <TeacherContext.Provider value={{ teacher, isLoading: isPending }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within a TeacherProvider");
  }
  return context;
}

export function useTeacherOptional() {
  return useContext(TeacherContext);
}
