import { NextResponse, type NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { fetchAuthQuery } from "../auth-server";
import { api } from "@/convex/_generated/api";
import { locales, defaultLocale } from "@/locales/config";
import type { ParsedRequest } from "../subdomain";

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: "rewrite",
  resolveLocaleFromRequest: (request) => {
    const cookieLocale = request.cookies.get("Next-Locale")?.value;
    if (
      cookieLocale &&
      locales.includes(cookieLocale as (typeof locales)[number])
    ) {
      return cookieLocale as (typeof locales)[number];
    }
    return defaultLocale;
  },
});

export async function AppMiddleware(
  req: NextRequest,
  parsed: ParsedRequest
): Promise<NextResponse> {
  const { path } = parsed;
  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  const isAdminRoute = path.startsWith("/admin");
  const isNotAdmin = user?.role !== "admin";
  
  if (isAdminRoute && isNotAdmin) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return I18nMiddleware(req);
}
