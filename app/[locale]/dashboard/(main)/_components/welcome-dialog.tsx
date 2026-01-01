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
import { useScopedI18n } from "@/locales/client";

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

function CarouselNavigation({
  onComplete,
  slidesCount,
}: {
  onComplete: () => void;
  slidesCount: number;
}) {
  const t = useScopedI18n("components.welcomeDialog.buttons");
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

  const isLastSlide = selectedIndex === slidesCount - 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="ghost"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="min-w-24"
      >
        {t("previous")}
      </Button>

      <CarouselDots />

      {isLastSlide ? (
        <Button onClick={onComplete} className="min-w-24">
          {t("getStarted")}
        </Button>
      ) : (
        <Button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="min-w-24"
        >
          {t("next")}
        </Button>
      )}
    </div>
  );
}

export function WelcomeDialog() {
  const t = useScopedI18n("components.welcomeDialog");
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage(
    "korsify-welcome-seen",
    false,
    { initializeWithValue: false }
  );
  const [open, setOpen] = React.useState(!hasSeenWelcome);

  const SLIDES = [
    {
      title: t("slides.0.title"),
      description: t("slides.0.description"),
      image: "/images/logo-transparent.svg",
    },
    {
      title: t("slides.1.title"),
      description: t("slides.1.description"),
      image: "/images/logo-transparent.svg",
    },
    {
      title: t("slides.2.title"),
      description: t("slides.2.description"),
      image: "/images/logo-transparent.svg",
    },
    {
      title: t("slides.3.title"),
      description: t("slides.3.description"),
      image: "/images/logo-transparent.svg",
    },
    {
      title: t("slides.4.title"),
      description: t("slides.4.description"),
      image: "/images/logo-transparent.svg",
    },
  ];

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
            {SLIDES.map((slide, index) => (
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
                      <DialogTitle className="text-xl">{slide.title}</DialogTitle>
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
            <CarouselNavigation
              onComplete={handleComplete}
              slidesCount={SLIDES.length}
            />
          </div>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
