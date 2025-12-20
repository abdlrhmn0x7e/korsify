"use server";

import { type Locale, locales } from "@/i18n/config";
import { cookies } from "next/headers";
import { z } from "zod";

export async function changeLanguage(locale: Locale) {
  const localeSchema = z.enum(locales);
  const parsedLocale = await localeSchema.parseAsync(locale);

  const cookieStore = await cookies();
  cookieStore.set("locale", parsedLocale);

  return { ok: true };
}
