"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoModal } from "./video-modal";
import type { HeroContent } from "@/convex/db/storefronts/validators";
import { LazyStorageImage } from "@/components/lazy-storage-image";

interface HeroVideoProps {
  content: HeroContent;
}

export function HeroVideo({ content }: HeroVideoProps) {
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
          <figure className="relative">
            {backgroundImageStorageId ? (
              <LazyStorageImage
                storageId={backgroundImageStorageId}
                alt={headline}
                className="aspect-square w-full rounded-md"
                fallback={
                  <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">
                      Video thumbnail
                    </span>
                  </div>
                }
              />
            ) : (
              <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Video thumbnail</span>
              </div>
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <VideoModal videoUrl="" />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
