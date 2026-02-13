"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type {
  TestimonialsContent,
  TestimonialItem,
} from "@/convex/db/storefronts/validators";
import { useQuery } from "convex/react";
import { useInView } from "react-intersection-observer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TestimonialsCarouselProps {
  content: TestimonialsContent;
}

interface LazyAvatarProps {
  storageId: Id<"_storage"> | undefined;
  name: string;
  className?: string;
}

function LazyAvatar({ storageId, name, className }: LazyAvatarProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  const url = useQuery(
    api.teachers.storefront.getStorageUrl,
    inView && storageId ? { storageId } : "skip"
  );

  return (
    <div ref={ref} className="inline-block">
      <Avatar className={className}>
        <AvatarImage src={url ?? undefined} />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export function TestimonialsCarousel({ content }: TestimonialsCarouselProps) {
  const { title, items } = content;

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <header className="mx-auto max-w-xl space-y-2 text-center">
          <h2 className="font-heading text-4xl text-balance sm:text-4xl">
            {title}
          </h2>
        </header>
        <div className="mx-auto max-w-5xl py-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {items.map((item: TestimonialItem) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="flex h-full flex-col">
                    <CardContent className="flex grow flex-col items-center justify-center p-6 text-center">
                      <blockquote className="text-lg leading-snug lg:leading-normal">
                        &ldquo;{item.content}&rdquo;
                      </blockquote>
                      <div className="mt-6 flex flex-col items-center">
                        <LazyAvatar
                          storageId={item.avatarStorageId}
                          name={item.name}
                          className="size-12 border"
                        />
                        <div className="mt-4">
                          <div className="font-semibold">{item.name}</div>
                          {item.role && (
                            <div className="text-muted-foreground text-sm">
                              {item.role}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
