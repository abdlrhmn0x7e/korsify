"use client";

import { Logo } from "./logo";
import { useScopedI18n } from "@/locales/client";

export function Footer() {
  const t = useScopedI18n("landing.footer");
  const year = new Date().getFullYear().toString();

  return (
    <footer className="bg-background relative pt-16 pb-24 md:py-16 border-t">
      <div className="mx-auto max-w-5xl px-6 flex flex-col items-center justify-center gap-4">
        <Logo layout="vertical" />

        <span className="text-muted-foreground block text-center text-sm">
          {t("copyright", { year })}
        </span>
      </div>
    </footer>
  );
}
