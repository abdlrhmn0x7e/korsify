"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useState } from "react";
import { NavItem } from "./app-sidebar";
import { PathBreadcrumb } from "./path-breadcrumb";
import { usePathname } from "next/navigation";

export default function SidebarLayout({
  data,
  children,
  dir,
  lang,
  ...props
}: {
  data: NavItem[];
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
      <AppSidebar data={data} />

      <SidebarInset className="flex flex-col border">
        <header className="bg-background sticky top-0 flex h-9 shrink-0 items-center gap-2 border-b px-4 m-2 border rounded-md">
          <PathBreadcrumb path={pathname} />
        </header>
        <main className="p-2 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
