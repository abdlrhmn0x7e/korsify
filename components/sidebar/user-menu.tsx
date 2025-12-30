"use client";

import { IconLogout, IconDots } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "../ui/button";

export function NavUser() {
  const { data, isPending } = authClient.useSession();
  const { isMobile } = useSidebar();

  if (isPending) {
    return <Skeleton className="h-12 w-full" />;
  }

  if (!data) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                variant="outline"
                className={buttonVariants({
                  variant: "outline",
                  className: "h-9 px-1 justify-start",
                })}
              />
            }
          >
            <Avatar className="size-6 rounded-sm after:rounded-sm">
              <AvatarImage
                src={data.user.image ?? undefined}
                alt={data.user.name}
                className={"rounded-sm"}
              />
              <AvatarFallback>{data.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-between w-full pe-2">
              <span className="truncate font-medium text-xs">
                {data.user.name}
              </span>
              <IconDots className="size-2 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={data.user.image ?? undefined}
                      alt={data.user.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {data.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
