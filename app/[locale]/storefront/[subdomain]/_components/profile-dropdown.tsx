"use client";

import { AvatarWithFallback } from "@/components/avatar-with-fallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { studentAuthClient } from "@/lib/student-auth-client";
import { useRouter } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";

export function ProfileDropdown({
  name,
  email,
  photoUrl,
  className,
}: {
  name: string;
  email: string;
  photoUrl: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <AvatarWithFallback src={photoUrl} className={className} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-46">
        <DropdownMenuGroup className="px-2">
          <p className="text-sm font-medium">{name}</p>
          <p className="mt-0 text-muted-foreground line-clamp-1 text-xs">
            {email}
          </p>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={async () => {
              await Promise.all([
                studentAuthClient.signOut(),
                router.push("/"),
              ]);
            }}
          >
            <IconLogout />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
