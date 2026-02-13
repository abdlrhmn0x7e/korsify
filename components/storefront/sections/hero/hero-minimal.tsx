import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/convex/db/storefronts/validators";

interface HeroMinimalProps {
  content: HeroContent;
}

export function HeroMinimal({ content }: HeroMinimalProps) {
  const { headline, subheadline, ctaText, ctaLink } = content;

  return (
    <section className="py-16 px-4 @3xl:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-3xl @3xl:text-5xl font-bold tracking-tight">
          {headline}
        </h1>
        <p className="text-lg text-muted-foreground">{subheadline}</p>
        <div className="pt-2">
          <Button size="lg" render={<Link href={ctaLink} />}>
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}
