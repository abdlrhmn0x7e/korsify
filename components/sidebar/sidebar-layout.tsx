"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useState } from "react";
import { NavItem } from "./app-sidebar";
import { cn } from "@/lib/utils";
import { PathBreadcrumb } from "./path-breadcrumb";
import { usePathname } from "next/navigation";
import { LocaleSwitcherSelect } from "../locale-switcher";

export default function SidebarLayout({
  data,
  secondary,
  children,
  dir,
  lang,
  ...props
}: {
  data: NavItem[];
  secondary?: (NavItem & { icon: React.ReactNode })[];
  children: React.ReactNode;
  dir?: "ltr" | "rtl";
  lang?: string;
} & React.ComponentProps<typeof SidebarProvider>) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      dir={dir}
      lang={lang}
      {...props}
    >
      <AppSidebar
        data={data}
        secondary={secondary}
        side={dir === "rtl" ? "right" : "left"}
      />

      <SidebarInset className="flex flex-col md:peer-data-[variant=inset]:shadow-2xs">
        <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center justify-between gap-2 border-b px-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger
              className={cn(
                "transition-opacity duration-200",
                !open ? "flex opacity-50" : "hidden opacity-0",
              )}
              size="icon-sm"
            />
            <PathBreadcrumb path={pathname} />
          </div>

          <LocaleSwitcherSelect className="w-fit" showLocale />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
