"use client";

import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { createContext, useContext } from "react";

type TeacherWithBranding = NonNullable<
  FunctionReturnType<typeof api.teachers.queries.getBySubdomain>
>;

interface TeacherContextProviderProps {
  children: React.ReactNode;
  teacher: TeacherWithBranding;
}

const TeacherContext = createContext<TeacherWithBranding | null>(null);

export function TeacherContextProvider({
  children,
  teacher,
}: TeacherContextProviderProps) {
  return (
    <TeacherContext.Provider value={teacher}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const teacher = useContext(TeacherContext);

  if (!teacher) {
    throw new Error("UseTeacher must be used within a TeacherContextProvider");
  }

  return teacher;
}
