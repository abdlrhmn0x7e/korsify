import type { HeroContent, HeroVariant } from "@/convex/db/storefronts/validators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LazyStorageImage, LazyBackgroundImage } from "@/components/lazy-storage-image";

interface HeroSectionProps {
  content: HeroContent;
  variant: HeroVariant;
}

export function HeroSection({ content, variant }: HeroSectionProps) {
  const { headline, subheadline, ctaText, ctaLink, backgroundImageStorageId } = content;

  if (variant === "minimal") {
    return (
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {headline}
          </h1>
          <p className="text-lg text-muted-foreground">
            {subheadline}
          </p>
          <div className="pt-2">
            <Button size="lg" render={<Link href={ctaLink} />}>
              {ctaText}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {headline}
            </h1>
            <p className="text-xl text-muted-foreground">
              {subheadline}
            </p>
            <div>
              <Button size="lg" render={<Link href={ctaLink} />}>
                {ctaText}
              </Button>
            </div>
          </div>
          {backgroundImageStorageId ? (
            <LazyStorageImage
              storageId={backgroundImageStorageId}
              alt={headline}
              className="rounded-lg aspect-video"
              fallback={
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <span className="text-muted-foreground">Image placeholder</span>
                </div>
              }
            />
          ) : (
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
              <span className="text-muted-foreground">Image placeholder</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <LazyBackgroundImage
      storageId={backgroundImageStorageId}
      className="relative py-20 px-4 md:px-8 overflow-hidden"
      fallbackClassName="bg-muted/30"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {headline}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subheadline}
        </p>
        <div className="pt-4">
          <Button size="lg" className="text-lg px-8" render={<Link href={ctaLink} />}>
            {ctaText}
          </Button>
        </div>
      </div>
    </LazyBackgroundImage>
  );
}
