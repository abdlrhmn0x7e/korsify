import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  getTeacherFromHeaders,
  getStudentToken,
} from "@/lib/student-auth-server";
import { TeacherContextProvider } from "@/components/storefront/teacher-context-provider";
import { StudentAuthProvider } from "./_components/student-auth-provider";
import {
  getStorefrontCssVariables,
  resolveStorefrontStyle,
} from "@/lib/storefront-style";

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

  let storefrontConfig = null;
  try {
    storefrontConfig = await fetchQuery(api.storefront.queries.getStorefront, {
      teacherId: teacher._id,
    });
  } catch {
    storefrontConfig = null;
  }

  const style = resolveStorefrontStyle(
    storefrontConfig?.style ?? {
      fontPair: "geist-geist",
      buttonStyle: "rounded",
    }
  );
  const cssVariables = getStorefrontCssVariables({
    primaryColor,
    style,
    cssVariables: storefrontConfig?.cssVariables,
  });

  return (
    <StudentAuthProvider initialToken={initialToken}>
      <TeacherContextProvider teacher={teacher}>
        <div
          className="storefront-shell min-h-screen"
          style={cssVariables as React.CSSProperties}
        >
          <main>{children}</main>
        </div>
      </TeacherContextProvider>
    </StudentAuthProvider>
  );
}
