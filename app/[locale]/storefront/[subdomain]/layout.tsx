import { notFound } from "next/navigation";
import {
  getTeacherFromHeaders,
  getStudentToken,
} from "@/lib/student-auth-server";
import { TeacherContextProvider } from "./_components/teacher-context-provider";
import { StudentAuthProvider } from "./_components/student-auth-provider";

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export default async function StorefrontLayout({
  children,
}: StorefrontLayoutProps) {
  const teacher = await getTeacherFromHeaders();

  if (!teacher || teacher.status !== "active") {
    notFound();
  }

  const primaryColor = teacher.branding?.primaryColor || "#3b82f6";
  const initialToken = await getStudentToken();

  return (
    <StudentAuthProvider initialToken={initialToken}>
      <TeacherContextProvider teacher={teacher}>
        <div
          className="min-h-screen"
          style={
            {
              "--storefront-primary": primaryColor,
            } as React.CSSProperties
          }
        >
          <main>{children}</main>
        </div>
      </TeacherContextProvider>
    </StudentAuthProvider>
  );
}
