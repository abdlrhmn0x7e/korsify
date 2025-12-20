import { useTranslations } from "next-intl";

export function Logo() {
  const t = useTranslations("common");
  return (
    <span className="font-serif text-zinc-700 text-2xl font-medium">
      {t("logo")}
    </span>
  );
}
