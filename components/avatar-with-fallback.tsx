import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IconUser } from "@tabler/icons-react";

export function AvatarWithFallback({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={src} />
      <AvatarFallback>
        <IconUser className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}
