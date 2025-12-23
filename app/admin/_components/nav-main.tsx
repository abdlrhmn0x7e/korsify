"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { AdminSidebarItem } from "./admin-sidebar";

export function NavMain({ data }: { data: AdminSidebarItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <NavMainItem key={item.title} data={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavMainItem({ data }: { data: AdminSidebarItem }) {
  const pathname = normlaizePathname(usePathname());
  const isRootLink = data.url === "/admin";
  const isActive = isRootLink ? pathname === "/admin" : pathname === data.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        // tooltip={data.title}
        className={cn(
          "border border-transparent",
          isActive &&
            "border-border from-sidebar-accent bg-linear-to-t to-transparent",
        )}
        render={<Link href={data.url} />}
      >
        {isActive ? <data.iconFilled /> : <data.icon />}
        <span>{data.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function normlaizePathname(pathname: string) {
  const path = pathname.split("?")[0]?.split("#")[0];
  return "/" + path?.split("/").filter(Boolean).join("/");
}
