"use client";

import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { IconWorld } from "@tabler/icons-react";

import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { changeLanguage } from "@/lib/actions/change-language";
import { Locale, locales } from "@/locales/config";
import { useCurrentLocale } from "@/locales/client";
import { toast } from "sonner";

type Props = {
  className?: string;
  showLocale?: boolean;
};

const localeNames = {
  en: "English",
  ar: "العربية",
};

export function LocaleSwitcherSelect({ className, showLocale = false }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useCurrentLocale();

  function onChange(value: Locale) {
    startTransition(async () => {
      const { error: langError } = await tryCatch(changeLanguage(value));

      if (langError) {
        toast.error("Couldn't change your locale");
        return;
      }

      router.refresh();
    });
  }

  return (
    <Select
      onValueChange={(value) => onChange(value as Locale)}
      value={currentLocale}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          "bg-transparent not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-none dark:bg-transparent dark:hover:bg-accent border-none shadow-none hover:bg-slate-100 transition-colors cursor-pointer",
          className
        )}
      >
        <IconWorld />
        {showLocale && (
          <span className="text-xs">
            {localeNames[currentLocale as "en" | "ar"]}
          </span>
        )}
      </SelectTrigger>

      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {localeNames[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
