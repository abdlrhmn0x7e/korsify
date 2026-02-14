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

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  duration?: number;
}
export function CoursesCarousel({ courses }: { courses: Array<Course> }) {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const progress = (current * 100) / count;

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
    );
  }

  return (
    <div className="relative w-full">
      <Carousel setApi={setCarouselApi} className="w-full">
        <CarouselContent>
          {courses.map((course, index) => (
            <CarouselItem
              key={`${course._id}-${index}`}
              className="basis-4/5 sm:basis-2/5 xl:basis-3/12"
            >
              <Course course={course} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="top-[calc(100%+1rem)] left-0 size-10 translate-y-0" />
        <CarouselNext className="top-[calc(100%+1rem)] left-3 size-10 translate-x-full translate-y-0" />
      </Carousel>
      <Progress value={progress} className="mt-6 ml-auto w-24" />
    </div>
  );
}

const Course = ({ course }: { course: Course }) => (
  <Link href="#" className="group">
    <figure className="relative aspect-square w-full overflow-hidden rounded-md object-cover">
      <Image
        fill
        className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
        src={course.imageUrl ?? ""}
        alt={course.title}
      />
      <Badge
        variant="secondary"
        className="absolute end-2 top-2 bg-white/30 dark:bg-black/30"
      >
        {course.price}
      </Badge>
    </figure>
    <div className="mt-3 space-y-0.5">
      <p className="font-medium">{course.title}</p>
      <p className="text-muted-foreground">{course.price}</p>
    </div>
  </Link>
);
