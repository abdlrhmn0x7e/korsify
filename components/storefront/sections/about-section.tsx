import type { AboutContent, AboutVariant } from "@/convex/db/storefronts/validators";
import { AboutSideBySide } from "./about/about-side-by-side";
import { AboutCentered } from "./about/about-centered";
import { AboutStatsFocus } from "./about/about-stats-focus";

interface AboutSectionProps {
  content: AboutContent;
  variant: AboutVariant;
}

export function AboutSection({ content, variant }: AboutSectionProps) {
  switch (variant) {
    case "centered":
      return <AboutCentered content={content} />;
    case "stats-focus":
      return <AboutStatsFocus content={content} />;
    case "side-by-side":
    default:
      return <AboutSideBySide content={content} />;
  }
}
