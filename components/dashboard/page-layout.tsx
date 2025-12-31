import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PageLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("h-full flex flex-col [*>div]:flex-1", className)}>
      {children}
    </section>
  );
}
