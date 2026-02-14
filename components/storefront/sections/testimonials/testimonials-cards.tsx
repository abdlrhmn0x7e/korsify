"use client";

import { IconStar } from "@tabler/icons-react";
import { MarqueeEffect } from "@/components/ui/marquee-effect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type {
  TestimonialsContent,
  TestimonialItem,
} from "@/convex/db/storefronts/validators";
import { useQuery } from "convex/react";
import { useInView } from "react-intersection-observer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TestimonialsCardsProps {
  content: TestimonialsContent;
}

interface LazyAvatarProps {
  storageId: Id<"_storage"> | undefined;
  name: string;
}

function LazyAvatar({ storageId, name }: LazyAvatarProps) {
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
      <Avatar>
        <AvatarImage src={url ?? undefined} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <IconStar key={i} className="size-4 fill-orange-500 text-orange-500" />
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="bg-muted/50 hover:bg-muted mb-4 flex w-50 cursor-pointer flex-col items-center justify-between gap-4 rounded-lg p-4 transition-colors lg:w-105">
      <div className="text-muted-foreground space-y-4">
        <p>{`"${item.content}"`}</p>
        {item.rating && <StarRating rating={item.rating} />}
      </div>

      <div className="flex w-full items-center justify-start gap-3">
        <LazyAvatar storageId={item.avatarStorageId} name={item.name} />
        <div>
          <p className="text-foreground font-medium">{item.name}</p>
          {item.role && (
            <p className="text-muted-foreground text-xs">{item.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsCards({ content }: TestimonialsCardsProps) {
  const { title, items } = content;

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
          <h3 className="font-heading mt-4 mb-4 text-4xl sm:text-5xl lg:text-balance">
            {title}
          </h3>
        </header>

        <div className="mask-r-from-95% mask-l-from-95%">
          <MarqueeEffect gap={24} speed={30} speedOnHover={1}>
            {items.slice(0, Math.ceil(items.length / 2)).map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </MarqueeEffect>

          {items.length > 1 && (
            <MarqueeEffect gap={24} speed={30} reverse speedOnHover={1}>
              {items.slice(Math.ceil(items.length / 2)).map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </MarqueeEffect>
          )}
        </div>
      </div>
    </section>
  );
}
