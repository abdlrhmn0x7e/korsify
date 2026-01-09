import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  getTeacherFromHeaders,
  getStudentToken,
} from "@/lib/student-auth-server";
import { TeacherContextProvider } from "@/components/storefront/teacher-context-provider";
import { StudentAuthProvider } from "./_components/student-auth-provider";
import { FONT_PAIRS } from "@/convex/db/storefronts/templates";

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

function getThemeColors(theme: "light" | "dark" | "soft") {
  switch (theme) {
    case "dark":
      return {
        "--background": "222.2 84% 4.9%",
        "--foreground": "210 40% 98%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
      };
    case "soft":
      return {
        "--background": "30 50% 98%",
        "--foreground": "20 14.3% 4.1%",
        "--muted": "30 30% 92%",
        "--muted-foreground": "25 5.3% 44.7%",
      };
    default:
      return {};
  }
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
  };

  const fontPair = FONT_PAIRS[style.fontPair] || FONT_PAIRS["geist-geist"];
  const themeColors = getThemeColors(theme);

  const cssVariables: Record<string, string> = {
    "--storefront-primary": primaryColor,
    "--font-heading": fontPair.heading,
    "--font-body": fontPair.body,
    "--radius": style.borderRadius || "0.5rem",
    ...themeColors,
    ...(storefrontConfig?.cssVariables || {}),
  };

  return (
    <StudentAuthProvider initialToken={initialToken}>
      <TeacherContextProvider teacher={teacher}>
        <div
          className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}
          style={cssVariables as React.CSSProperties}
        >
          <main>{children}</main>
        </div>
      </TeacherContextProvider>
    </StudentAuthProvider>
  );
}
