import type { CtaContent, CtaVariant } from "@/convex/db/storefronts/validators";
import { CtaSimple } from "./cta/cta-simple";
import { CtaImage } from "./cta/cta-image";
import { CtaGradient } from "./cta/cta-gradient";

interface CtaSectionProps {
  content: CtaContent;
  variant: CtaVariant;
}

export function CtaSection({ content, variant }: CtaSectionProps) {
  switch (variant) {
    case "image":
      return <CtaImage content={content} />;
    case "gradient":
      return <CtaGradient content={content} />;
    case "simple":
    default:
      return <CtaSimple content={content} />;
  }
}
