import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  getTeacherFromHeaders,
  getStudentToken,
} from "@/lib/student-auth-server";
import { TeacherContextProvider } from "@/components/storefront/teacher-context-provider";
import { StudentAuthProvider } from "./_components/student-auth-provider";
import { getStorefrontCssVariables } from "@/lib/storefront-style";
import {
  defaultStorefrontTypography,
  StorefrontStyle,
} from "@/convex/db/storefronts/validators";

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

  const theme = storefrontConfig?.theme || "light";
  const style = storefrontConfig?.style || {
    fontPair: "geist-geist",
    buttonStyle: "rounded",
    borderRadius: "0.5rem",
    typography: defaultStorefrontTypography,
  };
  const cssVariables = getStorefrontCssVariables({
    primaryColor,
    theme,
    style: style as StorefrontStyle,
    cssVariables: storefrontConfig?.cssVariables,
  });

  return (
    <StudentAuthProvider initialToken={initialToken}>
      <TeacherContextProvider teacher={teacher}>
        <div
          className={`storefront-shell min-h-screen ${theme === "dark" ? "dark" : ""}`}
          style={cssVariables as React.CSSProperties}
        >
          <main>{children}</main>
        </div>
      </TeacherContextProvider>
    </StudentAuthProvider>
  );
}
