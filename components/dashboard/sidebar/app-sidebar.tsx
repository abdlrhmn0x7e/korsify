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
import { Logo } from "@/components/logo";
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
  secondary?: (NavItem & {
    icon: React.ReactNode;
    component?: React.ComponentProps<typeof SidebarMenuButton>["render"];
  })[];
}

export function AppSidebar({ data, secondary, ...props }: AppSidebarProps) {
  const { open } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 border-b p-0">
        <div
          className={cn(
            "h-full flex items-center justify-between bg-background py-2 px-4",
            open ? "justify-between" : "justify-center p-0"
          )}
        >
          <Logo withText={open} size="sm" />
          <SidebarTrigger
            className={cn(
              "transition-opacity duration-200",
              open ? "flex opacity-50" : "hidden opacity-0"
            )}
            size="icon-xs"
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
                      className="h-8"
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

      <SidebarFooter className="px-4 pt-4 pb-3 border-t">
        <SidebarMenu>
          {secondary?.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={
                  item.component ? item.component : <Link href={item.url} />
                }
                size="sm"
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <NavUser />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
