"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { IconApertureOff } from "@tabler/icons-react";

export function SuspendableImage({
  src,
  alt,
  isPriority = false,
  ...props
}: {
  src: string;
  alt: string;
  isPriority?: boolean;
} & React.ComponentProps<typeof Image>) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // if the component is remounted and loading is set to true, and src didn't change, set it to false
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading((prev) => !prev);
  }, []);

  if (hasError) {
    return (
      <div className="bg-muted flex size-full flex-col items-center justify-center gap-3 rounded-lg">
        <IconApertureOff className="size-8" />
        <div className="text-muted-foreground text-center">
          <div className="text-sm">Failed to load image</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <Skeleton className="size-full rounded-none" />}

      <Image
        src={src}
        alt={alt}
        priority={isPriority}
        className={cn(
          "size-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </>
  );
}
