"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "../logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NavUser } from "./user-menu";

export type NavItem = {
  title: string;
  url: string;
  items?: (NavItem & { icon: React.ReactNode })[];
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: NavItem[];
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2 h-16 border-b">
        <div
          className={cn(
            "h-full flex items-center justify-between",
            open ? "justify-between" : "justify-center"
          )}
        >
          <Logo withText={open} textClassName="text-xl" />
          <SidebarTrigger
            className={cn(
              "transition-opacity duration-200",
              open ? "flex opacity-100" : "hidden opacity-0"
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {item.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="h-9"
                      render={<Link href={item.url} />}
                      isActive={pathname === item.url}
                    >
                      {item.icon}
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter className="p-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
