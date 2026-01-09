import type { CtaContent, CtaVariant } from "@/convex/db/storefronts/validators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LazyBackgroundImage } from "@/components/lazy-storage-image";

interface CtaSectionProps {
  content: CtaContent;
  variant: CtaVariant;
}

export function CtaSection({ content, variant }: CtaSectionProps) {
  const { headline, subheadline, buttonText, buttonLink, showWhatsApp, backgroundImageStorageId } = content;

  if (variant === "simple") {
    return (
      <section className="py-16 px-4 @3xl:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl @3xl:text-4xl font-bold tracking-tight">
            {headline}
          </h2>
          
          {subheadline && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
          
          <div className="flex flex-col @sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" render={<Link href={buttonLink} />}>
              {buttonText}
            </Button>
            
            {showWhatsApp && (
              <Button 
                size="lg" 
                variant="outline" 
                render={<Link href="#" />}
              >
                Chat on WhatsApp
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "image") {
    return (
      <section className="relative py-24 px-4 @3xl:px-8 overflow-hidden">
        <LazyBackgroundImage
          storageId={backgroundImageStorageId}
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/60 z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl @3xl:text-5xl font-bold tracking-tight text-white">
            {headline}
          </h2>
          
          {subheadline && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
          
          <div className="flex flex-col @sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 w-full @sm:w-auto"
              render={<Link href={buttonLink} />}
            >
              {buttonText}
            </Button>
            
            {showWhatsApp && (
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 w-full @sm:w-auto bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
                render={<Link href="#" />}
              >
                Chat on WhatsApp
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

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
          
          {showWhatsApp && (
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 w-full @sm:w-auto bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
              render={<Link href="#" />}
            >
              Chat on WhatsApp
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
