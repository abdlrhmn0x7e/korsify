"use server";

import { type Locale, locales } from "@/locales/config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

export async function changeLanguage(locale: Locale) {
  const localeSchema = z.enum(locales);
  const parsedLocale = await localeSchema.parseAsync(locale);

  const cookieStore = await cookies();
  cookieStore.set("Next-Locale", parsedLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");

  return { ok: true };
}
