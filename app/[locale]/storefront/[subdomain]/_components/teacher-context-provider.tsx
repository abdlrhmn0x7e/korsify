"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { createContext, useContext } from "react";

interface TeacherContextProviderProps {
  children: React.ReactNode;
  teacher: Doc<"teachers">;
}

const TeacherContext = createContext<Doc<"teachers"> | null>(null);

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
