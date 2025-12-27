"use client";

import { useCurrentLocale } from "@/locales/client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof IconArrowRight> & { inverse?: boolean };

export function DirectedArrow({ inverse = false, ...props }: Props) {
  const locale = useCurrentLocale();
  const isRTL = locale === "ar";

  return isRTL !== inverse ? (
    <IconArrowLeft {...props} />
  ) : (
    <IconArrowRight {...props} />
  );
}
