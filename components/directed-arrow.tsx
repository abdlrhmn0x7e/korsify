"use client";

import { useCurrentLocale } from "@/locales/client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof IconArrowRight>;

export function DirectedArrow(props: Props) {
  const locale = useCurrentLocale();
  const isRTL = locale === "ar";

  return isRTL ? <IconArrowLeft {...props} /> : <IconArrowRight {...props} />;
}
