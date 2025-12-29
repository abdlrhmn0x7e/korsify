"use client";

import * as React from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const WELCOME_SLIDES = [
  {
    title: "Welcome to Korsify!",
    description:
      "Your all-in-one platform for creating and selling courses. Let's take a quick tour of what you can do.",
    image: "/images/logo-transparent.svg",
  },
  {
    title: "Create Your Courses",
    description:
      "Build engaging courses with video lessons, PDFs, and more. Organize content into modules and track student progress.",
    image: "/images/logo-transparent.svg",
  },
  {
    title: "Manage Students",
    description:
      "View enrollments, track payments, and communicate with your students all in one place.",
    image: "/images/logo-transparent.svg",
  },
  {
    title: "Your Storefront",
    description:
      "Customize your branded storefront with your own subdomain. Showcase your courses to the world.",
    image: "/images/logo-transparent.svg",
  },
  {
    title: "You're All Set!",
    description:
      "Start creating your first course and grow your teaching business. We're here to help you succeed.",
    image: "/images/logo-transparent.svg",
  },
];

function CarouselDots() {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!api) return;

    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="flex items-center justify-center gap-1.5">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          className={cn(
            "size-2 rounded-full transition-colors",
            index === selectedIndex
              ? "bg-primary"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          )}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

function CarouselNavigation({ onComplete }: { onComplete: () => void }) {
  const { api, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const isLastSlide = selectedIndex === WELCOME_SLIDES.length - 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="ghost"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="min-w-24"
      >
        Previous
      </Button>

      <CarouselDots />

      {isLastSlide ? (
        <Button onClick={onComplete} className="min-w-24">
          Get Started
        </Button>
      ) : (
        <Button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="min-w-24"
        >
          Next
        </Button>
      )}
    </div>
  );
}

export function WelcomeDialog() {
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage(
    "korsify-welcome-seen",
    false,
    { initializeWithValue: false }
  );
  const [open, setOpen] = React.useState(!hasSeenWelcome);

  const handleComplete = () => {
    setHasSeenWelcome(true);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setHasSeenWelcome(true);
    }
  };

  if (hasSeenWelcome) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <Carousel opts={{ watchDrag: false, duration: 0 }}>
          <CarouselContent className="m-0">
            {WELCOME_SLIDES.map((slide, index) => (
              <CarouselItem key={index} className="p-0">
                <div className="flex flex-col">
                  <div className="bg-muted flex h-64 items-center justify-center m-2 rounded-md">
                    <Image
                      width={100}
                      height={100}
                      src={slide.image}
                      alt={slide.title}
                      className="h-24 w-24 object-contain"
                    />
                  </div>

                  <div className="p-6">
                    <DialogHeader className="text-center">
                      <DialogTitle className="text-xl">
                        {slide.title}
                      </DialogTitle>
                      <DialogDescription className="text-sm leading-relaxed">
                        {slide.description}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="border-t p-4">
            <CarouselNavigation onComplete={handleComplete} />
          </div>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
