import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { HeroContent } from "@/convex/db/storefronts/validators";
import { LazyBackgroundImage } from "@/components/lazy-storage-image";

interface HeroCenteredProps {
  content: HeroContent;
}

export function HeroCentered({ content }: HeroCenteredProps) {
  const { headline, subheadline, ctaText, ctaLink, backgroundImageStorageId } =
    content;

  return (
    <LazyBackgroundImage
      storageId={backgroundImageStorageId}
      className="relative py-12 lg:py-20 overflow-hidden"
      fallbackClassName="bg-muted/30"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
        <header className="mx-auto flex max-w-3xl flex-col gap-4">
          <h1 className="font-heading text-4xl text-balance lg:text-5xl lg:leading-14">
            {headline}
          </h1>
          <p className="text-muted-foreground text-balance lg:text-lg">
            {subheadline}
          </p>
        </header>

        <div className="mt-8 flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-center">
          <Button
            render={<Link href={ctaLink} />}
            className="w-full sm:w-auto"
            size="lg"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </LazyBackgroundImage>
  );
}
