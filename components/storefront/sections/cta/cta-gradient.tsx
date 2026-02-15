import type { CtaContent } from "@/convex/db/storefronts/validators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LazyBackgroundImage } from "@/components/lazy-storage-image";

interface CtaGradientProps {
  content: CtaContent;
}

export function CtaGradient({ content }: CtaGradientProps) {
  const { headline, subheadline, buttonText, buttonLink, backgroundImageStorageId } = content;

  return (
    <section className="relative py-24 px-4 @3xl:px-8 bg-primary overflow-hidden">
      <LazyBackgroundImage
        storageId={backgroundImageStorageId}
        className="absolute inset-0 z-0 opacity-10 mix-blend-overlay"
      />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl @3xl:text-5xl font-bold tracking-tight text-white">
          {headline}
        </h2>
        
        {subheadline && (
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
        
        <div className="flex flex-col @sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 w-full @sm:w-auto"
            render={<Link href={buttonLink} />}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
