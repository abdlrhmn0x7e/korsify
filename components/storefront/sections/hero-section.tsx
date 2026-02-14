import type { HeroContent, HeroVariant } from "@/convex/db/storefronts/validators";
import { HeroCentered } from "./hero/hero-centered";
import { HeroSplit } from "./hero/hero-split";
import { HeroMinimal } from "./hero/hero-minimal";
import { HeroVideo } from "./hero/hero-video";

interface HeroSectionProps {
  content: HeroContent;
  variant: HeroVariant;
}

export function HeroSection({ content, variant }: HeroSectionProps) {
  switch (variant) {
    case "minimal":
      return <HeroMinimal content={content} />;
    case "split":
      return <HeroSplit content={content} />;
    case "video":
      return <HeroVideo content={content} />;
    case "centered":
    default:
      return <HeroCentered content={content} />;
  }
}
