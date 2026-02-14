import type { HeroContent, HeroVariant } from "@/convex/db/storefronts/validators";
import { HeroCentered } from "./hero/hero-centered";
import { HeroSplit } from "./hero/hero-split";
import { HeroMinimal } from "./hero/hero-minimal";
import { HeroVideo } from "./hero/hero-video";

interface HeroSectionProps {
  content: HeroContent;
  variant: HeroVariant;
  isBuilderPreview?: boolean;
}

export function HeroSection({
  content,
  variant,
  isBuilderPreview = false,
}: HeroSectionProps) {
  switch (variant) {
    case "minimal":
      return <HeroMinimal content={content} />;
    case "split":
      return <HeroSplit content={content} />;
    case "video":
      return <HeroVideo content={content} isBuilderPreview={isBuilderPreview} />;
    case "centered":
    default:
      return <HeroCentered content={content} />;
  }
}
