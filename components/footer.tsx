import Link from "next/link";
import { Logo } from "./logo";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative pt-16 pb-24 md:py-16 border-t">
      <div className="mx-auto max-w-5xl px-6 flex flex-col items-center justify-center gap-4">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto size-fit flex items-center justify-center gap-2"
        >
          <Logo layout="vertical" />
        </Link>

        <span className="text-muted-foreground block text-center text-sm">
          {t("copyright", { year: new Date().getFullYear() })}
        </span>
      </div>
    </footer>
  );
}
