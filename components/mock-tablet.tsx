import { PropsWithChildren } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface MockTabletProps {
  className?: string;
  screenClassName?: string;
}

export function MockTablet({
  children,
  className,
  screenClassName,
}: PropsWithChildren<MockTabletProps>) {
  return (
    <div className={cn("mx-auto max-w-xl", className)}>
      <AspectRatio ratio={4 / 3} className="size-full">
        <div className="bg-foreground relative size-full overflow-hidden rounded-[4rem] border p-3">
          <div
            className={cn(
              "dark:bg-background relative size-full overflow-hidden rounded-[calc(4rem-0.75rem)] bg-background pt-12",
              screenClassName
            )}
          >
            {children}
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
