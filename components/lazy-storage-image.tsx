"use client";

import { useQuery } from "convex/react";
import { useInView } from "react-intersection-observer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ComponentProps } from "react";

interface LazyStorageImageProps extends Omit<ComponentProps<"img">, "src"> {
  storageId: Id<"_storage"> | undefined | null;
  fallback?: React.ReactNode;
}

export function LazyStorageImage({
  storageId,
  className,
  fallback,
  alt = "",
  ...props
}: LazyStorageImageProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  const url = useQuery(
    api.teachers.storefront.getStorageUrl,
    inView && storageId ? { storageId } : "skip"
  );

  if (!storageId) {
    return fallback ?? null;
  }

  const isLoading = !inView || url === undefined;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {isLoading ? (
        <Skeleton className="absolute inset-0" />
      ) : url ? (
        <img
          src={url}
          alt={alt}
          className={cn("w-full h-full object-cover", className)}
          {...props}
        />
      ) : (
        fallback ?? null
      )}
    </div>
  );
}

interface LazyBackgroundImageProps {
  storageId: Id<"_storage"> | undefined | null;
  className?: string;
  children?: React.ReactNode;
  fallbackClassName?: string;
}

export function LazyBackgroundImage({
  storageId,
  className,
  children,
  fallbackClassName,
}: LazyBackgroundImageProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  const url = useQuery(
    api.teachers.storefront.getStorageUrl,
    inView && storageId ? { storageId } : "skip"
  );

  const isLoading = !inView || (storageId && url === undefined);

  return (
    <div
      ref={ref}
      className={cn(
        "bg-cover bg-center",
        isLoading && "animate-pulse bg-muted",
        !url && fallbackClassName,
        className
      )}
      style={url ? { backgroundImage: `url(${url})` } : undefined}
    >
      {children}
    </div>
  );
}
