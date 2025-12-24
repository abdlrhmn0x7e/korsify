import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // NOTE: this causes every page that calls a useLocale/useTranslations to be dynamic
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? "en") as "en" | "ar";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
