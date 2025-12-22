"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";
import {
  type Icon,
  IconHomeFilled,
  IconHome,
  IconTicket,
  IconBook,
} from "@tabler/icons-react";

export type AdminSidebarItem = {
  title: string;
  url: string;
  icon: Icon;
  iconFilled: Icon;
};

const DASHBOARD_ITEMS = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: IconHome,
    iconFilled: IconHomeFilled,
  },
  {
    title: "Tokens",
    url: "/admin/tokens",
    icon: IconTicket,
    iconFilled: IconTicket,
  },
] satisfies AdminSidebarItem[];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offExamples" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          render={<Link href="/" />}
        >
          <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm">
            <IconBook className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Korsify</span>
            <span className="truncate text-xs">Admin</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <NavMain data={DASHBOARD_ITEMS} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
