"use client";

import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { createContext, useContext } from "react";

interface TeacherContextProviderProps {
  children: React.ReactNode;
  teacher: FunctionReturnType<typeof api.teachers.queries.getBySubdomain>;
}

const TeacherContext = createContext<FunctionReturnType<
  typeof api.teachers.queries.getBySubdomain
> | null>(null);

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
