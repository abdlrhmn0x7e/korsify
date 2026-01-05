import { notFound } from "next/navigation";
import {
  getTeacherFromHeaders,
  getStudentToken,
} from "@/lib/student-auth-server";
import { TeacherContextProvider } from "./_components/teacher-context-provider";
import { StudentAuthProvider } from "./_components/student-auth-provider";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <StorefrontHeader teacher={teacher} />
          <main>{children}</main>
        </div>
      </TeacherContextProvider>
    </StudentAuthProvider>
  );
}

function StorefrontHeader({ teacher }: { teacher: Doc<"teachers"> }) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {teacher.branding?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={teacher.branding.logoUrl}
              alt={teacher.name}
              className="h-8 w-auto"
            />
          )}
          <span className="font-semibold">{teacher.name}</span>
        </div>
        <nav className="flex items-center gap-4">
          {/*eslint-disable-next-line @next/next/no-html-link-for-pages*/}
          <a href="/" className="text-sm hover:underline">
            Home
          </a>
          {/*eslint-disable-next-line @next/next/no-html-link-for-pages*/}
          <a href="/courses" className="text-sm hover:underline">
            Courses
          </a>
          <Button render={<Link href="/signup" />}>Sign up</Button>
        </nav>
      </div>
    </header>
  );
}
