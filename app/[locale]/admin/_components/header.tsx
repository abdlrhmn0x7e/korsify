import type { Icon } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Header({
  title,
  description,
  Icon,
  className,
}: {
  title: string;
  description: string;
  Icon: Icon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left",
        className,
      )}
    >
      <div className="from-card to-accent rounded-lg bg-radial-[at_50%_75%] p-px">
        <div className="to-card from-accent flex size-10 items-center justify-center rounded-[calc(var(--radius)-2px)] bg-radial-[at_25%_25%]">
          <Icon className="text-foreground size-5" />
        </div>
      </div>

      <div>
        <h3>{title}</h3>
        <p className="text-muted-foreground text-sm m-0">{description}</p>
      </div>
    </div>
  );
}

export function HeaderSkeleton({ Icon }: { Icon: Icon }) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <div className="from-card to-accent rounded-lg bg-radial-[at_50%_75%] p-px">
        <div className="to-card from-accent flex size-10 items-center justify-center rounded-[calc(var(--radius)-2px)] bg-radial-[at_25%_25%]">
          <Icon className="text-foreground size-5" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
