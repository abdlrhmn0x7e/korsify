import type { CtaContent, CtaVariant } from "@/convex/db/storefronts/validators";
import { CtaSimple } from "./cta/cta-simple";
import { CtaImage } from "./cta/cta-image";
import { CtaGradient } from "./cta/cta-gradient";

interface CtaSectionProps {
  content: CtaContent;
  variant: CtaVariant;
  whatsappNumber?: string;
}

export function CtaSection({ content, variant, whatsappNumber }: CtaSectionProps) {
  switch (variant) {
    case "image":
      return <CtaImage content={content} whatsappNumber={whatsappNumber} />;
    case "gradient":
      return <CtaGradient content={content} whatsappNumber={whatsappNumber} />;
    case "simple":
    default:
      return <CtaSimple content={content} whatsappNumber={whatsappNumber} />;
  }
}
