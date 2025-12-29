import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

export function Step({
  isCompleted,
  isActive,
  isFuture,
  number,
  title,
  className,
  ...props
}: {
  isCompleted: boolean;
  isActive: boolean;
  isFuture: boolean;
  number: number;
  title: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 transition-all duration-300",
        isActive && " text-foreground",
        isCompleted && "text-primary",
        isFuture && "text-muted-foreground opacity-60",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex size-5 items-center justify-center rounded-sm text-[10px] font-bold transition-colors",
          isCompleted || isActive
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isCompleted ? <IconCheck className="size-3" stroke={3} /> : number}
      </div>
      <span className="hidden sm:inline">{title}</span>
    </div>
  );
}
