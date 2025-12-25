import { NextResponse, type NextRequest } from "next/server";
import { fetchAuthQuery } from "./lib/auth-server";
import { createI18nMiddleware } from "next-international/middleware";
import { api } from "./convex/_generated/api";
import { locales, defaultLocale } from "./locales/config";

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

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  // Return not found if the user trying to access an admin route without proper authentication
  if (user?.role !== "admin" && path.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return I18nMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
