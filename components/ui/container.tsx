import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className, children, ...rest }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4", className)} {...rest}>
      {children}
    </div>
  );
}
