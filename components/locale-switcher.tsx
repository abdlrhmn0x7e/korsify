"use client";

import { useTransition } from "react";
import { toast } from "sonner";

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
import { changeLanguage } from "@/actions/change-language";
import { Locale, locales } from "@/i18n/config";

type Props = {
  className?: string;
  defaultLocale?: Locale;
};

const localeNames = {
  en: "English",
  ar: "العربية",
};

export function LocaleSwitcherSelect({
  className,
  defaultLocale = "en",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
      value={defaultLocale}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          "border-none shadow-none hover:bg-slate-100 transition-colors cursor-pointer",
          className
        )}
      >
        <IconWorld />
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
