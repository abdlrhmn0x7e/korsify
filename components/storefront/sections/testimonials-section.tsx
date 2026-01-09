"use client";

import type {
  TestimonialsContent,
  TestimonialsVariant,
  TestimonialItem,
} from "@/convex/db/storefronts/validators";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconQuote, IconStar } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { useInView } from "react-intersection-observer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TestimonialsSectionProps {
  content: TestimonialsContent;
  variant: TestimonialsVariant;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-yellow-400">
      {Array.from({ length: rating }).map((_, i) => (
        <IconStar key={i} className="w-4 h-4 fill-current" />
      ))}
    </div>
  );
}

interface LazyAvatarProps {
  storageId: Id<"_storage"> | undefined;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

function LazyAvatar({ storageId, name, className, fallbackClassName }: LazyAvatarProps) {
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
        <AvatarFallback className={fallbackClassName}>{name[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <LazyAvatar storageId={item.avatarStorageId} name={item.name} />
          <div>
            <div className="font-semibold">{item.name}</div>
            {item.role && (
              <div className="text-sm text-muted-foreground">
                {item.role}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.rating && <StarRating rating={item.rating} />}
        <p className="text-muted-foreground italic">{`"${item.content}"`}</p>
      </CardContent>
    </Card>
  );
}

function QuoteCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="relative p-8 bg-background rounded-lg shadow-sm">
      <IconQuote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
      <div className="pt-6 space-y-4">
        <p className="text-lg text-muted-foreground italic">
          {`"${item.content}"`}
        </p>
        <div className="flex items-center gap-3 pt-4">
          <LazyAvatar 
            storageId={item.avatarStorageId} 
            name={item.name} 
            className="w-10 h-10" 
          />
          <div>
            <div className="font-semibold">{item.name}</div>
            {item.role && (
              <div className="text-sm text-muted-foreground">
                {item.role}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselItem({ item }: { item: TestimonialItem }) {
  return (
    <div className="text-center space-y-6">
      <LazyAvatar 
        storageId={item.avatarStorageId} 
        name={item.name} 
        className="w-20 h-20 mx-auto" 
        fallbackClassName="text-2xl"
      />
      <p className="text-xl text-muted-foreground italic max-w-2xl mx-auto">
        {`"${item.content}"`}
      </p>
      <div>
        <div className="font-semibold text-lg">{item.name}</div>
        {item.role && (
          <div className="text-muted-foreground">{item.role}</div>
        )}
      </div>
      {item.rating && (
        <div className="flex justify-center">
          <StarRating rating={item.rating} />
        </div>
      )}
    </div>
  );
}

export function TestimonialsSection({
  content,
  variant,
}: TestimonialsSectionProps) {
  const { title, items } = content;

  if (variant === "quotes") {
    return (
      <section className="py-20 px-4 @3xl:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl @3xl:text-4xl font-bold text-center">
            {title}
          </h2>

          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8">
            {items.map((item) => (
              <QuoteCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "carousel") {
    return (
      <section className="py-20 px-4 @3xl:px-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl @3xl:text-4xl font-bold text-center">
            {title}
          </h2>

          <div className="space-y-8">
            {items.slice(0, 1).map((item) => (
              <CarouselItem key={item.id} item={item} />
            ))}
          </div>

          {items.length > 1 && (
            <div className="flex justify-center gap-2">
              {items.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 @3xl:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="text-3xl @3xl:text-4xl font-bold text-center">{title}</h2>

        <div className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 gap-8">
          {items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
