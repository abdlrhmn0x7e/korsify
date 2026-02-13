"use client";

import type { FaqContent, FaqVariant } from "@/convex/db/storefronts/validators";
import { FaqAccordion } from "./faq/faq-accordion";
import { FaqTwoColumn } from "./faq/faq-two-column";

interface FaqSectionProps {
  content: FaqContent;
  variant: FaqVariant;
}

export function FaqSection({ content, variant }: FaqSectionProps) {
  switch (variant) {
    case "two-column":
      return <FaqTwoColumn content={content} />;
    case "accordion":
    default:
      return <FaqAccordion content={content} />;
  }
}
