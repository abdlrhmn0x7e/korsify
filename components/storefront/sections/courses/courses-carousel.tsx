"use client";

import { IconPackageOff } from "@tabler/icons-react";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { CoursesContent } from "@/convex/db/storefronts/validators";
import { Button } from "@/components/ui/button";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  duration?: number;
}

interface CoursesCarouselProps {
  content: CoursesContent;
  courses: Array<Course>;
}

export function CoursesCarousel({ content, courses }: CoursesCarouselProps) {
  const { title, subtitle, showPrice, showDuration, viewAllLink } = content;
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const progress = count > 0 ? (current * 100) / count : 0;

  React.useEffect(() => {
    if (!carouselApi) {
      return;
    }
    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  if (courses.length === 0) {
    return (
      <section className="px-4 py-16 @3xl:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold @3xl:text-4xl">{title}</h2>
            {subtitle && (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <Empty className="gap-3">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-12">
                <IconPackageOff />
              </EmptyMedia>
            </EmptyHeader>

            <EmptyTitle className="text-2xl">No courses found</EmptyTitle>
            <EmptyDescription className="text-lg">
              We couldn&apos;t find any courses to display at the moment. Please
              check back later!
            </EmptyDescription>
          </Empty>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 @3xl:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold @3xl:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative w-full">
          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {courses.map((course, index) => (
                <CarouselItem
                  key={`${course._id}-${index}`}
                  className="basis-4/5 sm:basis-2/5 xl:basis-3/12"
                >
                  <Course
                    course={course}
                    showDuration={showDuration}
                    showPrice={showPrice}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-0 top-[calc(100%+1rem)] size-10 translate-y-0" />
            <CarouselNext className="left-3 top-[calc(100%+1rem)] size-10 translate-x-full translate-y-0" />
          </Carousel>
          <Progress value={progress} className="ml-auto mt-6 w-24" />
        </div>

        {viewAllLink && courses.length > 0 && (
          <div className="pt-8 text-center">
            <Button variant="outline" size="lg" render={<Link href="/courses" />}>
              View All Courses
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function Course({
  course,
  showPrice,
  showDuration,
}: {
  course: Course;
  showPrice: boolean;
  showDuration: boolean;
}) {
  return (
    <Link href={`/courses/${course.slug}`} className="group">
      <figure className="relative aspect-square w-full overflow-hidden rounded-md object-cover">
        {course.imageUrl ? (
          <Image
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
            src={course.imageUrl}
            alt={course.title}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            No image
          </div>
        )}
        {showPrice && (
          <Badge
            variant="secondary"
            className="absolute end-2 top-2 bg-white/30 dark:bg-black/30"
          >
            {course.price && course.price > 0 ? `$${course.price}` : "Free"}
          </Badge>
        )}
      </figure>
      <div className="mt-3 space-y-0.5">
        <p className="line-clamp-1 font-medium">{course.title}</p>
        {showDuration && course.duration && (
          <p className="text-muted-foreground">
            {Math.round(course.duration / 60)} mins
          </p>
        )}
      </div>
    </Link>
  );
}
