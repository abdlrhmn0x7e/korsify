import { IconApertureOff } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SuspendableImage } from "./suspendable-image";
import { memo } from "react";

export const Component = ({
  src,
  alt,
  className,
  ...props
}: {
  src?: string | null;
  alt: string;
  className?: string;
} & Omit<React.ComponentProps<typeof SuspendableImage>, "src" | "alt">) => {
  if (!src) {
    return (
      <div
        className={cn(
          "flex size-8 items-center justify-center overflow-hidden rounded-sm border",
          className
        )}
      >
        <IconApertureOff className="size-3/4 object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "size-8 overflow-hidden rounded-sm border bg-white",
        className
      )}
    >
      <SuspendableImage key={`${src}-${alt}`} src={src} alt={alt} {...props} />
    </div>
  );
};

export const ImageWithFallback = memo(Component);
