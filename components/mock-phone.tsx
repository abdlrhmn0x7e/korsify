import { PropsWithChildren } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface MockPhoneProps {
  className?: string;
  screenClassName?: string;
}

export function MockPhone({
  children,
  className,
  screenClassName,
}: PropsWithChildren<MockPhoneProps>) {
  return (
    <div className={cn("mx-auto max-w-sm", className)}>
      <AspectRatio ratio={9 / 19.5}>
        <div className="bg-foreground relative size-full overflow-hidden rounded-[4rem] border p-3">
          <div className={cn(
            "dark:bg-background relative size-full overflow-hidden rounded-[calc(4rem-0.75rem)] bg-zinc-50 pt-12 pb-6",
            screenClassName
          )}>
            <div className="bg-foreground absolute top-3 left-1/2 z-10 h-8 w-full max-w-32 -translate-x-1/2 rounded-full" />

            {children}
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
