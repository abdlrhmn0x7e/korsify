"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useQueryState, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconSearch,
  IconClock,
  IconBooks,
  IconArrowsShuffle,
  IconX,
} from "@tabler/icons-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface Course {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  price: number;
  duration: number;
  publishedAt: number;
}

interface Translations {
  pageTitle: string;
  pageSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterFree: string;
  filterPaid: string;
  sortNewest: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  sortTitle: string;
  viewCourse: string;
  free: string;
  minutes: string;
  noCoursesTitle: string;
  noCoursesDescription: string;
  noResultsTitle: string;
  noResultsDescription: string;
  clearFilters: string;
  coursesAvailable: string;
}

interface CoursesCatalogProps {
  courses: Array<Course>;
  translations: Translations;
}

type SortOption = "newest" | "price-low" | "price-high" | "title";

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function CoursesCatalog({
  courses,
  translations: t,
}: CoursesCatalogProps) {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredAndSorted = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter((course) =>
        course.title.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.publishedAt - a.publishedAt);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [courses, search, sortBy]);

  const hasActiveFilters = search.trim() !== "" || sortBy !== "newest";

  function clearAllFilters() {
    setSearch("");
    setSortBy("newest");
  }

  // No courses at all
  if (courses.length === 0) {
    return (
      <Container className="py-24">
        <Empty className="border-none">
          <EmptyMedia>
            <div className="relative">
              <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IconBooks className="size-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">0</span>
              </div>
            </div>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>{t.noCoursesTitle}</EmptyTitle>
            <EmptyDescription>{t.noCoursesDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Container>
    );
  }

  return (
    <div className="min-h-[80vh]">
      {/* Hero header with subtle pattern */}
      <div className="relative overflow-hidden border-b border-border/50">
        {/* Decorative grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />

        {/* Radial fade on background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_70%)]" />

        <Container className="relative py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight pb-0!">
              {t.pageTitle}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {t.pageSubtitle}
            </p>
          </motion.div>

          {/* Course count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-6"
          >
            <span className="text-sm text-muted-foreground tabular-nums">
              {courses.length} {t.coursesAvailable}
            </span>
          </motion.div>
        </Container>
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <Container className="py-3 sm:py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Search */}
            <InputGroup className="flex-1 max-w-md">
              <InputGroupInput
                placeholder="Search..."
                size="lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Clear filters */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground"
                  >
                    <IconX className="size-3.5" />
                    {t.clearFilters}
                  </Button>
                </motion.div>
              )}

              {/* Sort dropdown */}
              <Select
                items={[
                  { label: t.sortNewest, value: "newest" },
                  { label: t.sortPriceLow, value: "price-low" },
                  { label: t.sortPriceHigh, value: "price-high" },
                  { label: t.sortTitle, value: "title" },
                ]}
                value={sortBy}
                onValueChange={(val) => setSortBy(val as SortOption)}
              >
                <SelectTrigger className="w-46">
                  <IconArrowsShuffle className="size-3.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="newest">{t.sortNewest}</SelectItem>
                  <SelectItem value="price-low">{t.sortPriceLow}</SelectItem>
                  <SelectItem value="price-high">{t.sortPriceHigh}</SelectItem>
                  <SelectItem value="title">{t.sortTitle}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Course grid */}
      <Container className="py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {filteredAndSorted.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Empty className="border-none py-16">
                <EmptyMedia>
                  <div className="size-16 rounded-xl bg-muted flex items-center justify-center">
                    <IconSearch className="size-7 text-muted-foreground" />
                  </div>
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>{t.noResultsTitle}</EmptyTitle>
                  <EmptyDescription>{t.noResultsDescription}</EmptyDescription>
                </EmptyHeader>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  {t.clearFilters}
                </Button>
              </Empty>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredAndSorted.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  index={index}
                  translations={t}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}

function CourseCard({
  course,
  index,
  translations: t,
}: {
  course: Course;
  index: number;
  translations: Translations;
}) {
  const isFree = course.price === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/courses/${course.slug}`} className="group block h-full">
        <article className="relative h-full overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/4 dark:hover:shadow-black/20">
          {/* Thumbnail */}
          <div className="relative aspect-16/10 overflow-hidden bg-muted">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <IconBooks className="size-12 text-muted-foreground/30" />
              </div>
            )}

            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Price badge - top right */}
            <div className="absolute top-3 end-3">
              <Badge
                variant={isFree ? "default" : "secondary"}
                className={cn(
                  "backdrop-blur-sm font-semibold shadow-sm",
                  isFree
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-background/90 text-foreground border border-border/50"
                )}
              >
                {isFree ? t.free : formatPrice(course.price)}
              </Badge>
            </div>

            {/* View course text - bottom, visible on hover */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-sm font-medium text-white">
                {t.viewCourse} &rarr;
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {course.title}
            </h3>

            {course.duration > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <IconClock className="size-3.5 shrink-0" />
                <span>
                  {formatDuration(course.duration)} {t.minutes}
                </span>
              </div>
            )}
          </div>

          {/* Subtle bottom accent line */}
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-primary scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </article>
      </Link>
    </motion.div>
  );
}
