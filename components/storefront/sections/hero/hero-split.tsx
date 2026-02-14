import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/convex/db/storefronts/validators";
import { LazyStorageImage } from "@/components/lazy-storage-image";

interface HeroSplitProps {
  content: HeroContent;
}

export function HeroSplit({ content }: HeroSplitProps) {
  const { headline, subheadline, ctaText, ctaLink, backgroundImageStorageId } =
    content;

  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-heading my-4 text-4xl text-balance md:text-5xl lg:leading-14">
              {headline}
            </h1>
            <p className="text-muted-foreground mb-8 text-balance lg:text-lg">
              {subheadline}
            </p>
            <div className="flex justify-center gap-2">
              <Button render={<Link href={ctaLink} />} size="lg">
                {ctaText}
              </Button>
            </div>
          </header>

          {backgroundImageStorageId ? (
            <LazyStorageImage
              storageId={backgroundImageStorageId}
              alt={headline}
              className="aspect-square w-full rounded-md"
              fallback={
                <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Image placeholder</span>
                </div>
              }
            />
          ) : (
            <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Image placeholder</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
