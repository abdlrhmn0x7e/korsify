import { createI18nMiddleware } from "next-international/middleware";
import { locales, defaultLocale } from "@/locales/config";

export const I18nMiddleware = createI18nMiddleware({
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
